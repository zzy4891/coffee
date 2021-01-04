<template>
  <div class="home">
    <van-nav-bar>
      <template #left>
        <div
          class="t1 fl"
          v-if="
            (time =
              ho < 12
                ? 'Morning'
                : ho < 15
                ? 'Noon'
                : ho < 19
                ? 'afternoon'
                : 'Evening')
          "
        >
          {{ time }}
        </div>
        <div class="t3">|</div>
        <div class="t2 fl">{{ userInfo.nickName }}</div>
      </template>
      <template #right>
        <div class="home-search fr">
          <van-search placeholder="请输入商品名称" @focus="searchFocus" />
        </div>
      </template>
    </van-nav-bar>
    <!-- 轮播图 -->
    <div class="home-content">
      <!-- banner轮播图 -->
      <div class="banner-box">
        <van-swipe @change="changeCurrentIndex" :autoplay="3000">
          <van-swipe-item v-for="(item, index) in bannerData" :key="index">
            <img
              class="auto-img"
              :src="item.bannerImg"
              @click="goDetail(item.pid)"
              alt=""
            />
          </van-swipe-item>

          <!-- 自定义指示器 -->
          <template #indicator>
            <div class="index-box">
              <div
                :class="{ active: index == currentIndex }"
                v-for="(item, index) in bannerData"
                :key="index"
              ></div>
            </div>
          </template>
        </van-swipe>
      </div>
    </div>

    <!-- 热卖商品系列 -->
    <div class="product-box">
      <div class="clearfix product-box-info">
        <span class="pro-title">热门推荐</span>
      </div>
      <div class="products clearfix">
        <div
          class="pro-item fl"
          v-for="(item, index) in hotPrductData"
          :key="index"
          @click="goDetail(item.pid)"
        >
          <div>
            <img class="auto-img" :src="item.largeImg" />
          </div>
          <div class="pro-info">
            <div class="pro-name one-text">
              {{ item.name }}
              <span class="pro-detail one-text">({{ item.enname }})</span>
            </div>
            <div class="pro-enname one-text">{{ item.desc }}</div>
            <div class="pro-price">￥{{ item.price }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/home.less";
export default {
  name: "Home",

  data() {
    return {
      //当前轮播图索引
      currentIndex: 0,

      //存储当前轮播图数据
      bannerData: [],

      //存储热卖商品数据
      hotPrductData: [],

      //用户信息
      userInfo: {},

      //分时问候
      time: "",
      ho: new Date().getHours(),
    };
  },
  //创建生命周期勾子
  created() {
    //获取轮播图数据
    this.getBannerData();

    //获取热卖商品数据
    this.getHotProduct();

    //获取用户数据
    this.getUserInfo();
  },

  methods: {
    //修改轮播图片索引
    changeCurrentIndex(index) {
      //
      this.currentIndex = index;
    },

    //获取轮播图数据
    getBannerData() {
      //启动加载轻提示
      this.$toast.loading({
        message: "加载中...",
        //禁止穿透点击
        forbidClick: true,
        //没有时间限制
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/banner",
        //  POST请求参数,Object
        // get方式要用params来作为参数
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          //关闭加载轻提示
          this.$toast.clear();
          //请求成功输出
          //

          //判断是否请求成功
          if (result.data.code == 300) {
            this.bannerData = result.data.result;
          }
        })
        .catch((err) => {
          //关闭加载轻提示
          this.$toast.clear();
          //  请求失败输出
        });
      //
    },

    //获取热卖商品数据
    getHotProduct() {
      //启动加载轻提示
      this.$toast.loading({
        message: "加载中...",
        //禁止穿透点击
        forbidClick: true,
        //没有时间限制
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/typeProducts",
        //  POST请求参数,Object
        // get方式要用params来作为参数
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      })
        .then((result) => {
          //关闭加载轻提示
          this.$toast.clear();
          //请求成功输出
          //

          //判断是否请求成功
          if (result.data.code == 500) {
            this.hotPrductData = result.data.result;
          }
        })
        .catch((err) => {
          //关闭加载轻提示
          this.$toast.clear();
          //  请求失败输出
        });
      //
    },

    //跳转到商品详情页面
    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },

    //获取用户信息
    getUserInfo() {
      //获取token
      let tokenString = localStorage.getItem("_tk");
      //
      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == "A001") {
            this.userInfo = result.data.result[0];
          }

          //
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //搜索栏获取焦点
    searchFocus() {
      this.$router.push({ name: "Search" });
    },
  },
};
</script>
