<?php

function check_m3u_file(array $edges, array $utils = []): callable {
    $utils += ['stat' => fn($p) => @stat($p)];

    return function ($state) use ($edges, $utils): Next {
        $path = $state['m3u_file_path'];

        if ($path) {
            $info = $utils['stat']($path);
            if ($info && ($info['mode'] & 0170000) === 0100000 && str_ends_with($path, '.m3u')) {
                return new Next($edges['on_read'], $state);
            }
            if (!$info) {
                echo "File not found: $path\n";
            }
        }

        return new Next($edges['on_prompt'], $state);
    };
}
