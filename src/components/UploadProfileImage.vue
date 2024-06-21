<template>
  <q-file ref="refInput" v-show="false" bottom-slots v-model="image" accept="image/*" @update:model-value="setImage" />
  <q-card flat :style="$q.screen.lt.sm ? 'max-width:100%' : 'min-width:412px'" bordered>
    <q-toolbar>
      <q-toolbar-title class="text-body1">
        Foto de perfil
      </q-toolbar-title>
      <q-btn flat round dense icon="sym_r_close" v-close-popup />
    </q-toolbar>
    <q-separator />
    <q-card-section class="text-center q-py-lg" style="min-width:300px">
      <div v-if="!cropImg">
        <q-avatar v-if="!cropImg" size="72px" font-size="72px" color="white"
          class="cursor-pointer bg-transparent text-primary" rounded @click="refInput.pickFiles()">
          <q-tooltip class="text-body2 bg-accent" v-if="disable">
            {{ photo ? 'Alterar imagem' : 'Adicionar imagem' }}
          </q-tooltip>
          <q-icon name="sym_r_add_a_photo" />
        </q-avatar>
        <div class="text-subtitle2 text-primary">Adicionar foto</div>
      </div>
      <q-avatar size="16rem" v-else>
        <q-img spinner-color="white" :ratio="size.width / size.height" :src="cropImg" spinner-size="82px" fit="contain"
          :style="$q.platform.is.mobile ? 'max-width: 300px' : 'max-width:500px'">
          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-negative text-white">Não é possível carregar a
              imagem
            </div>
          </template>
        </q-img>
        <!-- <vue3-lottie :animationData="partyJSON" :height="300" :width="300" :loop="false" class="absolute"
          ref="refLottie" /> -->
        <q-btn color="white" text-color="primary" icon="sym_r_edit" round unelevated dense v-if="cropImg"
          @click="refInput.pickFiles()" class="absolute q-card--bordered" style="bottom: 10px; right: 50px">
          <q-tooltip class="text-body2"> Editar </q-tooltip>
        </q-btn>
        <q-btn color="red-4" icon="sym_r_delete" round unelevated dense v-if="cropImg" @click.stop="clearImage()"
          class="absolute q-card--bordered" style="bottom: 10px; right: 10px">
          <q-tooltip class="text-body2"> Remover imagem </q-tooltip>
        </q-btn>
      </q-avatar>
    </q-card-section>
    <q-separator />
    <q-card-section class="row item-center justify-end q-gutter-sm">
      <q-btn color="primary" label="Cancelar" outline no-caps dense unelevated v-close-popup />
      <q-btn color="primary" label="Salvar" no-caps dense unelevated @click="onEditAvatar" />
    </q-card-section>
  </q-card>
  <q-dialog v-model="dialogCrop" persistent :position="$q.screen.lt.sm ? 'right' : 'standard'">
    <q-card style="max-height: 90vh" class="scroll" flat bordered>
      <q-toolbar>
        <q-toolbar-title class="text-body1">Corta imagem </q-toolbar-title>
        <q-btn flat round dense icon="close" class="text-grey-6" v-close-popup />
      </q-toolbar>
      <q-separator />
      <q-card-section class="avatar">
        <vue-cropper ref="refCropper" guides :aspect-ratio="size.width / size.height" @ready="$q.loading.hide()"
          style="max-height: 50vh" :class="$q.screen.lt.sm ? 'scroll' : ''" />
      </q-card-section>
      <q-card-section class="q-py-sm bg-grey-2">
        <div class="row">
          <div class="col q-gutter-sm">
            <q-btn color="white" round unelevated text-color="primary" class="q-card--bordered" icon="sym_r_crop_free"
              @click="resetCropper" v-if="!$q.screen.lt.sm" />
            <q-btn color="white" round unelevated text-color="primary" class="q-card--bordered" icon="sym_r_rotate_left"
              @click="rotateLeft" />
            <q-btn color="white" round unelevated text-color="primary" class="q-card--bordered"
              icon="sym_r_rotate_right" @click="rotateRight" />
          </div>
          <div class="col text-right">
            <q-btn unelevated round color="primary" icon="sym_r_crop" v-close-popup @click="cropImage" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
