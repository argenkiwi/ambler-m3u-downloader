<?php

require_once __DIR__ . '/../utils/resolve_khinsider_url.php';

function resolve_urls(array $edges, array $utils = []): callable {
    $utils += ['resolver' => 'resolve_khinsider_url'];

    return function ($state) use ($edges, $utils): Next {
        echo "Resolving Khinsider URLs...\n";

        $resolved = array_map(function ($url) use ($utils) {
            if (str_starts_with($url, 'https://downloads.khinsider.com/game-soundtracks')) {
                return ($utils['resolver'])($url);
            }
            return $url;
        }, $state['urls']);

        echo "Finished resolving URLs.\n";
        return new Next($edges['on_success'], array_merge($state, ['urls' => array_values($resolved)]));
    };
}
