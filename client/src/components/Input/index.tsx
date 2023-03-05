import './style.css';
import React, { ReactNode } from 'react';

type Props = {
  ref: string;
  name: string;
  value: string;
  className: string;
  onChange: () => void;
  multiline?: boolean;
  children: ReactNode;
};

export const Input = {
  Text: ({
    ref,
    name,
    value,
    onChange,
    className,
    multiline,
    children,
  }: Partial<Props>) => (
    <React.Fragment>
      {multiline ? (
        <React.Fragment>
          <input
            type='text'
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            className='text'
          />
          {children}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className='chat-input'>
            <textarea
              rows={1}
              ref={ref}
              name={name}
              value={value}
              onChange={onChange}
              className='text'
            />
            {children}
          </div>
        </React.Fragment>
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
