<?php

function prompt_options(State $state): array {
    $options = ['list', 'quit'];
    $khinsider_urls = array_filter($state->urls, fn($url) => strpos($url, 'https://downloads.khinsider.com/game-soundtracks') === 0);

    if (count($khinsider_urls) > 0) {
        $options[] = 'resolve';
    } else {
        $options[] = 'download';
    }

    echo "\nAvailable options:\n";
    foreach ($options as $index => $option) {
        echo ($index + 1) . ". $option\n";
    }

    $choice = readline('Enter your choice: ');
    $choice = intval($choice) - 1;

    if (!isset($options[$choice])) {
        echo "Invalid choice.\n";
        return [$state, Node::PromptOptions];
    }

    switch ($options[$choice]) {
        case 'list':
            return [$state, Node::ListUrls];
        case 'resolve':
            return [$state, Node::ResolveUrls];
        case 'download':
            return [$state, Node::DownloadFiles];
        case 'quit':
            return [$state, null];
    }
    return [$state, Node::PromptOptions];
}
