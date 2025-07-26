def list_urls(state):
    """
    Displays all the URLs currently in the application's state.
    """
    for url in state.urls:
        print(url)
    return state, None
