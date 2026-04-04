# frozen_string_literal: true

require_relative '../lib/ambler'

module ListUrls
  def self.node(edges)
    ->(state) {
      puts "\n--- URLs ---"
      state[:urls].each { |url| puts url }
      puts '------------'
      Ambler::Next.new(edges[:on_success], state)
    }
  end
end
