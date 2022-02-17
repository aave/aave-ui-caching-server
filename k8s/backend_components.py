from typing import Sequence, Optional

from kdsl.apps.v1 import Deployment, DeploymentSpec, DeploymentStrategy, RollingUpdateDeployment
from kdsl.core.v1 import Service, ServiceSpec, PodSpec, ObjectMeta, ContainerItem, Probe, ExecAction, HTTPGetAction
from kdsl.extra import mk_env
from kdsl.recipe import choice, collection

import values

env = mk_env(
    REDIS_HOST="redis",
    RPC_URL=choice(
        chain1=values.MAINNET_RPC,
        chain137=values.POLYGON_RPC,
        chain43114="https://api.avax.network/ext/bc/C/rpc"
    ),
    CHAIN_ID=values.CHAIN_ID,
)

api_probe = Probe(
    httpGet=HTTPGetAction(
        port="http",
        path='/.well-known/apollo/server-health',
        scheme='HTTP'
    ),
    initialDelaySeconds=5,
    periodSeconds=10,
    timeoutSeconds=3,
    failureThreshold=5,
)

worker_probe = Probe(
    exec=ExecAction(
        command="ps -p 1".split()
    ),
    initialDelaySeconds=5,
    periodSeconds=20,
    failureThreshold=5,
)


def mk_backend_entries(
        name: str,
        command: Sequence[str],
        probe: Probe = worker_probe,
        port: Optional[int] = None,
        scale: int = 1,
):
    labels = dict(component=name)

    metadata = ObjectMeta(
        name=name,
        namespace=values.NAMESPACE,
        labels=dict(**labels, **values.shared_labels, **values.datadog_labels(name)),
        annotations=values.shared_annotations
    )

    if port is not None:
        service = Service(
            metadata=metadata,
            spec=ServiceSpec(
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
        containers={
            name: ContainerItem(
                image=values.IMAGE,
                imagePullPolicy="Always",
                **container_ports_mixin,
                command=command,
                env=env,
                readinessProbe=probe,
                livenessProbe=probe,
            ),
        },
    )

    deployment = Deployment(
        metadata=metadata,
        spec=DeploymentSpec(
            replicas=scale,
            selector=dict(matchLabels=labels),
            progressDeadlineSeconds=180,
            strategy=DeploymentStrategy(
                type="RollingUpdate",
                rollingUpdate=RollingUpdateDeployment(
                    maxUnavailable=1,
                    maxSurge=1,
                ),
            ),
            template=dict(
                metadata=ObjectMeta(
                    labels=dict(**metadata.labels),
                    annotations=values.shared_annotations
                ),
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
            probe=api_probe,
            port=3000,
            scale=1
        ),
        *mk_backend_entries(
            name="protocol-data-loader",
            command=["npm", "run", "job:update-general-reserves-data"],
        ),
        *mk_backend_entries(
            name="reserve-incentives",
            command=["npm", "run", "job:update-reserve-incentives-data"],
        ),
        *mk_backend_entries(
            name="user-incentives",
            command=["npm", "run", "job:update-users-incentives-data"],
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
