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
    <div className={`bp4-input-group ${className}`}>
      <input
        type="text"
        className="bp4-input"
        placeholder={placeholder}
        value={value}
        onChange={event => {
          onChange(event.target.value);
        }}
      />
      <button
        aria-label="Search"
        type="submit"
        className="bp4-button bp4-minimal bp4-intent-primary bp4-icon-search"
        onClick={async () => {
          const newValue = await showDialog();
          if (newValue !== undefined) onChange(newValue);
        }}
      />
    </div>
  );
}
