<script lang="ts">
  export let label: string = '';
  export let name: string = '';
  export let content: string = '';
  export let onEnter: () => void = () => {};
  export let onKeyDown: () => void = () => {};
  export let onKeyUp: () => void = () => {};
  export let onChange: (e: Event) => void = () => {};

  let text: HTMLTextAreaElement;

  function handleInput(e: Event) {
    const scrollHeight = (e.target as HTMLTextAreaElement).scrollHeight;
    if (text) {
      text.style.height = 'auto';
      text.style.height = `${scrollHeight - 16}px`;
    }
  }
  function handleEnter(event: KeyboardEvent) {
    const ENTER = 'Enter';
    if (onKeyDown) onKeyDown();
    if (event.key === ENTER) {
      event.preventDefault();
      if (onEnter) onEnter();
    }
  }
</script>

<div class="chat-box">
  <div class="input-label">
    {#if label}
      <label for={name}>{label}</label>
    {/if}
  </div>
  <div class="chat-input">
    <textarea
      id={name}
      {name}
      bind:value={content}
      cols="10"
      rows="1"
      bind:this={text}
      on:change={onChange}
      on:input={handleInput}
      on:keydown={handleEnter}
      on:keyup={onKeyUp}
    />
    <slot />
  </div>
</div>

<style>
  @import url('./style.css');
</style>
