<template>
  <Loading :active="isLoading"> </Loading>
<table class="table mt-4">
    <thead>
    <tr>
      <th>購買時間</th>
      <th>Email</th>
      <th>購買款項</th>
      <th>應付金額</th>
      <th>是否付款</th>
      <th>編輯</th>
    </tr>
    </thead>
    <tbody>
      <template>
        <tr>
          <td></td>
          <td><span></span></td>
          <td>
            <ul class="list-unstyled">
              <li>"名稱" 數量： "單位"
              </li>
            </ul>
          </td>
          <td class="text-right">{{ item.total }}</td>
          <td>
            <div class="form-check form-switch">
              <label for="paid-status" class="form-check-label">
                <input id="paid-status" class="form-check-input" type="checkbox">
                <span >已付款</span>
              </label>
            </div>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm"
              >檢視</button>
              <button class="btn btn-outline-danger btn-sm"
              >刪除</button>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>

</template>
<script>

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

  },
  inject: {
    emitter: 'emitter',
    $httpMessageState: '$httpMessageState',
  },
  // inject: ['emitter', $httpMessageState: {from: '$httpMessageState'}],
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
          console.log('aaa');
          console.log(res.data.success);
          if (res.data.success) {
            this.getProducts();
            this.$httpMessageState(res, '更新狀態');
            // this.emitter.emit('push-message', {
            //   style: 'success',
            //   title: 'Update succesfully',
            // });
          }
          //  else {
          // this.emitter.emit('push-message', {
          //   style: 'danger',
          //   title: 'Update failed.',
          //   content: res.data.message.join('、'),
          // });
          // }
        })
        .catch((err) => {
          console.log('400 inside catch');
          console.log(err.response); // 检查 API 返回的错误信息
          console.log(this.emitter);
          console.log(this.emitter.emit);
          console.log(err.response.data.message);
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
