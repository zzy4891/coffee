<template>
  <div class="search">
    <van-nav-bar left-text="返回" fixed left-arrow @click-left="goBack">
      <template #right>
        <div class="home-search fr">
          <van-search
            v-model="name"
            ref="search"
            show-action
            @search="onSearch"
            placeholder="请输入商品名称"
          />
        </div>
      </template>
    </van-nav-bar>
    <Bgbox>
      <div class="like-box clearfix" v-if="peoducts.length > 0">
        <div
          class="fl like-order"
          v-for="(item, index) in peoducts"
          :key="index"
          @click="getDetail(item.pid)"
        >
          <Product :item="item" @view-product="goDetail(item.pid)"></Product>
        </div>
      </div>
      <div v-else>
        <van-empty description="请输入您要搜索的商品哦" />
      </div>
    </Bgbox>
  </div>
</template>

<script>
import Bgbox from "../components/Bgbox.vue";
import Product from "../components/Product.vue";
export default {
  name: "Search",
  data() {
    return {
      //搜索商品关键字
      name: "",

      //搜索商品数据
      peoducts: [],
    };
  },
  components: {
    Bgbox,
    Product,
  },
  created() {
    this.$nextTick(() => {
      //
      //获取搜索款
      let searchIpt = this.$refs.search.querySelector('[type="search"]');
      //
      searchIpt.focus();
    });
    //   this.search();
  },
  methods: {
    //返回上一页
    goBack() {
      this.$router.go(-1);
    },

    //搜索框
    onSearch(val) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/search",
        params: {
          appkey: this.appkey,
          name: this.name,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //判断token是否正确,错误则跳到登入页面

          if (result.data.code == "Q001") {
            this.peoducts = result.data.result;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //查看商品详情
    getDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  padding-top: 46px;

  /deep/ .van-nav-bar__text,
  /deep/.van-icon-arrow-left::before {
    color: #deb897;
  }

  .fr {
    float: right;
  }
  .fl {
    float: left;
  }

  .home-search .van-search {
    padding: 0;
    border-radius: 17px;
    overflow: hidden;
    margin-left: 15px;
  }
  .van-nav-bar__right {
    width: 100%;
    right: -7px;
  }
  /deep/ .home-search .van-icon {
    color: #ccc;
  }
  .like-order {
    width: 105px;
    height: 153px;
    margin-right: 10px;
    margin-bottom: 10px;
    background-color: whitesmoke;

    &:nth-child(3n) {
      margin-right: 0;
    }
  }

  .like-title {
    font-size: 14px;
    color: #d16812;
    padding: 0px 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>