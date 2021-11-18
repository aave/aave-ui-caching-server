import values

from kdsl.core.v1 import Namespace, ObjectMeta

namespace = Namespace(
    metadata=ObjectMeta(name=values.NAMESPACE),
)

entries = [namespace]
