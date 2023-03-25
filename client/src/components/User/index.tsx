import './style.css';
import { Button } from '../Button';
import { useAuth, useFriend } from '../../services';
import { useState } from 'react';

type Props = {
  name: string;
  avatarSrc: string;
  addFriend: () => void | Promise<void>;
  uid: string
  isSelf: boolean
};

export function User({ name, addFriend, uid, isSelf }: Partial<Props>) {

  const [isAdded, setIsAdded] = useState(false)

  const { checkIfAdded } = useFriend()
  const { userId } = useAuth()

  checkIfAdded(userId, uid as string)
    .then(res => {
      setIsAdded(res)
    })
    .catch(err => console.log(err))

  return (
    <div className='user'>
      <h4>{name!.length > 12 ? `${name?.slice(0, 12)}...` : name}</h4>
      {!isSelf && !isAdded && <Button.Send
        label='Add'
        onSend={addFriend}
      />}
      {isSelf && <div className='self-label'>
        <h4>Self</h4>
      </div>}
      {isAdded && <div className='added'>
        <h4>Added</h4>
      </div>}
    </div>
  );
}
