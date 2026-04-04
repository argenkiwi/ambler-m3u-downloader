import { test } from 'node:test';
import assert from 'node:assert/strict';
import { downloadFiles } from './download_files.js';

test('downloadFiles calls downloader for each URL with correct folder and transitions to onSuccess', async () => {
    const downloaded = [];
    const mockDownloader = async (url, folder) => { downloaded.push({ url, folder }); };

    const initialState = {
        m3uFilePath: '/path/to/my-playlist.m3u',
        urls: ['http://example.com/1.mp3', 'http://example.com/2.mp3'],
    };

    let capturedState;
    const onSuccess = async (state) => { capturedState = state; return null; };

    const nodeFunc = downloadFiles({ onSuccess }, { downloader: mockDownloader });
    const next = await nodeFunc(initialState);

    assert.ok(next, 'Expected a Next object, got null');
    await next.run();

    assert.equal(downloaded.length, 2);
    assert.deepEqual(downloaded[0], { url: 'http://example.com/1.mp3', folder: 'my-playlist' });
    assert.deepEqual(downloaded[1], { url: 'http://example.com/2.mp3', folder: 'my-playlist' });
    assert.deepEqual(capturedState, initialState);
});

test('downloadFiles throws when m3uFilePath is null', async () => {
    const mockDownloader = async () => {};
    const onSuccess = async (_state) => null;

    const initialState = { m3uFilePath: null, urls: ['http://example.com/1.mp3'] };
    const nodeFunc = downloadFiles({ onSuccess }, { downloader: mockDownloader });

    await assert.rejects(() => nodeFunc(initialState), /M3U file path is not defined\./);
});
