<script setup lang="ts">
import {ICharacterItem} from '~/stores/types';

  const { ch_id }: number = useRoute().params;
  const myStore = useCharactersStore();
  const favStore = useFavoritesStore();

  myStore.init();

  const findItem = (array: ICharacterItem[], id: number): ICharacterItem => {
    let result: ICharacterItem | null = null;

    array.forEach((item: ICharacterItem) => {
      if (Number(item.id) === Number(id)) {
        result = item;
      }
    });

    return result;
  };

  const getLinkName = (data: string): string => {
    const array: string[] = data.split('/');
    return array[array.length - 1];
  };

  const getLink = (data: string): string => {
    const number: number = getLinkName(data);
    return `/episodes/episode-${number}`;
  };

  const checkStatus = (status: string): string => {
    return status === 'Alive' ? 'danger' : status === 'Dead' ? 'dark' : 'secondary';
  };

  const checkFav = (id: number): string => {
    const inFavorites: boolean = findItem(favStore.characters, id);

    return inFavorites ? 'pink' : 'white';
  };

  const setFav = (item: ICharacterItem): void => {
    const inFavorites: boolean = findItem(favStore.characters, ch_id);

    if (!inFavorites) {
      favStore.addFavCharacter(item);
    } else {
      favStore.removeFavCharacter(item);
    }
  };

  const currentItem: ICharacterItem = await myStore.fetchCharacterById(ch_id);
</script>

<template>
  <Container>

    <Row>
      <h4 class="title">Карточка персонажа</h4>

      <Col v-if="currentItem" col="sm-12 md-9 lg-6">
        <Card background-color="info-subtle">
          <IconBox
              icon="bi:heart-fill"
              size="lg"
              :color="checkFav(ch_id)"
              @click="setFav(currentItem)"
          />
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
              <p><b>Gender:</b> {{ currentItem.gender }}</p>
              <p><b>Specie:</b> {{ currentItem.species }}</p>
              <p><b>Origin:</b> {{ currentItem.origin['name'] }}</p>
              <p><b>Location:</b> {{ currentItem.location['name'] }}</p>
              <p v-if="currentItem.episode"><b>In episodes:</b></p>
              <div v-if="currentItem.episode">
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
  .card {
    position: relative;
  }
  .icon-box {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }
  .card-title {
    display: flex;
    justify-content: space-between;
  }
  .btn {
    margin: 4px 8px 4px 0;
  }
  p {
    margin-bottom: 0.5rem;
  }
</style>