# Lab 8: Container Stats

Monitor container resource usage in real-time.

## Objective

Learn to use `docker stats` to view CPU, memory, and network usage.

---

## Steps

### 1. Ensure Multiple Containers are Running

```bash
docker ps
```

**If you don't have any running:**
```bash
docker run -d -p 8080:80 --name web1 nginx
docker run -d -p 8081:80 --name web2 nginx
docker run -d -p 8082:80 --name web3 nginx
```

---

### 2. View Basic Stats

```bash
docker stats
```

**Expected output:**
```
CONTAINER ID   NAME   CPU %   MEM USAGE / LIMIT   MEM %   NET I/O         BLOCK I/O   PIDS
b2c3d4e5f6a7   web3   0.01%   3.5MiB / 7.8GiB     0.04%   1.2kB / 656B    0B / 0B     3
a1b2c3d4e5f6   web2   0.01%   3.4MiB / 7.8GiB     0.04%   950B / 656B     0B / 0B     3
a8f3d9e2c1b4   web1   0.01%   3.3MiB / 7.8GiB     0.04%   890B / 656B     0B / 0B     3
```

The display updates live every second. Press **Ctrl+C** to stop.

---

### 3. Understanding the Columns

**CPU %**
- Percentage of CPU being used
- 0.01% = Idle
- 100%+ possible on multi-core systems

**MEM USAGE / LIMIT**
- Current memory / Maximum allowed
- `3.5MiB / 7.8GiB` = Using 3.5MB of 7.8GB

**MEM %**
- Memory as percentage of limit
- 0.04% = Barely using any

**NET I/O**
- Network data: Received / Sent
- `1.2kB / 656B` = 1.2KB received, 656 bytes sent
- Cumulative since container started

**BLOCK I/O**
- Disk reads / writes
- Usually 0B for nginx

**PIDS**
- Number of processes
- nginx: Usually 2-4

---

### 4. Monitor Specific Container

```bash
docker stats web1
```

Shows stats for just one container.

---

### 5. Generate Load and Watch Stats

Keep `docker stats` running in one terminal.

In another terminal or browser:

```bash
# Generate traffic
for i in {1..100}; do curl -s http://localhost:8080 > /dev/null; done
```

Or refresh `http://localhost:8080` repeatedly in your browser.

**Watch CPU % increase in docker stats!**

---

### 6. No Stream Mode (One-Time)

Get stats once without live updates:

```bash
docker stats --no-stream
```

**Output:**
```
CONTAINER ID   NAME   CPU %   MEM USAGE / LIMIT   MEM %
a8f3d9e2c1b4   web1   0.01%   3.3MiB / 7.8GiB     0.04%
```

Useful for scripts or quick checks.

---

### 7. Custom Format

Show only name and memory:

```bash
docker stats --format "{{.Name}}: {{.MemUsage}}"
```

**Output:**
```
web1: 3.3MiB / 7.8GiB
web2: 3.4MiB / 7.8GiB
web3: 3.5MiB / 7.8GiB
```

---

## When to Use Stats

**Debugging performance:**
- Which container is using too much CPU?
- Memory leak in an app?
- Unusual network traffic?

**Capacity planning:**
- How many containers can this host handle?
- Need more memory?
- Scale up or scale out?

**Optimization:**
- Before/after comparison
- Resource limit testing
- Identify bottlenecks

---

## Key Takeaways

✅ `docker stats` shows real-time resource usage  
✅ Updates every second  
✅ Shows CPU, memory, network, disk I/O  
✅ Use `--no-stream` for one-time output  
✅ Useful for debugging and capacity planning  

---

## Quick Reference

```bash
docker stats                    # All containers, live updates
docker stats web1               # Specific container
docker stats --no-stream        # One-time snapshot
docker stats --no-trunc         # Show full container IDs
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

---

## Next Lab

[Lab 9: Cleanup](../lab9_cleanup/) - Clean up containers and images.
