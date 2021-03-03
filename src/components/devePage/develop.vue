<template>
    <div class="develop-page">
        <enterprise-name :enterpriseCurCall="enterpriseCurName"></enterprise-name>
        <div class="develop">
            <div class="develop-content">
                <img :src="src" alt="">
                <p>正在建设中，敬请期待……</p>
            </div>
            <div class="button-btn">
                <button @click="goHome">回到主页</button>
            </div>
        </div>
        
    </div>
</template>

<script>
import enterpriseName from '../quotationProcess/processEnterpriseName.vue'
export default {
    name:'develop',
    components:{enterpriseName},
    data(){
        return{
            src: require('@/assets/img/kaifazhong.png')
        }
    },
    created(){
        this.enterpriseCurName = localStorage.getItem('YF_mainstream_project');
    },
    methods:{
        goHome: function(){
            this.$router.go(-1);
        }
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
    p{
        font-size: 14px;
        margin-top: 20px;
    }
}
.button-btn{
    text-align: center;
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    button{
        width: 150px;
        height: 38px;
        border-radius: 5px;
        position: relative;
        overflow: hidden;
        margin-top: 30px;
        &:first-child{
            background: inherit;
            border: 1px solid #60b3ff;
            color: #60b3ff;
        }
    }

}
</style>