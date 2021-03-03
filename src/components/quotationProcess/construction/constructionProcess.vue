<template>
    <div class="constructionProcess">
        <enterprise-name :enterpriseCurCall="enterpriseCurName" class="cur-name"></enterprise-name>
        <router-view></router-view>
    </div>
</template>

<script>
import enterpriseName from '../processEnterpriseName.vue'
export default {
    name:'constructionProcess',
    components:{enterpriseName},
    data(){
        return{
            enterpriseCurName:'广州市美丽新天地金融控股有限公司',
            active: 0
        }
    },
    methods:{
        
    }
}
</script>

<style lang="scss" scoped>
.cur-name{
    margin-bottom: 10px;
}
.el-steps{
    position: fixed;
    top: 50px;
    color: #373737;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    .el-step__title{
        font-size: 12px;
    }
}

</style>
<style lang="scss">


</style>