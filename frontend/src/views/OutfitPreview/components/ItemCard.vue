<script setup lang="ts">
import { computed } from 'vue'
import type { ClothingItem } from '@/types/outfit'
import { categoryLabelMap } from '@/types/outfit'
import { useOutfitStore } from '@/stores/outfit'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const props = defineProps<{ item: ClothingItem }>()
const emit = defineEmits<{
  (e: 'edit', item: ClothingItem): void
}>()
const store = useOutfitStore()

const imageUrl = computed(() => {
  if (!props.item.imageUrl) return ''
  return props.item.imageUrl.startsWith('http') 
    ? props.item.imageUrl 
    : `${BASE_URL}${props.item.imageUrl}`
})

const hasImage = computed(() => {
  return props.item.imageUrl && !props.item.imageUrl.includes('placeholder')
})

function handleAdd() {
  store.addItem(props.item)
}

function handleEdit() {
  emit('edit', props.item)
}
</script>

<template>
  <div class="item-card" :data-category="item.category">
    <div class="item-image">
      <img v-if="hasImage" :src="imageUrl" :alt="item.name" class="image-real" />
      <div v-else class="image-placeholder">
        {{ item.name.charAt(0) }}
      </div>
    </div>
    <div class="item-info">
      <div class="item-name">{{ item.name }}</div>
      <div class="item-tags">
        <n-tag size="small" :bordered="false">{{ item.color }}</n-tag>
        <n-tag size="small" type="info" :bordered="false">{{ categoryLabelMap[item.category] }}</n-tag>
      </div>
    </div>
    <div class="item-actions">
      <n-button size="tiny" @click="handleEdit">编辑</n-button>
      <n-button size="tiny" type="primary" @click="handleAdd">加入搭配</n-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item-card {
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
  padding: var(--gap-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-panel);
  transition: all 0.2s;
  cursor: grab;
  
  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
}
.item-image {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-bg) 100%);
  color: var(--color-primary);
  font-size: 20px;
  font-weight: 600;
}
.image-real {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.item-name {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.item-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
</style>
