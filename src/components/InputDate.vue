<template>
    <q-input @clear="onClear" clear-icon="sym_r_close" @click="popupRef.show()" v-model="dateRange" v-bind="$attrs"
        placeholder="Filtrar por data" ref="inputRef">
        <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer" color="secondary">
                <q-popup-proxy ref="popupRef">
                    <q-date today-btn v-model="proxyDate"
                        @update:model-value="[popupRef.hide(), emit('update', proxyDate)]" color="accent" />
                </q-popup-proxy>
            </q-icon>
        </template>
    </q-input>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { date } from 'quasar'
const proxyDate = ref<any>(null)
const dateRange = ref<any>(null)
const inputRef = ref<any>(null)
const popupRef = ref<any>(null)
const emit = defineEmits(['update'])
const props = defineProps({
    value: {
        type: [String, Object],
        default: null
    },
    transitionDate: {
        type: String,
        default: null
    },
})


watch(proxyDate, (value: any) => {
    if (value) {
        dateRange.value = date.formatDate(value, 'DD/MM/YYYY')
    } else dateRange.value = null
}, { immediate: true })

watch(() => props.transitionDate, (value: any) => {
    if (value) proxyDate.value = date.formatDate(props.transitionDate, 'YYYY/MM/DD');
}, { immediate: true })

function onClear() {
    dateRange.value = null
    proxyDate.value = {}
    emit('update', proxyDate.value)
}
</script>