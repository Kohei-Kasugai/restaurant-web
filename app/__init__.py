from flask import Flask, jsonify
from flask_wtf.csrf import CSRFProtect
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from .config import Config

csrf = CSRFProtect()
db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
login_manager.login_view = "auth.login"
login_manager.login_message = None  # 未ログイン時のフラッシュ無効化

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config())

    # extensions
    csrf.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    # models import (migrate用)
    from .models import User  # noqa: F401

    # 未認証はJSONで401を返す
    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({"error": "unauthorized"}), 401

    # blueprints
    from .auth.routes import bp as auth_bp
    app.register_blueprint(auth_bp)

    # 予約APIは後で追加
    from .reservations.routes import bp as reservations_bp
    app.register_blueprint(reservations_bp)

    return app
