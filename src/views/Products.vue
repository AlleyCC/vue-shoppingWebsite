<template>
  <Loading :active="isLoading"> </Loading>
  <div class="container-fluid">
    <div class="text-end">
      <button class="btn btn-primary" type="button"
      @click="openModal(true)">新增</button>
    </div>
    <table class="table mt-4">
    <thead>
      <tr>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120">原價</th>
        <th width="120">售價</th>
        <th width="100">是否啟用</th>
        <th width="200" >編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in products" :key="item.id">
        <td>{{ item.category }}</td>
        <td>{{ item.title }}</td>
        <td class="text-right">
          {{ $filters.currency(item.origin_price) }}
        </td>
        <td class="text-right">
          {{ $filters.currency(item.price) }}
        </td>
        <td>
          <span class="text-success" v-if="item.is_enabled">啟用</span>
          <span class="text-muted" v-else>未啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm" type="button"
      @click="openModal(false, item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm" @click="openDelModal(item)">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  </div>
<Pagination @emit-pages="getProducts" :pages="pagination"></Pagination>
<ProductModal ref="productModal" :product="tempProduct"
@update-product="updateProduct"></ProductModal>
<DelModal ref="delModal" :delProduct="tempProduct"
 @delete-item="deleteProduct"></DelModal>
</template>
<script>
import Pagination from '@/components/Pagination.vue';
import ProductModal from '../components/ProductModal.vue';
import DelModal from '../components/DelModal.vue';

export default {
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      isNew: true,
      isLoading: false,
    };
  },
  components: {
    ProductModal,
    DelModal,
    Pagination,
  },
  inject: {
    emitter: 'emitter',
    $httpMessageState: '$httpMessageState',
  },
  // inject: ['emitter'],
  methods: {
    getProducts(page = 1) {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products/?page=${page}`;
      this.$http.get(api)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.products = res.data.products;
            this.pagination = res.data.pagination;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempProduct = {};
      } else {
        this.tempProduct = { ...item };
      }
      this.isNew = isNew;
      const productComponent = this.$refs.productModal;
      productComponent.showModal();
    },
    openDelModal(item) {
      // console.log('openDelModal');
      this.tempProduct = { ...item };
      const delComponent = this.$refs.delModal;
      delComponent.showModal();
    },
    updateProduct(item) {
      this.tempProduct = item;
      // create
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`;
      let httpMethod = 'post';
      // edit
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`;
        httpMethod = 'put';
      }
      const productComponent = this.$refs.productModal;
      productComponent.hideModal();
      this.$http[httpMethod](api, { data: this.tempProduct })
        .then((res) => {
          if (res.data.success) {
            this.getProducts();
            this.$httpMessageState(res, '更新狀態');
          }
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: 'Update failed (API Error)',
            content: err.response?.data?.message || 'Unknown error',
          });
          console.log('trigger emmit');
        });
    },
    deleteProduct() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`;
      this.$http.delete(api)
        .then((res) => {
          if (res.data.success) {
            const delModalComponent = this.$refs.delModal;
            delModalComponent.hideModal();
            this.getProducts();
          }
        });
    },

  },
  created() {
    this.getProducts();
  },
};
</script>
