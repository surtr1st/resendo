import React from 'react';
import './style.css'

type Props = {
  ref: string;
  name: string;
  value: string;
  className: string;
  onChange: () => void;
  multiline?: boolean;
};

export const Input = {
  Text: ({ ref, name, value, onChange, className, multiline }: Partial<Props>) => (
    <React.Fragment>
      {
        multiline ? (
          <input
            type='text'
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            className='text'
          />) : (
          <textarea
            rows={1}
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            className='text'
          />
        )}
    </React.Fragment>
  ),
  FileUpload: ({ ref, name, value, onChange, className }: Partial<Props>) => (
    <input
      type='file'
      ref={ref}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    />
  ),
  Search: ({ ref, name, value, onChange, className }: Partial<Props>) => (
    <input
      type='text'
      ref={ref}
      name={name}
      value={value}
      onChange={onChange}
      className='search'
    />
  ),
};
