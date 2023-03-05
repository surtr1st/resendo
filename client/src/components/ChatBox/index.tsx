import React, { ReactNode } from 'react';
import './style.css';

interface Props {
  children: ReactNode;
  type: 'container' | 'fluid'
}

export const ChatBox = {
  Header: ({ children, type }: Props) => (
    <React.Fragment>
      {
        type === 'container'
          ? (
            <div className='container'>
              <div className='inner-box-header'>
                <div className='chat-header'>{children}</div>
              </div>
            </div>
          )
          : (
            <div className='fluid'>
              <div className='inner-box-header'>
                <div className='chat-header'>{children}</div>
              </div>
            </div>
          )
      }
    </React.Fragment>
  ),
  Body: ({ children, type }: Props) => (
    <React.Fragment>
      {
        type === 'container'
          ? (
            <div className='container'>
              <div className='inner-box'>
                <div className='chat'>{children}</div>
              </div>
            </div>
          )
          : (
            <div className='fluid'>
              <div className='inner-box'>
                <div className='chat'>{children}</div>
              </div>
            </div>
          )
      }
    </React.Fragment>
  ),
  Footer: ({ children, type }: Props) => (
    <React.Fragment>
      {
        type === 'container'
          ? (
            <div className='container'>
              <div className='inner-box-footer'>
                <div className='chat-footer'>{children}</div>
              </div>
            </div>
          )
          : (
            <div className='fluid'>
              <div className='inner-box-footer'>
                <div className='chat-footer'>{children}</div>
                <div className='chat-footer'>{children}</div>
              </div>
            </div>
          )
      }
    </React.Fragment>
  )
};
