# Week 3 - Session 5: Docker Compose Introduction

Learn to orchestrate multi-container applications with Docker Compose.

## Labs Overview

| Lab | Topic | Time |
|-----|-------|------|
| **Lab 1** | [First Compose File](lab1_first_compose/) | 10 min |
| **Lab 2** | [WordPress + MySQL](lab2_wordpress_mysql/) | 12 min |
| **Lab 3** | [Environment Config](lab3_environment_config/) | 10 min |

**Total Time:** ~35 minutes

---

## Prerequisites

- Docker installed (20.10+)
- Docker Compose installed (v2.0+)
- Completed Week 2 labs (Dockerfiles, volumes, networks)
- Basic understanding of YAML syntax

**Verify installation:**
```bash
docker --version
docker compose version
```

---

## What You'll Learn

By the end of these labs, you'll be able to:

- Write Docker Compose YAML files
- Deploy multi-container applications with one command
- Use bind mounts for development workflows
- Configure services with environment variables
- Implement data persistence with named volumes
- Connect containers via automatic DNS
- Manage application lifecycle with Compose commands

---

## What is Docker Compose?

**Before Compose (Week 2):**
```bash
docker network create app-net
docker volume create db-data
docker run -d --name db --network app-net -v db-data:/var/lib/mysql mysql
docker run -d --name api --network app-net -e DB_HOST=db my-api
docker run -d --name web --network app-net -p 80:80 my-web
```

**With Compose:**
```yaml
# docker-compose.yml
services:
  db:
    image: mysql
    volumes:
      - db-data:/var/lib/mysql
  api:
    image: my-api
    environment:
      - DB_HOST=db
  web:
    image: my-web
    ports:
      - "80:80"
volumes:
  db-data:
```

```bash
docker compose up -d  # One command!
```

---

## Key Concepts

**Services:**
- Container definitions in YAML
- Can use `image:` or `build:`
- Each service is a container

**Networks:**
- Automatic DNS between services
- Services communicate by name
- Isolated by default

**Volumes:**
- Named volumes for persistence
- Bind mounts for development
- Defined once, used by multiple services

**Environment Variables:**
- Configure without rebuilding
- Use `.env` files
- Override with `-e` flag

---

## Docker Compose Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View running services
docker compose ps

# View logs
docker compose logs
docker compose logs -f          # Follow mode
docker compose logs web         # Specific service

# Restart services
docker compose restart
docker compose restart web      # Specific service

# Build/rebuild images
docker compose build
docker compose up --build

# Execute commands in service
docker compose exec web sh

# View config (resolves variables)
docker compose config
```

---

## YAML Syntax Basics

**Key-value pairs:**
```yaml
key: value
```

**Lists:**
```yaml
ports:
  - "8080:80"
  - "8443:443"
```

**Nested structures:**
```yaml
services:
  web:
    image: nginx
    ports:
      - "80:80"
```

**Important:**
- Use **2 spaces** for indentation (NO TABS!)
- Strings usually don't need quotes
- Use quotes for numbers in ports: `"8080:80"`

---

## What You'll Build

**Lab 1: First Compose App**
- Node.js + Redis visit counter
- Learn Compose file structure
- Use bind mounts for live editing

**Lab 2: WordPress + MySQL**
- Production-ready CMS
- Service dependencies
- Named volumes for persistence

**Lab 3: Environment Config**
- PostgreSQL + Adminer GUI
- Use `.env` files
- Dev/staging/prod configs

---

## Tips

- Keep `docker-compose.yml` in project root
- Use `.env` for secrets (add to `.gitignore`)
- Service names become DNS hostnames
- Use `docker compose config` to debug
- Always use version control
- Don't commit `.env` files with secrets

---

## Common Issues

**YAML indentation errors:**
```bash
# Validate syntax
docker compose config
```

**Port already in use:**
```bash
# Change port in compose file
ports:
  - "8081:80"  # Use different host port
```

**Services can't connect:**
- Check service names (used as hostnames)
- Verify all services on same network
- Check environment variables

---

## Quick Reference

```bash
# Start (build if needed)
docker compose up --build -d

# Stop and remove
docker compose down

# Stop and remove with volumes
docker compose down -v

# View logs
docker compose logs -f

# Execute command
docker compose exec service-name sh

# Restart service
docker compose restart service-name

# View running services
docker compose ps

# Validate YAML
docker compose config
```

---

## Next Steps

After completing these labs, you'll be ready for Week 3 Session 6: Docker Swarm orchestration.
