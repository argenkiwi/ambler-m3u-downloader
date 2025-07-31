import { checkM3UFile } from './nodes/check_m3u_file.js';
import { readM3UFile } from './nodes/read_m3u_file.js';
import { promptOptions } from './nodes/prompt_options.js';
import { listUrls } from './nodes/list_urls.js';
import { resolveUrls } from './nodes/resolve_urls.js';
import { saveM3UFile } from './nodes/save_m3u_file.js';
import { downloadFiles } from './nodes/download_files.js';

export const nodes = {
    checkM3UFile,
    readM3UFile,
    promptOptions,
    listUrls,
    resolveUrls,
    saveM3UFile,
    downloadFiles,
};