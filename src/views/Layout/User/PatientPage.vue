<script setup lang="ts">
import type { PatientList } from '@/types/user';
import { getPatientList } from '@/services/user';
import { ref, onMounted } from 'vue';

// 定义数据容器
const list = ref<PatientList>();
// 发起家庭档案信息请求
const loadList = async () => {
  const res = await getPatientList();
  console.log('patient list', res);
  // 赋值给页面
  list.value = res;
};

onMounted(() => {
  loadList();
});
</script>

<template>
  <div class="patient" v-if="list">
    <CpNavBar title="家庭档案" />
    <!-- 患者列表 -->
    <div class="patient-list">
      <div class="patient-item" v-for="item in list" :key="item.id">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{ item.idCard.replace(/(.{6}).*(.{4})/, '$1********$2') }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon"><CpIcon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
    </div>
    <!-- 添加患者 -->
    <div class="patient-add">
      <CpIcon name="user-add" />
      <p>添加患者</p>
    </div>
    <!-- 添加提示 -->
    <div class="patient-tip" v-if="list.length < 6">最多可添加 6 人</div>
  </div>
</template>

<style lang="scss" scoped>
.patient {
  //   padding: 46px 0 80px;
  .patient-list {
    padding: 15px 15px 0 15px;

    .patient-item {
      display: flex;
      align-items: center;
      padding: 15px;
      background-color: var(--cp-bg);
      border-radius: 8px;
      margin-bottom: 15px;
      position: relative;
      border: 1px solid var(--cp-bg);
      transition: all 0.3s;
      overflow: hidden;
      .info {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
        span {
          color: var(--cp-tip);
          margin-right: 20px;
          line-height: 30px;
          &.name {
            font-size: 16px;
            color: var(--cp-text1);
            width: 80px;
            margin-right: 0;
          }
          &.id {
            color: var(--cp-text2);
            width: 180px;
          }
        }
      }
      .icon {
        color: var(--cp-tag);
        width: 20px;
        text-align: center;
      }
      .tag {
        position: absolute;
        right: 60px;
        top: 21px;
        width: 30px;
        height: 16px;
        font-size: 10px;
        color: #fff;
        background-color: var(--cp-primary);
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &.selected {
        border-color: var(--cp-primary);
        background-color: var(--cp-plain);
        .icon {
          color: var(--cp-primary);
        }
      }
    }
  }

  .patient-add {
    background-color: var(--cp-bg);
    color: var(--cp-primary);
    text-align: center;
    padding: 15px 0;
    margin: 0 15px;
    border-radius: 8px;
    .cp-icon {
      font-size: 24px;
    }
  }
  .patient-tip {
    color: var(--cp-tag);
    padding: 12px 0;
    margin: 0 15px;
  }
}
</style>
