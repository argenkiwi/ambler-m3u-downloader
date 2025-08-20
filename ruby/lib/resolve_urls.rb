require 'async'
require_relative 'resolve_khinsider_url'

module ResolveUrls
  def self.resolve(urls)
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
    resolved_urls
  end
end
