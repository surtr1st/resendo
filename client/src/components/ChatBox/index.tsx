import React, { ReactNode } from 'react';
import './style.css';

interface Props {
  children: ReactNode;
  type: 'container' | 'fluid'
}

export const ChatBox = ({ children, type }: Props) => (
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
);
