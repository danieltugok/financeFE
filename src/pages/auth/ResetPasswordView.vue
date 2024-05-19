<template>
  <q-page class="flex flex-center" padding>
    <q-form @submit="onSubmit">
      <q-card flat class="wrapper">
        <div class="text-h6 row justify-center">Recuperar senha</div>
        <q-card-section>
          <q-input v-model="password" :type="showPassword ? 'text' : 'password'" :label="$t('PASSWORD')"
            :rules="[isRequired]" @keyup.enter="onSubmit">
            <template v-slot:prepend>
              <q-icon name="mdi-form-textbox-password" color="primary" class="cursor-pointer" />
            </template>
            <template #append>
              <q-btn v-if="password" color="primary" flat padding="xs sm" no-caps @click="showPassword = !showPassword">
                <q-icon :name="!showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" color="primary"
                  class="cursor-pointer" />
              </q-btn>
            </template>
          </q-input>
          <q-btn color="primary" :label="$t('ACCESS')" type="submit" class="full-width q-py-md q-mb-md" unelevated
            no-caps />
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import {
  // notify, 
  isRequired
} from 'src/utils/helpers'
// import { userComposable } from '@/composables/userComposable'
import { useRoute } from 'vue-router'

// const { resetPass } = userComposable()
const showPassword = ref<boolean>(false)
const route = useRoute()
localStorage.setItem('access_token', route.params.token.toString());

const password = ref<string>('')
async function onSubmit() {
  console.log(password.value)
  // const resetPassResponse = await resetPass(password.value);
  // if (resetPassResponse.status === 200)
  //   notify('positive', 'Password Reset', 'Your password was reset successfully! Login now with your new password.');  
  // else if (resetPassResponse.statusCode === 400) 
  //   notify('negative', resetPassResponse.error, resetPassResponse.message);  
}
</script>
<style scoped lang="sass">
.wrapper
  min-width: 356px
  max-width: 448px
</style>
