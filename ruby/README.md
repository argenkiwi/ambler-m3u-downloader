# Ambler (Ruby Version)

This is a Ruby port of the Ambler application, a command-line tool for downloading files from a .m3u playlist.

## Installation

1. Install [Ruby](https://www.ruby-lang.org/en/documentation/installation/) on your system.
2. Install the [Bundler](https://bundler.io/) gem:
   ```bash
   gem install bundler
   ```
3. Navigate to the `ruby` directory and install the required gems:
   ```bash
   bundle install
   ```

## Usage

To run the application, you can either provide the path to an existing .m3u file as a command-line argument or run the script without arguments to be prompted for a file path.

### With an existing .m3u file:

```bash
ruby main.rb /path/to/your/playlist.m3u
```

### Without arguments:

```bash
ruby main.rb
```

The application will then guide you through the available options for processing the URLs in the playlist.
