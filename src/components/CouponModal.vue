<template>
<div class="modal fade" id="couponModal" tabindex="-1" role="dialog"
       aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button type="button" class="btn-close"
                  data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="title">標題
              <input type="text" class="form-control" id="title"
                   placeholder="請輸入標題" v-model="tempCoupon.title">
            </label>

          </div>
          <div class="mb-3">
            <label for="coupon_code">優惠碼
              <input type="text" class="form-control" id="coupon_code"
                   placeholder="請輸入優惠碼" v-model="tempCoupon.code">
            </label>
          </div>
          <div class="mb-3">
            <label for="due_date">到期日
              <input type="date" class="form-control" id="due_date"
              v-model="due_date">
            </label>
          </div>
          <div class="mb-3">
            <label for="price">折扣百分比
              <input type="number" class="form-control" id="price" placeholder="請輸入折扣百分比"
              v-model.number="tempCoupon.percent">
            </label>
          </div>
          <div class="mb-3">
            <div class="form-check">
              <label class="form-check-label" for="is_enabled">

              <input class="form-check-input" type="checkbox" id="is_enabled"
              v-model="tempCoupon.is_enabled" :true-value="1" :false-value="0">
              是否啟用</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary"
          @click="$emit('update-coupon', tempCoupon)">更新優惠券
          </button>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import modalMixin from '@/mixins/modalMixin';

export default {
  props: {
    coupon: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      modal: '',
      tempCoupon: {},
      due_date: {},
    };
  },
  methods: {
  },
  watch: {
    coupon() {
      this.tempCoupon = this.coupon;
    },
    due_date() {
      this.tempCoupon.due_date = Math.floor(new Date(this.due_date) / 1000);
    },
  },
  mixins: [modalMixin],
};
</script>
