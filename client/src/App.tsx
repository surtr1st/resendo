import { debounce } from 'lodash';
import { useAuth, useFriend, useUser } from './services';
import React, { createRef, useMemo, useEffect, useState } from 'react';
import { User as TUser } from './types';
import {
  Button,
  Container,
  Input,
  List,
  Message,
  Modal,
  Spacing,
  User,
} from './components';
import { Outlet, useNavigate } from 'react-router-dom';

function App() {
  const [users, setUsers] = useState<Array<Omit<TUser, 'password'>>>([]);
  const [friends, setFriends] = useState<Array<Omit<TUser, 'password'>>>([]);
  const [openModalFind, setOpenModalFind] = useState(false);
  const [isClick, setIsClick] = useState(false)
  const { getUsersWithoutSelf, findUserByName } = useUser();
  const { getFriendsByUserId, checkIfAdded, updateFriend } = useFriend();
  const { userId, accessToken } = useAuth();
  const navigate = useNavigate()

  const DURATION = 500;
  const title = createRef<HTMLInputElement>();
  const username = createRef<HTMLInputElement>()
  async function retrieveFriends() {
    return await getFriendsByUserId(userId, accessToken)
  }

  const listFriends = useMemo(async () => {
    const data = await retrieveFriends()
    setFriends(data)
  }, [friends.length])

  function findPeople() {
    setOpenModalFind(true)
    getUsersWithoutSelf(userId, accessToken)
      .then(async (res: TUser[]) => {
        const filteredAddedUsers = []
        for await (const user of res) {
          const isAdded = await checkIfAdded(
            userId,
            user._id as string
          )
          if (!isAdded)
            filteredAddedUsers.push(user)
        }
        setUsers(filteredAddedUsers);
      })
      .catch((err) => console.log(err));
  }

  function addFriend(filteredUserId: string) {
    updateFriend({ userId, friendId: filteredUserId, accessToken })
      .then((_) => {
        const remainUsers = users.filter(user => user._id !== filteredUserId)
        setUsers(remainUsers)
        retrieveFriends().then(res => setFriends(res)).catch(err => console.log(err))
      })
      .catch((err) => console.log(err));
  }
  const debounceAddFriend = debounce(addFriend, DURATION)

  function filterUser() {
    const value = `${username.current?.value}`.trim()
    if (value.length === 0) return
    findUserByName({ keyword: value, userId, accessToken })
      .then(res => setUsers(res))
      .catch(err => console.log(err))
  }
  const debounceFilterUser = debounce(filterUser, DURATION)

  function handleModalClose() {
    setIsClick(true)
    setTimeout(() => {
      setOpenModalFind(false)
      setIsClick(false)
    }, 100)
  }

  useEffect(() => {
  }, [listFriends])

  return (
    <React.Fragment>
      <Container.Grid>
        <Container.GridItem type='side'>
          <List.Box>
            <List.Item>
              <Spacing.Horizontal>
                <Button.Send
                  label='Find'
                  onSend={() => findPeople()}
                />
              </Spacing.Horizontal>
              <Modal.Customizable
                open={openModalFind}
                title='Find People'
                onClose={handleModalClose}
                classAnimation={isClick ? 'hide' : 'show'}
              >
                <Modal.ContentBody>
                  <Input.Search
                    ref={title}
                    label='User Name'
                    name='room-input'
                    value={username.current?.value}
                    onClear={() => {
                      if (username.current)
                        username.current.value = ''
                    }}
                    onEnter={debounceFilterUser}
                  />
                  <Spacing.Horizontal>
                    {users &&
                      users.map((user, index) => (
                        <User
                          key={index}
                          uid={user._id as string}
                          name={user.fullname}
                          addFriend={() => debounceAddFriend(user._id as string)}
                          isSelf={user._id === userId}
                        />
                      ))}
                  </Spacing.Horizontal>
                </Modal.ContentBody>
                <Modal.ActionFooter>
                  <Button.Cancel
                    label='Cancel'
                    onCancel={() => handleModalClose()}
                  />
                </Modal.ActionFooter>
              </Modal.Customizable>
              {friends &&
                friends.map((friend, index) => (
                  <Message.Card
                    key={index}
                    avatarSrc=''
                    opponentName={friend.fullname}
                    latestMessage=''
                    onAction={() => navigate(`/chat/${friend._id}`)}
                  />
                ))}
            </List.Item>
          </List.Box>
        </Container.GridItem>
        <Container.GridItem type='article'>
          <Outlet />
        </Container.GridItem>
      </Container.Grid>
    </React.Fragment>
  );
}

export default App;
