# Reservation State Machine
# States: HOLD -> CONFIRMED -> SEATED -> COMPLETED
#         HOLD -> CANCELLED
#         CONFIRMED -> CANCELLED
#         CONFIRMED -> NO_SHOW
#
# HOLD: Temporary reservation (15 min expiry)
#   - Tables locked for this reservation
#   - Deposit not yet paid
# CONFIRMED: Deposit paid, reservation guaranteed
#   - Pre-order may be placed
# SEATED: Guest has arrived, dining in progress
#   - Waiter can be called
#   - Bill can be requested
#   - Virtual QR payment available
# COMPLETED: Visit finished, bill settled
#   - Feedback can be submitted
#   - Tables set to DIRTY for cleaning
# CANCELLED/NO_SHOW: Terminal states, tables released
