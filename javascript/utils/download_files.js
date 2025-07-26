const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadFile(url, outputFolder) {
    const fileName = path.basename(url.split('?')[0]);
    const outputPath = path.join(outputFolder, fileName);

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }

    const writer = fs.createWriteStream(outputPath);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

module.exports = downloadFile;
