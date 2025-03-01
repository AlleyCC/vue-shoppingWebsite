<template>
  <nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item"><a class="page-link" href="#">Previous</a>
    </li>
    <li class="page-item" v-for="page in pages.total_pages" :key="page">
      <a class="page-link" href="#" @click.prevent="updatePage(page)">{{ page }}</a>
    </li>
    <li class="page-item"><a class="page-link" href="#">Next</a>
    </li>
  </ul>
</nav>
</template>
<script>
export default {
  props: ['pages'],
  methods: {
    updatePage(page) {
      console.log('emit page:', page);
      this.$emit('emit-pages', page);
    },
  },
};
</script>
