# Week 2 - Session 3: Dockerfile Fundamentals

Learn to create custom Docker images using Dockerfiles.

## Labs Overview

| Lab | Topic | Time |
|-----|-------|------|
| **Lab 1** | [First Dockerfile](lab1_first_dockerfile/) | 15 min |
| **Lab 2** | [Layer Caching](lab2_layer_caching/) | 10 min |
| **Lab 3** | [Base Images](lab3_base_images/) | 10 min |
| **Lab 4** | [Optimization](lab4_optimization/) | 10 min |
| **Lab 5** | [Multi-Stage Builds](lab5_multistage/) | 10 min |

**Total Time:** ~55 minutes

---

## Prerequisites

- Docker installed and running
- Basic command line knowledge
- Text editor (VS Code, nano, vim)
- Completed Week 1 labs

**Pre-pull images to save time:**
```bash
docker pull node:18-alpine
docker pull node:18-slim
docker pull node:18
docker pull golang:1.21-alpine
```

---

## What You'll Learn

By the end of these labs, you'll be able to:

- Write Dockerfiles from scratch
- Build custom images with `docker build`
- Optimize layer caching for faster builds
- Choose appropriate base images
- Apply production best practices
- Use multi-stage builds for smaller images

---

## Each Lab is Self-Contained

Every lab directory has all the files you need:
- `app.js` or `main.go` (application code)
- `package.json` (if Node.js)
- `Dockerfile` (build instructions)
- `README.md` (lab guide)

Navigate to any lab and start working - no dependencies between labs.

---

## Key Concepts

**Dockerfile Instructions:**
- `FROM` - Base image
- `WORKDIR` - Set working directory
- `COPY` - Copy files into image
- `RUN` - Execute commands during build
- `EXPOSE` - Document which port to use
- `CMD` - Command to run when container starts

**Build Command:**
```bash
docker build -t myapp:v1 .
```

**Layer Caching:**
- Docker caches each instruction
- Order matters - most stable first
- Copy dependencies before code

---

## Tips

- Follow labs in order - each introduces new concepts
- Read error messages carefully - they're usually helpful
- Use `docker images` to see what you've built
- Clean up with `docker rmi <image>` when experimenting
- Check `docker build` output for cache hits

---

## Quick Reference

```bash
# Build image
docker build -t name:tag .

# Build with specific Dockerfile
docker build -f Dockerfile.prod -t name:tag .

# Build without cache
docker build --no-cache -t name:tag .

# List images
docker images

# Remove image
docker rmi name:tag

# View image history
docker history name:tag
```

---

## Common Issues

**Build context too large:**
- Create `.dockerignore` file
- Exclude `node_modules`, `.git`, etc.

**Cache not working:**
- Check instruction order
- Files changed invalidate cache from that point

**Image too big:**
- Use Alpine base images
- Clean up in same RUN command
- Consider multi-stage builds

---

## Next Steps

After completing these labs, you'll be ready for Week 2 Session 4: Data Persistence and Networking.
