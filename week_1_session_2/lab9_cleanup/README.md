# Lab 9: Cleanup

Clean up containers and images to free disk space.

## Objective

Learn to properly remove containers, images, and unused resources.

---

## Steps

### 1. See What You Have

**List all containers:**
```bash
docker ps -a
```

**List all images:**
```bash
docker images
```

**Check disk space:**
```bash
docker system df
```

**Expected output:**
```
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          1         1         142.8MB   0B (0%)
Containers      8         8         32B       0B (0%)
Local Volumes   0         0         0B        0B
Build Cache     0         0         0B        0B
```

---

### 2. Stop All Running Containers

```bash
docker stop $(docker ps -q)
```

**What this does:**
- `docker ps -q` = List running container IDs only
- `$(...)` = Pass IDs to `docker stop`

**If nothing running:** You'll get "requires at least 1 argument" - that's fine.

---

### 3. Remove All Containers

```bash
docker rm $(docker ps -aq)
```

**What this does:**
- `docker ps -aq` = List ALL container IDs (including stopped)
- Removes all containers

**Verify:**
```bash
docker ps -a
```

Should be empty!

---

### 4. Remove Specific Containers

If you want to remove just some containers:

```bash
docker rm web1 web2 web3
```

Or force remove even if running:

```bash
docker rm -f web1 web2 web3
```

---

### 5. Remove Images

**Remove specific image:**
```bash
docker rmi nginx
```

**Remove multiple images:**
```bash
docker rmi nginx redis postgres
```

**Force remove:**
```bash
docker rmi -f nginx
```

---

### 6. Remove All Images

⚠️ **Warning:** This removes ALL images!

```bash
docker rmi $(docker images -q)
```

---

### 7. Prune Unused Resources

**Remove stopped containers:**
```bash
docker container prune
```

**Remove unused images:**
```bash
docker image prune
```

**Remove unused volumes:**
```bash
docker volume prune
```

**Remove unused networks:**
```bash
docker network prune
```

**Remove EVERYTHING unused:**
```bash
docker system prune
```

**Remove everything including volumes:**
```bash
docker system prune -a --volumes
```

⚠️ **Be careful!** This removes a LOT.

---

### 8. Verify Cleanup

```bash
docker ps -a        # Should be empty
docker images       # Should be empty
docker system df    # Should show 0B
```

---

## Cleanup Strategies

**After each session:**
```bash
docker stop $(docker ps -q)
docker rm $(docker ps -aq)
```

**Weekly cleanup:**
```bash
docker system prune -a
```

**Keep working images:**
```bash
# Remove only stopped containers
docker container prune

# Remove only dangling images (not tagged)
docker image prune
```

---

## Key Takeaways

✅ `docker rm` removes containers (must be stopped first)  
✅ `docker rmi` removes images  
✅ `docker prune` removes unused resources  
✅ `-f` forces removal even if running  
✅ `docker system prune -a` removes everything unused  
✅ Regular cleanup prevents disk space issues  

---

## Quick Reference

```bash
# Stop and remove all containers
docker stop $(docker ps -q) && docker rm $(docker ps -aq)

# Remove all images
docker rmi $(docker images -q)

# Remove everything unused
docker system prune -a --volumes

# Check disk usage
docker system df

# See what prune will remove (without doing it)
docker system prune --dry-run
```

---

## Common Errors

**Cannot remove running container:**
```bash
# Stop it first
docker stop web1
docker rm web1

# Or force remove
docker rm -f web1
```

**Image in use:**
```bash
# Remove containers using it first
docker rm $(docker ps -aq --filter ancestor=nginx)
docker rmi nginx
```

**Permission denied:**
```bash
# May need sudo on Linux
sudo docker system prune
```

---

## Congratulations!

You've completed all Week 1 Session 2 labs! You now know:

✅ How to run containers with port mapping  
✅ How to inspect and debug containers  
✅ How to manage container lifecycle  
✅ How to use volume mounts  
✅ How to run multiple containers  
✅ How to monitor resources  
✅ How to clean up properly  

**Next:** Week 2 - Building Custom Images with Dockerfiles
