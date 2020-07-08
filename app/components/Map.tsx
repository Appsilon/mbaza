import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import _ from 'lodash';
import styles from './Map.css';

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

const mapboxStyle = require('../../resources/map-style.json');

delete mapboxStyle.sources.mapbox;
changeSources(mapboxStyle);
const gabonMap = require('../../resources/map_sources/gabon_parks_map.json');

mapboxStyle.sources.jsonsource = {
  type: 'geojson',
  data: gabonMap
};
mapboxStyle.glyphs = '../resources/map_font/{fontstack}/{range}.pbf';

// COMPONENT RENDERING

type Props = {
  data: ObservationsData;
};

function getObservationCoordinates(row: Observation): [number, number] {
  return [row.coordinates_long, row.coordinates_lat];
}

function makeLocationFeature(observations: Observation[]) {
  // TODO: remove random coordinates from Lope and verify that photos have correct coords in .
  const coordinates = getObservationCoordinates(observations[0]);
  const description = _.map(observations, 'pred_1').join(', ');
  return {
    coordinates,
    title: `${observations.length} observations`,
    description
  };
}

export default function Map(props: Props) {
  const mapRef = React.createRef<HTMLDivElement>();

  const { data } = props;

  // TODO: remove slice and fix performance.
  const locations = _(data.observations.slice(0, 100)).groupBy(
    getObservationCoordinates
  );

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current as HTMLElement,
      style: mapboxStyle,
      center: [12, -0.8],
      zoom: 6
    });
    map.on('load', () => {
      locations.forEach((observations: Observation[]) => {
        const marker = makeLocationFeature(observations);
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';
        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
          .setLngLat(marker.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(
                `<h3>${marker.title}</h3><p><b>Observed:</b> ${marker.description}</p>`
              )
          )
          .addTo(map);
      });
    });
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
