# frozen_string_literal: true

require_relative '../lib/node'

module PromptOptions
  def self.prompt(state)
    urls = state[:urls]

    if STDIN.isatty
      puts "#{urls.length} URLs loaded."
      puts 'Select an option:'
      puts '  d: download all files'
      puts '  r: resolve all URLs'
      puts '  l: list all URLs'
      puts '  q: quit'
      print '> '
      option = gets.chomp
    else
      # Non-interactive mode, choose a default action.
      can_resolve = urls.any? { |url| url.start_with?('https://downloads.khinsider.com/game-soundtracks') }
      option = can_resolve ? 'r' : 'd'
    end

    case option
    when 'd'
      [state, Node::DOWNLOAD_FILES]
    when 'r'
      [state, Node::RESOLVE_URLS]
    when 'l'
      [state, Node::LIST_URLS]
    when 'q'
      [state, nil]
    else
      [state, Node::PROMPT_OPTIONS]
    end
  end
end
