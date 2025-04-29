<script setup>
  // const { data } = await useFetch('https://rickandmortyapi.com/api/location');
  // const locations = ref(data.value.results);

  import { useLocationsStore } from '@/stores/locationsStore';
  const myStore = useLocationsStore();
</script>

<template>
  <Container>

    <Row>
      <h4 class="title">Локации</h4>
      <p class="text-secondary">Всего: {{ myStore.count }}</p>

      <ul>
        <li v-for="elem in myStore.items" :key="elem.id">
          <LocationLink :location="elem" />
        </li>
      </ul>

      <nav aria-label="pagination">
        <Paginator url="/locations/page/$/" :active="myStore.currentPage" :total="myStore.pages" />
      </nav>
    </Row>

  </Container>
</template>

<style scoped>
.row {
  margin-top: 4rem;
  margin-bottom: 2rem;
}
</style>