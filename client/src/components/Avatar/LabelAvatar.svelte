<script lang="ts">
  export let src: string = "";
  export let alt: string = "";
</script>

<div class="with-label">
  <img {src} {alt} />
</div>

<style>
  @import url("./style.css");
</style>
