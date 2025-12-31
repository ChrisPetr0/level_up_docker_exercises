# Week 1 - Session 2: Working with Images and Containers

Hands-on labs to learn Docker fundamentals through practical examples.

## Labs Overview

| Lab | Topic | Time |
|-----|-------|------|
| **Lab 1** | [Nginx Web Server](lab1_nginx_web_server/) | 5 min |
| **Lab 2** | [Inspect Containers](lab2_inspect_containers/) | 5 min |
| **Lab 3** | [Container Logs](lab3_container_logs/) | 5 min |
| **Lab 4** | [Execute Commands](lab4_execute_commands/) | 5 min |
| **Lab 5** | [Container Lifecycle](lab5_container_lifecycle/) | 5 min |
| **Lab 6** | [Volume Mounts](lab6_volume_mounts/) | 10 min |
| **Lab 7** | [Multiple Containers](lab7_multiple_containers/) | 5 min |
| **Lab 8** | [Container Stats](lab8_container_stats/) | 5 min |
| **Lab 9** | [Cleanup](lab9_cleanup/) | 5 min |

**Total Time:** ~50 minutes

---

## Prerequisites

- Docker installed and running
- Basic command line knowledge
- Port 8080-8085 available

**Verify Docker is working:**
```bash
docker --version
docker ps
```

---

## What You'll Learn

By the end of these labs, you'll be able to:

- Run containers in detached mode with port mapping
- Inspect container configuration and logs
- Execute commands inside running containers
- Manage container lifecycle (stop/start/restart)
- Use volume mounts for persistent data
- Run multiple containers simultaneously
- Monitor container resource usage
- Clean up containers and images

---

## Tips

- Follow labs in order - each builds on the previous
- Copy commands carefully (especially flags like `-d` and `-p`)
- If something doesn't work, check `docker ps` to see container status
- When in doubt, restart: `docker stop <name> && docker rm <name>`

---

## Getting Help

**Common Commands:**
```bash
docker ps           # List running containers
docker ps -a        # List all containers
docker logs <name>  # View container output
docker stop <name>  # Stop a container
docker rm <name>    # Remove a container
```

**Stuck?** Check the container logs first - they usually show what went wrong.
