<script lang="ts">
  type Types = 'container' | 'fluid';
  export let type: Types = 'container';
</script>

{#if type === 'container'}
  <div class="container">
    <slot />
  </div>
{/if}

{#if type === 'fluid'}
  <div class="fluid">
    <slot />
  </div>
{/if}

<style>
  @import url('./style.css');
</style>
