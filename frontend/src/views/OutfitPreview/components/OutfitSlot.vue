<script setup lang="ts">
import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { useOutfitStore } from '@/stores/outfit'
import type { SlotDefinition, ClothingItem } from '@/types/outfit'

const props = defineProps<{ slotDef: SlotDefinition }>()
const store = useOutfitStore()
const message = useMessage()

const slotItems = computed(() => {
  const val = store.selectedItems[props.slotDef.key]
  if (!val) return []
  if (Array.isArray(val)) return val
  return [val]
})

function handleRemove(itemId?: string) {
  store.removeItem(props.slotDef.acceptCategory, itemId)
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  if (!event.dataTransfer) return

  try {
    const item: ClothingItem = JSON.parse(event.dataTransfer.getData('application/json'))
    if (item.category !== props.slotDef.acceptCategory) {
      message.warning(`该槽位只接受「${props.slotDef.label}」类别的单品`)
      return
    }
    store.addItem(item)
    message.success(`已添加 ${item.name}`)
  } catch {
    message.error('添加失败')
  }
}
</script>

<template>
  <div class="outfit-slot">
    <div class="slot-label">{{ slotDef.label }}</div>
    <div
      class="slot-content"
      :class="{ 'is-empty': slotItems.length === 0 }"
      @dragover="onDragOver"
      @drop="onDrop"
    >
      <div v-if="slotItems.length === 0" class="slot-empty">
        <span>拖拽或点击添加{{ slotDef.label }}</span>
      </div>
      <div 
        v-for="item in slotItems" 
        :key="item.id" 
        class="slot-item"
      >
        <div class="item-image">
          <div class="image-placeholder">{{ item.name.charAt(0) }}</div>
        </div>
        <span class="item-name">{{ item.name }}</span>
        <button class="remove-btn" @click="handleRemove(item.id)">×</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.outfit-slot {
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);
}
.slot-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.slot-content {
  min-height: 120px;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--gap-sm);
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);
  transition: all 0.2s;
  
  &.is-empty {
    align-items: center;
    justify-content: center;
  }
  
  &:hover {
    border-color: var(--color-primary);
  }
}
.slot-empty {
  color: var(--color-muted);
  font-size: 13px;
  text-align: center;
}
.slot-item {
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
  padding: var(--gap-sm);
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  position: relative;
}
.item-image {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
}
.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-bg) 100%);
  color: var(--color-primary);
  font-size: 16px;
  font-weight: 600;
}
.item-name {
  flex: 1;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.remove-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: var(--color-danger);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
  
  &:hover {
    opacity: 0.8;
  }
}
</style>
