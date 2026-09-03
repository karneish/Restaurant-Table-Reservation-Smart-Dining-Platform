# Smart Table Matching Algorithm
# Input: partySize, restaurantId, optional: zone, accessible, quiet
# Process:
#   1. Filter tables by restaurant and availability (READY cleaning status)
#   2. Score each table based on:
#      - Capacity match (exact or closest above)
#      - Zone preference (if specified)
#      - Accessibility requirement
#      - Quiet corner preference
#   3. Consider grouping (multiple small tables for large parties)
#   4. Sort by score (highest first)
#   5. Return top matches with reasons
# Scoring weights:
#   - Capacity match: 40%
#   - Zone match: 25%
#   - Accessibility: 20%
#   - Quiet preference: 15%
