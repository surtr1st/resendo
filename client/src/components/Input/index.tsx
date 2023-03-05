type Props = {
  ref: string;
  name: string;
  value: string;
  className: string;
  onChange: () => void;
};

export const Input = {
  Text: ({ ref, name, value, onChange, className }: Partial<Props>) => (
    <input
      type='text'
      ref={ref}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    />
  ),
  FileUpload: ({ ref, name, value, onChange, className }: Partial<Props>) => (
    <input
      type='file'
      ref={ref}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    />
  ),
  Search: ({ ref, name, value, onChange, className }: Partial<Props>) => (
    <input
      type='text'
      ref={ref}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    />
  ),
};
