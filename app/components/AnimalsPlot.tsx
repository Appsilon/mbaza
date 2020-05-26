import React from 'react';
import { useTranslation } from 'react-i18next';
import Plot from 'react-plotly.js';
import _ from 'lodash';

type Props = {
  data: ObservationsData;
};

const selectorOptions = {
  buttons: [
    {
      step: 'month',
      stepmode: 'backward',
      count: 1,
      label: '1m'
    },
    {
      step: 'month',
      stepmode: 'backward',
      count: 6,
      label: '6m'
    },
    {
      step: 'year',
      stepmode: 'todate',
      count: 1,
      label: 'YTD'
    },
    {
      step: 'year',
      stepmode: 'backward',
      count: 1,
      label: '1y'
    },
    {
      step: 'all'
    }
  ]
};

const windowLength = 5;
const millisecondsInDay = 24 * 60 * 60 * 1000;

function getDateFromRow(row: Observation) {
  const onlyDay = row.exif_datetime.substr(0, row.exif_datetime.indexOf(' '));
  return new Date(Date.parse(_.replace(onlyDay, /:/g, '-')));
}

function getKeyFromRow(row: Observation) {
  const date = getDateFromRow(row);
  const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const window = Math.round(utcDate / millisecondsInDay / windowLength);
  const windowStartDate = new Date(window * windowLength * millisecondsInDay);
  return windowStartDate;
}

function preparePlotTrace(animalData: Observation[]) {
  const animalByDate = _.groupBy(animalData, getKeyFromRow);
  return {
    x: _.keys(animalByDate),
    y: _.map(animalByDate, 'length'),
    type: 'scatter',
    name: animalData[1].pred_1
  };
}

function prepareDataForPlot(data: Observation[]) {
  const dataSorted = _.sortBy(data, 'exif_datetime');
  const groupAnimal = _.groupBy(dataSorted, 'pred_1');
  return _.map(groupAnimal, preparePlotTrace);
}

export default function AnimalsPlot(props: Props) {
  const { data } = props;
  const { t } = useTranslation();

  const dataForPlot = prepareDataForPlot(data.observations);

  const layout = {
    responsive: true,
    title: `${t('Animals count over time')} (${windowLength} ${t(
      'days intervals'
    )})`,
    hovermode: 'closest',
    xaxis: {
      rangeselector: selectorOptions,
      rangeslider: {},
      tickformat: '%Y-%m-%d'
    }
  };

  return (
    <Plot
      data={dataForPlot as any}
      useResizeHandler
      style={{ width: '100%' }}
      layout={layout as any}
    />
  );
}
