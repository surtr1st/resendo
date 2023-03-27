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
  clearable: boolean;
  onEnter: () => void;
  onKeyDown: () => void;
  onKeyUp: () => void;
};

type InputProps = Props & {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
};

type TextAreaProps = Props & {
  minRows: number;
  maxRows: number;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
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
      }: Partial<InputProps>,
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
        <div className='chat-box-input'>
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
      }: Partial<InputProps>,
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
        <div className='chat-box-input'>
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
      {
        label,
        name,
        value,
        children,
        onEnter,
        onChange,
        onKeyUp,
        onKeyDown,
      }: Partial<TextAreaProps>,
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
        if (onKeyDown) onKeyDown();
        if (event.key === ENTER) {
          event.preventDefault();
          if (onEnter) onEnter();
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
        onEnter,
      }: Partial<InputProps>,
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
        <div className='chat-box-input'>
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
  File: React.forwardRef(
    (
      { label, name, value, onChange }: Partial<InputProps>,
      ref: ForwardedRef<HTMLInputElement>,
    ) => {
      return (
        <div className='chat-box-input'>
          <div className='file-label'>
            <label htmlFor={name}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
              >
                <path
                  fill='currentColor'
                  d='m12 12.586l4.243 4.242l-1.415 1.415L13 16.415V22h-2v-5.587l-1.828 1.83l-1.415-1.415L12 12.586zM12 2a7.001 7.001 0 0 1 6.954 6.194a5.5 5.5 0 0 1-.953 10.784L18 17a6 6 0 0 0-11.996-.225L6 17v1.978a5.5 5.5 0 0 1-.954-10.784A7 7 0 0 1 12 2z'
                />
              </svg>
              {label}
            </label>
          </div>
          <input
            type='file'
            id={name}
            ref={ref}
            name={name}
            value={value}
            className='text'
            onChange={onChange}
          />
        </div>
      );
    },
  ),
};
