module ReadM3uFile
  def self.read(m3u_file)
    File.readlines(m3u_file).map(&:strip).reject { |line| line.start_with?('#') }
  end
end
