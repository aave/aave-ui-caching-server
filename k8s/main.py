import common
import ingress
import backend_components
import redis_component

from kdsl.utils import render_to_stdout

entries = [
    *common.entries,
    *backend_components.entries,
    *redis_component.entries,
    *ingress.entries,
]


if __name__ == "__main__":
    render_to_stdout(entries)
