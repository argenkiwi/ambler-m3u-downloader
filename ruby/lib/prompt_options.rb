module PromptOptions
  def self.prompt(urls)
    puts "#{urls.length} URLs loaded."
    puts "Select an option:"
    puts "  d: download all files"
    puts "  r: resolve all URLs"
    puts "  l: list all URLs"
    puts "  q: quit"
    print "> "
    option = gets.chomp
    case option
    when "d"
      :download
    when "r"
      :resolve
    when "l"
      :list
    when "q"
      :quit
    else
      nil
    end
  end
end
