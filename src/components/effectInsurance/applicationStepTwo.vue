<template>
<!-- 申请第二步-阅读条款 -->
    <div vkshop-event-scope="新建投保单-读流程">
        <enterprise-name :enterpriseCurCall="enterpriseCurName"></enterprise-name>
        <div class="read-process">
            <p class="read-pre"><span>您将进入投保流程，请仔细阅读以下内容，并做好相应的准备工作：</span></p>
            <div class="read-cotent">
                <p><span>1、客户的统一社会信用代码证（或营业执照）</span></p>
                <p><span>2、单位纳税标识 </span><span>“一般纳税人”需：提供单位注册开户行、账号及电话，是否要专票</span></p>
                <p><span>3、经办人信息 </span><span>联系电话、姓名及身份证</span></p>
                <p><span>4、法定代表人/负责人信息 </span><span>单位总保费达20万的，需法定代表人/负责人的姓名及身份证</span></p>
                <p><span>5、协议 </span><span>报价时若核保要求签署协议的，请提前与核保联系。</span></p>
            </div>
        </div>
        <div class="footer-button">
            <el-button @click="waiverModification" vkshop-event-name="第二步_稍后再说" vkshop-event-type="click">稍后再说</el-button>
            <el-button @click="nextStep" :disabled='times > 0 ? true: false' :class="[times > 0 ?'no-check':'']" vkshop-event-name="第二步_准备好了" vkshop-event-type="click">准备好了<span v-show="times > 0">({{times}}s)</span></el-button>
        </div>
    </div>
</template>

<script>
import enterpriseName from '../quotationProcess/processEnterpriseName.vue'
export default {
    name:'applicationStepTwo',
    components:{enterpriseName},
    data(){
        return{
            enterpriseCurName: localStorage.getItem('YF_mainstream_project'),//项目
            times:10,//至少阅读的时间
            checkedpolicy:null,//上一步选择的有效报价
            // show:true,
        }
    },
    created(){
        this.checkedpolicy  = this.$route.query != undefined ? this.$route.query.checkpolicy : null;
        this.readTime();     
    },
    methods:{
        // 阅读条款倒计时
        readTime: function () {
            // this.show = false
            this.timer = setInterval(()=>{
                this.times--
                if(this.times===0){
                    // this.show = true
                    clearInterval(this.timer)
                }
            },1000)
        },
        //取消修改或者取消填写
        waiverModification: function () {
            this.$confirm('是否退出投保流程？', '确认信息', {
                distinguishCancelAndClose: true,
                confirmButtonText: '是',
                cancelButtonText: '否'
            }).then(() => {
                this.$router.push({path:'/effectIndex'})
            }).catch(action => {});
        },
        // 前往第一步-填写信息
        nextStep: function(){
            if(this.checkedpolicy != null){
                this.$router.push({path:'/corporateInformation',query:{checkedpolicy:this.checkedpolicy}})
            }else{
                this.$alert('没有在上一步选择有效报价，请选择有效报价','提示');
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>
$fontSize-twelve: 12px;
$fontSize-thirteen: 13px;
$fontSize-fourteen: 14px;
.read-process{
    margin-top: 60px;
    padding: 0 15px 60px 15px;
}
.read-pre{
    text-indent: 2em;
    font-size: $fontSize-fourteen;
}
.read-cotent{
    margin-top: 13px;
    background-color: #fff;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: $fontSize-thirteen;
    p{
        line-height: 22px;
        &:not(:first-child){
            padding-top: 10px;
        }
        span{
            display: block;
            &:first-child{
                font-weight: 700;
            }
            &:nth-child(2){
                text-indent: 1em;
            }
        }
    }
}
.footer-button{
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    width: 100%;
    height: 40px;
    padding-top: 5px;
    background-color: #f5f5f5;
    font-size: 0;
    button{
        width: 35%;
        height: 36px;
        background: #fff;
        border: none;
        border-left: 1px solid #d5d4d4;
        color: #62b4ff;
        font-size: $fontSize-twelve;
        &:first-child{
            border-left: 0;
        }
        &:last-child{
            color: #fff;
            background: #62b4ff;
        }
        
    }
    button.no-check{
        background: #bbb;
        color: #666;
    }
}
</style>