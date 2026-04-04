import pytest
from nodes.download_files import download_files
from state import State
from ambler import Nextable


@pytest.mark.asyncio
async def test_download_files_calls_downloader_for_each_url():
    downloaded: list[dict] = []

    async def mock_downloader(url: str, folder: str) -> None:
        downloaded.append({'url': url, 'folder': folder})

    initial_state: State = {
        'm3u_file_path': '/path/to/my-playlist.m3u',
        'urls': ['http://example.com/1.mp3', 'http://example.com/2.mp3'],
    }

    captured_state: list[State] = []

    async def on_success(state: State):
        captured_state.append(state)
        return None

    node = download_files({'on_success': on_success}, {'downloader': mock_downloader})
    next_val = await node(initial_state)

    assert next_val is not None
    await next_val.run()

    assert len(downloaded) == 2
    assert downloaded[0] == {'url': 'http://example.com/1.mp3', 'folder': 'my-playlist'}
    assert downloaded[1] == {'url': 'http://example.com/2.mp3', 'folder': 'my-playlist'}
    assert captured_state[0] == initial_state


@pytest.mark.asyncio
async def test_download_files_raises_when_m3u_file_path_is_none():
    async def mock_downloader(url: str, folder: str) -> None:
        pass

    async def on_success(state: State):
        return None

    initial_state: State = {
        'm3u_file_path': None,
        'urls': ['http://example.com/1.mp3'],
    }

    node = download_files({'on_success': on_success}, {'downloader': mock_downloader})

    with pytest.raises(ValueError, match="M3U file path is not defined."):
        await node(initial_state)
