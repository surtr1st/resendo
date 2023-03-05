import { ChatBox, Message } from "./components";

function App() {
  return (
    <ChatBox>
      <Message.Sender />
      <Message.Receiver />
    </ChatBox>
  )
}

export default App;
