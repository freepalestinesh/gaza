#!/bin/bash

# Manual Test Script for Gaza API
# This script demonstrates the API functionality
# Prerequisites: API server running on http://localhost:3001

set -e

API_URL="http://localhost:3001"
EMAIL="test@example.com"
PASSWORD="testpass123"

echo "🧪 Gaza API Manual Test Suite"
echo "================================"
echo ""

# Test 1: Health Check
echo "📍 Test 1: Health Check"
echo "GET $API_URL/health"
HEALTH=$(curl -s "$API_URL/health")
echo "Response: $HEALTH"
echo ""

# Test 2: Register User
echo "📍 Test 2: Register User"
echo "POST $API_URL/api/auth/register"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "Response: $REGISTER_RESPONSE"
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token extracted: ${TOKEN:0:20}..."
echo ""

# Test 3: Login
echo "📍 Test 3: Login User"
echo "POST $API_URL/api/auth/login"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "Response: $LOGIN_RESPONSE"
echo ""

# Test 4: Create Profile
echo "📍 Test 4: Create Profile"
echo "POST $API_URL/api/profile"
PROFILE_RESPONSE=$(curl -s -X POST "$API_URL/api/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"firstName":"Ahmed","lastName":"Hassan","location":"Gaza","bio":"Need medical supplies"}')
echo "Response: $PROFILE_RESPONSE"
echo ""

# Test 5: Get Profile
echo "📍 Test 5: Get Profile"
echo "GET $API_URL/api/profile"
GET_PROFILE=$(curl -s -X GET "$API_URL/api/profile" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $GET_PROFILE"
echo ""

# Test 6: Update Profile
echo "📍 Test 6: Update Profile"
echo "PUT $API_URL/api/profile"
UPDATE_PROFILE=$(curl -s -X PUT "$API_URL/api/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"bio":"Need medical supplies and food","needs":["medical","food"]}')
echo "Response: $UPDATE_PROFILE"
echo ""

echo "✅ Manual test suite completed!"
echo ""
echo "⚠️  Note: Run this script with a fresh database or clean up test data afterwards"
echo "   To clean up: DELETE FROM \"Profile\" WHERE \"userId\" IN (SELECT id FROM \"User\" WHERE email = '$EMAIL');"
echo "   Then: DELETE FROM \"User\" WHERE email = '$EMAIL';"
