<script setup>
  const { character } = defineProps(['character']);
</script>

<template>
  <NuxtLink :to="`/characters/character-${character.id}`" :data="character" class="">
    {{ character.name }} (id: {{ character.id }}, status: {{ character.status }}, species: {{ character.species }})
  </NuxtLink>
</template>

<style scoped>

</style>