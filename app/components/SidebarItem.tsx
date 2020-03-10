import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';
import routes from '../constants/routes.json';

type Props = {
  iconName: IconName;
  text: string;
};

export default function SidebarItem(props: Props) {
  const { iconName, text } = props;

  return (
    <Link to={routes.COUNTER}>
      <Button
        className="bp3-minimal"
        icon={iconName}
        text={text}
        style={{ color: '#fff', width: '100%', padding: '20px' }}
        alignText="left"
      />
    </Link>
  );
}
