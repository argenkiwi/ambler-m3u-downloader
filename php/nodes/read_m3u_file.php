<?php

function read_m3u_file(State $state): array {
    $lines = file($state->m3u_file_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $urls = [];
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') !== 0) {
            $urls[] = trim($line);
        }
    }
    $state->urls = $urls;
    return [$state, Node::PromptOptions];
}
