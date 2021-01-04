<template>
  <div class="safety">
    <van-nav-bar
      left-text="返回"
      title="我的收藏"
      fixed
      left-arrow
      @click-left="back"
    />
    <Bgbox>
      <van-cell
        title="修改密码"
        is-link
        :center="true"
        @click="togglePassword"
      />
      <van-cell
        title="注销账号"
        is-link
        :center="true"
        @click="destroyAccount"
      />
      <div class="logout-box">
        <van-button round block color="#CB9B73" @click="logout">
          退出登入
        </van-button>
      </div>
    </Bgbox>
    <van-popup v-model="isOpen" closeable position="bottom">
      <div class="form-box">
        <div class="form-title">修改密码</div>
      </div>
      <van-form>
        <van-field
          v-model="password.oldPassword"
          :type="isPassword ? 'password' : 'text'"
          name="旧密码"
          label="旧密码"
          placeholder="支持字母开头数字_组合(6-16位)"
          :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
          @click-right-icon="toggleType"
          autocomplete="off"
        />
        <van-field
          v-model="password.newPassword"
          :type="isPassword ? 'password' : 'text'"
          name="新密码"
          label="新密码"
          placeholder="支持字母开头数字_组合(6-16位)"
          :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
          autocomplete="off"
          @click-right-icon="toggleType"
        />

        <div class="from-sure">
          <van-button round block color="#CB9B73" @click="commit">
            确认修改
          </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
import Bgbox from "../components/Bgbox.vue";
import "../assets/less/safety.less";
//导入表单验证模块
import { validForm } from "../assets/js/vaildForm";
export default {
  name: "Safety",
  data() {
    return {
      isOpen: false,
      //切换注册密码类型
      isPassword: true,
      password: {
        oldPassword: "",
        newPassword: "",
      },
    };
  },
  components: {
    Bgbox,
  },
  methods: {
    //返回上一级菜单
    back() {
      this.$router.go(-1);
    },

    //切换眼睛状态
    toggleType() {
      this.isPassword = !this.isPassword;
    },

    //修改密码
    togglePassword() {
      this.isOpen = true;
    },

    //注销账号
    destroyAccount() {
      this.$dialog
        .confirm({
          title: "确认注销吗？",
          message: "是否确认注销账号，一旦注销无法恢复！",
          confirmButtonColor: " #ca6511",
        })
        .then(() => {
          //执行注销

          //获取token
          let tokenString = localStorage.getItem("_tk");

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
            url: "/destroyAccount",
            data: {
              appkey: this.appkey,
              tokenString,
            },
          })
            .then((result) => {
              this.$toast.clear();
              //判断token是否正确,错误则跳到登入页面
              if (result.data.code == 700) {
                this.$router.push({ name: "Login" });
              } else if (result.data.code == "G001") {
              }
              this.$toast(result.data.msg);
            })
            .catch((err) => {
              this.$toast.clear();
            });
        })
        .catch((err) => {
          this.$toast("你已取消注销!");
        });
    },

    //退出登入
    logout() {
      this.$dialog
        .confirm({
          title: "确定退出吗？",
          message: "是否确认退出？",
          confirmButtonColor: " #ca6511",
        })
        .then(() => {
          //退出执行
          this.$toast.loading({
            message: "正在退出，请勿终止！",
            forbidClick: true,
            duration: 0,
          });
          setTimeout(() => {
            this.$toast.clear();
            localStorage.removeItem("_tk");
            this.$router.push({ name: "Login" });
          }, 2000);
        })
        .catch((err) => {
          this.$toast("你已取消退出!");
        });
    },

    //提交修改密码
    commit() {
      let o = {
        oldPassword: {
          value: this.password.oldPassword,
          errorMsg: "旧密码支持字母开头数字_组合(6-16位)",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        newPassword: {
          value: this.password.newPassword,
          errorMsg: "新密码支持字母开头数字_组合(6-16位)",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };

      let isPass = validForm.valid(o);
      //请求数据
      if (isPass) {
        //
        if (this.password.newPassword == this.password.oldPassword) {
          this.$toast("新密码不能与旧密码一至");
          return;
        }

        //发起请求
        //获取token
        let tokenString = localStorage.getItem("_tk");

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
          url: "/updatePassword",
          data: {
            appkey: this.appkey,
            tokenString,
            password: this.password.newPassword,
            oldPassword: this.password.oldPassword,
          },
        })
          .then((result) => {
            this.$toast.clear();
            //判断token是否正确,错误则跳到登入页面
            if (result.data.code == 700) {
              this.$router.push({ name: "Login" });
            } else if (result.data.code == "E001") {
              setTimeout(() => {
                localStorage.removeItem("_tk");
                this.$router.push({ name: "Login" });
              }, 1500);
            }
            this.$toast(result.data.msg);
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },
  },
};
</script>

