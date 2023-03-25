<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import AcceptButton from '../Button/AcceptButton.svelte';
  import CancelButton from '../Button/CancelButton.svelte';
  import CloseButton from '../Button/CloseButton.svelte';

  export let title: string = '';
  export let open: boolean;
  export const onClose: () =>
    | void
    | boolean
    | Promise<void | boolean> = () => {};
  export let content: string = '';

  function closeOnEsc(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (onClose) onClose();
    }
  }
  onMount(() => window.addEventListener('keydown', closeOnEsc));
  onDestroy(() => window.removeEventListener('keydown', closeOnEsc));
</script>

{#if open}
  <div transition:fade={{ duration: 150 }}>
    <div class="modal">
      <span class="modal-header">
        <h3>{{ title }}</h3>
        <CloseButton {onClose} />
      </span>
      <div class="modal-body">
        <p>{content}</p>
      </div>
      <div class="modal-footer">
        <AcceptButton
          label="Accept"
          onAccept={onClose}
        />
        <CancelButton
          label="Cancel"
          onCancel={onClose}
        />
      </div>
    </div>
    <div class="modal-backdrop" />
  </div>
{/if}

<style>
  @import url('./style.css');
</style>
