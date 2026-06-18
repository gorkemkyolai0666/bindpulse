#!/bin/bash
# Provision Railway project, PostgreSQL, backend service, and GitHub connection.
# Requires RAILWAY_API_TOKEN. Optional: RAILWAY_WORKSPACE_ID, GITHUB_REPOSITORY, JWT_SECRET.
set -euo pipefail

API_URL="https://backboard.railway.com/graphql/v2"
PROJECT_NAME="${PROJECT_NAME:-project-name}"
BACKEND_SERVICE_NAME="${PROJECT_NAME}-backend"
CONFIG_PATH="backend/.railway/config.json"
GITHUB_REPO="${GITHUB_REPOSITORY:-gorkemkyolai0666/${PROJECT_NAME}}"

if [ -z "${RAILWAY_API_TOKEN:-}" ]; then
  echo "RAILWAY_API_TOKEN is required"
  exit 1
fi

if [ -f "$CONFIG_PATH" ]; then
  echo "Railway config already exists at $CONFIG_PATH — skipping provisioning"
  exit 0
fi

gql() {
  local query="$1"
  curl -sS -X POST "$API_URL" \
    -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$query"
}

# --- Workspace ID: env var or auto-detect (tries multiple Railway API queries) ---
if [ -n "${RAILWAY_WORKSPACE_ID:-}" ]; then
  WORKSPACE_ID="$RAILWAY_WORKSPACE_ID"
  echo "Using RAILWAY_WORKSPACE_ID from environment: $WORKSPACE_ID"
