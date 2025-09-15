<script setup lang="ts">
import type {IPaginationData} from "~/stores/types";
const myStore = useCharactersStore();

myStore.init();

const route = useRoute();
const props = defineProps<IPaginationData>();

async function changePage(idx: number): Promise<void> {
  myStore.setCurrentPage(idx);

  await navigateTo({
    path: props.url.replace("$", String(idx)),
    query: route.query,
    replace: true,
  });
}
</script>

<template>
    <ul class="pagination pagination-sm">
      <li class="page-item">
        <span :class="['page-link', {'disabled': !props.prev}]"
              @click="changePage(1)">
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
              @click="changePage(props.pages)">
          Next
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