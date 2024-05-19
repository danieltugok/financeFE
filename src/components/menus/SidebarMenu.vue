<template>
    <q-scroll-area class="fit">
      <q-list>
        <template v-for="item in menus" :key="item.id">
          <template v-if="item.children && item.children?.length > 0">
            <q-expansion-item
              :icon="item.icon"
              :label="item.label"
              dense
              group="main-menu"
              class="overflow-hidden q-px-sm"
              :header-class="'rounded-borders q-py-sm q-mx-sm  q-px-sm q-my-xs '+ 
                (item.children.find((item: any) => item.route === currentRoute)
                  ? 'bg-primary text-white'
                  : 'text-primary')"
            >
              <q-card class="bg-transparent q-mx-md" flat>
                <q-card-section class="q-pa-xs">
                  <template v-for="child in item.children" :key="child.id">
                    <q-item
                      clickable
                      v-ripple
                      dense
                      class="q-pl-lg q-my-xs rounded-borders q-mx-md"
                      :class="currentRoute === child.route ? 'text-primary' : ''"
                      :to="{ path: child.route }"
                    >
                      <q-item-section>{{ child.label }}</q-item-section>
                    </q-item>
                  </template>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </template>
          <template v-else>
            <q-item
              clickable
              dense
              :to="{ path: item.route }"
              class="rounded-borders q-mx-md q-my-xs q-py-xs q-px-sm"
              color="grey-3"
              :class="currentRoute === item.route ? 'bg-primary text-white ' : ''"
            >
              <q-item-section side>
                <q-icon
                  :name="currentRoute === item.route ? item.icon : `sym_r_${item.icon}`"
                  :color="currentRoute === item.route ? 'white' : 'primary'"
                  :class="currentRoute === item.route ? 'q-pa-xs' : 'q-pa-xs rounded-borders'"
                />
              </q-item-section>
              <q-item-section :class="currentRoute === item.route ? 'text-weight-bold' : ''">{{
                item.label
              }}</q-item-section>
            </q-item>
          </template>
        </template>
      </q-list>
    </q-scroll-area>
  </template>
  <script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  const $router = useRouter()
  const currentRoute = computed<string>((): string => $router.currentRoute.value.path)
  const menus = ref<any[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/',
      children: []
    },
    {
      icon: 'fitness_center',
      label: 'Meu treino',
      route: '/workout',
      children: []
    },
    {
      icon: 'receipt_long',
      label: 'Fichas treinos',
      route: '/training_worksheets',
      children: []
    },
    {
      icon: 'history',
      label: 'Históricos de atividades',
      route: '/history',
      children: []
    },
    {
      icon: 'monitor_heart',
      label: 'Avaliações',
      route: '/evaluations',
      children: []
    },
    {
      icon: 'widgets',
      label: 'Gerenciar',
      route: '/evaluations',
      children: [
        {
          label: 'Exercicios',
          route: '/exercises',
          children: []
        },
        {
          label: 'Grupo muscular',
          route: '/muscle_groups',
          children: []
        }
      ]
    },
    {
      icon: 'live_help',
      label: 'Sobre',
      route: '/about',
      children: []
    }
  ])
  </script>