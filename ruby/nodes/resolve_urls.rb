# frozen_string_literal: true

require 'async'
require 'async/barrier'
require_relative '../lib/resolve_khinsider_url'
require_relative '../lib/node'

module ResolveUrls
  def self.resolve(state)
    urls = state[:urls]
    resolved_urls = []
    Async do
      barrier = Async::Barrier.new
      urls.each do |url|
        barrier.async do
          resolved_urls << ResolveKhinsiderUrl.resolve(url)
        end
      end
      barrier.wait
    end
    state[:urls] = resolved_urls
    [state, Node::SAVE_M3U_FILE]
  end
end
