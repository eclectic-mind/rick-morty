<script setup lang="ts">
  const favStore = useFavoritesStore();

  useHead({
    title: 'Rick and Morty',
    meta: [
      {
        name: 'description',
        content: 'My amazing site'
      }
    ],
    bodyAttrs: {
      class: 'test'
    }
  })
</script>

<template>
  <header class="bg-dark">
    <ul class="nav nav-pills nav-fill flex-column flex-sm-row p-3">
      <li class="nav-item">
        <NuxtLink to="/" class="nav-link text-white">
          <BIcon
              icon="bi:house-door-fill"
              margin="2"
          />
          Главная</NuxtLink>
      </li>
      <li class="nav-item">
        <NuxtLink to="/characters" class="nav-link text-white">
          <BIcon
              icon="bi:person-fill"
              margin="2"
          />
          Персонажи
        </NuxtLink>
      </li>
      <li class="nav-item">
        <NuxtLink to="/locations" class="nav-link text-white">
          <BIcon
              icon="bi:signpost-fill"
              margin="2"
          />
          Локации
        </NuxtLink>
      </li>
      <li class="nav-item">
        <NuxtLink to="/episodes" class="nav-link text-white">
          <BIcon
              icon="bi:puzzle-fill"
              margin="2"
          />
          Эпизоды</NuxtLink>
      </li>
      <li class="nav-item">
        <NuxtLink to="/favorite" class="nav-link text-white">
          <BIcon
              icon="bi:heart-fill"
              margin="2"
          />
          Избранное
          <span class="badge bg-info">{{ favStore.sum }}</span>
        </NuxtLink>
      </li>
    </ul>
  </header>

  <main>
    <slot />
  </main>

  <footer class="bg-dark text-white p-3">&copy; all rights reserved </footer>
</template>

<style scoped>
  .router-link-exact-active.text-white,
  .nav-link:hover,
  .nav-link:focus {
    color: hotpink !important;
  }

  .nav-link {
    display: flex;
    align-items: center;

    .bg-info {
      margin-left: 8px;
    }
  }
</style>