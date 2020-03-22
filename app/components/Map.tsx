import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import styles from './Map.css';

mapboxgl.accessToken =
  'pk.eyJ1Ijoid29qZHppdyIsImEiOiJjazgzMnYzMTUwc2h1M2dtd3RmZzV0ZDFsIn0.HeoUxZJkRK2ckg9JfQAT_w';

export default class Map extends React.Component {
  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [11, -0.7],
      zoom: 6
    });
  }

  render() {
    return (
      <div style={{ width: '60vw' }}>
        <div
          ref={el => (this.mapContainer = el)}
          className={styles.mapContainer}
        />
      </div>
    );
  }
}
