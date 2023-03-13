import { Button } from '../Button';
import './style.css';

type Props = {
  name: string;
  avatarSrc: string;
  addFriend: () => void | Promise<void>;
};

export function User({ name, addFriend }: Partial<Props>) {
  return (
    <div className='user'>
      <h4>{name}</h4>
      <Button.Send
        label='Add'
        onSend={addFriend}
      />
    </div>
  );
}
