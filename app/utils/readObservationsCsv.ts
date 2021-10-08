import { csv } from 'd3-fetch';

export default async function readObservationsCsv(filePath: string): Promise<Observation[]> {
  const data = await csv(filePath);
  return (data as unknown) as Observation[];
}
