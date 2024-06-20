<template>
  <q-page class="wrapper" padding>
    <q-breadcrumbs v-if="!$q.screen.lt.sm">
      <template v-slot:separator>
        <q-icon size="1.2em" name="chevron_right" color="primary" />
      </template>
      <q-breadcrumbs-el label="Principal" to="/" />
      <q-breadcrumbs-el label="Categoria de Transações" />
    </q-breadcrumbs>
    <q-toolbar class="q-px-none q-my-sm">
      <q-toolbar-title> Categoria de Transações </q-toolbar-title>
    </q-toolbar>
    <div class="q-pa-md">
      <q-list bordered class="rounded-borders">
        <q-expansion-item v-for="transaction in categoryTransaction" :key="transaction.id" expand-separator
          :icon="transaction.icon" :label="transaction.name" caption=""
          header-class="bg-grey-3 text-weight-bold text-primary"
          :default-opened="transaction.SubCategoryBalance ? true : false">

          <q-expansion-item v-for="subCategory in transaction.SubCategoryBalance" :key="subCategory.id"
            :header-inset-level=".2" expand-separator :icon="subCategory.icon || 'mdi-email-outline'"
            :label="subCategory.name || '-'" header-class="bg-grey-2 text-border-color" default-opened>

            <div v-if="subCategory.ReferenceCategoryBalance.length > 0" class="q-pa-lg">
              <q-chip v-for="referenceCategory in subCategory.ReferenceCategoryBalance" :key="referenceCategory.id"
                removable @remove="removeCategory(referenceCategory.id)" v-model="referenceCategory.isActive"
                :color="referenceCategory.name != '' ? 'teal' : 'tw-slate-500'" text-color="white"
                icon="mdi-chevron-right">
                <!-- :label="referenceCategory.name" -->
                <!-- <q-input label-color="white" class="" v-model="referenceCategory.name" type="text" /> -->
                <!-- <q-tooltip>{{ referenceCategory.name }}</q-tooltip> -->

                <q-input dense dark borderless v-model="referenceCategory.name" ref="itemRefs"
                  @update:model-value="newValue => upsertCategory(subCategory, referenceCategory, newValue)"
                  class="tw-min-w-3 tw-uppercase" debounce="600">
                  <!-- <template v-slot:append>
                    <q-icon v-if="referenceCategory.name === ''" name="search" />
                    <q-icon v-else name="clear" class="cursor-pointer" @click="referenceCategory.name = ''" />
                  </template> -->
                </q-input>
              </q-chip>
              <!-- <div v-if="subCategory.ReferenceCategoryBalance.at(-1).name != ''" -->
              <div
                class="q-chip row inline no-wrap items-center bg-primary text-white q-chip--colored tw-cursor-pointer"
                @click="addSubCategory(subCategory.ReferenceCategoryBalance)">
                <q-chip class="tw-cursor-pointer" color="primary" text-color="white" icon="add">
                  <q-tooltip>Add a new word to associate on this subcategory</q-tooltip>
                </q-chip>
              </div>
            </div>
          </q-expansion-item>
        </q-expansion-item>
      </q-list>
    </div>

    <q-dialog v-model="addSubCategoryDialog" persistent>
      <AddCategory @close="addSubCategoryDialog = false"
        :id="typeof $route.params.id === 'string' ? $route.params.id : ''" />
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { useTransactionComposable } from 'src/composables/transactionComposable';
import { ref, watch, computed } from 'vue'
import AddCategory from 'src/components/transaction/AddCategory.vue'
const { createSubCategoryService, updateSubCategoryService, deleteSubCategoryService, getCategoryTransactionService } = useTransactionComposable();
import { notify } from 'src/utils/helpers'

const addSubCategoryDialog = ref<boolean>(false)
const categoryTransaction = ref<any[]>([]);

const categoryTransactionService = async () => {
  const result = await getCategoryTransactionService();
  categoryTransaction.value = result.data;
}
const itemRefs = ref<any[]>([])
const addSubCategory = (list: any) => {
  const lastItemName = list.at(-1).name;
  if (!lastItemName) return;
  list.push({
    id: '',
    name: '',
    isActive: true,
    icon: 'mdi-email-outline',
    ReferenceCategoryBalance: []
  })
  // let test = itemRefs.value.findIndex(el => el.nativeEl._value === lastItemName);
  // itemRefs.value.at(test + 1).focus()
}

const upsertCategory = async (subCategory: any, referenceCategory: any, name: any) => {
  let response;
  if (!referenceCategory.id) {
    referenceCategory.id = 'XXX';
    response = await createSubCategoryService(subCategory.id, { name });
  } else {
    response = await updateSubCategoryService(referenceCategory.id, { name })
  }
  if (response?.status === 200 || response?.status === 201) {
    notify('positive', 'Sub Category saved successfully', '');
    if (referenceCategory.id === 'XXX') referenceCategory.id = response.data.id;
  }
  else notify('negative', response.response.data.error, response.response.data.message);
  return response;
}

const removeCategory = async (id: string) => {
  if (!id) return;
  const response = await deleteSubCategoryService(id);
  if (response?.status === 200 || response?.status === 201) notify('positive', 'Sub Category removed successfully', '');
  else notify('negative', 'ERROR', '');
  return response;
}




categoryTransactionService();

</script>
