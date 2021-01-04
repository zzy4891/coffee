<template>
  <div class="like">
    <van-nav-bar
      left-text="返回"
      title="我的收藏"
      fixed
      left-arrow
      @click-left="back"
    />
    <Bgbox>
      <div class="like-box clearfix" v-if="likeInfo.length > 0">
        <div
          class="fl like-order"
          v-for="(item, index) in likeInfo"
          :key="index"
          @click="getDetail(item.pid)"
        >
          <Product
            :item="item"
            @remove="removeLike(item.pid, index)"
            @view-product="goDetail(item.pid)"
            :is-remove="true"
          ></Product>
        </div>
      </div>
      <div v-else>
        <van-empty description="没有收藏商品" />
      </div>
    </Bgbox>
  </div>
</template>

<script>
import Bgbox from "../components/Bgbox.vue";
import Product from "../components/Product.vue";
import "../assets/less/like.less";
export default {
  name: "Like",
  data() {
    return {
      //查看收藏商品
      likeInfo: [],
      isLike: false,
    };
  },
  components: {
    Bgbox,
    Product,
  },
  created() {
    this.getLikeProduct();
  },
  methods: {
    //返回上一级菜单
    back() {
      this.$router.go(-1);
    },

    //获取收藏商品
    getLikeProduct() {
      //获取token
      let tokenString = localStorage.getItem("_tk");
      //
      if (!tokenString) {
        this.$toast("请先登入您的账号");
        //跳转到登入页面
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 2000) {
            this.likeInfo = result.data.result;
            //
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //查看商品详情
    getDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },

    //删除收藏
    removeLike(pid, index) {
      //获取token
      let tokenString = localStorage.getItem("_tk");

      if (!tokenString) {
        this.$toast("请先登入您的账号");
        //跳转到登入页面
        return this.$router.push({ name: "Login" });
      }
      //发起收藏商品请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/notlike",
        data: {
          appkey: this.appkey,
          pid,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 900) {
            this.$toast("已删除收藏商品");
            this.likeInfo.splice(index, 1);
          } else {
            this.$toast("删除收藏商品失败");
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
};
</script>
