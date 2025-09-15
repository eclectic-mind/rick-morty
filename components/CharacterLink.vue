<script setup lang="ts">
  const { character } = defineProps(['character']);
</script>

<template>
  <NuxtLink :to="`/characters/character-${character.id}`" :data="character" color="info">
    {{ character.name }} (id: {{ character.id }})
  </NuxtLink>
</template>

<style scoped>
li {
  margin-bottom: 1rem;
}
</style>