from typing import Callable, TypedDict

from ambler import Next, Nextable
from state import State


class SaveEdges(TypedDict):
    on_success: Nextable


class SaveUtils(TypedDict):
    write_text_file: Callable[[str, str], None]


def _write_text_file(path: str, content: str) -> None:
    with open(path, 'w') as f:
        f.write(content)


_default_utils: SaveUtils = {
    'write_text_file': _write_text_file,
}


def save_m3u_file(edges: SaveEdges, utils: SaveUtils = _default_utils) -> Nextable:
    async def _node(state: State) -> Next[State]:
        if not state['m3u_file_path']:
            raise ValueError("M3U file path is not defined.")

        content = '\n'.join(state['urls'])
        utils['write_text_file'](state['m3u_file_path'], content)
        print(f"Saved resolved URLs to {state['m3u_file_path']}")
        return Next(edges['on_success'], state)

    return _node
