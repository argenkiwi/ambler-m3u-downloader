# frozen_string_literal: true

require 'async/barrier'
require_relative '../lib/ambler'
require_relative '../utils/resolve_khinsider_url'

module ResolveUrls
  DEFAULT_UTILS = { resolver: ResolveKhinsiderUrl.method(:resolve) }.freeze

  def self.node(edges, utils = DEFAULT_UTILS)
    ->(state) {
      puts 'Resolving Khinsider URLs...'

      resolved_urls = Array.new(state[:urls].length)
      barrier = Async::Barrier.new

      state[:urls].each_with_index do |url, i|
        barrier.async do
          resolved_urls[i] = if url.start_with?('https://downloads.khinsider.com/game-soundtracks')
            utils[:resolver].call(url)
          else
            url
          end
        end
      end

      barrier.wait
      puts 'Finished resolving URLs.'
      Ambler::Next.new(edges[:on_success], state.merge(urls: resolved_urls))
    }
  end
end
