FROM python:3.9-slim

# Install Flask
RUN pip install flask

# Copy application
COPY app.py /app/app.py
WORKDIR /app

# Add health check
HEALTHCHECK --interval=10s --timeout=3s --retries=3 --start-period=5s \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/health')"

# Run the application
CMD ["python", "app.py"]
