import './style.css';
import React, { ChangeEvent, ForwardedRef, ReactNode, Ref, RefObject } from 'react';
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
          <div className='input-label'>
            {label && <label htmlFor={name}>{label}</label>}
          </div>
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

      const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const localRef = ref as RefObject<HTMLTextAreaElement>
        if (localRef.current) {
          localRef.current.style.height = "auto";
          localRef.current.style.height = `${e.target.scrollHeight - 16}px`;
        }
      };
      return (
        <div className="chat-box">
          <div className='input-label'>
            {label && <label htmlFor={name}>{label}</label>}
          </div>
          <div className='chat-input'>
            <textarea
              id={name}
              ref={ref}
              name={name}
              value={value}
              cols={10}
              rows={1}
              onChange={onChange}
              onInput={handleInput}
            />
            {children}
          </div>
        </div>
      );
    }
  )
}

