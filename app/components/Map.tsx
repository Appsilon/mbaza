import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import _ from 'lodash';
import {
  Button,
  Card,
  Classes,
  Drawer,
  Elevation,
  Position,
  Tooltip
} from '@blueprintjs/core';
import ReactDOM from 'react-dom';
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

function makeStationMarker(
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
  const thumbnailSize = diameter / 2;
  const thumbnailOffset = thumbnailSize / 2;
  const maxPreviewPhotosCount = 3;

  const markerElement = document.createElement('div');
  markerElement.className = 'marker';
  markerElement.setAttribute(
    'style',
    `width: ${diameter}px; height: ${diameter}px;`
  );
  ReactDOM.render(
    <img
      src={firstObservation.path}
      style={{
        width: thumbnailSize,
        height: thumbnailSize,
        marginTop: -thumbnailOffset,
        marginLeft: -thumbnailOffset
      }}
      alt={`Station ${station}`}
    />,
    markerElement
  );

  const popupContentPlaceholder = document.createElement('div');
  ReactDOM.render(
    <>
      <h3>
        Station&nbsp;
        <b>{station}</b>
      </h3>
      <p>
        <b>{count}</b>
        &nbsp; observations
      </p>
      <p>
        <Tooltip
          content={species.join(', ')}
          position={Position.BOTTOM}
          className="speciesTooltip"
        >
          <b>
            {species.size()}
            &nbsp;species
          </b>
        </Tooltip>
      </p>
      <p>
        <div className="photosPreview" style={{ display: 'flex' }}>
          {groupObservations
            .slice(0, maxPreviewPhotosCount)
            .map(observation => (
              // eslint-disable-next-line
              <a
                key={observation.path}
                className="photosPreviewItem"
                onClick={() => setInspectedObservations(groupObservations)}
              >
                <img
                  src={observation.path}
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
      </p>
    </>,
    popupContentPlaceholder
  );

  const marker = new mapboxgl.Marker(markerElement)
    .setLngLat(coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: diameter / 2 }).setDOMContent(
        popupContentPlaceholder
      )
    );
  return marker;
}

function addMarkers(
  observations: Observation[],
  map: mapboxgl.Map,
  setInspectedObservations: (observations: Observation[]) => void
) {
  // TODO: Drop observations with missing station and warn the user.
  const markers = _(observations)
    .filter(x => !emptyClasses.includes(x.pred_1))
    .groupBy(x => x.station)
    .map(group => ({
      species: _(group)
        .map('pred_1')
        .uniq(),
      observations: group
    }));

  const maxSpecies = markers.map(x => x.species.size()).max();
  if (maxSpecies !== undefined) {
    map.on('load', () => {
      markers.forEach(group => {
        const marker = makeStationMarker(
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

function observationCard(observation: Observation): JSX.Element {
  return (
    <Card
      elevation={Elevation.TWO}
      key={observation.path}
      style={{ marginTop: 10 }}
    >
      <h3 style={{ marginTop: 0 }}>
        {observation.pred_1}
        {' probably seen at '}
        {observation.date}
      </h3>
      <div style={{ display: 'flex' }}>
        <div>
          <img src={observation.path} width={400} alt={observation.pred_1} />
        </div>
        <div style={{ marginLeft: 24 }}>
          <table className="bp3-html-table bp3-html-table-condensed">
            <thead>
              <tr>
                <th>Prediction</th>
                <th>Probability</th>
              </tr>
            </thead>
            <tbody>
              {[
                [observation.pred_1, observation.score_1],
                [observation.pred_2, observation.score_2],
                [observation.pred_3, observation.score_3]
              ].map(i => (
                <tr key={i[0]}>
                  <td>{i[0]}</td>
                  <td>
                    {((i[1] as number) * 100).toFixed(2)}
                    &nbsp;%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ margin: '20px 10px' }}>
            <p>
              <strong>Camera: </strong>
              {observation.camera}
            </p>
            <p>
              <strong>Check: </strong>
              {observation.check}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function observationsInspector(
  inspectedObservations: Observation[],
  setInspectedObservations: React.Dispatch<React.SetStateAction<Observation[]>>
): React.ReactNode {
  if (inspectedObservations.length === 0) {
    return null;
  }
  return (
    <Drawer
      title={`Observations in station ${inspectedObservations[0].station}`}
      icon="camera"
      isOpen={inspectedObservations.length > 0}
      onClose={() => setInspectedObservations([])}
      hasBackdrop={false}
    >
      <div className={Classes.DRAWER_BODY}>
        <div className={Classes.DIALOG_BODY}>
          {inspectedObservations.map(observation =>
            observationCard(observation)
          )}
        </div>
      </div>
      <div className={Classes.DRAWER_FOOTER}>
        {inspectedObservations.length}
        &nbsp; observations
      </div>
    </Drawer>
  );
}

export default function Map(props: Props) {
  const { data } = props;
  const mapRef = React.createRef<HTMLDivElement>();

  const [inspectedObservations, setInspectedObservations] = useState<
    Observation[]
  >([]);
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current as HTMLElement,
      style: mapboxStyle,
      center: [12, -0.8],
      zoom: 6
    });
    addMarkers(data.observations, map, setInspectedObservations);
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
      {observationsInspector(inspectedObservations, setInspectedObservations)}
    </div>
  );
}
