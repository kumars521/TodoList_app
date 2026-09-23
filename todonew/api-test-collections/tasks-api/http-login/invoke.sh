#!/usr/bin/env bash
set -euo pipefail
curl -sS -i -X POST "http://localhost:7071/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'
