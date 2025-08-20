<?php

function check_m3u_file(State $state): array {
    global $argv;
    $m3u_file_path = $argv[1] ?? null;

    if ($m3u_file_path && file_exists($m3u_file_path) && is_file($m3u_file_path) && pathinfo($m3u_file_path, PATHINFO_EXTENSION) === 'm3u') {
        $state->m3u_file_path = $m3u_file_path;
        return [$state, Node::ReadM3UFile];
    } else {
        $state->m3u_file_path = null;
        return [$state, Node::PromptM3UFile];
    }
}
