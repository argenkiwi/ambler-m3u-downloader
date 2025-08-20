module SaveM3uFile
  def self.save(m3u_file, urls)
    File.write(m3u_file, urls.join("\n") + "\n")
  end
end
