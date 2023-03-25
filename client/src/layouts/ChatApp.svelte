<script lang="ts">
  import Grid from '../components/Container/Grid.svelte';
  import GridItem from '../components/Container/GridItem.svelte';
  import HorizontalSpacing from '../components/Spacing/HorizontalSpacing.svelte';
  import ModalBox from '../components/Modal/ModalBox.svelte';
  import ModalBody from '../components/Modal/ModalBody.svelte';
  import ModalFooter from '../components/Modal/ModalFooter.svelte';
  import CancelButton from '../components/Button/CancelButton.svelte';
  import User from '../components/User/User.svelte';
  import SendButton from '../components/Button/SendButton.svelte';
  import Friend from '../components/Message/Friend.svelte';
  import ListBox from '../components/List/ListBox.svelte';
  import ListItem from '../components/List/ListItem.svelte';
  import Search from '../components/Input/Search.svelte';
  import Chat from './Chat.svelte';
  import { useAuth, useUser, useFriend } from '../services';
  import type { User as TypeUser, InsensitiveUserInfo } from '../types';
  import { navigate, Route } from 'svelte-navigator';
  import { onMount } from 'svelte';

  const { userId, accessToken } = useAuth();
  const { getUsersWithoutSelf, findUserByName } = useUser();
  const { getFriendsByUserId, checkIfAdded, updateFriend } = useFriend();

  const DURATION = 500;
  let username = '';
  let friends: InsensitiveUserInfo[] = [];
  let users: TypeUser[] = [];
  let isOpenModalFind = false;

  async function retrieveFriends() {
    return await getFriendsByUserId(userId, accessToken);
  }
  async function findPeople() {
    isOpenModalFind = true;
    const responseUsers = await getUsersWithoutSelf(userId, accessToken);
    const filteredAddedUsers = [];
    for (const user of responseUsers) {
      const isAdded = await checkIfAdded(userId, user._id as string);
      if (!isAdded) filteredAddedUsers.push(user);
    }
    users = filteredAddedUsers;
  }

  function addFriend(filteredUserId: string) {
    updateFriend({ userId, friendId: filteredUserId, accessToken })
      .then(async () => {
        const remainUsers = users.filter((user) => user._id !== filteredUserId);
        users = remainUsers;
        friends = await retrieveFriends();
      })
      .catch((err) => console.log(err));
  }

  async function filterUser() {
    const value = username.trim();
    if (value.length === 0) return;
    users = await findUserByName({ keyword: value, userId, accessToken });
  }

  function handleModalClose() {
    isOpenModalFind = false;
    username = '';
  }

  onMount(async () => {
    friends = await retrieveFriends();
  });
</script>

<Grid>
  <GridItem type="side">
    <ListBox>
      <ListItem>
        <HorizontalSpacing>
          <SendButton
            label="Find"
            onSend={findPeople}
          />
        </HorizontalSpacing>
        <ModalBox
          open={isOpenModalFind}
          title="Find People"
          onClose={handleModalClose}
        >
          <ModalBody>
            <Search
              label="User Name"
              name="room-input"
              bind:inputValue={username}
              clearable
              onEnter={filterUser}
            />
            <HorizontalSpacing>
              {#each users as user}
                <User
                  uid={user._id}
                  name={user.fullname}
                  addFriend={() => addFriend(user._id)}
                  isSelf={user._id === userId}
                />
              {/each}
            </HorizontalSpacing>
          </ModalBody>
          <ModalFooter>
            <CancelButton
              label="Cancel"
              onCancel={handleModalClose}
            />
          </ModalFooter>
        </ModalBox>
        {#each friends as friend}
          <Friend
            opponentName={friend.fullname}
            onAction={() => navigate(`/chat/@${friend._id}`)}
          />
        {/each}
      </ListItem>
    </ListBox>
  </GridItem>
  <GridItem type="article">
    <Route
      path="/chat/@:userId"
      component={Chat}
    />
  </GridItem>
</Grid>
