<template>
  <div class="order-item">
    <!-- 订单信息 -->
    <div class="pro-box">
      
        <div class="pro-info-box">
          <div class="fl pro-img">
            <img class="auto-img" :src="item.small_img || item.smallImg" alt="" />
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
              <div class="pro-count-price fl">￥{{ item.price}}</div>
              <div class="pro-count-num fr">x{{ item.count }}</div>
            </div>
          </div>
        </div>
     
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderItem",
  props: {
    item: {
      type: Object,
      default() {
        return {
          name:'',
          rule:'',
          enname:'',
          price:null,
          count:null
        };
      },
    },
  },
};
</script>

<style lang="less" scoped>
.order-item {
  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .pro-box {
   
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    
    // padding: 10px 10px 10px 10px;
  }


  .pro-info-box {
    height: 80px;
    width: calc(~"100% - 20px");
    background-color: white;
    padding: 10px;
    // margin-bottom: 10px;
  }

   

  .pro-img {
    width: 80px;
    height: 80px;
  }
  .pro-info {
    width: calc(~"100% - 90px");
    margin-left: 10px;
  }
  .pro-info-text {
    height: 50px;
  }
  .pro-count-box {
    height: 30px;
  }
  .pro-rule {
    font-size: 12px;
    color: #999;
    margin-top: 10px;
  }

  .pro-name {
    font-size: 16px;
    font-weight: bold;
    color: #ca6511;
  }

  .pro-enname {
    width: 110px;
    font-size: 12px;
    line-height: 23px;
    margin-left: 10px;
    color: #DEB897;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pro-count-price {
    font-size: 16px;
    color: #ca6511;
    margin-left: -2px;
    line-height: 44px;
  }

  .pro-count-num {
    font-size: 16px;
    line-height: 44px;
    color: orangered;
  }

  /deep/ .van-button--danger {
    background-color: #DEB897;
    border: 0;
    color: white;
  }

  /deep/ .van-address-item .van-radio__icon--checked .van-icon {
    background-color: #DEB897;
    border: 1px solid #DEB897;
  }

  /deep/ .van-tag--danger {
    background-color: #DEB897;
  }

  .van-popup__close-icon--top-right {
    top: 10px;
  }
  
}
</style>