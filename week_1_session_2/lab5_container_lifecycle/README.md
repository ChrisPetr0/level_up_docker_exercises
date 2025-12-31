# Lab 5: Container Lifecycle

Manage container states: stop, start, and restart.

## Objective

Learn to manage containers without losing their configuration.

---

## Steps

### 1. Check Current State

```bash
docker ps
```

**Expected output:**
```
CONTAINER ID   IMAGE   STATUS         PORTS                  NAMES
a8f3d9e2c1b4   nginx   Up 10 minutes  0.0.0.0:8080->80/tcp   my-nginx
```

Container is running. Test in browser: `http://localhost:8080`

---

### 2. Stop the Container

```bash
docker stop my-nginx
```

**Expected output:**
```
my-nginx
```

This sends a graceful shutdown signal. nginx finishes current requests, then stops.

---

### 3. Verify It's Stopped

```bash
docker ps
```

**Output:** Empty (no running containers)

**Check all containers (including stopped):**
```bash
docker ps -a
```

**Expected output:**
```
CONTAINER ID   IMAGE   STATUS                     PORTS   NAMES
a8f3d9e2c1b4   nginx   Exited (0) 1 minute ago            my-nginx
```

Note:
- STATUS = "Exited (0)" → Clean shutdown
- PORTS = Empty → No longer accessible

**Test in browser:** `http://localhost:8080` won't work now.

---

### 4. Start the Container Again

```bash
docker start my-nginx
```

**Expected output:**
```
my-nginx
```

---

### 5. Verify It's Running

```bash
docker ps
```

**Expected output:**
```
CONTAINER ID   IMAGE   STATUS         PORTS                  NAMES
a8f3d9e2c1b4   nginx   Up 5 seconds   0.0.0.0:8080->80/tcp   my-nginx
```

**Test in browser:** `http://localhost:8080` works again!

**Key point:** Same container, same configuration, same port mapping. Nothing was lost.

---

### 6. Restart the Container

Restart = stop + start in one command:

```bash
docker restart my-nginx
```

**Expected output:**
```
my-nginx
```

Useful when:
- Configuration files changed
- Container is misbehaving
- Need to apply updates

---

### 7. View Start/Stop History

```bash
docker inspect -f '{{.State.StartedAt}}' my-nginx
docker inspect -f '{{.State.FinishedAt}}' my-nginx
```

Shows when container was last started and stopped.

---

### 8. Force Stop (if needed)

If a container won't stop gracefully:

```bash
docker stop -t 2 my-nginx  # Wait only 2 seconds before force kill
```

Or force kill immediately:

```bash
docker kill my-nginx
```

---

## Container States

**Running:**
- Container is active
- Application is running
- Accessible via mapped ports

**Stopped:**
- Container exists but isn't running
- Configuration preserved
- No CPU/memory usage
- Can be started again

**Paused:**
- Container processes frozen (advanced)
- `docker pause my-nginx` / `docker unpause my-nginx`

---

## Key Takeaways

✅ `docker stop` = Graceful shutdown (saves data properly)  
✅ `docker start` = Restart a stopped container  
✅ `docker restart` = Stop + start in one command  
✅ Configuration persists across stop/start  
✅ Stopped containers still exist (check with `docker ps -a`)  

---

## Quick Reference

```bash
docker ps           # Running containers only
docker ps -a        # All containers (running + stopped)
docker stop <name>  # Stop container
docker start <name> # Start stopped container
docker restart <name> # Restart container
docker kill <name>  # Force stop immediately
```

---

## Next Lab

[Lab 6: Volume Mounts](../lab6_volume_mounts/) - Mount local files into containers.
