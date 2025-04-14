<script setup lang="ts">
  import { useLocationsStore } from '@/stores/locationsStore';
  const myStore = useLocationsStore();

  const { l_id } = useRoute().params;
  console.log('use route params - loc', useRoute().params, 'name', useRoute().params.name);
</script>

<template>
    <i class="title">Location card</i>

    <Alert color="success">
      location id from route: {{ l_id }}<br>
      data from location store: {{ myStore.count }}
    </Alert>
</template>

<style scoped>

</style>