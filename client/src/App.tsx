import React from 'react';
import { Button, Chat, Container, Input, List, Message } from './components';

function App() {
  return (
    <React.Fragment>
      <Container.Grid>
        <Container.GridItem type='side'>
          <List.Box>
            <List.Item>
              {[1, 2, 3].map(() => (
                <Message.Card
                  avatarSrc=''
                  opponentName='A du dark wa'
                  latestMessage='A du dark wa! Vl qua ban oi'
                  onAction={() => console.log(true)}
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
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(() => (
                <React.Fragment>
                  <Message.Sender content='A du' />
                  <Message.Receiver content='A du dark wa! Vl qua ban oi' />
                  <Message.Receiver content='A du dark wa! Vl qua ban oi' />
                  <Message.Receiver content='A du dark wa! Vl qua ban oi' />
                  <Message.Receiver content='A du dark wa! Vl qua ban oi' />
                  <Message.Receiver content='A du dark wa! Vl qua ban oi' />
                </React.Fragment>
              ))}
            </Chat.Body>
            <Chat.Footer>
              <Input.Text>
                <Button.Send label='Send' />
              </Input.Text>
            </Chat.Footer>
          </Chat.Box>
        </Container.GridItem>
      </Container.Grid>
    </React.Fragment>
  );
}

export default App;
