# frozen_string_literal: true

require_relative '../lib/node'

module ListUrls
  def self.list(state)
    urls = state[:urls]
    urls.each do |url|
      puts url
    end
    [state, Node::PROMPT_OPTIONS]
  end
end
