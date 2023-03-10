import './style.css';
import React, { ChangeEvent, ForwardedRef, ReactNode } from 'react';

type Props = {
  name: string;
  value: string;
  className: string;
  children: ReactNode;
  minRows: number;
  maxRows: number;
  onChange: (e: ChangeEvent) => void;
};

export const Input = React.forwardRef(
  (
    { name, value, children, onChange }: Partial<Props>,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    return (
      <div className='chat-input'>
        <textarea
          ref={ref}
          name={name}
          value={value}
          className='text'
          rows={1}
          onChange={onChange}
        />
        {children}
      </div>
    );
  },
);
