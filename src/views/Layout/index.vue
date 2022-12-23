<script setup lang="ts"></script>

<template>
  <div class="layout">
    <!-- Layout 中变化的路由  -->

    <RouterView></RouterView>
    <van-tabbar route>
      <van-tabbar-item to="/home">
        首页
        <template #icon="{ active }">
          <CpIcon :name="`home-index-${active ? 'active' : 'default'}`" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/article">
        健康百科
        <template #icon="{ active }">
          <CpIcon :name="`home-article-${active ? 'active' : 'default'}`" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/notify">
        消息中心
        <template #icon="{ active }">
          <CpIcon :name="`home-notice-${active ? 'active' : 'default'}`" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/user">
        我的
        <template #icon="{ active }">
          <CpIcon :name="`home-mine-${active ? 'active' : 'default'}`" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  :deep() {
    .van-tabbar-item__icon {
      font-size: 21px;
    }
    .van-tabbar-item__text {
      font-size: 11px;
    }
  }
}
</style>
