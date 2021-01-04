<template>
  <div class="shopbag">
    <van-nav-bar
      fixed
      left-text="返回"
      :right-text="isEdit ? '完成' : '编辑'"
      title="购物袋"
      left-arrow
      @click-left="goBack"
      @click-right="isEdit = !isEdit"
    />
    <!-- 购物袋为空部分 -->
    <div v-if="shopbagData.length == 0">
      <van-empty description="购物袋空空如也，去逛一逛！">
        <van-button round type="default" class="bottom-button" @click="goMenue">
          逛一逛
        </van-button>
      </van-empty>
    </div>

    <!-- 购物清单部分 -->
    <div v-else class="shopbag-box">
      <div class="shopbag-bg"></div>

      <!-- 购物车懒加载组件 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="呀！我是有底限的！"
        offset="20"
        @load="loadData"
      >
        <div class="shopbag-product">
          <div
            class="shopbag-item"
            v-for="(item, index) in shopbagData"
            :key="item.sid"
          >
            <div class="cell-item">
              <!-- 判断编辑状态来确定是否有滑块功能 -->
              <van-swipe-cell :disabled="!isEdit">
                <div class="clearfix checkbox">
                  <div class="fl check-box">
                    <van-checkbox
                      v-model="item.isChecked"
                      checked-color="#DEB897"
                      @click="simpleSelect"
                      >复选框</van-checkbox
                    >
                  </div>
                  <div class="fr pro-info-box">
                    <div class="fl pro-img">
                      <img class="auto-img" :src="item.small_img" alt="" />
                    </div>
                    <div class="fr pro-info">
                      <div class="pro-info-text">
                        <div class="clearfix">
                          <div class="fl pro-name">{{ item.name }}</div>
                          <div class="fl pro-enname">（{{ item.enname }}）</div>
                        </div>
                        <div class="pro-rule">{{ item.rule }}</div>
                      </div>
                      <div class="pro-count-box">
                        <div class="pro-count-price fl">￥{{ item.price }}</div>
                        <div class="fr step-box">
                          <!-- 计步器功能：计算数量 -->
                          <van-stepper
                            v-model="item.count"
                            theme="round"
                            button-size="22"
                            disable-input
                            @change="changeCount(item)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <template #right>
                  <van-button
                    square
                    type="danger"
                    text="删除"
                    @click="removeOne(index, item.sid)"
                  />
                </template>
              </van-swipe-cell>
            </div>
          </div>
        </div>
      </van-list>

      <!-- 全选结算部分 -->
      <van-submit-bar
        v-if="!isEdit"
        :price="total"
        button-text="提交订单"
        button-color="#DEB897"
        @submit="commit"
      >
        <van-checkbox v-model="isAllChecked" @click="allSelect"
          >全选</van-checkbox
        >
      </van-submit-bar>
      <!-- 全选删除部分 -->
      <van-submit-bar
        v-else
        button-text="删除选择"
        @submit="removeSelected"
        button-color="#DEB897"
      >
        <van-checkbox v-model="isAllChecked" @click="allSelect"
          >全选</van-checkbox
        >
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
import "../assets/less/shopbag.less";
export default {
  name: "Shopbag",
  data() {
    return {
      //购物车单选
      isCheck: false,
      //购物车全选
      isAllChecked: false,
      //购物车数量
      count: 1,
      //是否处于编辑状态
      isEdit: false,

      //清单懒加载参数
      // 懒加载触发
      loading: true,
      // 是否全部懒加载完成数据
      finished: false,
      // 所有购物袋是数据
      allShopbagData: [],
      //每次触底懒加载8条数据
      dataCount: 8,
      //开始截取购物袋数据位置
      startIndex: 0,

      //订单总金额
      total: 0,
      //购物袋数据
      shopbagData: [],
    };
  },
  created() {
    this.getShopbagData();
  },
  methods: {
    //返回上一页
    goBack() {
      this.$router.go(-1);
    },

    //逛一逛
    goMenue() {
      this.$router.push({ name: "Menue" });
    },

    //获取购物袋数据
    getShopbagData() {
      //获取token
      let tokenString = localStorage.getItem("_tk");
      //
      if (!tokenString) {
        this.$toast("请先登入您的账号");
        //跳转到登入页面
        return this.$router.push({ name: "Login" });
      }

      //发起获取购物袋数据请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/findAllShopcart",
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
          } else if (result.data.code == 5000) {
            //判断勾选
            result.data.result.map((v) => {
              v.isChecked = false;
            });

            this.allShopbagData = result.data.result;
            //  根据开始截取位置和清截取数量设置购物袋显示的数据
            this.shopbagData = this.allShopbagData.slice(
              this.startIndex,
              this.startIndex + this.dataCount
            );
            this.startIndex += this.dataCount;
            //未加载
            this.loading = false;
          }

          //
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //购物袋懒加载方法
    loadData() {
      //截取数据
      //
      setTimeout(() => {
        let data = this.allShopbagData.slice(
          this.startIndex,
          this.startIndex + this.dataCount
        );

        this.startIndex += this.dataCount;
        //

        this.shopbagData.push(...data);
        //
        this.isAllChecked = false;
        if (data.length < this.dataCount) {
          //没有数据可加载时，需要将finished修改为true
          this.finished = true;
        } else {
          //每次触发onload事件都需要将loading修改为false，这样可以不在触发onload事件
          this.loading = false;
        }
      }, 1000);
    },

    //全选数据
    allSelect() {
      this.shopbagData.map((v) => {
        v.isChecked = this.isAllChecked;
      });
      //计算价格
      this.getSum();
    },

    //单选数据
    simpleSelect() {
      //计算价格
      this.getSum();
      for (let i = 0; i < this.shopbagData.length; i++) {
        if (!this.shopbagData[i].isChecked) {
          this.isAllChecked = false;
          return;
        }
      }
      this.isAllChecked = true;
    },

    //单个删除
    removeOne(index, sid) {
      //index: shopbagData数组的下标
      // sid ：购物袋sid

      // 用splice方法从下标开截取一位
      // this.shopbagData.splice(index,1);
      // this.getSum();

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
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          sids: JSON.stringify([sid]),
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 7000) {
            // 用splice方法从下标开截取一位
            //如果删除成功，移除商品，并需要重新计算商品总金额
            this.shopbagData.splice(index, 1);
            this.getSum();

            this.$toast(result.data.msg);
          }

          //
        })
        .catch((err) => {
          this.$toast.clear();
        });
      //计算价格
      this.getSum();
    },

    //删除多个
    removeSelected() {
      //获取勾选商品
      let isHas = this.isSelectProduct();

      if (!isHas) {
        this.$toast("请选择删除的商品");
        return;
      }

      let sids = [];
      //sids:勾选商品的购物袋sid集合
      this.shopbagData.map((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

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
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          sids: JSON.stringify([sids]),
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 7000) {
            // 删除页面上的数据
            for (let i = 0; i < this.shopbagData.length; i++) {
              if (this.shopbagData[i].isChecked) {
                this.shopbagData.splice(i, 1);
                i--;
              }
            }
            //如果删除成功，移除商品，并需要重新计算商品总金额
            this.getSum();
          }
          this.$toast(result.data.msg);
          //
        })
        .catch((err) => {
          this.$toast.clear();
        });
      //计算价格
      this.getSum();
    },

    //计算订单总金额
    getSum() {
      this.total = 0;
      this.shopbagData.map((v) => {
        if (v.isChecked) {
          this.total += v.price * v.count;
        }
      });
      //因为要换算成分，所以要放大100倍
      this.total *= 100;
    },

    //修改数量总金额跟着变化
    changeCount(item) {
      // 测试看是否能拿到sid跟count
      // if(item.isChecked){
      //   this.getSum();
      //
      //
      // }
      // return;

      //获取token
      let tokenString = localStorage.getItem("_tk");
      //
      if (!tokenString) {
        this.$toast("请先登入您的账号");
        //跳转到登入页面
        return this.$router.push({ name: "Login" });
      }

      //发起获取购物袋数据请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          sid: item.sid,
          count: item.count,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 6000) {
            if (item.isChecked) {
              this.getSum();
            }
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
      //计算价格
      this.getSum();
    },

    //公用方法
    isSelectProduct() {
      for (let i = 0; i < this.shopbagData.length; i++) {
        if (this.shopbagData[i].isChecked) {
          //如果存在勾选商品
          return true;
        }
      }
      return false;
    },

    //提交订单
    commit() {
      //获取勾选商品
      let isHas = this.isSelectProduct();

      if (!isHas) {
        this.$toast("请选择购买的商品");
        return;
      }

      let sids = [];
      //sids:勾选商品的购物袋sid集合
      this.shopbagData.map((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });
      //拿到sid后跳转到支付页面
      this.$router.push({ name: "Pay", query: { sids: sids.join("-") } });
    },
  },
};
</script>
 