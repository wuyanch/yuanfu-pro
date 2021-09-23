<template>
    <!-- 完成页面 -->
    <div vkshop-event-scope="完善信息-完成页面">
        <enterprise-name :enterpriseCurCall="enterpriseCurName"></enterprise-name>
        <!-- ①子项目初次成功创建时，会跳本页面,
        文案1显示：企业信息已创建完成，是否现在去生成投保单XXXXXX文案1 -->
        <div class="finish-page finish-page-content">
            <div class="finish-success-top">
                <i class="el-icon-check"></i>
                <p>{{tipSuccess}}</p>
            </div>
            <el-divider class="divider-f"></el-divider>
            <div class="finish-success-tip" v-if="(status == 3 || status == 4) && repair == 0">
                <p>企业信息已创建完成。<br><br>是否现在去生成投保单</p>
            </div>

             <div class="finish-success-tip" v-if="(status == 3 || status == 4) && repair == 1">
                <p style="text-align:left;">企业信息已修改成功，如果要使用新的企业信息进行投保，请生成新的投保单。<br><br>是否现在去生成投保单?</p>
            </div>

            <div class="finish-success-tip" v-if="status == 1">
                <p>团核人员将尽快审核。<br>审核时长：1个工作日。</p>
            </div>

            <div class="footer-button" v-if="status == 3 || status == 4" style="margin-top:0px">
                <el-button @click="waiverModification">稍后再说</el-button><el-button @click="godetermineI" vkshop-event-name="完成企业信息修改_立即生成投保单" vkshop-event-type="click">是，去生成</el-button>
            </div>
            <div class="footer-button" v-if="status == 1">
                <el-button @click="waiverModification">好的，我知道了</el-button>
            </div>
            <p class="tip" v-if="status == 1">注：审核通过后在投保单位下的投保单右侧点击“+新建”按钮创建投保单。</p>
        </div>
        
    </div>
</template>

<script>
import enterpriseName from '../quotationProcess/processEnterpriseName.vue'
export default {
    name: 'corporateFinish',
    components:{enterpriseName},
    data(){
        return{
            enterpriseCurName: localStorage.getItem('YF_mainstream_project'),//项目
            status:null,
            repair:null,
            projectId:'',
            tipSuccess:''
        }
    },
    created(){
        this.finishF()
    },
    methods:{
        // 提示语初始化
        finishF () {
            this.status = this.$route.query.status;
            this.projectId = this.$route.query.id;
            this.repair = this.$route.query.repair;
            if(this.status == 1){
                this.tipSuccess = '提交成功'
            } else {
                this.tipSuccess = '成功'
            }
        },
        //取消修改或者取消填写
        waiverModification: function () {
           this.$router.push({path:'/effectIndex'})
        },
        godetermineI: function(){
            let id = this.projectId;
            this.$router.push({path:'/determineInformation',query:{id:id}})
        }
    }
}
</script>

<style lang="scss" scoped>
$fontSize-twelve: 12px;
$fontSize-thirteen: 13px;
$fontSize-fourteen: 14px;
.finish-page{
    padding: 30px 15px;
}
.finish-page-content{
    background: #fff;
    border-radius: 5px;
    margin: 60px 15px;
   
}

.finish-success-top{
    text-align: center;
    i{
        color: white;
        background: #62b4ff;
        border-radius: 100px;
        padding: 5px;
        font-size: 25px;
    }
    p{
        font-size: 14px;
        margin-top: 5px;
        font-weight: 700;
    }
}
.finish-success-tip{
    margin-top: 20px;
    p{
        font-size: 14px;
        text-align: center;
    }
    
}
.divider-f{
    height: 1px;
    border-top: 1px dotted #d5d4d4;
    background: inherit;
}
.footer-button{
    // position: fixed;
    // bottom: 0;
    // left: 0;
    text-align: center;
    width: 100%;
    height: 40px;
    padding-top: 5px;
    // background-color: #ededed;
    margin-top: 20px;
    font-size: 0;
    
    button{
        // width: 35%;
        height: 36px;
        background: #fff;
        border: none;
        color: #62b4ff;
        font-size: $fontSize-twelve;
        border: 1px solid #62b4ff;
        line-height: 1px;
        &:first-child{
            border: 1px solid #62b4ff;
        }
        &:last-child{
            color: #fff;
            background: #62b4ff;
        }
        
    }
    button.no-check{
        background: #999;
        color: #666;
    }
}
.tip{
    color: #999;
    font-size: 12px;
    margin-top: 20px;
}
</style>
<style lang="scss">

</style>