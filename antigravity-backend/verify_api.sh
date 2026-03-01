#!/bin/bash

API_URL="http://localhost:5001/api"

echo "=== FFN Backend API Verification ==="

# 1. Registration
echo "Testing Registration..."
REG_RES=$(curl -s -X POST "$API_URL/auth/register" \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"test_$(date +%s)@example.com\",\"password\":\"Password123\",\"username\":\"user_$(date +%s)\"}")
echo "$REG_RES"

# 2. Login
echo -e "\nTesting Login..."
# Extract email from REG_RES
EMAIL=$(echo $REG_RES | grep -oE '"email":"[^"]+"' | head -n 1 | cut -d'"' -f4)
LOGIN_RES=$(curl -s -X POST "$API_URL/auth/login" \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"$EMAIL\",\"password\":\"Password123\"}")
echo "Login Response: $LOGIN_RES"
TOKEN=$(echo "$LOGIN_RES" | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')
echo "Token: $TOKEN"

# 3. Create Profile
echo -e "\nTesting Profile Creation..."
curl -s -X POST "$API_URL/profiles/create" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"full_name":"Test User","category":"Model","bio":"Building FFN","location":"San Francisco"}'

# 4. Public Profile Resolver
USERNAME=$(echo $REG_RES | grep -oE '"username":"[^"]+"' | cut -d'"' -f4)
echo -e "\nTesting Public Profile Retrieval for $USERNAME..."
curl -s "$API_URL/public-profile/$USERNAME"

# 5. Tracking View
echo -e "\nTesting Analytics Tracking..."
USER_ID=$(echo $REG_RES | grep -oE '"id":"[^"]+"' | head -n 1 | cut -d'"' -f4)
curl -s -X POST "$API_URL/analytics/track-view" \
     -H "Content-Type: application/json" \
     -d "{\"profileUserId\":\"$USER_ID\"}"

echo -e "\n\n=== Verification Complete ==="
