# frozen_string_literal: true

require 'minitest/autorun'
require 'async'
require_relative '../lib/ambler'
require_relative '../nodes/resolve_urls'

class TestResolveUrls < Minitest::Test
  def test_resolves_only_khinsider_urls
    mock_resolver = ->(url) { "resolved-#{url}" }

    state = {
      m3u_file_path: 'test.m3u',
      urls: [
        'https://downloads.khinsider.com/game-soundtracks/game1/song1.mp3',
        'https://example.com/other.mp3'
      ]
    }

    expected_urls = [
      'resolved-https://downloads.khinsider.com/game-soundtracks/game1/song1.mp3',
      'https://example.com/other.mp3'
    ]

    captured = []
    on_success = ->(s) { captured << s; nil }

    node = ResolveUrls.node({ on_success: on_success }, { resolver: mock_resolver })

    Async do
      result = node.call(state)
      result&.run
    end

    assert_equal 1, captured.length
    assert_equal expected_urls, captured.first[:urls]
  end
end
