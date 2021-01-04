<template>
  <div class="menue">
    <van-search
      shape="round"
      background="#DEB897"
      placeholder="请输入搜索关键词"
      @focus="searchFocus"
    />

    <div class="van-grid van-hairline--top">
      <div
        class="van-grid-item"
        style="flex-basis: 25%"
        v-for="(item, index) in menuOptions"
        :key="index"
        @click="toggleMenue(index, item.type)"
      >
        <div
          class="van-grid-item__content van-grid-item__content--center van-hairline"
        >
          <img
            class="auto-img van-grid-img"
            :src="menueIndex == index ? item.activeIcon : item.InActiveIcon"
            alt=""
          />
          <span
            class="van-grid-item__text"
            :class="{ active: menueIndex == index }"
            >{{ item.title }}</span
          >
        </div>
      </div>
    </div>

    <div class="menue-list">
      <div
        class="menue-box"
        v-for="(item, index) in productData"
        :key="index"
        @click="goDetail(item.pid)"
      >
        <div class="fl menue-img">
          <img class="auto-img" :src="item.smallImg" alt="" />
        </div>
        <div class="fr menue-info">
          <div class="menue--title-info fl">
            <div class="menue-title-name">{{ item.name }}</div>
            <div class="menue-title-enname">{{ item.enname }}</div>
          </div>
          <div class="menue-title-price fr">￥{{ item.price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/menue.less";
export default {
  name: "Menue",
  data() {
    return {
      //当前选择的下标
      menueIndex: 0,

      menuOptions: [
        {
          title: "推荐",
          InActiveIcon: require("../assets/images/icons_07.png"),
          activeIcon: require("../assets/images/icons_20.png"),
        },
        {
          title: "咖啡",
          InActiveIcon: require("../assets/images/icons_03.png"),
          activeIcon: require("../assets/images/icons_18.png"),
        },
        {
          title: "拿铁",
          InActiveIcon: require("../assets/images/icons_05.png"),
          activeIcon: require("../assets/images/icons_19.png"),
        },
        {
          title: "瑞纳冰",
          InActiveIcon: require("../assets/images/icons_09.png"),
          activeIcon: require("../assets/images/icons_21.png"),
        },
      ],

      //商品数据
      productData: [],
    };
  },

  created() {
    this.getType();
  },
  methods: {
    //切换菜单
    toggleMenue(index, type) {
      if (this.menueIndex == index) {
        return;
      }
      this.menueIndex = index;

      this.getProductByType(type);
    },

    //获取商品类型
    getType() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 400) {
            let data = result.data.result;
            data.unshift({
              type: "isHot",
              typeDesc: "推荐",
            });

            this.menuOptions.map((v) => {
              for (let i = 0; i < data.length; i++) {
                if (v.title == data[i].typeDesc) {
                  v.type = data[i].type;
                  break;
                }
              }
            });

            let type = this.menuOptions[this.menueIndex].type;

            this.getProductByType(type);

            //
          }
          //
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //根据类型获取商品
    getProductByType(type) {
      let params = {
        appkey: this.appkey,
      };
      if (type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      } else {
        params.key = "type";
        params.value = type;
      }

      //

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params,
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 500) {
            this.productData = result.data.result;
          }

          //
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //查看商品详情
    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },

    //搜索栏获取焦点
    searchFocus() {
      this.$router.push({ name: "Search" });
    },
  },
};
</script>
