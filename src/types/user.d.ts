// 用户相关数据类型

// axios 不同业务响应的类型
// http 响应体类型
export type Data<T> = {
  code: number;
  message: string;
  data: T;
};

// 服务器返回用户的类型
export type User = {
  // token令牌
  token: string;
  // 用户ID
  id: string;
  // 用户名称
  account: string;
  // 手机号
  mobile: string;
  // 头像
  avatar: string;
};

// 复用一下 User 类型
type UserOmitToken = Omit<User, 'token'>;
export type UserInfo = UserOmitToken & {
  likeNumber: number;
  collectionNumber: number;
  score: number;
  couponNumber: number;
  orderInfo: {
    paidNumber: number;
    receivedNumber: number;
    shippedNumber: number;
    finishedNumber: number;
  };
};

// 泛型工具函数 Pick 的使用，TS 自带的，直接使用(摘取)
type Person = {
  name: string;
  age: number;
};
type PickPerson = Pick<Person, 'name'>;

// 泛型工具函数 Omit 的使用（减去）
type OmitPerson = Omit<Person, 'name'>;
