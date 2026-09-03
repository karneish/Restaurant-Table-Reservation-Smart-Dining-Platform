# Deployment Guide
# 1. Local: Docker Compose (scripts/run-all.ps1) -> http://localhost:3000
# 2. Cloud: Render (backend) + Neon (database) + Vercel (frontend)
#    Config: render.yaml Blueprint
# 3. Production: docker-compose.prod.yml with resource limits
# 4. Manual: mvn clean package && java -jar target/*.jar
