import './style.css';
import { Avatar } from '../Avatar';

type Props = {
  author?: string;
  content: string;
  mediaSrc?: string;
};

type CardProps = {
  avatarSrc: string;
  opponentName: string;
  latestMessage: string;
  onAction: () => void;
};

export const Message = {
  Sender: ({ author, content, mediaSrc }: Props) => {
    return (
      <div className='sender'>
        {author && <h5 className='sender-label'>{author}</h5>}
        {content && <p>{content}</p>}
        {mediaSrc && (
          <div className='img-container'>
            <img
              loading='lazy'
              src={`${mediaSrc}.png`}
            />
          </div>
        )}
      </div>
    );
  },
  Receiver: ({ author, content, mediaSrc }: Props) => {
    return (
      <div className='receiver'>
        {author && <h5 className='receiver-label'>{author}</h5>}
        {content && <p>{content}</p>}
        {mediaSrc && (
          <div className='img-container'>
            <img
              loading='lazy'
              src={`${mediaSrc}.png`}
            />
          </div>
        )}
      </div>
    );
  },
  Card: ({ avatarSrc, opponentName, latestMessage, onAction }: CardProps) => (
    <div
      className='card'
      onClick={onAction}
    >
      <div className='card-image'>
        {!avatarSrc ? (
          <Avatar.WithoutLabel name={opponentName} />
        ) : (
          <Avatar.WithLabel
            src={avatarSrc}
            alt={avatarSrc}
          />
        )}
      </div>
      <span className='card-detail'>
        <h3>
          {opponentName.length > 12
            ? `${opponentName.substring(0, 12)}...`
            : opponentName}
        </h3>
        <h5>
          {latestMessage.length > 10
            ? `${latestMessage.slice(0, 10)}...`
            : latestMessage}
        </h5>
      </span>
    </div>
  ),
};
