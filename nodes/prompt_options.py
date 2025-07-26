def prompt_options(state):
    """
    Presents the user with available actions and returns their selection.
    """
    urls = state.urls
    options = ['list']
    can_resolve = any(url.startswith('https://downloads.khinsider.com/game-soundtracks') for url in urls)
    if can_resolve:
        options.append('resolve')
    else:
        options.append('download')
    options.append('quit')

    print('Please select an option:')
    for i, option in enumerate(options):
        print(f'{i + 1}. {option}')

    selected_option = None
    while True:
        choice = input('Enter your choice: ')
        try:
            index = int(choice) - 1
            if 0 <= index < len(options):
                selected_option = options[index]
                break
            else:
                print("Invalid choice. Please try again.")
        except (ValueError, IndexError):
            print("Invalid choice. Please try again.")

    if selected_option == 'quit':
        return state, None

    return state, selected_option
