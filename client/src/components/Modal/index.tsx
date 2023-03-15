import './style.css';
import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../Button';

type Props = {
  title: string;
  open: boolean;
  onClose: () => void | boolean | Promise<void | boolean>;
};
type DefaultProps = Props & {
  content: string;
};
type CustomizableProps = Props & {
  children: ReactNode;
};
type CustomizableContentProps = {
  children: ReactNode;
};
type CustomizableActionProps = {
  children: ReactNode;
};

export const Modal = {
  Default: ({ open, title, content, onClose }: Partial<DefaultProps>) => {
    return ReactDOM.createPortal(
      <React.Fragment>
        {open && (
          <>
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
          </>
        )}
      </React.Fragment>,
      document.querySelector('body') as HTMLElement,
    );
  },
  Customizable: ({
    open,
    onClose,
    title,
    children,
  }: Partial<CustomizableProps>) =>
    ReactDOM.createPortal(
      <React.Fragment>
        {open && (
          <>
            <div className='modal'>
              <span className='modal-header'>
                <h3>{title}</h3>
                <Button.Close onClose={onClose} />
              </span>
              {children}
            </div>
            <div className='modal-backdrop' />
          </>
        )}
      </React.Fragment>,
      document.querySelector('body') as HTMLElement,
    ),
  ContentBody: ({ children }: Partial<CustomizableContentProps>) => (
    <div className='modal-body'>{children}</div>
  ),
  ActionFooter: ({ children }: Partial<CustomizableActionProps>) => (
    <div className='modal-footer'>{children}</div>
  ),
};
