<?php

function list_urls(State $state): array {
    foreach ($state->urls as $url) {
        echo "$url\n";
    }
    return [
        $state,
        Node::PromptOptions
    ];
}
