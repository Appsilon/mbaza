/* eslint max-len: ["error", { "code": 200 }] */
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Card, Elevation, Callout, Icon, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <div style={{ flex: 1, padding: '20px' }}>
        <Card
          interactive
          elevation={Elevation.TWO}
          className="bp3-running-text"
        >
          <h1 style={{ marginTop: 0 }}>{t('Welcome to Mbaza AI!')}</h1>
          <h4>{t('The first offline AI wildlife explorer')}</h4>
          <p>
            Mbaza AI is a desktop application that allows bioconservation
            researchers to classify camera trap animal images and analyze the
            results.
          </p>
          <p>
            It is powered by AI models capable of recognizing over 30 animal
            species in photos.
          </p>
          <p>
            To use the application, first go to Classify and run AI on your
            photos dataset. Then you can go to Explore and analyze the results.
          </p>
          <p style={{ textAlign: 'center' }}>
            <span style={{ margin: 50 }}>
              <Icon
                icon={IconNames.PREDICTIVE_ANALYSIS}
                iconSize={120}
                intent={Intent.PRIMARY}
              />
            </span>
            <span style={{ margin: 50 }}>
              <Icon
                icon={IconNames.MAP}
                iconSize={120}
                intent={Intent.PRIMARY}
              />
            </span>
            <span style={{ margin: 50 }}>
              <Icon
                icon={IconNames.SCATTER_PLOT}
                iconSize={120}
                intent={Intent.PRIMARY}
              />
            </span>
          </p>
        </Card>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <Callout
          title="This is an early development version"
          intent={Intent.PRIMARY}
        >
          <p>You are using a very early version of Mbaza AI. </p>
          <p>
            This application is under active development and provides core
            functionality only. All feedback regarding features and behavior of
            the application is welcome - please shoot us an email at
            tadeusz@appsilon.com
          </p>
        </Callout>
      </div>
    </>
  );
}
