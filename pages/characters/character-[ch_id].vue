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

  const currentItem = findItem();

  console.log('item', currentItem);

</script>

<template>
  <Container>

    <Row>
      <h4 class="title">Карточка персонажа</h4>

      <Col col="sm-12 md-9 lg-6">
        <Card background-color="info-subtle">
          <CardImgTop
              :src="currentItem.image"
              :alt="currentItem.name"
          />
          <CardHeader><b>Id</b> from route: {{ ch_id }}</CardHeader>
          <CardBody>
            <CardTitle>{{ currentItem.name }}
              <Badge :color="checkStatus(currentItem.status)">
                {{ currentItem.status }}
              </Badge>
            </CardTitle>
            <CardText>
              <b>Gender:</b> {{ currentItem.gender }}<br>
              <b>Specie:</b> {{ currentItem.species }}<br>
              <b>Origin:</b> {{ currentItem.origin['name'] }}<br>
              <b>Location:</b> {{ currentItem.location['name'] }}<br>
              <b>In episodes:</b><br>
              <div>
                <Anchor v-for="episode in currentItem.episode"
                    button
                    size="sm"
                    color="outline-primary"
                    :to="getLink(episode)"
                >
                  {{ getLinkName(episode) }}
                </Anchor>
              </div>
            </CardText>
          </CardBody>
          <CardFooter text-color="body-secondary">
            <b>Created:</b> {{ currentItem.created }}
          </CardFooter>
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