def save_m3u_file(m3u_file: str, urls: list[str]):
    """
    Saves the resolved URLs back to the M3U file.
    """
    with open(m3u_file, 'w') as f:
        for url in urls:
            f.write(url + '\n')
    print(f"Resolved URLs saved to {m3u_file}")
