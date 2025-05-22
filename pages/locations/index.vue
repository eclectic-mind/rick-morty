<script setup lang="ts">
const myStore = useLocationsStore();
const favStore = useFavoritesStore();

myStore.init();

console.log('mystore', myStore);

const findItem = (array: [], id: number) => {
  let result = null;

  array.forEach((item: any) => {
    if (Number(item.id) === Number(id)) {
      result = item;
    }
  });

  return result;
};

const checkFav = (id) => {
  const inFavorites = findItem(favStore.locations, id);

  return inFavorites ? 'pink' : 'white';
};

const setFav = (item) => {
  const inFavorites = findItem(favStore.locations, item.id);

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