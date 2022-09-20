import { mkdir } from 'fs/promises';
import { globby } from 'globby';
import path from 'path';

import listPhotos from './listPhotos';

async function copyDirTree(inputDir: string, outputDir: string) {
  const dirs = await globby('**', { cwd: inputDir, onlyDirectories: true });
  await mkdir(outputDir, { recursive: true });
  await Promise.all(dirs.map((dir) => mkdir(path.join(outputDir, dir), { recursive: true })));
}

export default async function createThumbnails(
  inputDir: string,
  outputDir: string,
  maxWidthHeight: number
) {
  await copyDirTree(inputDir, outputDir);
  const photos = await listPhotos(inputDir);
  for (const photo of photos) {
    try {
      // Intentionally await in loop:
      // processing all photos at once would consume too much resources.
      // eslint-disable-next-line no-await-in-loop
      await window.ipc.createThumbnail(
        path.join(inputDir, photo),
        path.join(outputDir, photo),
        maxWidthHeight
      );
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  }
}
