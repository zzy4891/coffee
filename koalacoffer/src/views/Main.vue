<template>
  <div class="main">
    <!-- 二级路由开始  -->
    <div>
      <router-view></router-view>
    </div>

    <!-- vant中的route要配合replace :to= -->
    <van-tabbar
      v-model="activeName"
      active-color="#CB9B73"
      inactive-color="#646566"
      route
    >
      <van-tabbar-item
        :icon="item.icon"
        v-for="(item, index) in tabbarData"
        :name="item.name"
        replace
        :to="item.path"
        :key="index"
      >
        <span>{{ item.title }}</span>
        <template #icon="props">
          <img :src="props.active ? item.activeImg : item.inactiveImg" />
        </template>
      </van-tabbar-item>
    </van-tabbar>

    <!-- #CB9B73 -->
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      //激活下标
      activeName: "Home",
      isIndex: 0,
      tabbarData: [
        {
          title: "首页",
          icon: "home-o",
          //路由名称来跳转
          name: "Home",
          path: "/main/home",
          inactiveImg: require("../assets/images/home.png"),
          activeImg: require("../assets/images/home_active.png"),

          activeClass: "icon-icon_ruixingkafei",
        },
        {
          title: "菜单 ",
          icon: "search",
          name: "Menue",
          path: "/main/menue",
          inactiveImg: require("../assets/images/menu.png"),
          activeImg: require("../assets/images/menu_active.png"),

          activeClass: "icon-kafei",
        },
        {
          title: "购物车",
          icon: "friends-o",
          name: "Shopbag",
          path: "/main/shopbag",
          inactiveImg: require("../assets/images/shopbag.png"),
          activeImg: require("../assets/images/shopbag_active.png"),

          activeClass: "icon-gouwuche",
        },
        {
          title: "我的",
          icon: "setting-o",
          name: "My",
          path: "/main/my",
          inactiveImg: require("../assets/images/my.png"),
          activeImg: require("../assets/images/my_active.png"),

          activeClass: "icon-wode1",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.main {
  padding-bottom: 50px;
  background-color: whitesmoke;
}
</style>