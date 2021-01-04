<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar left-text="返回" right-text="先逛一逛" @click-right="goState">
      <!-- #left表示插槽名 -->
      <template #left>
        <div class="nav-left">
          <div class="logo iconfon">
            <img class="auto-img" src="../assets/images/koala.png" alt="" />
          </div>
          <div class="logo-text">Koala Coffee</div>
        </div>
      </template>
    </van-nav-bar>

    <!-- 内容区 -->
    <div class="logo-box iconfont icon-kaola">
      <img class="auto-img" src="../assets/images/koala.png" alt="" />
    </div>
    <div class="user-box">
      <div class="user-title">
        <div class="welcome">找回密码</div>
        <div class="sub-title">Please find your password</div>
      </div>

      <van-form v-show="!isNext">
        <van-field
          v-model="userInfo.email"
          name="邮箱"
          label="邮箱"
          placeholder="邮箱"
          autocomplete="off"
        />

        <van-field
          v-model="userInfo.code"
          name="验证码"
          label="验证码"
          placeholder="验证码"
          autocomplete="off"
          maxlength="6"
          @click-right-icon="toggleRegisterPasswordType"
        >
          <template #button>
            <van-button
              size="small"
              color="#CB9B73"
              :disabled="isSend"
              @click="getValidCode"
              >{{ text }}</van-button
            >
          </template>
        </van-field>
        <div class="forget">
          <span @click="goState('Login')">已有账号,立即登入</span>
        </div>

        <div class="commit-btn">
          <van-button round block color="#CB9B73" @click="next">
            下一步
          </van-button>
        </div>
      </van-form>

      <van-form v-show="isNext">
        <van-field
          v-model="userInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="手机号"
          autocomplete="off"
        />

        <van-field
          v-model="userInfo.password"
          :type="isRegisterPassword ? 'password' : 'text'"
          name="密码"
          label="密码"
          placeholder="密码"
          :right-icon="isRegisterPassword ? 'closed-eye' : 'eye-o'"
          autocomplete="off"
          @click-right-icon="toggleRegisterPasswordType"
        />

        <div class="forget">
          <span @click="goState('Login')">已有账号,立即登入</span>
        </div>

        <div class="commit-btn">
          <van-button round block color="#CB9B73" @click="commit">
            提交
          </van-button>
        </div>
        <div class="commit-btn">
          <van-button round block type="default" @click="back">
            返回
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
//导入表单less样式
import "../assets/less/login.less";
//导入表单验证js(注意：到处有名函数必须+{}解构)
import { validForm } from "../assets/js/vaildForm";

export default {
  name: "Login",
  data() {
    return {
      //用户登入信息
      userInfo: {
        phone: "",
        password: "",
        email: "",
        code: "",
      },

      //切换注册密码类型
      isRegisterPassword: true,

      //是否继续下一步
      isNext: false,

      //是否发送验证码按钮
      isSend: false,

      //发送验证码
      text: "发送验证码",
    };
  },
  methods: {
    //切换注册框（弹出层）
    toggleRegisterBox() {
      this.isShow = true;
    },

    //切换密码框类型 (睁眼、闭眼)
    toggleRegisterPasswordType() {
      this.isRegisterPassword = !this.isRegisterPassword;
    },

    //返回上一层
    back() {
      this.isNext = false;
    },

    //邮箱验证
    next() {
      let o = {
        email: {
          value: this.userInfo.email,
          errorMsg: "邮箱格式不正确",
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        },
        code: {
          value: this.userInfo.code,
          errorMsg: "验证码格式不正确",
          reg: /^[A-Za-z\d]{6}$/,
        },
      };

      let isPass = validForm.valid(o);
      if (isPass) {
        //
        this.isNext = true;

        //发起验证码请求
        //发起请求
        //启动加载轻提示
        this.$toast.loading({
          message: "加载中...",
          //禁止穿透点击
          forbidClick: true,
          //没有时间限制
          duration: 0,
        });

        this.axios({
          method: "POST",
          url: "/checkValidCode",
          //  POST请求参数,Object
          // data:paramsString,
          data: {
            appkey: this.appkey,
            validCode: this.userInfo.code,
          },
        })
          .then((result) => {
            //关闭加载轻提示
            this.$toast.clear();
            //
            this.$toast(result.data.msg);
            if (result.data.code == "K001") {
              this.isNext = true;
            }
          })
          .catch((err) => {
            //关闭加载轻提示
            this.$toast.clear();
            //  请求失败输出
          });
        //
      }
    },

    //获取邮箱验证码
    getValidCode() {
      let o = {
        email: {
          value: this.userInfo.email,
          errorMsg: "邮箱格式不正确",
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        },
      };

      let isPass = validForm.valid(o);
      if (!isPass) {
        return;
      }

      let time = 60;
      this.isSend = true;
      this.text = `${time}后重新发送`;
      let timer = setInterval(() => {
        if (time <= 1) {
          clearInterval(timer);
          timer = null;
          time = 60;
          this.isSend = false;
          this.text = `发送验证码`;
        } else {
          time--;
          this.text = `${time}后重新发送`;
        }
      }, 1000);

      //发起请求
      //启动加载轻提示
      this.$toast.loading({
        message: "加载中...",
        //禁止穿透点击
        forbidClick: true,
        //没有时间限制
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/emailValidCode",
        //  POST请求参数,Object
        // data:paramsString,
        data: {
          appkey: this.appkey,
          email: this.userInfo.email,
        },
      })
        .then((result) => {
          //关闭加载轻提示
          this.$toast.clear();

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          //关闭加载轻提示
          this.$toast.clear();
          //  请求失败输出
        });
      //
    },

    //逛一逛跳转按钮
    goState(name) {
      //跳转到首页
      this.$router.push({ name });
    },

    //提交验证
    commit() {
      let o = {
        phone: {
          // 注意此处的值跟正则表达式不需要用双引号
          value: this.userInfo.phone,
          errorMsg: "号码格式不正确",
          reg: /^1[1-8]\d{9}$/,
        },
        password: {
          value: this.userInfo.password,
          errorMsg: "新密码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };

      let isPass = validForm.valid(o);
      if (isPass) {
        //启动加载轻提示
        this.$toast.loading({
          message: "加载中...",
          //禁止穿透点击
          forbidClick: true,
          //没有时间限制
          duration: 0,
        });

        //发起修改密码请求
        this.axios({
          method: "POST",
          url: "/retrievePassword",
          //  POST请求参数,Object
          // data:paramsString,
          data: {
            appkey: this.appkey,
            phone: this.userInfo.phone,
            password: this.userInfo.password,
          },
        })
          .then((result) => {
            //关闭加载轻提示
            this.$toast.clear();

            this.$toast(result.data.msg);
            if (result.data.code == "L001") {
              setTimeout(() => {
                this.$router.push({ name: "Login" });
              }, 3000);
            }
          })
          .catch((err) => {
            //关闭加载轻提示
            this.$toast.clear();
            //  请求失败输出
          });
        //
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>  