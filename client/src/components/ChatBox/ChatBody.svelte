<script lang="ts">
  import { onMount } from 'svelte';

  let chatBody: HTMLDivElement;

  function onScrollDown() {
    chatBody.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }

  onMount(() => {
    onScrollDown();
  });
</script>

<div class="inner-box">
  <div
    bind:this={chatBody}
    class="chat"
  >
    <slot />
  </div>
</div>
