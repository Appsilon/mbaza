import { csvParse } from 'd3-dsv';
import { promises as fsPromises } from 'fs';

const { readFile } = fsPromises;

export default async function readObservationsCsv(filePath: string): Promise<Observation[]> {
  const file = await readFile(filePath);
  const data = csvParse(file.toString(), row => ({
    ...row,
    timestamp: row.timestamp === undefined ? undefined : new Date(row.timestamp)
  }));
  return (data as unknown) as Observation[];
}
