import React from 'react';

import { formatAnimalClassName } from '../constants/animalsClasses';

type Props = {
  entries: string[];
};

export default function AnimalsListTooltipContent(props: Props) {
  const { entries } = props;
  return (
    <div>
      {entries.map((x) => (
        <div key={x}>{formatAnimalClassName(x)}</div>
      ))}
    </div>
  );
}
