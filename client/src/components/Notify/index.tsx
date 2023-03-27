import './style.css';
import { useEffect, useRef } from 'react';

type Props = {
  message: string;
  duration: number;
};

export const Notify = {
  Success: ({ message, duration }: Props) => {
    const notify = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (notify.current) {
        notify.current.className = 'show';
        setTimeout(
          () => notify.current?.className.replace('show', ''),
          duration,
        );
      }
    }, []);
    return (
      <div
        ref={notify}
        className='notify success'
      >
        <span className='content'>
          <h3>{message}</h3>
        </span>
      </div>
    );
  },
  Error: ({ message, duration }: Props) => {
    const notify = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (notify.current) {
        notify.current.className = 'show';
        setTimeout(
          () => notify.current?.className.replace('show', ''),
          duration,
        );
      }
    }, []);
    return (
      <div
        ref={notify}
        className='notify error show'
      >
        <span className='content'>
          <h3>{message}</h3>
        </span>
      </div>
    );
  },
};
