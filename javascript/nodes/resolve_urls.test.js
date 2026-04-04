import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveUrls } from './resolve_urls.js';

test('resolveUrls resolves only Khinsider URLs using provided resolver', async () => {
    const mockResolver = async (url) => `resolved-${url}`;

    const initialState = {
        m3uFilePath: 'test.m3u',
        urls: [
            'https://downloads.khinsider.com/game-soundtracks/game1/song1.mp3',
            'https://example.com/other.mp3',
        ],
    };

    const expectedUrls = [
        'resolved-https://downloads.khinsider.com/game-soundtracks/game1/song1.mp3',
        'https://example.com/other.mp3',
    ];

    let capturedState;
    const onSuccess = async (state) => { capturedState = state; return null; };

    const nodeFunc = resolveUrls({ onSuccess }, { resolver: mockResolver });
    const next = await nodeFunc(initialState);

    assert.ok(next, 'Expected a Next object, got null');
    await next.run();

    assert.deepEqual(capturedState.urls, expectedUrls);
});
