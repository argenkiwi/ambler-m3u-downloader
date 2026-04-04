# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../lib/ambler'
require_relative '../nodes/prompt_options'

class TestPromptOptions < Minitest::Test
  def make_node(urls, input_sequence, edges = {})
    inputs = input_sequence.dup
    mock_read_line = -> { inputs.shift.to_s.chomp }

    on_list     = edges[:on_list]     || ->(_state) { nil }
    on_resolve  = edges[:on_resolve]  || ->(_state) { nil }
    on_download = edges[:on_download] || ->(_state) { nil }

    state = { m3u_file_path: 'test.m3u', urls: urls }
    node  = PromptOptions.node({ on_list: on_list, on_resolve: on_resolve, on_download: on_download },
                               { read_line: mock_read_line })
    [node, state]
  end

  def test_prompt_with_khinsider_urls
    urls = ['https://downloads.khinsider.com/game-soundtracks/album/test/1.mp3']
    captured = []
    on_resolve = ->(state) { captured << state; nil }

    node, state = make_node(urls, ['3'], { on_resolve: on_resolve })
    result = node.call(state)

    # resolve is option 3; result should be Next pointing to on_resolve
    refute_nil result
    result.run
    assert_equal 1, captured.length
  end

  def test_prompt_without_khinsider_urls
    urls = ['https://example.com/test.mp3']
    captured = []
    on_download = ->(state) { captured << state; nil }

    node, state = make_node(urls, ['3'], { on_download: on_download })
    result = node.call(state)

    refute_nil result
    result.run
    assert_equal 1, captured.length
  end

  def test_prompt_quit_returns_nil
    urls = ['https://example.com/test.mp3']
    node, state = make_node(urls, ['1'])
    result = node.call(state)

    assert_nil result
  end

  def test_prompt_with_invalid_input_then_valid
    urls = ['https://example.com/test.mp3']
    captured = []
    on_list = ->(state) { captured << state; nil }

    # 'x' is invalid, then '2' selects list
    node, state = make_node(urls, %w[x 2], { on_list: on_list })
    result = node.call(state)

    refute_nil result
    result.run
    assert_equal 1, captured.length
  end
end
