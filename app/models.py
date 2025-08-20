from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from . import db, login_manager


class User(UserMixin, db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    full_name = db.Column(db.String, nullable=False)
    phone = db.Column(db.String)
    role = db.Column(db.String, default="member", nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    reservations = db.relationship("Reservation", backref="user")

    # パスワードユーティリティ
    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class Restaurant(db.Model):
    __tablename__ = "restaurant"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    timezone = db.Column(db.String, nullable=False, default="Asia/Tokyo")


class TimeSlot(db.Model):
    __tablename__ = "timeslot"

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurant.id", ondelete="CASCADE"))
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)

class Course(db.Model):
    __tablename__ = "course"  # ← DBの単数形テーブルに合わせる

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String, unique=True, nullable=False)   # 例: 'course_season'
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)
    badge = db.Column(db.String)

    # 任意: 逆参照（使う場合）
    reservations = db.relationship("Reservation", backref="course", lazy="select", foreign_keys="Reservation.course_id")


class Reservation(db.Model):
    __tablename__ = "reservation"

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurant.id", ondelete="CASCADE"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="SET NULL"))
    date = db.Column(db.Date, nullable=False)
    timeslot_id = db.Column(db.Integer, db.ForeignKey("timeslot.id", ondelete="RESTRICT"))
    party_size = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String, default="booked", nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        db.Index("idx_resv_lookup", "restaurant_id", "date", "timeslot_id", "status"),
    )

    course_id    = db.Column(db.Integer, db.ForeignKey("course.id"))
    course_code  = db.Column(db.Text)   # psqlで text だったので Text に合わせる
    course_name  = db.Column(db.Text)
    course_price = db.Column(db.Integer)
    # "metadata" は予約語 → モデル属性を meta_json にし、物理カラム名は "metadata" のまま保持
    meta_json    = db.Column('metadata', JSONB, default={})