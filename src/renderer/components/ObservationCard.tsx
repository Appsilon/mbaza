import { Card, Elevation, Tooltip, Button } from '@blueprintjs/core';
import classNames from 'classnames/bind';
import path from 'path';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';

import { formatAnimalClassName } from '../constants/animalsClasses';
import { taxonOptions } from '../constants/taxons';
import styles from './ObservationCard.module.scss';

const cx = classNames.bind(styles);

type ObservationCardProps = {
  observation: Observation;
  predictionOverride?: CreatableOption;
  onPredictionOverride: PredictionOverrideHandler;
  onPhotoClick: (cardIndex: number | null) => void;
  onSlideInit: (nextCardIndex: number | null) => void;
  onSlideStart: (arg: boolean) => void;
  lastObservationIndex: number;
  observationIndex: number;
  isMaximized: boolean;
  prevCardIndex: number | null;
  isSliding: boolean;
};

function ObservationCard(props: ObservationCardProps) {
  const {
    observation,
    predictionOverride,
    onPredictionOverride,
    onPhotoClick,
    onSlideInit,
    onSlideStart,
    lastObservationIndex,
    observationIndex,
    isMaximized,
    prevCardIndex,
    isSliding,
  } = props;
  const { t } = useTranslation();

  const topPrediction = {
    value: observation.pred_1,
    label: formatAnimalClassName(observation.pred_1),
  };

  const handlePredictionOverride = (newPrediction: CreatableOption | null) => {
    if (newPrediction === null || newPrediction.value !== topPrediction.value) {
      onPredictionOverride(observation.location, newPrediction);
    }
  };

  const handleSlideInit = (direction: string) => {
    let newCardIndex = null;
    if (direction === 'left') {
      newCardIndex = observationIndex > 0 ? observationIndex - 1 : lastObservationIndex;
    } else if (direction === 'right') {
      newCardIndex = observationIndex < lastObservationIndex ? observationIndex + 1 : 0;
    }
    onPhotoClick(newCardIndex);
    onSlideInit(observationIndex);
  };

  const handleSlideStart = () => {
    onSlideStart(true);
    setTimeout(() => {
      onSlideStart(false);
      onSlideInit(null);
    }, 1000);
  };

  const predictions = [
    [formatAnimalClassName(observation.pred_1), observation.score_1],
    [formatAnimalClassName(observation.pred_2), observation.score_2],
    [formatAnimalClassName(observation.pred_3), observation.score_3],
  ];

  const predictionsTable = (
    <table className={`${styles.predictionsTable} bp4-html-table bp4-html-table-condensed`}>
      <thead>
        <tr>
          <th>{t('explore.inspect.prediction')}</th>
          <th>{t('explore.inspect.probability')}</th>
        </tr>
      </thead>
      <tbody>
        {predictions.map((i) => (
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
  );
  const predictionOverrideWidget = (
    <CreatableSelect
      value={predictionOverride || topPrediction}
      onChange={handlePredictionOverride}
      options={taxonOptions}
      isClearable={predictionOverride !== undefined}
      menuShouldScrollIntoView={false}
      className={styles.predictionOverride}
      menuPlacement="auto"
    />
  );
  const photoDetail = (label: string, value: string) => (
    <p className={styles.photoDetail}>
      <span className={styles.label}>{`${t(`explore.inspect.${label}`)}: `}</span>
      <span>{value}</span>
    </p>
  );
  const photoDetails = (
    <div className={styles.photoDetails}>
      {photoDetail('date', observation.date)}
      {photoDetail('camera', observation.camera)}
      {photoDetail('file', path.basename(observation.location))}
    </div>
  );
  const navigation = (
    <nav className={styles.nav}>
      <Button
        className={cx({ arrow: true, left: true })}
        icon="chevron-left"
        large
        onMouseDown={() => handleSlideInit('left')}
        onMouseUp={handleSlideStart}
      />
      <Button
        className={cx({ arrow: true, right: true })}
        icon="chevron-right"
        large
        onMouseDown={() => handleSlideInit('right')}
        onMouseUp={handleSlideStart}
      />
    </nav>
  );
  const observationClass = cx({
    observation: true,
    maximized: isMaximized,
    hidden:
      (isMaximized && observationIndex !== prevCardIndex && prevCardIndex !== null && !isSliding) ||
      (isMaximized && observationIndex === prevCardIndex && isSliding),
    visible:
      (isMaximized && observationIndex === prevCardIndex && !isSliding) ||
      (isMaximized && observationIndex !== prevCardIndex && prevCardIndex !== null && isSliding),
    noTransition: (prevCardIndex !== null && !isSliding) || prevCardIndex === null,
  });

  return (
    <div className={observationClass}>
      <Card className={styles.card} elevation={Elevation.TWO} key={observation.location}>
        <div className={styles.body}>
          <div
            className={styles.photo}
            onClick={() => onPhotoClick(isMaximized ? null : observationIndex)}
            aria-hidden="true"
          >
            <img
              className={styles.img}
              src={`file:${observation.location}`}
              alt={observation.pred_1}
            />
          </div>
          <div className={styles.data}>
            {predictionsTable}
            {photoDetails}
          </div>
          {isMaximized && navigation}
        </div>
        <div className={styles.header}>
          <Tooltip content={t('explore.inspect.overrideTooltip')} position="top" minimal>
            {predictionOverrideWidget}
          </Tooltip>
        </div>
      </Card>
    </div>
  );
}

ObservationCard.defaultProps = {
  predictionOverride: undefined,
};

export default ObservationCard;
