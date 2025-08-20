<?php

function prompt_m3u_file(State $state): array {
    $m3u_file_path = readline('Enter the path to the M3U file: ');

    if (empty($m3u_file_path)) {
        return [$state, null]; // Terminate if empty input
    }

    $state->m3u_file_path = $m3u_file_path;
    return [$state, Node::CheckM3UFile];
}
