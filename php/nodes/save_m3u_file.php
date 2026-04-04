<?php

function save_m3u_file(array $edges, array $utils = []): callable {
    $utils += ['write_text_file' => fn($p, $c) => file_put_contents($p, $c)];

    return function ($state) use ($edges, $utils): Next {
        if (empty($state['m3u_file_path'])) {
            throw new \RuntimeException('M3U file path is not defined.');
        }

        $content = implode("\n", $state['urls']);
        $utils['write_text_file']($state['m3u_file_path'], $content);
        echo "Saved resolved URLs to {$state['m3u_file_path']}\n";
        return new Next($edges['on_success'], $state);
    };
}
