<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import type { KnowledgeType } from '@/types/consult';
// 导入自定义组件
import KnowledgeList from './KnowledgeList.vue';
import FollowDoctor from './FollowDoctor.vue';
// 导入极速问诊 store
import { useConsultStore } from '@/stores/consult';

// 创建store实例
const consultStore = useConsultStore();

// 极速问诊事件处理函数
const setConsultType = () => {
  consultStore.setType(2);
};

// 选中的tab
const active = ref<KnowledgeType>('like');

// onUnmounted(() => {
//   console.log('组件卸载了');
// });
</script>

<template>
  <div class="home">
    <!-- 顶部搜索 -->
    <div class="search-container">
      <h1>优医</h1>
      <div class="search"><cp-icon name="home-search" /> 搜一搜：疾病/症状/医生/健康知识</div>
    </div>
    <!-- 首页导航 -->
    <div class="navs-container">
      <van-row>
        <van-col span="8">
          <router-link to="/" class="nav">
            <cp-icon name="home-doctor"></cp-icon>
            <p class="title">问医生</p>
            <p class="desc">按科室查问医生</p>
          </router-link>
        </van-col>
        <van-col span="8">
          <router-link to="/consult/fast" class="nav" @click="setConsultType">
            <cp-icon name="home-graphic"></cp-icon>
            <p class="title">极速问诊</p>
            <p class="desc">20s医生极速回复</p>
          </router-link>
        </van-col>
        <van-col span="8">
          <router-link to="/" class="nav">
            <cp-icon name="home-prescribe"></cp-icon>
            <p class="title">开药门诊</p>
            <p class="desc">线上买药更方便</p>
          </router-link>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-order"></cp-icon>
            <p class="title">药品订单</p>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-docs"></cp-icon>
            <p class="title">健康档案</p>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-rp"></cp-icon>
            <p class="title">我的处方</p>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-find"></cp-icon>
            <p class="title">疾病查询</p>
          </router-link>
        </van-col>
      </van-row>
    </div>
    <!-- 轮播广告图 -->

    <div class="home-banner">
      <van-swipe indicator-color="#fff">
        <van-swipe-item>
          <img src="@/assets/ad.png" alt="轮播图广告" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="@/assets/ad.png" alt="轮播图广告" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 知识列表 -->
    <van-tabs shrink sticky v-model:active="active">
      <van-tab title="关注" name="like">
        <FollowDoctor />
        <KnowledgeList type="like" />
      </van-tab>
      <van-tab title="推荐" name="recommend"><KnowledgeList type="recommend" /></van-tab>
      <van-tab title="减脂" name="fatReduction"><KnowledgeList type="fatReduction" /></van-tab>
      <van-tab title="饮食" name="food"><KnowledgeList type="food" /></van-tab>
    </van-tabs>
  </div>
</template>

<style lang="scss" scoped>
.home {
  padding-bottom: 50px;
  // 顶部搜索
  .search-container {
    height: 90px;
    background: linear-gradient(180deg, rgba(62, 206, 197, 0.85), #26bcc6);
    border-bottom-left-radius: 150px 20px;
    border-bottom-right-radius: 150px 20px;

    > h1 {
      font-size: 18px;
      color: #fff;
      font-weight: normal;
      padding: 20px;
    }
    .search {
      height: 40px;
      border-radius: 20px;
      box-shadow: 0px 15px 22px -7px rgba(224, 236, 250, 0.8);
      background-color: #fff;
      display: flex;
      align-items: center;
      padding: 0 20px;
      margin: 0 20px;
      color: var(--cp-dark);
      font-size: 13px;
      .cp-icon {
        font-size: 16px;
        margin-right: 5px;
      }
    }
  }
  // 首页导航
  .navs-container {
    padding: 24px 15px 0 15px;
    .nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 0;
      .cp-icon {
        font-size: 48px;
      }
      .title {
        font-weight: 500;
        margin-top: 5px;
        color: var(--cp-text1);
      }
      .desc {
        font-size: 11px;
        color: var(--cp-tag);
        margin-top: 2px;
      }
      &.min {
        .cp-icon {
          font-size: 31px;
        }
        .title {
          font-size: 13px;
          color: var(--cp-text2);
          font-weight: normal;
        }
      }
    }
  }
  // 轮播广告
  .home-banner {
    padding: 10px 15px;
    height: 100px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
