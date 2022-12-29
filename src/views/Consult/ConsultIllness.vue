<script setup lang="ts">
import { ref, computed } from 'vue';
import { uploadImage } from '@/services/consult';
import type { ConsultIllness } from '@/types/consult';
import type { UploaderAfterRead, UploaderFileListItem } from 'vant/lib/uploader/types';
import { Toast } from 'vant';
import { useConsultStore } from '@/stores/consult';
import { useRouter } from 'vue-router';

const consultStore = useConsultStore();
const router = useRouter();

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
const onAfterRead: UploaderAfterRead = (item) => {
  console.log('图片读取成功', item);
  // 类型收缩处理
  // 1、排除 item 是数组
  if (Array.isArray(item)) return;
  // 2、排除浏览器读取图片失败的情况
  if (!item.file) return;
  // 设置图片的显示状态
  item.status = 'uploading';
  item.message = '上传中';
  // 开始上传
  uploadImage(item.file)
    .then((res) => {
      console.log('上传成功', res);
      // 设置上传组件状态
      item.status = 'done';
      item.message = '上传成功';
      // 图片的地址，还要放到我们维护的form响应数据中
      form.value.pictures?.push(res);
      // 添加 url 属性到item上
      item.url = res.url;
    })
    .catch((err) => {
      item.status = 'failed';
      item.message = '图片上传失败';
      console.log('上传失败', err);
    });
};
// 删除图片回调
const onDeleteImg = (item: UploaderFileListItem) => {
  console.log('图片删除成功，vant组件库调用的', item);
  // 删除我们自己维护图片数据
  // ['123', '456', '789'] 删除的是 '123'
  // 1
  // forEach 循环法
  // const arr: { id: string; url: string }[] = [];
  // form.value.pictures?.forEach((pic) => {
  //   if (pic.url !== item.url) {
  //     arr.push(pic);
  //   }
  // });
  // form.value.pictures = arr;
  // 2
  form.value.pictures = form.value.pictures?.filter((pic) => !(pic.url === item.url));
  // 3
  // form.value.pictures = form.value.pictures?.filter((pic) => pic.url !== item.url);
};

// 下一步是否激活的计算属性
const enabled = computed(() => {
  return (
    form.value.illnessDesc &&
    form.value.illnessTime !== undefined &&
    form.value.consultFlag !== undefined
  );
});

const disabled = computed(() => {
  // return (
  //   !form.value.illnessDesc ||
  //   form.value.illnessTime === undefined ||
  //   form.value.consultFlag === undefined
  // );
  // 这个和上面等价
  if (
    !form.value.illnessDesc ||
    form.value.illnessTime === undefined ||
    form.value.consultFlag === undefined
  ) {
    return true;
  } else {
    return false;
  }
});

// 点击下一步判断用户输入
const next = () => {
  // TODO 这里判断是否启动、禁用

  // 1 病情描述输入判断
  // if (!form.value.illnessDesc) return Toast('请输入病情描述');
  // 上面的代码和下面的代码等价
  if (!form.value.illnessDesc) {
    let result = Toast('请输入病情描述');
    return result;
  }
  // 2 患病时间
  if (form.value.illnessTime === undefined) return Toast('请选择患病时间');
  // 3 是否就诊
  if (form.value.consultFlag === undefined) return Toast('请选择是否就诊');

  console.log('保存数据到 store');
  consultStore.setIllness(form.value);

  // 路由跳转
  // router.push('/consult/patient');
};
</script>

<template>
  <div class="consult-illness-page">
    <!-- <input type="file" /> -->
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
        max-count="9"
        :multiple="false"
        :after-read="onAfterRead"
        @delete="onDeleteImg"
        v-model="fileList"
      >
      </van-uploader>
      <p class="tip" v-if="fileList.length === 0">上传内容仅医生可见,最多9张图,最大5MB</p>
    </div>
    <!-- 下一步 -->
    <div style="padding: 0px 15px" @click="next">
      <!-- <van-button :class="{ disabled: !enabled }" type="primary" block round>下一步</van-button> -->
      <van-button :class="{ disabled: disabled }" type="primary" block round>下一步</van-button>
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

  // 下一步
  .van-button {
    font-size: 16px;
    &.disabled {
      opacity: 1;
      background: #fafafa;
      color: #d9dbde;
      border: #fafafa;
    }
  }
}
</style>
