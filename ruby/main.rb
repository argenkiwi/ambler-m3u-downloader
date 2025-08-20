require_relative 'lib/ambler'
require_relative 'lib/check_m3u_file'
require_relative 'lib/download_files'
require_relative 'lib/list_urls'
require_relative 'lib/prompt_m3u_file'
require_relative 'lib/prompt_options'
require_relative 'lib/read_m3u_file'
require_relative 'lib/resolve_urls'
require_relative 'lib/save_m3u_file'

initial_m3u_file = ARGV.empty? ? nil : File.expand_path(ARGV.first)
initial_state = {
  m3u_file: initial_m3u_file,
  urls: []
}

Ambler.amble(initial_state, :check_m3u_file) do |lead, state|
  case lead
  when :prompt_options
    option = PromptOptions.prompt(state[:urls])
    case option
    when :download
      [state, :download_files]
    when :resolve
      [state, :resolve_urls]
    when :list
      [state, :list_urls]
    when :quit
      [state, nil]
    else
      [state, :prompt_options]
    end
  when :list_urls
    ListUrls.list(state[:urls])
    [state, :prompt_options]
  when :resolve_urls
    state[:urls] = ResolveUrls.resolve(state[:urls])
    [state, :prompt_options]
  when :read_m3u_file
    state[:urls] = ReadM3uFile.read(state[:m3u_file])
    [state, :prompt_options]
  when :download_files
    DownloadFiles.download(state[:m3u_file], state[:urls])
    [state, :prompt_options]
  when :save_m3u_file
    SaveM3uFile.save(state[:m3u_file], state[:urls])
    [state, :prompt_options]
  when :check_m3u_file
    if CheckM3uFile.check(state[:m3u_file])
      [state, :read_m3u_file]
    else
      [state, :prompt_m3u_file]
    end
  when :prompt_m3u_file
    state[:m3u_file] = PromptM3uFile.prompt
    if state[:m3u_file].nil? || state[:m3u_file].empty?
      [state, nil]
    else
      [state, :check_m3u_file]
    end
  end
end

puts "Application finished."
