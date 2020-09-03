import * as React from 'react';

import { useTranslation } from 'react-i18next';
import {
  Icon,
  IconName,
  Card,
  Elevation,
  Tooltip,
  Position
} from '@blueprintjs/core';
import AnimalsListTooltipContent from './AnimalsListTooltipContent';

type Props = {
  data: Observation[];
  rareTargets: string[];
  emptyClasses: string[];
};

export default function ExplorerMetrics(props: Props) {
  const { t } = useTranslation();
  const { data, rareTargets, emptyClasses } = props;

  const getUniqueSet = (dataset: string[]) => {
    return Array.from(new Set(dataset));
  };

  const getRareAnimals = (dataset: string[], rares: string[]) => {
    return dataset.filter(entry => rares.includes(entry));
  };

  const nonEmpty = data.filter(
    (entry: Observation) => !emptyClasses.includes(entry.pred_1)
  );
  const uniqueAnimals = getUniqueSet(
    data.map((entry: Observation) => entry.pred_1)
  );
  const rareAnimals = getRareAnimals(uniqueAnimals, rareTargets);

  function metricsCard(
    icon: IconName,
    color: string,
    title: string,
    value: number,
    tooltip: JSX.Element | string = ''
  ) {
    return (
      <Card
        elevation={Elevation.TWO}
        style={{
          maxWidth: '25%',
          minWidth: '200px',
          position: 'relative',
          textAlign: 'center',
          width: '200px',
          height: '100px',
          marginLeft: '3%',
          marginBottom: '10px',
          padding: '10px'
        }}
      >
        <Tooltip
          content={tooltip}
          position={Position.BOTTOM}
          disabled={tooltip === ''}
        >
          <div>
            <Icon
              style={{
                position: 'absolute',
                left: '25px',
                top: '25px'
              }}
              icon={icon}
              color={color}
              iconSize={32}
            />
            <div style={{ marginLeft: '50px', marginTop: '10px' }}>
              <div style={{ fontWeight: 500, fontSize: '32px', width: '100%' }}>
                {value}
              </div>
            </div>
            <div style={{ lineHeight: '15px', marginTop: '10px' }}>{title}</div>
          </div>
        </Tooltip>
      </Card>
    );
  }

  return (
    <div
      className="metrics-wrapper"
      style={{
        width: '100%',
        paddingBottom: '10px',
        paddingLeft: '200px',
        justifyContent: 'flex-end',
        display: 'flex',
        flexWrap: 'wrap'
      }}
    >
      {metricsCard('camera', '#5c7080', t('explore.imagesCount'), data.length)}
      {metricsCard(
        'inbox-search',
        '#5c7080',
        t('explore.animalsCount'),
        nonEmpty.length
      )}
      {metricsCard(
        'star',
        '#5c7080',
        t('explore.speciesCount'),
        uniqueAnimals.length,
        <AnimalsListTooltipContent entries={uniqueAnimals} />
      )}
      {metricsCard(
        'clean',
        '#ca9f00',
        t('explore.rareCount'),
        rareAnimals.length,
        <AnimalsListTooltipContent entries={rareAnimals} />
      )}
    </div>
  );
}
