import './style.css';
import { Button } from '../Button';
import { useAuth, useFriend } from '../../hooks';
import { useState } from 'react';

type Props = {
  name: string;
  avatarSrc: string;
  onAction: () => void | Promise<void>;
  uid: string;
  isSelf: boolean;
  temporaryDisabled: boolean;
};

export const User = {
  StrangerList: ({ name, onAction, uid, isSelf }: Partial<Props>) => {
    const [isAdded, setIsAdded] = useState(false);

    const { checkIfAdded: isFriendAdded } = useFriend();
    const { userId } = useAuth();

    isFriendAdded(userId, uid as string)
      .then((res) => setIsAdded(res))
      .catch((err) => console.log(err));
    return (
      <div className='user'>
        <h4>{name!.length > 12 ? `${name?.slice(0, 12)}...` : name}</h4>
        {!isSelf && !isAdded ? (
          <Button.Send
            label='Add'
            onSend={onAction}
          />
        ) : (
          <div className='added'>
            <h4>Added</h4>
          </div>
        )}
        {isSelf && (
          <div className='self-label'>
            <h4>Self</h4>
          </div>
        )}
      </div>
    );
  },
  FriendList: ({ name, onAction, temporaryDisabled }: Partial<Props>) => (
    <div className='user'>
      <h4>{name!.length > 12 ? `${name?.slice(0, 12)}...` : name}</h4>
      <Button.Send
        label={temporaryDisabled ? 'Added' : 'Add'}
        onSend={onAction}
      />
    </div>
  ),
};
