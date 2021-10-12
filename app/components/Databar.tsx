import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text, Popover, NumericInput } from '@blueprintjs/core';
import styles from './Databar.scss';

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
    <div className={styles.container}>
      <div className={styles.filename}>
        <Text tagName="h4" title={t('explore.dataFileLoaded')}>
          {`${t('explore.dataFileLoaded')}:`}
        </Text>
        <Text tagName="p">{filename}</Text>
      </div>
      <Button
        icon="arrow-left"
        intent="primary"
        large
        onClick={() => onDataImportClick()}
        outlined={false}
        style={{ marginRight: '15px' }}
        text={t('explore.changeFile')}
      />
      <Popover>
        <Button
          icon="refresh"
          intent="primary"
          large
          outlined={false}
          style={{ marginRight: '15px' }}
          text={t('explore.eventsButtonLabel')}
        />
        <div style={{ display: 'flex', padding: '20px' }}>
          <NumericInput
            intent="primary"
            leftIcon="stopwatch"
            placeholder="Event duration"
            rightElement={<div>minutes</div>}
          />
          <Button
            intent="primary"
            onClick={() => onEventsUpdateClick()}
            outlined={false}
            text="OK"
          />
        </div>
      </Popover>
      <Button
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
