import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, NumericInput, Popover, H5, H6 } from '@blueprintjs/core';
import s from './Databar.scss';

type Props = {
  filePath: string | undefined;
  onDataImportClick: Function;
  onEventsUpdateClick: Function;
  onDataExportClick: Function;
};

export default function Databar(props: Props) {
  const { t } = useTranslation();
  const { filePath, onDataImportClick, onEventsUpdateClick, onDataExportClick } = props;
  // eslint-disable-next-line
  const filename = (filePath !== undefined) ? filePath.replace(/^.*[\\\/]/, '') : "";

  return (
    <div className={s.container}>
      <div className={s.textOutput}>
        <H5 title={t('explore.dataFileLoaded')}>{`${t('explore.dataFileLoaded')}:`}</H5>
        <H5>{filename}</H5>
      </div>
      <Button
        className={s.primaryButton}
        icon="arrow-left"
        intent="primary"
        large
        onClick={() => onDataImportClick()}
        outlined={false}
        style={{ marginRight: '15px' }}
        text={t('explore.changeFile')}
      />
      <Popover className={s.popover} minimal usePortal={false}>
        <Button
          className={s.primaryButton}
          icon="refresh"
          intent="primary"
          large
          outlined={false}
          style={{ marginRight: '15px' }}
          text={t('explore.eventsButtonLabel')}
        />
        <div className={s.popoverContent}>
          <H6>Event duration</H6>
          <NumericInput
            intent="primary"
            fill
            leftIcon="stopwatch"
            max={60}
            min={0}
            placeholder="Event duration"
          />
          <Button
            className={s.primaryButton}
            intent="primary"
            onClick={() => onEventsUpdateClick()}
            outlined={false}
            text="OK"
          />
        </div>
      </Popover>
      <Button
        className={s.primaryButton}
        icon="export"
        intent="primary"
        large
        onClick={() => onDataExportClick()}
        outlined={false}
        text={t('explore.overridesExport')}
      />
    </div>
  );
}
