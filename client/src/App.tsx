import { io } from 'socket.io-client';
import React, { ChangeEvent, createRef, useEffect, useState } from 'react';
import {
  Button,
  Chat,
  Container,
  Input,
  List,
  Message,
  Modal,
  Spacing,
  User
} from './components';
import type { Message as TMessage } from './types';
import { useAuth, useMessage } from './services';
import { LoginOrRegistrate } from './views/LoginOrRegistrate';

function App() {
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<TMessage[]>([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalFind, setOpenModalFind] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');

  const { userId, isAuth } = useAuth();
  const { createMessage } = useMessage();

  const socket = io('', { withCredentials: true });
  const content = createRef<HTMLTextAreaElement>();
  const title = createRef<HTMLInputElement>();

  function joinRoom(_room: string) {
    setRoom(_room);
    socket.emit('join-room', _room);
  }

  function handleChatChange(e: ChangeEvent) {
    const value = (e.target as HTMLTextAreaElement).value;
    setMessage(value);
  }

  function handleInputChange(e: ChangeEvent) {
    const value = (e.target as HTMLInputElement).value;
    setRoomTitle(value)
  }

  function sendMessage() {
    const value = content.current?.value as string;
    createMessage({ content: value, userId })
      .then(() => {
        socket.emit('from-client', { message: value, room: room });
        setMessage('');
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    socket.on('from-server', (data) => {
      setConversation([...conversation, data]);
    });
  }, [socket]);

  return (
    <React.Fragment>
      {
        !isAuth ? <Container.Grid>
          <Container.GridItem type='side'>
            <List.Box>
              <List.Item>
                <Spacing.Horizontal>
                  <Button.Create
                    label='Create'
                    onCreate={() => setOpenModalCreate(!openModalCreate)}
                  />
                  <Button.Create
                    label='Find'
                    onCreate={() => setOpenModalFind(!openModalFind)}
                  />
                </Spacing.Horizontal>
                <Modal.Customizable open={openModalCreate} title='Create room' onClose={() => setOpenModalCreate(false)}>
                  <Modal.ContentBody>
                    <Input.Text
                      ref={title}
                      label='Room name'
                      name='room-input'
                      value={roomTitle}
                      onChange={(e: ChangeEvent) => handleInputChange(e)}
                      onClear={() => setRoomTitle('')}
                    />
                  </Modal.ContentBody>
                  <Modal.ActionFooter>
                    <Button.Create label='Create' onCreate={() => setOpenModalCreate(false)} />
                    <Button.Cancel label='Cancel' onCancel={() => setOpenModalCreate(false)} />
                  </Modal.ActionFooter>
                </Modal.Customizable>
                <Modal.Customizable open={openModalFind} title='Find People' onClose={() => setOpenModalFind(false)}>
                  <Modal.ContentBody>
                    <Input.Search
                      ref={title}
                      label='Name'
                      name='room-input'
                      value={roomTitle}
                      onChange={(e: ChangeEvent) => handleInputChange(e)}
                      onClear={() => setRoomTitle('')}
                    />
                    <Spacing.Horizontal>
                      {
                        [1, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10].map((i, index) => <User key={index} name='Adu dark wa' />)
                      }
                    </Spacing.Horizontal>
                  </Modal.ContentBody>
                  <Modal.ActionFooter>
                    <Button.Send label='Find' onSend={() => { }} />
                    <Button.Cancel label='Cancel' onCancel={() => setOpenModalFind(false)} />
                  </Modal.ActionFooter>
                </Modal.Customizable>
                <Message.Card
                  avatarSrc=''
                  opponentName='A du dark wa'
                  latestMessage='A du dark wa! Vl qua ban oi'
                  onAction={() => { }}
                />
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
          : <LoginOrRegistrate />
      }
    </React.Fragment >
  );
}

export default App;
