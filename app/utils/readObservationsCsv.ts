import { csv } from 'd3-fetch';

export default async function readObservationsCsv(filePath: string): Promise<ObservationsData> {
  const data = await csv(filePath);
  const observations = (data as unknown) as Observation[];
  return { observations };
}
