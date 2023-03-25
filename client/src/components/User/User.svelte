<script lang="ts">
  import { useAuth, useFriend } from '../../services';
  import SendButton from '../Button/SendButton.svelte';

  export let name: string = '';
  export let avatarSrc: string = '';
  export const addFriend: () => void | Promise<void> = () => {};
  export let uid: string = '';
  export let isSelf: boolean = false;
  let isAdded = false;

  const { checkIfAdded } = useFriend();
  const { userId } = useAuth();

  checkIfAdded(userId, uid)
    .then((res: boolean) => {
      isAdded = res;
    })
    .catch((err) => console.log(err));
</script>

<div class="user">
  <h4>{name.length > 12 ? `${name.slice(0, 12)}...` : name}</h4>
  {#if !isSelf && !isAdded}
    <SendButton
      label="Add"
      onSend={addFriend}
    />
  {:else if isSelf}
    <div class="self-label">
      <h4>Self</h4>
    </div>
  {:else}
    <div class="added">
      <h4>Added</h4>
    </div>
  {/if}
</div>

<style>
  @import url('./style.css');
</style>
