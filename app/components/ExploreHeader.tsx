import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, NumericInput, Popover, H5, H6, Tooltip, Icon } from '@blueprintjs/core';
import s from './ExploreHeader.scss';

type Props = {
  filePath: string | undefined;
  onDataImportClick: () => void;
  onEventsUpdateClick: (eventDuration: number | undefined) => void;
  onDataExportClick: () => void;
  onDarwinCoreExportClick: () => void;
  onPhotosExportClick: () => void;
};

export default function ExploreHeader(props: Props) {
  const { t } = useTranslation();
  const [eventMaxDuration, setEventMaxDuration] = useState<number>();
  const {
    filePath,
    onDataImportClick,
    onEventsUpdateClick,
    onDataExportClick,
    onDarwinCoreExportClick,
    onPhotosExportClick
  } = props;
  // eslint-disable-next-line
  const filename = (filePath !== undefined) ? filePath.replace(/^.*[\\\/]/, '') : "";

  return (
    <div className={s.container}>
      <div className={s.textOutput}>
        <H5 title={t('explore.dataFileLoaded')}>{`${t('explore.dataFileLoaded')}:`}</H5>
        <H5>{filename}</H5>
      </div>
      <Button
        icon="arrow-left"
        intent="primary"
        large
        onClick={onDataImportClick}
        outlined={false}
        style={{ marginRight: '15px' }}
        text={t('explore.changeFile')}
      />
      <Popover className={s.popover} usePortal={false} autoFocus={false}>
        <Button
          icon="refresh"
          intent="primary"
          large
          outlined={false}
          style={{ marginRight: '15px' }}
          text={t('explore.eventsButtonLabel')}
        />
        <div className={s.popoverContent}>
          <div className={s.row}>
            <H6 className={s.eventTitle}>{t('explore.eventsDurationLabel')}</H6>
            <Tooltip content={t('explore.eventsDescription')}>
              <Icon color="#647f80" icon="help" iconSize={22} />
            </Tooltip>
          </div>
          <div className={s.row}>
            <NumericInput
              className={s.eventDurationInput}
              intent="primary"
              fill
              leftIcon="stopwatch"
              max={60}
              min={0}
              onValueChange={setEventMaxDuration}
              placeholder={t('explore.eventsButtonPlaceholder')}
              value={eventMaxDuration}
            />
            <Button
              className={s.eventApplyButton}
              intent="primary"
              onClick={() => onEventsUpdateClick(eventMaxDuration)}
              outlined={false}
              text={t('explore.eventsApplyButton')}
            />
          </div>
        </div>
      </Popover>
      <Popover className={s.popover} placement="bottom-end" usePortal={false} autoFocus={false}>
        <Button
          icon="export"
          intent="primary"
          large
          outlined={false}
          text={t('explore.exportButtonLabel')}
        />
        <div className={s.popoverContent}>
          <div className={s.row}>
            <Button
              fill
              intent="primary"
              large
              onClick={onDataExportClick}
              outlined
              text={t('explore.overridesExport')}
            />
            <Tooltip content={t('explore.eventsDescription')}>
              <Icon color="#647f80" icon="help" iconSize={22} />
            </Tooltip>
          </div>
          <div className={s.row}>
            <Button
              fill
              intent="primary"
              large
              onClick={onDarwinCoreExportClick}
              outlined
              text={t('explore.darwinCoreExport')}
            />
            <Tooltip content={t('explore.eventsDescription')}>
              <Icon color="#647f80" icon="help" iconSize={22} />
            </Tooltip>
          </div>
          <div className={s.row}>
            <Button
              fill
              intent="primary"
              large
              onClick={onPhotosExportClick}
              outlined
              text={t('explore.photosExport')}
            />
            <Tooltip content={t('explore.eventsDescription')}>
              <Icon color="#647f80" icon="help" iconSize={22} />
            </Tooltip>
          </div>
        </div>
      </Popover>
    </div>
  );
}
