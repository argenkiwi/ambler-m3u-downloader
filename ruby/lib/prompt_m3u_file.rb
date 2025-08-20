module PromptM3uFile
  def self.prompt
    print "Enter the path to the m3u file: "
    gets.chomp
  end
end
