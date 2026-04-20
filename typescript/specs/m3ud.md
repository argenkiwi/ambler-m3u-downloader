# Program Specifications

Downloads all audio files listed in an M3U playlist. Optionally resolves khinsider URLs to their direct download links before downloading. After downloading, updates the M3U file with local `file://` paths pointing to the downloaded files.

## Shared State

- `m3uFilePath` — path to the `.m3u` file being processed; updated after downloading to point to the new playlist inside the output folder.
- `urls` — list of URLs parsed from the M3U file; updated after resolution and after downloading to reflect the current state of the playlist.

## Steps

### Check M3U File
- This is the initial step.
- Reads the file path from the first command-line argument. Validates that the argument is present, that the path ends in `.m3u`, and that the path points to an existing file.
- If any check fails, prints an error and terminates. If valid, proceeds to `READ_M3U_FILE`.

### Read M3U File
- Reads the `.m3u` file at `m3uFilePath` and parses all non-comment, non-empty lines as URLs.
- Prints the list of found URLs.
- If any URL starts with `https://downloads.khinsider.com/game-soundtracks`, proceeds to `PROMPT_RESOLVE`. Otherwise, proceeds to `PROMPT_DOWNLOAD`.

### Prompt Resolve
- Asks the user whether to resolve khinsider URLs to direct download links.
- Loops until `y`/`yes` or `n`/`no` is entered. If the user answers no, terminates. If yes, proceeds to `RESOLVE_URLS`.

### Resolve Urls
- Resolves all khinsider URLs in `urls` to their direct download links in parallel. Non-khinsider URLs are passed through unchanged.
- Prints progress and completion. Proceeds to `SAVE_AFTER_RESOLVE`.

### Save After Resolve
- Writes the current `urls` back to `m3uFilePath`, one URL per line.
- Prints the saved file path and its contents. Proceeds to `PROMPT_DOWNLOAD`.

### Prompt Download
- Asks the user whether to proceed with downloading the files.
- Loops until `y`/`yes` or `n`/`no` is entered. If the user answers no, terminates. If yes, proceeds to `DOWNLOAD_FILES`.

### Download Files
- Downloads all files in `urls` in parallel into a folder named after the M3U file (without the `.m3u` extension).
- Removes the original `.m3u` file after downloading.
- Updates `m3uFilePath` to `<folder>/playlist.m3u` and `urls` to `file://`-prefixed absolute paths of the downloaded files. Proceeds to `SAVE_AFTER_DOWNLOAD`.

### Save After Download
- Writes the updated local `urls` back to the new `m3uFilePath` (`<folder>/playlist.m3u`), one path per line.
- Prints the saved file path and its contents. Terminates.
