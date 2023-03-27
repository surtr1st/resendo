import { useEffect, useState } from 'react';
import './style.css';

type LabelProps = {
  src: string;
  alt: string;
};

type NoneLabelProps = {
  name: string;
};

export const Avatar = {
  WithLabel: ({ src, alt }: LabelProps) => (
    <div className='with-label'>
      <img
        src={src}
        alt={alt}
      />
    </div>
  ),
  WithoutLabel: ({ name }: NoneLabelProps) => {
    const [background, setBackground] = useState('#fff');
    useEffect(() => {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      setBackground(`#${randomColor}`);
    }, []);
    return (
      <div className='without-label'>
        <div
          className='none-label'
          title={name}
          style={{ background }}
        >
          <h3>{name.slice(0, 1).toUpperCase()}</h3>
        </div>
      </div>
    );
  },
};
