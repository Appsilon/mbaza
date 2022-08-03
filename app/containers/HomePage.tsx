import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Card, Elevation, Callout, Intent } from '@blueprintjs/core';

import styles from './HomePage.scss';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Card interactive elevation={Elevation.TWO} className={`${styles.card} bp3-running-text`}>
            <h1 className={styles.cardTitle}>{t('home.welcome.title')}</h1>
            <Trans i18nKey="home.welcome.message" />
          </Card>
          <Callout
            className={styles.callout}
            title={t('home.warning.title')}
            intent={Intent.PRIMARY}
          >
            <Trans i18nKey="home.warning.message" />
          </Callout>
          <Callout className={styles.callout} intent={Intent.PRIMARY}>
            <Trans i18nKey="home.dataForGood" />
          </Callout>
        </div>
        <div className={styles.logos}>
          <img className={styles.logo} src="assets/logos/gabon.png" alt="Parcs Gabon" />
          <img className={styles.logo} src="assets/logos/iret.png" alt="IRET" />
          <img className={styles.logo} src="assets/logos/panthera.png" alt="Panthera" />
          <img className={styles.logo} src="assets/logos/gbif.png" alt="GBIF" />
          <img
            className={styles.logo}
            src="assets/logos/stirling.png"
            alt="University of Stirling"
          />
          <img className={styles.logo} src="assets/logos/ue.png" alt="European Union" />
          <img
            className={styles.logo}
            src="assets/logos/appsilon-color.png"
            alt="Appsilon - technology partner"
          />
          <a
            className={styles.link}
            href="https://appsilon.com/data-for-good/"
            target="_blank"
            rel="noreferrer"
          >
            <img className={styles.logo} src="assets/logos/data-for-good.png" alt="Data for Good" />
          </a>
        </div>
      </div>
    </>
  );
}
