from enum import Enum, auto
from typing import TypedDict


class State(TypedDict):
    m3u_file: str | None
    urls: list[str]


class Lead(Enum):
    CHECK_M3U_FILE = auto()
    READ_M3U_FILE = auto()
    PROMPT_OPTIONS = auto()
    LIST_URLS = auto()
    RESOLVE_URLS = auto()
    DOWNLOAD_FILES = auto()
    SAVE_M3U_FILE = auto()
