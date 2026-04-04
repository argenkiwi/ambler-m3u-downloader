# frozen_string_literal: true

require_relative '../lib/ambler'

module SaveM3uFile
  DEFAULT_UTILS = { write_file: ->(path, content) { File.write(path, content) } }.freeze

  def self.node(edges, utils = DEFAULT_UTILS)
    ->(state) {
      raise 'M3U file path is not defined.' if state[:m3u_file_path].nil?

      content = state[:urls].join("\n")
      utils[:write_file].call(state[:m3u_file_path], content)
      puts "Saved resolved URLs to #{state[:m3u_file_path]}"
      Ambler::Next.new(edges[:on_success], state)
    }
  end
end
