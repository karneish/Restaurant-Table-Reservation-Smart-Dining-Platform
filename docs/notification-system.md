# Notification System
# Types: Reservation confirmed, cancelled, reminder, waitlist available,
#   payment received, pre-order update, table ready, feedback request
# Channels:
#   - In-app: Stored in notifications table, shown via API
#   - Email: Simulated (logged to console, no SMTP required)
#   - SMS: Future implementation
# Delivery: Synchronous on event trigger
# Read status: Individual and bulk mark-as-read
# Notification preferences: Per-user settings (future)
