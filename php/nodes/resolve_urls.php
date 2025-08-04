<?php

require_once __DIR__ . '/../utils/resolve_khinsider_url.php';

function resolve_urls(State $state): array {
    $resolved_urls = [];
    foreach ($state->urls as $url) {
        if (strpos($url, 'https://downloads.khinsider.com/game-soundtracks') === 0) {
            $resolved_urls[] = resolve_khinsider_url($url);
        } else {
            $resolved_urls[] = $url;
        }
    }
    $state->urls = $resolved_urls;
    return [$state, Node::SaveM3UFile];
}
