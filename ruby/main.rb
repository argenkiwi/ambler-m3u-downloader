# frozen_string_literal: true

require_relative 'lib/ambler'
require_relative 'lib/node'
require_relative 'nodes/check_m3u_file'
require_relative 'nodes/download_files'
require_relative 'nodes/list_urls'
require_relative 'nodes/prompt_m3u_file'
require_relative 'nodes/prompt_options'
require_relative 'nodes/read_m3u_file'
require_relative 'nodes/resolve_urls'
require_relative 'nodes/save_m3u_file'

initial_m3u_file = ARGV.empty? ? nil : File.expand_path(ARGV.first)
initial_state = {
  m3u_file: initial_m3u_file,
  urls: []
}

def direct(state, node)
  case node
  when Node::PROMPT_OPTIONS
    PromptOptions.prompt(state)
  when Node::LIST_URLS
    ListUrls.list(state)
  when Node::RESOLVE_URLS
    ResolveUrls.resolve(state)
  when Node::READ_M3U_FILE
    ReadM3uFile.read(state)
  when Node::DOWNLOAD_FILES
    DownloadFiles.download(state)
  when Node::SAVE_M3U_FILE
    SaveM3uFile.save(state)
  when Node::CHECK_M3U_FILE
    CheckM3uFile.check(state)
  when Node::PROMPT_M3U_FILE
    PromptM3uFile.prompt(state)
  end
end

Ambler.amble(initial_state, Node::CHECK_M3U_FILE, method(:direct))

puts 'Application finished.'
