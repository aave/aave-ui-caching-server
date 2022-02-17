#!/usr/bin/env bash
set -xeuo pipefail

RENDER_FILE=${1:-"main.py"}
CHAIN_ID=${2:-1}

docker run -it --rm -v "$(pwd)":/app --workdir=/app \
-e NAMESPACE="cache-${CHAIN_ID}" \
-e IMAGE='ghcr.io/aave/aave-ui-caching-server:9610077d06eecb7b25b59655af7d1b3ff8e81725' \
-e DOMAIN='example.com' \
-e RECIPE="chain${CHAIN_ID}" \
-e CHAIN_ID="${CHAIN_ID}" \
-e POLYGON_RPC="poly-secret-rpc" \
-e MAINNET_RPC="main-secret-rpc" \
-e COMMIT_SHA="$(git rev-parse --verify HEAD)" \
-e ENV_NAME="rendered" \
qwolphin/kdsl:1.21.8 \
python3 "${RENDER_FILE}"
