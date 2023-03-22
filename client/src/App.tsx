import { io } from 'socket.io-client';
import { debounce } from 'lodash';
import React, { createRef, useEffect, useMemo, useState } from 'react';
import { MessageResponse, User as TUser } from './types';
import { useAuth, useFriend, useMessage, useRoom, useUser } from './services';
import {
  Button,
  Chat,
  Container,
  Input,
  List,
  Message,
  Modal,
  PageHeader,
  Spacing,
  User,
} from './components';

function App() {
  const [room, setRoom] = useState('');
  const [conversation, setConversation] = useState<MessageResponse[]>([]);
  const [openModalFind, setOpenModalFind] = useState(false);
  const [fullname, setFullname] = useState('');
  const [users, setUsers] = useState<Array<Omit<TUser, 'password'>>>([]);
  const [friends, setFriends] = useState<Array<Omit<TUser, 'password'>>>([]);
  const [isMount, setIsMount] = useState(false)
  const [isScrollDown, setIsScrollDown] = useState(false)
  const [isClick, setIsClick] = useState(false)

  const { userId, accessToken } = useAuth();
  const { createMessage } = useMessage();
  const { getUsersWithoutSelf, findUserByName } = useUser();
  const { getFriendsByUserId, checkIfAdded, updateFriend } = useFriend();
  const { getConversationInRoom } = useRoom();

  const socket = io('http://localhost:4000', {
    withCredentials: true,
    requestTimeout: 5000,
    reconnectionAttempts: 3,
  });
  const content = createRef<HTMLTextAreaElement>();
  const title = createRef<HTMLInputElement>();
  const username = createRef<HTMLInputElement>()
  const DURATION = 500;

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

  function handleConversationInRoom(friendId: string) {
    setIsMount(true)
    getConversationInRoom({ userId, friendId, accessToken })
      .then((res) => {
        const { _id, user1, user2, messages } = res;
        setRoom(_id);
        socket.emit('join-room', _id);
        setConversation(messages as MessageResponse[]);
        setIsScrollDown(true)
        switch (userId) {
          case user2._id:
            setFullname(user1.fullname)
            break
          default:
            setFullname(user2.fullname)
            break
        }
      })
      .catch((err) => console.log(err));
    setTimeout(() => {
      setIsScrollDown(false)
    }, 0)
  }
  const debounceMessagesInRoom = debounce(handleConversationInRoom, DURATION)

  function sendMessage() {
    const value = `${content.current?.value}`.trim();
    if (value.length === 0) return
    createMessage({ content: value, userId, roomId: room }, accessToken)
      .then((res) => {
        socket.emit('from-client', { message: res, room });
        setIsScrollDown(!isScrollDown)
      })
      .catch((err) => console.log(err));
    if (content.current)
      content.current!.value = ''
  }

  function handleModalClose() {
    setIsClick(true)
    setTimeout(() => {
      setOpenModalFind(false)
      setIsClick(false)
    }, 100)
  }

  useEffect(() => {
  }, [listFriends])

  useEffect(() => {
    setIsScrollDown(!isScrollDown)
  }, [conversation.length])

  useEffect(() => {
    socket.on('from-server', (data) => setConversation((prev) => [...prev, data]))
    return () => {
      socket.off('from-server', (data) => setConversation((prev) => [...prev, data]))
    }
  }, [socket])

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
                    onAction={() =>
                      debounceMessagesInRoom(friend._id as string)
                    }
                  />
                ))}
            </List.Item>
          </List.Box>
        </Container.GridItem>
        <Container.GridItem type='article'>
          {
            isMount && <Chat.Box type='container'>
              <Chat.Header>
                <PageHeader author={fullname} avatarSrc='' />
              </Chat.Header>
              <Chat.Body triggerScrollDown={isScrollDown}>
                {conversation &&
                  conversation.map((message, index) => (
                    <React.Fragment key={index}>
                      {message.user === userId ? (
                        <Message.Sender
                          key={index}
                          content={message.content}
                        />
                      ) : (
                        <Message.Receiver
                          key={index}
                          content={message.content}
                        />
                      )}
                    </React.Fragment>
                  ))}
              </Chat.Body>
              <Chat.Footer>
                <Input.TextArea
                  ref={content}
                  value={content.current?.value}
                  onEnter={sendMessage}
                >
                  <Button.Send
                    onSend={sendMessage}
                  />
                </Input.TextArea>
              </Chat.Footer>
            </Chat.Box>
          }
        </Container.GridItem>
      </Container.Grid>
    </React.Fragment>
  );
}

export default App;
