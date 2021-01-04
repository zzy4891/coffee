//导入全部路由
export const routes = [
  
    {
      path: '/login',
      name: 'Login',
      component: () => import( '../views/Login.vue')
    },
    {
      path: '/main',
      name: 'Main',
      component: () => import( '../views/Main.vue'),
      children:[
        {
          path: 'home',
          name: 'Home',
          component: () => import( '../views/Home.vue')
        },
        {
          path: 'menue',
          name: 'Menue',
          component: () => import( '../views/Menue.vue')
        },
        {
          path: 'shopbag',
          name: 'Shopbag',
          component: () => import( '../views/Shopbag.vue')
        },
        {
          path: 'my',
          name: 'My',
          component: () => import( '../views/My.vue')
        },
      ]
    },
    {
      //商品详情（注意：此处要带参数:pid）
      path: '/detail/:pid',
      name: 'Detail',
      component: () => import( '../views/Detail.vue')
    },
    {
      //商品详情（注意：此处要带参数:pid）
      path: '/pay',
      name: 'Pay',
      component: () => import( '../views/Pay.vue')
    },
    {
      //新增地址编辑组件
      path: '/newaddress',
      name: 'NewAddress',
      component: () => import( '../views/NewAddress.vue')
    },
    {
      //新增地址组件
      path: '/address',
      name: 'Address',
      component: () => import( '../views/Address.vue')
    },
    {
      //新增订单组件
      path: '/order',
      name: 'Order',
      component: () => import( '../views/Order.vue')
    },
    {
      //个人资料组件
      path: '/account',
      name: 'Account',
      component: () => import( '../views/Account.vue')
    },
    {
      //收藏组件
      path: '/like',
      name: 'Like',
      component: () => import( '../views/Like.vue')
      
    },
    {
      //安全组件
      path: '/safety',
      name: 'Safety',
      component: () => import( '../views/Safety.vue')
    },
    {
      //红包组件
      path: '/coupon',
      name: 'Coupon',
      component: () => import( '../views/Coupon.vue')
    },
    {
      //客服组件
      path: '/secure',
      name: 'Secure',
      component: () => import( '../views/Secure.vue')
    },
    {
      //搜索框组件
      path: '/search',
      name: 'Search',
      component: () => import( '../views/Search.vue')
    },
    {
      //忘记密码组件
      path: '/forget',
      name: 'Forget',
      component: () => import( '../views/Forget.vue')
    },
    // 重定向
    {
      path:'*',
      redirect:{
        name:'Home'
      }
    }
  ]