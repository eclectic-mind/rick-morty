<template>
  <header class="bg-dark">
    <ul class="nav nav-pills nav-fill flex-column flex-sm-row p-3">
      <li class="nav-item">
        <NuxtLink to="/" class="nav-link text-white">Главная</NuxtLink>
      </li>
      <li class="nav-item">
        <NuxtLink to="/characters" class="nav-link text-white">Персонажи</NuxtLink>
      </li>
      <li class="nav-item">
        <NuxtLink to="/locations" class="nav-link text-white">Локации</NuxtLink>
      </li>
      <li class="nav-item">
        <NuxtLink to="/episodes" class="nav-link text-white">Эпизоды</NuxtLink>
      </li>
      <li class="nav-item">
        <NuxtLink to="/favorite" class="nav-link text-white">Избранное</NuxtLink>
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
    color: red !important;
  }
</style>
<script setup lang="ts">
</script>