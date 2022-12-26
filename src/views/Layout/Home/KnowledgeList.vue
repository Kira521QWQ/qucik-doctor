<script setup lang="ts">
import KnowledgeItem from './KnowledgeItem.vue';
</script>

<template>
  <div class="knowledge-list">
    <KnowledgeItem v-for="i in 5" :key="i"></KnowledgeItem>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
