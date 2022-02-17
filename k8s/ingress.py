from kdsl.core.v1 import ObjectMeta
from kdsl.networking.v1beta1 import Ingress, IngressSpec, IngressTLS, IngressRule, IngressBackend, HTTPIngressRuleValue, \
    HTTPIngressPath

import values

ingress = Ingress(
    metadata=ObjectMeta(
        name='main',
        namespace=values.NAMESPACE,
        labels=values.shared_labels,
        annotations={
            "nginx.ingress.kubernetes.io/auth-tls-secret": "default/cf-mtls",
            "nginx.ingress.kubernetes.io/auth-tls-verify-client": "on",
            "nginx.ingress.kubernetes.io/auth-tls-verify-depth": "1",
            **values.shared_annotations
        }
    ),
    spec=IngressSpec(
        rules=[IngressRule(
            host=values.DOMAIN,
            http=HTTPIngressRuleValue(
                paths=[HTTPIngressPath(
                    backend=IngressBackend(
                        serviceName="api",
                        servicePort=3000
                    )
                )]
            )
        )],
        tls=[IngressTLS(
            hosts=[values.DOMAIN]
        )]
    )
)

entries = [ingress]
