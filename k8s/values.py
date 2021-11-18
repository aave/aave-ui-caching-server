from envparse import env  # type: ignore

NAMESPACE: str = env.str("NAMESPACE")
IMAGE: str = env.str("IMAGE")
DOMAIN: str = env.str("DOMAIN")

POLYGON_RPC: str = env.str("POLYGON_RPC", default="polygon-rpc-secret")
MAINNET_RPC: str = env.str("MAINNET_RPC", default="mainnet-rpc-secret")
