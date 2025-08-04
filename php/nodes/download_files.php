<?php

require_once __DIR__ . '/../utils/download_files.php';

function download_files(State $state): array {
    $output_folder = pathinfo($state->m3u_file_path, PATHINFO_FILENAME);
    download_files_in_parallel($state->urls, $output_folder);
    return [$state, null];
}
