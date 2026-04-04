<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../ambler.php';
require_once __DIR__ . '/../nodes/download_files.php';

class DownloadFilesTest extends TestCase
{
    public function testCallsDownloaderForEachUrlWithCorrectFolder(): void
    {
        $downloaded = [];
        $mock_downloader = function (array $urls, string $folder) use (&$downloaded): void {
            foreach ($urls as $url) {
                $downloaded[] = ['url' => $url, 'folder' => $folder];
            }
        };

        $initial_state = [
            'm3u_file_path' => '/path/to/my-playlist.m3u',
            'urls' => ['http://example.com/1.mp3', 'http://example.com/2.mp3'],
        ];

        $captured_state = null;
        $on_success = function ($state) use (&$captured_state): ?Next {
            $captured_state = $state;
            return null;
        };

        $node = download_files(['on_success' => $on_success], ['downloader' => $mock_downloader]);
        $next = $node($initial_state);

        $this->assertNotNull($next);
        $next->run();

        $this->assertCount(2, $downloaded);
        $this->assertEquals(['url' => 'http://example.com/1.mp3', 'folder' => 'my-playlist'], $downloaded[0]);
        $this->assertEquals(['url' => 'http://example.com/2.mp3', 'folder' => 'my-playlist'], $downloaded[1]);
        $this->assertEquals($initial_state, $captured_state);
    }

    public function testThrowsWhenM3uFilePathIsNull(): void
    {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('M3U file path is not defined.');

        $mock_downloader = fn($urls, $folder) => null;
        $on_success = fn($_state) => null;

        $initial_state = ['m3u_file_path' => null, 'urls' => ['http://example.com/1.mp3']];
        $node = download_files(['on_success' => $on_success], ['downloader' => $mock_downloader]);
        $node($initial_state);
    }
}
