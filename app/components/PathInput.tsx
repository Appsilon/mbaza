import React from 'react';

export default function PathInput(props: {
  className: string;
  placeholder: string;
  value: string;
  onChange: (path: string) => void;
  showDialog: () => Promise<string | undefined>;
}) {
  const { className, placeholder, value, onChange, showDialog } = props;
  return (
    <div className={`bp3-input-group ${className}`}>
      <input
        type="text"
        className="bp3-input"
        placeholder={placeholder}
        value={value}
        onChange={event => {
          onChange(event.target.value);
        }}
      />
      <button
        aria-label="Search"
        type="submit"
        className="bp3-button bp3-minimal bp3-intent-primary bp3-icon-search"
        onClick={async () => {
          const newValue = await showDialog();
          if (newValue !== undefined) onChange(newValue);
        }}
      />
    </div>
  );
}
