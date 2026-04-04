<?php

function read_m3u_file(array $edges, array $utils = []): callable {
    $utils += ['read_text_file' => fn($p) => file_get_contents($p)];

    return function ($state) use ($edges, $utils): Next {
        if (empty($state['m3u_file_path'])) {
            throw new \RuntimeException('M3U file path is not defined.');
        }

        $content = $utils['read_text_file']($state['m3u_file_path']);
        $urls = array_values(array_filter(
            array_map('trim', explode("\n", $content)),
            fn($line) => $line !== '' && !str_starts_with($line, '#')
        ));

        echo "Found " . count($urls) . " URLs in {$state['m3u_file_path']}\n";
        return new Next($edges['on_success'], array_merge($state, ['urls' => $urls]));
    };
}
