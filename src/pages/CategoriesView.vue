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
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar :icon="transaction.icon" color="white" text-color="primary" />
            </q-item-section>
            <q-item-section>
              {{ transaction.name }}
            </q-item-section>
            <!-- <q-item-section side>
              <q-icon name="mdi-tab-plus" color="primary" @click.stop="() => { console.log('print'); }" />
            </q-item-section> -->
          </template>

          <q-expansion-item v-for="subCategory in transaction.SubCategoryBalance" :key="subCategory.id"
            :header-inset-level=".2" expand-separator :icon="subCategory.icon || 'mdi-email-outline'"
            :label="subCategory.name || '-'" header-class="bg-grey-2 text-border-color" v-model="subCategory.expanded">
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar :icon="subCategory.icon || 'mdi-email-outline'" color="white" text-color="primary" />
              </q-item-section>
              <q-item-section>
                {{ subCategory.name || '-' }}
              </q-item-section>
              <q-item-section side>
                <div class="flex">
                  <q-icon name="mdi-table-column-plus-after" class="tw-mr-2" color="primary" size="25px"
                    @click.stop="subCategory.expanded = true, addSubCategory(subCategory.ReferenceCategoryBalance)">
                    <q-tooltip>Add a new word to associate on this subcategory</q-tooltip>
                  </q-icon>

                  <q-icon name="mdi-delete" color="negative" size="25px"
                    @click.stop="confirmDeleteCategory = true, deleteCategory = subCategory">
                    <q-tooltip>Delete the whole Category</q-tooltip>
                  </q-icon>
                </div>
              </q-item-section>
            </template>

            <div v-if="subCategory.ReferenceCategoryBalance.length > 0" class="q-pa-lg">
              <q-chip v-for="(referenceCategory, index) in subCategory.ReferenceCategoryBalance"
                :key="referenceCategory.id" removable
                :icon-remove="referenceCategory.canDelete ? 'mdi-close-circle-outline' : 'mdi-close-circle'"
                @update:value="beforeRemove(referenceCategory, subCategory.ReferenceCategoryBalance)"
                @remove="beforeRemove(referenceCategory, subCategory.ReferenceCategoryBalance)"
                v-model="referenceCategory.isActive" :color="referenceCategory.name != '' ? 'teal' : 'tw-slate-500'"
                @focusout="referenceCategory.canDelete = false" text-color="white" icon="mdi-chevron-right">

                <q-input dense dark borderless v-model="referenceCategory.name"
                  :ref="el => { if (el) itemRefs[index] = el }"
                  @update:model-value="newValue => upsertCategory(subCategory, referenceCategory, newValue)"
                  class="tw-min-w-3 tw-uppercase" debounce="600"
                  @keydown.enter="addSubCategory(subCategory.ReferenceCategoryBalance)">
                </q-input>
              </q-chip>

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

    <q-dialog v-model="confirmDeleteCategory" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete the user "{{ deleteCategory.name }}" ?</span>
          <div class="text-subtitle2">This action can't be undone</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="primary" :label="$t('cancel')" class="tw-px-3" outline no-caps dense unelevated v-close-popup />
          <q-btn color="negative" class="tw-px-3" :label="$t('delete')" dense unelevated
            @click="clickedToDeleteCategory" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { useTransactionComposable } from 'src/composables/transactionComposable';
import { ref, watch, computed, nextTick } from 'vue'
import AddCategory from 'src/components/transaction/AddCategory.vue'
const { createSubCategoryService, updateSubCategoryService, deleteSubCategoryService, deleteReferenceSubCategoryService, getCategoryTransactionService } = useTransactionComposable();
import { notify } from 'src/utils/helpers'

const confirmDeleteCategory = ref<boolean>(false)
const deleteCategory = ref<any>(null);
const categoryTransaction = ref<any[]>([]);
const itemRefs = ref([]);
const categoryTransactionService = async () => {
  const result = await getCategoryTransactionService();
  categoryTransaction.value = result.data;
}

const addSubCategory = (list: any) => {
  let lastItemName = null;
  if (list.length > 0) {
    lastItemName = list.at(-1).name;
    if (!lastItemName) return;
  }
  list.push({
    id: '',
    name: '',
    isActive: true,
    icon: 'mdi-email-outline',
    ReferenceCategoryBalance: []
  })
  nextTick(() => {
    let index = list.length - 1;
    let input = itemRefs.value[index];
    if (input) {
      input.focus();
    }
  });
}

const beforeRemove = (referenceSubCategory: any, referenceSubCategoryList: any[]) => {
  referenceSubCategory.isActive = true
  if (!referenceSubCategory.canDelete) {
    referenceSubCategory.canDelete = true;
    return;
  }
  referenceSubCategory.isActive = false;
  removeReferenceCategory(referenceSubCategoryList, referenceSubCategory.id)
}

const clickedToDeleteCategory = async () => {
  const response = await deleteSubCategoryService(deleteCategory.value.id)
  if (response.status === 200) {
    notify('positive', 'Category Deleted', 'Category was deleted successfully');
    confirmDeleteCategory.value = false;
    // Possibly to delete from the Array manually to not need to request `categoryTransactionService` to update the list over again
    // var removeIndex = ReferenceCategoryBalance.map(item => item.id).indexOf(id);
    // if (removeIndex > -1) ReferenceCategoryBalance.splice(removeIndex, 1);
    categoryTransactionService();
  } else notify('negative', 'ERROR', '');
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
  nextTick(() => {
    console.log("🚀 ~ upsertCategory ~ subCategory:", subCategory)
    console.log("🚀 ~ nextTick ~ referenceCategory:", referenceCategory)
    let index = subCategory.ReferenceCategoryBalance.length - 1;
    console.log("🚀 ~ nextTick ~ index:", index)
    let input = itemRefs.value[index];
    if (input) {
      input.focus();
    }
  });
}

const removeReferenceCategory = async (ReferenceCategoryBalance: any, id: string) => {
  var removeIndex = ReferenceCategoryBalance.map(item => item.id).indexOf(id);
  if (removeIndex > -1) ReferenceCategoryBalance.splice(removeIndex, 1);

  if (!id) return;
  const response = await deleteReferenceSubCategoryService(id);
  if (response?.status === 200 || response?.status === 201) notify('positive', 'Sub Category removed successfully', '');
  else notify('negative', 'ERROR', '');
  return response;
}

categoryTransactionService();

</script>
