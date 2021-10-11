import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text } from '@blueprintjs/core';

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
    <div
      className="databar"
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0'
      }}
    >
      <div
        className="databar__filename"
        style={{ alignItems: 'center', display: 'flex', flex: '1' }}
      >
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
      <Button
        icon="refresh"
        intent="primary"
        large
        onClick={() => onEventsUpdateClick()}
        outlined={false}
        style={{ marginRight: '15px' }}
        text={t('explore.eventsButtonLabel')}
      />
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
