import './style.css';
import React, { ReactNode, useRef, useEffect, useCallback } from 'react';

interface Props {
  children: ReactNode | ReactNode[];
  type?: 'container' | 'fluid';
  triggerScrollDown?: boolean
}

export const Chat = {
  Box: ({ children, type }: Props) => (
    <React.Fragment>
      {type === 'container' ? (
        <div className='container'>{children}</div>
      ) : (
        <div className='fluid'>{children}</div>
      )}
    </React.Fragment>
  ),
  Header: ({ children }: Props) => (
    <div className='inner-box-header'>
      <div className='chat-header'>{children}</div>
    </div>
  ),
  Body: ({ children, triggerScrollDown }: Props) => {
    const chatBody = useRef<HTMLDivElement>(null)
    const scrollToBottom = useCallback(() => {
      setTimeout(() => {
        chatBody.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }, 0);
    }, [chatBody]);
    useEffect(() => {
      scrollToBottom();
    }, [triggerScrollDown]);
    return (
      <div className='inner-box'>
        <div ref={chatBody} className='chat'>
          {children}
        </div>
      </div>
    )
  },
  Footer: ({ children }: Props) => (
    <div className='inner-box-footer'>
      <div className='chat-footer'>{children}</div>
    </div>
  ),
};
