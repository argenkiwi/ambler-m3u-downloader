from enum import Enum, auto
from typing import Optional


class Option(Enum):
    QUIT = auto()
    LIST = auto()
    RESOLVE = auto()
    DOWNLOAD = auto()


def prompt_options(urls: list[str]) -> Optional[Option]:
    """
    Presents the user with available actions and returns their selection.
    """
    options = ['quit', 'list']
    can_resolve = any(url.startswith('https://downloads.khinsider.com/game-soundtracks') for url in urls)
    if can_resolve:
        options.append('resolve')
    else:
        options.append('download')

    print('Please select an option:')
    for i, option in enumerate(options):
        print(f'{i + 1}. {option}')

    selected_option_index = -1
    while selected_option_index < 0 or selected_option_index >= len(options):
        try:
            selected_option_index = int(input('Enter your choice: ')) - 1
        except ValueError:
            pass  # Invalid input, loop will continue

    selected_option = options[selected_option_index]

    if selected_option == 'quit':
        return Option.QUIT
    elif selected_option == 'list':
        return Option.LIST
    elif selected_option == 'resolve':
        return Option.RESOLVE
    elif selected_option == 'download':
        return Option.DOWNLOAD
    else:
        print("Invalid choice.")
        return None
