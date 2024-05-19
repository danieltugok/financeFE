<script setup lang="ts">
import { UserStore } from 'src/stores/user'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue';
const { userMenu } = storeToRefs(UserStore())
import { userComposable } from 'src/composables/userComposable'

const { getUserMenu } = userComposable()

onMounted(() => {
    getUserMenu();
})
</script>

<!-- <q-item-label header>Menu</q-item-label> -->
<template>
    <div class="q-pa-md" style="max-width: 350px">
        <q-list class="rounded-borders">
            <template v-for="item in userMenu" :key="item.name">
                <q-expansion-item v-if="item.children && item.children.length > 1" :label="item.name" :icon="item.icon"
                    :caption="item.caption" :content-inset-level="0.5">
                    <q-item v-for="child in item.children" :key="child.name" clickable tag="a" :to="child.route">
                        <q-item-section avatar v-if="child.icon">
                            <q-icon :name="child.icon" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>{{ child.name }}</q-item-label>
                            <q-item-label caption v-if="child?.caption !== '-'">{{ child?.caption }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-expansion-item>
                <q-item v-else clickable tag="a" :to="item.route">
                    <q-item-section avatar v-if="item.icon">
                        <q-icon :name="item.icon" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>{{ item.name }}</q-item-label>
                        <q-item-label caption v-if="item.caption !== '-'">{{ item.caption }}</q-item-label>
                    </q-item-section>
                </q-item>
            </template>
        </q-list>
    </div>
</template>

<style lang='sass'>

</style>