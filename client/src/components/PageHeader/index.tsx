import { Avatar } from '../Avatar';
import './style.css';

type Props = {
  author: string;
  avatarSrc: string;
};

export const PageHeader = ({ author, avatarSrc }: Props) => {
  return (
    <div className='page-header'>
      {!avatarSrc ? (
        <Avatar.WithoutLabel name={author} />
      ) : (
        <Avatar.WithLabel
          src={avatarSrc}
          alt={avatarSrc}
        />
      )}
      <h2>{author}</h2>
    </div>
  );
};
