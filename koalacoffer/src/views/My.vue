<template>
  <div class="my">
    <div
      class="my-bg"
      :style="{ backgroundImage: `url('${userInfo.userBg}')` }"
    >
      <van-uploader class="upload-box" :after-read="uploadBg" />
    </div>
    <div class="my-info">
      <div class="clearfix">
        <div class="fl my-img">
          <img class="auto-img" :src="userInfo.userImg" alt="" />
        </div>
        <div class="fl my-info-box">
          <div class="user-name">
            {{ userInfo.nickName }}
            <van-icon class="user-name-icon" size="26" name="vip-card-o" />
          </div>
          <div class="user-desc">
            <van-icon class="user-desc-icon" size="16" name="edit" />
            {{
              userInfo.desc == "" ? "这家伙很懒，什么都没留下！" : userInfo.desc
            }}
          </div>
        </div>
      </div>
      <div class="my-more-info">
        <div class="my-more">更多</div>
        <van-grid>
          <van-grid-item
            v-for="(v, k) in moreData"
            :key="k"
            :icon="v.icon"
            :text="v.text"
            @click="goPage(v.name)"
          />
        </van-grid>
      </div>
      <div class="my-info-title">
        <van-cell
          v-for="(item, index) in listData"
          :key="index"
          :title="item.title"
          is-link
          @click="goPage(item.name)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/my.less";
export default {
  name: "My",
  data() {
    return {
      //更多
      moreData: [
        {
          icon: "coupon-o",
          text: "红包卡券",
          name: "Coupon",
        },
        {
          icon: "like-o",
          text: "我的收藏",
          name: "Like",
        },
        {
          icon: "user-circle-o",
          text: "客服",
          name: "Secure",
        },
        {
          icon: "location-o",
          text: "地址",
          name: "Address",
        },
      ],
      //列表数据
      listData: [
        {
          title: "个人资料",
          name: "Account",
        },
        {
          title: "我的订单",
          name: "Order",
        },
        {
          title: "安全中心",
          name: "Safety",
        },
      ],
      //用户信息
      userInfo: {},
    };
  },
  created() {
    //获取用户信息
    this.getUserInfo();
  },
  methods: {
    //获取用户信息
    getUserInfo() {
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
        url: "/findMy",
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
          } else if (result.data.code == "A001") {
            this.userInfo = result.data.result[0];
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //上传背景图
    uploadBg(file) {
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
        url: "/updateUserBg",
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
          } else if (result.data.code == "I001") {
            this.userInfo.userBg = result.data.userBg;
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //跳转路由
    goPage(name) {
      this.$router.push({ name });
    },
  },
};
</script>

