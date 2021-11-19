from envparse import env  # type: ignore

NAMESPACE: str = env.str("NAMESPACE")
IMAGE: str = env.str("IMAGE")
DOMAIN: str = env.str("DOMAIN")

CHAIN_ID: str = env.str("CHAIN_ID")
POLYGON_RPC: str = env.str("POLYGON_RPC")
MAINNET_RPC: str = env.str("MAINNET_RPC")
