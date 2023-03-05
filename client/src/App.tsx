import React from "react";
import { ChatBox, Message } from "./components";

function App() {
  const ct = `
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
`
  return (
    <ChatBox type="container">
      {
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(() => (
          <React.Fragment>
            <Message.Sender content={ct} />
            <Message.Receiver content="A du dark wa! Vl qua ban oi" />
            <Message.Receiver content="A du dark wa! Vl qua ban oi" />
            <Message.Receiver content="A du dark wa! Vl qua ban oi" />
            <Message.Receiver content="A du dark wa! Vl qua ban oi" />
            <Message.Receiver content="A du dark wa! Vl qua ban oi" />
          </React.Fragment>
        ))
      }
    </ChatBox>
  )
}

export default App;
