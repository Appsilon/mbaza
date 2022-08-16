import { Button } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';
import { Link } from 'react-router-dom';

import styles from './SidebarItem.module.scss';

type Props = {
  iconName: IconName;
  text: string;
  link: string;
  active: boolean;
};

export default function SidebarItem(props: Props) {
  const { iconName, text, link, active } = props;

  return (
    <Link className={styles.link} to={link}>
      <Button
        className={`${styles.button} bp4-minimal`}
        icon={iconName}
        text={text}
        alignText="left"
        active={active}
      />
    </Link>
  );
}
