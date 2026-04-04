import os
from typing import Callable, Optional, TypedDict

from ambler import Next, Nextable
from state import State


class PromptEdges(TypedDict):
    on_check: Nextable


class PromptUtils(TypedDict):
    read_line: Callable[[], str]


_default_utils: PromptUtils = {
    'read_line': lambda: input("Please enter the path to your M3U file: "),
}


def prompt_m3u_file(edges: PromptEdges, utils: PromptUtils = _default_utils) -> Nextable:
    async def _node(state: State) -> Next[State]:
        m3u_file_path = utils['read_line']()

        if not m3u_file_path:
            return Next(prompt_m3u_file(edges, utils), state)

        return Next(edges['on_check'], {**state, 'm3u_file_path': os.path.expanduser(m3u_file_path)})

    return _node
