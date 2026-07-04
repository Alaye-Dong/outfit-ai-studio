<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMessage } from 'naive-ui'
import type { FormInst, FormRules, UploadFileInfo } from 'naive-ui'
import { createItem } from '@/api/items'
import { uploadImage } from '@/api/upload'
import type { ClothingItem, ClothingCategory } from '@/types/outfit'
import { categoryLabelMap } from '@/types/outfit'

const visible = defineModel<boolean>('visible', { default: false })
const emit = defineEmits<{
  (e: 'created', item: ClothingItem): void
}>()

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const uploading = ref(false)
const uploadedUrl = ref('')

const categoryOptions = Object.entries(categoryLabelMap).map(([value, label]) => ({
  label,
  value: value as ClothingCategory
}))

const seasonOptions = [
  { label: '春季', value: '春季' },
  { label: '夏季', value: '夏季' },
  { label: '秋季', value: '秋季' },
  { label: '冬季', value: '冬季' }
]

const occasionOptions = [
  { label: '日常', value: '日常' },
  { label: '通勤', value: '通勤' },
  { label: '休闲', value: '休闲' },
  { label: '运动', value: '运动' },
  { label: '约会', value: '约会' },
  { label: '派对', value: '派对' },
  { label: '商务', value: '商务' },
  { label: '度假', value: '度假' },
  { label: '户外', value: '户外' },
  { label: '购物', value: '购物' },
  { label: '街头', value: '街头' }
]

const formData = reactive({
  name: '',
  category: '' as ClothingCategory | '',
  color: '',
  season: [] as string[],
  occasion: [] as string[],
  imageUrl: '',
  note: ''
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入单品名称', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  color: [
    { required: true, message: '请输入颜色', trigger: 'blur' }
  ],
  season: [
    { type: 'array', required: true, message: '请选择至少一个季节', trigger: 'change' }
  ],
  occasion: [
    { type: 'array', required: true, message: '请选择至少一个场合', trigger: 'change' }
  ]
}

function resetForm() {
  formData.name = ''
  formData.category = ''
  formData.color = ''
  formData.season = []
  formData.occasion = []
  formData.imageUrl = ''
  formData.note = ''
  uploadedUrl.value = ''
}

async function handleUpload({ file }: { file: UploadFileInfo }) {
  if (!file.file) return

  uploading.value = true
  try {
    const result = await uploadImage(file.file)
    uploadedUrl.value = result.url
    formData.imageUrl = result.url
    message.success('图片上传成功')
  } catch (error) {
    message.error('图片上传失败')
    console.error('Upload failed:', error)
  } finally {
    uploading.value = false
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  loading.value = true
  try {
    const itemData = {
      name: formData.name,
      category: formData.category as ClothingCategory,
      color: formData.color,
      season: formData.season,
      occasion: formData.occasion,
      imageUrl: formData.imageUrl || `/uploads/${formData.name}.png`,
      note: formData.note || undefined
    }

    const newItem = await createItem(itemData)
    message.success('添加成功')
    emit('created', newItem)
    resetForm()
    visible.value = false
  } catch (error) {
    message.error('添加失败')
    console.error('Failed to create item:', error)
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  resetForm()
  visible.value = false
}
</script>

<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    title="添加新单品"
    style="width: 500px"
    :bordered="false"
    :mask-closable="false"
  >
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="left"
      label-width="80"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="名称" path="name">
        <n-input v-model:value="formData.name" placeholder="请输入单品名称" />
      </n-form-item>

      <n-form-item label="分类" path="category">
        <n-select
          v-model:value="formData.category"
          :options="categoryOptions"
          placeholder="请选择分类"
        />
      </n-form-item>

      <n-form-item label="颜色" path="color">
        <n-input v-model:value="formData.color" placeholder="请输入颜色" />
      </n-form-item>

      <n-form-item label="季节" path="season">
        <n-select
          v-model:value="formData.season"
          :options="seasonOptions"
          multiple
          placeholder="请选择季节"
        />
      </n-form-item>

      <n-form-item label="场合" path="occasion">
        <n-select
          v-model:value="formData.occasion"
          :options="occasionOptions"
          multiple
          placeholder="请选择场合"
        />
      </n-form-item>

      <n-form-item label="图片" path="imageUrl">
        <n-upload
          :max="1"
          accept="image/*"
          :custom-request="handleUpload"
          :disabled="uploading"
          list-type="image-card"
        >
          <n-button :loading="uploading">选择图片</n-button>
        </n-upload>
        <div v-if="uploadedUrl" class="uploaded-preview">
          <img :src="uploadedUrl" alt="预览" style="max-width: 100px; max-height: 100px; margin-top: 8px;" />
        </div>
      </n-form-item>

      <n-form-item label="备注" path="note">
        <n-input
          v-model:value="formData.note"
          type="textarea"
          placeholder="请输入备注（可选）"
          :rows="2"
        />
      </n-form-item>
    </n-form>

    <template #footer>
      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" :loading="loading" @click="handleSubmit">
          添加
        </n-button>
      </div>
    </template>
  </n-modal>
</template>