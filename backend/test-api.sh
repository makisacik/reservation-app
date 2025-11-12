#!/bin/bash

# API Testing Script for ReservationApp
# This script tests the API endpoints using curl

set -e

BASE_URL="https://localhost:7195"
# Uncomment to use HTTP instead of HTTPS
# BASE_URL="http://localhost:5053"

echo "=== ReservationApp API Testing ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Testing GET /api/reservations (Get All Reservations)${NC}"
RESPONSE=$(curl -s -k -m 10 -w "\n%{http_code}" "$BASE_URL/api/reservations" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✓ Success (HTTP $HTTP_CODE)${NC}"
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}✗ Failed (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi
echo ""

# Get first reservation ID for testing
echo -e "${YELLOW}2. Getting first reservation ID...${NC}"
FIRST_ID=$(curl -s -k -m 10 "$BASE_URL/api/reservations" 2>&1 | jq -r '.[0].id' 2>/dev/null || echo "")

if [ -z "$FIRST_ID" ] || [ "$FIRST_ID" = "null" ]; then
    echo -e "${RED}✗ No reservations found. Cannot test GET by ID.${NC}"
else
    echo -e "${GREEN}✓ Found reservation ID: $FIRST_ID${NC}"
    echo ""
    
    echo -e "${YELLOW}3. Testing GET /api/reservations/{id} (Get Reservation by ID)${NC}"
    RESPONSE=$(curl -s -k -m 10 -w "\n%{http_code}" "$BASE_URL/api/reservations/$FIRST_ID" 2>&1)
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" -eq 200 ]; then
        echo -e "${GREEN}✓ Success (HTTP $HTTP_CODE)${NC}"
        echo "Response:"
        echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    else
        echo -e "${RED}✗ Failed (HTTP $HTTP_CODE)${NC}"
        echo "$BODY"
    fi
    echo ""
fi

# Test creating a new reservation
echo -e "${YELLOW}4. Testing POST /api/reservations (Create New Reservation)${NC}"
FUTURE_DATE=$(date -u -v+14d +"%Y-%m-%dT19:00:00Z" 2>/dev/null || date -u -d "+14 days" +"%Y-%m-%dT19:00:00Z" 2>/dev/null || echo "2025-12-01T19:00:00Z")

RESPONSE=$(curl -s -k -m 10 -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations" \
  -H "Content-Type: application/json" \
  -d "{
    \"customerName\": \"Test User $(date +%s)\",
    \"date\": \"$FUTURE_DATE\",
    \"guests\": 4
  }" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 201 ]; then
    echo -e "${GREEN}✓ Success (HTTP $HTTP_CODE)${NC}"
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    NEW_ID=$(echo "$BODY" | jq -r '.id' 2>/dev/null || echo "")
else
    echo -e "${RED}✗ Failed (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi
echo ""

# Test validation - invalid guests
echo -e "${YELLOW}5. Testing Validation - Invalid Guests (0)${NC}"
RESPONSE=$(curl -s -k -m 10 -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations" \
  -H "Content-Type: application/json" \
  -d "{
    \"customerName\": \"Test User\",
    \"date\": \"$FUTURE_DATE\",
    \"guests\": 0
  }" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 400 ]; then
    echo -e "${GREEN}✓ Validation working (HTTP $HTTP_CODE)${NC}"
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${YELLOW}⚠ Expected 400, got HTTP $HTTP_CODE${NC}"
    echo "$BODY"
fi
echo ""

echo -e "${GREEN}=== Testing Complete ===${NC}"
echo ""
echo "To view the API in Swagger UI, open:"
echo "  $BASE_URL/swagger"
echo ""

