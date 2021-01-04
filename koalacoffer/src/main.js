import Vue from 'vue'
import App from './App.vue'
import router from './router'

//导入axios（属于ajax请求方式）
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
//导入vant框架
import {
  Button,
  NavBar,
  Form,
  Field,
  Popup,
  Toast,
  Tabbar,
  TabbarItem,
  Search,
  Swipe,
  SwipeItem,
  Stepper,
  GoodsAction,
  GoodsActionButton,
  GoodsActionIcon,
  Empty,
  SwipeCell,
  Checkbox,
  CheckboxGroup,
  SubmitBar,
  List,
  AddressEdit,
  AddressList,
  Icon,
  Dialog,
  Tab,
  Tabs,
  Grid,
  GridItem,
  Cell,
  Uploader,

} from 'vant'

//导入lib-flexible.js
import 'lib-flexible/flexible'

Vue.config.productionTip = false

//注册vant框架
Vue
  .use(Button)
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Stepper)
  .use(GoodsAction)
  .use(GoodsActionButton)
  .use(GoodsActionIcon)
  .use(Empty)
  .use(SwipeCell)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(SubmitBar)
  .use(List)
  .use(AddressEdit)
  .use(AddressList)
  .use(Icon)
  .use(Dialog)
  .use(Tab)
  .use(Tabs)
  .use(Grid)
  .use(GridItem)
  .use(Cell)
  .use(Uploader)

//设置全局vue原型属性
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

// 配置请求(接口)基础路径
axios.defaults.baseURL = ' http://www.kangliuyong.com:10002'


//全局过滤器（过滤商品价格,保留小数）
Vue.filter('decimal', (v, n = 2) => {
  return v.toFixed(n);
})

//格式化日期
Vue.filter('format', function (value, arg) {
  function dateFormat(date, format) {
    if (typeof date === 'string') {
      var mts = date.match(/(\/Date\((\d+)\)\/)/);
      // 
      if (mts && mts.length >= 3) {
        date = parseInt(mts[2]);
      }
    }
    date = new Date(date);
    // 
    if (!date || date.toUTCString() == 'Invalid Date') {
      return '';
    }
    var map = {
      'M': date.getMonth() + 1, //月
      'd': date.getDate(),      //日
      'h': date.getHours(),     //时
      'm': date.getMinutes(),   //分
      's': date.getSeconds(),   //秒
      'q': Math.floor(date.getMonth() + 3 / 3),  //季度
      'S': date.getMilliseconds(),  //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
      var v = map[t];
      if (v != undefined) {
        if (all.length > 1) {
          v = '0' + v;
          v = v.substr(v.length - 2);
        }
        return v;
      } else if (t === 'y') {
        return (date.getFullYear() + '').substr(4 - all.length);
      }
      return all;
    });
    return format;
  }
  return dateFormat(value, arg);
})



//axios拦截器，在请求之前进行拦截
axios.interceptors.request.use(config => {
  //处理POST请求参数
  if (config.method == 'post') {
    //序列化post请求（也就是appkey）参数
    let paramsString = '';
    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`;
    }
    //重新赋值
    config.data = paramsString.slice(0, -1);
    // 
    //  
  }
  //必须返回config
  return config;
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
