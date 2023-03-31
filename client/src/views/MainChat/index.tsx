import React, { createRef, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useParams } from 'react-router-dom';
import { MessageResponse } from '../../types';
import { DEBOUNCE_DURATION } from '../../helpers';
import { useAuth, useMessage, useRoom } from '../../hooks';
import {
  Button,
  Chat,
  Input,
  Message,
  PageHeader,
  Loading,
  SendIcon,
} from '../../components';
import { useSocketIO } from '../../socket';

export function MainChat() {
  const [conversation, setConversation] = useState<MessageResponse[]>([]);
  const [fullname, setFullname] = useState('');
  const [isScrollDown, setIsScrollDown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const socket = useSocketIO()
  const { id } = useParams();
  const { userId, accessToken } = useAuth();
  const { createMessage, uploadMedia } = useMessage();
  const { getConversationInRoom } = useRoom();

  const content = createRef<HTMLTextAreaElement>();
  const files = createRef<HTMLInputElement>();

  function onReceive() {
    socket.on('from-server', (data) => {
      setConversation((prev) => [...prev, data]);
    });
  }

  function onAbort() {
    socket.off('from-server', (data) => {
      setConversation((prev) => [...prev, data]);
    });
  }

  function handleConversationInRoom() {
    setIsLoading(true);
    getConversationInRoom({ userId, friendId: id as string, accessToken })
      .then((res) => {
        const { _id, user1, user2, messages } = res;
        sessionStorage.setItem('Room-Id', _id);
        socket.emit('join-room', _id);
        setConversation(messages as MessageResponse[]);
        switch (userId) {
          case user2._id:
            setFullname(user1.fullname);
            break;
          default:
            setFullname(user2.fullname);
            break;
        }
        setIsLoading(false);
        setIsScrollDown(!isScrollDown);
      })
      .catch((err) => console.log(err));
  }
  const debounceMessagesInRoom = debounce(handleConversationInRoom, DEBOUNCE_DURATION);

  function sendMessage() {
    const value = `${content.current?.value}`.trim();
    const roomId = sessionStorage.getItem('Room-Id') as string;
    if (value.length === 0) return;
    createMessage({ content: value, userId, roomId }, accessToken)
      .then((res) => {
        socket.emit('from-client', { message: res, room: roomId });
        setIsScrollDown(!isScrollDown);
      })
      .catch((err) => console.log(err));
    if (content.current) content.current!.value = '';
  }

  function handleUploadFiles() {
    const fileList = files.current?.files;
    const roomId = sessionStorage.getItem('Room-Id') as string;
    if (fileList)
      uploadMedia({ userId, roomId }, fileList[0], accessToken)
        .then((res) => {
          socket.emit('from-client', { message: res, room: roomId });
          setIsScrollDown(!isScrollDown);
        })
        .catch((err) => console.log(err));
  }
  const debounceUploadFile = debounce(handleUploadFiles, DEBOUNCE_DURATION);

  useEffect(() => {
    debounceMessagesInRoom();
    onReceive();
    return () => {
      onAbort();
    };
  }, [id]);

  useEffect(() => {
    setIsScrollDown(!isScrollDown);
  }, [conversation.length]);

  return (
    <React.Fragment>
      {isLoading ? (
        <Loading.Swap />
      ) : (
        <Chat.Box type='container'>
          <Chat.Header>
            <PageHeader
              author={fullname}
              avatarSrc=''
            />
          </Chat.Header>
          <Chat.Body triggerScrollDown={isScrollDown}>
            {conversation &&
              conversation.map((message, index) => (
                <React.Fragment key={index}>
                  {message.user === userId ? (
                    <Message.Sender
                      key={index}
                      content={message.content}
                      mediaSrc={message.media}
                    />
                  ) : (
                    <Message.Receiver
                      key={index}
                      author={message.author}
                      content={message.content}
                      mediaSrc={message.media}
                    />
                  )}
                </React.Fragment>
              ))}
          </Chat.Body>
          <Chat.Footer>
            <Input.TextArea
              ref={content}
              value={content.current?.value}
              onEnter={sendMessage}
            >
              <div>
                <Input.File
                  name='upload-media'
                  ref={files}
                  onChange={debounceUploadFile}
                />
              </div>
              <Button.Send
                transparent
                icon={<SendIcon />}
                onSend={sendMessage}
              />
            </Input.TextArea>
          </Chat.Footer>
        </Chat.Box>
      )}
    </React.Fragment>
  );
}
