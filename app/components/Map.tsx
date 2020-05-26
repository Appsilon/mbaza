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

function randomFloat(min: number, max: number) {
  return min + (max - min) * Math.random();
}

function makeLocationFeature(
  observations: Observation[],
  coordinates: [number, number]
) {
  // TODO: remove random coordinates from Lope and verify that photos have correct coords in .
  coordinates = [randomFloat(11.2912, 11.743), randomFloat(-0.1099, -0.9365)];
  const description = _.map(observations, 'pred_1').join(', ');
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates
    },
    properties: {
      title: `${observations.length} observations`,
      description
    }
  };
}

export default function Map(props: Props) {
  const mapRef = React.createRef<HTMLDivElement>();

  const { data } = props;

  // TODO: remove slice and fix performance.
  const locations = _.groupBy(data.observations.slice(0, 100), row => [
    row.exif_gps_lat,
    row.exif_gps_long
  ]);

  const observationsGeojsonFeatures = _.map(locations, makeLocationFeature);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current as HTMLElement,
      style: mapboxStyle,
      center: [12, -0.8],
      zoom: 6
    });
    map.on('load', () => {
      observationsGeojsonFeatures.forEach((marker: any) => {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';
        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(
                `<h3>${marker.properties.title}</h3><p><b>Observed:</b> ${marker.properties.description}</p>`
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
    <div style={{ width: '100%' }}>
      <div ref={mapRef} className={styles.mapContainer} />
    </div>
  );
}
