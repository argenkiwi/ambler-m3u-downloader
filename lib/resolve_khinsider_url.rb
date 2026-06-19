# frozen_string_literal: true

require 'httparty'
require 'nokogiri'

module ResolveKhinsiderUrl
  def self.resolve(url)
    return url unless url.start_with?('https://downloads.khinsider.com/game-soundtracks')

    response = HTTParty.get(url)
    return url unless response.code == 200

    doc = Nokogiri::HTML(response.body)

    # The website structure has changed. The download link is no longer in an <audio> tag.
    # It's now in an <a> tag with the text "Click here to download as MP3".
    download_link = doc.at_xpath('//a[contains(text(), "Click here to download as MP3")]')
    if download_link
      return download_link['href']
    end

    # Fallback to FLAC if MP3 is not available
    download_link = doc.at_xpath('//a[contains(text(), "Click here to download as FLAC")]')
    if download_link
      return download_link['href']
    end

    # If no link is found, return the original URL
    url
  end
end
