<script>
  export default {
    data() {
      return {
        some: 'info'
      }
    }
  }
</script>

<template>
  <h1>Home page</h1>
  <p>{{ some }}</p>
</template>

<style scoped>
  h1 {
    color: green
  }
</style>