# Lab 1: Volume Persistence

Prove that data in Docker volumes persists even when containers are deleted.

## Objective

Learn that volumes have an independent lifecycle from containers - data survives container deletion.

---

## Steps

### 1. Create a Named Volume

```bash
docker volume create mydata
```

**Verify it exists:**
```bash
docker volume ls | grep mydata
```

---

### 2. Write Data to the Volume

```bash
docker run --rm -v mydata:/data alpine sh -c "echo 'Data from container 1' > /data/test.txt"
```

**What this does:**
- `--rm` - Container deletes itself after running
- `-v mydata:/data` - Mount volume to `/data`
- Creates `test.txt` with content

Container runs and immediately deletes itself. But the data stays in the volume!

---

### 3. Read Data from a NEW Container

```bash
docker run --rm -v mydata:/data alpine cat /data/test.txt
```

**Expected output:**
```
Data from container 1
```

**Key insight:** Different container, same data! The volume persisted.

---

### 4. Add More Data from Another Container

```bash
docker run --rm -v mydata:/data alpine sh -c "echo 'Data from container 2' >> /data/test.txt"
```

Note the `>>` (append) instead of `>` (overwrite).

---

### 5. Read All Data

```bash
docker run --rm -v mydata:/data alpine cat /data/test.txt
```

**Expected output:**
```
Data from container 1
Data from container 2
```

---

### 6. Inspect the Volume

```bash
docker volume inspect mydata
```

**Expected output:**
```json
[
    {
        "CreatedAt": "2024-11-13T10:30:00Z",
        "Driver": "local",
        "Mountpoint": "/var/lib/docker/volumes/mydata/_data",
        "Name": "mydata",
        "Scope": "local"
    }
]
```

**Mountpoint** shows where Docker stores the data on your host.

---

### 7. List Files in Volume Directory

```bash
docker run --rm -v mydata:/data alpine ls -la /data
```

**Expected output:**
```
total 4
drwxr-xr-x    2 root     root            60 Nov 13 10:30 .
drwxr-xr-x    1 root     root          4096 Nov 13 10:30 ..
-rw-r--r--    1 root     root            44 Nov 13 10:30 test.txt
```

---

## Volume vs Bind Mount Comparison

**Named Volume (what we just used):**
```bash
-v mydata:/data
```
- Managed by Docker
- Stored in Docker's area (`/var/lib/docker/volumes/`)
- Best for persistence

**Bind Mount (from Week 1):**
```bash
-v $(pwd):/data
```
- Maps to specific host directory
- Stored wherever you specify
- Best for development

---

## Key Takeaways

✅ Volumes persist data beyond container lifecycle  
✅ Multiple containers can share the same volume  
✅ Containers can be deleted without losing data  
✅ Volumes must be explicitly deleted with `docker volume rm`  
✅ Use `--rm` for temporary containers  

---

## Cleanup

```bash
docker volume rm mydata
```

**Verify it's gone:**
```bash
docker volume ls | grep mydata
# Should return nothing
```

---

## Quick Reference

```bash
# Create volume
docker volume create name

# List volumes
docker volume ls

# Inspect volume
docker volume inspect name

# Remove volume
docker volume rm name

# Remove all unused volumes
docker volume prune
```

---

## Next Lab

[Lab 2: MySQL Persistence](../lab2_mysql_persistence/) - See volume persistence with a real database.
