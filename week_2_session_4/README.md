# Week 2 - Session 4: Data Persistence and Networking

Learn to manage persistent data and connect containers using Docker volumes and networks.

## Labs Overview

| Lab | Topic | Time |
|-----|-------|------|
| **Lab 1** | [Volume Persistence](lab1_volume_persistence/) | 5 min |
| **Lab 2** | [MySQL Persistence](lab2_mysql_persistence/) | 10 min |
| **Lab 3** | [Network DNS](lab3_network_dns/) | 10 min |
| **Lab 4** | [Multi-Container App](lab4_multi_container_app/) | 15 min |
| **Lab 5** | [Environment Config](lab5_environment_config/) | 10 min |
| **Lab 6** | [Backup & Restore](lab6_backup_restore/) | 10 min |

**Total Time:** ~60 minutes

---

## Prerequisites

- Docker installed and running
- Completed Week 2 Session 3 (Dockerfiles)
- Basic command line knowledge
- Text editor for Lab 4 and 5

**Pre-pull images to save time:**
```bash
docker pull alpine
docker pull mysql:8.0
docker pull redis:alpine
docker pull node:18-alpine
```

---

## What You'll Learn

By the end of these labs, you'll be able to:

- Create and manage Docker volumes
- Persist database data across container restarts
- Create custom networks for container communication
- Use DNS to connect containers by name
- Build multi-container applications
- Configure containers with environment variables
- Backup and restore volume data

---

## Key Concepts

**Volumes:**
- Persist data beyond container lifecycle
- Shared between containers
- Managed by Docker
- Stored outside container filesystem

**Networks:**
- Isolate container communication
- Automatic DNS resolution
- Connect multiple containers
- Security through isolation

**Environment Variables:**
- Configure containers without rebuilding
- Different configs for dev/staging/prod
- Pass secrets and settings
- 12-Factor App methodology

---

## Volume Commands

```bash
# Create volume
docker volume create mydata

# List volumes
docker volume ls

# Inspect volume
docker volume inspect mydata

# Remove volume
docker volume rm mydata

# Remove all unused volumes
docker volume prune
```

---

## Network Commands

```bash
# Create network
docker network create mynet

# List networks
docker network ls

# Inspect network
docker network inspect mynet

# Connect container to network
docker network connect mynet container-name

# Remove network
docker network rm mynet
```

---

## Tips

- Follow labs in order - each builds on previous concepts
- Volumes persist until explicitly deleted
- Custom networks provide automatic DNS
- Use `--rm` flag for temporary containers
- Environment variables configure without rebuilding

---

## Common Patterns

**Database with persistence:**
```bash
docker volume create db-data
docker run -d --name postgres \
  -v db-data:/var/lib/postgresql/data \
  postgres:15
```

**Multi-container with network:**
```bash
docker network create app-net
docker run -d --name db --network app-net postgres:15
docker run -d --name api --network app-net -e DB_HOST=db my-api
```

**Development vs Production:**
```bash
# Same image, different configs
docker run -e NODE_ENV=development my-app
docker run -e NODE_ENV=production my-app
```

---

## Data Directories for Common Databases

- **MySQL:** `/var/lib/mysql`
- **PostgreSQL:** `/var/lib/postgresql/data`
- **MongoDB:** `/data/db`
- **Redis:** `/data`

---

## Next Steps

After completing these labs, you'll be ready for Week 3: Docker Compose for multi-container orchestration.
