<template>
    <div class="procedure">
        <enterprise-name :enterpriseCurCall="enterpriseCurName" class="cur-name"></enterprise-name>
        <router-view></router-view>
    </div>
</template>

<script>
import enterpriseName from '../processEnterpriseName.vue'
export default {
    name:'procedure',
    components:{enterpriseName},
    data(){
        return{
            enterpriseCurName:'',
            active: 0
        }
    },
    created(){
        this.enterpriseCurName = localStorage.getItem('YF_mainstream_project');
    },
    methods:{
        
    }
}
</script>

<style lang="scss" scoped>
// .cur-name{
//     margin-bottom: 10px;
// }
// .el-steps{
//     position: fixed;
//     top: 50px;
//     color: #373737;
//     width: 100%;
//     padding: 0 15px;
//     box-sizing: border-box;
//     .el-step__title{
//         font-size: 12px;
//     }
// }

</style>
<style lang="scss">
.procedure-step{
    position: fixed;
    top: 55px;
    width: 100%;
    font-size: 0;
}

</style>