import { add, Duration } from 'date-fns';
import _ from 'lodash';

export default function computeEvents(
  eventDuration: Duration,
  observations: Observation[]
): Observation[] {
  let eventId = 0; // Must uniquely identify the event across the whole data set.
  let eventPhoto = 0; // The photo number withing the event.
  function mapGroup(group: Observation[]): Observation[] {
    let eventEnd: Date;
    return _(group)
      .sortBy('timestamp')
      .map(observation => {
        if (eventEnd === undefined || observation.timestamp > eventEnd) {
          // Start a new event.
          eventId += 1;
          eventPhoto = 0;
          eventEnd = add(observation.timestamp, eventDuration);
        }
        eventPhoto += 1;
        return { ...observation, event_id: eventId, event_photo: eventPhoto };
      })
      .value();
  }
  const result = _(observations)
    .groupBy(o => [o.station, o.label].join()) // Use comma as separator.
    .values()
    .map(mapGroup)
    .flatten()
    .value();
  return result;
}
