# frozen_string_literal: true

require 'async'
require_relative '../lib/download_file'
require_relative '../lib/node'

module DownloadFiles
  def self.download(state)
    m3u_file = state[:m3u_file]
    urls = state[:urls]
    m3u_file_name = File.basename(m3u_file, '.*')

    puts "Starting download of #{urls.length} files..."

    Async do
      barrier = Async::Barrier.new
      urls.each do |url|
        barrier.async do
          DownloadFile.download(url, m3u_file_name)
        end
      end
      barrier.wait
    end

    puts 'All files downloaded.'
    [state, nil]
  end
end
