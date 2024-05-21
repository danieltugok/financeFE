<template>
  <q-page class="flex flex-center" padding>
    <q-form @submit="onSubmit">
      <q-card flat class="tw-w-[356px] tw-max-w-[448px] tw-text-emerald-700 tw-py-5 tw-px-3">
        <div class="text-h6 row justify-center uppercase ">{{ $t('ACCESS') }}</div>
        <q-card-section>
          <q-input autocomplete="false" v-model="form.email" :label="$t('EMAIL')" type="email" lazy-rules
            color="primary" label-color="primary" :rules="[isRequired, isEmail]">
            <template v-slot:prepend>
              <q-icon name="mdi-email-outline" color="primary" class="cursor-pointer" />
            </template>
          </q-input>
          <q-input v-model="form.password" :type="showPassword ? 'text' : 'password'" :label="$t('PASSWORD')"
            :rules="[isRequired]" @keyup.enter="onSubmit">
            <template v-slot:prepend>
              <q-icon name="mdi-form-textbox-password" color="primary" class="cursor-pointer" />
            </template>
            <template #append>
              <q-btn v-if="form.password" color="primary" flat padding="xs sm" no-caps
                @click="showPassword = !showPassword">
                <q-icon :name="!showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" color="primary"
                  class="cursor-pointer" />
              </q-btn>
            </template>
          </q-input>
          <div class="row justify-end q-mb-lg">
            <router-link style="text-decoration: none; margin-top: -10px" class="mouse-pointer text-primary"
              to="/forgot-password">
              {{ $t('FORGOT_PASS') }}
            </router-link>
          </div>
          <q-btn color="primary" :label="$t('ACCESS')" type="submit" class="full-width q-py-md q-mb-md" unelevated
            no-caps />
          <div class="row justify-center items-center q-mt-lg">
            <span>Não tem uma conta?</span>
            <router-link to="/signup" class="mouse-pointer text-primary"
              style="text-decoration: none; margin-left: 5px">
              Cadastre-se
            </router-link>
          </div>
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { userComposable } from 'src/composables/userComposable'
import { useRoute, useRouter } from 'vue-router'
import {
  notify,
  isRequired,
  isEmail
} from 'src/utils/helpers'

const { getLogin, accessToken } = userComposable();
const router = useRouter()
const route = useRoute()

const form = ref<{ email: string, password: string }>({
  email: '',
  password: ''
})

const showPassword = ref<boolean>(false)

async function onSubmit() {
  const getLoginResponse = await getLogin(form.value.email, form.value.password);
  console.log('🚀 ~ onSubmit ~ accessToken.value:', accessToken.value)
  if (getLoginResponse.status === 201 && accessToken.value)
    router.push({ path: route.query.redirect as string || '/' })
  if (getLoginResponse.statusCode === 401) {
    notify('negative', getLoginResponse.message, 'username or password are incorrect');
  }
}

const VITE_VUE_ROUTER_MODE = import.meta.env.VITE_VUE_ROUTER_MODE

</script>

<style scoped lang="sass">

</style>
