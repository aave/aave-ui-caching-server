import values

from kdsl.core.v1 import ObjectMeta
from kdsl.core.v1 import Service, PodSpec, ObjectMeta, ContainerItem
from kdsl.apps.v1 import Deployment

name = "redis"
labels = dict(component=name)


metadata = ObjectMeta(
    name=name,
    namespace=values.NAMESPACE,
    labels=labels,
)


service = Service(
    metadata=metadata,
    spec=dict(
        selector=labels,
        ports={
            6379: dict(name="redis"),
        },
    ),
)


pod_spec = PodSpec(
    containers=dict(
        main=ContainerItem(
            image="redis:6-alpine",
            imagePullPolicy="Always",
            ports={
                6379: dict(name="redis", protocol="TCP"),
            },
        ),
    ),
)


deployment = Deployment(
    metadata=metadata,
    spec=dict(
        replicas=1,
        selector=dict(matchLabels=labels),
        template=dict(
            metadata=ObjectMeta(labels=labels),
            spec=pod_spec,
        ),
    ),
)


entries = [service, deployment]
