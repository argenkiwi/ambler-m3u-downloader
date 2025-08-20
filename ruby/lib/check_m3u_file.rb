module CheckM3uFile
  def self.check(m3u_file)
    return false if m3u_file.nil?
    File.file?(m3u_file)
  end
end
