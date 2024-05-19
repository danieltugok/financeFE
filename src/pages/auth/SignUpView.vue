<template>
  <q-page class="flex flex-center" padding>
    <q-form @submit.prevent.stop="onCreate">
      <q-card flat class="tw-w-[356px] tw-max-w-[448px] tw-text-emerald-700 tw-py-5 tw-px-3">
        <q-card-section>
          <div class="text-h6 row justify-center">{{ $t('CREATE_ACCOUNT') }}</div>
        </q-card-section>
        <q-card-section class="q-gutter-sm">
          <q-input v-model="form.name" :label="$t('NAME')" type="text" lazy-rules :rules="[isRequired]" color="primary"
            label-color="primary">
            <template v-slot:prepend>
              <q-icon name="mdi-account-outline" color="primary" class="cursor-pointer" />
            </template>
          </q-input>
          <q-input autocomplete="false" v-model="form.email" :label="$t('EMAIL')" type="email" lazy-rules
            :rules="[isEmail]" color="primary" label-color="primary">
            <template v-slot:prepend>
              <q-icon name="mdi-email-outline" color="primary" class="cursor-pointer" />
            </template>
          </q-input>
          <q-input autocomplete="false" v-model="form.password" lazy-rules :rules="[isRequired]" :label="$t('PASSWORD')"
            color="primary" label-color="primary" :type="showPassword ? 'text' : 'password'">
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
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-btn :label="$t('CREATE_ACCOUNT')" color="primary" class="full-width q-py-md q-mb-md" no-caps unelevated
            type="submit" />
          <q-btn :label="$t('CANCEL')" color="primary" outline class="full-width q-py-md" no-caps unelevated
            to="signin" />
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
// import { useI18n } from 'vue-i18n';
import { notify, isRequired, isEmail } from 'src/utils/helpers'
const $q = useQuasar();

const form = ref({
  name: '',
  email: '',
  password: ''
})

// const { t } = useI18n({
//   inheritLocale: true,
//   useScope: 'local'
// })

const showPassword = ref(false);

const onCreate = () => {
  // this.logIn();
  // notify('negative', 'Erro', 'Erro ao criar conta');
  console.log(form.value)
}
</script>

<style></style>