# Lab 6: Backup and Restore Volumes

Learn to backup and restore Docker volume data for disaster recovery and migration.

## Objective

Use tar archives to backup and restore volume data - essential for production data protection.

---

## Steps

### 1. Create Volume and Add Data

```bash
docker volume create backup-demo
```

**Add sample data:**
```bash
docker run --rm -v backup-demo:/data alpine sh -c "
  echo 'Important data!' > /data/file.txt &&
  echo 'More data!' > /data/file2.txt &&
  mkdir /data/logs &&
  echo 'Log entry 1' > /data/logs/app.log
"
```

**Verify data exists:**
```bash
docker run --rm -v backup-demo:/data alpine ls -la /data
```

**Expected output:**
```
total 16
drwxr-xr-x    3 root     root          4096 Nov 13 10:30 .
drwxr-xr-x    1 root     root          4096 Nov 13 10:30 ..
-rw-r--r--    1 root     root            16 Nov 13 10:30 file.txt
-rw-r--r--    1 root     root            11 Nov 13 10:30 file2.txt
drwxr-xr-x    2 root     root          4096 Nov 13 10:30 logs
```

---

### 2. Backup the Volume

**Create backup tar file:**
```bash
docker run --rm \
  -v backup-demo:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/backup-demo.tar.gz -C /data .
```

**What this does:**
- `-v backup-demo:/data` - Mount volume we want to backup
- `-v $(pwd):/backup` - Mount current directory to save backup file
- `tar czf` - Create compressed tar file
- `/backup/backup-demo.tar.gz` - Save to current directory
- `-C /data .` - Backup contents of /data directory

**Verify backup file:**
```bash
ls -lh backup-demo.tar.gz
```

**Expected output:**
```
-rw-r--r-- 1 user user 312 Nov 13 10:30 backup-demo.tar.gz
```

---

### 3. Simulate Data Loss

**Delete the original volume:**
```bash
docker volume rm backup-demo
```

**Verify it's gone:**
```bash
docker volume ls | grep backup-demo
# Should return nothing
```

---

### 4. Restore from Backup

**Create new volume:**
```bash
docker volume create restored-volume
```

**Restore data from backup:**
```bash
docker run --rm \
  -v restored-volume:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/backup-demo.tar.gz -C /data
```

**What this does:**
- `-v restored-volume:/data` - Mount new volume
- `-v $(pwd):/backup` - Mount directory with backup file
- `tar xzf` - Extract compressed tar file
- `-C /data` - Extract to /data directory

---

### 5. Verify Restored Data

```bash
docker run --rm -v restored-volume:/data alpine ls -la /data
```

**Expected output:**
```
total 16
drwxr-xr-x    3 root     root          4096 Nov 13 10:30 .
drwxr-xr-x    1 root     root          4096 Nov 13 10:30 ..
-rw-r--r--    1 root     root            16 Nov 13 10:30 file.txt
-rw-r--r--    1 root     root            11 Nov 13 10:30 file2.txt
drwxr-xr-x    2 root     root          4096 Nov 13 10:30 logs
```

**Check file contents:**
```bash
docker run --rm -v restored-volume:/data alpine cat /data/file.txt
```

**Expected output:**
```
Important data!
```

**🎉 Data successfully restored!**

---

## Real-World Example: MySQL Backup

**Backup MySQL database:**
```bash
# Create backup directory
mkdir -p ~/mysql-backups

# Backup MySQL data volume
docker run --rm \
  -v mysql-data:/data \
  -v ~/mysql-backups:/backup \
  alpine tar czf /backup/mysql-backup-$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
```

**Restore MySQL database:**
```bash
# Create new volume
docker volume create mysql-data-restored

# Restore from backup
docker run --rm \
  -v mysql-data-restored:/data \
  -v ~/mysql-backups:/backup \
  alpine tar xzf /backup/mysql-backup-20241113-103000.tar.gz -C /data

# Run MySQL with restored data
docker run -d --name mysql-restored \
  -v mysql-data-restored:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=secret123 \
  mysql:8.0
```

---

## Automated Backup Script

Create `backup-volumes.sh`:

```bash
#!/bin/bash

VOLUME_NAME=$1
BACKUP_DIR=${2:-./backups}
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${VOLUME_NAME}-${TIMESTAMP}.tar.gz"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup volume
docker run --rm \
  -v "${VOLUME_NAME}:/data" \
  -v "${BACKUP_DIR}:/backup" \
  alpine tar czf "/backup/${VOLUME_NAME}-${TIMESTAMP}.tar.gz" -C /data .

echo "Backup saved to: ${BACKUP_FILE}"
ls -lh "$BACKUP_FILE"
```

**Usage:**
```bash
chmod +x backup-volumes.sh
./backup-volumes.sh mysql-data ~/backups
```

---

## Key Takeaways

✅ Volumes can be backed up to tar archives  
✅ Use `tar czf` to create, `tar xzf` to extract  
✅ Backup/restore works for any volume type  
✅ Critical for disaster recovery  
✅ Use for migration between hosts  
✅ Automate with cron for production  

---

## Production Backup Strategy

**Daily automated backups:**
```bash
# Crontab entry
0 2 * * * /usr/local/bin/backup-volumes.sh mysql-data /backups/mysql
0 3 * * * /usr/local/bin/backup-volumes.sh redis-data /backups/redis
```

**Retention policy:**
- Keep daily backups for 7 days
- Keep weekly backups for 4 weeks
- Keep monthly backups for 12 months

**Off-site backup:**
```bash
# Upload to S3
aws s3 cp backup.tar.gz s3://my-backups/

# Or rsync to remote server
rsync -av backups/ user@backup-server:/backups/
```

---

## Windows Paths

**PowerShell:**
```bash
docker run --rm `
  -v backup-demo:/data `
  -v ${PWD}:/backup `
  alpine tar czf /backup/backup-demo.tar.gz -C /data .
```

**CMD:**
```bash
docker run --rm ^
  -v backup-demo:/data ^
  -v %cd%:/backup ^
  alpine tar czf /backup/backup-demo.tar.gz -C /data .
```

---

## Cleanup

```bash
docker volume rm restored-volume
rm backup-demo.tar.gz
```

---

## Quick Reference

```bash
# Backup volume
docker run --rm \
  -v VOLUME_NAME:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz -C /data .

# Restore volume
docker run --rm \
  -v VOLUME_NAME:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/backup.tar.gz -C /data

# List backup contents
tar tzf backup.tar.gz

# Backup with timestamp
docker run --rm \
  -v mysql-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/mysql-$(date +%Y%m%d).tar.gz -C /data .
```

---

## Congratulations!

You've completed Week 2 Session 4! You now know:

✅ How to persist data with volumes  
✅ How to manage database persistence  
✅ How to connect containers with networks  
✅ How to use DNS for service discovery  
✅ How to configure containers with environment variables  
✅ How to backup and restore volume data  

**Next:** Week 3 - Docker Compose for multi-container orchestration
