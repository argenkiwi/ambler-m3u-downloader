require 'async/http'
require 'fileutils'

module DownloadFile
  def self.download(url, output_folder)
    Async do
      FileUtils.mkdir_p(output_folder)
      filename = File.basename(url)
      filepath = File.join(output_folder, filename)

      Async::HTTP.get(url) do |response|
        raise "Request failed with status #{response.status}" unless response.success?
        File.open(filepath, 'wb') do |f|
          f.write(response.read)
        end
      end
    end
  end
end
