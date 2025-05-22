<script setup lang="ts">
  import {IEpisodeItem} from "~/stores/types";

  const myStore = useEpisodesStore();
  const favStore = useFavoritesStore();
  const { e_id }: number = useRoute().params;

  myStore.init();

  const findItem = (array: IEpisodeItem[], id: number): IEpisodeItem => {
    let result = null;

    array.forEach((item: IEpisodeItem) => {
      if (Number(item.id) === Number(id)) {
        result = item;
      }
    });

    return result;
  };

  const getLinkName = (data: string): string => {
    const array: [] = data.split('/');
    return array[array.length - 1];
  };

  const getLink = (data: string): string => {
    const number: number = getLinkName(data);
    return `/characters/character-${number}`;
  };

  const checkFav = (id: number): string => {
    const inFavorites: boolean = findItem(favStore.episodes, id);

    return inFavorites ? 'pink' : 'white';
  };

  const setFav = (item: IEpisodeItem): void => {
    const inFavorites: boolean = findItem(favStore.episodes, e_id);

    if (!inFavorites) {
      favStore.addFavEpisode(item);
    } else {
      favStore.removeFavEpisode(item);
    }
  };

  const currentItem: IEpisodeItem = await myStore.fetchEpisodeById(e_id);
</script>

<template>
  <Container>

    <Row>
      <h4 class="title">Карточка эпизода</h4>

      <Col col="sm-12 md-9 lg-6">
        <Card background-color="info-subtle">
          <CardHeader>
            <div><b>Id</b> from route: {{ e_id }}</div>
            <IconBox
                icon="bi:heart-fill"
                size="lg"
                :color="checkFav(e_id)"
                @click="setFav(currentItem)"
            />
          </CardHeader>
          <CardBody>
            <CardTitle>{{ currentItem.name }}
              <Badge color="warning">
                {{ currentItem.episode }}
              </Badge>
            </CardTitle>
            <CardText>
              <p><b>Air date:</b> {{ currentItem.air_date }}</p>
              <p v-if="currentItem.characters"><b>Episodes:</b></p>
              <div v-if="currentItem.characters">
                <Anchor v-for="character in currentItem.characters"
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
  .card-title {
    display: flex;
    justify-content: space-between;
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