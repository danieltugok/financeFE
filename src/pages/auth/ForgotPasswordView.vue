<template>
  <q-page class="flex flex-center" padding>
    <q-form @submit="onSubmit">
      <Vue3Lottie :animationData="AstronautJSON" :height="200" :width="200" />
      <q-card flat class="wrapper">
        <div class="text-h6 row justify-center">Recuperar senha</div>
        <q-card-section>
          <q-input autocomplete="false" v-model="email" :label="$t('EMAIL')" type="email" lazy-rules :rules="[isEmail]"
            color="primary" label-color="primary">
            <template v-slot:prepend>
              <q-icon name="mdi-email-outline" color="primary" class="cursor-pointer" />
            </template>
          </q-input>
          <q-btn color="primary" label="Enviar email" type="submit" class="full-width q-py-md q-mb-md q-mt-md"
            unelevated no-caps />
          <div class="row justify-end q-mb-lg q-mt-lg">
            <router-link to="/signin" style="text-decoration: none; margin-top: -10px"
              class="mouse-pointer text-primary">
              {{ $t('BACK') }}
            </router-link>
          </div>
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import {
  isEmail,
  notify
} from 'src/utils/helpers'
import { Vue3Lottie } from 'vue3-lottie'

import AstronautJSON from 'src/assets/lottie/astronaut.json'
import { userComposable } from 'src/composables/userComposable'

const { forgotPass } = userComposable()

const email = ref<string>('')
async function onSubmit() {
  const forgotPassResponse = await forgotPass(email.value);
  if (forgotPassResponse.status === 200)
    notify('info', 'email Sent', 'Check your email to reset password');
  else if (forgotPassResponse.statusCode === 409)
    notify('negative', forgotPassResponse.error, 'This email was NOT found in our database');

  else if (forgotPassResponse.status === 404) {
    notify('negative', 'ERROR', 'Email could NOT be sent. Check if this email exists');
  }
}
</script>
<style scoped lang="sass">
.wrapper
  min-width: 356px
  max-width: 448px
</style>
