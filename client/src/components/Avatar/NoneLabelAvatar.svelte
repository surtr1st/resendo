<script lang="ts">
  export let name: string = '';
</script>

<div class="without-label">
  <div
    class="none-label"
    title={name}
  >
    <h3>{name.slice(0, 1).toUpperCase()}</h3>
  </div>
</div>

<style>
  @import url('./style.css');
</style>
