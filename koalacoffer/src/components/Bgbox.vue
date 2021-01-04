<template>
    <div class="bg-box">
        <div class="bg"></div>
        <div class="bg-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name:'Bgbox'
    }
</script>

<style lang="less" scoped>
    .bg-box{
            .bg{
                height: 120px;
                background-color: #DEB897;
            }
            .bg-content{
                margin: 0 10px;
                position: relative;
                top: -20px;
                background-color: white;
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
                padding: 10px;
            }
        }
</style>