import { formatISO } from "date-fns";
import _ from "lodash";

// According to https://ipt.gbif.org/manual/en/ipt/2.5/occurrence-data
export default function convertToGbif(observations: Observation[]) {
  return _(observations).map(o => {
    const isoDate = formatISO(o.timestamp, { representation: 'date' });
    return {
      // Required DwC fields
      occurenceId: [o.project_id, o.station, isoDate].join('__'),
      basisOfRecord: 'Occurrence',
      scientificName: '?', // TODO: Check with Robbie what to use here.
      eventDate: isoDate,
      // Recommended DwC fields
      taxonRank: '?', // TODO: Check with Robbie what to use here.
      kingdom: 'Animalia',
      decimalLatitude: o.coordinates_lat,
      decimalLongitude: o.coordinates_long,
      geodeticDatum: '?' // TODO: Check with Robbie what to use here.
    };
  })
}
