<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DoctorItem from './DoctorItem.vue';
import { getDoctorPage } from '@/services/consult';
import type { DoctorList } from '@/types/consult';

// 定义响应式数据容器
const list = ref<DoctorList>([]);
// 获取数据的方法
const loadData = async () => {
  const res = await getDoctorPage({
    current: 1,
    pageSize: 5,
  });
  // 赋值给页面
  list.value = res.rows;
  console.log('===>', list.value);
};
// 组件加载完毕后调用获取数据的方法
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <!-- swipe 组件 -->
      <van-swipe :width="150" :showIndicators="false" :loop="false">
        <van-swipe-item v-for="item in list" :key="item.id">
          <DoctorItem :doctor="item" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
