import os
from dotenv import load_dotenv


load_dotenv()


class Config:
    def __init__(self):
        self.SECRET_KEY = os.getenv("SECRET_KEY", "dev")
        self.SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
        self.SQLALCHEMY_TRACK_MODIFICATIONS = False
        self.TIMEZONE = os.getenv("TIMEZONE", "Asia/Tokyo")
        # セッション/CSRF
        self.SESSION_COOKIE_SECURE = False # 本番はTrue
        self.SESSION_COOKIE_HTTPONLY = True
        self.SESSION_COOKIE_SAMESITE = "Lax"