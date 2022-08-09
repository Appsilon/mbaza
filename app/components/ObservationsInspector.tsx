import { Button, Classes, Drawer } from '@blueprintjs/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { VirtuosoGrid } from 'react-virtuoso';

import ObservationCard from './ObservationCard';
import styles from './ObservationsInspector.module.scss';

type ObservationsInspectorProps = {
  observations: Observation[];
  onClose: () => void;
  predictionOverrides: PredictionOverridesMap;
  onPredictionOverride: PredictionOverrideHandler;
};

export default function ObservationsInspector(props: ObservationsInspectorProps) {
  const { observations, onClose, predictionOverrides, onPredictionOverride } = props;
  const { t } = useTranslation();
  if (observations.length === 0) {
    return null;
  }
  return (
    <Drawer
      className={styles.drawer}
      isOpen={observations.length > 0}
      onClose={onClose}
      // Workaround: without this setting, clearning prediction override closes the drawer.
      canOutsideClickClose={false}
      size="100%"
      transitionName="opacity"
      usePortal={false}
      hasBackdrop={false}
    >
      <div className={`${Classes.DRAWER_HEADER} ${styles.drawerHeader}`}>
        <Button
          className={styles.backButton}
          icon="chevron-left"
          minimal
          alignText="left"
          onClick={onClose}
          text={t('explore.backToMap')}
        />
        <h4 className={styles.heading}>
          {t('explore.inspect.header', {
            station: observations[0].station
          })}
        </h4>
      </div>
      <div className={`${Classes.DRAWER_BODY} ${styles.drawerBody}`}>
        <div className={`${Classes.DIALOG_BODY} ${styles.dialogBody}`}>
          <VirtuosoGrid
            totalCount={observations.length}
            listClassName={styles.list}
            itemContent={index => (
              <ObservationCard
                observation={observations[index]}
                predictionOverride={predictionOverrides[observations[index].location]}
                onPredictionOverride={onPredictionOverride}
              />
            )}
          />
        </div>
      </div>
      <div className={Classes.DRAWER_FOOTER}>
        {t('explore.inspect.observations', {
          count: observations.length
        })}
      </div>
    </Drawer>
  );
}
