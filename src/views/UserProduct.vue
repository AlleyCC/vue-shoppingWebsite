<template>
  <Loading :active="isLoading"></Loading>
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/user/cart">購物車</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">名稱</li>
      </ol>
    </nav>
    <div class="row justify-content-center">
      <article class="col-8">
        <h2>{{ product.title }}</h2>
        <div>{{ product.content }}</div>
        <div>{{ product.description }}</div>
        <img src="" alt="" class="img-fluid mb-3">
      </article>
      <div class="col-4">
        <div class="h5">{{ product.origin_price }}  元</div>
        <del class="h6">原價{{ product.origin_price }}  元</del>
        <div class="h5">現在只要 {{ product.price }}  元</div>
        <hr>
        <button type="button" class="btn btn-outline-danger"
        @click="addToCart(product.id)" :disabled="this.status.loadingItem === product.id">
          <div class="spinner-grow text-danger spinner-border-sm" role="status"
          v-if="this.status.loadingItem === product.id">
            <span class="visually-hidden">Loading...</span>
          </div>
          加到購物車
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: {},
      id: '',
      isLoading: false,
      status: {
        loadingItem: '',
      },
    };
  },
  inject: {
    $httpMessageState: '$httpMessageState',
  },
  methods: {
    getProduct() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/product/${this.id}`;
      this.$http.get(api).then((response) => {
        console.log(response.data);
        this.isLoading = false;
        if (response.data.success) {
          this.product = response.data.product;
        }
      });
    },
    addToCart(id, qty = 1) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      const cart = {
        product_id: id,
        qty,
      };
      // this.isLoading = true;
      this.status.loadingItem = id;
      this.$http.post(url, { data: cart }).then((response) => {
        // this.isLoading = false;
        this.status.loadingItem = '';
        this.$httpMessageState(response, '加入購物車');
        this.$router.push('/user/cart');
      });
    },
  },
  created() {
    this.id = this.$route.params.id;
    this.getProduct();
  },
};
</script>
