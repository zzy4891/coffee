<template>
  <div class="account">
    <van-nav-bar
      left-text="返回"
      title="个人资料"
      fixed
      left-arrow
      @click-left="back"
    />
    <Bgbox>
      <van-cell value="头像" :center="true">
        <div class="account-head">
          <div class="account-head-name">头像</div>
          <div class="user-img fr">
            <img class="auto-img" :src="accountInfo.userImg" alt="" />
            <van-uploader class="upload-box" :after-read="uploadUserImg" />
            <!-- :after-read="afterRead -->
          </div>
        </div>
      </van-cell>
      <van-cell title="昵称" value="内容" :center="true">
        <van-field
          placeholder="请输入昵称"
          v-model="accountInfo.nickName"
          input-align="right"
          maxlength="8"
          @change="updataNickName"
        />
      </van-cell>
      <van-cell title="用户ID" value="125684752" :center="true">{{
        accountInfo.userId
      }}</van-cell>
      <van-cell title="手机号" value="13763904891" :center="true">{{
        accountInfo.phone
      }}</van-cell>
      <div class="clearfix">
        <van-field
          v-model="accountInfo.desc"
          rows="2"
          autosize
          label="简介"
          type="textarea"
          maxlength="30"
          placeholder="请输入简介"
          show-word-limit
          input-align="right"
          @change="updataDesc"
        />
      </div>
    </Bgbox>
  </div>
</template>

<script>
import Bgbox from "../components/Bgbox.vue";
import "../assets/less/account.less";
export default {
  name: "Account",

  data() {
    return {
      accountInfo: {
        nickName: "",
        desc: "",
        phone: "",
        userId: "",
      },
    };
  },

  components: {
    Bgbox,
  },
  created() {
    this.getAccountInfo();
  },
  methods: {
    //返回上一级菜单
    back() {
      this.$router.go(-1);
    },

    //获取用户信息
    getAccountInfo() {
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
        url: "/findAccountInfo",
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
          } else if (result.data.code == "B001") {
            let data = result.data.result[0];
            if (data.desc == "") {
              data.desc = "这家伙很懒，什么都没留下！";
            }
            this.accountInfo = data;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //上传头像
    uploadUserImg(file) {
      //允许文件类型
      let type = ["gif", "png", "jpg", "jpeg"];
      //允许最大文件大小1MB
      let size = 1;
      //判断文件类型
      let fileType = file.file.type.split("/")[1];
      if (type.indexOf(fileType) === -1) {
        this.$toast(`文件类型只支持${type.join(",")}`);
        return;
      }
      //判断文件大小
      let fileSize = file.file.size / 1024 / 1024;
      if (fileSize > size) {
        this.$toast(`文件类型只支持大小不能超过${size}MB`);
        return;
      }

      //处理base64的标记
      let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, "");
      //

      // 发起请求
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
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: fileType,
          serverBase64Img: base64,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "H001") {
            this.accountInfo.userImg = result.data.userBg;
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //修改昵称
    updataNickName() {
      if (!this.accountInfo.nickName) {
        this.$toast("昵称不能为空");
      }

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
        url: "/updateNickName",
        data: {
          appkey: this.appkey,
          tokenString,
          nickName: this.accountInfo.nickName,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //修改简介
    updataDesc() {
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
        url: "/updateDesc",
        data: {
          appkey: this.appkey,
          tokenString,
          desc: this.accountInfo.desc,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //判断token是否正确,错误则跳到登入页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
};
</script>

