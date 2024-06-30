import { create } from '../source/write/zip.js';
import path from 'path';
import fsp from 'fs/promises';
import fs from 'fs';

async function boostrap() {
  console.time('zip');
  const inputDir = path.join(import.meta.dirname, 'output/3000-80000');
  // const inputDir = path.join(import.meta.dirname, 'output/3000-1000');
  const outputFile = path.join(import.meta.dirname, 'output/3000-80000-zip.xlsx');
  const zipFile = create();
  await zip(zipFile, inputDir, './');
  const buf = await zipFile.zip()
  await fsp.writeFile(outputFile, buf);
  console.timeEnd('zip');
}

boostrap();

async function zip(zipFile, inputDir, base) {
  const dirPath = path.join(inputDir, base)
  const files = await fsp.readdir(dirPath);

  for (const filename of files) {
    const newBase = path.posix.join(base, filename);
    const filePath = path.join(inputDir, newBase);
    const fileStat = await fsp.stat(filePath);

    if (fileStat.isDirectory()) {
      await zip(zipFile, inputDir, newBase);
      continue;
    }
    
    await zipFile.add(newBase, filePath, { compressed: true })
  }
}