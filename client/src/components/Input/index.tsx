import './style.css';
import React, {
  ChangeEvent,
  ForwardedRef,
  KeyboardEvent,
  ReactNode,
  RefObject,
} from 'react';
import { Button } from '../Button';

type Props = {
  label: string;
  name: string;
  value: string;
  className: string;
  children: ReactNode;
  minRows: number;
  maxRows: number;
  clearable: boolean;
  onChange: (e: ChangeEvent) => void;
  onEnter: () => void;
  onClear: () => void;
  onKeyDown: () => void
  onKeyUp: () => void;
};

export const Input = {
  Text: React.forwardRef(
    (
      {
        label,
        name,
        value,
        children,
        clearable,
        onEnter,
        onChange,
        onClear,
      }: Partial<Props>,
      ref: ForwardedRef<HTMLInputElement>,
    ) => {
      function handleEnter(event: KeyboardEvent) {
        const ENTER = 'Enter';
        if (event.key === ENTER) {
          event.preventDefault();
          if (onEnter) {
            onEnter();
          }
        }
      }
      return (
        <div className='chat-box'>
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
              onKeyDown={handleEnter}
            />
            {children}
            {clearable && <Button.Clear onClear={onClear} />}
          </div>
        </div>
      );
    },
  ),
  Password: React.forwardRef(
    (
      {
        label,
        name,
        value,
        children,
        clearable,
        onEnter,
        onChange,
        onClear,
      }: Partial<Props>,
      ref: ForwardedRef<HTMLInputElement>,
    ) => {
      function handleEnter(event: KeyboardEvent) {
        const ENTER = 'Enter';
        if (event.key === ENTER) {
          event.preventDefault();
          if (onEnter) {
            onEnter();
          }
        }
      }
      return (
        <div className='chat-box'>
          <div className='input-label'>
            {label && <label htmlFor={name}>{label}</label>}
          </div>
          <div className='chat-input'>
            <input
              id={name}
              ref={ref}
              name={name}
              value={value}
              type='password'
              className='text'
              onChange={onChange}
              onKeyDown={handleEnter}
            />
            {children}
            {clearable && <Button.Clear onClear={onClear} />}
          </div>
        </div>
      );
    },
  ),
  TextArea: React.forwardRef(
    (
      { label, name, value, children, onEnter, onChange, onKeyUp, onKeyDown }: Partial<Props>,
      ref: ForwardedRef<HTMLTextAreaElement>,
    ) => {
      const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const localRef = ref as RefObject<HTMLTextAreaElement>;
        if (localRef.current) {
          localRef.current.style.height = 'auto';
          localRef.current.style.height = `${e.target.scrollHeight - 16}px`;
        }
      };
      function handleEnter(event: KeyboardEvent) {
        const ENTER = 'Enter';
        if (onKeyDown)
          onKeyDown()
        if (event.key === ENTER) {
          event.preventDefault();
          if (onEnter)
            onEnter();
        }
      }
      return (
        <div className='chat-box'>
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
              onKeyDown={handleEnter}
              onKeyUp={onKeyUp}
            />
            {children}
          </div>
        </div>
      );
    },
  ),
  Search: React.forwardRef(
    (
      {
        label,
        name,
        value,
        clearable,
        onChange,
        onClear,
        onEnter
      }: Partial<Props>,
      ref: ForwardedRef<HTMLInputElement>,
    ) => {
      function handleEnter(event: KeyboardEvent) {
        const ENTER = 'Enter';
        if (event.key === ENTER) {
          event.preventDefault();
          if (onEnter) {
            onEnter();
          }
        }
      }
      return (
        <div className='chat-box'>
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
              onKeyDown={handleEnter}
            />
            {clearable && <Button.Clear onClear={onClear} />}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
            >
              <path
                fill='currentColor'
                d='m18.9 20.3l-5.6-5.6q-.75.6-1.725.95Q10.6 16 9.5 16q-2.725 0-4.612-1.887Q3 12.225 3 9.5q0-2.725 1.888-4.613Q6.775 3 9.5 3t4.613 1.887Q16 6.775 16 9.5q0 1.1-.35 2.075q-.35.975-.95 1.725l5.625 5.625q.275.275.275.675t-.3.7q-.275.275-.7.275q-.425 0-.7-.275ZM9.5 14q1.875 0 3.188-1.312Q14 11.375 14 9.5q0-1.875-1.312-3.188Q11.375 5 9.5 5Q7.625 5 6.312 6.312Q5 7.625 5 9.5q0 1.875 1.312 3.188Q7.625 14 9.5 14Z'
              />
            </svg>
          </div>
        </div>
      );
    },
  ),
};
