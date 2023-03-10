import React, { ForwardedRef, ReactNode, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../Button';
import './style.css';

type Props = {
  title: string;
  open: boolean;
  content: string;
  onClose: () => void | boolean | Promise<void | boolean>;
};

type CustomizableProps = Props & {
  children: ReactNode;
};

export const Modal = {
  Default: ({ open, title, content, onClose }: Partial<Props>) => {
    return ReactDOM.createPortal(
      <React.Fragment>
        {open && (
          <div>
            <div className='modal'>
              <span className='modal-header'>
                <h3>{title}</h3>
                <Button.Close onClose={onClose} />
              </span>
              <div className='modal-body'>
                <p>{content}</p>
              </div>
              <div className='modal-footer'>
                <Button.Accept
                  label='Accept'
                  onAccept={onClose}
                />
                <Button.Cancel
                  label='Cancel'
                  onCancel={onClose}
                />
              </div>
            </div>
            <div className='modal-backdrop' />
          </div>
        )}
      </React.Fragment>,
      document.querySelector('body') as HTMLElement,
    );
  },
  Customizable: ({ open, title, onClose }: CustomizableProps) =>
    open ? <div></div> : <React.Fragment />,
};
