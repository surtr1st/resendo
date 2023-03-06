import React, { createRef } from 'react';
import { Button, Chat, Container, Input, List, Message } from './components';
import { useSocketIO } from './services';

function App() {

  const { emit } = useSocketIO()
  const message = createRef<HTMLTextAreaElement>()

  function sendMessage() {
    emit(message.current?.value)
  }

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
                onAction={() => console.log(true)}
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
              <React.Fragment>
                <Message.Sender content='A du' />
                <Message.Receiver content='A du dark wa! Vl qua ban oi' />
                <Message.Receiver content='A du dark wa! Vl qua ban oi' />
                <Message.Receiver content='A du dark wa! Vl qua ban oi' />
                <Message.Receiver content='A du dark wa! Vl qua ban oi' />
                <Message.Receiver content='A du dark wa! Vl qua ban oi' />
              </React.Fragment>
            </Chat.Body>
            <Chat.Footer>
              <Input ref={message} minRows={1} maxRows={3}>
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
