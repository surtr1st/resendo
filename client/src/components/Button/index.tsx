import './style.css';

type SendProps = {
  label: string;
  onSend: () => void;
};

export const Button = {
  Send: ({ label, onSend }: Partial<SendProps>) => (
    <button
      onClick={onSend}
      className='send'
    >
      {label}
    </button>
  ),
};
