<script setup lang="ts">
import ConsultItem from './ConsultItem.vue';
</script>

<template>
  <div class="consult-list">
    <ConsultItem v-for="i in 5" :key="i" />
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px;
}
</style>
