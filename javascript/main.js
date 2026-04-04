import { amble, node } from './ambler.js';
import { checkM3UFile } from './nodes/check_m3u_file.js';
import { promptM3UFile } from './nodes/prompt_m3u_file.js';
import { readM3UFile } from './nodes/read_m3u_file.js';
import { promptOptions } from './nodes/prompt_options.js';
import { listUrls } from './nodes/list_urls.js';
import { resolveUrls } from './nodes/resolve_urls.js';
import { saveM3UFile } from './nodes/save_m3u_file.js';
import { downloadFiles } from './nodes/download_files.js';

const initialState = {
    m3uFilePath: process.argv[2] || null,
    urls: [],
};

// Entry loop
const check  = node(() => checkM3UFile({ onRead: read, onPrompt: prompt }));
const read   = node(() => readM3UFile({ onSuccess: options }));
const prompt = node(() => promptM3UFile({ onCheck: check }));

// Main menu
const options  = node(() => promptOptions({ onList: listNode, onResolve: resolve, onDownload: download }));
const listNode = node(() => listUrls({ onSuccess: options }));
const resolve  = node(() => resolveUrls({ onSuccess: save }));
const save     = node(() => saveM3UFile({ onSuccess: options }));

// Terminal node
const download = node(() => downloadFiles({ onSuccess: (_state) => null }));

await amble(check, initialState);
