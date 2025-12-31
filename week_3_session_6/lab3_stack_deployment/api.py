from http.server import BaseHTTPRequestHandler, HTTPServer
import socket
import os
from datetime import datetime
import redis

# Connect to Redis service using service name (Swarm DNS resolution)
redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)

class APIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Health check endpoint
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'OK')
            return
        
        # Increment visit counter in Redis
        try:
            visits = redis_client.incr('visit_counter')
            redis_status = f"✓ Connected to Redis (backend network)"
        except Exception as e:
            visits = "Error"
            redis_status = f"✗ Redis connection failed: {str(e)}"
        
        # Get container info
        hostname = socket.gethostname()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        response = f"""
        <html>
        <head><title>API Service</title></head>
        <body>
            <h1>API Service Response</h1>
            <p><strong>Container ID:</strong> {hostname}</p>
            <p><strong>Timestamp:</strong> {timestamp}</p>
            <p><strong>Visit Count:</strong> {visits}</p>
            <p><strong>Network:</strong> Connected to frontend and backend</p>
            <p><strong>Redis Status:</strong> {redis_status}</p>
            <p><strong>Status:</strong> API is running!</p>
        </body>
        </html>
        """
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(response.encode())
    
    def log_message(self, format, *args):
        # Suppress default logging to reduce noise
        pass

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 8000), APIHandler)
    print(f'API server running on port 8000')
    server.serve_forever()
