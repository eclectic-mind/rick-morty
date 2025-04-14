<script setup>
  const { data } = await useFetch('https://rickandmortyapi.com/api/character');
  const characters = ref(data.value.results);

  const perPage = 5;
  // const total = [...characters].length;

  console.log('data', characters, typeof characters);
</script>

<template>
    <i class="title">Персонажи</i>
    <ul>
      <li v-for="elem in characters" :key="elem.id">
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