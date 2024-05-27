<!-- eslint-disable @typescript-eslint/no-unused-vars -->

<template>
  <q-page class="wrapper" padding>
    <q-breadcrumbs v-if="!$q.screen.lt.sm">
      <template v-slot:separator>
        <q-icon size="1.2em" name="chevron_right" color="primary" />
      </template>
      <q-breadcrumbs-el label="Principal" to="/" />
      <q-breadcrumbs-el label="Transações" />
    </q-breadcrumbs>
    <q-toolbar class="q-px-none q-my-sm">
      <q-toolbar-title> Users </q-toolbar-title>
      <div class="row q-gutter-md items-center">
        <template v-for="item in Object.keys(filterUsers)" :key="item">
          <q-chip removable @remove="onRemoveFilter(item)" icon-remove="sym_r_close" :label="item" text-color="white"
            color="primary" />
        </template>
        <q-btn :text-color="$q.dark.isActive ? 'white' : 'dark'" :color="$q.dark.isActive ? 'primary' : 'white'"
          icon="mdi-tab-plus" class="borderless q-card--bordered" @click="detailDialog = !detailDialog" dense unelevated
          padding="sm">
        </q-btn>
        <q-input v-model="search" type="search" label="Buscar..." dense outlined
          :bg-color="$q.dark.isActive ? 'grey-10' : 'white'" debounce="300" clear-icon="sym_r_close" clearable>
          <template v-slot:prepend>
            <q-icon name="sym_r_search" />
          </template>
        </q-input>
        <!-- <input-date-ranger @update="onFilterDate" dense outlined clear-icon="sym_r_close" clearable
          :bg-color="$q.dark.isActive ? 'grey-10' : 'white'" /> -->
        <!-- <q-btn :text-color="$q.dark.isActive ? 'white' : 'dark'" :color="$q.dark.isActive ? 'primary' : 'white'"
          :icon="filterDialog ? 'sym_r_filter_list_off' : 'sym_r_filter_list'" class="borderless q-card--bordered"
          @click="setFilterDrawerTransaction(!filterDrawerTransaction)" dense unelevated padding="sm">
          <q-badge color="secondary" floating v-if="Object.keys(filterUsers).length > 0">
            {{ Object.keys(filterUsers).length }}</q-badge>
        </q-btn> -->
      </div>
    </q-toolbar>
    <list-users />
  </q-page>
  <q-dialog v-model="detailDialog" persistent>
    <detail-users @close="detailDialog = false" @updated="transactionDetailUpdated"
      :id="typeof $route.params.id === 'string' ? $route.params.id : ''" />
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ListUsers from 'src/components/user/ListUsers.vue'
import DetailUsers from 'src/components/user/DetailUsers.vue';
import { userComposable } from 'src/composables/userComposable'
import { useRoute } from 'vue-router'

const { getUsers, queryUsers, setQueryUsers, filterUsers, setFilterUsers } = userComposable()
const filterDialog = ref<boolean>(false)
const detailDialog = ref<boolean>(false)
const search = ref<string>('')
const route = useRoute()

watch(search, (value) => {
  setQueryUsers({ ...queryUsers.value, name: value })
  getUsers(queryUsers.value)
})

watch(() => route.params.id, (newId, oldId) => {
  onOpenDetail()
}, { immediate: true })

const transactionDetailUpdated = () => {
  console.log('updated')
  getUsers(queryUsers.value)
}

function onRemoveFilter(item: string): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [item]: _, ...rest } = filterUsers.value
  setFilterUsers(rest)
  setQueryUsers({ ...queryUsers.value, [item]: '' })
  getUsers(queryUsers.value)
}

function onFilterDate(date: any): void {
  let { from, to, ...rest } = date;
  from = from ? new Date(from).toISOString() : null;
  to = to ? new Date(to).toISOString() : null;
  let dateParse = { startDate: from, endDate: to, ...rest };

  setQueryUsers({ ...queryUsers.value, ...dateParse })
  getUsers(queryUsers.value)
}

function onOpenDetail(): void {
  if (route?.params?.id) detailDialog.value = true
  else detailDialog.value = false
}

</script>s