<template>
<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
aria-hidden="true" ref="modal">
  <!-- Modal -->
<div class="modal-dialog modal-xl" role="document" >
  <div class="modal-content border-0">
    <div class="modal-header bg-dark text-white">
      <h5 class="modal-title" id="exampleModalLabel">
        <span>新增產品</span>
      </h5>
      <button type="button" class="btn-close"
              data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-sm-4">
          <div class="mb-3">
            <label for="image" class="form-label">輸入圖片網址
            <input type="text" class="form-control" id="image"
                    placeholder="請輸入圖片連結" v-model="tempProduct.imageUrl">
            </label>
          </div>
          <div class="mb-3">
            <label for="customFile" class="form-label">或 上傳圖片
              <i class="fas fa-spinner fa-spin"></i>

            <input type="file" id="customFile" class="form-control"
            @change="uploadFile" ref="fileInput">
            </label>
          </div>
          <img class="img-fluid" alt="">
          <!-- 延伸技巧，多圖 -->
        </div>
        <div class="col-sm-8">
          <div class="mb-3">
            <label for="title" class="form-label">標題
            <input type="text" class="form-control" id="title"
                    placeholder="請輸入標題" v-model="tempProduct.title">
            </label>
          </div>

          <div class="row gx-2">
            <div class="mb-3 col-md-6">
              <label for="category" class="form-label">分類
                <input type="text" class="form-control" id="category"
                      placeholder="請輸入分類" v-model="tempProduct.category">
              </label>

            </div>
            <div class="mb-3 col-md-6">
              <label for="price" class="form-label">單位
                 <input type="text" class="form-control" id="unit"
                      placeholder="請輸入單位" v-model="tempProduct.unit">
              </label>

            </div>
          </div>

          <div class="row gx-2">
            <div class="mb-3 col-md-6">
              <label for="origin_price" class="form-label">原價
                <input type="number" class="form-control" id="origin_price"
                      placeholder="請輸入原價" v-model="tempProduct.origin_price">
              </label>

            </div>
            <div class="mb-3 col-md-6">
              <label for="price" class="form-label">售價
                <input type="number" class="form-control" id="price"
                      placeholder="請輸入售價" v-model="tempProduct.price">
              </label>

            </div>
          </div>
          <hr>

          <div class="mb-3">
            <label for="description" class="form-label">產品描述
              <textarea type="text" class="form-control" id="description"
                      placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea></label>

          </div>
          <div class="mb-3">
            <label for="content" class="form-label">說明內容
                <textarea type="text" class="form-control" id="content"
                      placeholder="請輸入產品說明內容" v-model="tempProduct.content"></textarea>
            </label>

          </div>
          <div class="mb-3">
            <div class="form-check">
              <label class="form-check-label" for="is_enabled">
              <input class="form-check-input" type="checkbox"
                      :true-value="1"
                      :false-value="0"
                      id="is_enabled" v-model="tempProduct.is_enabled">

                是否啟用
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary"
              data-bs-dismiss="modal">取消
      </button>
      <button type="button" class="btn btn-primary" @click="$emit('update-product', tempProduct)"
      >確認</button>
    </div>
  </div>
</div>
</div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal';

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      modal: {},
      tempProduct: {},
    };
  },
  watch: {
    product() {
      this.tempProduct = this.product;
    },
  },
  methods: {
    showModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
    uploadFile() {
      const uploadedFile = this.$refs.fileInput.files[0];
      const formData = new FormData();
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/upload`;
      formData.append('file-to-upload', uploadedFile);
      this.$http.post(api, formData)
        .then((res) => {
          if (res.data.success) {
            this.tempProduct.imageUrl = res.data.imageUrl;
          }
        });
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal);
  },
};
</script>
