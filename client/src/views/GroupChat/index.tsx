import { io } from 'socket.io-client';
import { debounce } from 'lodash';
import React, { createRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessageResponse } from '../../types';
import { useAuth, useGroup, useMessage } from '../../hooks';
import {
  Button,
  Chat,
  Input,
  Message,
  PageHeader,
  SendIcon,
  Loading
} from '../../components';

export function GroupChat() {
  const [conversation, setConversation] = useState<MessageResponse[]>([]);
  const [title, setTitle] = useState('');
  const [isScrollDown, setIsScrollDown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const { userId, accessToken } = useAuth();
  const { createMessage, uploadMedia } = useMessage();
  const { getGroupById } = useGroup();

  const socket = io('http://localhost:4000', {
    auth: {
      token: '@AuthGroupToken',
    },
  });

  const content = createRef<HTMLTextAreaElement>();
  const files = createRef<HTMLInputElement>();

  const DURATION = 250;

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
    getGroupById(id as string, accessToken)
      .then((res) => {
        const { _id, title, messages } = res;
        sessionStorage.setItem('Group-Id', _id);
        socket.emit('join-room', _id);
        setConversation(messages as MessageResponse[]);
        setIsScrollDown(true);
        setTitle(title);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
    setTimeout(() => {
      setIsScrollDown(false);
    }, 0);
  }
  const debounceMessagesInRoom = debounce(handleConversationInRoom, DURATION);

  function sendMessage() {
    const value = `${content.current?.value}`.trim();
    const groupId = sessionStorage.getItem('Group-Id') as string;
    if (value.length === 0) return;
    createMessage({ content: value, userId, groupId }, accessToken)
      .then((res) => {
        socket.emit('from-client', { message: res, room: groupId });
        setIsScrollDown(!isScrollDown);
      })
      .catch((err) => console.log(err));
    if (content.current) content.current!.value = '';
  }

  function handleUploadFiles() {
    const fileList = files.current?.files;
    const groupId = sessionStorage.getItem('Group-Id') as string;
    if (fileList)
      uploadMedia({ userId, groupId }, fileList[0], accessToken)
        .then((res) => {
          socket.emit('from-client', { message: res, room: groupId });
          setIsScrollDown(!isScrollDown);
        })
        .catch((err) => console.log(err));
  }
  const debounceUploadFile = debounce(handleUploadFiles, DURATION);

  useEffect(() => {
    debounceMessagesInRoom();
  }, [id]);

  useEffect(() => {
    setIsScrollDown(!isScrollDown);
  }, [conversation.length]);

  useEffect(() => {
    onReceive();
    return () => {
      onAbort();
    };
  }, []);

  return (
    <React.Fragment>
      {isLoading ? (
        <Loading.Swap />
      ) : (
        <Chat.Box type='container'>
          <Chat.Header>
            <PageHeader
              author={title}
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
