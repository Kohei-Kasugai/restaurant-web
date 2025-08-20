# Demo Bistro — レストラン予約デモ（React + Flask + Postgres）

レストラン予約サイトのデモアプリです。  
フロントエンドとバックエンドを分けて構築し、Postgres を利用した予約管理を実現しています。

## 技術スタック
- フロント：React + TypeScript + Vite + Tailwind + React Router
- バック：Flask + SQLAlchemy
- DB：Postgres（Docker Compose）

## 前提
- Node.js 18+
- Python 3.10+
- Docker / Docker Compose

## クイックスタート
```bash
# 依存関係
npm install
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# 環境変数
cp .env.example .env

# DB & API
docker compose up -d db
docker compose up -d --build web   # API: http://localhost:8000

# フロント
npm run dev  # http://localhost:5173

