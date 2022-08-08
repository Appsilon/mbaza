import { NonIdealState } from '@blueprintjs/core';
import { shell } from 'electron';
import path from 'path';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { userDataPath } from '../utils/environment';

export default function MissingModelsMessage() {
  const { t } = useTranslation();

  return (
    <NonIdealState icon="search" title={t('classify.modelsDirectoryMissing.title')}>
      <p>
        {t('classify.modelsDirectoryMissing.description1')}
        {/* eslint-disable-next-line */}
        <a onClick={() => shell.openItem(userDataPath)}>{userDataPath}</a>
        {`${path.sep}models`}
        {t('classify.modelsDirectoryMissing.description2')}
      </p>
    </NonIdealState>
  );
}
