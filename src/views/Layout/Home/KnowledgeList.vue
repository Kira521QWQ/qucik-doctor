<script setup lang="ts">
import { ref } from 'vue';
import KnowledgeItem from './KnowledgeItem.vue';
import type { KnowledgeType, KnowledgeParams, KnowledgeList } from '@/types/consult';
import { getKnowledgePage } from '@/services/consult';

// 定义 props 接收请求文章的类型
// 父组件传递的数据
const props = defineProps<{
  type: KnowledgeType;
}>();

// 文章列表查询参数
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10,
});
// 列表数据
const list = ref<KnowledgeList>([]);

// 列表发起每次请求数据的状态
const loading = ref(false);
// 列表发起每次请求执行的函数（<van-list /> 组件库调用）
const onLoad = async () => {
  // console.log('请求更多数据');
  // console.log('网络请求开始前的loading.value', loading.value);
  // 发起请求，获取文章列表数据
  const res = await getKnowledgePage(params.value);
  console.log('文章列表数据', res);
  // 赋值数据给list
  list.value.push(...res.rows);
  console.log(list.value);

  // 判断此次查询的所有数据是否加载完毕
  if (params.value.current >= res.pageTotal) {
    // 告诉组件所有数据加载完毕
    finished.value = true;
  } else {
    // 修改查询参数：页码要增1
    params.value.current += 1;
  }
  // 通知组件数据加载完毕，下次触底后请求再次执行onLoad
  loading.value = false;

  // setTimeout(() => {
  //   // 1秒钟后获取到了10条数据
  //   list.value.push(...[1, 2, 3, 4, 5]);
  //   // 获取数据完毕后，通知组件
  //   loading.value = false;
  //   // 1秒后通知组件，所有的数据都请求完毕
  //   // finished.value = true;
  // }, 2000);
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
      <KnowledgeItem v-for="item in list" :key="item.id" :item="item"></KnowledgeItem>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
