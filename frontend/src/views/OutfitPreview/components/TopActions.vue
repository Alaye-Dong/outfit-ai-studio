<script setup lang="ts">
import { useOutfitStore } from '@/stores/outfit'
import { computed } from 'vue'
import { generateOutfitImage } from '@/api/generation'
import type { OutfitSelection } from '@/types/outfit'

const store = useOutfitStore()

const hasItems = computed(() => store.hasSelectedItems())
const isGenerating = computed(() => store.generateStatus === 'generating')

function buildOutfitPrompt(selection: OutfitSelection): string {
  const itemTexts: string[] = []
  
  Object.values(selection).forEach(value => {
    if (!value) return
    if (Array.isArray(value)) {
      value.forEach(item => itemTexts.push(`${item.color}${item.name}`))
    } else {
      itemTexts.push(`${value.color}${value.name}`)
    }
  })
  
  return [
    '请生成一张真人模特全身穿搭图。',
    '模特正面站立，全身构图，背景为简洁摄影棚。',
    '真实电商服装展示风格，高清质感。',
    itemTexts.length ? `模特穿着：${itemTexts.join('、')}。` : '',
    '整体风格自然、日常、适合服装搭配预览。'
  ].join('')
}

function handleClear() {
  if (confirm('确定要清空当前搭配吗？')) {
    store.clearOutfit()
  }
}

function handleSave() {
  if (!hasItems.value) {
    alert('请先选择单品')
    return
  }
  alert('保存功能即将上线')
}

async function handleGenerate() {
  if (!hasItems.value) {
    alert('请先选择至少一个单品')
    return
  }
  
  const prompt = buildOutfitPrompt(store.selectedItems)
  store.currentPrompt = prompt
  store.setGenerating()
  
  try {
    const result = await generateOutfitImage({
      items: store.selectedItems,
      prompt,
    })
    store.setGenerateSuccess(result.imageUrl, result.isFallback)
    if (result.isFallback) {
      console.warn('[Generation] Using fallback image, API call failed')
      alert('AI 接口调用失败，当前展示的是预生成 Demo 效果图。请检查后端日志。')
    } else {
      console.log('[Generation] Success, imageUrl:', result.imageUrl)
    }
  } catch (error: any) {
    console.error('[Generation] Error:', error)
    store.setGenerateFailed(error.message || '生成失败，请稍后重试')
    alert('生成失败: ' + (error.message || '请稍后重试'))
  }
}
</script>

<template>
  <div class="top-actions">
    <n-button quaternary size="small" @click="handleClear">清空</n-button>
    <n-button quaternary size="small" @click="handleSave">保存套装</n-button>
    <n-button 
      type="primary" 
      size="small" 
      :loading="isGenerating"
      :disabled="isGenerating"
      @click="handleGenerate"
    >
      生成效果图
    </n-button>
  </div>
</template>

<style lang="scss" scoped>
.top-actions {
  display: flex;
  gap: var(--gap-sm);
}
</style>
