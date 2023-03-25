<script lang="ts">
  import LabelAvatar from '../Avatar/LabelAvatar.svelte';
  import NoneLabelAvatar from '../Avatar/NoneLabelAvatar.svelte';

  export let author: string = '';
  export let avatarSrc: string = '';
</script>

<template>
  <div class="page-header">
    {#if avatarSrc}
      <LabelAvatar
        src={avatarSrc}
        alt={avatarSrc}
      />
    {/if}
    {#if !avatarSrc}
      <NoneLabelAvatar name="T" />
    {/if}
    <h2>{author}</h2>
  </div>
</template>

<style>
  @import url('./style.css');
</style>
