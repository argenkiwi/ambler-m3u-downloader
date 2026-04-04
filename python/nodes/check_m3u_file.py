import os
import stat as stat_module
from typing import Callable, TypedDict

from ambler import Next, Nextable
from state import State


class CheckEdges(TypedDict):
    on_read: Nextable
    on_prompt: Nextable


class CheckUtils(TypedDict):
    stat: Callable[[str], os.stat_result]


_default_utils: CheckUtils = {
    'stat': os.stat,
}


def check_m3u_file(edges: CheckEdges, utils: CheckUtils = _default_utils) -> Nextable:
    async def _node(state: State) -> Next[State]:
        m3u_file_path = state['m3u_file_path']

        if m3u_file_path:
            try:
                result = utils['stat'](m3u_file_path)
                if stat_module.S_ISREG(result.st_mode) and m3u_file_path.endswith('.m3u'):
                    return Next(edges['on_read'], state)
            except FileNotFoundError:
                print(f"File not found: {m3u_file_path}")
            except Exception as e:
                print(f"Error accessing file: {e}")

        return Next(edges['on_prompt'], state)

    return _node
