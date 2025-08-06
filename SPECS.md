# M3U Downloader Application Specification

## Overview
This application is designed to download audio files specified in an M3U playlist. It provides options to list the URLs, resolve special `khinsider.com` URLs to direct download links, or download all the files. The application can optionally take an M3U file path as a command-line argument; otherwise, it will prompt the user for one.

## Node Responsibilities

### 1. CheckM3UFile (Initial Node)
-   **Purpose:** Validates the provided M3U file path.
-   **Details:**
    -   Checks if an M3U file path was provided as a command-line argument.
    -   If the path is valid (exists, is a file, and has a `.m3u` extension), it transitions to the `ReadM3UFile` node.
    -   If the path is not valid, it transitions to the `PromptM3UFile` node.
    -   Stores the validated M3U file path in the application's state.

### 2. PromptM3UFile
-   **Purpose:** Prompts the user to enter a valid M3U file path.
-   **Details:**
    -   Prompts the user to enter a path to an M3U file.
    -   If the user leaves the input empty, the application finishes.
    -   Once the user provides a path, it transitions back to the `CheckM3UFile` node for validation.

### 3. ReadM3UFile
-   **Purpose:** Reads the content of the M3U file and extracts URLs.
-   **Details:**
    -   Opens and reads the M3U file specified in the state.
    -   Parses the file to extract all valid URLs, ignoring comments and empty lines.
    -   Stores the list of extracted URLs in the application's state.
    -   Transitions to the `PromptOptions` node.

### 4. PromptOptions
-   **Purpose:** Presents the user with available actions and handles their selection.
-   **Details:**
    -   Determines which options are available based on the URLs in the state:
        -   `list`: Always available.
        -   `resolve`: Available only if at least one URL starts with "https://downloads.khinsider.com/game-soundtracks".
        -   `download`: Available if `resolve` is not available (i.e., no khinsider URLs).
        -   `quit`: Always available.
    -   Prompts the user to select one of the displayed options by entering the corresponding number.
    -   Transitions to the corresponding node (`ListUrls`, `ResolveUrls`, `DownloadFiles`), or terminates the program if `quit` is selected.

### 5. ListUrls
-   **Purpose:** Displays all the URLs currently in the application's state.
-   **Details:**
    -   Iterates through the list of URLs stored in the state.
    -   Prints each URL to the console.
    -   Transitions back to the `PromptOptions` node to allow further actions.

### 6. ResolveUrls
-   **Purpose:** Resolves `khinsider.com` URLs to direct download links.
-   **Details:**
    -   This node is only accessible if `PromptOptions` determined that `resolve` is an available action.
    -   For each URL in the state, if it's a `khinsider.com` URL, it calls the `resolve_khinsider_url` function (from `utils/resolve_khinsider_url.py`) in parallel.
    -   Replaces the original `khinsider.com` URLs in the state with their resolved direct download links.
    -   Transitions to the `SaveM3UFile` node.

### 7. SaveM3UFile
-   **Purpose:** Saves the resolved URLs back to the original M3U file.
-   **Details:**
    -   Writes each resolved URL from the application's state to the M3U file, overwriting its previous content.
    -   Transitions back to the `PromptOptions` node.

### 8. DownloadFiles
-   **Purpose:** Downloads all URLs in the application's state.
-   **Details:**
    -   This node is only accessible if `PromptOptions` determined that `download` is an available action.
    -   Extracts the name of the M3U file (without extension) to use as the output folder name.
    -   Calls the `download_file` function (from `utils/download_files.py`) for each URL in the state, executing these calls in parallel.
    -   Passes the extracted M3U file name as the `output_folder` parameter to `download_file`.
    -   Once all downloads are complete, the program terminates.
