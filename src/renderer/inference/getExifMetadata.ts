import ExifReader from 'exifreader';
import { readFile } from 'fs/promises';
import _ from 'lodash';

function getDateTime(tags?: ExifReader.ExpandedTags) {
  const dateTime = _.get(tags, 'exif.DateTimeOriginal.value[0]');
  if (typeof dateTime === 'string') {
    const [date, time] = dateTime.split(' ');
    return { exif_date: date.replaceAll(':', '-'), exif_time: time };
  }
  return { exif_date: '', exif_time: '' };
}

function getCoords(tags?: ExifReader.ExpandedTags) {
  if (tags && tags.gps) {
    const { Longitude, Latitude } = tags.gps;
    return { exif_gps_long: Longitude, exif_gps_lat: Latitude };
  }
  return { exif_gps_long: undefined, exif_gps_lat: undefined };
}

function f(photo: Buffer) {
  let tags;
  try {
    tags = ExifReader.load(photo, { expanded: true });
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }
  return { ...getDateTime(tags), ...getCoords(tags) };
}

export default async function getExifMetadata(photosAbsolute: string[]) {
  const result = [];
  // TODO: Read photos concurrently to increase performance.
  for (const photoPath of photosAbsolute) {
    const photo = await readFile(photoPath); // eslint-disable-line no-await-in-loop
    result.push(f(photo));
  }
  return result;
}
