<?php

require_once 'ambler.php';
require_once 'nodes/check_m3u_file.php';
require_once 'nodes/prompt_m3u_file.php';
require_once 'nodes/read_m3u_file.php';
require_once 'nodes/prompt_options.php';
require_once 'nodes/list_urls.php';
require_once 'nodes/resolve_urls.php';
require_once 'nodes/save_m3u_file.php';
require_once 'nodes/download_files.php';

$initial_state = [
    'm3u_file_path' => isset($argv[1]) ? realpath($argv[1]) ?: $argv[1] : null,
    'urls' => [],
];

// Entry loop (& captures for forward/circular references)
$check  = node(function () use (&$read, &$prompt) { return check_m3u_file(['on_read' => $read, 'on_prompt' => $prompt]); });
$read   = node(function () use (&$options) { return read_m3u_file(['on_success' => $options]); });
$prompt = node(function () use (&$check) { return prompt_m3u_file(['on_check' => $check]); });

// Main menu
$options   = node(function () use (&$list_node, &$resolve, &$download) { return prompt_options(['on_list' => $list_node, 'on_resolve' => $resolve, 'on_download' => $download]); });
$list_node = node(function () use (&$options) { return list_urls(['on_success' => $options]); });
$resolve   = node(function () use (&$save) { return resolve_urls(['on_success' => $save]); });
$save      = node(function () use (&$options) { return save_m3u_file(['on_success' => $options]); });

// Terminal node
$download = node(function () { return download_files(['on_success' => fn($_state) => null]); });

amble($check, $initial_state);
