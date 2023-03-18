import './style.css';

type Props = {
  label: string;
};
type SendProps = Props & {
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
  Send: ({ label, onSend }: Partial<SendProps>) => (
    <button
      onClick={onSend}
      className='send'
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
            d='M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8l-8 6l-8.054-2.685z'
          />
        </svg>
        {label}
      </div>
    </button>
  ),
  Create: ({ label, onCreate }: Partial<CreateProps>) => (
    <button
      onClick={onCreate}
      className='create'
    >
      <div className='content'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 32 32'
        >
          <path
            fill='currentColor'
            d='M30 24h-4v-4h-2v4h-4v2h4v4h2v-4h4z'
          />
          <path
            fill='currentColor'
            d='M15.4 30L5 23.8c-.6-.4-1-1-1-1.7V9.9c0-.7.4-1.4 1-1.7l10-5.9c.3-.2.6-.3 1-.3s.7.1 1 .3l10 5.9c.6.4 1 1 1 1.7V16h-2V9.9L16 4L6 9.9v12.2l10.5 6.2l-1.1 1.7z'
          />
        </svg>
        {label}
      </div>
    </button>
  ),
  Accept: ({ label, onAccept }: Partial<AcceptProps>) => (
    <button
      onClick={onAccept}
      className='accept'
    >
      <div className='content'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 15 15'
        >
          <path
            fill='currentColor'
            fill-rule='evenodd'
            d='M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z'
            clip-rule='evenodd'
          />
        </svg>
        {label}
      </div>
    </button>
  ),
  Cancel: ({ label, onCancel }: Partial<CancelProps>) => (
    <button
      onClick={onCancel}
      className='cancel'
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
            d='M7.7 16.3q.275.275.7.275q.425 0 .7-.275l2.9-2.9l2.925 2.925q.275.275.688.262q.412-.012.687-.287q.275-.275.275-.7q0-.425-.275-.7L13.4 12l2.925-2.925q.275-.275.262-.688q-.012-.412-.287-.687q-.275-.275-.7-.275q-.425 0-.7.275L12 10.6L9.075 7.675Q8.8 7.4 8.388 7.412q-.413.013-.688.288q-.275.275-.275.7q0 .425.275.7l2.9 2.9l-2.925 2.925q-.275.275-.262.687q.012.413.287.688ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z'
          />
        </svg>
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
