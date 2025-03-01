<template>
  <div class="toast-container position-absolute pe-3 top-0 end-0" style="z-index: 1050">
  <Toast v-for="(msg, key) in messages" :key="key" :msg="msg"></Toast>
  </div>
</template>

<script>
import Toast from '@/components/Toast.vue';

export default {
  components: { Toast },
  data() {
    return {
      messages: [],
    };
  },
  inject: ['emitter'],
  mounted() {
    console.log('toast message emit on');
    this.emitter.on('push-message', (message) => {
      console.log('toast message emit on');
      const { style = 'success', title, content } = message;
      this.messages.push({ style, title, content });
    });
  },
};
</script>
