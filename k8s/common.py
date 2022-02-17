from kdsl.core.v1 import Namespace, ObjectMeta

import values

namespace = Namespace(
    metadata=ObjectMeta(
        name=values.NAMESPACE,
        labels=values.shared_labels,
        annotations=values.shared_annotations
    )
)

entries = [namespace]
