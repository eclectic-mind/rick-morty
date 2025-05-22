<script setup>
  import { useLocationsStore } from '@/stores/locationsStore';
  const myStore = useLocationsStore();
  const favStore = useFavoritesStore();
  const { l_id } = useRoute().params;

  myStore.init();

  const findItem = (array, id) => {
    let result = null;

    array.forEach((item) => {
      if (Number(item.id) === Number(id)) {
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
    return `/characters/character-${number}`;
  };

  const checkFav = (id) => {
    const inFavorites = findItem(favStore.locations, id);

    return inFavorites ? 'pink' : 'white';
  };

  const setFav = (item) => {
    const inFavorites = findItem(favStore.locations, l_id);

    if (!inFavorites) {
      favStore.addFavLocation(item);
    } else {
      favStore.removeFavLocation(item);
    }
  };

  const currentItem = await myStore.fetchLocationById(l_id);
</script>

<template>
  <Container>

    <Row>
      <h4 class="title">Карточка локации</h4>

      <Col col="sm-12 md-9 lg-6">
        <Card background-color="info-subtle">
          <CardHeader>
            <div><b>Id</b> from route: {{ l_id }}</div>
            <IconBox
                icon="bi:heart-fill"
                size="lg"
                :color="checkFav(l_id)"
                @click="setFav(currentItem)"
            />
          </CardHeader>
          <CardBody>
            <CardTitle>
              {{ currentItem.name }}
            </CardTitle>
            <CardText>
              <p><b>Type:</b> {{ currentItem.type }}</p>
              <p><b>Dimension:</b> {{ currentItem.dimension }}</p>
              <p v-if="currentItem.residents"><b>Characters:</b></p>
              <div v-if="currentItem.residents">
                <Anchor v-for="character in currentItem.residents"
                        button
                        size="sm"
                        color="outline-primary"
                        :to="getLink(character)"
                >
                  {{ getLinkName(character) }}
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
  .btn {
    margin: 4px 8px 4px 0;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  p {
    margin-bottom: 0.5rem;
  }
</style>