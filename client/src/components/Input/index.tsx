import './style.css';
import React, { ChangeEvent, ForwardedRef, ReactNode } from 'react';
import { Button } from '../Button';

type Props = {
  label: string
  name: string;
  value: string;
  className: string;
  children: ReactNode;
  minRows: number;
  maxRows: number;
  onChange: (e: ChangeEvent) => void;
  onClear: () => void
};


export const Input = {
  Text: React.forwardRef(
    (
      { label, name, value, children, onChange, onClear }: Partial<Props>,
      ref: ForwardedRef<HTMLInputElement>,
    ) => {
      return (
        <div className="chat-box">
          {label && <label htmlFor={name}>{label}</label>}
          <div className='chat-input'>
            <input
              id={name}
              ref={ref}
              name={name}
              value={value}
              className='text'
              onChange={onChange}
            />
            {children}
            <Button.Clear onClear={onClear} />
          </div>
        </div>
      );
    }),
  TextArea: React.forwardRef(
    (
      { label, name, value, children, onChange }: Partial<Props>,
      ref: ForwardedRef<HTMLTextAreaElement>,
    ) => {
      return (
        <div className="chat-box">
          {label && <label htmlFor={name}>{label}</label>}
          <div className='chat-input'>
            <textarea
              id={name}
              ref={ref}
              name={name}
              value={value}
              className='text'
              cols={10}
              rows={2}
              onChange={onChange}
            />
            {children}
          </div>
        </div>
      );
    }
  )
}

