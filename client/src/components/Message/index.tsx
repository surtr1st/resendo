import React from 'react';
import { Avatar } from '../Avatar';
import './style.css';

type Props = {
  author?: string
  content: string;
};

type CardProps = {
  avatarSrc: string;
  opponentName: string;
  latestMessage: string;
  onAction: () => void;
};

export const Message = {
  Sender: ({ author, content }: Props) => (
    <React.Fragment>
      <div className='sender'>
        {author && <h5 className='sender-label'>{author}</h5>}
        <p>{content}</p>
      </div>
    </React.Fragment>
  ),
  Receiver: ({ author, content }: Props) => (
    <React.Fragment>
      <div className='receiver'>
        {author && <h5 className='receiver-label'>{author}</h5>}
        <p>{content}</p>
      </div>
    </React.Fragment>
  ),
  Card: ({ avatarSrc, opponentName, latestMessage, onAction }: CardProps) => (
    <div
      className='card'
      onClick={onAction}
    >
      <div className='card-image'>
        {
          !avatarSrc
            ? <Avatar.WithoutLabel name={opponentName} />
            : <Avatar.WithLabel src={avatarSrc} alt={avatarSrc} />
        }
      </div>
      <span className='card-detail'>
        <h3>{opponentName.length > 12 ? `${opponentName.substring(0, 12)}...` : opponentName}</h3>
        <h5>
          {latestMessage.length > 10
            ? `${latestMessage.slice(0, 10)}...`
            : latestMessage}
        </h5>
      </span>
    </div>
  ),
};
