import React, { createRef, useState } from 'react';
import { debounce } from 'lodash';
import { Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth, useFriend, useGroup, useUser } from './hooks';
import { Group, GroupResponse, User as TUser } from './types';
import {
  Button,
  CancelIcon,
  Container,
  CreateIcon,
  FindIcon,
  Input,
  List,
  Message,
  Modal,
  PeopleTeamIcon,
  Spacing,
  User,
  Loading
} from './components';


function App() {
  const [users, setUsers] = useState<Array<Omit<TUser, 'password'>>>([]);
  const [openFindPeople, setOpenFindPeople] = useState(false);
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [isCreatedLoading, setIsCreatedLoading] = useState(false);
  const [members, setMembers] = useState<string[]>([]);

  const { getUsersWithoutSelf, findUserByName } = useUser();
  const { getFriendsByUserId, checkIfAdded, updateFriend } = useFriend();
  const { userId, accessToken } = useAuth();
  const { getGroupsByUser, createGroup } =
    useGroup();
  const navigate = useNavigate();

  const DURATION = 500;
  const groupTitle = createRef<HTMLInputElement>();
  const username = createRef<HTMLInputElement>();
  const { data: friends, isLoading: isLoadingFriends } = useQuery(
    'FriendsByUserId',
    () => getFriendsByUserId(userId, accessToken),
    {
      staleTime: 5000,
      cacheTime: 30000,
      refetchOnMount: true
    },
  );
  const { data: groups, isLoading: isLoadingGroups } = useQuery(
    'GroupsByUserId',
    () => getGroupsByUser(userId, accessToken),
    {
      staleTime: 5000,
      cacheTime: 30000,
      refetchOnMount: true
    },
  );

  function findPeople() {
    setOpenFindPeople(true);
    getUsersWithoutSelf(userId, accessToken)
      .then(async (res: TUser[]) => {
        const filteredAddedUsers = [];
        for await (const user of res) {
          const isAdded = await checkIfAdded(userId, user._id as string);
          if (!isAdded) filteredAddedUsers.push(user);
        }
        setUsers(filteredAddedUsers);
      })
      .catch((err) => console.log(err));
  }

  function addFriend(filteredUserId: string) {
    updateFriend({ userId, friendId: filteredUserId, accessToken })
      .then((_) => {
        const remainUsers = users.filter((user) => user._id !== filteredUserId);
        setUsers(remainUsers);
      })
      .catch((err) => console.log(err));
  }
  const debounceAddFriend = debounce(addFriend, DURATION);

  function filterUser() {
    const value = `${username.current?.value}`.trim();
    if (value.length === 0) return;
    findUserByName({ keyword: value, userId, accessToken })
      .then((res) => setUsers(res))
      .catch((err) => console.log(err));
  }
  const debounceFilterUser = debounce(filterUser, DURATION);

  function handleCreateGroup() {
    setIsCreatedLoading(true);
    const group: Group = {
      title: groupTitle.current!.value,
      owner: userId,
      users: members,
    };
    createGroup(group, accessToken)
      .then(() => {
        setTimeout(() => {
          setIsCreatedLoading(false);
          setOpenCreateGroup(false);
          setMembers([]);
        }, DURATION);
      })
      .catch((err) => console.log(err));
  }
  const debounceCreateGroup = debounce(handleCreateGroup, DURATION);

  function handleAddToGroup(user: string) {
    if (members.length === 0) {
      setMembers((prev) => [...prev, user]);
      return;
    }
    if (!members.includes(user)) {
      setMembers((prev) => [...prev, user]);
      return;
    }
    setMembers((prev) => prev.filter((member) => member !== user));
  }
  const debounceAddToGroup = debounce(handleAddToGroup, DURATION);

  return (
    <React.Fragment>
      <Container.Grid>
        <Container.GridItem type='side'>
          <Spacing.Horizontal floated>
            <Button.Send
              label='Find'
              icon={<FindIcon />}
              onSend={() => findPeople()}
            />
            <Button.Send
              label='Create Group'
              icon={<CreateIcon />}
              onSend={() => setOpenCreateGroup(true)}
            />
          </Spacing.Horizontal>
          <Modal.Customizable
            open={openFindPeople}
            title='Find People'
            onClose={() => setOpenFindPeople(false)}
          >
            <Modal.ContentBody>
              <Input.Search
                ref={username}
                label='User Name'
                name='room-input'
                value={username.current?.value}
                onClear={() => {
                  if (username.current) username.current.value = '';
                }}
                onEnter={debounceFilterUser}
              />
              <Spacing.Horizontal>
                {users &&
                  users.map((user, index) => (
                    <User.StrangerList
                      key={index}
                      uid={user._id as string}
                      name={user.fullname}
                      onAction={() => debounceAddFriend(user._id as string)}
                      isSelf={user._id === userId}
                    />
                  ))}
              </Spacing.Horizontal>
            </Modal.ContentBody>
            <Modal.ActionFooter>
              <Button.Cancel
                label='Cancel'
                icon={<CancelIcon />}
                onCancel={() => setOpenFindPeople(false)}
              />
            </Modal.ActionFooter>
          </Modal.Customizable>
          <Modal.Customizable
            open={openCreateGroup}
            title='Create a group'
            onClose={() => setOpenCreateGroup(false)}
          >
            {isCreatedLoading ? (
              <Loading.Swap />
            ) : (
              <React.Fragment>
                <Modal.ContentBody>
                  <Input.Text
                    ref={groupTitle}
                    label='Group Title'
                    name='group-creator'
                    value={groupTitle.current?.value}
                    onClear={() => {
                      if (groupTitle.current) groupTitle.current.value = '';
                    }}
                    onEnter={debounceCreateGroup}
                  />
                  <Spacing.Vertical>
                    <h3
                      style={{
                        background: 'var(--darker-bg)',
                        borderRadius: '10px',
                        padding: '.5rem',
                        display: 'flex',
                        gap: '.2rem',
                      }}
                    >
                      <PeopleTeamIcon />
                      {`Members: ${members.length}`}
                    </h3>
                  </Spacing.Vertical>
                  <Spacing.Horizontal>
                    {isLoadingFriends ? (
                      <Loading.Swap />
                    ) : (
                      friends.map(
                        (user: Omit<TUser, 'password'>, index: number) => (
                          <User.FriendList
                            key={index}
                            uid={user._id as string}
                            name={user.fullname}
                            onAction={() =>
                              debounceAddToGroup(user._id as string)
                            }
                            temporaryDisabled={members.includes(
                              user._id as string,
                            )}
                          />
                        ),
                      )
                    )}
                  </Spacing.Horizontal>
                </Modal.ContentBody>
                <Modal.ActionFooter>
                  <Button.Accept
                    label='Create'
                    icon={<CreateIcon />}
                    onAccept={debounceCreateGroup}
                  />
                  <Button.Cancel
                    label='Cancel'
                    icon={<CancelIcon />}
                    onCancel={() => setOpenCreateGroup(false)}
                  />
                </Modal.ActionFooter>
              </React.Fragment>
            )}
          </Modal.Customizable>
          <List.Box>
            <List.Item>
              <Message.Card
                avatarSrc=''
                opponentName=''
                latestMessage=''
                onAction={() => { }}
                invisible
              />
              {
                isLoadingFriends || isLoadingGroups
                  ? <Loading.FlipSquare partialStyle />
                  : <React.Fragment>
                    {
                      friends.map(
                        (friend: Omit<TUser, 'password'>, index: number) => (
                          <Message.Card
                            key={index}
                            avatarSrc=''
                            opponentName={friend.fullname}
                            latestMessage={friend.lastMessage as string}
                            onAction={() => navigate(`/chat/${friend._id}`)}
                          />
                        ),
                      )
                    }
                    {
                      groups.map((group: GroupResponse, index: number) => (
                        <Message.Card
                          key={index}
                          avatarSrc=''
                          opponentName={group.title}
                          latestMessage={`${group.lastMessage.sender && '@'}${group.lastMessage.sender
                            }${group.lastMessage.sender && ': '}${group.lastMessage.content
                            }`}
                          onAction={() => navigate(`/chat/group/${group._id}`)}
                        />
                      ))
                    }
                  </React.Fragment>
              }
            </List.Item>
          </List.Box>
        </Container.GridItem>
        <Container.GridItem type='article'>
          <Outlet />
        </Container.GridItem>
      </Container.Grid>
    </React.Fragment>
  );
}

export default App;
