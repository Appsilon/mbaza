import React from 'react';
import { Column, Table, Cell } from '@blueprintjs/table';
import { useTranslation } from 'react-i18next';

type Props = {
  data: ObservationsData;
};

export default function ObservationsTable(props: Props) {
  const { data } = props;
  const { t } = useTranslation();

  const { observations } = data;

  return (
    <Table numRows={observations.length} enableColumnReordering>
      <Column
        name={t('Station')}
        cellRenderer={(rowIndex: number) => (
          <Cell>{observations[rowIndex].station}</Cell>
        )}
      />
      <Column
        name={t('Check')}
        cellRenderer={(rowIndex: number) => (
          <Cell>{observations[rowIndex].check}</Cell>
        )}
      />
      <Column
        name={t('Camera')}
        cellRenderer={(rowIndex: number) => (
          <Cell>{observations[rowIndex].camera}</Cell>
        )}
      />
      <Column
        name={t('Date and time')}
        cellRenderer={(rowIndex: number) => (
          <Cell>{observations[rowIndex].date}</Cell>
        )}
      />
      <Column
        name={t('GPS')}
        cellRenderer={(rowIndex: number) => (
          <Cell>
            Lat:
            {observations[rowIndex].coordinates_lat}
            Lon:
            {observations[rowIndex].coordinates_long}
          </Cell>
        )}
      />
      <Column
        name={t('Predicted animal')}
        cellRenderer={(rowIndex: number) => (
          <Cell>{observations[rowIndex].pred_1}</Cell>
        )}
      />
      <Column
        name={t('Certainty')}
        cellRenderer={(rowIndex: number) => (
          <Cell>{observations[rowIndex].score_1}</Cell>
        )}
      />
    </Table>
  );
}
