<template>
    <q-card flat style="width: 600px;" bordered>
        <q-toolbar>
            <q-toolbar-title class="text-body1">
                Detalhes
            </q-toolbar-title>
            <!-- <q-btn flat round dense icon="sym_r_close" to="/balance" /> -->
            <q-btn flat round dense icon="sym_r_close" @click="closeDetailTransaction" />
        </q-toolbar>
        <q-separator />
        <q-card-section class="q-pt-none">
            <q-list>
                <q-item>
                    <q-item-section side>
                        <q-icon name="sym_r_fingerprint" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>ID</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-item-label>{{ transaction.id }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                    <q-item-section side>
                        <q-icon name="sym_r_description" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Description</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <div class="q-gutter-md" style="min-width: 300px">
                            <q-input v-model="transaction.description" type="search" dense outlined
                                :bg-color="$q.dark.isActive ? 'grey-10' : 'white'" clear-icon="sym_r_close" clearable>
                                <!-- <q-item-label lines="2">{{ transaction.description }}</q-item-label> -->
                                <!-- <template v-slot:prepend>
                                    <q-icon name="sym_r_search" />
                                </template> -->
                            </q-input>
                        </div>
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                    <q-item-section side>
                        <q-icon name="sym_r_payments" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Valor</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-item-label lines="2">
                            <div class="q-gutter-md" style="min-width: 300px">
                                <q-input v-model="transaction.debit" type="search" dense outlined
                                    :bg-color="$q.dark.isActive ? 'grey-10' : 'white'" clear-icon="sym_r_close"
                                    clearable />
                            </div>
                            <!-- <span class="text-body1 text-weight-bold"
                                :class="+transaction.debit < 0 ? 'text-negative' : 'text-primary'">
                                R$ {{ transaction.debit }}</span> -->
                        </q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                    <q-item-section side>
                        <q-icon name="sym_r_calendar_month" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Date</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-item-label lines="2">
                            <!-- {{ date.formatDate(transaction.date, 'DD/MM/YYYY') }} -->
                            <div class="q-gutter-md" style="min-width: 300px">
                                <input-date :transitionDate="transaction.date" @update="dateUpdated" dense outlined
                                    clear-icon="sym_r_close" clearable
                                    :bg-color="$q.dark.isActive ? 'grey-10' : 'white'" />
                            </div>
                        </q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                    <q-item-section side>
                        <q-icon name="sym_r_person" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Creator</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-item-label lines="2">{{ transaction.user?.name }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                    <q-item-section side>
                        <q-icon name="sym_r_mail" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Email</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                        <q-item-label>{{ transaction.user?.email }}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
            <q-space />
            <div class="row item-center justify-end q-gutter-sm">
                <q-btn color="primary" :label="$t('cancel')" class="tw-px-3" outline no-caps dense unelevated
                    @click="closeDetailTransaction" />
                <q-btn color="primary" class="tw-px-3" :label="$t('save')" dense unelevated @click="saveTransaction" />
            </div>
        </q-card-section>
    </q-card>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useTransactionComposable } from 'src/composables/transactionComposable'
import { useRouter } from 'vue-router'
import { date } from 'quasar'
import InputDate from 'src/components/InputDate.vue'
import { userComposable } from 'src/composables/userComposable'
import { notify } from 'src/utils/helpers'

const emit = defineEmits(['close', 'updated'])
const { transaction, getTransactionById, setTransaction, setTransactionDetail, createTransactionDetail } = useTransactionComposable()
const { user } = userComposable()

const props = defineProps({
    id: {
        type: String,
        required: false,
        default: ''
    },
})
const router = useRouter();
const formattedDate = ref('');

const saveTransaction = async () => {
    if (props.id) {
        const response = await setTransactionDetail(transaction.value);
        console.log('🚀 ~ saveTransaction ~ response:', response)
        if (response?.status === 200 || response?.status === 201) {
            notify('positive', 'User saved successfully', '');
            emit('updated');
            closeDetailTransaction();
        }
        else notify('negative', response.response.data.error, response.response.data.message);

    }
    else {
        const response = await createTransactionDetail(transaction.value);
        if (response?.status === 200 || response?.status === 201) {
            notify('positive', 'User saved successfully', '');
            emit('updated');
            closeDetailTransaction();
        }
        else notify('negative', response.response.data.error, response.response.data.message);
    }
}

const dateUpdated = (value: any) => {
    setTransaction({ ...transaction.value, date: value })
}

watch(() => props.id, () => {
    if (props.id) {
        console.log('🚀 ~ watch ~ props.id:', props.id)
        getTransactionById(props.id)
    } else {
        setTransaction({ user: { name: user.value?.name, email: user.value?.email } });
    }
}, { immediate: true });

watch(() => transaction.value, () => {
    formattedDate.value = date.formatDate(transaction.value.date, 'DD/MM/YYYY')
}, { immediate: true });

const closeDetailTransaction = () => {
    emit('close');
    router.push({ path: '/balance' })
}

</script>