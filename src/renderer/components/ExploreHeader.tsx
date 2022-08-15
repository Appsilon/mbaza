import { Button, H5, H6, Icon, NumericInput, Popover, Tooltip } from '@blueprintjs/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './ExploreHeader.module.scss';
import ExploreHeaderBtnGroup from './ExploreHeaderBtnGroup';

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
    onPhotosExportClick,
  } = props;
  // eslint-disable-next-line
  const filename = (filePath !== undefined) ? filePath.replace(/^.*[\\\/]/, '') : "";

  return (
    <div className={styles.container}>
      <div className={styles.textOutput}>
        <H5 title={t('explore.dataFileLoaded')}>{`${t('explore.dataFileLoaded')}:`}</H5>
        <H5>{filename}</H5>
      </div>
      <Button
        icon="arrow-left"
        intent="primary"
        large
        onClick={onDataImportClick}
        outlined={false}
        text={t('explore.changeFile')}
      />
      <Popover className={styles.popover} usePortal={false} autoFocus={false}>
        <Button
          icon="refresh"
          intent="primary"
          large
          outlined={false}
          text={t('explore.eventsButtonLabel')}
        />
        <div className={styles.popoverContent}>
          <div className={styles.row}>
            <H6 className={styles.eventTitle}>{t('explore.eventsDurationLabel')}</H6>
            <Tooltip content={t('explore.eventsDescription')}>
              <Icon color="#647f80" icon="help" iconSize={22} />
            </Tooltip>
          </div>
          <div className={styles.row}>
            <NumericInput
              className={styles.eventDurationInput}
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
              className={styles.eventApplyButton}
              intent="primary"
              onClick={() => onEventsUpdateClick(eventMaxDuration)}
              outlined={false}
              text={t('explore.eventsApplyButton')}
            />
          </div>
        </div>
      </Popover>
      <Popover
        className={styles.popover}
        placement="bottom-end"
        usePortal={false}
        autoFocus={false}
      >
        <Button
          icon="export"
          intent="primary"
          large
          outlined={false}
          text={t('explore.exportButtonLabel')}
        />
        <div className={styles.popoverContent}>
          <H6 className={styles.eventTitle}>{t('explore.exportLabel')}</H6>
          <ExploreHeaderBtnGroup
            btnLabel={t('explore.overridesExport')}
            iconInfo={t('explore.overridesExportHelp')}
            onExportBtnClick={onDataExportClick}
          />
          <ExploreHeaderBtnGroup
            btnLabel={t('explore.darwinCoreExport')}
            iconInfo={t('explore.darwinCoreExportHelp')}
            onExportBtnClick={onDarwinCoreExportClick}
          />
          <ExploreHeaderBtnGroup
            btnLabel={t('explore.photosExport')}
            iconInfo={t('explore.photosExportHelp')}
            onExportBtnClick={onPhotosExportClick}
          />
        </div>
      </Popover>
    </div>
  );
}
