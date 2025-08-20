# frozen_string_literal: true

require 'minitest/autorun'
require 'stringio'
require_relative '../lib/prompt_options'

class TestPromptOptions < Minitest::Test
  def setup
    @original_stdout = $stdout
    @original_stdin = $stdin
  end

  def teardown
    $stdout = @original_stdout
    $stdin = @original_stdin
  end

  def with_stdin(input)
    $stdin = StringIO.new(input)
    yield
  end

  def test_prompt_with_khinsider_urls
    urls = ['https://downloads.khinsider.com/game-soundtracks/album/test/1.mp3']
    output = StringIO.new
    $stdout = output

    result = nil
    with_stdin("r\n") do
      result = PromptOptions.prompt(urls)
    end

    assert_equal :resolve, result
    assert_match(/r: resolve all URLs/, output.string)
    refute_match(/d: download all files/, output.string)
  end

  def test_prompt_without_khinsider_urls
    urls = ['https://example.com/test.mp3']
    output = StringIO.new
    $stdout = output

    result = nil
    with_stdin("d\n") do
      result = PromptOptions.prompt(urls)
    end

    assert_equal :download, result
    assert_match(/d: download all files/, output.string)
    refute_match(/r: resolve all URLs/, output.string)
  end

  def test_prompt_with_invalid_input
    urls = ['https://example.com/test.mp3']
    output = StringIO.new
    $stdout = output

    result = nil
    with_stdin("x\nd\n") do
      result = PromptOptions.prompt(urls)
    end

    assert_equal :download, result
    assert_match(/Invalid option, please try again./, output.string)
  end
end
