<script setup lang="ts">
  import { useEpisodesStore } from '@/stores/episodesStore';
  const myStore = useEpisodesStore();

  myStore.init();

  console.log('mystore', myStore);
</script>

<template>
  <Container>

    <Row>
      <h4 class="title">Эпизоды</h4>
      <p class="text-secondary">Всего: {{ myStore.count }}</p>

      <ul>
        <li v-for="elem in myStore.items" :key="elem.id">
          <EpisodeLink :episode="elem" />
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