<template>
    <q-table :rows="users" row-key="id" :key="Date.now()" flat :columns="columns" :pagination="pagination"
        hide-pagination class="table-card bg-transparent" @row-click="onDetaill">
        <template #body-cell-isVerified="props">
            <q-td :props="props">
                <q-chip :label="`${props.row.isVerified}`" text-color="white"
                    :color="props.row.isVerified ? 'positive' : 'negative'" />
            </q-td>
        </template>
        <template #body-cell-delete="props">
            <q-td :props="props">
                <q-btn color="white" text-color="negative" icon="delete" dense round unelevated size="11px"
                    @click.stop="onDelete(props.row)" />
            </q-td>
        </template>
    </q-table>
    <div class="row item-center q-mt-sm">
        <div class="row item-center q-mt-sm" :class="$q.screen.lt.sm ? 'justify-center' : 'justify-center'"
            v-if="countUsers > pagination.rowsPerPage">
            <q-pagination v-if="pagination.rowsPerPage !== 0" v-model="page" :max="pagesNumber"
                :max-pages="$q.screen.lt.sm ? 4 : 9" active-design="unelevated"
                :color="$q.dark.isActive ? 'white' : 'dark'" active-color="primary" direction-links gutter="sm" />
        </div>
        <q-space />
        <q-select class="tw-min-w-[120px]" v-model="perPage" :options="perPageOptions" label="Per Page" outlined dense
            map-options emit-value dropdown-icon="sym_r_expand_more" color-icon
            :bg-color="$q.dark.isActive ? 'grey-9' : 'grey-1'" />
    </div>

    <q-dialog v-model="confirmDelete" persistent>
        <q-card>
            <q-card-section class="row items-center">
                <q-avatar icon="delete" color="negative" text-color="white" />
                <span class="q-ml-sm">Are you sure you want to delete the user "{{ deleteUser.name }}" ?</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn color="primary" :label="$t('cancel')" class="tw-px-3" outline no-caps dense unelevated
                    v-close-popup />
                <q-btn color="negative" class="tw-px-3" :label="$t('delete')" dense unelevated
                    @click="clickedToDeleteUser" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { QTableProps } from 'quasar';
import { date } from 'quasar'
import { useRouter } from 'vue-router'
import { userComposable } from 'src/composables/userComposable'
import { notify } from 'src/utils/helpers'
const route = useRouter()
const page = ref<number>(1);
const perPage = ref<number>(10);
const { users, getUsers, setQueryUsers, queryUsers, countUsers, deleteUsersService } = userComposable()
const deleteBtnClicked = ref<boolean>(false)
const confirmDelete = ref<boolean>(false);
const deleteUser = ref<any>(null);

const pagination = computed<any>({
    get: () => {
        return {
            rowsPerPage: +perPage.value,
            sortBy: 'created_at',
            descending: true
        }
    },
    set: (value) => {
        pagination.value = value
    }
})
const perPageOptions = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
]
const columns = ref<QTableProps['columns']>([
    {
        name: 'name',
        required: true,
        label: 'User',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
    },
    { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
    { name: 'isVerified', align: 'left', label: 'Is Verified', field: 'isVerified', sortable: true },
    { name: 'role', align: 'left', label: 'Role', field: 'role', sortable: true },
    { name: 'createdAt', align: 'left', label: 'Created at', field: 'createdAt', format: val => date.formatDate(val, 'DD/MM/YYYY') },
    { name: 'delete', align: 'left', label: 'Actions', field: 'delete' },
])
const pagesNumber = computed<number>(() => Math.ceil((countUsers.value || 0) / pagination.value.rowsPerPage))
function onDetaill(event: Event, row: any): void {
    if (!deleteBtnClicked.value) route.push({ name: 'UserDetail', params: { id: row.id } })
}
const onDelete = (row: any) => {
    confirmDelete.value = true
    deleteUser.value = row
}

const clickedToDeleteUser = async () => {
    const response = await deleteUsersService(deleteUser.value.id)
    if (response.status === 200) {
        notify('negative', 'User Deleted', 'User was deleted successfully');
        confirmDelete.value = false
        getUsers(queryUsers.value)
    }
}

watch(() => [page.value, perPage.value], () => {
    const query = {
        page: page.value,
        perPage: pagination.value.rowsPerPage,
    }
    setQueryUsers({ ...queryUsers.value, ...query })
    getUsers(queryUsers.value)
})

getUsers(queryUsers.value)

</script>