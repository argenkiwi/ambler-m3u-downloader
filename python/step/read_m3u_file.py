def read_m3u_file(m3u_file: str) -> list[str]:
    """
    Reads the content of the M3U file and extracts URLs.
    """
    with open(m3u_file, 'r') as f:
        urls = [line.strip() for line in f if line.strip() and not line.startswith('#')]
    return urls
