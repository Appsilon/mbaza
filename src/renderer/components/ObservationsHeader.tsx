import { Button, Dialog, mergeRefs, Slider } from '@blueprintjs/core';
import { Classes, Popover2 } from '@blueprintjs/popover2';
import classNames from 'classnames/bind';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CreatableSelect from 'react-select/creatable';
import { taxonOptions } from '../constants/taxons';
import styles from './ObservationsHeader.module.scss';

const cx = classNames.bind(styles);

type ObservationsHeaderProps = {
  observations: Observation[];
  isCardMaximized: boolean;
  selectedCardsTotal: number;
  cardsTotalInRow: number;
  onBackButtonClick: () => void;
  onPredictionsOverride: (override: CreatableOption | null) => void;
  onCardsSizeChange: (cardsTotalInRow: number) => void;
};

export default function ObservationsHeader(props: ObservationsHeaderProps) {
  const {
    observations,
    maximizedCardIndex,
    selectedCardsTotal,
    cardsTotalInRow,
    onBackButtonClick,
    onPredictionsOverride,
    onCardsSizeChange,
  } = props;
  const { t } = useTranslation();
  const [globalOverride, setGlobalOverride] = useState<CreatableOption | null>(null);
  const [cardsMaxInRow, setCardsMaxInRow] = useState<number>(0);
  const [isPopoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const isCardMaximized = maximizedCardIndex !== null;
  const CARD_MIN_WIDTH = 230;

  const handleBackButtonClick = () => {
    onBackButtonClick();
    setGlobalOverride(null);
  };

  const handleUpdateButtonClick = () => {
    onPredictionsOverride(globalOverride);
    handleBackButtonClick();
    setDialogOpen(false);
  };

  const containerClass = cx({
    container: true,
    selectionMode: selectedCardsTotal,
  });
  let backButtonText = '';

  if (isCardMaximized) {
    backButtonText = t('explore.backToObservations');
  } else if (!selectedCardsTotal) {
    backButtonText = t('explore.backToMap');
  }

  const headingText = selectedCardsTotal
    ? t('explore.inspect.selected', { count: selectedCardsTotal })
    : t('explore.inspect.header', { station: observations[0].station });

  const counterText = isCardMaximized
    ? t('explore.inspect.observationNumber', {
        currentObservation: `${maximizedCardIndex + 1} /`,
        count: observations.length,
      })
    : t('explore.inspect.observations', { count: observations.length });

  const headerRef = useRef<HTMLInputElement>();
  const handleCardsLayoutButton = () => {
    if (headerRef.current) {
      setPopoverOpen(!isPopoverOpen);
      setCardsMaxInRow(Math.round(headerRef.current.clientWidth / CARD_MIN_WIDTH));
      if (cardsTotalInRow > cardsMaxInRow) onCardsSizeChange(cardsMaxInRow);
    }
  };

  return (
    <div className={containerClass} ref={headerRef}>
      <div className={cx({ side: true, left: true })}>
        <Button
          className={styles.backButton}
          icon={isCardMaximized || !selectedCardsTotal ? 'chevron-left' : 'cross'}
          minimal
          alignText="left"
          onClick={handleBackButtonClick}
          text={backButtonText}
        />
      </div>
      <h4 title={headingText} className={styles.heading}>
        {headingText}
      </h4>
      <div className={cx({ side: true, right: true })}>
        {selectedCardsTotal ? (
          <>
            <CreatableSelect
              value={globalOverride}
              options={taxonOptions}
              onChange={setGlobalOverride}
              isDisabled={!selectedCardsTotal}
              isClearable={!!globalOverride}
              menuShouldScrollIntoView={false}
              menuPlacement="auto"
              className={styles.predictionOverride}
            />
            <Button
              className={styles.updateButton}
              intent="primary"
              disabled={!globalOverride}
              onClick={() => setDialogOpen(true)}
              text="Update Selected"
            />
            <Dialog
              className={styles.confirmationDialog}
              isOpen={isDialogOpen}
              onClose={() => setDialogOpen(false)}
            >
              <div className={styles.text}>{t('explore.inspect.override.warning')}</div>
              <div className={styles.buttons}>
                <Button
                  intent="primary"
                  minimal
                  large
                  onClick={() => setDialogOpen(false)}
                  text={t('explore.inspect.override.cancel')}
                />
                <Button
                  intent="primary"
                  large
                  text={t('explore.inspect.override.confirm')}
                  onClick={handleUpdateButtonClick}
                />
              </div>
            </Dialog>
          </>
        ) : (
          <Popover2
            interactionKind="click"
            popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
            placement="bottom"
            isOpen={isPopoverOpen}
            content={
              <Slider
                value={cardsTotalInRow}
                onChange={onCardsSizeChange}
                vertical
                min={1}
                max={cardsMaxInRow}
              />
            }
            renderTarget={({ isOpen, ref: ref1, ...targetProps }) => (
              <Button
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...targetProps}
                elementRef={mergeRefs(ref1)}
                intent="primary"
                text="Cards Layout"
                onClick={handleCardsLayoutButton}
              />
            )}
          />
        )}
      </div>
    </div>
  );
}
