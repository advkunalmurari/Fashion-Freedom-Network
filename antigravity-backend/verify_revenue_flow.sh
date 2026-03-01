#!/bin/bash

API_URL="http://localhost:5001"

echo "=== FFN Revenue Flow Verification ==="

# 1. Register to get user
echo "Registering..."
TS=$(date +%s)
REG_RES=$(curl -s -X POST "$API_URL/api/auth/register" \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"rev_test_$TS@example.com\",\"password\":\"Password123\",\"username\":\"rev_user_$TS\"}")
echo "Registration: $REG_RES"

# 2. Login to get token
echo -e "\nLogging in..."
LOGIN_RES=$(curl -s -X POST "$API_URL/api/auth/login" \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"rev_test_$TS@example.com\",\"password\":\"Password123\"}")
TOKEN=$(echo "$LOGIN_RES" | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')

if [ -z "$TOKEN" ]; then
    echo "Login failed."
    exit 1
fi

# 3. Create Casting Call
echo -e "\n1. Testing Casting Call Creation..."
CASTING_RES=$(curl -s -X POST "$API_URL/api/casting-calls/create" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d "{\"company_name\":\"FFN Productions\",\"role_title\":\"Lead Model\",\"category\":\"Fashion\",\"location\":\"Milan\",\"budget\":\"5000\",\"description\":\"Main stage show\",\"contact_email\":\"rev_test_$TS@example.com\"}")
echo "Response: $CASTING_RES"

# 4. List Casting Calls
echo -e "\n2. Testing Listing Casting Calls..."
curl -s "$API_URL/api/casting-calls" | jq '.data[0]' || curl -s "$API_URL/api/casting-calls"

# 5. Initiate Payment Order
echo -e "\n3. Testing PayPal Order Creation..."
PAYMENT_RES=$(curl -s -X POST "$API_URL/api/payments/create-order" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"amount":"10.00","currency":"USD"}')
echo "Response: $PAYMENT_RES"

# 6. Create Photoshoot Booking
echo -e "\n4. Testing Photoshoot Booking..."
BOOKING_RES=$(curl -s -X POST "$API_URL/api/photoshoots/book" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"package_type":"Premium Editorial","price":200,"preferred_date":"2026-03-01","location":"Milan Studio"}')
echo "Response: $BOOKING_RES"

echo -e "\n\n=== Revenue Verification Complete ==="
