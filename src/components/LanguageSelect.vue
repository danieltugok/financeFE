<script setup lang="ts">
import { ref } from 'vue';
import { userComposable } from 'src/composables/userComposable';
import { onMounted } from 'vue';
const { user, languages, updateUser } = userComposable();
import { useI18n } from 'vue-i18n'

type Language = {
  label: string;
  flag: string;
  country: string;
  language: string;
};

const selectedLanguage = ref(user.value?.preference.language); // 'en'
const lang = ref<Language | null>(null);
const { locale } = useI18n();

onMounted(() => {
  const foundLanguage = languages.find((lang: any) => lang.language === selectedLanguage.value);
  lang.value = foundLanguage ? foundLanguage : null;
});

const changeLocale = async (languageSelected: any) => {
  console.log('🚀 ~ changeLocale ~ locale:', locale)
  if (!user.value) return;
  updateUser(user.value.id, { preference: { language: languageSelected.language } })
  // $i18n.locale.value = locale.language;
  locale.value = languageSelected.language
}
</script>

<template>
  <!-- <q-btn color="primary" icon="check" label="English" @click="$i18n.locale = 'en'" />
  <q-btn color="primary" icon="check" label="Portuguese" @click="$i18n.locale = 'pt'" />
  {{ $t('FORGOT_PASS') }}---*{{ locale }}*--- -->

  <q-select dense v-model="lang" @update:model-value="changeLocale" :options="languages" emit-value filled>

    <template v-slot:selected>
      <q-item dense class="q-px-none">
        <q-item-section>
          <q-img img-class="rounded-borders" :src="`src/assets/flags/${lang?.flag}.png`" spinner-color="white"
            width="24px" />
        </q-item-section>
        <q-item-section>
          <q-item-label> {{ lang?.label }} </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <!-- <template v-slot:before-options>
      <q-item>
        <q-item-section>
          <q-item-label>{{ $t("LANGUAGE") }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator inset />
    </template> -->

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section side>
          <q-img img-class="rounded-borders" :src="`src/assets/flags/${scope.opt.flag}.png`" spinner-color="white"
            width="24px" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>