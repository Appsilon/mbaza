import React from 'react';
import { Column, Table, Cell } from '@blueprintjs/table';
import * as fs from 'fs';
import { csv } from 'd3-fetch';

export default function ExplorePage() {
  const lastFolder = fs.readdirSync('results/');
  const lastFile = lastFolder.sort().splice(-1)[0];
  let data = [];
  const result = csv(`../results/${lastFile}/results.csv`).then(function(val) {
    data = val;
    return val;
  });

  const pathRender = (rowIndex: number) => {
    // console.log(result);
    // return <Cell>{ data[rowIndex]["path"] }</Cell>
    return <Cell>1</Cell>;
  };
  const classRender = (rowIndex: number) => {
    return <Cell>1</Cell>;
  };
  return (
    <div style={{ padding: '10px' }}>
      <h1>Explore page</h1>
      <Table numRows={5}>
        <Column name="path" cellRenderer={pathRender} />
        <Column name="class" cellRenderer={classRender} />
      </Table>
    </div>
  );
}
