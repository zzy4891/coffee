<template>
  <div class="order-list">
    <div class="pro-box">
      <div class="info-boxs clearfix">
        <div class="info-title fl l">{{ infoTitleLeft }}</div>
        <div class="fr info-title re-info" v-if="isRight">
          <div v-if="!isReceive" @click='confirmReceive'>确认收货</div>
          <div class="fr clearfix" v-else>
            <div class="fl">已完成</div>
            <div class="fl delete" @click='remove'>
              <van-icon size="19" name="delete"/>
            </div>
          </div>
        </div>
      </div>
      <div class="info-tab">
        <!-- 商品信息 -->
        <slot></slot>
      </div>

      <div class="total-info">
        <div class="info-time" v-if="date != '' ">{{date}}</div>
        <div class="clearfix">
          <div class="total-count fl">
            共计<span class="total-num">{{ count }}</span
            >件
          </div>
          <div class="total-price fr">
            合计<span class="total-num">￥ {{ total | decimal}} </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderItem from "../components/OrderItem";
export default {
  name: "OrderList",
  props: {
    //左边title
    infoTitleLeft: {
      type: String,
      default: "订单信息",
    },
    //右边title
    isRight: {
      type: Boolean,
      default: false,
    },

    //时间显示
    date: {
      type: String,
      default: "",
    },

    //商品数量
    count: {
      type: Number,
      default: 0,
    },

    //订单总金额
    total: {
      type: [Number,String],
      default: 0,
    },

     //确认收货
      isReceive:{
        type:Boolean,
        default:false
      }
  },

  components: {
    OrderItem,
  },

  //确认收货
  methods: {
    confirmReceive(){
      //发射事件
      this.$emit('confirm-receive');
      // 
    },

    //删除方法
    remove(){
     this.$emit('remove');
    }
  },
};
</script>

<style lang="less" scoped>
.order-list {
  
  .fl {
    float: left;
  }

  .fr {
    float: right;
  }
  
  .pro-box {
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    // background-color: white;
    background-color: whitesmoke ;
    // padding: 10px 10px 10px 10px;
    padding-bottom : 10px;
    margin-bottom: 10px;
  }

  .info-title {
    font-size: 16px;
    margin-bottom: 10px;
    color: #DEB897;
    margin-left: 10px;
    margin-top: 10px;
  }
  .info-boxs {
    border-bottom: 1px dashed #ccc;
    background-color: white;
    
  }
  .l {
    color: #948989 !important;
  }
  .info-bar {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .total-info {
    width: calc(~"100% - 0px");
 
    font-size: 16px;
    justify-content: space-between;
    position: relative;
    background-color: white;
    bottom: 0px;
    left: 0;
    padding:30px 10px 10px 10px;
    
  }

  .total-count,
  .total-price {
    color: #DEB897;
  }
  .info-time {
    margin-bottom: 10px;
    color:#948989;
  }
  .total-num {
    margin: 0 5px;
    color: red;
    font-size: 20px;
  }

  .delete {
    width: 19px;
    height: 19px;
    //   background-color: #000;
    margin-top: 2px;
    margin-left: 10px;
  }
}
</style>