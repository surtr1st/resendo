<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import CloseButton from '../Button/CloseButton.svelte';

  export let title: string = '';
  export let open: boolean;
  export let onClose: () => void | boolean | Promise<void | boolean> = () => {};

  function closeOnEsc(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }
  onMount(() => window.addEventListener('keydown', closeOnEsc));
  onDestroy(() => window.removeEventListener('keydown', closeOnEsc));
</script>

{#if open}
  <div transition:fade={{ duration: 150 }}>
    <div
      class="modal"
      on:click|stopPropagation
      on:keydown={() => {}}
    >
      <span class="modal-header">
        <h3>{title}</h3>
        <CloseButton {onClose} />
      </span>
      <slot />
    </div>
    <div class="modal-backdrop" />
  </div>
{/if}

<style>
  @import url('./style.css');
</style>
