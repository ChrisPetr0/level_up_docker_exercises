# Lab 2: WordPress + MySQL Stack

Deploy a production-ready multi-container WordPress installation.

## Objective

Learn to deploy real-world applications with service dependencies and persistent storage.

---

## What You'll Build

A complete WordPress CMS with MySQL database:
- **MySQL 8.0** - Database server
- **WordPress** - PHP CMS with Apache
- **Named volumes** - Persistent data storage
- **Service dependencies** - WordPress waits for MySQL

```
┌──────────────┐
│  WordPress   │ :8080
└──────┬───────┘
       │ DNS: 'db'
       ↓
┌──────────────┐
│    MySQL     │ :3306 (internal)
└──────┬───────┘
       │
       ↓
   Named Volume
   (persistent)
```

---

## Files Provided

In this lab directory:
- `docker-compose.yml` - WordPress + MySQL stack

---

## Steps

### 1. Navigate to Lab Directory

```bash
cd ~/level_up_curriculum/labs/week_3_session_5/lab2_wordpress_mysql
```

---

### 2. Review the Compose File

**Look at `docker-compose.yml`:**

```yaml
services:
  db:
    image: mysql:8.0
    volumes:
      - db_data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: somewordpress
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress

  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wordpress_data:/var/www/html

volumes:
  db_data:
  wordpress_data:
```

**Key concepts:**
- `depends_on:` - Database starts before WordPress
- `db:3306` - Uses service name as hostname
- Named volumes persist data
- Environment variables configure connections

---

### 3. Validate the Configuration

```bash
docker compose config
```

Check for syntax errors.

---

### 4. Start the Stack

```bash
docker compose up -d
```

**Expected output:**
```
[+] Running 4/4
 ✔ Network lab2_default            Created
 ✔ Volume "lab2_db_data"           Created
 ✔ Volume "lab2_wordpress_data"    Created
 ✔ Container lab2-db-1             Started
 ✔ Container lab2-wordpress-1      Started
```

---

### 5. Monitor Startup

```bash
docker compose logs -f
```

**Wait for:**
```
db-1         | [Server] /usr/sbin/mysqld: ready for connections
wordpress-1  | Apache/2.4.x (Debian) configured -- resuming normal operations
```

Press `Ctrl+C` when both are ready.

---

### 6. Check Service Status

```bash
docker compose ps
```

**Expected output:**
```
NAME               IMAGE              STATUS    PORTS
lab2-db-1          mysql:8.0          Up        3306/tcp, 33060/tcp
lab2-wordpress-1   wordpress:latest   Up        0.0.0.0:8080->80/tcp
```

Both should be `Up`.

---

### 7. Install WordPress

**Open browser:**
```
http://localhost:8080
```

**Installation wizard:**

1. **Select Language** - Choose your language
2. **Site Information:**
   - Site Title: `My Docker Blog`
   - Username: `admin`
   - Password: (choose a strong password)
   - Email: `admin@example.com`
3. Click **Install WordPress**
4. **Success!** - Log in with your credentials

---

### 8. Create Sample Content

**After logging in:**
- Click **Write your first blog post**
- Title: `Hello from Docker Compose!`
- Content: `This WordPress site runs in Docker containers with persistent storage!`
- Click **Publish**

**Visit your blog:**
```
http://localhost:8080
```

You should see your published post!

---

### 9. Test Data Persistence

**Stop everything:**
```bash
docker compose down
```

**Expected output:**
```
[+] Running 3/3
 ✔ Container lab2-wordpress-1  Removed
 ✔ Container lab2-db-1         Removed
 ✔ Network lab2_default        Removed
```

**Verify volumes still exist:**
```bash
docker volume ls | grep lab2
```

**Expected output:**
```
local     lab2_db_data
local     lab2_wordpress_data
```

**Restart the stack:**
```bash
docker compose up -d
```

**Visit the site:**
```
http://localhost:8080
```

**🎉 Your blog is back with all content intact!**

---

### 10. Inspect Volumes

```bash
# List volumes
docker volume ls

# Inspect database volume
docker volume inspect lab2_db_data

# Inspect WordPress volume
docker volume inspect lab2_wordpress_data
```

---

### 11. Access MySQL Directly

```bash
docker compose exec db mysql -uwordpress -pwordpress wordpress
```

**Inside MySQL:**
```sql
SHOW TABLES;
SELECT * FROM wp_posts LIMIT 5;
exit
```

---

### 12. View WordPress Files

```bash
docker compose exec wordpress ls -la /var/www/html
```

Shows WordPress installation files.

---

## Understanding Service Dependencies

**Without `depends_on`:**
- Services start in random order
- WordPress might start before MySQL is ready
- Connection errors

**With `depends_on`:**
```yaml
wordpress:
  depends_on:
    - db
```
- Database starts first
- WordPress waits for database container
- More reliable startup

**Note:** `depends_on` waits for container to start, not for service to be ready. For production, use health checks.

---

## Named Volumes vs Bind Mounts

**Named volumes (this lab):**
```yaml
volumes:
  - db_data:/var/lib/mysql
```
- Managed by Docker
- Persist data across restarts
- Best for databases

**Bind mounts (Lab 1):**
```yaml
volumes:
  - ./app.js:/app/app.js
```
- Maps to host directory
- Best for development

---

## Key Takeaways

✅ Multi-container apps in one file  
✅ `depends_on` controls start order  
✅ Named volumes persist data  
✅ Service names become DNS hostnames  
✅ `docker compose down` preserves volumes  
✅ Production-ready patterns  
✅ Complete stack in minutes  

---

## Production Considerations

**Security:**
```yaml
environment:
  MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}  # Use secrets
```

**Health checks:**
```yaml
db:
  healthcheck:
    test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
    interval: 10s
    timeout: 5s
    retries: 5
```

**Resource limits:**
```yaml
db:
  deploy:
    resources:
      limits:
        memory: 512M
```

---

## Cleanup

**Stop and keep volumes:**
```bash
docker compose down
```

**Stop and remove volumes:**
```bash
docker compose down -v
```

⚠️ **Warning:** `-v` deletes all data!

---

## Quick Commands

```bash
# Start
docker compose up -d

# Stop (keep data)
docker compose down

# Stop (remove data)
docker compose down -v

# View logs
docker compose logs -f

# Restart service
docker compose restart wordpress

# Access MySQL
docker compose exec db mysql -uroot -psomewordpress
```

---

## Next Lab

[Lab 3: Environment Config](../lab3_environment_config/) - Use `.env` files for flexible configuration.
