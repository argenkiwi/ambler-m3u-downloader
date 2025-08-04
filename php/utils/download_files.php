<?php

function download_files_in_parallel(array $urls, string $output_folder): void {
    if (!file_exists($output_folder)) {
        mkdir($output_folder, 0777, true);
    }

    $multi_handle = curl_multi_init();
    $handles = [];

    foreach ($urls as $url) {
        $ch = curl_init($url);
        $file_path = $output_folder . '/' . basename($url);
        $fp = fopen($file_path, 'w');

        curl_setopt($ch, CURLOPT_FILE, $fp);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

        curl_multi_add_handle($multi_handle, $ch);
        $handles[$url] = ['handle' => $ch, 'fp' => $fp];
    }

    $running = null;
    do {
        curl_multi_exec($multi_handle, $running);
    } while ($running > 0);

    foreach ($handles as $url => $data) {
        curl_multi_remove_handle($multi_handle, $data['handle']);
        fclose($data['fp']);
    }

    curl_multi_close($multi_handle);
}
