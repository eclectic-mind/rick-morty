<script setup lang="ts">
  interface PaginationData {
    url: string;
    active: number;
    total: number;
  }

  const route = useRoute();
  const props = defineProps<PaginationData>();
  const step = ref<number>(0);
  const totalStep = ref<number>(0);
  const startNumber = ref<number>(1);
  const numberList = ref<number[]>([]);
  const itemCount: number = 5;

  function init(): void {
    const stepData: number = Math.ceil(props.active / itemCount);
    const totalStepData: number = Math.ceil(props.total / itemCount);
    const startNumberData: number = stepData * itemCount - (itemCount - 1);
    const numberListData: number[] = [];

    for (let i: number = startNumberData; i < startNumberData + itemCount; i += 1) {
      if (i > props.total) {
        break;
      }

      numberListData.push(i);
    }

    step.value = stepData;
    totalStep.value = totalStepData;
    startNumber.value = startNumberData;
    numberList.value = numberListData;
  }

  init();

  async function movePageEvent(idx: number): Promise<void> {
    await navigateTo({
      path: props.url.replace("$", String(idx)),
      query: route.query,
      replace: true,
    });
  }

  watch(
      () => props.total,
      () => {
        init();
      }
  );
</script>

<template>
  <div v-if="props.total > 1" class="pagination">
    <button class="link" :disabled="step === 1" @click="movePageEvent(startNumber - 1)">&lt;</button>
    <button
        v-for="(item, count) in numberList"
        class="link"
        :class="{ '--active': item === props.active }"
        :key="`btn-page${count}`"
        @click="movePageEvent(item)"
    >
      {{ item }}
    </button>
    <button class="link" :disabled="step === totalStep" @click="movePageEvent(startNumber + itemCount)">
      &gt;
    </button>
  </div>
</template>

<style scoped>

</style>