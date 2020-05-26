import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

// The below seems to not be suppressing the "missing CSS declarations" warning
// because we are using typed imports in this project
// Worth looking at: https://github.com/mapbox/mapbox-gl-js/issues/5785
import 'mapbox-gl/dist/mapbox-gl.css';

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

export default function Map(props: Props) {
  let mapContainer: HTMLElement | null | undefined;
  const { data } = props;

  // eslint-disable-next-line no-console
  console.log(data.observations.length);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container:
        mapContainer === undefined || mapContainer === null ? '' : mapContainer,
      style: mapboxStyle,
      center: [12, -0.8],
      zoom: 6
    });
    map.on('load', () => {
      map.addSource('gabon', {
        type: 'geojson',
        data: gabonMap
      });
    });
  });

  return (
    <div style={{ width: '100%' }}>
      <div
        ref={(el): void => {
          mapContainer = el;
        }}
        className={styles.mapContainer}
      />
    </div>
  );
}
