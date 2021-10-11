import { add, Duration } from 'date-fns';
import _ from 'lodash';

export default function computeEvents(
  eventDuration: Duration,
  observations: Observation[]
): Observation[] {
  let eventId = 0; // Must uniquely identify the event across the whole data set.
  function handleGroup(group: Observation[]): Observation[] {
    let eventEnd: Date;
    return _(group)
      .sortBy('timestamp')
      .map(observation => {
        if (eventEnd === undefined || observation.timestamp > eventEnd) {
          // Start a new event.
          eventId += 1;
          eventEnd = add(observation.timestamp, eventDuration);
        }
        return { ...observation, event_id: eventId };
      })
      .value();
  }
  const result = _(observations)
    .groupBy(o => [o.station, o.label].join()) // Use comma as separator.
    .mapValues(handleGroup)
    .flatMap()
    .value();
  // For some reason, TypeScript believes `result` to be `Observation[][]`.
  return (result as unknown) as Observation[];
}
