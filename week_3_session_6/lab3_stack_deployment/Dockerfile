FROM python:3.9-slim

WORKDIR /app

# Install redis Python client
RUN pip install redis

COPY api.py .

CMD ["python", "api.py"]
