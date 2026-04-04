<?php

function prompt_m3u_file(array $edges, array $utils = []): callable {
    $utils += ['read_line' => function () {
        echo "Please enter the path to your M3U file:\n";
        return trim((string) readline());
    }];

    $self = function ($state) use ($edges, $utils, &$self): Next {
        $path = $utils['read_line']();

        if (empty($path)) {
            return new Next($self, $state);
        }

        return new Next($edges['on_check'], array_merge($state, ['m3u_file_path' => $path]));
    };

    return $self;
}
