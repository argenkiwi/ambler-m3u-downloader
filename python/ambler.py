import asyncio
from typing import Any, Callable, Optional, Awaitable


class Next:
    def __init__(self, next_func: Callable[..., Any], state: Any):
        self.next_func = next_func
        self.state = state

    async def run(self) -> Optional['Next']:
        if asyncio.iscoroutinefunction(self.next_func):
            return await self.next_func(self.state)
        else:
            return self.next_func(self.state)


async def amble(initial: Callable[..., Awaitable[Optional[Next]]], state: Any):
    next_step = await initial(state)
    while next_step:
        next_step = await next_step.run()
