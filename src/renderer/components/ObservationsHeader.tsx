import { Button, Dialog, mergeRefs, Slider } from '@blueprintjs/core';
import { Classes, Popover2 } from '@blueprintjs/popover2';
import classNames from 'classnames/bind';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CreatableSelect from 'react-select/creatable';
import { taxonOptions } from '../constants/taxons';
import styles from './ObservationsHeader.module.scss';

export default function ObservationsHeader(props: ObservationsHeaderProps) {
  const {
    observations,
    maximizedCardIndex,
    selectedCardsTotal,
    cardsTotalInRow,
    isCardsLayoutPopover,
    onBackButtonClick,
    onPredictionsOverride,
    onCardsSizeChange,
    showCardsLayoutPopover,
  } = props;
  const { t } = useTranslation();
  const cx = classNames.bind(styles);
  const [globalOverride, setGlobalOverride] = useState<CreatableOption | null>(null);
  const [cardsMaxInRow, setCardsMaxInRow] = useState<number | undefined>(undefined);
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState<boolean>(false);
  const isCardMaximized = maximizedCardIndex !== null;
  const CARD_MIN_WIDTH = 230;

  const handleBackButtonClick = () => {
    onBackButtonClick();
    setGlobalOverride(null);
  };

  const handleUpdateButtonClick = () => {
    onPredictionsOverride(globalOverride);
    handleBackButtonClick();
    setConfirmationDialogOpen(false);
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

  const headerRef = useRef<HTMLDivElement>(null);
  const handleCardsLayoutButton = () => {
    if (headerRef.current) {
      showCardsLayoutPopover(!isCardsLayoutPopover);
      setCardsMaxInRow(Math.round(headerRef.current.clientWidth / CARD_MIN_WIDTH));
      if (cardsMaxInRow && cardsTotalInRow > cardsMaxInRow) onCardsSizeChange(cardsMaxInRow);
    }
  };

  const cardsDetails = isCardMaximized ? (
    <p className={styles.counter}>
      {t('explore.inspect.observationNumber', {
        currentObservation: `${maximizedCardIndex + 1} /`,
        count: observations.length,
      })}
    </p>
  ) : (
    <Popover2
      popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
      placement="bottom"
      isOpen={isCardsLayoutPopover}
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
          text={t('explore.inspect.layout')}
          onClick={handleCardsLayoutButton}
        />
      )}
    />
  );

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
              onClick={() => setConfirmationDialogOpen(true)}
              text="Update Selected"
            />
            <Dialog
              className={styles.confirmationDialog}
              isOpen={isConfirmationDialogOpen}
              onClose={() => setConfirmationDialogOpen(false)}
            >
              <div className={styles.text}>{t('explore.inspect.override.warning')}</div>
              <div className={styles.buttons}>
                <Button
                  intent="primary"
                  minimal
                  large
                  onClick={() => setConfirmationDialogOpen(false)}
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
          cardsDetails
        )}
      </div>
    </div>
  );
}
