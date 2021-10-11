import { promises as fsPromises} from 'fs';
import { csvParse } from 'd3-dsv';

const { readFile } = fsPromises;

export default async function readObservationsCsv(filePath: string): Promise<Observation[]> {
  const file = await readFile(filePath);
  let data = csvParse(file.toString());
  return data as unknown as Observation[];
}
