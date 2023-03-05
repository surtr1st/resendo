import './style.css';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const Container = ({ children }: Props) => (
  <React.Fragment>{children}</React.Fragment>
);
