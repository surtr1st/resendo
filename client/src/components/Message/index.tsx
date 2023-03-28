import './style.css';
import React from 'react';
import { Avatar } from '../Avatar';

type Props = {
  author?: string;
  content: string;
  mediaSrc?: string;
  authorAvatarSrc?: string;
};

type CardProps = {
  avatarSrc: string;
  opponentName: string;
  latestMessage: string;
  invisible?: boolean;
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
  Receiver: ({ authorAvatarSrc, author, content, mediaSrc }: Props) => {
    return (
      <div className='author-avatar'>
        {authorAvatarSrc ? (
          <Avatar.WithLabel
            src={authorAvatarSrc as string}
            alt='#'
          />
        ) : (
          <Avatar.WithoutLabel name={author as string} />
        )}
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
      </div>
    );
  },
  Card: ({
    avatarSrc,
    opponentName,
    latestMessage,
    invisible,
    onAction,
  }: CardProps) => (
    <div
      className={`${invisible ? 'invisible' : 'card'}`}
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
        <h3 style={{ fontWeight: 'bold' }}>
          {opponentName && opponentName.length > 12
            ? `${opponentName.substring(0, 12)}...`
            : opponentName}
        </h3>
        <h5 style={{ color: '#6b7280' }}>
          {latestMessage && latestMessage?.length > 20
            ? `${latestMessage.slice(0, 20)}...`
            : latestMessage}
        </h5>
      </span>
    </div>
  ),
};
