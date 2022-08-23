/* eslint-disable react/jsx-props-no-spreading */

import { CSSProperties } from 'react';
import { StylesConfig } from 'react-select';
import OriginalCreatableSelect from 'react-select/creatable';

import sassVariables from '../styles/variables.module.scss';

export default function CreatableSelect({
  controlStyles = {},
  ...props
}: {
  controlStyles: CSSProperties;
  // TODO: add props typing
}) {
  const customStyles: StylesConfig = {
    menu: (base) => ({
      ...base,
      width: 'auto',
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      // eslint-disable-next-line no-nested-ternary
      backgroundColor: isSelected
        ? sassVariables.green80
        : isFocused
        ? sassVariables.green10
        : sassVariables.white,
      borderBottom: `1px solid ${sassVariables.green10}`,
      color: isSelected ? sassVariables.white : sassVariables.green80,
    }),
    control: (base) => ({
      ...base,
      background: sassVariables.green10,
      border: 'none',
      borderRadius: sassVariables.radiusInput,
      boxShadow: 'none',
      cursor: 'pointer',
      display: 'flex',
      fontWeight: 600,
      minHeight: 0,
      padding: '5px',
      width: 200,
      ...controlStyles,
    }),
    valueContainer: (base) => ({
      ...base,
      display: 'flex',
      padding: '0 5px 0 0',
    }),
    singleValue: (base) => ({
      ...base,
      color: sassVariables.green80,
    }),
    placeholder: () => ({
      color: sassVariables.green60,
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: 'none',
    }),
    dropdownIndicator: (base, { isFocused }) => ({
      ...base,
      color: isFocused ? sassVariables.green60 : sassVariables.green40,
      padding: 0,
    }),
    clearIndicator: (base, { isFocused }) => ({
      ...base,
      color: isFocused ? sassVariables.green60 : sassVariables.green40,
      padding: 0,
    }),
  };

  return <OriginalCreatableSelect {...props} styles={customStyles} />;
}
