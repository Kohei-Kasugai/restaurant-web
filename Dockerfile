FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app

# Render が自動で PORT を渡すのでそれを使う
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=wsgi.py

# 起動前に migrate。失敗原因を見やすくするためログも出す
CMD bash -lc "flask db upgrade && gunicorn -w 2 -k gthread -t 60 -b 0.0.0.0:$PORT wsgi:app --log-level info"

