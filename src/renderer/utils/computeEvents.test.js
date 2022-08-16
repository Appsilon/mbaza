import computeEvents from './computeEvents';

describe('computeEvents', () => {
  it('properly handles event duration', () => {
    const base = {
      station: 'station1',
      label: 'elephant'
    };
    const observations = [
      { ...base, timestamp: new Date('2000-01-01T12:00:00'), expected_event_id: 1 },
      { ...base, timestamp: new Date('2000-01-01T12:30:01'), expected_event_id: 2 },
      { ...base, timestamp: new Date('2000-01-01T12:30:00'), expected_event_id: 1 },
      { ...base, timestamp: new Date('2000-01-01T12:29:59'), expected_event_id: 1 }
    ];
    const result = computeEvents({ minutes: 30 }, observations);
    for (const observation of result) {
      expect(observation.event_id).toBe(observation.expected_event_id);
    }
  });

  it('properly handles observation groups', () => {
    const base = {
      timestamp: new Date('2000-01-01T12:00:00')
    };
    const observations = [
      { ...base, station: '1', label: 'a', expected_event_id: 1 },
      { ...base, station: '2', label: 'a', expected_event_id: 2 },
      { ...base, station: '1', label: 'b', expected_event_id: 3 },
      { ...base, station: '2', label: 'b', expected_event_id: 4 }
    ];
    const result = computeEvents({ minutes: 30 }, observations);
    for (const observation of result) {
      expect(observation.event_id).toBe(observation.expected_event_id);
    }
  });
});
