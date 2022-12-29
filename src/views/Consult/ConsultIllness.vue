<script setup lang="ts">
import { ref } from 'vue';
import type { ConsultIllness } from '@/types/consult';

// 病情事件
const timeOptions = [
  { label: '一周内', value: 1 },
  { label: '一月内', value: 2 },
  { label: '半年内', value: 3 },
  { label: '大于半年', value: 4 },
];

// 是否就诊
const flagOptions = [
  { label: '就诊过', value: 1 },
  { label: '没就诊过', value: 0 },
];

// 病情描述相关的响应式数据
const form = ref<ConsultIllness>({
  // 病情描述
  illnessDesc: '',
  // 1周内、1月内、半年内、大于半年
  illnessTime: undefined,
  // 0未就诊过、1就诊过
  consultFlag: undefined,
  // 病情描述图片
  pictures: [],
});

const fileList = ref([]);

// 图片读取成功回调
const onAfterRead = () => {
  console.log('图片读取成功');
};
// 删除图片回调
const onDeleteImg = () => {
  console.log('图片删除成功');
};
</script>

<template>
  <div class="consult-illness-page">
    <CpNavBar title="图文问诊" />
    <!-- 医生提示 -->
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助</p>
        <p class="safe"><cp-icon name="consult-safe" /><span>内容仅医生可见</span></p>
      </div>
    </div>
    <!-- 病情描述 -->
    <div class="illness-form">
      <van-field
        type="textarea"
        v-model="form.illnessDesc"
        rows="3"
        placeholder="请详细描述您的病情，病情描述不能为空"
      ></van-field>
      <div class="item">
        <p>本次患病多久了？</p>
        <CpRadioBtn :options="timeOptions" v-model="form.illnessTime" />
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <CpRadioBtn :options="flagOptions" v-model="form.consultFlag" />
      </div>
    </div>
    <div class="illness-img">
      <!-- 属性传递函数的用法：:after-read="onAfterRead" -->
      <van-uploader
        upload-icon="photo-o"
        upload-text="上传图片"
        :max-size="5 * 1024 * 1024"
        max-count="3"
        :multiple="false"
        :after-read="onAfterRead"
        @delete="onDeleteImg"
        v-model="fileList"
      >
      </van-uploader>
      <p class="tip" v-if="fileList.length === 0">上传内容仅医生可见,最多9张图,最大5MB</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-illness-page {
  //   padding-top: 46px;
  //   医生提示
  .illness-tip {
    display: flex;
    padding: 15px;
    .img {
      width: 52px;
      height: 52px;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 10px;
    }
    .info {
      flex: 1;
      padding-left: 12px;
      .tit {
        font-size: 16px;
        margin-bottom: 5px;
      }
      .tip {
        padding: 12px;
        background: var(--cp-bg);
        color: var(--cp-text3);
        font-size: 13px;
        margin-bottom: 10px;
      }
      .safe {
        font-size: 10px;
        color: var(--cp-text3);
        display: flex;
        align-items: center;
        .cp-icon {
          font-size: 12px;
          margin-right: 2px;
        }
      }
    }
  }

  //   病情描述
  .illness-form {
    padding: 15px;
    .van-field {
      padding: 0;
      &::after {
        border-bottom: none;
      }
    }
    .item {
      > p {
        color: var(--cp-text3);
        padding: 15px 0;
      }
    }
  }

  .illness-img {
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .tip {
      font-size: 12px;
      color: var(--cp-tip);
    }
    ::v-deep() {
      .van-uploader {
        &__preview {
          &-delete {
            left: -6px;
            top: -6px;
            border-radius: 50%;
            background-color: var(--cp-primary);
            width: 20px;
            height: 20px;
            &-icon {
              transform: scale(0.9) translate(-22%, 22%);
            }
          }
          &-image {
            border-radius: 8px;
            overflow: hidden;
          }
        }
        &__upload {
          border-radius: 8px;
        }
        &__upload-icon {
          color: var(--cp-text3);
        }
      }
    }
  }
}
</style>
