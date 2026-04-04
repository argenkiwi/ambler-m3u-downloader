import pytest
from nodes.resolve_urls import resolve_urls
from state import State


@pytest.mark.asyncio
async def test_resolve_urls_resolves_only_khinsider_urls():
    async def mock_resolver(url: str) -> str:
        return f"resolved-{url}"

    initial_state: State = {
        'm3u_file_path': 'test.m3u',
        'urls': [
            'https://downloads.khinsider.com/game-soundtracks/game1/song1.mp3',
            'https://example.com/other.mp3',
        ],
    }

    expected_urls = [
        'resolved-https://downloads.khinsider.com/game-soundtracks/game1/song1.mp3',
        'https://example.com/other.mp3',
    ]

    captured_state: list[State] = []

    async def on_success(state: State):
        captured_state.append(state)
        return None

    node = resolve_urls({'on_success': on_success}, {'resolver': mock_resolver})
    next_val = await node(initial_state)

    assert next_val is not None
    await next_val.run()

    assert len(captured_state) == 1
    assert captured_state[0]['urls'] == expected_urls
