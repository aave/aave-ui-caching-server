from envparse import env  # type: ignore

NAMESPACE: str = env.str("NAMESPACE")
IMAGE: str = env.str("IMAGE")
DOMAIN: str = env.str("DOMAIN")

CHAIN_ID: str = env.str("CHAIN_ID")
POLYGON_RPC: str = env.str("POLYGON_RPC")
MAINNET_RPC: str = env.str("MAINNET_RPC")

shared_labels = dict(
    project="aave",
    app="caching-server"
)
shared_annotations = dict(
    git_repo="https://github.com/aave/aave-ui-caching-server"
)
