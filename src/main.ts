import { createApp } from 'vue';
import { createPinia } from 'pinia';
import persist from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';

// 导入组件样式
import 'vant/lib/index.css';
// 导入项目样式，要在组件库之后
import './styles/main.scss';

// 导入打包的 svg 图片
import 'virtual:svg-icons-register';

const app = createApp(App);

app.use(createPinia().use(persist));
app.use(router);

app.mount('#app');
