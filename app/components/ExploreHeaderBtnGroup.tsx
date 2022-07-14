import React from 'react';
import { Button, Tooltip, Icon } from '@blueprintjs/core';
import styles from './ExploreHeaderBtnGroup.module.scss';

type Props = {
  btnLabel: string;
  iconInfo: string;
  onExportBtnClick: () => void;
};

export default function ExploreHeaderBtnGroup(props: Props) {
  const { btnLabel, iconInfo, onExportBtnClick } = props;

  return (
    <div className={styles.container}>
      <Button
        className={styles.button}
        fill
        intent="primary"
        onClick={onExportBtnClick}
        text={btnLabel}
      />
      <Tooltip content={iconInfo}>
        <Icon color="#647f80" icon="help" iconSize={22} />
      </Tooltip>
    </div>
  );
}
