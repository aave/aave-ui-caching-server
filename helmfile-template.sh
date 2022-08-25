#!/usr/bin/env bash
set -xeuo pipefail

CHAIN_ID=${1:-1}

docker run -it --rm -v "$(pwd)":/app --workdir=/app \
-e NAMESPACE="cache-${CHAIN_ID}" \
-e IMAGE='ghcr.io/aave/aave-ui-caching-server:5fcb2af774a257765ba95ac35787c35b87020aa6' \
-e DOMAIN='example.com' \
-e CHAIN_ID="${CHAIN_ID}" \
-e POLYGON_RPC="poly-secret-rpc" \
-e MAINNET_RPC="main-secret-rpc" \
-e COMMIT_SHA="$(git rev-parse --verify HEAD)" \
-e ENV_NAME="rendered" \
ghcr.io/helmfile/helmfile:v0.145.3 \
helmfile template
