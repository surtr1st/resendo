import { ChatBox } from './ChatBox';
import { MessageBox } from './MessageBox';

export const Container = () => {
  return (
    <ChatBox>
      <MessageBox.Sender />
      <MessageBox.Receiver />
    </ChatBox>
  );
};
