import { io } from 'socket.io-client';
import React, { ChangeEvent, createRef, useCallback, useEffect, useState } from 'react';
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
  Spacing,
  User,
} from './components';

function App() {
  const [room, setRoom] = useState('');
  const [conversation, setConversation] = useState<MessageResponse[]>([]);
  const [openModalFind, setOpenModalFind] = useState(false);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<Array<Omit<TUser, 'password'>>>([]);
  const [friends, setFriends] = useState<Array<Omit<TUser, 'password'>>>([]);
  const [isMount, setIsMount] = useState(false)
  const [isScrollDown, setIsScrollDown] = useState(false)

  const { userId } = useAuth();
  const { createMessage } = useMessage();
  const { getUsersWithoutSelf, findUserByName } = useUser();
  const { getFriendsByUserId, checkIfAdded, updateFriend } = useFriend();
  const { getConversationInRoom } = useRoom();

  const socket = io('http://localhost:4000', { withCredentials: true, requestTimeout: 5000 });
  const content = createRef<HTMLTextAreaElement>();
  const title = createRef<HTMLInputElement>();

  function findPeople() {
    setOpenModalFind(true)
    getUsersWithoutSelf(userId)
      .then(async (res: TUser[]) => {
        const filteredAddedUsers = []
        for await (const user of res) {
          const isAdded = await checkIfAdded(userId, user._id as string)
          if (!isAdded)
            filteredAddedUsers.push(user)
        }
        setUsers(filteredAddedUsers);
      })
      .catch((err) => console.log(err));
  }

  function retrieveFriends() {
    getFriendsByUserId(userId)
      .then((res) => setFriends(res))
      .catch((err) => console.log(err));
  }

  function addFriend(filteredUserId: string) {
    updateFriend(userId, filteredUserId)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  function handleInputKeyword(e: ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
  }

  function handleFindPeople() {
    findUserByName(username, userId)
      .then(res => setUsers(res))
      .catch(err => console.log(err))
  }

  function handleConversationInRoom(friendId: string) {
    setIsMount(true)
    getConversationInRoom(userId, friendId)
      .then((res) => {
        const { _id, messages } = res;
        setRoom(_id);
        socket.emit('join-room', _id);
        setConversation(messages as MessageResponse[]);
        setIsScrollDown(true)
      })
      .catch((err) => console.log(err));
    setTimeout(() => {
      setIsScrollDown(false)
    }, 0)
  }

  const sendMessage = useCallback((content: string) => {
    createMessage({ content, userId, roomId: room })
      .then((res) => {
        socket.emit('from-client', { message: res, room });
        setIsScrollDown(!isScrollDown)
      })
      .catch((err) => console.log(err));
  }, [socket])

  const handleSendMessage = useCallback(
    () => {
      const value = content.current?.value as string;
      sendMessage(value);
      if (content.current) {
        content.current!.value = ''
      }
    },
    [sendMessage]
  );

  useEffect(() => {
    socket.on('from-server', (data) => {
      setConversation((prev) => [...prev, data]);
    });
    if (friends.length === 0)
      retrieveFriends()
  }, [socket, friends])

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
                onClose={() => setOpenModalFind(false)}
              >
                <Modal.ContentBody>
                  <Input.Search
                    ref={title}
                    label='User Name'
                    name='room-input'
                    value={username}
                    onChange={handleInputKeyword}
                    onClear={() => setUsername('')}
                    onEnter={handleFindPeople}
                  />
                  <Spacing.Horizontal>
                    {users &&
                      users.map((user, index) => (
                        <User
                          key={index}
                          uid={user._id as string}
                          name={user.fullname}
                          addFriend={() => addFriend(user._id as string)}
                          isSelf={user._id === userId}
                        />
                      ))}
                  </Spacing.Horizontal>
                </Modal.ContentBody>
                <Modal.ActionFooter>
                  <Button.Cancel
                    label='Cancel'
                    onCancel={() => setOpenModalFind(false)}
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
                      handleConversationInRoom(friend._id as string)
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
                <h1>Page Header</h1>
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
                  onEnter={handleSendMessage}
                >
                  <Button.Send
                    onSend={handleSendMessage}
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
