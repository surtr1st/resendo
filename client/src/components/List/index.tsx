import './style.css';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode | ReactNode[];
};
export const List = {
  Box: ({ children }: Props) => <ul>{children}</ul>,
  Item: ({ children }: Props) => <li>{children}</li>,
};
