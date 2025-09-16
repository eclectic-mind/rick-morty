<script setup lang="ts">
import type {IPaginationData} from "~/stores/types";
const characterStore = useCharactersStore();
const locationsStore = useLocationsStore();
const episodesStore = useEpisodesStore();
const props = defineProps<IPaginationData>();

characterStore.init();
locationsStore.init();
episodesStore.init();

async function changePage(id: number): Promise<void> {
  if (props.type === 'characters') {
    characterStore.setCurrentPage(id);
  } else if (props.type === 'episodes') {
    episodesStore.setCurrentPage(id);
  } else if (props.type === 'locations') {
    locationsStore.setCurrentPage(id);
  }

  await navigateTo({
    path: props.url,
    query: {
      page: id
    },
    replace: true
  });
}
</script>

<template>
    <ul class="pagination pagination-sm">
      <li class="page-item">
        <span class="page-link"
              @click="changePage(1)">
          First
        </span>
      </li>

      <li class="page-item">
        <span :class="['page-link', {'disabled': props.prev === null}]"
              @click="changePage(props.active - 1)">
          Previous
        </span>
      </li>

      <li class="page-item" v-for="item in props.pages" :key="item">
        <span :class="['page-link', {'active': item === props.active}]"
              @click="changePage(item)">
          {{ item }}
        </span>
      </li>

      <li class="page-item">
        <span :class="['page-link', {'disabled': props.next === null}]"
              @click="changePage(props.active + 1)">
          Next
        </span>
      </li>

      <li class="page-item">
        <span class="page-link"
              @click="changePage(props.pages)">
          Last
        </span>
      </li>
    </ul>
</template>

<style scoped>
.page-link {
  cursor: pointer;

  &:hover {
    color: red;
  }

  &.disabled {
    color: grey;
    pointer-events: none;
  }
}
</style>