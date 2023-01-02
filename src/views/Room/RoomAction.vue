<script setup lang="ts">
import type { UploaderAfterRead } from 'vant/lib/uploader/types';
import { ref } from 'vue';
import { uploadImage } from '@/services/consult';
import { Toast } from 'vant';

defineProps<{
  disabled?: boolean;
}>();

const emits = defineEmits<{
  (e: 'send-text', text: string): void;
  (e: 'send-image', img: { id: string; url: string }): void;
}>();

// 聊天内容
const text = ref('');
const sendText = () => {
  // 回车后发送消息
  console.log('回车后发送消息', text);
  emits('send-text', text.value);
  // 发送完毕后清空
  text.value = '';
};

// 聊天图片
const sendImage: UploaderAfterRead = async (uploadResult) => {
  // 类型收缩，排除错误情况
  // 一次只能上传一张图片
  if (Array.isArray(uploadResult)) return;
  // 图片读取成功
  if (!uploadResult.file) return;
  // 上传图片
  const t = Toast.loading('正在上传');
  const res = await uploadImage(uploadResult.file);
  t.clear();
  // 传递给父组件图片数据
  emits('send-image', res);
};
</script>

<template>
  <div class="room-action">
    <van-field
      :disabled="disabled"
      type="text"
      class="input"
      :border="false"
      placeholder="问医生"
      autocomplete="off"
      v-model="text"
      @keyup.enter="sendText"
    ></van-field>
    <van-uploader :preview-image="false" :disabled="disabled" :after-read="sendImage">
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
