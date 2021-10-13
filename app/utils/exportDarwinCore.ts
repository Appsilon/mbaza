import { format } from 'date-fns';
import _ from 'lodash';

export default function exportDarwinCore(observations: Observation[], exportDate: Date) {
  function convertEvent(event: Observation[]) {
    const o = event[0]; // Use one of the observations in the event as the representative.
    return {
      occurenceID: [o.project_id, o.station, o.event_id].join('__'),
      collectionID: '',
      collectionCode: o.project_id,
      kingdom: 'Animalia',
      phylum: 'Chordata',
      class: o.class,
      order: o.order,
      family: o.family,
      genus: o.genus,
      specificEpithet: o.species,
      dateIdentified: format(exportDate, 'yyyy-MM-DD'),
      identifiedBy: '',
      continent: '',
      country: '',
      // TODO: Add random noise to coordinates (optionally).
      decimalLatitude: o.coordinates_lat,
      decimalLongitude: o.coordinates_long,
      basisOfRecord: 'Occurrence',
      eventDate: format(o.timestamp, 'yyyy-MM-DD'),
      year: format(o.timestamp, 'yyyy'),
      month: format(o.timestamp, 'MM'),
      day: format(o.timestamp, 'DD'),
      modified: format(exportDate, 'yyyy-MM-DD'),
      type: 'StillImage',
      format: 'JPEG',
      identifier: '',
      publisher: '',
      license: '',
      rightsHolder: '',
      scientificName: [o.genus, o.species].join(' ')
    };
  }
  return _(observations)
    .groupBy('event_id')
    .values()
    .map(convertEvent)
    .value();
}
