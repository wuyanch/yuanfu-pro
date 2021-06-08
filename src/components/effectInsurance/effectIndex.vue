<template>
    <div class="effect-insurance-page" vkshop-event-scope="我要投保" >
        <enterprise-name :enterpriseCurCall="enterpriseCurName"></enterprise-name>
        <!-- 正式内容 -->
        <div class="effect-insurance-content" v-loading="initLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
            <div v-show = "!initLoading">
                <div v-show="companyList.length == 0" class="no-companyList">
                    <img src="../../assets/img/nodata.png" alt="" srcset="">
                    <p>您还没有投保单位哦~，<br>点击下方按钮新建投保单位吧！</p>
                </div>
                <div v-show="companyList.length != 0">
                    <div v-for="(value,index) in companyList" :key="index" class="pre-companyList">
                        <div :class="[(value.status == 3 || value.status == 4) ? 'success-title':'','company-top']">
                            <p class="company-title"><span>投保单位：</span><span>{{value.subproname}}</span><el-button v-if="value.status == 0 || value.status == 2" @click="toPerfect(value.id,value.status)"><i class="el-icon-edit"></i>去完善</el-button></p>
                            <p class="company-creat-time"><span>创建时间：</span>{{value.createtime}}</p>
                            <p :class="[value.status == 0?'xzc':(value.status == 1 || value.status == 5 ?'wait-sh':(value.status == 2?'no-sh':'')),'zc']" v-if="value.status != 3 && value.status != 4">
                                <span v-show="value.status == 0">暂存</span>
                                <span v-show="value.status == 1 || value.status == 5">审核中</span>
                                <span v-show="value.status == 2">审核不通过</span>
                            </p>
                        </div>
                        
                        <div class="company-detail"  v-show="value.status != 0">
                            <div v-if="value.status == 1 || value.status == 2 || value.status == 5" class="no-worthy">
                                <p :class="[value.status == 1|| value.status == 5?'wait-font':'','sumbit-tip']" ><span v-if="value.status == 1 || value.status == 5">{{tipContent}}</span><span v-else>审核不通过。<br/>原因：{{value.reason}}<br/>审核时间：{{value.auditTime}}</span></p>
                            </div>
                            <div v-if="value.status == 3 || value.status == 4">
                                <p class="company-information" @click="toPerfect(value.id,value.status)">企业信息 <el-button><i class="el-icon-arrow-right"></i></el-button></p>
                                <el-divider class="dotter-divider"></el-divider>
                                <div>
                                    <p class="company-information-policy">投保单<span>（共 {{value.riskPolicies.length}} 个）</span> <el-button @click="creatPolicy(value.subproname,value.id)"><i class="el-icon-plus"></i>新建</el-button> </p>
                                    <div v-if="value.riskPolicies.length != 0">
                                        <div class="policy-detail-div" v-for="(item,itemIndex) in value.riskPolicies" :key="itemIndex" >
                                            <div class="policy-detail" v-show="(itemIndex >= 2 && policyBlockORNone[index]) || itemIndex < 2" @click="lookDetail(item.policynumber,item.status)">
                                                <div class="policy-detail-left">
                                                    <p><span>投保单号：</span><span>{{item.policynumber}}</span></p>
                                                    <p><span>创建时间：</span><span>{{item.createtime}}</span></p>
                                                    <p><span>生效时间：</span><span>{{item.insurstarttime}} 0时</span></p>
                                                    <p><span>保险期间：</span><span>{{item.riskPeriod}}</span></p>
                                                </div><p class="policy-detail-arrow"><i class="el-icon-arrow-right"></i></p>
                                                <!-- 0-未使用, 1-已下架, 2-已过期, 3-待回销, 4-已回销 -->
                                                <p :class="[policyStatusList[item.status].policyStatusClass]" class="policyStatusNomal"><span>{{policyStatusList[item.status].policyStatusCN}}</span></p>
                                            </div>
                                        </div>
                                        <div v-if="value.riskPolicies.length > 2" class="policy-detail-button">
                                            <el-button><span @click="changeStatue(index)"><i :class="[policyBlockORNone[index]? 'el-icon-d-arrow-left':'el-icon-d-arrow-right']"></i>{{policyBlockORNone[index]?'收起':'展开'}}</span></el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 下方固定按钮 -->
            <div class="effect-footer-button">
                <el-button @click="waiverModification">返回项目主页</el-button><el-button icon="el-icon-plus" @click="creatUnit">新建投保单位</el-button>
            </div>
        </div>
        
    </div>
</template>

