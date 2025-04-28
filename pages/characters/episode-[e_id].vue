<script setup>
  /* import { useCharactersStore } from '@/stores/charactersStore';
  const myStore = useCharactersStore();
  myStore.init();

  const { ch_id } = useRoute().params;
  const findItem = () => {
    let result = {};

    myStore.items.forEach((item) => {
      if (Number(item.id) === Number(ch_id)) {
        result = item;
      }
    });

    return result;
  };

  const getLinkName = (data) => {
    const array = data.split('/');
    return array[array.length - 1];
  };

  const getLink = (data) => {
    const number = getLinkName(data);
    return `/episodes/episode-${number}`;
  };

  const checkStatus = (status) => {
    return status === 'Alive' ? 'danger' : status === 'Dead' ? 'dark' : 'secondary';
  }

  const currentItem = findItem(); */
</script>

<template>
  <Container>

    <Row>
      <h4 class="title">Карточка эпизода</h4>

      <Col col="sm-12 md-9 lg-6">
        <Card background-color="info-subtle">
          ...
        </Card>
      </Col>
    </Row>

  </Container>
</template>

<style scoped>
  .row {
    margin-top: 4rem;
    margin-bottom: 2rem;
  }
  .card-title {
    display: flex;
    justify-content: space-between;
  }
  .btn {
    margin: 4px 8px 4px 0;
  }
</style>