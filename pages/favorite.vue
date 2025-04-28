<script setup lang="ts">
  import { useFavoritesStore } from '@/stores/favoritesStore';

  const favoritesStore = useFavoritesStore();
  favoritesStore.init();
</script>

<template>
  <Container>
    <Row>
      <h5 class="title">Избранные персонажи</h5>
      <p class="text-secondary">Всего: {{ favoritesStore.characters.length }}</p>

      <ul>
        <li v-for="elem in favoritesStore.characters" :key="elem.id">
          <CharacterLink :character="elem" />
        </li>
      </ul>
    </Row>

    <Row>
      <h5 class="title">Избранные локации</h5>
      <p class="text-secondary">Всего: {{ favoritesStore.locations.length }}</p>

      <ul>
        <li v-for="elem in favoritesStore.locations" :key="elem.id">
          <LocationLink :location="elem" />
        </li>
      </ul>
    </Row>

    <Row>
      <h5 class="title">Избранные эпизоды</h5>
      <p class="text-secondary">Всего: {{ favoritesStore.episodes.length }}</p>

      <ul>
        <li v-for="elem in favoritesStore.episodes" :key="elem.id">
          <EpisodeLink :episode="elem" />
        </li>
      </ul>
    </Row>
  </Container>
</template>

<style scoped>
  .row {
    margin-top: 4rem;
    margin-bottom: 2rem;
  }
</style>