<script>
import enterpriseName from '../quotationProcess/processEnterpriseName.vue'
export default {
    name: 'effectIndex',
    components:{enterpriseName},
    data(){
        return {
            initLoading: true,
            enterpriseCurName: localStorage.getItem('YF_mainstream_project'),//项目
            //0-暂存未提交，1-已提交待审核， 2-人工审核不通过，3-人工审核通过，4-自动审核通过。--子项目
            //0-未使用, 1-已下架, 2-已过期, 3-待回销, 4-已回销--投保单
            policyBlockORNone:[false,false,false,false,false,false,false],
            tipContent:'团核人员后台审核中，感谢耐心等待',
            policyStatusList:[
                {policyStatusCN:'未使用',policyStatusClass:'not-used'},
                {policyStatusCN:'已下架',policyStatusClass:'removed-shelves'},
                {policyStatusCN:'已过期',policyStatusClass:'removed-shelves'},
                {policyStatusCN:'待回销',policyStatusClass:'sold-back'},
                {policyStatusCN:'已回销',policyStatusClass:'sold-allawy'}
            ],
            companyList:[]
        }
    },
    created(){
        this.initSubpro();
    },
    methods:{
        //初始化--查看当前项目下的子项目
        initSubpro: function(){
            let that = this;
            this.$axios.get('/index/getSubproPageList',{
                params:{
                    page:1, 
                    procode:localStorage.getItem('YF_mainstream_project_code'),
                    rand:new Date().getTime(),
                    size:10
                }
            }).then(response => {
                console.log(response);
                this.initLoading = false;
                if(response.data.code == 200){//成功请求
                    if(response.data.data.total.length != 0){//有子项目
                        that.companyList = response.data.data.items;
                    }
                }else{//请求没成功
                    that.$alert('请求遇到问题了，麻烦联系信息技术部','提示',{
                        showClose:false,
                        confirmButtonText: '确定',
                        callback: action => {
                            that.$router.push({name:'OtoIndex'})
                        }
                    })
                }
            }).catch(error => {

            })
        },
        //修改状态？
        changeStatue: function(index) {
            this.$set(this.policyBlockORNone,index,!this.policyBlockORNone[index])
            console.log(this.policyBlockORNone[index])
        },
        //创建投保单位
        creatUnit: function(){
            this.$router.push({path:'/applicationStepOne'})
        },
        //去完善-企业信息
        toPerfect: function(id,status){
            this.$router.push({path:'/corporateInformation',query:{unitId:id,status:status}})
        },
        creatPolicy: function(name,id){
            this.$router.push({path:'/determineInformation',query:{unitName:name,id:id}})
        },
        // 查看投保资料详情
        lookDetail: function(policyNo,status){
            this.$router.push({path:'determineDetail',query:{policyNo:policyNo,status:status}})
        },
        //返回项目主页
        waiverModification: function () {
           this.$router.push({name:'OtoIndex'})
        },
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@mixin font-dpr($font-size){
    font-size: $font-size;

    [data-dpr="1"] & {
        font-size: $font-size;
    }

    [data-dpr="1.75"] & {//杨老师
        font-size: $font-size * 1.2;
    }

    [data-dpr="2"] & {
        font-size: $font-size * 1.2;
    }

    [data-dpr="2.75"] & {
        font-size: $font-size * 1.2;
    }

    [data-dpr="3"] & {//韩老师
        font-size: $font-size * 1.5;
    }

    [data-dpr="4"] & {
        font-size: $font-size * 1.5;
    }

    [data-dpr="5"] & {
        font-size: $font-size * 1.6;
    }

    [data-dpr="6"] & {
        font-size: $font-size * 1.6;
    }
}
$fontSize-twelve: 12px;
$fontSize-thirteen: 13px;
$fontSize-fourteen: 14px;

.effect-insurance-content{
    padding: 60px 15px;
}
.no-companyList{
    text-align: center;
    img {
        width: 160px;
        margin-top: 80px;
    }
    p {
        margin-top: 15px;
        @include font-dpr($fontSize-twelve);
        line-height: 25px;
    }
}
.nomal-divider{
    margin: 0;
}

.pre-companyList{
    background: #fff;
    border-radius: 5px;
    &:not(:first-child){
        margin-top: 15px;
    }
    .success-title{
        // background: #FFE180;
        background: #5895fa url('../../assets/effectIns/probg.png') no-repeat 100% 100%;
        background-size: 100% 100%;
        .company-title{
            color: white;
        }
        .company-creat-time{
            color:#bfdbee;
        }
     }
    .company-top{
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        position: relative;
    }
    .company-title{
        font-size: $fontSize-thirteen;
        // @include font-dpr($fontSize-twelve);
        display: flex;
        padding: 10px 8px 5px 8px;
        span{
            &:first-child{
                min-width: 65px;
                flex-grow:0;
                white-space: nowrap;
            }
            &:nth-child(2){
                flex-grow:1;
            }
        }
        .el-button{
            width: 60px;
            padding: 0 10px 0 0;
            font-size: $fontSize-thirteen;
            color: #00acfe;
            border: none;
            background: inherit;
            flex-grow:0;
        }
        
    }
    .company-creat-time{
        font-size: 11px;
        color: #666;
        padding: 0px 8px 10px 8px;
    }
    .company-detail{
        padding: 5px 10px 8px 10px;
        .company-information{
            font-size: $fontSize-thirteen;
            padding: 5px 0;
            position: relative;
            .el-button{
                position: absolute;
                top: 0;
                right: 0;
                padding: 5px 5px 5px 30px;
                border: none;
            }
            i{
                float: right;
            }
        }
        .company-information-policy{
            font-size: $fontSize-thirteen;
            padding: 10px 0;
            position: relative;
            .el-button{
                font-size: $fontSize-thirteen;
                position: absolute;
                right: 0;
                top: 0;
                border: none;
                padding: 10px;
                height: 100%;
                color: #00acfe;
                span {
                    color: #00acfe;
                }
            }
        }
        .policy-detail-div{
            &:not(:first-child){
                margin-top: 10px;
            }  
        }
        .policy-detail{
            border-radius: 5px;
            padding: 5px;
            position: relative;
            border: 1px solid #dfdfdf;
            .policy-detail-left{
                display: inline-block;
            }
            .policy-detail-arrow{
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                border: none;
            }
        }
        
    }
    .sumbit-tip{
        color: red;
        font-size: $fontSize-thirteen;
        span{
            display: block;
            width: 100%;
        }
    }
    .sumbit-tip.wait-font{
        color: #6795BF;
    }
}
.policy-detail{
    p{
        font-size: $fontSize-thirteen;  
        span{
            font-size: $fontSize-thirteen;  
        }
    }
}
.dotter-divider{
    border-top: 1px dotted #DCDFE6;
    background-color: transparent;
    margin: 5px 0;
}
.policyStatusNomal{
    span{
        font-size: 10px;
    }
}
.not-used{
    padding: 15px 5px;
    border-radius: 100px;
    color: green;
    position: absolute;
    right: 54px;
    top: 20%;
    transform: rotateZ(40deg);
    border: 1px dotted green;
    font-size: 4px;
    // @include font-dpr(11px);
}
.removed-shelves{
    padding: 15px 5px;
    border-radius: 100px;
    color: rgb(182, 182, 182);
    position: absolute;
    right: 54px;
    top: 20%;
    transform: rotateZ(40deg);
    border: 1px dotted rgb(182, 182, 182);
    font-size: 4px;
    // @include font-dpr(11px);
}
.sold-back{
    padding: 15px 5px;
    border-radius: 100px;
    color: orange;
    position: absolute;
    right: 54px;
    top: 20%;
    transform: rotateZ(40deg);
    border: 1px dotted orange;
    font-size: 4px;
    // @include font-dpr(11px);
}
.sold-allawy{
    padding: 15px 5px;
    border-radius: 100px;
    color: #2cccd4;
    position: absolute;
    right: 54px;
    top: 20%;
    transform: rotateZ(40deg);
    border: 1px dotted #2cccd4;
    font-size: 4px;
}
.policy-detail-button{
    text-align: center;
    margin-top: 10px;
    font-size: 0;
    .el-button{
        border: none;
        font-size: $fontSize-twelve;
        // @include font-dpr($fontSize-twelve);
    }
}
.el-icon-d-arrow-right,.el-icon-d-arrow-left{
    transform: rotate(90deg);
}
.effect-footer-button{
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    width: 100%;
    height: 40px;
    padding-top: 5px;
    background-color: #ededed;
    font-size: 0;
    button{
        // width: 35%;
        height: 36px;
        background: #fff;
        border: none;
        border-left: 1px solid #d5d4d4;
        color: #62b4ff;
        font-size: $fontSize-twelve;
        // @include font-dpr($fontSize-twelve);
        &:first-child{
            border-left: 0;
        }
        &:last-child{
            color: #fff;
            background: #62b4ff;
        }
    }
}
.zc{
    font-size: 11px;
    position: absolute;
    right: -10px;
    bottom: -5px;
    background: red;
    padding: 5px 10px;
    border-radius: 0px;
    color: white;
    border-radius: 2px;
    text-align: center;
    box-sizing: content-box;
    &::before{
        content: '';
        position: absolute;
        right: -5px;
        top: 50%;
        transform: translateY(-50%);
        width: 10px;
        height: 10px;
        background: #ededed;
        border-radius: 100%;
    }
    &::after{
        content: '';
        position: absolute;
        left: -5px;
        top: 50%;
        transform: translateY(-50%);
        width: 10px;
        height: 10px;
        background: #fff;
        border-radius: 100%;
    }
    
}
.zc.xzc{
    background: #2066A6;
}
.zc.wait-sh{
    background: #6795BF;
}
.no-worthy{
    margin-top: 10px;
}
</style>

<style lang="scss">
.effect-insurance-page{
    // .el-loading-mask{
    //     top: 100px;
    //     background-color: #ededed;
    // }
    .el-loading-spinner{
        position: fixed;
        font-size: 20px;
    }
    .el-loading-mask{
        background-color:rgba(255,255,255,.1);
    }
}

</style>