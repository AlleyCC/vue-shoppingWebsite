<template>
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Rosie</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
    data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
     aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <div class="navbar-nav">
        <router-link to="/dashboard/products" class="nav-link">Product</router-link>
        <router-link to="/dashboard/orders" class="nav-link">Orders</router-link>
        <router-link to="/dashboard/coupons" class="nav-link">Coupons</router-link>
        <router-link to="/dashboard/posts" class="nav-link">Posts</router-link>
        <a class="nav-link" href="#" @click.prevent="logout" >Logout</a>
      </div>
    </div>
  </div>
</nav>
</template>
<script>
export default {
  methods: {
    logout() {
      const api = `${process.env.VUE_APP_API}logout`;
      console.log(api);
      this.$http.post(api, this.user)
        .then((res) => {
          console.log(res);

          this.$router.push('/login');
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },

};
</script>
