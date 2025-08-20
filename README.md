# Ambler M3U Downloader

This project contains implementations of an M3U downloader application in various languages, all following the same design pattern based on the `amble` function.

## Specifications

The detailed specifications for the application can be found in the [SPECS.md](SPECS.md) file.

## Implementations

This project includes the following implementations:

*   [JavaScript](javascript/)
*   [PHP](php/)
*   [Python](python/)
*   [Ruby](ruby/)
*   [TypeScript](typescript/)

### JavaScript

To run the JavaScript implementation:

```bash
cd javascript
npm install
node main.js [path/to/your/file.m3u]
```

### PHP

To run the PHP implementation:

```bash
cd php
composer install
php main.php [path/to/your/file.m3u]
```

### Python

To run the Python implementation:

```bash
cd python
pip install -r requirements.txt
python main.py [path/to/your/file.m3u]
```

### Ruby

To run the Ruby implementation:

```bash
cd ruby
bundle install
ruby main.rb [path/to/your/file.m3u]
```

### TypeScript

To run the TypeScript implementation:

```bash
cd typescript
deno run --allow-read --allow-net main.ts [path/to/your/file.m3u]
```
