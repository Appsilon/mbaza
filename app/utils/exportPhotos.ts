import format from 'date-fns/format';
import { promises as fsPromises } from 'fs';
import { join } from 'path';

const { copyFile } = fsPromises;

let seq = 0;

function filename(o: Observation) {
  seq += 1;
  const name = [
    o.project_id || 'UnknownProject',
    o.station || 'UnknownStation',
    'UnknownCamera',
    `CAM${o.camera}`,
    format(o.timestamp, 'yyyy-MM-dd'),
    format(o.timestamp, 'HH-mm-ss'),
    o.event_id || 'UnknownEvent',
    seq
  ].join('__');
  const extension = o.location.split('.').pop();
  return `${name}.${extension}`;
}

export default async function exportPhotos(
  directory: string,
  observations: Observation[]
): Promise<void> {
  for await (const o of observations) {
    await copyFile(o.location, join(directory, filename(o)));
  }
}
