# Lab 3: Environment Configuration with .env Files

Use environment variables and `.env` files for flexible configuration.

## Objective

Learn to configure Docker Compose applications for different environments (dev/staging/production) without editing YAML files.

---

## What You'll Build

PostgreSQL database with Adminer GUI, configured via environment variables:
- **PostgreSQL 15** - Database server
- **Adminer** - Web-based database management
- **Dynamic config** - Change settings via `.env` file
- **Same YAML** - Works for dev/staging/prod

```
┌──────────────┐
│   Adminer    │ :${ADMIN_PORT}
└──────┬───────┘
       │ DNS: 'postgres'
       ↓
┌──────────────┐
│  PostgreSQL  │ :5432
└──────┬───────┘
       │
       ↓
   Named Volume
```

---

## Files Provided

In this lab directory:
- `docker-compose.yml` - PostgreSQL + Adminer with variables
- `.env.example` - Template for environment variables
- `.env.development` - Development configuration
- `.env.integration` - Integration configuration
- `.env.production` - Production configuration
- `.gitignore` - Prevents committing secrets

---

## Steps

### 1. Navigate to Lab Directory

```bash
cd ~/level_up_curriculum/labs/week_3_session_5/lab3_environment_config
```

---

### 2. Review the Compose File

**Look at `docker-compose.yml`:**

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: postgres-${ENVIRONMENT}
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  adminer:
    image: adminer:latest
    container_name: adminer-${ENVIRONMENT}
    ports:
      - "${ADMIN_PORT}:8080"
    depends_on:
      - postgres
```

**Key point:** `${VARIABLE}` syntax pulls values from `.env` file.

---

### 3. Review the Example .env File

**Look at `.env.example`:**

```bash
cat .env.example
```

**Expected content:**
```bash
# Database Configuration
POSTGRES_PASSWORD=your_password_here
POSTGRES_USER=your_username
POSTGRES_DB=your_database

# Adminer Configuration
ADMIN_PORT=8080

# App Configuration
ENVIRONMENT=development
```

---

### 4. Create Your .env File

**Copy the example:**
```bash
cp .env.example .env
```

**Or create manually:**
```bash
cat > .env << 'EOF'
POSTGRES_PASSWORD=dev_password_123
POSTGRES_USER=devuser
POSTGRES_DB=development_db
ADMIN_PORT=8080
ENVIRONMENT=development
EOF
```

**Important:** `.env` files use `KEY=VALUE` format, no spaces around `=`.

---

### 5. View Resolved Configuration

```bash
docker compose config
```

**Notice:** All `${VARIABLE}` replaced with values from `.env` file!

**Example output:**
```yaml
services:
  postgres:
    container_name: postgres-development
    environment:
      POSTGRES_DB: development_db
      POSTGRES_PASSWORD: dev_password_123
      POSTGRES_USER: devuser
```

---

### 6. Start the Stack

```bash
docker compose up -d
```

**Expected output:**
```
[+] Running 3/3
 ✔ Network lab3_default        Created
 ✔ Volume "lab3_postgres_data" Created
 ✔ Container postgres-development Started
 ✔ Container adminer-development  Started
```

---

### 7. Verify Services

```bash
docker compose ps
```

**Expected output:**
```
NAME                   IMAGE                STATUS    PORTS
adminer-development    adminer:latest       Up        0.0.0.0:8080->8080/tcp
postgres-development   postgres:15-alpine   Up        5432/tcp
```

---

### 8. Access Adminer

**Open browser:**
```
http://localhost:8080
```

**Login:**
- System: `PostgreSQL`
- Server: `postgres`
- Username: `devuser` (from your `.env`)
- Password: `dev_password_123` (from your `.env`)
- Database: `development_db` (from your `.env`)

Click **Login** - you're in!

---

### 9. Create Test Data

**In Adminer:**
- Click **SQL command**
- Run this query:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100)
);

INSERT INTO users (name, email) VALUES
    ('Alice', 'alice@example.com'),
    ('Bob', 'bob@example.com'),
    ('Charlie', 'charlie@example.com');

SELECT * FROM users;
```

