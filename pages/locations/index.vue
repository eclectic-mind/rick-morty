<script setup lang="ts">
  import type {ILocationItem} from "~/stores/types";

  const myStore = useLocationsStore();
  const favStore = useFavoritesStore();

  myStore.init();

  const findItem = (array: ILocationItem[], id: number): ILocationItem => {
    let result = null;

    array.forEach((item: ILocationItem) => {
      if (Number(item.id) === Number(id)) {
        result = item;
      }
    });

    return result;
  };

  const checkFav = (id: number): string => {
    const inFavorites: boolean = findItem(favStore.locations, id);

    return inFavorites ? 'pink' : 'white';
  };

  const setFav = (item: ILocationItem): void => {
    const inFavorites: boolean = findItem(favStore.locations, item.id);

    if (!inFavorites) {
      favStore.addFavLocation(item);
    } else {
      favStore.removeFavLocation(item);
    }
  };
</script>

<template>
  <Container>

    <Row>
      <h4 class="title">Локации</h4>
      <p class="text-secondary">Всего: {{ myStore.count }}</p>

      <ul>
        <li v-for="elem in myStore.items" :key="elem.id">
          <LocationLink :location="elem" />
          <IconBox
              icon="bi:heart-fill"
              size="sm"
              :color="checkFav(elem.id)"
              @click="setFav(elem)"
          />
        </li>
      </ul>

      <nav aria-label="pagination">
        <Pagination :active="myStore.currentPage"
                    :pages="myStore.pages"
                    :next="myStore.next"
                    :prev="myStore.prev"
                    url="/locations/page/$/"
        />
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