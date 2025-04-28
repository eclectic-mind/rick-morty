<script setup lang="ts">
  // const { data } = await useFetch('https://rickandmortyapi.com/api/character');
  // const characters = ref(data.value.results);

  //  perPage = 5;
  // const total = [...characters].length;

  // console.log('data', characters, typeof characters);

  import { useCharactersStore } from '@/stores/charactersStore';
  const myStore = useCharactersStore();

  myStore.init();
</script>

<template>
  <Container>

    <Row>
        <h4 class="title">Персонажи</h4>
        <p class="text-secondary">Всего: {{ myStore.count }}</p>

        <ul>
          <li v-for="elem in myStore.items" :key="elem.id">
            <CharacterLink :character="elem" />
          </li>
        </ul>

        <nav aria-label="pagination">
          <Paginator url="/characters/page/$/" :active="myStore.currentPage" :total="myStore.pages" />
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