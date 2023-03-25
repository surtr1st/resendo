import './style.css';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};
type GridItemProps = {
  children: ReactNode;
  col?:
    | 'col-1'
    | 'col-2'
    | 'col-3'
    | 'col-4'
    | 'col-5'
    | 'col-6'
    | 'col-7'
    | 'col-8'
    | 'col-9'
    | 'col-10'
    | 'col-11'
    | 'col-12';
  type: 'side' | 'article';
};

export const Container = {
  Grid: ({ children }: Props) => <div className='grid'>{children}</div>,
  GridItem: ({ children, col, type }: GridItemProps) => (
    <div className={type}>{children}</div>
  ),
};
