#!/bin/bash

BASE_URL="https://localhost:7195/api"

echo "=== Testing JWT Authentication ==="
echo ""

# Check if API is running
echo "Checking if API is running..."
if ! curl -k -s --connect-timeout 2 "$BASE_URL" > /dev/null 2>&1; then
    echo "❌ API is not running or not accessible at $BASE_URL"
    echo "Please start the API with: dotnet run --project ReservationApp.API"
    exit 1
fi
echo "✅ API is running"
echo ""

echo "1. Registering user..."
REGISTER_RESPONSE=$(curl -k -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"123456"}')

HTTP_CODE=$(echo "$REGISTER_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
RESPONSE_BODY=$(echo "$REGISTER_RESPONSE" | sed '/HTTP_CODE/d')

echo "HTTP Status: $HTTP_CODE"
echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
echo ""

echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -k -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"123456"}')

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
RESPONSE_BODY=$(echo "$LOGIN_RESPONSE" | sed '/HTTP_CODE/d')

echo "HTTP Status: $HTTP_CODE"
TOKEN=$(echo "$RESPONSE_BODY" | jq -r '.token' 2>/dev/null)
echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
echo ""

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo "❌ Failed to get token. Please check the login response above."
    exit 1
fi

echo "Token received: ${TOKEN:0:50}..."
echo ""

echo "3. Fetching user info (protected endpoint)..."
USER_RESPONSE=$(curl -k -s -w "\nHTTP_CODE:%{http_code}" -X GET "$BASE_URL/users/me" \
    -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$USER_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
RESPONSE_BODY=$(echo "$USER_RESPONSE" | sed '/HTTP_CODE/d')

echo "HTTP Status: $HTTP_CODE"
echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
echo ""

echo "4. Testing role-based authorization (regular user trying to access admin endpoint)..."
ADMIN_ENDPOINT_RESPONSE=$(curl -k -s -w "\nHTTP_CODE:%{http_code}" -X GET "$BASE_URL/users" \
    -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$ADMIN_ENDPOINT_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
RESPONSE_BODY=$(echo "$ADMIN_ENDPOINT_RESPONSE" | sed '/HTTP_CODE/d')

echo "HTTP Status: $HTTP_CODE (Expected: 403 Forbidden)"
echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
echo ""

if [ "$HTTP_CODE" = "403" ]; then
    echo "✅ Regular user correctly denied access to admin endpoint"
else
    echo "⚠️  Unexpected response - regular user should be denied (403)"
fi
echo ""

echo "5. Logging in as admin..."
ADMIN_LOGIN_RESPONSE=$(curl -k -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"admin123"}')

HTTP_CODE=$(echo "$ADMIN_LOGIN_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
RESPONSE_BODY=$(echo "$ADMIN_LOGIN_RESPONSE" | sed '/HTTP_CODE/d')

echo "HTTP Status: $HTTP_CODE"
ADMIN_TOKEN=$(echo "$RESPONSE_BODY" | jq -r '.token' 2>/dev/null)
echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
echo ""

if [ -z "$ADMIN_TOKEN" ] || [ "$ADMIN_TOKEN" = "null" ]; then
    echo "❌ Failed to get admin token. Please check the login response above."
    echo "Note: Admin user should be created by DbSeeder on first run."
    exit 1
fi

echo "Admin token received: ${ADMIN_TOKEN:0:50}..."
echo ""

echo "6. Testing admin access to admin endpoint (get all users)..."
ADMIN_ACCESS_RESPONSE=$(curl -k -s -w "\nHTTP_CODE:%{http_code}" -X GET "$BASE_URL/users" \
    -H "Authorization: Bearer $ADMIN_TOKEN")

HTTP_CODE=$(echo "$ADMIN_ACCESS_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
RESPONSE_BODY=$(echo "$ADMIN_ACCESS_RESPONSE" | sed '/HTTP_CODE/d')

echo "HTTP Status: $HTTP_CODE (Expected: 200 OK)"
echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Admin successfully accessed admin endpoint"
else
    echo "❌ Admin access failed - expected 200, got $HTTP_CODE"
fi
echo ""

echo "=== Test Complete ==="

