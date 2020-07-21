import React from 'react';
import { useTranslation } from 'react-i18next';

import { Card, Elevation, Callout, Intent } from '@blueprintjs/core';

export default function HomePage() {
  const { t } = useTranslation();
  const logoStyle = { height: '60px', margin: '20px' };

  return (
    <>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex' }}>
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
                researchers to classify camera trap animal images and analyze
                the results.
              </p>
              <p>
                It is powered by AI models capable of recognizing over 30 animal
                species in photos.
              </p>
              <p>
                To use the application, first go to Classify and run AI on your
                photos dataset. Then you can go to Explore and analyze the
                results.
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
                functionality only. All feedback regarding features and behavior
                of the application is welcome - please shoot us an email at
                ai4good@appsilon.com.
              </p>
            </Callout>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            marginTop: 30
          }}
        >
          <img
            style={logoStyle}
            src="assets/logos/gabon.png"
            alt="Parcs Gabon"
          />
          <img style={logoStyle} src="assets/logos/iret.png" alt="IRET" />
          <img
            style={logoStyle}
            src="assets/logos/panthera.png"
            alt="Panthera"
          />
          <img
            style={logoStyle}
            src="assets/logos/stirling.png"
            alt="University of Stirling"
          />
          <div style={{ ...logoStyle, textAlign: 'center' }}>
            <img
              style={{ height: '47px', display: 'block', margin: 'auto' }}
              src="assets/logos/ue.png"
              alt="European Union"
            />
            <span style={{ fontSize: '13px' }}>ECOFAC6</span>
          </div>
        </div>
      </div>
    </>
  );
}
