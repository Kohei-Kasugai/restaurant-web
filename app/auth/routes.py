from flask import request, jsonify, Blueprint
from flask_login import login_user, logout_user, login_required, current_user
from ..models import User
from .. import db, csrf

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# JSON APIはCSRF免除（SameSite=Lax + セッションCookie）
@csrf.exempt
@bp.post("/signup")
def signup():
    data = request.get_json(force=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    full_name = (data.get("full_name") or "").strip()
    phone = (data.get("phone") or "").strip() or None

    # 必須チェック
    if not email or not password or not full_name:
        return jsonify({"error": "missing_fields"}), 400

    # 既存ユーザー
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "email_taken"}), 409

    # ユーザー作成
    user = User(email=email, full_name=full_name, phone=phone)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    # 自動ログイン
    login_user(user)
    return jsonify({"user": {"id": user.id, "email": user.email, "full_name": user.full_name}}), 201


@csrf.exempt
@bp.post("/login")
def login():
    data = request.get_json(force=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "invalid_credentials"}), 401

    login_user(user)
    return jsonify({"user": {"id": user.id, "email": user.email, "full_name": user.full_name}})

@csrf.exempt
@bp.post("/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"ok": True})


@bp.get("/me")
@login_required
def me():
    u = current_user
    return jsonify({"user": {"id": u.id, "email": u.email, "full_name": u.full_name, "phone": u.phone}})


# 既存のヘルスチェックもここで受ける（/api/auth/health）
@bp.get("/health")
def health():
    return {"status": "ok"}
