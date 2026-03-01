#!/bin/bash

API_URL="http://localhost:5001"

echo "=== FFN Messaging Flow Verification ==="

# 1. Register two users
echo "Registering User A..."
TS=$(date +%s)
REG_A=$(curl -s -X POST "$API_URL/api/auth/register" \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"user_a_$TS@example.com\",\"password\":\"Password123\",\"username\":\"user_a_$TS\"}")
ID_A=$(echo "$REG_A" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')

echo "Registering User B..."
REG_B=$(curl -s -X POST "$API_URL/api/auth/register" \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"user_b_$TS@example.com\",\"password\":\"Password123\",\"username\":\"user_b_$TS\"}")
ID_B=$(echo "$REG_B" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')

# 2. Login User A
echo -e "\nLogging in User A..."
LOGIN_A=$(curl -s -X POST "$API_URL/api/auth/login" \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"user_a_$TS@example.com\",\"password\":\"Password123\"}")
TOKEN_A=$(echo "$LOGIN_A" | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')

echo "ID_A: $ID_A"
echo "ID_B: $ID_B"
echo "TOKEN_A length: ${#TOKEN_A}"

if [ -z "$TOKEN_A" ]; then 
    echo "Login A failed. Response: $LOGIN_A"
    exit 1
fi

# 3. User A sends message to User B
echo -e "\n1. User A sending message to User B..."
SEND_RES=$(curl -s -X POST "$API_URL/api/messages/send" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN_A" \
     -d "{\"receiver_id\":\"$ID_B\",\"message\":\"Hello from User A!\"}")
echo "Response: $SEND_RES"

# 4. User A retrieves conversation with User B
echo -e "\n2. User A retrieving conversation with User B..."
CONV_RES=$(curl -s -X GET "$API_URL/api/messages/conversation?otherUserId=$ID_B" \
     -H "Authorization: Bearer $TOKEN_A")
echo "Response: $CONV_RES"

echo -e "\n\n=== Messaging Verification Complete ==="
