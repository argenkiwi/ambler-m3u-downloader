<?php

function save_m3u_file(State $state): array {
    file_put_contents($state->m3u_file_path, implode("\n", $state->urls));
    return [$state, Node::PromptOptions];
}

