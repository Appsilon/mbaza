import { csvParse } from 'd3-dsv';
import { readFile } from 'fs/promises';

type Row = {
  camStation: string;
  Lat: string;
  Lon: string;
};

type StationMetadata = {
  grid_file_lat: string | undefined;
  grid_file_long: string | undefined;
};

async function readStationsCsv(stationsCsvPath: string) {
  if (!stationsCsvPath) return new Map();
  const stationsCsv = await readFile(stationsCsvPath);
  const rows = csvParse(stationsCsv.toString()) as unknown as Row[];
  return new Map(
    rows.map(({ camStation, Lat, Lon }) => [
      camStation,
      { grid_file_lat: Lat, grid_file_long: Lon },
    ])
  );
}

export default async function getStationMetadata(
  rows: { station: string }[],
  stationsCsvPath: string
): Promise<StationMetadata[]> {
  const stationsMap = await readStationsCsv(stationsCsvPath);
  return rows.map(
    (row) => stationsMap.get(row.station) || { grid_file_lat: undefined, grid_file_long: undefined }
  );
}
