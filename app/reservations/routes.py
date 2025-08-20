from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from datetime import datetime, date
from sqlalchemy import func, select
from sqlalchemy.orm import joinedload
from .. import db, csrf
from ..models import TimeSlot, Reservation, Restaurant, Course

bp = Blueprint("reservations", __name__, url_prefix="/api")

# ---------- Timeslot一覧 ----------
@bp.get("/timeslots")
def list_timeslots():
    """
    指定日の各タイムスロットの残枠（remaining）を返す。
    パラメータ:
      - date=YYYY-MM-DD （省略時は全スロット/remainingはNone）
      - restaurant_id（省略時は全レストラン）
    """
    date_param = request.args.get("date")
    restaurant_id = request.args.get("restaurant_id", type=int)

    q = TimeSlot.query
    if restaurant_id:
        q = q.filter(TimeSlot.restaurant_id == restaurant_id)
    q = q.order_by(TimeSlot.start_time.asc())
    slots = q.all()

    # 日付指定がなければ従来どおり
    if not date_param:
        return jsonify([
            {
                "id": t.id,
                "restaurant_id": t.restaurant_id,
                "start_time": t.start_time.strftime("%H:%M"),
                "end_time": t.end_time.strftime("%H:%M"),
                "capacity": t.capacity,
                "remaining": None,
            }
            for t in slots
        ])

    # 日付指定あり：予約の使用数をまとめて集計
    try:
        target_date = datetime.strptime(date_param, "%Y-%m-%d").date()
    except Exception:
        return jsonify({"error": "invalid_date"}), 400

    # timeslot_id -> used を一括で作る
    used_rows = db.session.execute(
        select(
            Reservation.timeslot_id,
            func.coalesce(func.sum(Reservation.party_size), 0).label("used")
        ).where(
            Reservation.date == target_date,
            Reservation.status == "booked",
            *( [Reservation.restaurant_id == restaurant_id] if restaurant_id else [] )
        ).group_by(Reservation.timeslot_id)
    ).all()
    used_map = {ts_id: int(used) for ts_id, used in used_rows}

    return jsonify([
        {
            "id": t.id,
            "restaurant_id": t.restaurant_id,
            "start_time": t.start_time.strftime("%H:%M"),
            "end_time": t.end_time.strftime("%H:%M"),
            "capacity": t.capacity,
            "remaining": max(t.capacity - used_map.get(t.id, 0), 0),
        }
        for t in slots
    ])

