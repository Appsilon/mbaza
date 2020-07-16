import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import _ from 'lodash';
import styles from './Map.css';

// Models can use different name for images without animals.
const emptyClasses = ['empty', 'blank'];

/*
To produce a country file please have a look at download_map.sh

Useful tutorial - https://digitalki.net/2017/12/13/offline-maps-with-mapbox-gl-js-and-electron/

Possible style inspirations:
https://github.com/maputnik/osm-liberty
https://github.com/Toshiwoz/terry-mapper
https://github.com/mapbox/mapbox-gl-styles
https://github.com/klokantech/mapbox-gl-js-offline-example
*/

/* eslint-disable no-param-reassign */
/* eslint-disable global-require */

// STYLE FILE PREPROCESSING

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const changeSources = (jsonObj: any) => {
  Object.entries(jsonObj).forEach(([key, value]) => {
    if (key === 'source') {
      jsonObj[key] = 'jsonsource'; // change the source of all elements if it's set incorrectly
    }
    if (key === 'text-font') {
      jsonObj[key] = ['Open Sans Semibold']; // only use one font in the simple version
    }
    if (value !== null && typeof value === 'object') {
      changeSources(value);
    }
  });
};

const mapboxStyle = require('assets/map-style.json');

delete mapboxStyle.sources.mapbox;
changeSources(mapboxStyle);
const gabonMap = require('assets/map-sources/gabon_parks_map.json');

mapboxStyle.sources.jsonsource = {
  type: 'geojson',
  data: gabonMap
};
mapboxStyle.glyphs = 'assets/map-font/{fontstack}/{range}.pbf';

// COMPONENT RENDERING

type Props = {
  data: ObservationsData;
};

function getObservationCoordinates(row: Observation): [number, number] {
  return [row.coordinates_long, row.coordinates_lat];
}

function circleDiameter(count: number, total: number): number {
  const minSize = 20;
  const maxSize = 100;
  return minSize + (count / total) * (maxSize - minSize);
}

function addMarkers(observations: Observation[], map: mapboxgl.Map) {
  // TODO: Drop observations with missing station and warn the user.
  const markers = _(observations)
    .filter(x => !emptyClasses.includes(x.pred_1))
    .groupBy(x => x.station)
    .map(group => ({
      station: group[0].station,
      // Observations from a single station should have approximately identical
      // coordinates, so we can pick any.
      coordinates: getObservationCoordinates(group[0]),
      count: group.length,
      species: _(group)
        .map('pred_1')
        .uniq(),
      observations: group
    }));
  const maxSpecies = markers.map(x => x.species.size()).max();
  if (maxSpecies !== undefined) {
    map.on('load', () => {
      markers.forEach(marker => {
        const diameter = circleDiameter(marker.species.size(), maxSpecies);
        const thumbnailSize = diameter / 2;
        const thumbnailOffset = thumbnailSize / 2;

        const el = document.createElement('div');
        el.className = 'marker';
        el.setAttribute(
          'style',
          `width: ${diameter}px; height: ${diameter}px;`
        );
        el.innerHTML = `<img
          src="${marker.observations[0].path}"
          style="width: ${thumbnailSize}px; height: ${thumbnailSize}px; margin-top: -${thumbnailOffset}px; margin-left: -${thumbnailOffset}px;">`;
        new mapboxgl.Marker(el)
          .setLngLat(marker.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: diameter / 2 }).setHTML(
              `<h3>Station <b>${marker.station}</b></h3>
               <p></p>
               <p><b>${marker.count}</b> observations</p>
               <p><b>${marker.species.size()} species</b>:
                  ${marker.species.join(', ')}</p>`
            )
          )
          .addTo(map);
      });
    });
  }
}

export default function Map(props: Props) {
  const { data } = props;
  const mapRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current as HTMLElement,
      style: mapboxStyle,
      center: [12, -0.8],
      zoom: 6
    });
    addMarkers(data.observations, map);
    return function cleanup() {
      map.remove();
    };
  });
  return (
    <div
      style={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div ref={mapRef} className={styles.mapContainer} />
    </div>
  );
}
