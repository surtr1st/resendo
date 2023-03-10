import './style.css';

type SendProps = {
  label: string;
  onSend: () => void | Promise<void>;
};

type CreateProps = {
  label: string;
  onCreate: () => void | Promise<void>;
}

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
  Creator: ({ label, onCreate }: Partial<CreateProps>) => (
    <button
      onClick={onCreate}
      className='create'
    >
      <div className='content'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M30 24h-4v-4h-2v4h-4v2h4v4h2v-4h4z" /><path fill="currentColor" d="M15.4 30L5 23.8c-.6-.4-1-1-1-1.7V9.9c0-.7.4-1.4 1-1.7l10-5.9c.3-.2.6-.3 1-.3s.7.1 1 .3l10 5.9c.6.4 1 1 1 1.7V16h-2V9.9L16 4L6 9.9v12.2l10.5 6.2l-1.1 1.7z" /></svg>
        {label}
      </div>
    </button>
  )
};
