import { io } from 'socket.io-client';
import React, { ChangeEvent, createRef, useEffect, useState } from 'react';
import { Button, Chat, Container, Input, List, Message } from './components';
import type { Message as TMessage } from './types';
import { useAuth, useMessage } from './services';

function App() {

  const [room, setRoom] = useState('')
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState<TMessage[]>([])

  const { userId } = useAuth()
  const { createMessage } = useMessage()

  const socket = io('http://localhost:4000', { withCredentials: true });
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
    const value = content.current?.value as string
    createMessage({ content: value, userId })
      .then(() => {
        socket.emit('from-client', { message: value, room: room });
        setMessage('')
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    socket.on('from-server', (data) => {
      setConversation([...conversation, data])
    });
  }, [socket])

  return (
    <React.Fragment>
      <Container.Grid>
        <Container.GridItem type='side'>
          <List.Box>
            <List.Item>
              <Button.Creator label='Create Room' onCreate={() => { }} />
              <Message.Card
                avatarSrc=''
                opponentName='A du dark wa'
                latestMessage='A du dark wa! Vl qua ban oi'
                onAction={() => joinRoom('64099f4cb6e1164a191441f1')}
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
                conversation && conversation.map((message, index) => (
                  <React.Fragment>
                    {
                      message.userId === userId
                        ? <Message.Sender key={index} content={message.content} />
                        : <Message.Receiver key={index} content={message.content} />
                    }
                  </React.Fragment>
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
