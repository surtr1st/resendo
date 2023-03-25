import './style.css';
import { ReactNode } from 'react';

type Props = { children: ReactNode };
export const Spacing = {
  Vertical: ({ children }: Props) => <div className='v-space'>{children}</div>,
  Horizontal: ({ children }: Props) => (
    <div className='h-space'>{children}</div>
  ),
};
