from typing import TypedDict

from ambler import Next, Nextable
from state import State


class ListEdges(TypedDict):
    on_success: Nextable


def list_urls(edges: ListEdges) -> Nextable:
    async def _node(state: State) -> Next[State]:
        print("\n--- URLs ---")
        for url in state['urls']:
            print(url)
        print("------------")
        return Next(edges['on_success'], state)

    return _node
