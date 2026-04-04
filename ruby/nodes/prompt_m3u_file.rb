# frozen_string_literal: true

require_relative '../lib/ambler'

module PromptM3uFile
  DEFAULT_UTILS = {
    read_line: lambda {
      print 'Please enter the path to your M3U file: '
      $stdin.gets.to_s.chomp
    }
  }.freeze

  def self.node(edges, utils = DEFAULT_UTILS)
    self_node = ->(state) {
      m3u_file_path = utils[:read_line].call

      if m3u_file_path.empty?
        return Ambler::Next.new(self_node, state)
      end

      Ambler::Next.new(edges[:on_check], state.merge(m3u_file_path: File.expand_path(m3u_file_path)))
    }
    self_node
  end
end
