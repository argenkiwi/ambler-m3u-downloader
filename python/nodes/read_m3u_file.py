def read_m3u_file(state):
    """
    Reads the content of the M3U file and extracts URLs.
    """
    with open(state.m3u_file, 'r') as f:
        urls = [line.strip() for line in f if line.strip() and not line.startswith('#')]
    state.urls = urls
    return state
