import values
from aave_kdsl.ingress import mk_simple_ingress

ingress = mk_simple_ingress(
    name="main",
    namespace=values.NAMESPACE,
    service="api",
    port=3000,
    domain=values.DOMAIN,
)

entries = [ingress]
