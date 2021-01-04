<template>
  <div class="order">
    <!-- 头部导航 -->
    <van-nav-bar
      fixed
      left-text="返回"
      title="我的订单"
      left-arrow
      @click-left="goBack"
    />
    <BgBox>
      <div v-if="isHas">
        <van-tabs
          v-model="tabIndex"
          color="#ca6511"
          title-active-color="#ca6511"
          line-height="2"
          @change="changeTab"
        >
          <van-tab
            :title="item.title"
            v-for="(item, index) in tabData"
            :key="index"
          >
            <div v-if="orderData.length > 0">
              <div class="order-box" v-for="(v, k) in orderData" :key="v.oid">
                <OrderList
                  :info-title-left="v.oid"
                  :date="v.date | format('yyyy-MM-dd hh:mm:ss')"
                  :count="v.count"
                  :total="v.total"
                  :is-right="true"
                  @confirm-receive="confirmReceive(v, k)"
                  :is-receive="v.status == 2"
                  @remove="removeOrder(v.oid, k)"
                >
                  <OrderItem
                    v-for="(value, idx) in v.data"
                    :item="value"
                    :key="idx"
                  ></OrderItem>
                </OrderList>
              </div>
            </div>
            <div v-else>
              <van-empty description="没有订单数据" />
            </div>
          </van-tab>
        </van-tabs>
      </div>
      <div v-else>
        <van-empty description="没有订单数据" />
      </div>
    </BgBox>
  </div>
</template>

<script>
import "../assets/less/order.less";
import BgBox from "../components/Bgbox.vue";
import OrderList from "../components/OrderList.vue";
import OrderItem from "../components/OrderItem.vue";
export default {
  name: "Order",

  components: {
    BgBox,
    OrderList,
    OrderItem,
  },

  data() {
    return {
      //激活tab标签的下标
      tabIndex: 0,

      tabData: [{ title: "全部" }, { title: "进行中" }, { title: "已完成" }],

      //订单商品是数据
      orderData: [],

      //没有订单数据
      isHas: true,
    };
  },
  created() {
    this.getOrderDataByStatus();
  },
  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },

    //切换订单状态：0:全部 1：进行中 2：已完成
    changeTab(name, title) {
      //
      //
      //

      this.getOrderDataByStatus();
    },

    //根据订单状态获取订单数据
    getOrderDataByStatus() {
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
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status: this.tabIndex,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 70000) {
            //如果全部没有订单数据，则移除tab
            if (this.tabIndex == 0 && result.data.result.length == 0) {
              this.isHas = false;
              return;
            }

            let orderDatas = [];
            result.data.result.map((v) => {
              //查找orderDatas的订单数据，如果找到，则将该商品存放在当前订单里面，累加当前订单的商品数量和当前订单的总金额
              for (let i = 0; i < orderDatas.length; i++) {
                if (orderDatas[i].oid == v.oid) {
                  orderDatas[i].data.push(v);
                  orderDatas[i].count += v.count;
                  orderDatas[i].total += v.count * v.price;
                  return;
                }
              }
              //初始化操作
              //订单日期
              let o = {};
              o.oid = v.oid;
              o.date = v.createdAt;
              // 订单数量
              o.count = v.count;
              //订单总额
              o.total = v.price * v.count;
              //订单状态
              o.status = v.status;
              o.data = [v];
              orderDatas.push(o);
            });
            //
            this.orderData = orderDatas;
            //
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //确认收货
    confirmReceive(item, index) {
      //
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
        method: "POST",
        url: "/receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid: item.oid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 80000) {
            if (this.tabIndex == 1) {
              this.orderData.splice(index, 1);
            }
            item.status = 2;
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });

      item.status = 2;
    },

    //删除订单
    removeOrder(oid, index) {
      //
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
        method: "POST",
        url: "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 90000) {
            this.orderData.splice(index, 1);
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style> 