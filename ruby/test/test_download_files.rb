# frozen_string_literal: true

require 'minitest/autorun'
require 'async'
require_relative '../lib/ambler'
require_relative '../nodes/download_files'

class TestDownloadFiles < Minitest::Test
  def test_calls_downloader_for_each_url
    downloaded = []
    mock_downloader = ->(url, folder) { downloaded << { url: url, folder: folder } }

    state = {
      m3u_file_path: '/path/to/my-playlist.m3u',
      urls: ['http://example.com/1.mp3', 'http://example.com/2.mp3']
    }

    captured = []
    on_success = ->(s) { captured << s; nil }

    node = DownloadFiles.node({ on_success: on_success }, { downloader: mock_downloader })

    Async do
      result = node.call(state)
      result&.run
    end

    assert_equal 2, downloaded.length
    assert_includes downloaded, { url: 'http://example.com/1.mp3', folder: 'my-playlist' }
    assert_includes downloaded, { url: 'http://example.com/2.mp3', folder: 'my-playlist' }
    assert_equal 1, captured.length
    assert_equal state, captured.first
  end

  def test_raises_when_m3u_file_path_is_nil
    mock_downloader = ->(_url, _folder) {}
    on_success = ->(_state) { nil }

    state = { m3u_file_path: nil, urls: ['http://example.com/1.mp3'] }
    node = DownloadFiles.node({ on_success: on_success }, { downloader: mock_downloader })

    assert_raises(RuntimeError) { node.call(state) }
  end
end
