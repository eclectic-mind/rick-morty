<script setup lang="ts">
  const favoritesStore = useFavoritesStore();
</script>

<template>
  <Container>
    <Row>
      <b-button
          color="danger"
          size="lg"
          @click="favoritesStore.clearAll()">
        Очистить всё
      </b-button>
    </Row>

    <Row>
      <h5 class="title">Избранные персонажи</h5>
      <p class="text-secondary">Всего: {{ favoritesStore.characters.length }}</p>

      <ul>
        <li v-for="elem in favoritesStore.characters" :key="elem.id">
          <CharacterLink :character="elem" />
          <IconBox
              icon="bi:hand-thumbs-down-fill"
              size="sm"
              @click="favoritesStore.removeFavCharacter(elem)"
          />
        </li>
      </ul>
    </Row>

    <Row>
      <h5 class="title">Избранные локации</h5>
      <p class="text-secondary">Всего: {{ favoritesStore.locations.length }}</p>

      <ul>
        <li v-for="elem in favoritesStore.locations" :key="elem.id">
          <LocationLink :location="elem" />
          <IconBox
              icon="bi:hand-thumbs-down-fill"
              size="sm"
              @click="favoritesStore.removeFavLocation(elem)"
          />
        </li>
      </ul>
    </Row>

    <Row>
      <h5 class="title">Избранные эпизоды</h5>
      <p class="text-secondary">Всего: {{ favoritesStore.episodes.length }}</p>

      <ul>
        <li v-for="elem in favoritesStore.episodes" :key="elem.id">
          <EpisodeLink :episode="elem" />
          <IconBox
              icon="bi:hand-thumbs-down-fill"
              size="sm"
              @click="favoritesStore.removeFavEpisode(elem)"
          />
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
  .icon-box {
    cursor: pointer;
    pointer-events: all;
  }
  .btn {
    width: fit-content;
  }
</style>