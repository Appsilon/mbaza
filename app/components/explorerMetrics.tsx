import * as React from 'react';

import { useTranslation } from 'react-i18next';
import { Icon, IconName, Card, Elevation } from '@blueprintjs/core';

type Props = {
  data: Observation[];
  rareTargets: string[];
};

type entry = {
  label: string;
  value: string;
};

export default function ExplorerMetrics(props: Props) {
  const { t } = useTranslation();
  const { data, rareTargets } = props;

  const getUniqueSet = (dataset: string[]) => {
    return Array.from(new Set(dataset)).map((entry: string) => {
      return { value: entry, label: entry.replace(/_/g, ' ') };
    });
  };

  const getRareAnimals = (dataset: entry[], rares: string[]) => {
    return dataset.filter(entry => rares.includes(entry.value));
  };

  const nonEmpty = data.filter(
    (entry: Observation) => !['Blank', 'empty'].includes(entry.pred_1)
  );
  const uniqueAnimals = getUniqueSet(
    data.map((entry: Observation) => entry.pred_1)
  );
  const rareAnimals = getRareAnimals(uniqueAnimals, rareTargets);

  const metricsCard = (
    icon: IconName,
    color: string,
    title: string,
    value: number
  ) => {
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
          marginBottom: '10px'
        }}
      >
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
        <div style={{ marginLeft: '50px' }}>
          <div style={{ fontWeight: 500, fontSize: '32px', width: '100%' }}>
            {value}
          </div>
        </div>
        <div style={{ lineHeight: '30px' }}>{title}</div>
      </Card>
    );
  };

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
      {metricsCard('camera', '#5c7080', t('Images classified'), data.length)}
      {metricsCard(
        'inbox-search',
        '#5c7080',
        t('Images with animals'),
        nonEmpty.length
      )}
      {metricsCard('star', '#5c7080', t('Species found'), uniqueAnimals.length)}
      {metricsCard(
        'clean',
        '#ca9f00',
        t('Rare species found'),
        rareAnimals.length
      )}
    </div>
  );
}
