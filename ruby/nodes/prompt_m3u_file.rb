# frozen_string_literal: true

require_relative '../lib/node'

module PromptM3uFile
  def self.prompt(state)
    print 'Please enter the path to your M3U file: '
    path = gets.chomp
    if path.empty?
      state[:m3u_file] = nil
      [state, nil]
    else
      state[:m3u_file] = File.expand_path(path)
      [state, Node::CHECK_M3U_FILE]
    end
  end
end
