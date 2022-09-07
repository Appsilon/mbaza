import { csvFormat } from 'd3-dsv';
import { writeFile } from 'fs/promises';
import { globby } from 'globby';
import _ from 'lodash';
import path from 'path';

import { Model } from '../../common/models';
import getExifMetadata from './getExifMetadata';
import getPathMetadata from './getPathMetadata';
import getStationMetadata from './getStationMetadata';
import getTopPredictions, { InferenceResult } from './getTopPredictions';
import getWcsMetadata from './getWcsMetadata';

function listPhotos(dir: string) {
  // Formats supported by `sharp`: https://sharp.pixelplumbing.com/#formats
  // File extensions: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
  const pattern = '**/*.(jpg|jpeg|jfif|pjpeg|pjp|png|webp|gif|avif|tif|tiff)';
  return globby(pattern, { cwd: dir, caseSensitiveMatch: false, onlyFiles: true });
}

export default async function prepareResults(
  inputPath: string,
  outputPath: string,
  stationsCsvPath: string,
  model: Model,
  projectId: string,
  deploymentId: string
) {
  const photosRelative = await listPhotos(inputPath);
  const photosAbsolute = photosRelative.map((photo) => path.join(inputPath, photo));

  const results: InferenceResult[] = await window.ipc.runInference(model, photosAbsolute);
  const topPredictions = getTopPredictions(results);
  const pathMetadata = getPathMetadata(photosRelative);
  const exifMetadata = await getExifMetadata(photosAbsolute);
  const stationMetadata = await getStationMetadata(pathMetadata, stationsCsvPath);

  const rows = _.range(photosRelative.length).map((i) => {
    const date = exifMetadata[i].exif_date || pathMetadata[i].path_date;
    return {
      ...getWcsMetadata({
        projectId,
        deploymentId,
        location: photosRelative[i],
        date,
        time: exifMetadata[i].exif_time,
        prediction: topPredictions[i].pred_1,
        score: topPredictions[i].score_1,
      }),
      date,
      coordinates_long: stationMetadata[i].grid_file_long || exifMetadata[i].exif_gps_long,
      coordinates_lat: stationMetadata[i].grid_file_lat || exifMetadata[i].exif_gps_lat,
      ...pathMetadata[i],
      ...exifMetadata[i],
      ...stationMetadata[i],
      ...topPredictions[i],
      ...results[i],
      label: topPredictions[i].pred_1,
    };
  });
  await writeFile(outputPath, csvFormat(rows));
}
