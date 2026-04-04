import asyncio
from typing import Awaitable, Callable, TypedDict

from ambler import Next, Nextable
from state import State
from utils.resolve_khinsider_url import resolve_khinsider_url


class ResolveEdges(TypedDict):
    on_success: Nextable


class ResolveUtils(TypedDict):
    resolver: Callable[[str], Awaitable[str]]


_default_utils: ResolveUtils = {
    'resolver': resolve_khinsider_url,
}


def resolve_urls(edges: ResolveEdges, utils: ResolveUtils = _default_utils) -> Nextable:
    async def _node(state: State) -> Next[State]:
        print("Resolving Khinsider URLs...")

        async def resolve_one(url: str) -> str:
            if url.startswith('https://downloads.khinsider.com/game-soundtracks'):
                return await utils['resolver'](url)
            return url

        resolved_urls = await asyncio.gather(*[resolve_one(url) for url in state['urls']])
        print("Finished resolving URLs.")
        return Next(edges['on_success'], {**state, 'urls': list(resolved_urls)})

    return _node
