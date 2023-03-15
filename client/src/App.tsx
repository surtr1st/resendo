import { io } from 'socket.io-client';
import React, { ChangeEvent, createRef, useEffect, useState } from 'react';
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
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<MessageResponse[]>([]);
  const [openModalFind, setOpenModalFind] = useState(false);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<Array<Omit<TUser, 'password'>>>([]);
  const [friends, setFriends] = useState<Array<Omit<TUser, 'password'>>>([]);
  const [isMount, setIsMount] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [who, setWho] = useState('')

  const { userId } = useAuth();
  const { createMessage } = useMessage();
  const { getUsersWithoutSelf, findUserByName } = useUser();
  const { getFriendsByUserId, checkIfAdded, updateFriend } = useFriend();
  const { getConversationInRoom } = useRoom();

  const socket = io('http://localhost:4000', { withCredentials: true });
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

  function handleChatChange(e: ChangeEvent) {
    const value = (e.target as HTMLTextAreaElement).value;
    setMessage(value);
  }



  let timeout = 0
  function handleKeyDown() {
    const typingTimeout = () => setIsTyping(false)
    if (message.length > 0) {
      setIsTyping(true)
      socket.emit('incoming-message-from-client', { userId, room, isTyping })
      timeout = setTimeout(typingTimeout, 3000)
    }
    else {
      clearTimeout(timeout)
      typingTimeout()
    }
  }

  function handleInputKeyword(e: ChangeEvent) {
    const value = (e.target as HTMLInputElement).value;
    setUsername(value);
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
      })
      .catch((err) => console.log(err));
  }

  function sendMessage() {
    const value = content.current?.value as string;
    createMessage({ content: value, userId, roomId: room })
      .then((res) => {
        socket.emit('from-client', { message: res, room });
        setMessage('');
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    socket.on('from-server', (data) => {
      setConversation((prev) => [...prev, data]);
    });
    socket.on('incoming-message-from-server', (data) => {
      if (data.isTyping)
        setWho(`${data.fullname} is typing...`)
      else
        setWho('')
    });
  }, [socket]);

  return (
    <React.Fragment>
      <Container.Grid>
        <Container.GridItem type='side'>
          <List.Box>
            <List.Item>
              <Spacing.Horizontal>
                <Button.Create
                  label='Fetch'
                  onCreate={() => retrieveFriends()}
                />
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
                    onChange={(e: ChangeEvent) => handleInputKeyword(e)}
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
                    latestMessage='A du dark wa! Vl qua ban oi'
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
              <Chat.Body>
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
                <React.Fragment>
                  <span style={{ position: 'sticky', bottom: 0, left: 0, background: 'white', borderBottom: '1px solid #f2f2f2' }}>
                    {isTyping && who}
                  </span>
                </React.Fragment>
              </Chat.Body>
              <Chat.Footer>
                <Input.TextArea
                  ref={content}
                  value={message}
                  onChange={(e: ChangeEvent) => handleChatChange(e)}
                  onEnter={() => sendMessage()}
                  onKeyDown={handleKeyDown}
                >
                  <Button.Send
                    label='Send'
                    onSend={() => sendMessage()}
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
