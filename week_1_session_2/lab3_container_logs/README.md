# Lab 3: Container Logs

View and follow container output for debugging and monitoring.

## Objective

Learn to use `docker logs` to view container output and debug issues.

---

## Steps

### 1. View Basic Logs

See all output from the container:

```bash
docker logs my-nginx
```

**Expected output:**
```
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty...
2024/11/13 10:30:00 [notice] 1#1: start worker processes
2024/11/13 10:30:00 [notice] 1#1: start worker process 29
```

Shows nginx startup messages and any HTTP requests.

---

### 2. Follow Logs in Real-Time

Watch logs as they happen:

```bash
docker logs -f my-nginx
```

**What this does:**
- Shows existing logs first
- Then keeps updating live
- Press **Ctrl+C** to stop (container keeps running)

---

### 3. Generate Traffic

Keep `docker logs -f my-nginx` running in your terminal.

In your browser, refresh `http://localhost:8080` several times.

**In your terminal, you'll see new log entries appear:**
```
172.17.0.1 - - [13/Nov/2024:10:35:22 +0000] "GET / HTTP/1.1" 200 615 "-" "Mozilla/5.0..."
172.17.0.1 - - [13/Nov/2024:10:35:23 +0000] "GET / HTTP/1.1" 200 615 "-" "Mozilla/5.0..."
```

Each line shows:
- Client IP
- Timestamp
- HTTP method and path
- Status code (200 = success)
- Response size

---

### 4. View Last N Lines

Show only the last 10 log entries:

```bash
docker logs --tail 10 my-nginx
```

---

### 5. View Logs with Timestamps

Add timestamps to each log line:

```bash
docker logs -t my-nginx
```

**Output:**
```
2024-11-13T10:30:00.123456789Z /docker-entrypoint.sh: /docker-entrypoint.d/...
2024-11-13T10:30:00.234567890Z 2024/11/13 10:30:00 [notice] 1#1: start worker...
```

---

### 6. View Logs Since Timestamp

Show logs from the last 5 minutes:

```bash
docker logs --since 5m my-nginx
```

Or since a specific time:

```bash
docker logs --since 2024-11-13T10:00:00 my-nginx
```

---

### 7. Combine Flags

Follow only the last 5 lines with timestamps:

```bash
docker logs -f --tail 5 -t my-nginx
```

---

## Key Takeaways

✅ `docker logs <name>` shows container output  
✅ `-f` follows logs in real-time  
✅ `--tail N` shows last N lines  
✅ `-t` adds timestamps  
✅ `--since` filters by time  
✅ Logs are crucial for debugging container issues  

---

## When to Use Logs

- Container won't start → Check startup errors
- App behaving weird → Look for error messages
- Debugging API → See request/response logs
- Monitor activity → Follow logs in real-time

---

## Next Lab

[Lab 4: Execute Commands](../lab4_execute_commands/) - Run commands inside containers.
