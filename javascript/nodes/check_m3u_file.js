import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { Next } from '../ambler.js';
import { nodes } from '../nodes.js';

export async function checkM3UFile(state) {
  let m3u_file_path = state.m3u_file_path;
  const isValidM3U = (filePath) => {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile() && path.extname(filePath).toLowerCase() === '.m3u';
  };

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  while (!isValidM3U(m3u_file_path)) {
    console.log("\nInvalid M3U file path provided or file does not exist.");
    m3u_file_path = await new Promise(resolve => {
      rl.question("Please enter the path to the M3U file: ", answer => {
        resolve(answer);
      });
    });
  }

  rl.close();
  state.m3u_file_path = m3u_file_path;
  console.log(`Using M3U file: ${state.m3u_file_path}`);
  return new Next(nodes.readM3UFile, state);
}
