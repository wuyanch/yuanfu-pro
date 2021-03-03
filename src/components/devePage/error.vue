<template>
    <div class="develop-page">
        <div class="develop">
            <div class="develop-content">
                <img :src="src" alt="">
                <p>一不小心走进了错误页面~</p>
                <div class="button-zy"><a href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8016693d70c04bd3&redirect_uri=http%3A%2F%2Fwx1.taikang95522.com%2Fjxgj%2FMainTitle.action?function=YFProject&response_type=code&scope=snsapi_base&state=1#wechat_redirect">回到主页</a></div>
            </div>
          
        </div>
        
    </div>
</template>

<script>
export default {
    name:'develop',
    data(){
        return{
            src: require('@/assets/img/no-result.png')
        }
    },
    created(){
    },
    methods:{
        
    }
}
</script>

<style lang="scss" scoped>
.develop{
    padding: 10px 15px;
    margin-top: 50px;
}
.develop-content{
    font-size: 12px;
    text-align: center;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
    p{
        font-size: 14px;
        margin-top: 10px;
    }
}
.button-zy{
    margin-top: 60px;
    width: 100%;
    a{
        width: 150px;
        height: 38px;
        border-radius: 5px;
        position: relative;
        overflow: hidden;
        border: 1px solid #60b3ff;
        text-decoration: none;
        color:#60b3ff;
        padding: 10px 25px;
        font-size: 14px;
    }
}
</style>