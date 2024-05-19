<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :bordered="!$q.dark.isActive ? true : false" :class="{
      'bg-primary': $q.dark.isActive,
      'bg-white text-black': !$q.dark.isActive,
    }">
      <q-toolbar>
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" icon="menu"
          :color="$q.dark.isActive ? 'gray-300' : 'primary'" />
        <q-toolbar-title class="flex items-center">
          <div class="w-[24px] mr-3">
            <q-img class="saturate-50" src="src/assets/ico/world-cup-qatar-icon.png" width="24px"
              spinner-color="primary" spinner-size="82px" />
          </div>
          <h5 :class="$q.dark.isActive ? 'text-gray-300' : 'text-primary'">Studio 360</h5>

        </q-toolbar-title>
        <tool-bar />

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="250" :breakpoint="500"
      :bordered="$q.dark.isActive ? false : true" :class="$q.dark.isActive ? 'bg-secondary' : 'bg-grey-2'">
      <main-menu />
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import MainMenu from '../components/MainMenu.vue';
import ToolBar from '../components/ToolBar.vue';

const leftDrawerOpen = ref(false);

const $q = useQuasar()
// get status
console.log($q.dark.isActive) // true, false
// get configured status
console.log($q.dark.mode) // "auto", true, false


</script>