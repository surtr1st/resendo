<script lang="ts">
  export let label: string = '';
  export let onNavigate: () =>
    | void
    | Promise<void>
    | boolean
    | Promise<boolean> = () => {};
</script>

<button
  on:click={onNavigate}
  class="close"
>
  <div class="transparent-content">{label}</div>
</button>

<style>
  @import url('./style.css');
</style>
