import { ChatBox } from './ChatBox';
import { Message } from './Message';

export const Container = () => {
  return (
    <ChatBox>
      <Message.Sender />
      <Message.Receiver />
    </ChatBox>
  );
};
