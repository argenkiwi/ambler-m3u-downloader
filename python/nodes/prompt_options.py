from typing import Callable, Optional, TypedDict

from ambler import Next, Nextable
from state import State


class OptionsEdges(TypedDict):
    on_list: Nextable
    on_resolve: Nextable
    on_download: Nextable


class OptionsUtils(TypedDict):
    read_line: Callable[[], str]


_default_utils: OptionsUtils = {
    'read_line': lambda: input(),
}


def prompt_options(edges: OptionsEdges, utils: OptionsUtils = _default_utils) -> Nextable:
    async def _node(state: State) -> Optional[Next[State]]:
        has_khinsider_urls = any(
            url.startswith('https://downloads.khinsider.com/game-soundtracks')
            for url in state['urls']
        )

        options: list[tuple[str, Optional[Next[State]]]] = [
            ('quit', None),
            ('list', Next(edges['on_list'], state)),
        ]

        if has_khinsider_urls:
            options.append(('resolve', Next(edges['on_resolve'], state)))
        else:
            options.append(('download', Next(edges['on_download'], state)))

        while True:
            print("\nSelect an option:")
            for i, (name, _) in enumerate(options):
                print(f"{i + 1}. {name}")

            line = utils['read_line']()
            try:
                choice = int(line.strip()) - 1
                if 0 <= choice < len(options):
                    return options[choice][1]
            except ValueError:
                pass
            print("Invalid option. Please try again.")

    return _node
