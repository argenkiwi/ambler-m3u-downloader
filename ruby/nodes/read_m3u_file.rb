# frozen_string_literal: true

require_relative '../lib/node'

module ReadM3uFile
  def self.read(state)
    m3u_file = state[:m3u_file]
    urls = File.readlines(m3u_file).map(&:strip).reject { |line| line.start_with?('#') || line.empty? }
    state[:urls] = urls
    [state, Node::PROMPT_OPTIONS]
  end
end
