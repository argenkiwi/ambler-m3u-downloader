# frozen_string_literal: true

require_relative '../lib/ambler'

module ReadM3uFile
  DEFAULT_UTILS = { read_text_file: ->(path) { File.read(path) } }.freeze

  def self.node(edges, utils = DEFAULT_UTILS)
    ->(state) {
      raise 'M3U file path is not defined.' if state[:m3u_file_path].nil?

      content = utils[:read_text_file].call(state[:m3u_file_path])
      urls = content.lines.map(&:strip).reject { |line| line.empty? || line.start_with?('#') }

      puts "Found #{urls.length} URLs in #{state[:m3u_file_path]}"
      Ambler::Next.new(edges[:on_success], state.merge(urls: urls))
    }
  end
end
