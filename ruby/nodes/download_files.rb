# frozen_string_literal: true

require 'async/barrier'
require_relative '../lib/ambler'
require_relative '../utils/download_file'

module DownloadFiles
  DEFAULT_UTILS = { downloader: DownloadFile.method(:download) }.freeze

  def self.node(edges, utils = DEFAULT_UTILS)
    ->(state) {
      raise 'M3U file path is not defined.' if state[:m3u_file_path].nil?

      output_folder = File.basename(state[:m3u_file_path], '.*')
      puts "Downloading files to: #{output_folder}"

      barrier = Async::Barrier.new
      state[:urls].each do |url|
        barrier.async do
          utils[:downloader].call(url, output_folder)
        end
      end
      barrier.wait

      puts 'All downloads complete.'
      Ambler::Next.new(edges[:on_success], state)
    }
  end
end
