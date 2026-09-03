# Internationalization Plan
# Supported locales (planned):
#   - en-IN: English (India) - default
#   - hi-IN: Hindi (India)
#   - ta-IN: Tamil (India)
# Implementation:
#   - Spring MessageSource for backend messages
#   - i18next for frontend translation
#   - Locale detection from Accept-Language header
#   - User preference stored in profile
#   - Date/time formatting per locale
#   - Currency display per locale (INR default)
