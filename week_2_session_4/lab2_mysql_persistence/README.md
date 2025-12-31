# Lab 2: MySQL Database Persistence

Prove that database data persists across container deletion using volumes.

## Objective

Learn the production pattern for stateful containers - data survives even when the container is completely deleted.

---

## Steps

### 1. Create Volume for MySQL Data

```bash
docker volume create mysql-data
```

---

### 2. Run MySQL with the Volume

```bash
docker run -d --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=secret123 \
  -e MYSQL_DATABASE=testdb \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0
```

**What this does:**
- `-e MYSQL_ROOT_PASSWORD` - Sets root password
- `-e MYSQL_DATABASE` - Creates database named `testdb`
- `-v mysql-data:/var/lib/mysql` - Mounts volume where MySQL stores data

**Wait 15-20 seconds** for MySQL to initialize.

**Check it's running:**
```bash
docker ps | grep mysql-db
```

---

### 3. Create Test Data

```bash
docker exec -i mysql-db mysql -uroot -psecret123 testdb << 'EOF'
CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie');
SELECT * FROM users;
EOF
```

**Expected output:**
```
+----+---------+
| id | name    |
+----+---------+
|  1 | Alice   |
|  2 | Bob     |
|  3 | Charlie |
+----+---------+
```

**The data is now in the MySQL database!**

---

### 4. DELETE the Container (Disaster Simulation!)

```bash
docker stop mysql-db
docker rm mysql-db
```

**Verify it's gone:**
```bash
docker ps -a | grep mysql-db
# Should return nothing
```

**The container is completely deleted.** In a real scenario, this could be:
- Server crash
- Accidental deletion
- Container upgrade
- Hardware failure

---

### 5. Create NEW Container with SAME Volume

```bash
docker run -d --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=secret123 \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0
```

**Note:** We don't need `-e MYSQL_DATABASE=testdb` this time - the database already exists in the volume!

**Wait 10 seconds** for MySQL to start.

---

### 6. Verify Data Survived!

```bash
docker exec mysql-db mysql -uroot -psecret123 testdb -e "SELECT * FROM users;"
```

**Expected output:**
```
+----+---------+
| id | name    |
+----+---------+
|  1 | Alice   |
|  2 | Bob     |
|  3 | Charlie |
+----+---------+
```

**🎉 The data survived!** Alice, Bob, and Charlie are still there, even though we completely deleted the original container.

---

### 7. Add More Data

```bash
docker exec mysql-db mysql -uroot -psecret123 testdb -e "INSERT INTO users VALUES (4, 'Dave');"
docker exec mysql-db mysql -uroot -psecret123 testdb -e "SELECT * FROM users;"
```

**Expected output:**
```
+----+---------+
| id | name    |
+----+---------+
|  1 | Alice   |
|  2 | Bob     |
|  3 | Charlie |
|  4 | Dave    |
+----+---------+
```

---

## How This Works

**Container lifecycle:**
- Created → Running → Stopped → Deleted
- Container is **ephemeral** (temporary)

**Volume lifecycle:**
- Created → Exists → Exists → Still Exists!
- Volume is **persistent**

**The key:** MySQL stores data in `/var/lib/mysql`, which we mapped to a volume. Even when the container is gone, the volume (and the data) remains.

---

## Production Pattern

This is exactly how databases run in production:

```bash
# Create volume once
docker volume create prod-mysql-data

# Run database
docker run -d --name prod-db \
  -v prod-mysql-data:/var/lib/mysql \
  mysql:8.0

# Upgrade to new version? Just recreate container!
docker stop prod-db && docker rm prod-db

docker run -d --name prod-db \
  -v prod-mysql-data:/var/lib/mysql \
  mysql:8.1  # New version, same data!
```

---

## Key Takeaways

✅ Container is disposable - we deleted it completely  
✅ Data is NOT disposable - all databases, tables, data intact  
✅ Critical mount point - MySQL stores data in `/var/lib/mysql`  
✅ Production pattern - This is how real databases work  
✅ Volume survives restarts, upgrades, and deletions  

---

## Data Directories for Other Databases

Remember these mount points:

| Database | Data Directory |
|----------|----------------|
| **MySQL** | `/var/lib/mysql` |
| **PostgreSQL** | `/var/lib/postgresql/data` |
| **MongoDB** | `/data/db` |
| **Redis** | `/data` |

---

## Cleanup

```bash
docker stop mysql-db
docker rm mysql-db
docker volume rm mysql-data
```

---

## Quick Reference

```bash
# Create database with volume
docker volume create db-data
docker run -d --name db \
  -v db-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=pass \
  mysql:8.0

# Connect to database
docker exec -it db mysql -uroot -ppass

# Backup volume (we'll learn this in Lab 6)
docker run --rm -v db-data:/data -v $(pwd):/backup alpine \
  tar czf /backup/db-backup.tar.gz -C /data .
```

---

## Next Lab

[Lab 3: Network DNS](../lab3_network_dns/) - Learn how containers communicate by name.
