<template>
  <Loading :active="isLoading"></Loading>
  <div class="container">
    <div class="row mt-4">
      <div class="col-md-7">
        <table class="table align-middle">
          <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in products" :key="item.id">
            <td style="width: 200px">
              <div style="height: 100px; background-size: cover; background-position: center"
                :style="{backgroundImage: `url(${item.imageUrl})`}"  ></div>
            </td>
            <td><a href="#" class="text-dark">{{item.title}}</a></td>
            <td>
              <div class="h5" v-if="!item.price">{{item.origin_price}}  元</div>
              <del class="h6" v-if="item.price">原價 {{item.origin_price}}  元</del>
              <div class="h5" v-if="item.price">現在只要 {{item.price}}  元</div>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-secondary"
                @click="getProduct(item.id)">
                  查看更多
                </button>
                <button type="button" class="btn btn-outline-danger"
                @click="addToCart(item.id)" :disabled="this.status.loadingItem === item.id">
                  <div class="spinner-grow text-danger spinner-border-sm" role="status"
                    v-if="this.status.loadingItem === item.id">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  加到購物車
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <!-- 購物車列表 -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      product: {},
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
    getProducts() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`;
      this.isLoading = true;
      this.$http.get(url).then((response) => {
        this.products = response.data.products;
        console.log('products:', response);
        this.isLoading = false;
      });
    },
    getProduct(id) {
      this.$router.push(`/user/product/${id}`);
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
    this.getProducts();
  },
};
</script>
