import './style.css';

type Props = {
  content: string;
};

export const Message = {
  Sender: ({ content }: Props) => (
    <div className='sender'>
      <p>{content}</p>
    </div>
  ),
  Receiver: ({ content }: Props) => (
    <div className='receiver'>
      <p>{content}</p>
    </div>
  ),
  Card: () => <div></div>,
};
