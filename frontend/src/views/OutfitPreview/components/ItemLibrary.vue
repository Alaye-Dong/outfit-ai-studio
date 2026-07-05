<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getItems } from '@/api/items'
import type { ClothingItem, ClothingCategory } from '@/types/outfit'
import { categoryLabelMap } from '@/types/outfit'
import ItemCard from './ItemCard.vue'
import AddItemDialog from './AddItemDialog.vue'
import EditItemDialog from './EditItemDialog.vue'

const items = ref<ClothingItem[]>([])
const loading = ref(false)
const keyword = ref('')
const selectedCategory = ref<ClothingCategory | ''>('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const editingItem = ref<ClothingItem | null>(null)

const categoryOptions = [
  { label: '全部', value: '' },
  ...Object.entries(categoryLabelMap).map(([key, label]) => ({
    label,
    value: key as ClothingCategory,
  })),
]

const filteredItems = computed(() => {
  let result = items.value

  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    result = result.filter(i =>
      i.name.toLowerCase().includes(kw) ||
      i.color.toLowerCase().includes(kw)
    )
  }

  if (selectedCategory.value) {
    result = result.filter(i => i.category === selectedCategory.value)
  }

  return result
})

onMounted(async () => {
  loading.value = true
  try {
    items.value = await getItems()
  } catch (e) {
    console.error('Failed to load items:', e)
  } finally {
    loading.value = false
  }
})

function handleItemCreated(newItem: ClothingItem) {
  items.value.push(newItem)
}

function handleEditItem(item: ClothingItem) {
  editingItem.value = item
  showEditDialog.value = true
}

function handleItemUpdated(updatedItem: ClothingItem) {
  const index = items.value.findIndex(i => i.id === updatedItem.id)
  if (index !== -1) {
    items.value[index] = updatedItem
  }
}

function onDragStart(event: DragEvent, item: ClothingItem) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify(item))
    event.dataTransfer.effectAllowed = 'copy'
  }
}
</script>

<template>
  <div class="item-library">
    <div class="library-header">
      <h3>单品库</h3>
      <div class="header-actions">
        <span class="item-count">{{ filteredItems.length }} 件单品</span>
        <n-button size="small" type="primary" @click="showAddDialog = true">
          添加服装
        </n-button>
      </div>
    </div>
    <div class="library-filters">
      <n-input 
        v-model:value="keyword" 
        placeholder="搜索单品..." 
        size="small"
        clearable
      />
      <n-select 
        v-model:value="selectedCategory" 
        :options="categoryOptions" 
        size="small"
        placeholder="分类筛选"
        clearable
      />
    </div>
    <div class="library-content">
      <n-spin :show="loading">
        <div class="item-list">
          <ItemCard 
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            @edit="handleEditItem"
            @dragstart="onDragStart($event, item)"
          />
        </div>
      </n-spin>
    </div>
    <AddItemDialog v-model:visible="showAddDialog" @created="handleItemCreated" />
    <EditItemDialog 
      v-model:visible="showEditDialog" 
      :item="editingItem" 
      @updated="handleItemUpdated" 
    />
  </div>
</template>

<style lang="scss" scoped>
.item-library {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.library-header {
  padding: var(--gap-md);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
  }
  
  .item-count {
    font-size: 12px;
    color: var(--color-muted);
  }
}

.library-filters {
  padding: var(--gap-sm) var(--gap-md);
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);
  border-bottom: 1px solid var(--color-border);
}

.library-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--gap-sm);
}

.item-list {
  columns: 2;
  column-gap: var(--gap-sm);
}

/* 响应式列数 - 左侧面板宽度有限，保持2列 */
@media (min-width: 400px) {
  .item-list {
    columns: 2;
  }
}
</style>