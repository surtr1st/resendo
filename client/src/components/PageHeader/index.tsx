import './style.css'

type Props = {
  author: string
  avatarSrc: string
}

export const PageHeader = ({ author, avatarSrc }: Props) => {
  return (
    <div className="page-header">
      <img src={avatarSrc} alt='#' />
      <h2>{author}</h2>
    </div>
  );
};
