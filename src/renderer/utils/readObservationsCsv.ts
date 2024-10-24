import { csvParse } from 'd3-dsv';
import { promises as fsPromises } from 'fs';

const { readFile } = fsPromises;

export default async function readObservationsCsv(
  csvPath: string
): Promise<Observation[] | undefined> {
  try {
    const file = await readFile(csvPath);
    const data = csvParse(file.toString(), (row) => ({
      ...row,
      timestamp: row.timestamp === undefined ? undefined : new Date(row.timestamp),
    }));
    return data as unknown as Observation[];
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
