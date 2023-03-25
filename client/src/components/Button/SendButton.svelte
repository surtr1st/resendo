<script lang="ts">
  export let transparent: boolean = false;
  export let label: string = '';
  export let onSend: () => void | Promise<void> = () => {};
</script>

{#if !transparent}
  <button
    on:click={onSend}
    class="send"
  >
    <div class="content">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8l-8 6l-8.054-2.685z"
        />
      </svg>
      {label}
    </div>
  </button>
{/if}

{#if transparent}
  <button
    on:click={onSend}
    class="send-transparent"
  >
    <div class="content">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8l-8 6l-8.054-2.685z"
        />
      </svg>
      {label}
    </div>
  </button>
{/if}

<style>
  @import url('./style.css');
</style>
