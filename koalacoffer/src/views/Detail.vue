<template>
  <div class="detail">
    <van-nav-bar
      left-text="返回"
      title="商品详情"
      fixed
      left-arrow
      @click-left="back"
    />
    <div>
      <div>
        <img :src="productDetail.large_img" class="auto-img" alt="" />
      </div>
      <div class="pro-info">
        <div class="clearfix">
          <div class="pro-name fl">{{ productDetail.name }}</div>
          <div class="fr pro-price">￥{{ productDetail.price }}</div>
        </div>
        <div>
          <!-- 商品规格 -->
          <div class="rule-box">
            <div
              class="rule-items clearfix"
              v-for="(item, index) in productDetail.rules"
              :key="index"
            >
              <div class="fl rule-title">{{ item.title }}</div>
              <div class="rule-cal">
                <div
                  class="r-item"
                  :class="{ active: item.ruleIndex == i }"
                  v-for="(v, i) in item.rule"
                  @click="toggleRule(item, i)"
                  :key="i"
                >
                  {{ v.title }}
                </div>
              </div>
            </div>

            <div class="pro-count clearfix">
              <div class="fl pro-con">选择商品数量</div>
              <div class="fr pro-num">
                <van-stepper
                  v-model="product.count"
                  theme="round"
                  button-size="24"
                  disable-input
                />
              </div>
            </div>
          </div>

          <!-- 商品描述 -->
          <div class="desc-box">
            <div class="pro-desc">商品描述:</div>
            <div class="desc-text">
              <div
                class="text-item"
                v-for="(item, index) in productDetail.desc"
                :key="index"
              >
                {{ index + 1 }}、{{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-goods-action>
      <van-goods-action-icon
        icon="bag"
        text="购物袋"
        :badge="bagCount == 0 ? '' : bagCount"
        :color="bagCount > 0 ? '#7232DD' : '#646566'"
        @click="toggleShopbag"
      />
      <van-goods-action-icon
        icon="like"
        :text="isLike ? '已收藏' : '收藏'"
        :color="isLike ? '#7232DD' : '#757677'"
        @click="toggleProduct"
      />
      <van-goods-action-button
        color="#be99ff"
        type="warning"
        @click="addShopbag(false)"
        text="加入购物袋"
      />
      <van-goods-action-button
        color="#7232dd"
        type="danger"
        text="立即购买"
        @click="buy(true)"
      />
    </van-goods-action>
  </div>
</template>

<script>
import "../assets/less/detail.less";
export default {
  name: "Detail",
  data() {
    return {
      //商品pid
      pid: "",

      //商品数量
      product: {
        count: 1,
      },

      //购物袋的数量
      bagCount: 0,
      //商品详情数据
      productDetail: {},

      //是否收藏商品
      isLike: false,
    };
  },
  created() {
    //截取pid(注意此处用的是route 不是router)
    this.pid = this.$route.params.pid;
    //

    //获取商品详情数据
    this.getProductDetail();

    //查询收藏商品
    this.findLike();

    //查询购物车商品数量
    this.findShopbag();
  },

  methods: {
    //获取商品详情数据
    getProductDetail() {
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
        url: "/productDetail",
        //  POST请求参数,Object
        // get方式要用params来作为参数
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      })
        .then((result) => {
          //关闭加载轻提示
          this.$toast.clear();
          //请求成功输出
          //

          // 判断是否请求成功
          if (result.data.code == 600) {
            //分割商品描述
            let data = result.data.result[0];
            data.desc = data.desc.split(/\n/);
			     

            let rules = [];
            let ruleData = ["tem", "sugar", "milk", "cream"];
            console.log(ruleData)
            ruleData.map((v) => {
              let r = {};
              
              r.title = data[v + "_desc"];

              //下标激活选项
              r.ruleIndex = 0;

              //每项规格
              r.rule = [];
              //console.log(r.rule)
              //获取规格字符串
              let ruleString = data[v].split("/");
              
              ruleString.map((value) => {
                //判断分割后的字符串是否有值
                if (value !== "") {
                  r.rule.push({ title: value });
                }
              });
              //判断r.rule数组是否为有空值
              if (r.rule.length > 0) {
                rules.push(r);
              }
            });

            data.rules = rules;
            this.productDetail = data;
          }
        })
        .catch((err) => {
          //关闭加载轻提示
          this.$toast.clear();
          //  请求失败输出
        });
      //
    },

    //返回上一级菜单
    back() {
      this.$router.go(-1);
    },

    //切换商品规格
    toggleRule(item, i) {
      //
      //
      item.ruleIndex = i;
    },

    //查询用户是否收藏该商品
    findLike() {
      let tokenString = localStorage.getItem("_tk");
      if (!tokenString) {
        return;
      }
      //发起查询收藏商品请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 1000) {
            if (result.data.result.length > 0) {
              //成功则加入收藏
              this.isLike = true;
            }
          }
          //
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //切换收藏商品
    toggleProduct() {
      //获取token
      let tokenString = localStorage.getItem("_tk");
      //
      if (!tokenString) {
        this.$toast("请先登入您的账号");
        //跳转到登入页面
        return this.$router.push({ name: "Login" });
      }

      //切换路径
      let url = this.isLike ? "/notlike" : "/like";

      //发起收藏商品请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url,
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 800) {
            //成功则加入收藏
            this.isLike = true;
          } else if (result.data.code == 900) {
            //取消收藏
            this.isLike = false;
          }
          this.$toast(result.data.msg);
          //
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //加入购物车
    addShopbag(isBuy) {
      //tokenString: token字符串
      //pid: 商品pid,
      //count: 商品数量,
      //rule: 商品规格,
      //appkey: 你的appkey,
      let tokenString = localStorage.getItem("_tk");
      //
      if (!tokenString) {
        this.$toast("请先登入您的账号");
        //跳转到登入页面
        return this.$router.push({ name: "Login" });
      }
      //请求参数
      let data = {
        tokenString,
        appkey: this.appkey,
        pid: this.pid,
        count: this.product.count,
      };

      //遍历productDetail.rule数组获取选择规格
      //console.log(this.productDetail)
      let rs = [];
      this.productDetail.rules.map((v) => {
        //通过下标找到当前商品规格rules下的rule，放进新数组
        rs.push(v.rule[v.ruleIndex].title);
      });

      data.rule = rs.join("/");
      console.log(data)
      //

      //发起收藏商品请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/addShopcart",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          //
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 3000) {
            if (!isBuy) {
              //加入购物袋
              //
              if (result.data.status == 1) {
                this.bagCount++;
              }
            } else {
              //  立即购买
              //
              this.$router.push({
                name: "Pay",
                query: { sids: result.data.sid },
              });
            }
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //查询用户购物袋数量
    findShopbag() {
      let tokenString = localStorage.getItem("_tk");
      //
      if (!tokenString) {
        return;
      }

      //发起收藏商品请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        //请求参数
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //
          if (result.data.code == 5000) {
            //查看购物带有多少个
            this.bagCount = result.data.result.length;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //点击购物袋跳转
    toggleShopbag() {
      //
      this.$router.push({ name: "Shopbag" });
    },

    //立即购买
    buy(isBuy) {
      this.addShopbag(isBuy);
    },
  },
};
</script>

<style lang="less" scoped>
</style>