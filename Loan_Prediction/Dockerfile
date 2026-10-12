# ML prediction service (Flask + scikit-learn)
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py utils.py model.pkl ./
COPY templates ./templates
EXPOSE 5001
# 0.0.0.0 so the service is reachable from outside the container
CMD ["flask", "--app", "app", "run", "--host=0.0.0.0", "--port=5001"]
