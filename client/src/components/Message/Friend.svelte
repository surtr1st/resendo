<script lang="ts">
  export let avatarSrc: string = '';
  export let opponentName: string = '';
  export let latestMessage: string = '';
  export let onAction: () => void = () => {};
</script>

<div
  class="card"
  on:click={onAction}
  on:keydown={() => {}}
>
  <div class="card-image">
    <img
      src={avatarSrc}
      alt="#"
    />
  </div>
  <span class="card-detail">
    <h3>
      {opponentName.length > 12
        ? `${opponentName.substring(0, 12)}...`
        : opponentName}
    </h3>
    <h5>
      {latestMessage.length > 10
        ? `${latestMessage.slice(0, 10)}...`
        : latestMessage}
    </h5>
  </span>
</div>

<style>
  @import url('./style.css');
</style>
