from typing import Callable, TypedDict

from ambler import Next, Nextable
from state import State


class ReadEdges(TypedDict):
    on_success: Nextable


class ReadUtils(TypedDict):
    read_text_file: Callable[[str], str]


def _read_text_file(path: str) -> str:
    with open(path, 'r') as f:
        return f.read()


_default_utils: ReadUtils = {
    'read_text_file': _read_text_file,
}


def read_m3u_file(edges: ReadEdges, utils: ReadUtils = _default_utils) -> Nextable:
    async def _node(state: State) -> Next[State]:
        if not state['m3u_file_path']:
            raise ValueError("M3U file path is not defined.")

        content = utils['read_text_file'](state['m3u_file_path'])
        urls = [line.strip() for line in content.splitlines()
                if line.strip() and not line.strip().startswith('#')]

        print(f"Found {len(urls)} URLs in {state['m3u_file_path']}")
        return Next(edges['on_success'], {**state, 'urls': urls})

    return _node
