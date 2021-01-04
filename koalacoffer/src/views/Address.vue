<template>
  <div class="address my-address">
    <van-nav-bar
      fixed
      left-text="返回"
      title="地址列表"
      left-arrow
      @click-left="goBack"
    />
    <!-- 局部组件需要先用import引入，再注入到其父组件中，具有共用性 -->
    <Bgbox>
      <!-- v-model="chosenAddressId"可以删除 -->
      <div v-if="list.length > 0">
        <van-address-list
          v-model="chosenAddressId"
          :list="list"
          default-tag-text="默认"
          @add="add"
          @edit="edit"
        />
      </div>
      <div v-else>
        <van-empty description="没有地址数据" />
      </div>
    </Bgbox>
  </div>
</template>

<script>
//导入局部组件
import Bgbox from "../components/Bgbox";
import "../assets/less/address.less";
import { Toast } from "vant";
export default {
  name: "Address",
  components: {
    Bgbox,
  },
  data() {
    return {
      chosenAddressId: "",
      list: [],
    };
  },
  created() {
    this.getAddressData();
  },
  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },

    //新增地址
    add() {
      this.$router.push({ name: "NewAddress" });
    },

    //编辑地址
    edit(item) {
      this.$router.push({ name: "NewAddress", query: { aid: item.aid } });
    },

    //获取地址列表数据
    getAddressData() {
      //获取token
      let tokenString = localStorage.getItem("_tk");
      //
      if (!tokenString) {
        this.$toast("请先登入您的账号");
        //跳转到登入页面
        return this.$router.push({ name: "Login" });
      }

      //发起查询地址请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/findAddress",
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
          } else if (result.data.code == 20000) {
          console.log(result.data.result)
            result.data.result.map((v) => {
              //处理数据，把isdefault变为bool值，把地址进行拼接
              v.isDefault = Boolean(v.isDefault);
              console.log(v.aid)
              //可以删除
              if (v.isDefault) {
                this.chosenAddressId = v.aid;

              }

              v.id = v.aid;
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
            });
            this.list = result.data.result;
          }

          //
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
};
</script>

<style lang="less" scoped>
.address {
  padding-top: 46px;
}
</style> 