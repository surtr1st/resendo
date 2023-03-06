import './style.css';
import React, { ChangeEvent, ForwardedRef, ReactNode, SyntheticEvent, useEffect, useState } from 'react';

type Props = {
  name: string;
  value: string;
  className: string;
  children: ReactNode;
  minRows: number
  maxRows: number
};

export const Input = React.forwardRef((
  {
    name,
    value,
    children,
  }: Partial<Props>,
  ref: ForwardedRef<HTMLTextAreaElement>
) => {
  return (
    <div className='chat-input'>
      <textarea
        ref={ref}
        name={name}
        value={value}
        className='text'
        rows={1}
      />
      {children}
    </div>
  )
})
