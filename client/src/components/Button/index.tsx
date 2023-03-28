import './style.css';
import { ReactNode } from 'react';

type Props = {
  label: string;
  icon: ReactNode;
  disabled: boolean;
};
type SendProps = Props & {
  transparent?: boolean;
  onSend: () => void | boolean | Promise<void | boolean>;
};
type CreateProps = Props & {
  onCreate: () => void | boolean | Promise<void | boolean>;
};
type AcceptProps = Props & {
  onAccept: () => void | boolean | Promise<void | boolean>;
};
type CancelProps = Props & {
  onCancel: () => void | boolean | Promise<void | boolean>;
};
type CloseProps = {
  onClose: () => void | boolean | Promise<void | boolean>;
};
type ClearProps = {
  onClear: () => void | boolean | Promise<void | boolean>;
};
type LinkProps = Props & {
  onNavigate: () => void | boolean | Promise<void | boolean>;
};

export const Button = {
  Send: ({
    icon,
    disabled,
    transparent,
    label,
    onSend,
  }: Partial<SendProps>) => (
    <button
      disabled={disabled}
      onClick={onSend}
      className={transparent ? 'send-transparent' : 'send'}
    >
      <div className='content'>
        {icon}
        {label}
      </div>
    </button>
  ),
  Create: ({ icon, label, onCreate }: Partial<CreateProps>) => (
    <button
      onClick={onCreate}
      className='create'
    >
      <div className='content'>
        {icon}
        {label}
      </div>
    </button>
  ),
  Accept: ({ icon, label, onAccept, disabled }: Partial<AcceptProps>) => (
    <button
      onClick={onAccept}
      className={disabled ? 'accept-disabled' : 'accept'}
      disabled={disabled}
    >
      <div className='content'>
        {icon}
        {label}
      </div>
    </button>
  ),
  Cancel: ({ icon, label, onCancel }: Partial<CancelProps>) => (
    <button
      onClick={onCancel}
      className='cancel'
    >
      <div className='content'>
        {icon}
        {label}
      </div>
    </button>
  ),
  Close: ({ onClose }: Partial<CloseProps>) => (
    <button
      onClick={onClose}
      className='close'
    >
      <div className='content'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
        >
          <path
            fill='currentColor'
            d='M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z'
          />
        </svg>
      </div>
    </button>
  ),
  Clear: ({ onClear }: Partial<ClearProps>) => (
    <button
      onClick={onClear}
      className='close'
    >
      <div className='transparent-content'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
        >
          <path
            fill='currentColor'
            d='M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z'
          />
        </svg>
      </div>
    </button>
  ),
  Link: ({ label, onNavigate }: Partial<LinkProps>) => (
    <button
      onClick={onNavigate}
      className='close'
    >
      <div className='transparent-content'>{label}</div>
    </button>
  ),
};
