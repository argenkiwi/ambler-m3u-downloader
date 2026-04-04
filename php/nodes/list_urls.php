<?php

function list_urls(array $edges): callable {
    return function ($state) use ($edges): Next {
        echo "\n--- URLs ---\n";
        foreach ($state['urls'] as $url) {
            echo "$url\n";
        }
        echo "------------\n";
        return new Next($edges['on_success'], $state);
    };
}
