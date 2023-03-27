import './style.css';
import { Button } from '../Button';
import { useAuth, useFriend } from '../../hooks';
import React, { useState } from 'react';

type Props = {
  type: 'add-friend' | 'add-to-group'
  name: string;
  avatarSrc: string;
  onAction: () => void | Promise<void>;
  uid: string
  isSelf: boolean
};

export function User({ type, name, onAction, uid, isSelf }: Partial<Props>) {

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
      {
        type === 'add-friend'
          ? <React.Fragment>
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
          </React.Fragment>
          : <React.Fragment>
            <h4>{name!.length > 12 ? `${name?.slice(0, 12)}...` : name}</h4>
            <Button.Send
              label='Add'
              onSend={onAction}
            />
          </React.Fragment>
      }
    </div>
  );
}
