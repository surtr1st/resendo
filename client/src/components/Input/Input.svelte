<script lang="ts">
  import ClearButton from '../Button/ClearButton.svelte';

  type Types = 'text' | 'password' | 'email';
  export let type: Types = 'text';
  export let label: string = '';
  export let name: string = '';
  export let inputValue: string = '';
  export let clearable: boolean = false;
  export let onEnter: () => void = () => {};
  export let onKeyDown: () => void = () => {};
  export let onKeyUp: () => void = () => {};
  export let onChange: (e: Event) => void = () => {};
  export let onClear: () => void = () => {};

  function handleEnter(event: KeyboardEvent) {
    const ENTER = 'Enter';
    if (event.key === ENTER) {
      event.preventDefault();
      onEnter();
    }
  }
</script>

<div class="chat-box-input">
  <div class="input-label">
    {#if label}
      <label for={name}>{label}</label>
    {/if}
  </div>
  <div class="chat-input">
    {#if type === 'text'}
      <input
        id={name}
        {name}
        bind:value={inputValue}
        class="text"
        on:change={onChange}
        on:keydown={handleEnter}
      />
    {/if}
    {#if type === 'email'}
      <input
        id={name}
        {name}
        bind:value={inputValue}
        class="text"
        on:change={onChange}
        on:keydown={handleEnter}
      />
    {/if}
    {#if type === 'password'}
      <input
        type="password"
        id={name}
        {name}
        bind:value={inputValue}
        class="text"
        on:change={onChange}
        on:keydown={handleEnter}
      />
    {/if}
    <slot />
    {#if clearable}
      <ClearButton {onClear} />
    {/if}
  </div>
</div>

<style>
  @import url('./style.css');
</style>
