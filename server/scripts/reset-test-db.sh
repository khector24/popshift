#!/usr/bin/env bash

# Stop if a command fails, an undefined variable is used,
# or a command inside a pipeline fails.
set -euo pipefail

# Test database configuration.
TEST_DB_NAME="regionlore_test"
TEST_DB_USER="regionlore_user"
TEST_DATABASE_URL="postgresql://${TEST_DB_USER}@localhost/${TEST_DB_NAME}"

# Find the server directory based on where this script lives.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Make sure npm commands run from server/.
cd "${SERVER_DIR}"

echo "Resetting ${TEST_DB_NAME}..."

# Delete the old test database and create a fresh empty one.
dropdb --if-exists "${TEST_DB_NAME}"
createdb -O "${TEST_DB_USER}" "${TEST_DB_NAME}"

# Rebuild the database schema.
echo "Running migrations..."
DATABASE_URL="${TEST_DATABASE_URL}" npm run migrate:up

# Populate the fresh schema with the data needed by our backend tests.
echo "Seeding data sources..."
DATABASE_URL="${TEST_DATABASE_URL}" npm run seed:data-sources

echo "Seeding data releases..."
DATABASE_URL="${TEST_DATABASE_URL}" npm run seed:data-releases

echo "Seeding geography..."
DATABASE_URL="${TEST_DATABASE_URL}" npm run seed:geography

echo "Seeding population history..."
DATABASE_URL="${TEST_DATABASE_URL}" npm run seed:population-history

echo "Seeding city ACS data..."
DATABASE_URL="${TEST_DATABASE_URL}" npm run seed:city-acs

echo "Seeding city climate..."
DATABASE_URL="${TEST_DATABASE_URL}" node src/scripts/seedCityClimate.js

echo "Seeding city crime..."
DATABASE_URL="${TEST_DATABASE_URL}" node src/scripts/seedCityCrime.js

echo
echo "Test database reset complete."
echo "Database: ${TEST_DB_NAME}"
