# frozen_string_literal: true

require 'httparty'
require 'nokogiri'

module ResolveKhinsiderUrl
  def self.resolve(url)
    return url unless url.start_with?('https://downloads.khinsider.com/game-soundtracks')

    response = HTTParty.get(url)
    return url unless response.code == 200

    doc = Nokogiri::HTML(response.body)
    audio_player = doc.at_css('audio')
    audio_player ? audio_player['src'] : url
  end
end
