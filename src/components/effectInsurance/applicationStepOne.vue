<template>
<!-- 申请第一步 -->
    <div vkshop-event-scope="新建投保单_选报价">
        <enterprise-name :enterpriseCurCall="enterpriseCurName"></enterprise-name>
        <div class="step-one" v-loading="initLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
            <p class="step-one-decro">*请选择一个有效报价<br><span>说明：选中后，该询价将展示在需客户盖章的投保资料中。</span></p>
            <!-- 有效报价 -->
            <div v-if="policys.length == 0" class="no-companyList" v-show = "!initLoading">
                <img src="../../assets/img/nodata.png" alt="" srcset="">
                <p>{{enterpriseCurName}}当前还没有有效的报价哦~<br>请点击下方按钮前往报价吧！</p>
            </div>
            <div v-else v-show = "!initLoading">
                <div class="policy-can">
                    <el-radio-group v-model="checkedPolicy" >
                        <el-radio v-for="(item,index) in policys" :key="index" :label=item.proserialno class="pre-check-policy" :vkshop-event-param="'proserialno=' + item.proserialno" :vkshop-event-name="'选中此有效报价'+item.proserialno" vkshop-event-type="click">
                            <div class="policy-order">有效报价{{index+1}}</div>
                            <div class="per-policy">
                                <p class="policy-no" @click.stop="lookDetail(item.proserialno)">询价号<span> {{item.proserialno}} <i class="el-icon-arrow-right"></i></span></p>
                                <p>提交时间<span>{{item.createtime}}</span></p>
                                <p>报价有效期<span>{{item.loseefficacytime}}</span></p>
                                <p>计划数<span>{{item.planCount}}个</span></p>
                                <p>总保费<span>{{item.totalPremium}}元</span></p>
                            </div>
                        </el-radio>
                    </el-radio-group>
                </div>
            </div>
            
        </div>
        <div class="footer-button" v-show = "!initLoading">
            <el-button @click="waiverModification">取消</el-button>
            <el-button @click="quickQuotation" v-if="policys.length == 0">快速报价</el-button>
            <el-button  v-if="policys.length != 0" :disabled="checkedPolicy == null? true:false" :class="[checkedPolicy == null?'no-check':'']"  @click="nextStep"  vkshop-event-name="第一步_下一步" vkshop-event-type="click">下一步</el-button>
        </div>
    </div>
</template>

<script>
import enterpriseName from '../quotationProcess/processEnterpriseName.vue'
export default {
    name:'applicationStepOne',
    components:{enterpriseName},
    data(){
        return{
            initLoading: true,
            enterpriseCurName: localStorage.getItem('YF_mainstream_project'),//项目
            checkedPolicy:null,
            policys:[]
        }
    },
    created(){
        this.initEffectiveInquiry();
    },
    methods:{
        //初始化--查询有效报价/index/getEffectiveInquiry
        initEffectiveInquiry: function(){
            this.$axios.get('/index/getEffectiveInquiry',{
                params:{
                    procode:localStorage.getItem('YF_mainstream_project_code'),
                    rand:new Date().getTime()
                }
            }).then(response => {
                console.log(response);
                this.initLoading = false;
                if(response.data.code == 200){//成功请求
                    if(response.data.data.length != 0){//有子项目
                        this.policys = response.data.data;
                    }

                }else{//请求没成功
                    this.$alert('请求遇到问题了，麻烦联系信息技术部','提示',{
                        showClose:false,
                        showConfirmButton: false
                    })
                }
            }).catch(error => {

            })
        },
        // 前往报价
        quickQuotation: function () {
            this.$router.push({path:'/enterpriseConfirm'});
        },
        // 查看详情
        lookDetail: function (policyNo) {
            console.log(policyNo);
            event.stopPropagation();
            this.$router.push({path:'/quotationDetail',query:{id:policyNo,status:3}});
        },
        // 下一步
        nextStep: function () {
            console.log(this.checkedPolicy)
            if(this.checkedPolicy != null){//选了一个有效报价
                console.log("选择了一个有效报价，可以前往下一步了")
                this.$router.push({path:'/applicationStepTwo',query:{checkpolicy:this.checkedPolicy}})
            }else{
                this.$alert("抱歉，请先选择一个有效报价，再进入下一步")
            }
        },
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
.step-one{
    margin-top: 60px;
    padding: 0 15px 60px 15px;
}
.step-one-decro{
    font-size: $fontSize-thirteen;
    margin-bottom: 15px;
    font-weight: 700;
    span{
        font-weight: normal;
        color: #999;
        margin-top: 2px;
        display: inline-block;
        text-indent: 1em;
        font-size: $fontSize-twelve;
    }
}
.no-companyList{
    text-align: center;
    img {
        width: 160px;
        margin-top: 80px;
    }
    p {
        margin-top: 15px;
        font-size: $fontSize-fourteen;
        line-height: 25px;
    }
    .el-button{
        margin-top: 10px;
    }
}
.policy-order{
    display: inline-block;
}
.pre-check-policy{
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
    padding: 10px 15px;
    position: relative;
    &:not(:first-child){
        margin-top: 15px;
    }
    box-sizing: border-box;
    p{
        line-height: 23px;
    }
    .el-divider{
        margin: 6px 0;
    }
    .el-radio__inner{
        border-color: #808080;
    }
    .policy-deatil-button{
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: $fontSize-twelve;
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
.policy-no{
    background: #eff4fc;
    border-radius: 5px;
}
.per-policy{
    margin-top: 15px;
    p{
        padding: 2px 5px;
        span{
            float: right;
        }
    }
}
</style>

<style lang="scss">
.step-one{
    .el-radio-group{
        width: 100%;
    }
    .el-radio__input.is-checked+.el-radio__label .per-policy{
        color: #606266;
    }
    .el-radio.is-checked.pre-check-policy{
        border: 1px solid #409eff;
    }
    .el-loading-mask{
        top: 100px;
        background-color: #ededed;
    }
    .el-radio{
        margin-right: 0;
    }
}

</style>