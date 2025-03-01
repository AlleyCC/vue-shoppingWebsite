<template>
  <Loading :active="isLoading"></Loading>
  <div>
    <div class="text-end mt-4">
      <button class="btn btn-primary" @click="openModal(true)">
        建立新的優惠券
      </button>
    </div>
    <table class="table mt-4">
      <thead>
      <tr>
        <th>名稱</th>
        <th>折扣百分比</th>
        <th>到期日</th>
        <th>是否啟用</th>
        <th>編輯</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, key) in coupons" :key="key">
        <!-- <td>名稱</td> -->
        <td>{{item.title}}</td>
        <td>{{item.percent}}%</td>
        <td>{{$filters.date(item.due_date)}}</td>
        <td>
          <span class="text-success" v-if="item.is_enabled">啟用</span>
          <span class="text-success" v-else>未啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)"
            >編輯</button>
            <button class="btn btn-outline-danger btn-sm"
            @click="openDelModal(item)"
            >刪除</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

  </div>
  <CouponModal ref="couponModal" @update-coupon="updateCoupon" :coupon="tempCoupon"></CouponModal>
  <DelModal ref="delModal" :delProduct="tempCoupon" @delete-item="delCoupon"></DelModal>
</template>

<script>
import CouponModal from '@/components/CouponModal.vue';
import DelModal from '@/components/DelModal.vue';

export default {
  data() {
    return {
      coupons: [],
      tempCoupon: {},
      isNew: true,
      isLoading: false,
    };
  },
  components: {
    CouponModal,
    DelModal,
  },
  inject: {
    emitter: 'emitter',
  },
  methods: {
    getCoupons() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupons`;
      this.$http.get(api)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.coupons = res.data.coupons;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    updateCoupon() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon`;
      console.log(api);
      this.$http.post(api, { data: this.tempCoupon })
        .then((res) => {
          if (res.data.success) {
            console.log(res.data);
            this.coupons = res.data.coupons;
            const { couponModal } = this.$refs;
            couponModal.hideModal();
            this.getCoupons();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    delCoupon() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`;
      this.$http.delete(api)
        .then((res) => {
          if (res.data.success) {
            const delModalComponent = this.$refs.delModal;
            delModalComponent.hideModal();
            this.getCoupons();
          }
        });
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempCoupon = {};
      } else {
        this.tempCoupon = { ...item };
      }
      this.isNew = isNew;
      const { couponModal } = this.$refs;
      couponModal.showModal();
    },
    openDelModal(item) {
      this.tempCoupon = { ...item };
      const { delModal } = this.$refs;
      delModal.showModal();
    },

  },
  created() {
    this.getCoupons();
  },
};
</script>
