# Docker Volume Configuration
# Volumes: pgdata (PostgreSQL), pgadmin_data (pgAdmin)
# Start: docker compose up -d
# Stop: docker compose down
# Reset: docker compose down -v (deletes data)
# Backup: docker compose exec postgres pg_dump -U ticket_user ticket_booking_system_db > backup.sql
