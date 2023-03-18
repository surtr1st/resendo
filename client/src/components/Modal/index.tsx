import './style.css';
import React, { ReactNode, KeyboardEvent } from 'react';
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

const ESCAPE = 'Escape'

export const Modal = {
  Default: ({ open, title, content, onClose }: Partial<DefaultProps>) => {
    function closeOnEsc(e: KeyboardEvent) {
      if (e.key === ESCAPE) {
        e.preventDefault()
        if (onClose)
          onClose()
      }
    }
    return ReactDOM.createPortal(
      <React.Fragment>
        {open && (
          <>
            <div className='modal' onKeyDown={closeOnEsc}>
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
  }: Partial<CustomizableProps>) => {
    function closeOnEsc(e: KeyboardEvent) {
      if (e.key === ESCAPE) {
        e.preventDefault()
        if (onClose)
          onClose()
      }
    }
    return ReactDOM.createPortal(
      <React.Fragment>
        {open && (
          <>
            <div className='modal' onKeyDown={closeOnEsc}>
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
    )
  },
  ContentBody: ({ children }: Partial<CustomizableContentProps>) => (
    <div className='modal-body'>{children}</div>
  ),
  ActionFooter: ({ children }: Partial<CustomizableActionProps>) => (
    <div className='modal-footer'>{children}</div>
  ),
};
