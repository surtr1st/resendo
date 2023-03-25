<script lang="ts">
  import ChatBox from '../components/ChatBox/ChatBox.svelte';
  import ChatHeader from '../components/ChatBox/ChatHeader.svelte';
  import ChatFooter from '../components/ChatBox/ChatFooter.svelte';
  import ChatBody from '../components/ChatBox/ChatBody.svelte';
  import PageHeader from '../components/PageHeader/PageHeader.svelte';
  import Sender from '../components/Message/Sender.svelte';
  import Receiver from '../components/Message/Receiver.svelte';
  import TextArea from '../components/Input/TextArea.svelte';
  import SendButton from '../components/Button/SendButton.svelte';
  import { useAuth, useMessage, useRoom, useSocketIO } from '../services';
  import type { MessageResponse } from '../types';
  import { useParams } from 'svelte-navigator';
  import { onMount } from 'svelte';

  const params = useParams();
  const { userId, accessToken } = useAuth();
  const { createMessage } = useMessage();
  const { getConversationInRoom } = useRoom();
  const { socket } = useSocketIO();

  const DURATION = 250;
  let content = '';
  let fullname = '';
  let room = '';
  let conversation: MessageResponse[] = [];

  function handleConversationInRoom() {
    getConversationInRoom({
      userId,
      friendId: $params.userId,
      accessToken,
    })
      .then((res) => {
        const { _id, user1, user2, messages } = res;
        room = _id;
        socket.emit('join-room', _id);
        conversation = messages as MessageResponse[];
        switch (userId) {
          case user2._id:
            fullname = user1.fullname;
            break;
          default:
            fullname = user2.fullname;
            break;
        }
      })
      .catch((err) => console.log(err));
  }

  function sendMessage() {
    const value = content.trim();
    if (value.length === 0) return;
    createMessage({ content: value, userId, roomId: room }, accessToken)
      .then(async (res) => {
        socket.emit('from-client', { message: res, room });
      })
      .catch((err) => console.log(err));
    if (content) content = '';
  }

  $: socket.on('from-server', (data) => conversation.push(data));
  onMount(() => {
    console.log('mounted');
    handleConversationInRoom();
  });
</script>

<ChatBox type="container">
  <ChatHeader>
    <PageHeader author={fullname} />
  </ChatHeader>
  <ChatBody>
    {#each conversation as message}
      {#if message.user === userId}
        <Sender content={message.content} />
      {:else}
        <Receiver content={message.content} />
      {/if}
    {/each}
  </ChatBody>
  <ChatFooter>
    <TextArea
      bind:content
      onEnter={sendMessage}
    >
      <SendButton
        transparent
        onSend={sendMessage}
      />
    </TextArea>
  </ChatFooter>
</ChatBox>
