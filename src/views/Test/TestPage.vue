<script setup lang="ts">
import { instance as request } from '@/utils/request';
request.get('https://consult-api.itheima.net/patient/myUser');
</script>

<template>
  <div>测试用路由</div>
</template>

<style lang="scss" scoped></style>
