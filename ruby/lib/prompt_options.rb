# frozen_string_literal: true

module PromptOptions
  def self.prompt(urls)
    puts "#{urls.length} URLs loaded."
    can_resolve = urls.any? { |url| url.start_with?('https://downloads.khinsider.com/game-soundtracks') }
    options = {
      'l' => { text: 'list all URLs', value: :list },
      'q' => { text: 'quit', value: :quit }
    }
    if can_resolve
      options['r'] = { text: 'resolve all URLs', value: :resolve }
    else
      options['d'] = { text: 'download all files', value: :download }
    end
    puts 'Select an option:'
    options.each do |key, option|
      puts "  #{key}: #{option[:text]}"
    end
    print '> '
    loop do
      option = gets.chomp.downcase
      return options[option][:value] if options.key?(option)

      puts 'Invalid option, please try again.'
      print '> '
    end
  end
end
