#!/bin/bash

API_URL="http://localhost:5001"
echo "=== FFN Master System Audit & Verification ==="

# --- Step 1: Authentication Audit ---
echo -e "\n1. Auditing Authentication System..."
TS=$(date +%s)
REG_RES=$(curl -s -X POST "$API_URL/api/auth/register" \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"audit_$TS@example.com\",\"password\":\"Password123\",\"username\":\"auditor_$TS\"}")
USER_ID=$(echo "$REG_RES" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')

if [ -z "$USER_ID" ]; then echo "[-] Auth Audit Failed: Registration failed."; exit 1; fi
echo "[+] Auth Audit: User registration successful ($USER_ID)"

LOGIN_RES=$(curl -s -X POST "$API_URL/api/auth/login" \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"audit_$TS@example.com\",\"password\":\"Password123\"}")
TOKEN=$(echo "$LOGIN_RES" | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')

if [ -z "$TOKEN" ]; then echo "[-] Auth Audit Failed: Login failed."; exit 1; fi
echo "[+] Auth Audit: Login and session creation successful."

# --- Step 2: Database Audit ---
echo -e "\n2. Auditing Database Schema & Relationships..."
# Testing Profile Creation
PROF_RES=$(curl -s -X POST "$API_URL/api/profiles/create" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d "{\"full_name\":\"Master Auditor\",\"username\":\"auditor_$TS\",\"bio\":\"System Auditor\",\"location\":\"Cloud\",\"category\":\"MODELS\",\"profile_type\":\"MODEL\"}")
echo "Profile Response: $PROF_RES"

# --- Step 3: Media & Storage Audit ---
echo -e "\n3. Auditing Media System..."
MEDIA_RES=$(curl -s -X POST "$API_URL/api/media/upload" -H "Authorization: Bearer $TOKEN")
echo "Media Response: $MEDIA_RES"

# --- Step 4: Payment System Audit (PayPal) ---
echo -e "\n4. Auditing Payment System Foundation..."
PAY_RES=$(curl -s -X POST "$API_URL/api/payments/create-order" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"amount":"1.00","currency":"USD"}')
echo "Payment Response: $PAY_RES"

# --- Step 5: Casting Call System Audit ---
echo -e "\n5. Auditing Casting Call System..."
CAST_RES=$(curl -s -X POST "$API_URL/api/casting-calls/create" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"company_name":"Audit Corp","role_title":"Auditor","category":"Fashion","location":"Remote","budget":"0"}')
echo "Casting Response: $CAST_RES"

# --- Step 6: Analytics System Audit ---
echo -e "\n6. Auditing Analytics Tracking..."
AN_RES=$(curl -s -X POST "$API_URL/api/analytics/track-view" \
     -H "Content-Type: application/json" \
     -d "{\"profile_user_id\":\"$USER_ID\"}")
echo "Analytics Response: $AN_RES"

# --- Step 7: API Performance Check ---
echo -e "\n7. Auditing API Performance..."
START=$(date +%s%N)
curl -s "$API_URL/api/casting-calls" > /dev/null
END=$(date +%s%N)
DIFF=$((($END - $START)/1000000))
echo "[+] Performance Audit: GET /api/casting-calls took ${DIFF}ms."
if [ $DIFF -lt 500 ]; then echo "[+] Performance Audit: Response time is within limits (<500ms)."; else echo "[-] Performance Audit: Latency exceeded 500ms."; fi

echo -e "\n=== Master Audit Complete ==="
