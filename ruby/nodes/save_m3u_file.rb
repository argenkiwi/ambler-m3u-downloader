# frozen_string_literal: true

require_relative '../lib/node'

module SaveM3uFile
  def self.save(state)
    m3u_file = state[:m3u_file]
    urls = state[:urls]
    File.write(m3u_file, "#{urls.join("\n")}\n")
    puts "Resolved URLs saved to #{m3u_file}"
    [state, Node::PROMPT_OPTIONS]
  end
end
