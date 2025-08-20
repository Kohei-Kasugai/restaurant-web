# Demo Bistro — レストラン予約デモ（React + Flask + Postgres）

フロント：React + TypeScript + Vite + Tailwind + react-router
バック：Flask + SQLAlchemy + Gunicorn**（Docker で Postgres）
認証：簡易セッション（クッキー） / `useAuth` フック
予約：コース選択 → 日付/人数 → 時間枠（残席計算） → 確認/完了

> 本リポジトリはフロントとバックを1つで管理します。学習・ポートフォリオ用途を想定。

---

## 目次

* [機能ハイライト](#機能ハイライト)
* [リポジトリ構成](#リポジトリ構成)
* [セットアップ](#セットアップ)
* [起動方法](#起動方法)
* [環境変数](#環境変数)
* [API 仕様](#api-仕様)
* [データモデル](#データモデル)
* [開発ワークフロー](#開発ワークフロー)
* [デプロイの方向性](#デプロイの方向性)
* [よくある詰まりどころ](#よくある詰まりどころ)
* [ライセンス](#ライセンス)
* [クレジット](#クレジット)

---

## 機能ハイライト

* 認証（サインアップ/ログイン/ログアウト、ガード付きルート）
* 予約フロー（**コース ID 連携**、在庫チェック、重複予約検知）
* ダッシュボード（予約一覧/キャンセル、**コース表示＆概算合計**）
* コンテンツページ（Menu / About / Gallery / Access / Contact / News / Events）
* UI：Tailwind、アクセシビリティ配慮（radio group、フォーカスリング等）

---

## リポジトリ構成

```
.
├── app/                       # Flask（API）
│   ├── __init__.py
│   ├── config.py
│   ├── models.py              # User, Restaurant, TimeSlot, Course, Reservation
│   ├── auth/routes.py         # /api/auth/*
│   └── reservations/routes.py # /api/timeslots, /api/reservations/*
├── migrations/                # Alembic（任意）
├── web/                       # React + Vite フロント
│   ├── src/
│   │   ├── components/*       # UI部品（Navbar, Footer, Modal など）
│   │   ├── screens/*          # 画面（Home, Menu, Reserve, Dashboard 他）
│   │   ├── auth.tsx           # useAuth
│   │   ├── api.ts             # フロントの API クライアント
│   │   └── router.tsx         # ルーティング
│   ├── index.html / vite.config.ts / tailwind.config.ts / tsconfig.json
│   └── package.json
├── docker-compose.yml
├── Dockerfile                 # Gunicorn で Flask を起動
├── requirements.txt
├── wsgi.py
├── .env.example               # 例示用環境変数
├── .gitignore
├── LICENSE
└── README.md
```

---

## セットアップ

```bash
# 1) Web の依存を入れる
cd web
npm i
cd ..

# 2) Python 仮想環境
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 3) 環境変数
cp .env.example .env
# 必要なら .env を編集（DB パスワード等）
```

---

## 起動方法

### Postgres & API（バックエンド）

```bash
# DB 起動
docker compose up -d db

# API 起動（ビルド込み）
docker compose up -d --build web

# 動作確認
curl -sS http://localhost:8000/api/auth/health
# => {"status":"ok"} が返ればOK
```

> ログを見る：`docker logs -f restaurant_web`
> 停止する：`docker compose down`（DB は `-v` を付けるとボリュームも消えます）

### フロントエンド（Vite）

```bash
cd web
npm run dev
# http://localhost:5173
```

---

## 環境変数

`.env`（例）

```env
# Flask
FLASK_ENV=development
SECRET_KEY=your_secret_key
SECURITY_PASSWORD_SALT=change_me_salt

# DB
POSTGRES_DB=restaurant
POSTGRES_USER=appuser
POSTGRES_PASSWORD=apppass
DATABASE_URL=postgresql+psycopg2://appuser:apppass@db:5432/restaurant

# App
TIMEZONE=Asia/Tokyo

# Frontend
VITE_API_BASE=http://localhost:8000
```

---

## API 仕様

### 認証

* `POST /api/auth/signup` `{ email, password, full_name, phone? }`
* `POST /api/auth/login` `{ email, password }`
* `POST /api/auth/logout`
* `GET  /api/auth/me` → `{ user: { id, email, ... } }`

> Cookie セッション。`curl` で試す場合は `-c cookie.txt` と `-b cookie.txt` を利用。

### タイムスロット

* `GET /api/timeslots?date=YYYY-MM-DD&restaurant_id=1`

  * 返却：`[{ id, start_time, end_time, capacity, remaining }]`
  * `date` 省略時は `remaining: null`（一覧用途）

### 予約

* `POST /api/reservations`（要ログイン）

  ```json
  {
    "restaurant_id": 1,
    "timeslot_id": 1,
    "date": "2025-09-27",
    "party_size": 2,

    // ★ コースは「ID or コード」のどちらでもOK
    "course_id": 1,                 // ← COURSEテーブルの整数ID
    // または
    "course_id": "course_season"    // ← 文字列コードでも解決可能
    // さらに補助情報を直接渡すことも可（未設定時はサーバ側で補完）
    // "course_name": "季節のコース",
    // "course_price": 6800,
    // "metadata": { "note": "誕生日" }
  }
  ```

  * バリデーション：重複予約検知 / 残席チェック（`capacity_exceeded`）
  * レスポンス例

    ```json
    {
      "reservation": {
        "id": 12,
        "restaurant_id": 1,
        "date": "2025-09-27",
        "timeslot_id": 1,
        "party_size": 2,
        "status": "booked",
        "course_id": 1,
        "course_name": "季節のコース",
        "course_price": 6800,
        "metadata": {}
      }
    }
    ```

* `GET /api/reservations/my`（要ログイン）

  * JOIN により `course_name` / `course_price` を補完して返します。

* `DELETE /api/reservations/:id`（要ログイン）

  * 論理キャンセル（`status: canceled`）

---

## データモデル

* `user`（認証）
* `restaurant`（今回は1件想定）
* `timeslot`（開始/終了時刻・定員）
* `course`（`id`, `code`, `name`, `price`, `badge`, `description`）
* `reservation`

  * `course_id`（FK）
  * 冗長保持：`course_code`, `course_name`, `course_price`（将来価格変動に備え）
  * `meta_json`（任意メタデータ）
  * **インデックス**：`(restaurant_id, date, timeslot_id, status)`、`(course_id)`

> SQL での初期データ投入例は `app/reservations/routes.py` のコメント or README 下部の「例：初期データ投入」を参照。

---

## 開発ワークフロー

* **API を先に起動** → フロントから `VITE_API_BASE` へ叩く
* フロントのコースボタン → `Link /reserve?course_id=course_season`
  → 予約画面が `course_id` を初期選択（`Radio`）
  → `POST /api/reservations` で DB 保存
* ダッシュボードは `GET /api/reservations/my` を読み込み、**コース名／概算合計**を表示

---

## デプロイの方向性

* **バックエンド**：Render / Fly.io / Railway / 自前 VPS + Docker

  * 環境変数で `DATABASE_URL` を本番 DB に差し替え
  * Gunicorn 起動コマンド（Dockerfile 参照）
* **フロント**：Vercel / Netlify / Cloudflare Pages など

  * `npm run build` → `dist/` をホスティング
  * ランタイムで API の URL を指定したい場合は `.env.production` の `VITE_API_BASE` を調整

---

## 例：初期データ投入（任意）

```sql
-- psql で接続： docker exec -it restaurant_db psql -U appuser -d restaurant

INSERT INTO restaurant (name, timezone) VALUES ('Demo Bistro', 'Asia/Tokyo') ON CONFLICT DO NOTHING;

-- タイムスロット例
INSERT INTO timeslot (restaurant_id, start_time, end_time, capacity) VALUES
(1, '18:00', '20:00', 20),
(1, '20:00', '22:00', 20)
ON CONFLICT DO NOTHING;

-- コース例
INSERT INTO course (code, name, price, description, badge) VALUES
('course_season',     '季節のコース',         6800, 'アミューズ/前菜/魚/肉/デザート/小菓子（全6品）', '人気'),
('course_chef',       'シェフズテイスティング', 9800, '旬を凝縮したおまかせ（全8品）',                 'おすすめ'),
('course_vegetarian', 'ベジタリアンコース',     6200, '動物性不使用・事前予約制',                      '要予約')
ON CONFLICT DO NOTHING;
```

---

## ライセンス

**MIT License** （`LICENSE` 参照）。

---

## クレジット

* 写真は Unsplash 等のフリー素材を利用（クレジット不要のものを選定）
* UI：Tailwind CSS
* アイコン等は各ライブラリのライセンスに準拠

---
