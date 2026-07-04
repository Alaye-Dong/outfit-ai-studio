<script setup lang="ts">
import TopActions from './components/TopActions.vue'
import ItemLibrary from './components/ItemLibrary.vue'
import OutfitCanvas from './components/OutfitCanvas.vue'
import ResultPreview from './components/ResultPreview.vue'
</script>

<template>
  <div class="outfit-preview-page">
    <header class="page-header">
      <div class="header-left">
        <span class="page-subtitle">OUTFIT PREVIEW</span>
        <h1 class="page-title">AI 穿搭预演工具</h1>
      </div>
      <TopActions />
    </header>
    <main class="page-main">
      <aside class="left-panel">
        <ItemLibrary />
      </aside>
      <section class="center-panel">
        <OutfitCanvas />
      </section>
      <aside class="right-panel">
        <ResultPreview />
      </aside>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.outfit-preview-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}
.page-header {
  height: 64px;
  padding: 0 var(--gap-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-panel);
  flex-shrink: 0;
}
.header-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.page-subtitle {
  font-size: 11px;
  color: var(--color-muted);
  letter-spacing: 2px;
  text-transform: uppercase;
}
.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}
.page-main {
  flex: 1;
  display: grid;
  grid-template-columns: var(--panel-side-width) minmax(500px, 1fr) var(--panel-side-width);
  gap: var(--gap-md);
  padding: var(--gap-md);
  overflow: hidden;
}
.left-panel, .center-panel, .right-panel {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
