<?php

function check_m3u_file(State $state): array {
    global $argv;
    $m3u_file_path = $argv[1] ?? null;

    while (true) {
        if ($m3u_file_path && file_exists($m3u_file_path) && is_file($m3u_file_path) && pathinfo($m3u_file_path, PATHINFO_EXTENSION) === 'm3u') {
            break;
        }
        $m3u_file_path = readline('Enter the path to the M3U file: ');
    }

    $state->m3u_file_path = $m3u_file_path;
    return [$state, Node::ReadM3UFile];
}
