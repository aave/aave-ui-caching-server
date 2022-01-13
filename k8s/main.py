from kdsl.utils import render_to_stdout

import backend_components
import common
import ingress
import redis_component

entries = [
    *common.entries,
    *backend_components.entries,
    *redis_component.entries,
    *ingress.entries,
]

if __name__ == "__main__":
    render_to_stdout(entries)