You should see your 3 users!

---

### 10. Switch to Production Config

**Stop the dev environment:**
```bash
docker compose down
```

**Use production .env file:**
```bash
docker compose --env-file .env.production up -d
```

**Check what's running:**
```bash
docker compose -p lab3-prod ps
```

**Container names changed:**
- `postgres-production`
- `adminer-production`

**Access Adminer:**
```
http://localhost:8082
```

(Note different port from `.env.production`)

---

### 11. Run Multiple Environments Simultaneously

**Start all three environments:**

```bash
# Development
docker compose --env-file .env.development -p lab3-dev up -d

# Integration
docker compose --env-file .env.integration -p lab3-int up -d

# Production
docker compose --env-file .env.production -p lab3-prod up -d
```

**Access each:**
- Dev: `http://localhost:8080`
- Integration: `http://localhost:8081`
- Production: `http://localhost:8082`

**View all:**
```bash
docker compose -p lab3-dev ps
docker compose -p lab3-int ps
docker compose -p lab3-prod ps
```

---

### 12. View Logs from Specific Environment

```bash
docker compose -p lab3-dev logs -f
```

---

## Understanding .env Files

**Format:**
```bash
KEY=value           # Simple value
KEY="value"         # Quoted (for spaces)
KEY=${OTHER_KEY}    # Reference another variable
# Comment
```

**Docker Compose automatically loads:**
1. `.env` file in same directory
2. Can override with `--env-file` flag

**Security best practices:**
```bash
# .gitignore
.env
.env.local
.env.*.local
```

Never commit files with real passwords!

---

## Environment Variable Priority

**Highest to lowest:**
1. Command line: `-e KEY=value`
2. Environment variables in shell
3. `--env-file` flag
4. `.env` file
5. `environment:` in compose file
6. Dockerfile `ENV`

---

## Key Takeaways

✅ `.env` files configure without editing YAML  
✅ Same compose file for dev/staging/prod  
✅ `${VARIABLE}` syntax in compose file  
✅ `docker compose config` shows resolved values  
✅ `--env-file` overrides default `.env`  
✅ `-p` flag runs multiple environments  
✅ Never commit `.env` files with secrets  

---

## Production Considerations

**Use secrets manager:**
```bash
# Instead of .env
export POSTGRES_PASSWORD=$(aws secretsmanager get-secret-value ...)
docker compose up -d
```

**Or Docker secrets (Swarm mode):**
```yaml
secrets:
  db_password:
    external: true

services:
  postgres:
    secrets:
      - db_password
```

**Environment-specific files:**
```
.env.example        # Template (commit this)
.env.development    # Dev config (commit if no secrets)
.env.production     # Prod config (NEVER commit)
```

---

## Cleanup

**Stop specific environment:**
```bash
docker compose -p lab3-dev down
```

**Stop all environments:**
```bash
docker compose -p lab3-dev down
docker compose -p lab3-int down
docker compose -p lab3-prod down
```

**Remove volumes:**
```bash
docker compose -p lab3-dev down -v
```

---

## Quick Reference

```bash
# Use default .env
docker compose up -d

# Use specific .env file
docker compose --env-file .env.production up -d

# View resolved config
docker compose config

# Multiple environments with project names
docker compose -p myapp-dev up -d
docker compose -p myapp-prod up -d

# Override single variable
docker compose -e POSTGRES_PASSWORD=newpass up -d
```

---

## Congratulations!

You've completed Week 3 Session 5! You now know:

✅ How to write Docker Compose files  
✅ How to deploy multi-container applications  
✅ How to use service dependencies  
✅ How to persist data with volumes  
✅ How to configure with environment variables  
✅ How to manage multiple environments  

**Next:** Week 3 Session 6 - Docker Swarm orchestration
