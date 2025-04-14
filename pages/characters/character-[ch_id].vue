<script setup>
  import { useCharactersStore } from '@/stores/charactersStore';
  const myStore = useCharactersStore();

  myStore.init();

  // const { data } = await useFetch('https://rickandmortyapi.com/api/character');
  // console.log('data', data);
  // const allCharacters = ref(data.value.results);
  // console.log('ref', allCharacters);

  const { ch_id } = useRoute().params;

  console.log('mystore', myStore);

  const findItem = () => {
    let result = {};

    myStore.items.forEach((item) => {
      if (Number(item.id) === Number(ch_id)) {
        result = item;
      }
    });

    return result;
  };

  const currentItem = findItem();

</script>

<template>
    <i class="title">Character card</i>

    <Alert color="success">
      character id from route: {{ ch_id }}<br><br>

      character from mystore: name {{ currentItem.name }}, species {{ currentItem.species }}, gender {{ currentItem.gender }}<br><br>
    </Alert>
</template>

<style scoped>

</style>