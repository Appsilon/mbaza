import { csvFormat } from 'd3-dsv';
import { writeFile } from 'fs/promises';
import { globby } from 'globby';

import { Model } from '../../common/models';

function listPhotos(dir: string) {
  // Formats supported by `sharp`: https://sharp.pixelplumbing.com/#formats
  // File extensions: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
  const pattern = '**/*.(jpg|jpeg|jfif|pjpeg|pjp|png|webp|gif|avif|tif|tiff)';
  return globby(pattern, { cwd: dir, caseSensitiveMatch: false, onlyFiles: true });
}

export default async function prepareResults(
  inputPath: string,
  outputPath: string,
  _stationsCsvPath: string,
  _model: Model,
  _projectId: string,
  _deploymentId: string
) {
  const photos = await listPhotos(inputPath);
  const rows = photos.map((location) => ({ location }));
  await writeFile(outputPath, csvFormat(rows));
}
