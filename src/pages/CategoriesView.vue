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
                removable v-model="referenceCategory.isActive" color="teal" text-color="white" icon="cake"
                :label="referenceCategory.name">
                <q-tooltip>{{ referenceCategory.name }}</q-tooltip>
              </q-chip>
              <div class="q-chip row inline no-wrap items-center bg-teal text-white q-chip--colored tw-cursor-pointer"
                @click="addSubCategory(subCategory.ReferenceCategoryBalance)">
                <q-chip class="tw-cursor-pointer" color="teal" text-color="white" icon="add">
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
import { ref, watch } from 'vue'
import AddCategory from 'src/components/transaction/AddCategory.vue'
const { getCategoryTransactionService } = useTransactionComposable();

const addSubCategoryDialog = ref<boolean>(false)
const categoryTransaction = ref<any[]>([]);

const categoryTransactionService = async () => {
  const result = await getCategoryTransactionService();
  categoryTransaction.value = result.data;
}

const addSubCategory = (list: any) => {
  list.push({
    id: '',
    name: '',
    isActive: true,
    icon: 'mdi-email-outline',
    ReferenceCategoryBalance: []
  })
  console.log('>>>', list)

}

categoryTransactionService();

</script>