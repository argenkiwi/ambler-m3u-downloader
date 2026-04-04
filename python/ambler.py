from __future__ import annotations
from typing import TypeVar, Generic, Callable, Optional

S = TypeVar('S')
Nextable = Callable  # (state: S) -> Awaitable[Next[S] | None]


class Next(Generic[S]):
    def __init__(self, next_func: Nextable, state: S) -> None:
        self._next_func = next_func
        self._state = state

    async def run(self) -> Optional[Next[S]]:
        return await self._next_func(self._state)


def node(factory: Callable[[], Nextable]) -> Nextable:
    async def wrapper(state: S) -> Optional[Next[S]]:
        return await factory()(state)
    return wrapper


async def amble(initial: Nextable, state: S) -> None:
    next_val: Optional[Next[S]] = await initial(state)
    while next_val is not None:
        next_val = await next_val.run()
