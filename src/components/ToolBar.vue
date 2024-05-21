<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import LanguageSelect from './LanguageSelect.vue';
import { userComposable } from 'src/composables/userComposable'
import UploadProfileImage from 'src/components/UploadProfileImage.vue'

const { user, updateUser } = userComposable()
const $q = useQuasar();

const theme = ref<string | null>(null);
const userImageProfile = ref('https://cdn.quasar.dev/img/avatar.png');
const dialogUpdateAvatar = ref(false)

onMounted(() => {
  checkThemeinSystem();
});

// Checking if the user has the preference of color scheme (dark or light) in the system 
const checkThemeinSystem = () => {
  const userTheme = user.value?.preference.theme;
  console.log('🚀 ~ file: ToolBar.vue:26 ~ checkThemeinSystem ~ userTheme:', userTheme)

  if (userTheme === 'LIGHT') {
    $q.dark.set(false);
    theme.value = 'LIGHT';
  } else if (userTheme === 'DARK') {
    $q.dark.set(true);
    theme.value = 'DARK';
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      $q.dark.set(true);
      theme.value = 'DARK';
    } else {
      $q.dark.set(false)
      theme.value = 'LIGHT';
    }
  }
};

const toggle = async () => {
  $q.dark.toggle();
  if (!$q.dark.isActive) {
    if (!user.value) return;
    theme.value = 'LIGHT';
    updateUser(user.value.id, { preference: { theme: theme.value } })
  } else {
    if (!user.value) return;
    theme.value = 'DARK';
    updateUser(user.value.id, { preference: { theme: theme.value } })
  }
}
const getProfileImage = computed<string>(() => {
  return user.value?.imageProfile ? `http://localhost:3000/api/v1/users/profile-image/${user.value?.imageProfile}` : 'https://cdn.quasar.dev/img/avatar.png';
});

const updateProfile = (val: any) => {
  console.log('🚀 ~ file: ToolBar.vue:62 ~ updateProfile ~ val:', val)
  // userImageProfile.value = val;
  // dialogUpdateAvatar.value = false;
}


</script>

<template>
  <q-btn icon="person" :color="$q.dark.isActive ? 'light' : 'primary'"
    :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-1'" flat round>
    <q-menu>
      <q-list class="tw-min-w-[100px] tw-mt-8">
        <!-- <img src="https://cdn.quasar.dev/img/mountains.jpg" class="tw-max-w-[200px]"> -->

        <div class="tw-flex tw-justify-center tw-border tw-border-white -tw-mt-8 tw-mb-2">
          <q-item>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" v-if="getProfileImage" size="3.5rem">
                <img :src="getProfileImage" />
              </q-avatar>
              <q-avatar color="primary" text-color="white" v-else size="3.5rem">
                {{ user ? user?.name.split(' ')[0].substr(0, 1) + user?.name.split(' ')[1].substr(0, 1) : '' }}
              </q-avatar>
              <q-btn color="grey-3" text-color="primary" icon="sym_r_edit" dense round class="absolute q-card--bordered"
                unelevated style="left: 55px; bottom:5px;" size="11px" @click="dialogUpdateAvatar = true" />
            </q-item-section>
          </q-item>
        </div>
        <div class="tw-flex tw-justify-center tw-border tw-border-white tw-mb-4">
          <q-item>
            <q-item-section class="text-center">
              <q-item-label class="tw-text-center tw-font-bold">{{ user?.name }}</q-item-label>
              <q-item-label caption lines="2">{{ user?.email }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <LanguageSelect />

        <q-item clickable v-close-popup @click="toggle">
          <q-item-section side>
            <q-icon :name="theme === 'Dark' ? 'nights_stay' : 'wb_sunny'"
              :color="$q.dark.isActive ? 'light' : 'primary'" />
          </q-item-section>
          <q-item-section>{{ theme }} Mode</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup to="signin">
          <q-item-section side>
            <q-icon name="mdi-exit-to-app" color="negative" />
          </q-item-section>
          <q-item-section>Logout</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>

  <q-dialog v-model="dialogUpdateAvatar" persistent :position="$q.screen.lt.sm ? 'bottom' : 'standard'">
    <upload-profile-image @close="() => { dialogUpdateAvatar = false }" :photo="getProfileImage"
      @update="(val) => { updateProfile(val) }" />
  </q-dialog>
</template>

<style lang="sass"></style>