# frozen_string_literal: true

require_relative 'lib/ambler'
require_relative 'nodes/check_m3u_file'
require_relative 'nodes/prompt_m3u_file'
require_relative 'nodes/read_m3u_file'
require_relative 'nodes/prompt_options'
require_relative 'nodes/list_urls'
require_relative 'nodes/resolve_urls'
require_relative 'nodes/save_m3u_file'
require_relative 'nodes/download_files'

initial_state = {
  m3u_file_path: ARGV.empty? ? nil : File.expand_path(ARGV.first),
  urls: []
}

# Entry loop
check   = Ambler.node { CheckM3uFile.node(on_read: read, on_prompt: prompt) }
read    = Ambler.node { ReadM3uFile.node(on_success: options) }
prompt  = Ambler.node { PromptM3uFile.node(on_check: check) }

# Main menu
options   = Ambler.node { PromptOptions.node(on_list: list_node, on_resolve: resolve, on_download: download) }
list_node = Ambler.node { ListUrls.node(on_success: options) }
resolve   = Ambler.node { ResolveUrls.node(on_success: save) }
save      = Ambler.node { SaveM3uFile.node(on_success: options) }

# Terminal node
download = Ambler.node { DownloadFiles.node(on_success: ->(_state) { nil }) }

Ambler.amble(check, initial_state)
