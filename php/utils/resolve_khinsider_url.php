<?php

function resolve_khinsider_url(string $url): ?string {
    $html = file_get_contents($url);
    if (!$html) {
        return null;
    }

    if (preg_match('/<audio.*?src="(.*?)".*?>/', $html, $matches)) {
        return $matches[1];
    }

    return null;
}
