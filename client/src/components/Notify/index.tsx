import './style.css';
import { useEffect, useRef } from 'react';

type Props = {
  message: string;
  duration: number;
  reset: () => void
};

export const Notify = {
  Success: ({ message, duration, reset }: Props) => {
    const notify = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (notify.current)
        notify.current.classList.add('show', 'success')
      const timer = setTimeout(
        () => {
          if (notify.current) {
            notify.current.classList.remove('show', 'success')
            notify.current.classList.add('hidden', 'success')
            setTimeout(() => reset(), 250)
          }
        },
        duration,
      )
      return () => {
        clearTimeout(timer)
      }
    }, [])
    return (
      <div
        ref={notify}
        id='notify'
      >
        <span className='content'>
          <h3>{message}</h3>
        </span>
      </div>
    );
  },
  Error: ({ message, duration, reset }: Props) => {
    const notify = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (notify.current)
        notify.current.classList.add('show', 'error')
      const timer = setTimeout(
        () => {
          if (notify.current) {
            notify.current.classList.remove('show', 'error')
            notify.current.classList.add('hidden', 'error')
            setTimeout(() => reset(), 250)
          }
        },
        duration,
      )
      return () => {
        clearTimeout(timer)
      }
    }, [])
    return (
      <div
        ref={notify}
        id='notify'
      >
        <span className='content'>
          <h3>{message}</h3>
        </span>
      </div>
    );
  },
};
