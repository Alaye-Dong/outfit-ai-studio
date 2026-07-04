import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { ClothingItem, ClothingCategory, OutfitSelection, GenerateStatus } from '@/types/outfit'

export const useOutfitStore = defineStore('outfit', () => {
  const selectedItems = reactive<OutfitSelection>({})
  const resultImageUrl = ref('')
  const generateStatus = ref<GenerateStatus>('idle')
  const generateError = ref('')
  const currentPrompt = ref('')
  const isFallback = ref(false)

  function addItem(item: ClothingItem) {
    if (item.category === 'accessory') {
      if (!selectedItems.accessory) {
        selectedItems.accessory = []
      }
      const exists = selectedItems.accessory.some(i => i.id === item.id)
      if (!exists) {
        selectedItems.accessory.push(item)
      }
      return
    }
    ;(selectedItems as Record<string, ClothingItem | ClothingItem[] | undefined>)[item.category] = item
  }

  function removeItem(category: ClothingCategory, itemId?: string) {
    if (category === 'accessory' && itemId && selectedItems.accessory) {
      selectedItems.accessory = selectedItems.accessory.filter(i => i.id !== itemId)
      if (selectedItems.accessory.length === 0) {
        delete selectedItems.accessory
      }
      return
    }
    delete (selectedItems as Record<string, unknown>)[category]
  }

  function clearOutfit() {
    Object.keys(selectedItems).forEach(key => {
      delete (selectedItems as Record<string, unknown>)[key]
    })
    resultImageUrl.value = ''
    generateStatus.value = 'idle'
    generateError.value = ''
    currentPrompt.value = ''
    isFallback.value = false
  }

  function setGenerating() {
    generateStatus.value = 'generating'
    generateError.value = ''
    isFallback.value = false
  }

  function setGenerateSuccess(url: string, fallback = false) {
    resultImageUrl.value = url
    generateStatus.value = 'success'
    isFallback.value = fallback
  }

  function setGenerateFailed(error: string) {
    generateStatus.value = 'failed'
    generateError.value = error
  }

  function hasSelectedItems(): boolean {
    return Object.values(selectedItems).some(value => {
      if (Array.isArray(value)) return value.length > 0
      return Boolean(value)
    })
  }

  return {
    selectedItems,
    resultImageUrl,
    generateStatus,
    generateError,
    currentPrompt,
    isFallback,
    addItem,
    removeItem,
    clearOutfit,
    setGenerating,
    setGenerateSuccess,
    setGenerateFailed,
    hasSelectedItems,
  }
})
