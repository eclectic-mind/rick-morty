<script setup lang="ts">
  import {IEpisodeItem} from "~/stores/types";

  const myStore = useEpisodesStore();
  const favStore = useFavoritesStore();

  myStore.init();

  const findItem = (array: IEpisodeItem[], id: number): IEpisodeItem => {
    let result = null;

    array.forEach((item: IEpisodeItem) => {
      if (Number(item.id) === Number(id)) {
        result = item;
      }
    });

    return result;
  };

  const checkFav = (id: number): string => {
    const inFavorites: boolean = findItem(favStore.episodes, id);

    return inFavorites ? 'pink' : 'white';
  };

  const setFav = (item: IEpisodeItem): void => {
    const inFavorites: boolean = findItem(favStore.episodes, e_id);

    if (!inFavorites) {
      favStore.addFavEpisode(item);
    } else {
      favStore.removeFavEpisode(item);
    }
  };
</script>

<template>
  <Container>

    <Row>
      <h4 class="title">Эпизоды</h4>
      <p class="text-secondary">Всего: {{ myStore.count }}</p>

      <ul>
        <li v-for="elem in myStore.items" :key="elem.id">
          <EpisodeLink :episode="elem" />
          <IconBox
              icon="bi:heart-fill"
              size="sm"
              :color="checkFav(elem.id)"
              @click="setFav(elem)"
          />
        </li>
      </ul>

      <nav aria-label="pagination">
        <Paginator url="/episodes/page/$/" :active="myStore.currentPage" :total="myStore.pages" />
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