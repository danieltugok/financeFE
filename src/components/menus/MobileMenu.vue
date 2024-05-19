<template>
  <q-tabs align="center" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white text-dark'" switch-indicator>
    <q-route-tab v-for="menu in menus" :key="menu.id" :to="menu.route" :icon="menu.icon" />
  </q-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const menus = ref<any[]>([
  {
    icon: 'sym_r_dashboard',
    label: 'Dashboard',
    route: '/',
    children: []
  },
  {
    icon: 'sym_r_fitness_center',
    label: 'Meu treino',
    route: '/workout',
    children: []
  },
  {
    icon: 'sym_r_history',
    label: 'Histórico',
    route: '/history',
    children: []
  },
  {
    icon: 'sym_r_monitor_heart',
    label: 'Avaliações',
    route: '/evaluations',
    children: []
  }
])
</script>