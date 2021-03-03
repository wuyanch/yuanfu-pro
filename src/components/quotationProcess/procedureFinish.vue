<template>
    <div class="procedure-finish" vkshop-event-scope="完成页面">
        <div class="finish-content">
           <i class="el-icon-success"></i>
           <p class="describe-el-icon">恭喜你，成功提交询价</p>
           <p class="inquiry-no">询价号：{{inquiryNo}}</p>
           <p class="inquiry-tip">您的团核人员将尽快处理。<br/><span>时效：简单业务1-2个工作日，复杂业务3-5个工作。 请通过项目主页的“我的询价”查看结果。</span></p>
        </div>
        <!-- 按钮 -->
        <div class="button-btn">
            <button @click="goHome" vkshop-event-name="返回主页" vkshop-event-type="click">返回项目主页</button>
            <!-- <button @click="moreInquiry">再询价一单</button> -->
        </div>
    </div>
</template>

<script>
export default {
    name:'procedureFinish',
    data(){
        return{
            inquiryNo:''//询价号
        }
    },
    created(){
        this.inquiryNo =  this.$route.params.proserialno;
        console.log(this.$route.params.proserialno);
    },
    methods:{
        //返回项目主页
        goHome: function(){
            this.$clearTemporaryAll();//清楚所有步骤的信息
            this.$router.push({name:'OtoIndex'})
        }
    }
}
</script>

<style lang="scss" scoped>
.procedure-finish{
    margin-top: 50px;
    .finish-content{
        padding: 15px;
        font-size: 13px;
        text-align: center;
        margin-top: 100px;
        .el-icon-success{
            color: #60b3ff;
            font-size: 35px;
        }
        .describe-el-icon{
            font-size: 14px;
            font-weight: 700;
            margin-top: 5px;
        }
        .inquiry-no{
            text-align: left;
            width: 250px;
            margin: 0 auto;
            margin-top: 40px;
        }
        .inquiry-tip{
            text-align: left;
            width: 250px;
            margin: 0 auto;
            margin-top: 16px;
            span{
                font-size: 11px;
                color:#7f7f7f;
            }
        }
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
        font-size: 12px;
        &:first-child{
            background: inherit;
            border: 1px solid #60b3ff;
            color: #60b3ff;
        }
        // &:last-child{
        //     background: #60b3ff;
        //     color: white;
        //     border: 1px solid #60b3ff;
        //     &::before{
        //         content: '';
        //         position: absolute;
        //         width: 30px;
        //         height: 30px;
        //         right: -1px;
        //         top: -14px;
        //         border-radius: 50%;
        //         background: rgba(61, 169, 252, 0.8);
        //     }
        //         &::after{
        //         content: '';
        //         position: absolute;
        //         width: 60px;
        //         height: 40px;
        //         left: -10px;
        //         bottom: -15px;
        //         transform: rotate(45deg);
        //         border-radius: 50%;
        //         background: rgba(106, 185, 246, 0.8);
        //     }
        // }
    }

}
</style>