import axios from 'axios';
import * as cheerio from 'cheerio';

export async function resolveKhinsiderUrl(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const downloadLink = $('#audio').attr('src');
        if (downloadLink) {
            return downloadLink;
        } else {
            throw new Error("Could not find download link on the page.");
        }
    } catch (error) {
        throw new Error(`Failed to resolve Khinsider URL: ${error.message}`);
    }
}
