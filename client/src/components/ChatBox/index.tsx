import './style.css';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode | ReactNode[];
  type?: 'container' | 'fluid';
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
  Body: ({ children }: Props) => (
    <div className='inner-box'>
      <div className='chat'>{children}</div>
    </div>
  ),
  Footer: ({ children }: Props) => (
    <div className='inner-box-footer'>
      <div className='chat-footer'>{children}</div>
    </div>
  ),
};