// import { updateProfileService } from '@/services/accountServices'
// import { uploadFileExerciseService } from '@/services/fileServices'
import { userComposable } from 'src/composables/userComposable'
import { Vue3Lottie } from 'vue3-lottie'
import { useQuasar } from 'quasar'
import partyJSON from 'src/assets/lottie/party.json'
import { notify } from 'src/utils/helpers'

const { updateUserProfileImage } = userComposable()
const $q = useQuasar()
const refInput = ref<any>(null)
const refCropper = ref<any>(null)
const refLottie = ref<any | null>(null)
const dialogCrop = ref<boolean>(false)
const disable = ref<boolean>(false)
const image = ref<any | null>(null)
const imgSrc = ref<any | null>(null)
const cropImg = ref<any | null>(null)
const file = ref<any | null>(null)
const emit = defineEmits(['update', 'close'])
const props = defineProps({
  photo: {
    type: [Blob, String],
    default: null
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  size: {
    type: Object,
    default: () => ({ height: 1000, width: 1000 })
  },
})
const image_url = ref<string | null>(null)



function setImage(file: any): void {
  $q.loading.show()
  dialogCrop.value = true
  file.value = file
  if (!file.value.type.includes('image/')) {
    alert('Porfavor selecione uma imagem')
    return
  }
  if (typeof FileReader === 'function') {
    const reader = new FileReader()
    reader.onload = (event: any) => {
      refCropper.value.setCropBoxData({
        left: 0,
        top: 0,
        width: 100,
        height: 100
      })
      imgSrc.value = event.target.result
      refCropper.value.replace(event.target.result)
    }
    reader.readAsDataURL(file.value)
    $q.loading.hide()
  } else {
    alert('Desculpe, seu navegador não suporta a API FileReader')
  }
}
function cropImage(): void {
  $q.loading.show()
  cropImg.value = refCropper.value.getCroppedCanvas().toDataURL()
  let canvas = refCropper.value.getCroppedCanvas({
    width: props.size.width,
    height: props.size.height
  })
  canvas.toBlob((blob: any) => {
    image.value = blob
  })
  $q.loading.hide()
  refLottie.value.play()
}
function clearImage(): void {
  cropImg.value = null
  file.value = null
  image.value = null
}
function resetCropper(): void {
  refCropper.value.reset()
}
function rotateLeft(): void {
  refCropper.value.rotate(-90)
}
function rotateRight(): void {
  refCropper.value.rotate(90)
}
function getNameImage(name: string) {
  if (name.length > 0) {
    const ArryName = name.split('/')
    return ArryName[ArryName.length - 1]
  }
  else return ' '
}
function initInputCrop(): void {
  if (props.photo && image.value == null) {
    cropImg.value = props.photo
    image.value = getNameImage(cropImg.value) ? new File([''], getNameImage(cropImg.value)) : null
  }
}
async function uploadFile(file: any): Promise<any> {
  console.log('🚀 ~ file: UploadProfileImage.vue:184 ~ uploadFile ~ file:', file)
  try {
    const { data, status } = await updateUserProfileImage(file)
    if (status === 201) return data
  } catch (error) {
    notify('negative', 'Erro ao fazer upload do arquivo', '', 'close');
    return null
  }
}
async function onEditAvatar(): Promise<void> {
  try {
    $q.loading.show()
    image_url.value = await uploadFile(image.value)
    // updateUserProfileImage()
    // const { status, data } = await updateProfileService({ avatar_url: image_url.value })
    // if (status === 200) {
    //     emit('update', data)
    notify('positive', 'Avatar editado com sucesso', '', 'check');
    emit('close')
    // }
  } catch (error) {
    console.log(error)
    if (!image_url.value) notify('negative', 'Erro ao editar avatar', '', 'close');

  } finally {
    $q.loading.hide()
  }
}

watch(
  () => props.photo,
  (val) => {
    if (val) initInputCrop()
  }
)
onMounted(() => {
  initInputCrop()
})

onUnmounted(() => {
  clearImage()
})
</script>

<style lang="sass">
.avatar
    .cropper-crop-box
        border-radius: 50% !important
    .cropper-view-box
        border-radius: 50%  !important
        box-shadow: 0 0 0 1px #39f  !important
        outline: 0 !important
    .cropper-face
        background-color: inherit !important
    .cropper-dashed
        display: none !important
    .cropper-point
        &.point-se, &.point-sw, &.point-nw, &.point-ne
            display: none !important
    .cropper-line
        display: none !important
    .cropper-view-box
        outline: inherit !important
</style>
```
