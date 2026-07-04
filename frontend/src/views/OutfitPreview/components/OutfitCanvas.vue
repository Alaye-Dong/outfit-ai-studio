<script setup lang="ts">
import { outfitSlots } from '@/types/outfit'
import OutfitSlot from './OutfitSlot.vue'
</script>

<template>
  <div class="outfit-canvas">
    <div class="canvas-header">
      <h3>搭配区</h3>
    </div>
    <div class="canvas-content">
      <div class="slots-grid">
        <OutfitSlot 
          v-for="slot in outfitSlots" 
          :key="slot.key" 
          :slot-def="slot"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.outfit-canvas {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.canvas-header {
  padding: var(--gap-md);
  border-bottom: 1px solid var(--color-border);
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
}
.canvas-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--gap-md);
}
.slots-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-md);
}
</style>
