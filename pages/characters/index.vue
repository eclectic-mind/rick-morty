<script setup lang="ts">
  import type {ICharacterItem} from "~/stores/types";

  const myStore = useCharactersStore();
  const favStore = useFavoritesStore();

  myStore.init();

  const findItem = (array: ICharacterItem[], id: number): ICharacterItem => {
    let result = null;

    array.forEach((item: ICharacterItem) => {
      if (Number(item.id) === Number(id)) {
        result = item;
      }
    });

    return result;
  };

  const checkFav = (id: number): string => {
    const inFavorites: boolean = findItem(favStore.characters, id);

    return inFavorites ? 'pink' : 'white';
  };

  const setFav = (item: ICharacterItem): void => {
    const inFavorites: boolean = findItem(favStore.characters, item.id);

    if (!inFavorites) {
      favStore.addFavCharacter(item);
    } else {
      favStore.removeFavCharacter(item);
    }
  };
</script>

<template>
  <Container>

    <Row>
        <h4 class="title">Персонажи</h4>
        <p class="text-secondary">Всего: {{ myStore.count }}</p>

        <ul>
          <li v-for="elem in myStore.items" :key="elem.id">
            <CharacterLink :character="elem" />
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
                      url="/characters"
                      type="characters"
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
li {
  margin: 1rem 1rem 1rem;
}
.icon-box {
  cursor: pointer;
  pointer-events: all;
}
</style>