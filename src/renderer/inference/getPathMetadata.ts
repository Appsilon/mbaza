import path from 'path';

function f(relativePath: string) {
  let station = '';
  let camera = '';
  let pathDate = '';
  for (const part of relativePath.split(path.sep)) {
    if (part.startsWith('STATION')) {
      station = part;
    } else if (part.startsWith('CAM')) {
      camera = part.substring(3);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(part)) {
      pathDate = part;
    }
  }
  return { station, camera, path_date: pathDate };
}

export default function getPathMetadata(relativePaths: string[]) {
  return relativePaths.map(f);
}
