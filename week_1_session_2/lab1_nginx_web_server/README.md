# Lab 1: Nginx Web Server

Run your first web server in a Docker container.

## Objective

Learn to run containers in detached mode with port mapping, and verify they're working correctly.

---

## Steps

### 1. Run Nginx Container

```bash
docker run -d -p 8080:80 --name my-nginx nginx
```

**What this does:**
- `-d` = Run in background (detached)
- `-p 8080:80` = Map your computer's port 8080 to container's port 80
- `--name my-nginx` = Give it a memorable name
- `nginx` = The image to use

**Expected output:**
```
Unable to find image 'nginx:latest' locally
latest: Pulling from library/nginx
...
a8f3d9e2c1b4...
```

The long string is your container ID.

---

### 2. Verify It's Running

```bash
docker ps
```

**Expected output:**
```
CONTAINER ID   IMAGE   COMMAND                  CREATED         STATUS         PORTS                  NAMES
a8f3d9e2c1b4   nginx   "/docker-entrypoint.…"   10 seconds ago  Up 9 seconds   0.0.0.0:8080->80/tcp   my-nginx
```

Look for:
- STATUS = "Up X seconds"
- PORTS = "0.0.0.0:8080->80/tcp"

---

### 3. Access in Browser

Open your browser:
```
http://localhost:8080
```

You should see:
```
Welcome to nginx!
If you see this page, the nginx web server is successfully installed and working.
```

**Success!** You're running a web server in a container.

---

### 4. Test with curl (Optional)

```bash
curl http://localhost:8080
```

You'll see the HTML of the nginx welcome page.

---

## Key Takeaways

✅ `docker run -d` runs containers in the background  
✅ `-p HOST:CONTAINER` maps ports from your computer to the container  
✅ `--name` makes containers easier to reference  
✅ `docker ps` shows running containers  

---

## Troubleshooting

**Port already in use?**
```bash
# Use a different port
docker run -d -p 8081:80 --name my-nginx nginx
# Then access http://localhost:8081
```

**Container name already exists?**
```bash
docker rm my-nginx
# Then try again
```

---

## Next Lab

[Lab 2: Inspect Containers](../lab2_inspect_containers/) - Learn to view detailed container information.
