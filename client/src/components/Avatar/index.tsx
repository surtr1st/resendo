import './style.css';

type LabelProps = {
  src: string
  alt: string
}

type NoneLabelProps = {
  name: string
}

export const Avatar = {
  WithLabel: ({ src, alt }: LabelProps) => (
    <div className='with-label'>
      <img src={src} alt={alt} />
    </div>
  ),
  WithoutLabel: ({ name }: NoneLabelProps) => (
    <div className='without-label'>
      <div className='none-label' title={name}>
        <h3>{name.slice(0, 1).toUpperCase()}</h3>
      </div>
    </div>
  )
};
