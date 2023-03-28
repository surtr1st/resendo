import './style.css';
import { ReactNode } from 'react';

type Props = { children: ReactNode; floated?: boolean };
export const Spacing = {
  Vertical: ({ children, floated }: Props) => (
    <div className={`v-space ${floated && 'floated'}`}>{children}</div>
  ),
  Horizontal: ({ children, floated }: Props) => (
    <div className={`h-space ${floated && 'floated'}`}>{children}</div>
  ),
};
