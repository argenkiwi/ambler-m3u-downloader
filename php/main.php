<?php

require_once 'ambler.php';
require_once 'nodes/check_m3u_file.php';
require_once 'nodes/read_m3u_file.php';
require_once 'nodes/prompt_options.php';
require_once 'nodes/list_urls.php';
require_once 'nodes/resolve_urls.php';
require_once 'nodes/save_m3u_file.php';
require_once 'nodes/download_files.php';
require_once 'nodes/prompt_m3u_file.php';

class State {
    public ?string $m3u_file_path = null;
    public array $urls = [];
}

enum Node {
    case CheckM3UFile;
    case ReadM3UFile;
    case PromptOptions;
    case ListUrls;
    case ResolveUrls;
    case SaveM3UFile;
    case DownloadFiles;
    case PromptM3UFile;
}

amble(new State(), Node::CheckM3UFile, function (Node $node): Step {
    return match ($node) {
        Node::CheckM3UFile => new NextStep('check_m3u_file'),
        Node::ReadM3UFile => new NextStep('read_m3u_file'),
        Node::PromptOptions => new NextStep('prompt_options'),
        Node::ListUrls => new NextStep('list_urls'),
        Node::ResolveUrls => new NextStep('resolve_urls'),
        Node::SaveM3UFile => new NextStep('save_m3u_file'),
        Node::DownloadFiles => new NextStep('download_files'),
        Node::PromptM3UFile => new NextStep('prompt_m3u_file'),
    };
});
