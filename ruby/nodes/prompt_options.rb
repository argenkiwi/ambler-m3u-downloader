# frozen_string_literal: true

require_relative '../lib/ambler'

module PromptOptions
  DEFAULT_UTILS = { read_line: -> { $stdin.gets.to_s.chomp } }.freeze

  def self.node(edges, utils = DEFAULT_UTILS)
    ->(state) {
      has_khinsider_urls = state[:urls].any? { |url|
        url.start_with?('https://downloads.khinsider.com/game-soundtracks')
      }

      options = [
        ['quit', nil],
        ['list', Ambler::Next.new(edges[:on_list], state)]
      ]

      if has_khinsider_urls
        options << ['resolve', Ambler::Next.new(edges[:on_resolve], state)]
      else
        options << ['download', Ambler::Next.new(edges[:on_download], state)]
      end

      loop do
        puts "\nSelect an option:"
        options.each_with_index { |(name, _), i| puts "#{i + 1}. #{name}" }

        line = utils[:read_line].call
        choice = Integer(line.strip, 10) - 1 rescue -1
        if choice >= 0 && choice < options.length
          return options[choice][1]
        end

        puts 'Invalid option. Please try again.'
      end
    }
  end
end
