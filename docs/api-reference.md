# API Reference
# Base URL: http://localhost:8080/api
# Auth: POST /auth/login -> { email, password } -> { token, refreshToken }
# Restaurants: GET /restaurants, GET /restaurants/{id}, GET /restaurants/search?q=
# Tables: GET /tables/match?restaurantId=&partySize=&zone=
# Slots: GET /slots/availability?restaurantId=&date=&partySize=
# Reservations: POST /reservations, POST /reservations/{id}/pay, POST /reservations/{id}/cancel
# Payments: POST /payments/process, GET /payments/{id}, POST /payments/{id}/refund
# Notifications: GET /notifications, PUT /notifications/{id}/read
