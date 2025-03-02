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
       <div class="col-md-5">
        <div class="sticky-top">
          <table class="table align-middle">
            <thead>
              <tr >
                <th></th>
                <th>品名</th>
                <th style="width: 110px">數量</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
            <template v-if="cart.carts" >
              <tr v-for="item in cart.carts" :key="item.id">
                <td>
                  <button type="button" class="btn btn-outline-danger btn-sm"
                  :disabled="this.status.loadingItem === item.id" @click="removeCartItem(item.id)">
                    <i class="bi bi-x"></i>
                  </button>
                </td>
                <td>
                 {{ item.product.title }}
                  <div class="text-success" v-if="item.coupon">
                    已套用優惠券
                  </div>
                </td>
                <td>
                  <div class="input-group input-group-sm">
                    <label for="price">
                      <input id="price" type="number" class="form-control" min="1"
                      v-model.number="item.qty" @change="updateCart(item)">
                    </label>
                    <div class="input-group-text">/{{ item.product.unit }}</div>
                  </div>
                </td>
                <td class="text-end">
                  <small class="text-success" v-if="cart.total !== cart.final_total">折扣價：</small>
                  {{ $filters.currency(item.final_total) }}
                </td>
              </tr>
            </template>
            </tbody>
            <tfoot>
            <tr>
              <td colspan="3" class="text-end">總計</td>
              <td class="text-end">{{ $filters.currency(cart.total) }}</td>
            </tr>
            <tr  v-if="cart.total !== cart.final_total">
              <td colspan="3" class="text-end text-success"
             >折扣價
              </td>
              <td class="text-end text-success">{{ $filters.currency(cart.final_total) }}</td>
            </tr>
            </tfoot>
          </table>
          <div class="input-group mb-3 input-group-sm">
            <label for="coupon_code_input">
              <input id="coupon_code_input" type="text" class="form-control"
               placeholder="請輸入優惠碼" v-model="this.couponCode">
            </label>
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
                套用優惠碼
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- form -->
    <div class="my-5 row justify-content-center">
      <Form class="col-md-6" v-slot="{ errors }"  @submit="createOrder">
        <div class="mb-3">
          <span id="email-label">Email</span>
          <Field id="email" name="email" type="email" class="form-control"
          aria-labelledby="email-label"
          v-model="form.user.email"
          :class="{ 'is-invalid': errors['email'] }"
                   placeholder="請輸入 Email" rules="email|required"
                   ></Field>
          <ErrorMessage name="email-label" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <span id="name-label">收件人姓名</span>
          <Field id="name" name="姓名" type="text" class="form-control" aria-labelledby="name-label"
          v-model="form.user.name"
          :class="{ 'is-invalid': errors['姓名'] }"
                   placeholder="請輸入姓名" rules="required"
                  ></Field>
          <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
           <span id="tel-label">收件人電話</span>
          <Field id="tel" name="電話" type="tel" class="form-control" aria-labelledby="tel-label"
                   :class="{ 'is-invalid': errors['電話'] }"
                   placeholder="請輸入電話" rules="required"
                   v-model="form.user.tel" ></Field>
          <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <span id="address-label">收件人地址</span>
          <Field id="address" name="地址" type="text" class="form-control"
          aria-labelledby="address-label"
                   :class="{ 'is-invalid': errors['地址'] }"
                   placeholder="請輸入地址" rules="required"
                   v-model="form.user.address"></Field>
          <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">留言
          <textarea name="" id="message" class="form-control" cols="30" rows="10"
                    v-model="form.message">
          </textarea>
          </label>
        </div>
        <div class="text-end">
          <button class="btn btn-danger">送出訂單</button>
        </div>
      </Form>
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
      cart: {},
      couponCode: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
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
      this.status.loadingItem = id;
      this.$http.post(url, { data: cart }).then((response) => {
        this.status.loadingItem = '';
        this.$httpMessageState(response, '加入購物車');
        this.getCart();
      });
    },
    getCart() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.isLoading = true;
      this.$http.get(url).then((response) => {
        console.log(url);
        this.cart = response.data.data;
        this.isLoading = false;
      });
    },
    removeCartItem(id) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${id}`;
      this.isLoading = true;
      this.status.loadingItem = id;
      this.$http.delete(url).then((res) => {
        if (res.data.success) {
          this.isLoading = false;
          this.status.loadingItem = '';
          this.getCart();
        }
      });
    },
    updateCart(item) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`;
      this.isLoading = true;
      this.status.loadingItem = item.id;
      const cart = {
        product_id: item.product_id,
        qty: item.qty,
      };
      this.$http.put(url, { data: cart }).then((res) => {
        console.log(res);
        this.status.loadingItem = '';
        this.getCart();
      });
    },
    addCouponCode() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/coupon`;
      const coupon = {
        code: this.couponCode,
      };
      this.isLoading = true;
      this.$http.post(url, { data: coupon }).then((response) => {
        this.$httpMessageState(response, '加入優惠券');
        this.getCart();
        this.isLoading = false;
      });
    },
    createOrder() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/order`;
      const order = this.form;
      this.$http.post(url, { data: order })
        .then((res) => {
          console.log(res);
        });
    },
  },
  created() {
    this.getProducts();
    this.getCart();
  },
};
</script>
