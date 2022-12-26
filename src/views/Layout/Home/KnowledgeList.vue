<script setup lang="ts">
import { ref } from 'vue';
import KnowledgeItem from './KnowledgeItem.vue';

// 列表数据
const list = ref<number[]>([]);
// 列表发起每次请求数据的状态
const loading = ref(false);
// 列表发起每次请求执行的函数（<van-list /> 组件库调用）
const onLoad = () => {
  console.log('请求更多数据');
  console.log('网络请求开始前的loading.value', loading.value);
  setTimeout(() => {
    // 1秒钟后获取到了10条数据
    list.value.push(...[1, 2, 3, 4, 5]);
    // 获取数据完毕后，通知组件
    loading.value = false;
    // 1秒后通知组件，所有的数据都请求完毕
    // finished.value = true;
  }, 2000);
};
// 列表所有数据是否加载完毕的状态
const finished = ref(false);
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      @load="onLoad"
      :finished="finished"
      finished-text="所有数据加载完毕"
    >
      <KnowledgeItem v-for="i in list" :key="i"></KnowledgeItem>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
