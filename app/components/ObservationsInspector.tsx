import React from 'react';
import { Card, Classes, Drawer, Elevation, InputGroup, Position, Tooltip } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";
import path from 'path';

import { formatAnimalClassName } from "../constants/animalsClasses";

type ObservationCardProps = {
  observation: Observation;
  predictionOverride: string;
  onPredictionOverride: (location: string, prediction: string) => void;
};

function ObservationCard(props: ObservationCardProps) {
  const { observation, predictionOverride, onPredictionOverride } = props;
  const { t } = useTranslation();

  const handlePredictionOverride = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPredictionOverride(observation.location, event.target.value);
  }

  const predictions = [
    [formatAnimalClassName(observation.pred_1), observation.score_1],
    [formatAnimalClassName(observation.pred_2), observation.score_2],
    [formatAnimalClassName(observation.pred_3), observation.score_3]
  ];

  return (
    <Card
      elevation={Elevation.TWO}
      key={observation.location}
      style={{ marginTop: 10 }}
    >
      <h3 style={{ marginTop: 0 }}>
        {t('explore.inspect.photoHeader', {
          species: formatAnimalClassName(observation.pred_1),
          date: observation.date
        })}
      </h3>
      <div style={{ display: 'flex' }}>
        <div>
          <img
            src={observation.location}
            width={400}
            alt={observation.pred_1}
          />
        </div>
        <div style={{ marginLeft: 24 }}>
          <table className="bp3-html-table bp3-html-table-condensed">
            <thead>
              <tr>
                <th>{t('explore.inspect.prediction')}</th>
                <th>{t('explore.inspect.probability')}</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map(i => (
                <tr key={i[0]}>
                  <td>{i[0]}</td>
                  <td>
                    {((i[1] as number) * 100).toFixed(2)}
                    &nbsp;%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            <Tooltip content="You can override the top prediction and export the modified CSV" position={Position.RIGHT}>
              <InputGroup
                value={predictionOverride}
                onChange={handlePredictionOverride}
                placeholder="Override prediction"
              />
            </Tooltip>
          </p>
          <div style={{ margin: '20px 10px' }}>
            <p>
              <strong>
                {t('explore.inspect.camera')}
                :&nbsp;
              </strong>
              {observation.camera}
            </p>
            <p>
              <strong>
                {t('explore.inspect.check')}
                :&nbsp;
              </strong>
              {observation.check}
            </p>
            <p>
              <strong>
                {t('explore.inspect.file')}
                :&nbsp;
              </strong>
              {path.basename(observation.location)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

type ObservationsInspectorProps = {
  observations: Observation[];
  onClose: () => void;
  predictionOverrides: Record<string, string>;
  onPredictionOverride: (location: string, prediction: string) => void;
};

export default function ObservationsInspector(props: ObservationsInspectorProps) {
  const { observations, onClose, predictionOverrides, onPredictionOverride } = props;
  const { t } = useTranslation();
  if (observations.length === 0) {
    return null;
  }
  return (
    <Drawer
      title={t('explore.inspect.header', {
        station: observations[0].station
      })}
      icon="camera"
      isOpen={observations.length > 0}
      onClose={onClose}
      hasBackdrop={false}
    >
      <div className={Classes.DRAWER_BODY}>
        <div className={Classes.DIALOG_BODY}>
          {observations.map(observation => (
            <ObservationCard
              observation={observation}
              predictionOverride={predictionOverrides[observation.location] || ''}
              onPredictionOverride={onPredictionOverride}
            />
          ))}
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
