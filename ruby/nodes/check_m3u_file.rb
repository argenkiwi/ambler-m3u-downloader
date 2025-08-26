# frozen_string_literal: true

require_relative '../lib/node'

module CheckM3uFile
  def self.check(state)
    m3u_file = state[:m3u_file]
    if m3u_file && File.file?(m3u_file)
      [state, Node::READ_M3U_FILE]
    else
      [state, Node::PROMPT_M3U_FILE]
    end
  end
end