# ---------- 予約作成 ----------
@csrf.exempt
@bp.post("/reservations")
@login_required
def create_reservation():
    data = request.get_json(force=True) or {}
    try:
        restaurant_id = int(data.get("restaurant_id"))
        timeslot_id = int(data.get("timeslot_id"))
        party_size = int(data.get("party_size"))
        resv_date = datetime.strptime(data.get("date"), "%Y-%m-%d").date()
    except Exception:
        return jsonify({"error": "invalid_payload"}), 400

    if party_size <= 0:
        return jsonify({"error": "invalid_party_size"}), 400

    # 存在チェック
    ts = TimeSlot.query.get(timeslot_id)
    if not ts:
        return jsonify({"error": "timeslot_not_found"}), 404
    if ts.restaurant_id != restaurant_id:
        return jsonify({"error": "timeslot_restaurant_mismatch"}), 400
    if not Restaurant.query.get(restaurant_id):
        return jsonify({"error": "restaurant_not_found"}), 404

    # --- コース取得（任意）: course_id(整数/コード) または course_code で解決 ---
    course_obj = None
    if "course_id" in data and data.get("course_id") not in (None, ""):
        cid = data.get("course_id")
        try:
            # 数値っぽければ PK として解釈
            course_obj = Course.query.get(int(cid))
        except (TypeError, ValueError):
            # 数値にできなければ コード として解釈
            course_obj = Course.query.filter_by(code=str(cid)).first()
        if course_obj is None:
            return jsonify({"error": "invalid_course_id"}), 400
    elif "course_code" in data and data.get("course_code"):
        course_obj = Course.query.filter_by(code=str(data["course_code"])).first()
        if course_obj is None:
            return jsonify({"error": "invalid_course_code"}), 400

    try:
        # --- ロックして残数確認 ---
        from sqlalchemy import select, func

        dup = db.session.execute(
            select(Reservation.id).where(
                Reservation.user_id == current_user.id,
                Reservation.restaurant_id == restaurant_id,
                Reservation.timeslot_id == timeslot_id,
                Reservation.date == resv_date,
                Reservation.status == "booked",
            ).limit(1)
        ).first()
        if dup:
            return jsonify({"error": "duplicate_booking"}), 409

        # 対象スロットを FOR UPDATE でロック
        ts_locked = db.session.execute(
            select(TimeSlot).where(TimeSlot.id == timeslot_id).with_for_update()
        ).scalar_one()

        used = db.session.execute(
            select(func.coalesce(func.sum(Reservation.party_size), 0)).where(
                Reservation.restaurant_id == restaurant_id,
                Reservation.timeslot_id == timeslot_id,
                Reservation.date == resv_date,
                Reservation.status == "booked",
            )
        ).scalar_one()

        if used + party_size > ts_locked.capacity:
            return jsonify({
                "error": "capacity_exceeded",
                "capacity": ts_locked.capacity,
                "used": int(used)
            }), 409

        # INSERT（コース情報も保存）
        resv = Reservation(
            restaurant_id=restaurant_id,
            user_id=current_user.id,
            date=resv_date,
            timeslot_id=timeslot_id,
            party_size=party_size,
            status="booked",
            notes=(data.get("notes") or None),
            course_id=(course_obj.id if course_obj else None),
            course_code=(data.get("course_code") or (course_obj.code if course_obj else None)),
            course_name=(data.get("course_name") or (course_obj.name if course_obj else None)),
            course_price=(data.get("course_price") or (course_obj.price if course_obj else None)),
            meta_json=(data.get("metadata") or {}),  # ← モデル属性は meta_json
        )
        db.session.add(resv)
        db.session.commit()

    except Exception:
        db.session.rollback()
        raise

    # レスポンス
    return jsonify({
        "reservation": {
            "id": resv.id,
            "restaurant_id": resv.restaurant_id,
            "date": resv.date.isoformat(),
            "timeslot_id": resv.timeslot_id,
            "party_size": resv.party_size,
            "status": resv.status,
            "course_id": resv.course_id,
            "course_name": resv.course_name,
            "course_price": resv.course_price,
            "metadata": resv.meta_json,
        }
    }), 201

# ---------- 自分の予約一覧 ----------
@bp.get("/reservations/my")
@login_required
def my_reservations():
    rows = (
        Reservation.query
        .filter_by(user_id=current_user.id)
        .options(joinedload(Reservation.course))  # ← JOINして名前/価格の穴埋めに使う
        .order_by(Reservation.date.desc(), Reservation.created_at.desc())
        .all()
    )

    def to_json(r: Reservation):
        # サーバ保存 > JOIN結果 の優先で補完
        course_name  = r.course_name  or (r.course.name  if getattr(r, "course", None) else None)
        course_price = r.course_price or (r.course.price if getattr(r, "course", None) else None)
        return {
            "id": r.id,
            "restaurant_id": r.restaurant_id,
            "date": r.date.isoformat(),
            "timeslot_id": r.timeslot_id,
            "party_size": r.party_size,
            "status": r.status,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            # ここから追加
            "course_id": r.course_id,
            "course_name": course_name,
            "course_price": course_price,
            "metadata": r.meta_json,
        }

    return jsonify([to_json(r) for r in rows])

# ---------- 予約キャンセル（論理削除） ----------
@csrf.exempt
@bp.delete("/reservations/<int:resv_id>")
@login_required
def cancel_reservation(resv_id: int):
    r = Reservation.query.get(resv_id)
    if not r or r.user_id != current_user.id:
        return jsonify({"error": "not_found"}), 404
    if r.status != "booked":
        return jsonify({"error": "already_canceled"}), 400
    r.status = "canceled"
    db.session.commit()
    return jsonify({"ok": True})
