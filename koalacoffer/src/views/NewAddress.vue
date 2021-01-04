<template>
  <div class="new-address">
    <!-- 新增地址头部导航 -->
    <van-nav-bar
      fixed
      left-text="返回"
      :title="aid ? '编辑地址' : '新增地址'"
      left-arrow
      @click-left="goBack"
    />

    <!-- 新增地址部分 -->
    <!-- 
            show-postal:展示邮政编码
            show-set-default：设置默认收货地址
            show-delete：设置删除按钮
            show-search-result：设置详细地址搜索结果
            address-info:收货人信息初始值	
            注意：
            此处的areaList不能直接使用，
            需要找到vant里面的 Area 组件中的Area.json文件下的src文件下的
            address-edit文件下的area.js,才是完整数据
            因为里面的data数据必须从外部导入
         -->
    <van-address-edit
      :area-list="areaList"
      show-set-default
      :show-delete="!!aid"
      show-search-result
      save-button-text="保存地址"
      @delete="removeAddress"
      :address-info="addressInfo"
      @save="save"
      :area-columns-placeholder="['选择省', '选择市', '请选择区']"
    />
  </div>
</template>

<script>
//导入全国省份地区数据
import areaList from "../assets/js/area";
export default {
  name: "NewAddress",
  data() {
    return {
      //全国所有省份地区数据
      areaList,

      //地址aid
      aid: "",

      //地址初始值
      addressInfo: {},
    };
  },

  created() {
    //截取查询参数，存在为编辑地址，否则为新增地址，:(注意此处是route，不是router)
    this.aid = this.$route.query.aid;

    //判断aid是否存在，存在则请求数据
    if (this.aid) {
      //根据地址aid查询地址数据
      this.getAddressDataByAid();
    }
  },

  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },

    //保存地址
    save(content) {
     
      //判断tokenString
      let tokenString = localStorage.getItem("_tk");

      if (!tokenString) {
        this.$toast("请先登入您的账号");
        //跳转到登入页面
        return this.$router.push({ name: "Login" });
      }

      //

      //复制content
      let addressInfo = Object.assign({}, content);
     
      //   删除country属性
      delete addressInfo.country;

      addressInfo.tokenString = tokenString;
      addressInfo.appkey = this.appkey;
      addressInfo.isDefault = Number(addressInfo.isDefault);

      //发起新增地址请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      if (!this.aid) {
        //新增地址
        this.address(addressInfo, "/addAddress");
      } else {
        //编辑地址
        // this.editAdress(addressInfo);
        //修改后的地址

        //初始地址

        let isModify = false;
        for (let key in this.addressInfo) {
          if (content[key] != this.addressInfo[key]) {
            isModify = true;
          }
        }
        if (isModify) {
          //发起请求
          this.address(addressInfo, "/editAddress");
        } else {
          return this.$toast("请修改地址信息");
        }
      }
    },

    //新增地址与编辑地址
    address(addressInfo, url) {
     
   
      this.axios({
        method: "POST",
        url,
        data: addressInfo,
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 9000 || result.data.code == 30000) {
            this.$router.push({ name: "Address" });

            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //根据地址aid查询地址数据
    getAddressDataByAid() {
      //判断tokenString
      let tokenString = localStorage.getItem("_tk");

      if (!tokenString) {
        this.$toast("请先登入您的账号");
        //跳转到登入页面
        return this.$router.push({ name: "Login" });
      }

      //发起aid查询地址数据请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: "/findAddressByAid",
        params: {
          tokenString,
          appkey: this.appkey,
          aid: this.aid,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 40000) {
            console.log(aid)
            //console.log(data)
            let data = result.data.result[0];
            data.isDefault = Boolean(data.isDefault);
            this.addressInfo = data;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //移除地址
    removeAddress() {
      //判断tokenString
      let tokenString = localStorage.getItem("_tk");

      if (!tokenString) {
        this.$toast("请先登入您的账号");
        //跳转到登入页面
        return this.$router.push({ name: "Login" });
      }

      //发起aid查询地址数据请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "POST",
        url: "/deleteAddress",
        data: {
          tokenString,
          appkey: this.appkey,
          aid: this.aid,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 10000) {
            this.$router.push({ name: "Address" });
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
.new-address {
  padding-top: 46px;
  padding-bottom: 145px;

  /deep/ .van-nav-bar__text {
    color: #deb897;
  }

  /deep/ .van-nav-bar .van-icon {
    color: #deb897;
  }

  /deep/ .van-button--danger {
    background-color: #deb897;
    border: 0;
    color: white;
  }

  /deep/ .van-switch--on {
    background-color: #deb897;
  }
}
</style>