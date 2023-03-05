import { ChatBox } from "./ChatBox"
import { UserMessage } from "./UserMessage"

export const Container = () => {
  return (
    <ChatBox.Message>
      <UserMessage />
    </ChatBox.Message>
  )
}
