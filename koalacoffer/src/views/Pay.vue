<template>
  <div class="pay">
    <!-- 头部导航 -->
    <van-nav-bar
      fixed
      left-text="返回"
      title="商品详情"
      left-arrow
      @click-left="goBack"
    />

    <!-- 选择地址 -->
    <div class="pay-box">
      <div class="select-address">
        <div class="select-add">
          <span class="chose-add" @click="showSelectAddressList">
            <van-icon class="add-icon" name="location-o" />
            选择收获地址
          </span>
          <van-icon class="arrow" name="arrow" />
        </div>
        <div class="user-box">
          <div class="user-info">
            <div class="user-name">{{ currentAddress.name }}</div>
            <div class="user-phone">{{ currentAddress.tel }}</div>
            <div class="default-address" v-if="currentAddress.isDefault">
              默认
            </div>
          </div>
          <div class="detail-address">{{ currentAddress.address }}</div>
        </div>
      </div>

      <div>
        <OrderList
          info-title-left="订单信息"
          :count="productInfo.count"
          :total="productInfo.total"
        >
          <OrderItem
            v-for="(item, index) in products"
            :key="index"
            :item="item"
          ></OrderItem>
        </OrderList>
      </div>
    </div>

    <!-- 订单信息 -->

    <!-- 结算按钮 -->
    <div class="btn-box">
      <van-button type="primary" block round color="#DEB897" @click="payBox"
        >立即结算</van-button
      >
    </div>
    <!-- 选择地址弹出框 -->
    <van-popup v-model="isOpen" closeable position="bottom">
      <div class="address-title">选择地址</div>
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="newAddress"
        @select="selectAddress"
      />
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/pay.less";

import OrderList from "../components/OrderList";
import OrderItem from "../components/OrderItem";

export default {
  name: "Pay",
  components: {
    OrderItem,
    OrderList,
  },
  data() {
    return {
      isOpen: false,
      //选择地址的id
      chosenAddressId: "",
      //地址列表
      list: [],
      //选择当前地址
      currentAddress: {},
      //购物袋sids
      sids: [],
      //需要购买的商品的数据
      products: [],
      //商品数量和订单总价
      productInfo: {
        count: 0,
        total: 0,
      },
    };
  },
  created() {
    //截取查询参数
    this.sids = this.$route.query.sids.split("-");
    //
    //提交订单页面查询需要购买商品
    this.getAddressBySids();
    //获取地址列表数据
    this.getAddressData();
  },
  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },

    //新增地址
    newAddress() {
      this.$router.push({ name: "NewAddress" });
    },

    //选择地址时触发
    selectAddress(item, index) {
      //
      //
      //选择后关闭
      this.isOpen = false;
      this.currentAddress = item;
    },

    //展示选择地址列表
    showSelectAddressList() {
      this.isOpen = true;
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
          //console.log(result.data.result)
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 20000) {
            result.data.result.map((v) => {
              //处理数据，把isdefault变为bool值，把地址进行拼接
              v.isDefault = Boolean(v.isDefault);
              v.id = v.aid;
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;

              if (v.isDefault) {
                this.chosenAddressId = v.aid;
                this.currentAddress = v;
              }
            });
            this.list = result.data.result;
          }

          //
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //根据sids获取购物袋数据
    getAddressBySids() {
      //获取token
      let tokenString = localStorage.getItem("_tk");
      //
      if (!tokenString) {
        this.$toast("请先登入您的账号");
        //跳转到登入页面
        return this.$router.push({ name: "Login" });
      }

      //发起购物袋数据请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          //将数组变成字符串
          sids: JSON.stringify(this.sids),
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 50000) {
            if (result.data.result.length == 0) {
              //如果没有商品购买则跳转到首页
              return this.$router.push({ name: "Home" });
            }

            result.data.result.map((v) => {
              this.productInfo.count += v.count;
              this.productInfo.total += v.price * v.count;
            });
            this.products = result.data.result;
          } else {
            this.$toast(result.data.msg);
          }

          //
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //结算订单
    pay() {
      //获取token
      let tokenString = localStorage.getItem("_tk");
      //
      if (!tokenString) {
        this.$toast("请先登入您的账号");
        //跳转到登入页面
        return this.$router.push({ name: "Login" });
      }

      //发起购物袋数据请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/pay",
        data: {
          appkey: this.appkey,
          //将数组变成字符串
          sids: JSON.stringify(this.sids),
          tokenString,
          phone: this.currentAddress.tel,
          address: this.currentAddress.address,
          receiver: this.currentAddress.name,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
            setTimeout(() => {
              //结算成功后跳转到订单页面
              this.$router.push({ name: "Order" });
            }, 1000);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //结算提示
    payBox() {
      this.$dialog
        .confirm({
          title: "确认提交吗？",
          confirmButtonColor: " #ca6511",
        })
        .then(() => {
          //提交订单
          this.pay();
        })
        .catch((err) => {
          this.$toast("你已取消结算!");
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>