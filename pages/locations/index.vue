<script setup>
  const { data } = await useFetch('https://rickandmortyapi.com/api/location');
  const locations = ref(data.value.results);

  import { useLocationsStore } from '@/stores/locationsStore';
  const locStore = useLocationsStore();
</script>

<template>
  <i class="title">Локации</i>
  <p>Всего: {{ locStore.count }}</p>
  <ul>
    <li v-for="elem in locations" :key="elem.id">
      <LocationLink :location="elem" />
    </li>
  </ul>
</template>

<style scoped>
.title {
  color: red;
}
</style>