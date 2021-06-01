<template>
    <!-- 完成页面 -->
    <div vkshop-event-scope="生成定投资料-完成页面">
        <enterprise-name :enterpriseCurCall="enterpriseCurName"></enterprise-name>
        <!-- ①子项目初次成功创建时，会跳本页面,
        文案1显示：企业信息已创建完成，是否现在去生成投保单XXXXXX文案1 -->
        <div class="finish-page finish-page-content">
            <div class="finish-success-top">
                <i class="el-icon-check"></i>
                <p>成功</p>
            </div>
            <el-divider class="divider-f"></el-divider>

            <div class="finish-success-tip">
                <p class="tip-content">投保资料包已成功发送至您的企业微信！</p>
                <div class="follow-process">
                    <p class="follow-process-tip">后续流程如下：</p>
                    <p>1、查收资料：企业微信-匠心管家消息。</p>
                    <p>2、核对盖章：核对无误后请投保单位盖章确认。</p>
                    <p>3、承保受理：盖章后请交回至运营承保岗受理（本部-叶晓欣，机构-综合内勤）。</p>
                </div>
                <p>温馨提示：本单投保资料请于XXXX-XX-XX二十四时前收齐并交回至运营或机构内勤。</p>
            </div>

            <div class="footer-button" >
                <el-button @click="waiverModification">好的，我知道了</el-button>
            </div>
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
        }
    },
    created(){
        this.status = this.$route.query.status;
    },
    methods:{
        //返回子项目卡
        waiverModification: function () {
           this.$router.push({path:'/effectIndex'})
        },
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
    font-size: 13px;
    .tip-content{
        text-align: center;
        font-size: 14px;
    }
    .follow-process{
        text-align: left;
        margin: 7px 0;
        border:1px solid #fcf4c8;
        border-radius: 5px;
        padding: 5px 10px;
        p{
            padding: 2px 0;
        }
        .follow-process-tip{
            font-weight: 700;
        }
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
</style>
<style lang="scss">

</style>