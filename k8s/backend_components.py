import values

from kdsl.core.v1 import ObjectMeta
from kdsl.core.v1 import Service, PodSpec, ObjectMeta, ContainerItem
from kdsl.apps.v1 import Deployment
from kdsl.extra import mk_env
from kdsl.recipe import choice, collection
from typing import Sequence, Optional

env = mk_env(
    REDIS_HOST="redis",
    RPC_URL=choice(
        chain1=values.MAINNET_RPC,
        chain137=values.POLYGON_RPC,
        chain43114="https://api.avax.network/ext/bc/C/rpc"
    ),
    CHAIN_ID=values.CHAIN_ID,
)


def mk_backend_entries(name: str, command: Sequence[str], port: Optional[int] = None, scale: int = 1):
    labels = dict(component=name)

    metadata = ObjectMeta(
        name=name,
        namespace=values.NAMESPACE,
        labels=labels,
    )

    if port is not None:
        service = Service(
            metadata=metadata,
            spec=dict(
                selector=labels,
                ports={
                    port: dict(name="http"),
                },
            ),
        )
        service_list = [service]
        container_ports_mixin = dict(
            ports={
                port: dict(name="http", protocol="TCP"),
            }
        )
    else:
        service_list = []
        container_ports_mixin = dict()

    pod_spec = PodSpec(
        containers=dict(
            main=ContainerItem(
                image=values.IMAGE,
                imagePullPolicy="Always",
                **container_ports_mixin,
                command=command,
                env=env,
            ),
        ),
    )

    deployment = Deployment(
        metadata=metadata,
        spec=dict(
            replicas=scale,
            selector=dict(matchLabels=labels),
            progressDeadlineSeconds=180,
            strategy=dict(
                type="RollingUpdate",
                rollingUpdate=dict(
                    maxUnavailable=0,
                    maxSurge=1,
                ),
            ),
            template=dict(
                metadata=ObjectMeta(labels=labels),
                spec=pod_spec,
            ),
        ),
    )

    return [*service_list, deployment]


entries = collection(
    base=[
        *mk_backend_entries(
            name="api",
            command=["npm", "run", "prod"],
            port=3000,
            scale=4
        ),
        *mk_backend_entries(
            name="protocol-data-loader",
            command=["npm", "run", "job:update-general-reserves-data"],
        ),
        *mk_backend_entries(
            name="user-data-loader",
            command=["npm", "run", "job:update-users-data"],
        ),
        *mk_backend_entries(
            name="update-block-number-loader",
            command=["npm", "run", "job:update-block-number"],
        ),
    ],
    chain1=[
        *mk_backend_entries(
            name="stake-general-data-loader",
            command=["npm", "run", "job:update-stake-general-ui-data"],
        ),
        *mk_backend_entries(
            name="stake-user-data-loader",
            command=["npm", "run", "job:update-stake-user-ui-data"],
        ),
    ],
)
