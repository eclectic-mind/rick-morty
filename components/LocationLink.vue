<script setup lang="ts">
  const { location } = defineProps(['location']);
</script>

<template>
  <NuxtLink :to="`/locations/location-${location.id}`" :data="location" class="">
    {{ location.name }} (id: {{ location.id }}, type: {{ location.type }})
  </NuxtLink>
</template>

<style scoped>

</style>