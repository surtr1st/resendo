import { io } from 'socket.io-client';
import React, { ChangeEvent, createRef, useState } from 'react';
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
import { Message as TMessage, User as TUser } from './types';
import { useAuth, useFriend, useMessage, useRoom, useUser } from './services';

function App() {
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<TMessage[]>([]);
  const [openModalFind, setOpenModalFind] = useState(false);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<Array<Omit<TUser, 'password'>>>([]);
  const [friends, setFriends] = useState<Array<Omit<TUser, 'password'>>>([]);

  const { userId } = useAuth();
  const { createMessage } = useMessage();
  const { getUsersWithoutSelf } = useUser();
  const { getFriendsByUserId, checkIfAdded, updateFriend } = useFriend();
  const { getConversationInRoom } = useRoom();

  const socket = io('http://localhost:4000', { withCredentials: true });
  const content = createRef<HTMLTextAreaElement>();
  const title = createRef<HTMLInputElement>();

  function findPeople() {
    getUsersWithoutSelf(userId)
      .then((res) => {
        const filteredAddedUsers = res.filter(
          async (user: TUser) => await checkIfAdded(userId, user._id as string) ? {} : user
        )
        setUsers(filteredAddedUsers)
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

  function handleFindPeople(e: ChangeEvent) {
    const value = (e.target as HTMLInputElement).value;
    const filteredUsers = users.filter(
      (user) => user.fullname.indexOf(value) !== -1,
    );
    setUsername(value)
    setUsers(filteredUsers);
  }

  function handleConversationInRoom(friendId: string) {
    getConversationInRoom(userId, friendId)
      .then((res) => {
        const { _id, messages } = res;
        setRoom(_id);
        socket.emit('join-room', _id);
        setConversation(messages as TMessage[]);
      })
      .catch((err) => console.log(err));
  }

  function sendMessage() {
    const value = content.current?.value as string;
    createMessage({ content: value, userId })
      .then(() => {
        socket.emit('from-client', { message: value, room: room });
        setMessage('');
        socket.on('from-server', (data) => {
          setConversation([...conversation, data]);
        });
      })
      .catch((err) => console.log(err));
  }

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
                <Button.Create
                  label='Find'
                  onCreate={() => setOpenModalFind(!openModalFind)}
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
                    onChange={(e: ChangeEvent) => handleFindPeople(e)}
                    onClear={() => setUsername('')}
                  />
                  <Spacing.Horizontal>
                    {users &&
                      users.map((user, index) => (
                        <User
                          key={index}
                          name={user.fullname}
                          addFriend={() => addFriend(user._id as string)}
                        />
                      ))}
                  </Spacing.Horizontal>
                </Modal.ContentBody>
                <Modal.ActionFooter>
                  <Button.Send
                    label='Find'
                    onSend={() => findPeople()}
                  />
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
          <Chat.Box type='container'>
            <Chat.Header>
              <h1>Page Header</h1>
            </Chat.Header>
            <Chat.Body>
              {conversation &&
                conversation.map((message, index) => (
                  <React.Fragment>
                    {message.userId === userId ? (
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
                value={message}
                onChange={(e: ChangeEvent) => handleChatChange(e)}
              >
                <Button.Send
                  label='Send'
                  onSend={() => sendMessage()}
                />
              </Input.TextArea>
            </Chat.Footer>
          </Chat.Box>
        </Container.GridItem>
      </Container.Grid>
    </React.Fragment>
  );
}

export default App;
