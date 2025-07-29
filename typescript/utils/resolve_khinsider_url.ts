export async function resolveKhinsiderUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const match = html.match(/<audio[^>]*src="([^"]+\.mp3)"[^>]*>/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (error) {
    console.error(`Error resolving Khinsider URL ${url}: ${error.message}`);
  }
  return url; // Return original URL if resolution fails
}
