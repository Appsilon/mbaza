import { Card, Elevation, Icon, IconName, Position, Tooltip } from '@blueprintjs/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import AnimalsListTooltipContent from './AnimalsListTooltipContent';
import styles from './ExplorerMetrics.module.scss';

type Props = {
  data: Observation[];
  rareTargets: string[];
  emptyClasses: string[];
  overridesTotal: number;
  eventsTotal: number;
};

export default function ExplorerMetrics(props: Props) {
  const { t } = useTranslation();
  const { data, rareTargets, emptyClasses, overridesTotal, eventsTotal } = props;

  const getUniqueSet = (dataset: string[]) => {
    return Array.from(new Set(dataset));
  };

  const getRareAnimals = (dataset: string[], rares: string[]) => {
    return dataset.filter((entry) => rares.includes(entry));
  };

  const nonEmpty = data.filter((entry: Observation) => !emptyClasses.includes(entry.pred_1));
  const uniqueAnimals = getUniqueSet(data.map((entry: Observation) => entry.pred_1));
  const rareAnimals = getRareAnimals(uniqueAnimals, rareTargets);

  function metricsCard(
    icon: IconName,
    color: string,
    title: string,
    value: number,
    tooltip: JSX.Element | string = ''
  ) {
    return (
      <Card className={styles.card} elevation={Elevation.TWO}>
        <Tooltip content={tooltip} position={Position.BOTTOM} disabled={tooltip === ''}>
          <div>
            <Icon className={styles.icon} icon={icon} color={color} iconSize={32} />
            <div className={styles.valueWrapper}>
              <div className={styles.value}>{value}</div>
            </div>
            <div className={styles.title}>{title}</div>
          </div>
        </Tooltip>
      </Card>
    );
  }

  return (
    <div className={styles.container}>
      {metricsCard('camera', '#5c7080', t('explore.imagesCount'), data.length)}
      {metricsCard('inbox-search', '#5c7080', t('explore.animalsCount'), nonEmpty.length)}
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
      {metricsCard(
        'updated',
        '#5c7080',
        t('explore.overrides'),
        overridesTotal,
        t('explore.overridesTooltip')
      )}
      {metricsCard('layers', '#5c7080', t('explore.eventsCount'), eventsTotal)}
    </div>
  );
}
