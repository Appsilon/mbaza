import React from 'react';
import { Button, Tooltip, Icon } from '@blueprintjs/core';

type Props = {
  btnLabel: string;
  iconInfo: string;
  onExportBtnClick: () => void;
};

export default function ExploreHeaderBtnGroup(props: Props) {
  const { btnLabel, iconInfo, onExportBtnClick } = props;

  return (
    <div style={{ alignItems: 'center', display: 'flex', marginTop: '15px' }}>
      <Button
        fill
        intent="primary"
        large
        onClick={onExportBtnClick}
        outlined
        style={{ marginRight: '15px' }}
        text={btnLabel}
      />
      <Tooltip content={iconInfo}>
        <Icon color="#647f80" icon="help" iconSize={22} />
      </Tooltip>
    </div>
  );
}
