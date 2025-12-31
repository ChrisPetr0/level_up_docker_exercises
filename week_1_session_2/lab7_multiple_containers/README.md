# Lab 7: Multiple Containers

Run multiple containers simultaneously.

## Objective

Learn to run several containers from the same image with unique names and ports.

---

## Steps

### 1. Run First Web Server

```bash
docker run -d -p 8080:80 --name web1 nginx
```

**Verify:**
```bash
docker ps | grep web1
```

**Test:** `http://localhost:8080`

---

### 2. Run Second Web Server

```bash
docker run -d -p 8081:80 --name web2 nginx
```

**What's different:**
- Name: `web2` (not web1)
- Host port: `8081` (not 8080)
- Container port: Still `80` (that's fine!)

**Verify both:**
```bash
docker ps
```

**Expected output:**
```
CONTAINER ID   IMAGE   PORTS                  NAMES
a1b2c3d4e5f6   nginx   0.0.0.0:8081->80/tcp  web2
a8f3d9e2c1b4   nginx   0.0.0.0:8080->80/tcp  web1
```

Two containers from the same image!

---

### 3. Access Both Web Servers

**Web1:** `http://localhost:8080`  
**Web2:** `http://localhost:8081`

Both work independently!

---

### 4. Run Third Web Server with Custom Content

Create a custom page:

```bash
mkdir ~/web3-content
echo "<h1>Web Server 3</h1><p>This is different content!</p>" > ~/web3-content/index.html
```

Run with volume mount:

```bash
docker run -d -p 8082:80 --name web3 \
  -v ~/web3-content:/usr/share/nginx/html \
  nginx
```

**Test:** `http://localhost:8082` - Shows different content!

---

### 5. View All Containers

```bash
docker ps
```

**Expected output:**
```
CONTAINER ID   IMAGE   PORTS                  NAMES
c3d4e5f6a7b8   nginx   0.0.0.0:8082->80/tcp  web3
a1b2c3d4e5f6   nginx   0.0.0.0:8081->80/tcp  web2
a8f3d9e2c1b4   nginx   0.0.0.0:8080->80/tcp  web1
```

---

### 6. Stop Individual Containers

```bash
docker stop web2
```

**Check:**
```bash
docker ps
```

web2 is gone, but web1 and web3 still running.

**Start it again:**
```bash
docker start web2
```

---

### 7. Create More Containers

Try creating 5 more:

```bash
docker run -d -p 8083:80 --name web4 nginx
docker run -d -p 8084:80 --name web5 nginx
docker run -d -p 8085:80 --name web6 nginx
docker run -d -p 8086:80 --name web7 nginx
docker run -d -p 8087:80 --name web8 nginx
```

**Check all:**
```bash
docker ps
```

Eight nginx containers running simultaneously!

---

## Container Isolation

Each container:
- Has its own filesystem
- Has its own network namespace
- Has its own processes
- Runs independently
- Shares the same host kernel

**Test isolation:**
```bash
docker exec web1 hostname  # Shows web1's container ID
docker exec web2 hostname  # Shows web2's container ID (different)
```

---

## Port Mapping Rules

**Each host port can only be used once:**

❌ **This fails:**
```bash
docker run -d -p 8080:80 --name web-a nginx
docker run -d -p 8080:80 --name web-b nginx  # Error: port already in use
```

✅ **This works:**
```bash
docker run -d -p 8080:80 --name web-a nginx
docker run -d -p 8081:80 --name web-b nginx  # Different host port
```

---

## Naming Rules

**Each container name must be unique:**

❌ **This fails:**
```bash
docker run -d --name web nginx
docker run -d --name web nginx  # Error: name already in use
```

✅ **This works:**
```bash
docker run -d --name web1 nginx
docker run -d --name web2 nginx  # Different names
```

---

## Key Takeaways

✅ Multiple containers can run from the same image  
✅ Each needs a unique name and unique host port  
✅ Containers run independently and are isolated  
✅ Same image, different containers, different content possible  
✅ Manage each container separately  

---

## Quick Commands

```bash
# List only container names
docker ps --format "{{.Names}}"

# Stop all web containers
docker stop web1 web2 web3

# Remove all web containers
docker rm web1 web2 web3

# Stop all running containers
docker stop $(docker ps -q)
```

---

## Next Lab

[Lab 8: Container Stats](../lab8_container_stats/) - Monitor container resource usage.
