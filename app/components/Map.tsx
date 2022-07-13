import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import mapboxgl from 'mapbox-gl';
import _ from 'lodash';
import { Button, Position, Tooltip } from '@blueprintjs/core';
import ReactDOM from 'react-dom';
import styles from './Map.scss';
import AnimalsListTooltipContent from './AnimalsListTooltipContent';
import { EmptyClasses } from '../constants/animalsClasses';

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
const mapboxStyle = require('assets/map-style.json');

mapboxStyle.sources.jsonsource = {
  type: 'geojson',
  data: require('assets/map-sources/africa.json')
};

// COMPONENT RENDERING

function getObservationCoordinates(row: Observation): [number, number] {
  return [row.coordinates_long, row.coordinates_lat];
}

function circleDiameter(count: number, total: number): number {
  const minSize = 10;
  const maxSize = 50;
  return minSize + (count / total) * (maxSize - minSize);
}

function makeStationMarker(
  t: TFunction,
  groupObservations: Observation[],
  species: _.Collection<string>,
  maxSpecies: number,
  setInspectedObservations: (observations: Observation[]) => void
) {
  // Observations from a single station should have approximately identical
  // coordinates, so we can pick any.
  const firstObservation = groupObservations[0];
  const coordinates = getObservationCoordinates(firstObservation);
  const count = groupObservations.length;
  const { station } = firstObservation;

  const diameter = circleDiameter(species.size(), maxSpecies);
  const maxPreviewPhotosCount = 3;

  const markerElement = document.createElement('div');
  markerElement.className = styles.marker;
  markerElement.setAttribute('style', `width: ${diameter}px; height: ${diameter}px;`);
  if (markerElement) {
    markerElement.addEventListener('click', (event: Event) => {
      const activeMarkers: NodeListOf<Element> = document.querySelectorAll(
        `.${styles.marker}.${styles.active}`
      );
      activeMarkers.forEach(marker => marker.classList.remove(styles.active));
      const target = event.currentTarget as HTMLTextAreaElement;
      target.classList.add(styles.active);
    });
  }

  const popupContentPlaceholder = document.createElement('div');
  ReactDOM.render(
    <>
      <h3>
        <b>{t('explore.inspect.station', { id: station })}</b>
      </h3>
      <p>
        <b>{t('explore.inspect.observations', { count })}</b>
      </p>
      <p>
        <Tooltip
          content={<AnimalsListTooltipContent entries={species.value()} />}
          position={Position.BOTTOM}
          className="speciesTooltip"
        >
          <b>{t('explore.inspect.species', { count: species.size() })}</b>
        </Tooltip>
      </p>
      <div className="photosPreview" style={{ display: 'flex' }}>
        {groupObservations.slice(0, maxPreviewPhotosCount).map(observation => (
          // eslint-disable-next-line
          <a
            key={observation.location}
            className="photosPreviewItem"
            onClick={() => setInspectedObservations(groupObservations)}
          >
            <img
              src={observation.location}
              alt="Observations preview"
              style={{ width: '100%', height: '100%' }}
            />
          </a>
        ))}
        <div>
          <Button
            onClick={() => setInspectedObservations(groupObservations)}
            className="photosPreviewItem"
            rightIcon="arrow-right"
            intent="primary"
          />
        </div>
      </div>
    </>,
    popupContentPlaceholder
  );

  const marker = new mapboxgl.Marker(markerElement)
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: diameter / 2 }).setDOMContent(popupContentPlaceholder));
  return marker;
}

function addMarkers(
  t: TFunction,
  observations: Observation[],
  map: mapboxgl.Map,
  setInspectedObservations: (observations: Observation[]) => void
) {
  // TODO: Drop observations with missing station and warn the user.
  const markers = _(observations)
    .groupBy(x => x.station)
    .map(group => ({
      species: _(group)
        .filter(x => !EmptyClasses.includes(x.pred_1))
        .map('pred_1')
        .uniq(),
      observations: group
    }));

  const maxSpecies = markers.map(x => x.species.size()).max();
  if (maxSpecies !== undefined) {
    map.on('load', () => {
      markers.forEach(group => {
        const marker = makeStationMarker(
          t,
          group.observations,
          group.species,
          maxSpecies,
          setInspectedObservations
        );
        marker.addTo(map);
      });
    });
  }
}

type MapProps = {
  observations: Observation[];
  onInspect: (observations: Observation[]) => void;
};

export default function Map(props: MapProps) {
  const { observations, onInspect } = props;
  const mapRef = React.createRef<HTMLDivElement>();
  const { t } = useTranslation();

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current as HTMLElement,
      style: mapboxStyle,
      center: [12, -0.8],
      zoom: 6
    });
    addMarkers(t, observations, map, onInspect);
    return function cleanup() {
      map.remove();
    };
  }, [observations]);

  return <div ref={mapRef} className={styles.mapContainer} />;
}
