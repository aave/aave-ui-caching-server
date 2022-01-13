from kdsl.apps.v1 import Deployment, DeploymentSpec
from kdsl.core.v1 import Service, ServiceSpec, PodSpec, ObjectMeta, ContainerItem

import values

name = "redis"
labels = dict(component=name)
annotations = values.shared_annotations


metadata = ObjectMeta(
    name=name,
    namespace=values.NAMESPACE,
    labels=dict(**labels, **values.shared_labels),
    annotations=values.shared_annotations
)


service = Service(
    metadata=metadata,
    spec=ServiceSpec(
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
    spec=DeploymentSpec(
        replicas=1,
        selector=dict(matchLabels=labels),
        template=dict(
            metadata=ObjectMeta(
                labels=labels,
                annotations=annotations
            ),
            spec=pod_spec,
        ),
    ),
)


entries = [service, deployment]
