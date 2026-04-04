from typing import Optional, TypedDict


class State(TypedDict):
    m3u_file_path: Optional[str]
    urls: list[str]
