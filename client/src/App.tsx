import { debounce } from 'lodash';
import { useAuth, useFriend, useGroup, useUser } from './hooks';
import React, { createRef, useMemo, useEffect, useState } from 'react';
import { Group, GroupResponse, User as TUser } from './types';
import {
  Button,
  Container,
  Input,
  List,
  Message,
  Modal,
  Spacing,
  User,
} from './components';
import { Outlet, useNavigate } from 'react-router-dom';
import { Loading } from './components/Loading';

function App() {
  const [users, setUsers] = useState<Array<Omit<TUser, 'password'>>>([]);
  const [friends, setFriends] = useState<Array<Omit<TUser, 'password'>>>([]);
  const [groups, setGroups] = useState<GroupResponse[]>([])
  const [openFindPeople, setOpenFindPeople] = useState(false);
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [isClick, setIsClick] = useState(false)
  const [isCreatedLoading, setIsCreatedLoading] = useState(false)
  const [members, setMembers] = useState<string[]>([])

  const { getUsersWithoutSelf, findUserByName } = useUser();
  const { getFriendsByUserId, checkIfAdded, updateFriend } = useFriend();
  const { userId, accessToken } = useAuth();
  const { getGroupsByUser, createGroup } = useGroup()
  const navigate = useNavigate()

  const DURATION = 500;
  const groupTitle = createRef<HTMLInputElement>();
  const username = createRef<HTMLInputElement>()

  async function retrieveFriends() {
    return await getFriendsByUserId(userId, accessToken)
  }

  async function retrieveGroupsByUser() {
    return await getGroupsByUser(userId, accessToken)
  }

  const listFriends = useMemo(() => {
    retrieveFriends().then(res => setFriends(res)).catch(err => console.log(err))
  }, [friends.length])

  const listGroups = useMemo(() => {
    retrieveGroupsByUser()
      .then(res => setGroups(res))
      .catch((err) => console.log(err))
  }, [groups.length])

  function findPeople() {
    setOpenFindPeople(true)
    getUsersWithoutSelf(userId, accessToken)
      .then(async (res: TUser[]) => {
        const filteredAddedUsers = []
        for await (const user of res) {
          const isAdded = await checkIfAdded(
            userId,
            user._id as string
          )
          if (!isAdded)
            filteredAddedUsers.push(user)
        }
        setUsers(filteredAddedUsers);
      })
      .catch((err) => console.log(err));
  }

  function addFriend(filteredUserId: string) {
    updateFriend({ userId, friendId: filteredUserId, accessToken })
      .then((_) => {
        const remainUsers = users.filter(user => user._id !== filteredUserId)
        setUsers(remainUsers)
        retrieveFriends().then(res => setFriends(res)).catch(err => console.log(err))
      })
      .catch((err) => console.log(err));
  }
  const debounceAddFriend = debounce(addFriend, DURATION)

  function filterUser() {
    const value = `${username.current?.value}`.trim()
    if (value.length === 0) return
    findUserByName({ keyword: value, userId, accessToken })
      .then(res => setUsers(res))
      .catch(err => console.log(err))
  }
  const debounceFilterUser = debounce(filterUser, DURATION)

  function handleCreateGroup() {
    setIsCreatedLoading(true)
    const group: Group = {
      title: groupTitle.current?.value as string,
      owner: userId,
      users: members
    }
    createGroup(group, accessToken)
      .then(() => {
        setTimeout(() => {
          setIsCreatedLoading(false)
          setOpenCreateGroup(false)
          setMembers([])
        }, DURATION)
      }).catch(err => console.log(err))
  }
  const debounceCreateGroup = debounce(handleCreateGroup, DURATION)

  function handleAddToGroup(user: string) {
    setMembers((prev) => [...prev, user])
  }
  const debounceAddToGroup = debounce(handleAddToGroup, DURATION)

  function handleModalFindClose() {
    setIsClick(true)
    setTimeout(() => {
      setOpenFindPeople(false)
      setIsClick(false)
    }, 100)
  }

  function handleModalCreateClose() {
    setIsClick(true)
    setTimeout(() => {
      setOpenCreateGroup(false)
      setIsClick(false)
    }, 100)
  }

  useEffect(() => {
  }, [listFriends, listGroups])

  return (
    <React.Fragment>
      <Container.Grid>
        <Container.GridItem type='side'>
          <List.Box>
            <List.Item>
              <Spacing.Horizontal>
                <Button.Send
                  label='Find'
                  onSend={() => findPeople()}
                />
                <Button.Send
                  label='Create Group'
                  onSend={() => setOpenCreateGroup(true)}
                />
              </Spacing.Horizontal>
              <Modal.Customizable
                open={openFindPeople}
                title='Find People'
                onClose={handleModalFindClose}
                classAnimation={isClick ? 'hide' : 'show'}
              >
                <Modal.ContentBody>
                  <Input.Search
                    ref={username}
                    label='User Name'
                    name='room-input'
                    value={username.current?.value}
                    onClear={() => {
                      if (username.current)
                        username.current.value = ''
                    }}
                    onEnter={debounceFilterUser}
                  />
                  <Spacing.Horizontal>
                    {users &&
                      users.map((user, index) => (
                        <User
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
                    onCancel={() => handleModalFindClose()}
                  />
                </Modal.ActionFooter>
              </Modal.Customizable>
              <Modal.Customizable
                open={openCreateGroup}
                title='Create a group'
                onClose={() => setOpenCreateGroup(false)}
                classAnimation={isClick ? 'hide' : 'show'}
              >
                {
                  isCreatedLoading
                    ? <Loading.Swap />
                    : <React.Fragment>
                      <Modal.ContentBody>
                        <Input.Text
                          ref={groupTitle}
                          label='Group Title'
                          name='group-creator'
                          value={groupTitle.current?.value}
                          onClear={() => {
                            if (groupTitle.current)
                              groupTitle.current.value = ''
                          }}
                          onEnter={debounceCreateGroup}
                        />
                        <Spacing.Vertical>
                          <h3>{`Members: ${members.length}`}</h3>
                        </Spacing.Vertical>
                        <Spacing.Horizontal>
                          {friends &&
                            friends.map((user, index) => (
                              <User
                                key={index}
                                uid={user._id as string}
                                name={user.fullname}
                                onAction={() => debounceAddToGroup(user._id as string)}
                              />
                            ))}
                        </Spacing.Horizontal>
                      </Modal.ContentBody>
                      <Modal.ActionFooter>
                        <Button.Cancel
                          label='Create'
                          onCancel={debounceCreateGroup}
                        />
                        <Button.Cancel
                          label='Cancel'
                          onCancel={() => handleModalCreateClose()}
                        />
                      </Modal.ActionFooter>
                    </React.Fragment>
                }
              </Modal.Customizable>
              {friends &&
                friends.map((friend, index) => (
                  <Message.Card
                    key={index}
                    avatarSrc=''
                    opponentName={friend.fullname}
                    latestMessage=''
                    onAction={() => navigate(`/chat/${friend._id}`)}
                  />
                ))}
              {groups &&
                groups.map((group, index) => (
                  <Message.Card
                    key={index}
                    avatarSrc=''
                    opponentName={group.title}
                    latestMessage=''
                    onAction={() => navigate(`/chat/group/${group._id}`)}
                  />
                ))}
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
