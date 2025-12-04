---
description: Manage Docker application lifecycle (Stop, Logs, Restart, Build, Start)
---

# Docker Operations

1. Stop the application
   ```bash
   docker-compose down
   ```

2. View live logs
   ```bash
   docker-compose logs -f
   ```

3. Restart the application
   ```bash
   docker-compose restart
   ```

4. Rebuild after code changes
   ```bash
   docker-compose build
   ```

5. Rebuild and start
   ```bash
   docker-compose up -d --build
   ```
