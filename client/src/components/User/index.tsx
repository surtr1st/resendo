import './style.css';
import { Button } from '../Button';
import { useAuth, useFriend, useGroup } from '../../hooks';
import { useState } from 'react';

type Props = {
  name: string;
  avatarSrc: string;
  onAction: () => void | Promise<void>;
  uid: string
  isSelf: boolean
  disabled: boolean
};

export const User = {
  StrangerList: ({ name, onAction, uid, isSelf }: Partial<Props>) => {

    const [isAdded, setIsAdded] = useState(false)

    const { checkIfAdded: isFriendAdded } = useFriend()
    const { userId } = useAuth()

    isFriendAdded(userId, uid as string)
      .then(res => setIsAdded(res))
      .catch(err => console.log(err))
    return (
      <div className='user'>
        <h4>{name!.length > 12 ? `${name?.slice(0, 12)}...` : name}</h4>
        {!isSelf && !isAdded && <Button.Send
          label='Add'
          onSend={onAction}
        />}
        {isSelf && <div className='self-label'>
          <h4>Self</h4>
        </div>}
        {isAdded && <div className='added'>
          <h4>Added</h4>
        </div>}
      </div>
    );
  },
  FriendList: ({ name, onAction, uid, disabled }: Partial<Props>) => {
    const [isAdded, setIsAdded] = useState(false)
    const { checkIfAdded: isGroupAdded } = useGroup()

    isGroupAdded(uid as string)
      .then(res => setIsAdded(res))
      .catch(err => console.log(err))

    return (
      <div className='user'>
        <h4>{name!.length > 12 ? `${name?.slice(0, 12)}...` : name}</h4>
        <Button.Send
          label={isAdded || disabled ? 'Added' : 'Add'}
          disabled={isAdded || disabled}
          onSend={onAction}
        />
      </div>
    );
  }
}

