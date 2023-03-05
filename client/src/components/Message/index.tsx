import './style.css';

type Props = {
  content: string;
};

type CardProps = {
  avatarSrc: string;
  opponentName: string;
  latestMessage: string;
  onAction: () => void;
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
  Card: ({ avatarSrc, opponentName, latestMessage, onAction }: CardProps) => (
    <div
      className='card'
      onClick={onAction}
    >
      <div className='card-image'></div>
      <span className='card-detail'>
        <h3>{opponentName}</h3>
        <h5>
          {latestMessage.length > 10
            ? `${latestMessage.slice(0, 10)}...`
            : latestMessage}
        </h5>
      </span>
    </div>
  ),
};
