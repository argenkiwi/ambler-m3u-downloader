<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../ambler.php';
require_once __DIR__ . '/../nodes/resolve_urls.php';

class ResolveUrlsTest extends TestCase
{
    public function testResolvesOnlyKhinsiderUrlsAndPreservesOrder(): void
    {
        $mock_resolver = fn(string $url): string => "resolved-$url";

        $initial_state = [
            'm3u_file_path' => 'test.m3u',
            'urls' => [
                'https://downloads.khinsider.com/game-soundtracks/game1/song1.mp3',
                'https://example.com/other.mp3',
            ],
        ];

        $expected_urls = [
            'resolved-https://downloads.khinsider.com/game-soundtracks/game1/song1.mp3',
            'https://example.com/other.mp3',
        ];

        $captured_state = null;
        $on_success = function ($state) use (&$captured_state): ?Next {
            $captured_state = $state;
            return null;
        };

        $node = resolve_urls(['on_success' => $on_success], ['resolver' => $mock_resolver]);
        $next = $node($initial_state);

        $this->assertNotNull($next);
        $next->run();

        $this->assertNotNull($captured_state);
        $this->assertEquals($expected_urls, $captured_state['urls']);
    }
}
