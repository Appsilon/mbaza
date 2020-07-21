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

const windowLengthInDays = 5;
const millisecondsInDay = 24 * 60 * 60 * 1000;
const windowInMilliseconds = windowLengthInDays * millisecondsInDay;

function getDateFromRow(row: Observation) {
  return new Date(Date.parse(row.date));
}

function getKeyFromRow(row: Observation) {
  const date = getDateFromRow(row);
  const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const window = Math.round(utcDate / windowInMilliseconds);
  const windowStartDate = window * windowInMilliseconds;
  return windowStartDate;
}

function preparePlotTrace(animalData: Observation[]) {
  const observationsGroups = _(_.groupBy(animalData, getKeyFromRow))
    .values()
    .sortBy(rowsGroup => getKeyFromRow(rowsGroup[0]));
  const x: Date[] = [];
  const y: number[] = [];
  let previousDateKey: number | undefined;

  // Observations don't have to cover all consecutive windows,
  // so for correct plot appearance we need to fill missing dates with 0.
  observationsGroups.each(rowsGroup => {
    const currentDateKey = getKeyFromRow(rowsGroup[0]);
    if (previousDateKey !== undefined) {
      for (
        let dateKey = previousDateKey + windowInMilliseconds;
        dateKey < currentDateKey;
        dateKey += windowInMilliseconds
      ) {
        x.push(new Date(dateKey));
        y.push(0);
      }
    }
    x.push(new Date(currentDateKey));
    y.push(rowsGroup.length);
    previousDateKey = currentDateKey;
  });

  const name = animalData[0].pred_1;
  return { x, y, type: 'scatter', name };
}

function prepareDataForPlot(data: Observation[]) {
  const groupAnimal = _.groupBy(data, 'pred_1');
  return _.map(groupAnimal, preparePlotTrace);
}

export default function AnimalsPlot(props: Props) {
  const { data } = props;
  const { t } = useTranslation();

  const dataForPlot = prepareDataForPlot(data.observations);

  const layout = {
    responsive: true,
    title: `${t('Animals count over time')} (${windowLengthInDays} ${t(
      'days intervals'
    )})`,
    hovermode: 'closest',
    xaxis: {
      rangeselector: selectorOptions,
      rangeslider: {},
      tickformat: '%Y-%m-%d'
    },
    yaxis: {
      tickformat: ',d'
    }
  };

  return (
    <Plot
      data={(dataForPlot as unknown) as Plotly.Data[]}
      useResizeHandler
      style={{
        width: '100%',
        height: '100%'
      }}
      layout={(layout as unknown) as Plotly.Layout}
    />
  );
}
