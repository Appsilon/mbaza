import { Callout, Card, Elevation, H5, H6, Intent, Spinner } from '@blueprintjs/core';

import styles from './LogViewer.module.scss';

export enum TaskStatus {
  NOT_STARTED,
  IN_PROGRESS,
  SUCCESS,
  FAILURE,
}

type Props = {
  title: string;
  status: TaskStatus;
  message: string;
};

export default function LogViewer(props: Props) {
  const { title, message, status } = props;

  if (status === TaskStatus.NOT_STARTED) return null;
  return (
    <Card className={styles.card} interactive={false} elevation={Elevation.TWO}>
      <H5>{title}</H5>
      {status === TaskStatus.IN_PROGRESS ? (
        <div className={styles.preloader}>
          <Spinner />
          <H6 className={styles.message}>{message}</H6>
        </div>
      ) : (
        <Callout
          intent={status === TaskStatus.SUCCESS ? Intent.SUCCESS : Intent.DANGER}
          title={message}
        />
      )}
    </Card>
  );
}
