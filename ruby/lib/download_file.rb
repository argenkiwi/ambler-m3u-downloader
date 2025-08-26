# frozen_string_literal: true

require 'async/http/internet'
require 'fileutils'

module DownloadFile
  def self.download(url, output_folder)
    Async do
      internet = Async::HTTP::Internet.new
      begin
        FileUtils.mkdir_p(output_folder)
        filename = File.basename(url)
        filepath = File.join(output_folder, filename)

        response = internet.get(url)
        raise "Request failed with status #{response.status}" unless response.success?

        File.open(filepath, 'wb') do |f|
          f.write(response.read)
        end
      ensure
        internet&.close
      end
    end
  end
end
