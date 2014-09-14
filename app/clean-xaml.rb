require 'tempfile'
require 'fileutils'

xaml_files = File.join("**", "*.xaml")

puts "\033[0;32m----- Cleaning XAML files -----\033[39m\n"

Dir.glob(xaml_files).each do |file|
  file_name = File.basename(file)
  dir_name = File.dirname(file)
  puts "\033[0;34m#{file_name}\033[39m in \033[0;37m#{dir_name}\033[39m"
  
  temp_file = Tempfile.new(file_name)
  
  begin
    File.open(file, 'r') do |infile|
      while (line = infile.gets)
        if /<Path.+\/>/.match(line)
          temp_file.puts line.strip
        end
      end
    end
    
    temp_file.rewind
    FileUtils.mv(temp_file.path, file)
    
  ensure
    temp_file.close
    temp_file.unlink
  end
end

puts "\033[0;32m----- Completed XAML file cleaning -----\033[39m\n"