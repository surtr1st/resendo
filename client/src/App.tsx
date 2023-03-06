import { io } from 'socket.io-client';
import React, { ChangeEvent, createRef, useEffect, useState } from 'react';
import { Button, Chat, Container, Input, List, Message } from './components';

function App() {

  const [room, setRoom] = useState('')
  const [message, setMessage] = useState('')
  const [senders, setSenders] = useState<string[]>([])
  const [receivers, setReceivers] = useState<string[]>([])

  const socket = io('http://localhost:4000');
  const content = createRef<HTMLTextAreaElement>()

  function joinRoom(_room: string) {
    setRoom(_room)
    socket.emit('join-room', _room)
  }

  function handleChange(e: ChangeEvent) {
    const value = (e.target as HTMLTextAreaElement).value
    setMessage(value)
  }

  function sendMessage() {
    const value = content.current?.value
    socket.emit('from-client', { message: value, room: room });
    setSenders([...senders, value as string])
    setMessage('')
  }

  useEffect(() => {
    socket.on('from-server', (data) => {
      setReceivers([...receivers, `${data.message}`])
    });
  }, [socket])

  return (
    <React.Fragment>
      <Container.Grid>
        <Container.GridItem type='side'>
          <List.Box>
            <List.Item>
              <Message.Card
                avatarSrc=''
                opponentName='A du dark wa'
                latestMessage='A du dark wa! Vl qua ban oi'
                onAction={() => joinRoom('test')}
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
              {
                receivers && receivers.map((message, index) => (
                  <Message.Receiver key={index} content={message} />
                ))
              }
              {
                senders && senders.map((message, index) => (
                  <Message.Sender key={index} content={message} />
                ))
              }
            </Chat.Body>
            <Chat.Footer>
              <Input ref={content} minRows={1} maxRows={3} value={message} onChange={(e: ChangeEvent) => handleChange(e)}>
                <Button.Send label='Send' onSend={() => sendMessage()} />
              </Input>
            </Chat.Footer>
          </Chat.Box>
        </Container.GridItem>
      </Container.Grid>
    </React.Fragment>
  );
}

export default App;
