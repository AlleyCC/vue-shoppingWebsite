<template>
  <div class="container mt-5">
    <form class="row justify-content-center" @submit.prevent="signIn">
      <div class="col-md-6">
        <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
        <div class="mb-2">
          <label for="inputEmail" class="sr-only">Email address
            <input type="email" id="inputEmail" class="form-control" placeholder="Email address"
            required v-model="user.username"/>
          </label>
        </div>
        <div class="mb-2">
          <label for="inputPassword" class="sr-only">Password
            <input type="password" id="inputPassword" class="form-control" placeholder="Password"
            required v-model="user.password"/>
          </label>
        </div>

        <div class="text-end mt-4">
          <button class="btn btn-lg btn-primary btn-block" type="submit">登入</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    signIn() {
      const api = `${process.env.VUE_APP_API}admin/signin`;
      this.$http.post(api, this.user)
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token};`;
          document.cookie = `expires=${new Date(expired)};`;
          this.$router.push('/dashboard');
        });
    },
  },
};
</script>
