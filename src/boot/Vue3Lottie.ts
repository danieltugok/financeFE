import { boot } from 'quasar/wrappers';
import Vue3Lottie from 'vue3-lottie';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    LottieAnimation: typeof import('vue3-lottie')['Vue3Lottie'];
  }
}

export default boot(({ app }) => {
  app.use(Vue3Lottie);
});
