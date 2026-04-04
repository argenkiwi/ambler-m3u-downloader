# frozen_string_literal: true

require_relative '../lib/ambler'

module CheckM3uFile
  DEFAULT_UTILS = { stat: File.method(:stat) }.freeze

  def self.node(edges, utils = DEFAULT_UTILS)
    ->(state) {
      m3u_file_path = state[:m3u_file_path]

      if m3u_file_path
        begin
          stat = utils[:stat].call(m3u_file_path)
          if stat.file? && m3u_file_path.end_with?('.m3u')
            return Ambler::Next.new(edges[:on_read], state)
          end
        rescue Errno::ENOENT
          puts "File not found: #{m3u_file_path}"
        rescue => e
          puts "Error accessing file: #{e.message}"
        end
      end

      Ambler::Next.new(edges[:on_prompt], state)
    }
  end
end
