<?php

require_once __DIR__ . '/../utils/download_files.php';

function download_files(array $edges, array $utils = []): callable {
    $utils += ['downloader' => fn($urls, $folder) => download_files_in_parallel($urls, $folder)];

    return function ($state) use ($edges, $utils): Next {
        if (empty($state['m3u_file_path'])) {
            throw new \RuntimeException('M3U file path is not defined.');
        }

        $output_folder = pathinfo($state['m3u_file_path'], PATHINFO_FILENAME);
        echo "Downloading files to: $output_folder\n";

        $utils['downloader']($state['urls'], $output_folder);

        echo "All downloads complete.\n";
        return new Next($edges['on_success'], $state);
    };
}
