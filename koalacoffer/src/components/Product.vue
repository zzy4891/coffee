<template>
  <div class="product-item">
    <div class="like-order">
      <div class="like-img">
        <img class="auto-img" :src="item.smallImg" alt="" />
      </div>
      <div class="like-title">
        {{ item.name }}
      </div>
      <div class="like-price">
        <span class="info-price fl"> ￥{{ item.price }} </span>
        <span class="info-delete fr" @click.stop="remove()" v-if='isRemove'>
          <van-icon size="19" name="delete" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Product",
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },

    //是否显示删除按钮
      isRemove:{
          type:Boolean,
          default:false
      }
  },
  methods: {
    remove() {
      this.$emit('remove')
    },

    //查看商品详情
    viewProduct(){
        this.$emit('viewProduct');
    }
  },
};
</script>

<style lang="less" scoped>
.product-item {
  .like-order {
    width: 105px;
    height: 153px;
    margin-right: 10px;
    margin-bottom: 10px;
    background-color: whitesmoke;

    &:nth-child(3n) {
      margin-right: 0;
    }
  }
  .like-img {
    width: 85px;
    height: 103px;
    cursor: pointer;
    border-radius: 50%;
    img {
      border-radius: 50%;
      padding: 10px;
    }
  }

  .like-title{
    font-size: 14px;
    color: #d16812;
    padding: 0px 10px;
    overflow: hidden;    
    text-overflow:ellipsis;    
    white-space: nowrap;
  }

  .like-price {
    color: red;
    height: 20px;
    padding: 10px 10px 0px 10px;
    font-size: 12px;
    line-height: 20px;
  }
  .info-delete {
    color: #ccc;
  }
}
</style>