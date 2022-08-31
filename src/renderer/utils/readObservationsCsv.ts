import { csvParse } from 'd3-dsv';
import { promises as fsPromises } from 'fs';

const { readFile } = fsPromises;

export default async function readObservationsCsv(
  csvFilePath: string,
  dbDirPath: string
): Promise<Observation[]> {
  const file = await readFile(csvFilePath);
  const data = csvParse(file.toString(), (row) => ({
    ...row,
    location_absolute: `${dbDirPath}${row.location}`,
    timestamp: row.timestamp === undefined ? undefined : new Date(row.timestamp),
  }));
  return data as unknown as Observation[];
}
