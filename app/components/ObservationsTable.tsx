import React from 'react';
import { Column, Table, Cell } from '@blueprintjs/table';
import { useTranslation } from 'react-i18next';

type Props = {
  data: ObservationsData;
};

export default function ObservationsTable(props: Props) {
  const { fullData } = props;
  const { t } = useTranslation();

  const data = fullData.observations;

  return (
    <Table numRows={data.length} enableColumnReordering>
      <Column
        name="Station"
        cellRenderer={(rowIndex: number) => (
          <Cell>{data[rowIndex].station}</Cell>
        )}
      />
      <Column
        name="Check"
        cellRenderer={(rowIndex: number) => <Cell>{data[rowIndex].check}</Cell>}
      />
      <Column
        name="Camera"
        cellRenderer={(rowIndex: number) => (
          <Cell>{data[rowIndex].camera}</Cell>
        )}
      />
      <Column
        name="Date and time"
        cellRenderer={(rowIndex: number) => (
          <Cell>{data[rowIndex].exif_datetime}</Cell>
        )}
      />
      <Column
        name="GPS"
        cellRenderer={(rowIndex: number) => (
          <Cell>{data[rowIndex].exif_gps_lat}</Cell>
        )}
      />
      <Column
        name="Predicted class"
        cellRenderer={(rowIndex: number) => (
          <Cell>{data[rowIndex].pred_1}</Cell>
        )}
      />
      <Column
        name="Certainty"
        cellRenderer={(rowIndex: number) => (
          <Cell>{data[rowIndex].score_1}</Cell>
        )}
      />
    </Table>
  );
}
