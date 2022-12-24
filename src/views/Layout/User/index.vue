<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Dialog } from 'vant';
import type { UserInfo } from '@/types/user';
import { getUserInfo } from '@/services/user';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

// 定义响应式数据容器
const userInfo = ref<UserInfo>();

// 快捷工具显示配置数据。非响应式数据，没有使用 ref
const tools = [
  { label: '我的问诊', path: '/user/consult' },
  { label: '我的处方', path: '/' },
  { label: '家庭档案', path: '/user/patient' },
  { label: '地址管理', path: '/user/address' },
  { label: '我的评价', path: '/' },
  { label: '官方客服', path: '/' },
  { label: '设置', path: '/' },
];

// 推出登录的事件处理函数
const logout = async () => {
  // 用 await 处理，不 try catch
  // const succ = await Dialog.confirm({
  //   title: '温馨提示',
  //   message: '您确认要退出优医问诊吗？',
  //   // 确认取消，可以不写。
  //   cancelButtonText: '取消',
  //   confirmButtonText: '确认',
  // });
  // // 没有异常，走这里，就是点击了确认
  // console.log('点击了确认', succ);
  // // 清除token
  // userStore.delUser();
  // // 页面跳转
  // router.push('/login');

  // 用 try catch 的处理
  try {
    const succ = await Dialog.confirm({
      title: '温馨提示',
      message: '您确认要退出优医问诊吗？',
      // 确认取消，可以不写。
      cancelButtonText: '取消',
      confirmButtonText: '确认',
    });
    // 没有异常，走这里，就是点击了确认
    console.log('点击了确认', succ);
    // 清除token
    userStore.delUser();
    // 页面跳转
    router.push('/login');
  } catch (error) {
    console.log(error, '用户点击了取消');
  }

  // Dialog.confirm({
  //   title: '温馨提示',
  //   message: '您确认要退出优医问诊吗？',
  //   // 确认取消，可以不写。
  //   cancelButtonText: '取消',
  //   confirmButtonText: '确认',
  // })
  //   .then((succ) => {
  //     console.log('点击了确认', succ);
  //     // 清除token
  //     userStore.delUser();
  //     // 页面跳转
  //     router.push('/login');
  //   })
  //   .catch((cancel) => {
  //     console.log('点击了取消', cancel);
  //   });
};

// 页面挂载后发起请求
onMounted(async () => {
  const res = await getUserInfo();
  console.log('用户个人信息', res);
  // 设置页面数据
  userInfo.value = res;
});
</script>

<template>
  <div class="user" v-if="userInfo">
    <!-- 头部 -->
    <div class="user-head">
      <div class="top">
        <van-image round fit="cover" :src="userInfo.avatar" />
        <div class="name">
          <p>{{ userInfo.account }}</p>
          <p><van-icon name="edit" /></p>
        </div>
      </div>
      <van-row>
        <van-col span="6">
          <p>{{ userInfo.collectionNumber }}</p>
          <p>收藏</p>
        </van-col>
        <van-col span="6">
          <p>{{ userInfo.likeNumber }}</p>
          <p>关注</p>
        </van-col>
        <van-col span="6">
          <p>{{ userInfo.score }}</p>
          <p>积分</p>
        </van-col>
        <van-col span="6">
          <p>{{ userInfo.couponNumber }}</p>
          <p>优惠券</p>
        </van-col>
      </van-row>
    </div>
    <!-- 订单 -->
    <div class="user-order">
      <div class="head">
        <h3>药品订单</h3>
        <router-link to="/order">全部订单 <van-icon name="arrow" /></router-link>
      </div>
      <van-row>
        <van-col span="6">
          <van-badge :content="userInfo.orderInfo.paidNumber || ''">
            <CpIcon name="user-paid" />
          </van-badge>
          <p>待付款</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="userInfo.orderInfo.shippedNumber || ''">
            <CpIcon name="user-shipped" />
          </van-badge>
          <p>待发货</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="userInfo.orderInfo.receivedNumber || ''">
            <CpIcon name="user-received" />
          </van-badge>
          <p>待收货</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="userInfo.orderInfo.finishedNumber || ''">
            <CpIcon name="user-finished" />
          </van-badge>
          <p>已完成</p>
        </van-col>
      </van-row>
    </div>
    <!-- 快捷工具 -->
    <div class="user-group">
      <h3>快捷工具</h3>
      <van-cell
        :title="item.label"
        is-link
        :to="item.path"
        v-for="(item, i) in tools"
        :key="item.label"
        :border="false"
      >
        <template #icon><CpIcon :name="`user-tool-0${i + 1}`" /></template>
      </van-cell>
    </div>
    <!-- 退出登录 -->
    <a class="logout" href="javascript:;" @click="logout">退出登录</a>
  </div>
</template>

<style lang="scss" scoped>
.user {
  background-color: var(--cp-bg);
  min-height: calc(100vh - 50px);
  padding: 0 15px 65px;
  // 头部
  .user-head {
    height: 200px;
    background: linear-gradient(180deg, rgba(44, 181, 165, 0.46), rgba(44, 181, 165, 0));
    margin: 0 -15px;
    padding: 0 15px;
    .top {
      display: flex;
      padding-top: 50px;
      align-items: center;
      .van-image {
        width: 70px;
        height: 70px;
      }
      .name {
        padding-left: 10px;
        p {
          &:first-child {
            font-size: 18px;
            font-weight: 500;
          }
          &:last-child {
            margin-top: 10px;
            color: var(--cp-primary);
            font-size: 16px;
          }
        }
      }
    }
    .van-row {
      margin: 0 -15px;
      padding-top: 15px;
      p {
        text-align: center;
        &:first-child {
          font-size: 18px;
          font-weight: 500;
        }
        &:last-child {
          color: var(--cp-dark);
          font-size: 12px;
          padding-top: 4px;
        }
      }
    }
  }
  // 订单
  .user-order {
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    .head {
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      padding: 0 15px;
      a {
        color: var(--cp-tip);
      }
    }
    .van-col {
      text-align: center;
      .cp-icon {
        font-size: 28px;
      }
      p {
        font-size: 12px;
        padding-top: 4px;
      }
    }
  }

  // 快捷工具
  .user-group {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    h3 {
      padding-left: 16px;
      line-height: 44px;
    }
    .van-cell {
      align-items: center;
    }
    .cp-icon {
      font-size: 17px;
      margin-right: 10px;
    }
  }

  // 退出登录
  .logout {
    display: block;
    margin: 20px auto;
    width: 100px;
    text-align: center;
    color: var(--cp-price);
  }
}
</style>
