<script setup lang="ts">
import type { PatientList, Patient } from '@/types/user';
import { getPatientList, addPatient, editPatient, delPatient } from '@/services/user';
import { ref, onMounted } from 'vue';
import { Dialog, Toast } from 'vant';

// 患者信息的工具对象
const initPatient: Patient = {
  name: '',
  idCard: '',
  gender: 0, // 性别：0是女，1是男
  defaultFlag: 0, // 默认就诊人 0是非默认
};

// 定义数据容器
const list = ref<PatientList>();
// 发起家庭档案信息请求
const loadList = async () => {
  try {
    const res = await getPatientList();
    console.log('patient list', res);
    // 赋值给页面
    list.value = res;
    // 初始化选中患者状态的设置
    if (list.value.length > 0) {
      // 1、优先选中默认就诊患者
      const defaultPatient = list.value.find((item) => item.defaultFlag === 1);
      if (defaultPatient) {
        if (defaultPatient.id) {
          patientId.value = defaultPatient.id;
        }
      } else {
        // 2、没有则选中第一个患者
        if (list.value[0].id) {
          patientId.value = list.value[0].id;
        }
      }
    }
  } catch (error) {
    console.log('error', error);
  }
};

// 弹窗是否显示,状态变量
const show = ref(false);
// 弹窗是否显示事件处理函数
const showPopup = (item?: Patient) => {
  // 根据是否传递患者信息来判断是新增还是编辑
  if (item) {
    // 编辑
    // 一个一个添加
    patient.value = {
      id: item.id,
      name: item.name,
      idCard: item.idCard,
      gender: item.gender,
      defaultFlag: item.defaultFlag,
    };

    // 删除对象属性的写法
    // delete item.age;
    // delete item.genderValue;
    // patient.value = { ...item };
  } else {
    // 新增
    patient.value = { ...initPatient };
  }

  show.value = true;
};

// 弹出层性别选择数据
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 },
];
// 弹出层性别选中数据
// const gender = ref<string | number>(0);
const patient = ref<Patient>({ ...initPatient });

// back 事件处理函数
const back = (e: string) => {
  console.log('=======>', e);
  show.value = false;
};

// 导航组件右侧的事件处理函数
const submit = async () => {
  console.log(patient.value);
  // 根据是否有patien.id来区分编辑还是新增
  if (patient.value.id) {
    // 编辑
    const res = await editPatient(patient.value);
    console.log('编辑患者信息结果', res);
    // 1、提示用户
    Toast.success('编辑成功');
  } else {
    // 发起新增患者请求
    const res = await addPatient(patient.value);
    console.log('新增患者信息结果', res);
    // 1、提示用户
    Toast.success('新增成功');
  }
  // 2、关闭弹窗
  show.value = false;
  // 3、重新请求数据
  loadList();
};

const patientFlagHandler = (e: boolean) => {
  console.log(e);
  // 父组件修改父组件的数据，父组件才会刷新=>子组件也会刷新（传递给子组件的数据也变了）
  if (e) {
    patient.value.defaultFlag = 1;
  } else {
    patient.value.defaultFlag = 0;
  }
};

const remove = async () => {
  console.log('del');
  // 如果有 patien.value.id 才能删除
  if (patient.value.id) {
    // 弹窗确认
    await Dialog.confirm({
      title: '温馨提示',
      message: `您确认要删除 ${patient.value.name} 患者信息吗 ？`,
    });
    // 用户点击了确认，才会走到这里
    console.log('ok');
    // 发起删除请求
    const res = await delPatient(patient.value.id);
    console.log('删除结果', res);

    // 提示用户
    Toast.success('删除成功');
    // 弹窗隐藏
    show.value = false;
    // 重新发起请求
    loadList();
  }
};

// 选中患者的id
const patientId = ref('');

// 选中患者事件处理，设置 patientId
const selectePatient = (item: Patient) => {
  // 类型收缩
  if (item.id) {
    patientId.value = item.id;
  }
};

onMounted(() => {
  loadList();
});
</script>

<template>
  <div class="patient" v-if="list">
    <CpNavBar title="选择患者" />
    <!-- 选择患者提示 -->
    <div class="patient-read">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>
    <!-- 患者列表 -->
    <div class="patient-list">
      <div
        class="patient-item"
        :class="{ selected: patientId === item.id }"
        @click="selectePatient(item)"
        v-for="item in list"
        :key="item.id"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{ item.idCard.replace(/(.{6}).*(.{4})/, '$1********$2') }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon" @click="showPopup(item)"><CpIcon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
    </div>
    <!-- 添加患者 -->
    <div class="patient-add" v-if="list.length < 6" @click="showPopup()">
      <CpIcon name="user-add" />
      <p>添加患者</p>
    </div>
    <!-- 添加提示 -->
    <div class="patient-tip" v-if="list.length < 6">最多可添加 6 人</div>
    <!-- 弹窗UI -->
    <van-popup v-model:show="show" position="right">
      <!-- <CpNavBar :back="() => (show = false)" title="添加患者" right-text="保存" /> -->
      <CpNavBar
        :back="back"
        :title="patient.id ? '编辑患者' : '添加患者'"
        right-text="保存"
        @click-right="submit"
      />
      <!-- 弹窗表单 -->
      <van-form autocomplete="off">
        <van-field v-model="patient.name" label="真实姓名" placeholder="请输入真实姓名" />
        <van-field v-model="patient.idCard" label="身份证号" placeholder="请输入身份证号" />
        <van-field label="性别">
          <template #input>
            <!-- <CpRadioBtn
              :options="options"
              :modelValue="gender"
              @update:modelValue="gender = $event"
            /> -->
            <CpRadioBtn :options="options" v-model="patient.gender" />
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <!-- v-model 语法糖的分步骤写法 -->
            <van-checkbox
              round
              :modelValue="patient.defaultFlag === 1"
              @update:modelValue="patientFlagHandler"
            />
            <!-- 事件绑定和上面的等价 -->
            <!-- @update:modelValue="patient.defaultFlag = $event ? 1 : 0" -->
            <!-- 和上面等价 -->
            <!-- <van-checkbox round :modelValue="patient.defaultFlag === 1 ? true : false" /> -->
          </template>
        </van-field>
      </van-form>

      <van-action-bar v-if="patient.id">
        <van-action-bar-button @click="remove">删除</van-action-bar-button>
      </van-action-bar>
    </van-popup>
    <!-- 底部按钮 -->
    <div class="patient-next">
      <van-button type="primary" round block>下一步</van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patient {
  padding-bottom: 80px;
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

  // 弹窗样式修改
  :deep() {
    .van-popup {
      width: 100%;
      height: 100%;
    }
  }
  // 底部操作栏
  .van-action-bar {
    padding: 0 10px;
    margin-bottom: 10px;
    .van-button {
      color: var(--cp-price);
      background-color: var(--cp-bg);
    }
  }

  .patient-read {
    padding: 15px;
    > h3 {
      font-weight: normal;
      margin-bottom: 5px;
    }
    > p {
      color: var(--cp-text3);
    }
  }
  .patient-next {
    padding: 15px;
    background-color: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 80px;
    box-sizing: border-box;
  }
}
</style>
