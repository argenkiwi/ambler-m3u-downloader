<?php

function prompt_options(array $edges, array $utils = []): callable {
    $utils += ['read_line' => fn() => trim((string) readline())];

    return function ($state) use ($edges, $utils): ?Next {
        $has_khinsider = (bool) array_filter(
            $state['urls'],
            fn($url) => str_starts_with($url, 'https://downloads.khinsider.com/game-soundtracks')
        );

        $options = [
            ['quit', null],
            ['list', new Next($edges['on_list'], $state)],
        ];

        if ($has_khinsider) {
            $options[] = ['resolve', new Next($edges['on_resolve'], $state)];
        } else {
            $options[] = ['download', new Next($edges['on_download'], $state)];
        }

        while (true) {
            echo "\nSelect an option:\n";
            foreach ($options as $i => [$name, $_]) {
                echo ($i + 1) . ". $name\n";
            }

            $choice = (int) $utils['read_line']() - 1;
            if ($choice >= 0 && $choice < count($options)) {
                return $options[$choice][1];
            }

            echo "Invalid option. Please try again.\n";
        }
    };
}
