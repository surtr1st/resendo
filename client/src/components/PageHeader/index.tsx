import './style.css'

type Props = {
  author: string
}

export const PageHeader = ({ author }: Props) => {
  return (
    <div className="page-header">
      <h1>{author}</h1>
    </div>
  );
};
