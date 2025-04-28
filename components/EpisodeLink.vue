<script setup lang="ts">
  const { episode } = defineProps(['episode']);
</script>

<template>
  <NuxtLink :to="`/episodes/episode-${episode.id}`" :data="episode" class="">
    {{ episode.episode }} (id: {{ episode.id }}, on air: {{ episode.air_date }})
  </NuxtLink>
</template>

<style scoped>

</style>