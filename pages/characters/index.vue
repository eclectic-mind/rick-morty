<script setup>
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
    <i class="title">Персонажи</i>
    <ul>
      <li v-for="elem in myStore.items" :key="elem.id">
        <CharacterLink :character="elem" />
      </li>
    </ul>
    <Pagination url="/characters/page/$`" :active="1" :total="50" />
</template>

<style scoped>
.title {
  color: red;
}
</style>