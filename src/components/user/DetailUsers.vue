<template>
    <q-card flat style="width: 600px;" bordered>
        <q-toolbar>
            <q-toolbar-title class="text-body1">
                Detalhes -user
            </q-toolbar-title>
            <!-- <q-btn flat round dense icon="sym_r_close" to="/balance" /> -->
            <q-btn flat round dense icon="sym_r_close" @click="closeDetailUser" />
        </q-toolbar>
        <q-separator />
        <q-card-section class="q-pt-none">
            <q-form @submit="saveUser">
                <q-list>
                    <q-item v-if="id">
                        <q-item-section side>
                            <q-icon name="sym_r_fingerprint" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>ID</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-item-label>{{ oneUser?.id }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item>
                        <q-item-section side>
                            <q-icon name="sym_r_person" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Name</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-item-label lines="2">
                                <span v-if="id">{{ oneUser?.name }}</span>
                                <span v-else>
                                    <div style="width: 230px">
                                        <q-input v-model="oneUser.name" :rules="[isRequired]" type="text" dense outlined
                                            :bg-color="$q.dark.isActive ? 'grey-10' : 'white'" clear-icon="sym_r_close"
                                            clearable>
                                        </q-input>
                                    </div>
                                </span>
                            </q-item-label>
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
                            <q-item-label>

                                <span v-if="id">{{ oneUser?.email }}</span>
                                <span v-else>
                                    <div style="width: 230px">
                                        <q-input v-model="oneUser.email" :rules="[isRequired, isEmail]" type="email"
                                            dense outlined :bg-color="$q.dark.isActive ? 'grey-10' : 'white'"
                                            clear-icon="sym_r_close" clearable>
                                        </q-input>
                                    </div>
                                </span>
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item v-if="!id">
                        <q-item-section side>
                            <q-icon name="sym_r_password" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Temporary Password</q-item-label>
                        </q-item-section>
                        <q-item-section side top>
                            <q-item-label>
                                <div style="width: 230px">
                                    <q-input :rules="[isRequired]" v-model="oneUser.password" type="password" dense
                                        outlined :bg-color="$q.dark.isActive ? 'grey-10' : 'white'"
                                        clear-icon="sym_r_close" clearable>
                                    </q-input>
                                </div>
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item v-if="id">
                        <q-item-section side>
                            <q-icon name="sym_r_description" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Is Verified</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <div style="min-width: 230px">
                                <q-chip text-color="white" :color="oneUser?.isVerified ? 'primary' : 'negative'"
                                    :label="oneUser?.isVerified.toString()" />
                            </div>
                        </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item>
                        <q-item-section side>
                            <q-icon name="sym_r_description" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Role</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <div style="width: 230px">
                                <q-select v-model="rolePreference" :rules="[isSelectRequired]" :options="roleList"
                                    label="Role" outlined dense map-options dropdown-icon="sym_r_expand_more" color-icon
                                    :bg-color="$q.dark.isActive ? 'grey-9' : 'grey-1'" />
                            </div>
                        </q-item-section>
                    </q-item>
                    <q-separator v-if="id" />
                    <q-item v-if="id">
                        <q-item-section side>
                            <q-icon name="sym_r_description" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Preference</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <div class="q-gutter-y-md" style="min-width: 230px">
                                <q-select v-model="themePreference" :options="themeList" label="Theme" outlined dense
                                    map-options dropdown-icon="sym_r_expand_more" color-icon
                                    :bg-color="$q.dark.isActive ? 'grey-9' : 'grey-1'" />
                                <q-select v-model="languagePreference" :options="languageList" label="Language" outlined
                                    dense map-options dropdown-icon="sym_r_expand_more" color-icon
                                    :bg-color="$q.dark.isActive ? 'grey-9' : 'grey-1'" />
                            </div>
                        </q-item-section>
                    </q-item>

                </q-list>
                <q-space />
                <div class="row item-center justify-end q-gutter-md q-mt-sm q-mr-sm">
                    <q-btn color="primary" :label="$t('cancel')" class="tw-px-3" outline no-caps dense unelevated
                        @click="closeDetailUser" />
                    <q-btn color="primary" class="tw-px-3" :label="$t('save')" dense unelevated type="submit" />
                </div>
            </q-form>
        </q-card-section>

    </q-card>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { userComposable } from 'src/composables/userComposable'
import {
    notify,
    isRequired,
    isSelectRequired,
    isEmail,
} from 'src/utils/helpers'
const themePreference = ref<{ label: string, value: string }>(
    { label: '', value: '' }
);
const languagePreference = ref<{ label: string, value: string }>(
    { label: '', value: '' }
);
const rolePreference = ref<{ label: string, value: string }>(
    { label: '', value: '' }
);

const emit = defineEmits(['close', 'updated'])
const { oneUser, updateUser, createUser, getUserById, setOneUser } = userComposable()

const props = defineProps({
    id: {
        type: String,
        required: false,
        default: ''
    },
})
const router = useRouter();

const saveUser = async () => {
    setOneUser({
        ...oneUser.value,
        preference: {
            theme: themePreference.value?.value ?? null,
            language: languagePreference.value?.value ?? null,
        },
        role: rolePreference.value?.value ?? null,
    })
    if (props.id) {
        await updateUser(props.id, oneUser.value);
        emit('updated');
        closeDetailUser();
    }
    else {
        const response = await createUser(oneUser.value);
        if (response?.status === 201) {
            notify('positive', 'User saved successfully', '');
            emit('updated');
            closeDetailUser();
        }
        else notify('negative', response.response.data.error, response.response.data.message);
    }
}

const themeList = [
    { label: 'Light', value: 'LIGHT' },
    { label: 'Dark', value: 'DARK' },
]

const roleList = [
    { label: 'BASIC', value: 'BASIC' },
    { label: 'EDITOR', value: 'EDITOR' },
    { label: 'ADMIN', value: 'ADMIN' },
]

const languageList = [
    { label: 'English', value: 'en' },
    { label: 'Portuguese', value: 'pt' },
]

watch(() => props.id, async () => {
    if (props.id) {
        await getUserById(props.id);

        // Validating data
        themePreference.value =
            oneUser.value?.preference.theme
                ? oneUser.value?.preference.theme === 'LIGHT'
                    ? { label: 'Light', value: 'LIGHT' }
                    : { label: 'Dark', value: 'DARK' }
                : { label: '', value: '' };

        languagePreference.value =
            oneUser.value?.preference.language
                ? oneUser.value?.preference.language === 'EN'
                    ? { label: 'English', value: 'en' }
                    : { label: 'Portuguese', value: 'pt' }
                : { label: '', value: '' };

        rolePreference.value =
            oneUser.value?.role
                ? oneUser.value?.role === 'BASIC'
                    ? { label: 'BASIC', value: 'BASIC' }
                    : oneUser.value?.role === 'EDITOR'
                        ? { label: 'EDITOR', value: 'EDITOR' }
                        : { label: 'ADMIN', value: 'ADMIN' }
                : { label: '', value: '' };

    } else {
        setOneUser({});
    }
}, { immediate: true });

const closeDetailUser = () => {
    emit('close');
    router.push({ path: '/users' })
}

</script>