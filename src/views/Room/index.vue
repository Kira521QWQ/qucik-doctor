<script setup lang="ts">
import RoomStatus from './RoomStatus.vue';
import RoomAction from './RoomAction.vue';
import RoomMessage from './RoomMessage.vue';
</script>

<template>
  <div class="room">
    <CpNavBar title="问诊室" />
    <RoomStatus />
    <RoomMessage />
    <RoomAction />
  </div>
</template>

<style lang="scss" scoped>
.room {
  padding-top: 50px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