else
  echo "RAILWAY_WORKSPACE_ID not set — auto-detecting workspace ID from Railway API..."

  WORKSPACE_ID=""

  # Query: me.workspaces (confirmed working Railway API endpoint)
  RESP=$(gql '{"query":"{ me { workspaces { id name } } }"}')
  WORKSPACE_ID=$(echo "$RESP" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    ws = d.get('data', {}).get('me', {}).get('workspaces', [])
    if ws: print(ws[0]['id'])
except: pass
" 2>/dev/null || echo "")

  if [ -z "$WORKSPACE_ID" ]; then
    echo "ERROR: Could not auto-detect Railway workspace ID."
    echo "Please add RAILWAY_WORKSPACE_ID to GitHub org secrets."
    echo "Query your workspace ID with:"
    echo "  curl -s -X POST https://backboard.railway.com/graphql/v2 -H 'Authorization: Bearer \$RAILWAY_API_TOKEN' -H 'Content-Type: application/json' -d '{\"query\":\"{ me { workspaces { id name } } }\"}'"
    exit 1
  fi
  echo "Auto-detected workspace ID: $WORKSPACE_ID"
fi

echo "Creating Railway project: $PROJECT_NAME"
PROJECT_RESPONSE=$(gql "{\"query\":\"mutation { projectCreate(input: { name: \\\"$PROJECT_NAME\\\", workspaceId: \\\"$WORKSPACE_ID\\\" }) { id name } }\"}")

PROJECT_ID=$(echo "$PROJECT_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if 'errors' in data:
    print('ERROR:' + str(data['errors']), file=sys.stderr)
    sys.exit(1)
print(data['data']['projectCreate']['id'])
")

echo "Project ID: $PROJECT_ID"

echo "Fetching production environment..."
ENV_RESPONSE=$(gql "{\"query\":\"query { project(id: \\\"$PROJECT_ID\\\") { environments { edges { node { id name } } } } }\"}")

ENVIRONMENT_ID=$(echo "$ENV_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
edges = data['data']['project']['environments']['edges']
for edge in edges:
    if edge['node']['name'] == 'production':
        print(edge['node']['id'])
        break
else:
    print(edges[0]['node']['id'])
")

echo "Environment ID: $ENVIRONMENT_ID"

echo "Creating PostgreSQL service..."
PG_RESPONSE=$(gql "{\"query\":\"mutation { serviceCreate(input: { projectId: \\\"$PROJECT_ID\\\", environmentId: \\\"$ENVIRONMENT_ID\\\", name: \\\"postgres\\\", source: { image: \\\"postgres:16\\\" } }) { id name } }\"}")

PG_SERVICE_ID=$(echo "$PG_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if 'errors' in data:
    print('ERROR:' + str(data['errors']), file=sys.stderr)
    sys.exit(1)
print(data['data']['serviceCreate']['id'])
")

echo "PostgreSQL Service ID: $PG_SERVICE_ID"

echo "Creating backend service..."
BACKEND_RESPONSE=$(gql "{\"query\":\"mutation { serviceCreate(input: { projectId: \\\"$PROJECT_ID\\\", environmentId: \\\"$ENVIRONMENT_ID\\\", name: \\\"$BACKEND_SERVICE_NAME\\\" }) { id name } }\"}")

SERVICE_ID=$(echo "$BACKEND_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if 'errors' in data:
    print('ERROR:' + str(data['errors']), file=sys.stderr)
    sys.exit(1)
print(data['data']['serviceCreate']['id'])
")

echo "Backend Service ID: $SERVICE_ID"

JWT_SECRET_VALUE="${JWT_SECRET:-$(openssl rand -hex 32)}"
PG_PASSWORD="${PROJECT_NAME}$(openssl rand -hex 4)"

echo "Staging PostgreSQL environment variables..."
PG_STAGE_QUERY=$(python3 -c "
import json
payload = {
    'services': {
        '${PG_SERVICE_ID}': {
            'variables': {
                'POSTGRES_USER': {'value': '${PROJECT_NAME}'},
                'POSTGRES_PASSWORD': {'value': '${PG_PASSWORD}'},
                'POSTGRES_DB': {'value': '${PROJECT_NAME}'},
            },
        }
    }
}
query = {
    'query': '''mutation(\$environmentId: String!, \$input: EnvironmentConfig!, \$merge: Boolean) {
        environmentStageChanges(environmentId: \$environmentId, input: \$input, merge: \$merge) { id }
    }''',
    'variables': {
        'environmentId': '${ENVIRONMENT_ID}',
        'input': payload,
        'merge': True,
    }
}
print(json.dumps(query))
")

PG_STAGE_RESPONSE=$(curl -sS -X POST "$API_URL" \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PG_STAGE_QUERY")

echo "$PG_STAGE_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if 'errors' in data:
    print('WARN: PostgreSQL env staging failed:', data['errors'], file=sys.stderr)
else:
    print('PostgreSQL environment variables staged')
"

DATABASE_URL="postgresql://${PROJECT_NAME}:${PG_PASSWORD}@postgres.railway.internal:5432/${PROJECT_NAME}"

echo "Connecting GitHub repo $GITHUB_REPO to backend service..."
STAGE_QUERY=$(python3 -c "
import json
payload = {
    'services': {
        '${SERVICE_ID}': {
            'isCreated': True,
            'source': {'repo': '${GITHUB_REPO}', 'branch': 'main'},
            'build': {'rootDirectory': 'backend', 'builder': 'NIXPACKS'},
            'variables': {
                'DATABASE_URL': {'value': '${DATABASE_URL}'},
                'JWT_SECRET': {'value': '${JWT_SECRET_VALUE}'},
                'PORT': {'value': '8080'},
                'FRONTEND_URL': {'value': 'https://${PROJECT_NAME}.vercel.app'},
            },
        }
    }
}
query = {
    'query': '''mutation(\$environmentId: String!, \$input: EnvironmentConfig!, \$merge: Boolean) {
        environmentStageChanges(environmentId: \$environmentId, input: \$input, merge: \$merge) { id }
    }''',
    'variables': {
        'environmentId': '${ENVIRONMENT_ID}',
        'input': payload,
        'merge': True,
    }
}
print(json.dumps(query))
")

STAGE_RESPONSE=$(curl -sS -X POST "$API_URL" \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$STAGE_QUERY")

echo "$STAGE_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if 'errors' in data:
    print('WARN: GitHub connect staging failed:', data['errors'], file=sys.stderr)
else:
    print('GitHub repo staged for backend service')
"

COMMIT_QUERY="{\"query\":\"mutation { environmentPatchCommitStaged(environmentId: \\\"$ENVIRONMENT_ID\\\", message: \\\"Connect GitHub repo and env vars\\\", skipDeploys: false) { id } }\"}"

COMMIT_RESPONSE=$(gql "$COMMIT_QUERY")
echo "$COMMIT_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if 'errors' in data:
    print('WARN: Commit staged changes failed:', data['errors'], file=sys.stderr)
else:
    print('Railway deployment triggered')
"

mkdir -p "$(dirname "$CONFIG_PATH")"
cat > "$CONFIG_PATH" <<EOF
{
  "projectId": "$PROJECT_ID",
  "environmentId": "$ENVIRONMENT_ID",
  "serviceId": "$SERVICE_ID",
  "postgresServiceId": "$PG_SERVICE_ID"
}
EOF

echo "Railway config written to $CONFIG_PATH"
cat "$CONFIG_PATH"
