<template>
    <div class="procedure-preview">
         <!-- 进度条 -->
        <div class="procedure-step">
            <el-steps 
            :active="active" 
            finish-status="success"
            align-center>
                <el-step title="工程信息"></el-step>
                <el-step title="配置责任"></el-step>
                <el-step title="设置条件"></el-step>
            </el-steps>
        </div>
        <!-- 展示内容区 -->
        <div class="preview-content">
            <div class="preview-scroll">
                <!-- 单位信息 -->
                <div class="preview-part">
                    <!-- 头部 -->
                    <div class="part-head">
                        <span>单位信息</span>
                        <el-button  @click="changeBlock(0)"><span v-if="dynamicValidateFormOpen[0].open">收起</span><span v-else>展开</span></el-button>
                    </div>
                    <!-- 内容 -->
                    <div class="part-content part-unit" v-if="dynamicValidateFormOpen[0].open">
                        <p><span>行业</span><span>：</span><span>{{aggregate[0].industry}}</span></p>
                        <p><span>单位人数(人)</span><span>：</span><span>{{aggregate[0].totalNum}}</span></p>
                    </div>
                </div>
                <!-- 业务信息 -->
                <div class="preview-part">
                     <!-- 头部 -->
                    <div class="part-head">
                        <span>业务信息</span>
                        <el-button  @click="changeBlock(1)"><span v-if="dynamicValidateFormOpen[1].open">收起</span><span v-else>展开</span></el-button>
                    </div>
                    <!-- 内容 -->
                    <div class="part-content part-service" v-if="dynamicValidateFormOpen[1].open">
                        <p><span>业务渠道</span><span>：</span><span>{{aggregate[1].premium.businessInformation}}</span></p>
                        <p><span>代理机构名称</span><span>：</span><span>{{aggregate[1].premium.agency}}</span></p>
                        <p><span>代理费</span>：<span>{{aggregate[1].premium.agencyFee}}</span></p>
                        <p><span>拟投保总人数(人)</span><span>：</span><span>{{aggregate[1].premium.totalPeople}}</span></p>
                        <p><span>期望整单总保费(元)</span><span>：</span><span>{{aggregate[1].premium.totalPremium}}</span></p>
                    </div>
                </div>
                <!-- 补充信息 -->
                <div class="preview-part">
                    <!-- 头部 -->
                    <div class="part-head">
                        <span>补充信息</span>
                        <el-button  @click="changeBlock(2)"><span v-if="dynamicValidateFormOpen[2].open">收起</span><span v-else>展开</span></el-button>
                    </div>
                    <!-- 内容 -->
                    <div class="part-content part-remark" v-if="dynamicValidateFormOpen[2].open">
                        <p><span>备注</span><span>：</span><span>{{aggregate[1].premium.textareaRemarks}}</span></p>
                        <div>
                            <span>上传图片</span><span>：</span>
                            <div>
                                <ul v-if="aggregate[1].premium.fileList.length > 0">
                                    <li v-for="(item,index) in aggregate[1].premium.fileList" :key="index">
                                        <el-image
                                        :src="url"
                                        fit="cover"></el-image>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 计划信息 -->
                <div class="preview-part" v-for="(item1,index1) in aggregate[1].premium.expectedPremiumList" :key="index1">
                    <!-- 头部 -->
                    <div class="part-head">
                        <span>计划{{index1+1}}({{item1.planName}})</span>
                        <el-button  @click="changeBlock(index1+3)"><span v-if="dynamicValidateFormOpen[index1+3].open">收起</span><span v-else>展开</span></el-button>
                    </div>
                    <!-- 内容 -->
                    <div class="part-content" v-if="dynamicValidateFormOpen[index1+3].open">
                        <!-- 计划基础信息 -->
                       <div class="part-plan-inform plan-base">
                           <p><span>工程类型</span><span>：</span><span>{{item1.basicInformation.personnelType}}</span></p>
                           <p><span>工程名称</span><span>：</span><span>{{item1.basicInformation.socialSecurity}}</span></p>
                           <p><span>工程地点</span><span>：</span><span>{{item1.basicInformation.planPeople}}</span></p>
                           <p><span>工程内容</span><span>：</span><span>{{item1.basicInformation.averageAge}}</span></p>
                           <p><span>施工总面积(/平方米)</span><span>：</span><span>{{item1.basicInformation.occupationCategory}}</span></p>
                           <p><span>工程总造价(/万元)</span><span>：</span><span v-if="item1.basicInformation.jobDescription != ''">{{item1.basicInformation.jobDescription}}</span><span v-else></span></p>
                           <p><span>保险期间</span><span>：</span><span>{{item1.basicInformation.personnelType}}</span></p>
                           <p><span>施工单位资质</span><span>：</span><span>{{item1.basicInformation.socialSecurity}}</span></p>
                       </div>
                       <!-- 险种责任 -->
                       <div class="plan-deploy">
                            <div class="basic-information" v-for="(item2,index2) in item1.insuranceLiability" :key="index2">
                                <el-divider>{{item2.kindOfInsurance}}</el-divider>
                                <div>
                                    <ul>
                                        <li v-for="(item3,index3) in item2.insurance" :key="index3">
                                            <!-- 没有子责任 -->
                                            <div v-if="!item3.subclasses">
                                                <p class="kind-title-1"><span>{{item3.NameOfInsurance}}：</span><span>{{item3.amountInsured}}{{item3.amountInsuredUnit}}</span></p>
                                                <p v-if="item3.insuranceDuty.length >= 1" class="kind-explain-1 desc">
                                                    <span v-for="(item4,index4) in item3.insuranceDuty" :key="index4">{{item4.insuranceDutyName}}({{item4.insuranceDutyUnit}})：{{item4.insuranceDutyMony}} ；</span>
                                                </p>
                                            </div>
                                            <!-- 有子责任 -->
                                            <div v-else>
                                                <p class="kind-title-2">{{item3.NameOfInsurance}}：</p>
                                                <div v-for="(itemSub,indexSub) in item3.subclassesList" :key="indexSub">
                                                    <p class="kind"><span>{{itemSub.NameOfInsurance}}：</span><span>{{itemSub.amountInsured}}{{itemSub.amountInsuredUnit}}</span></p>
                                                    <p v-if="itemSub.insuranceDuty.length >= 1" class="kind-explain-2 desc">
                                                        <span v-for="(itemSubDuty,indexSubDuty) in itemSub.insuranceDuty" :key="indexSubDuty">{{itemSubDuty.insuranceDutyName}}({{itemSubDuty.insuranceDutyUnit}})：{{itemSubDuty.insuranceDutyMony}} ；</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                       </div>
                       <!-- 计划的期望保费 -->
                       <div class="plan-base">
                           <p>本计划期望保费(元/人)：{{item1.premiun}}</p>
                       </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="procedure-btn">
            <button>返回主页</button><button>上一步</button><button>暂存</button><button>确认提交</button>
        </div>
    </div>
</template>

<script>
export default {
    name:'procedurePreview',
    data(){
        return{
            active:3,
            url:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            dynamicValidateFormOpen:[],
            aggregate:[]
        }
    },
    created(){
       this.getAllContent();
    },
    methods:{
        //获取需要展示的内容
        getAllContent: function(){
            let information_0, information_1;
            //获取单位信息quotationInformation_0
            if(!!localStorage.getItem('quotationInformation_0') && localStorage.getItem('quotationInformation_0')!=''){
                information_0 = JSON.parse(localStorage.getItem('quotationInformation_0'));
                this.aggregate.push(information_0)
                
            }
            //获取业务信息、补充信息、计划整合信息quotationInformation_5
            if(!!localStorage.getItem('quotationInformation_5') && localStorage.getItem('quotationInformation_5')!=''){
                information_1 = JSON.parse(localStorage.getItem('quotationInformation_5'));
                this.aggregate.push(information_1)
            }
            console.log(this.aggregate)
            let num = information_1.premium.expectedPremiumList.length;
            for(let i = 0; i < Number(num+3) ;i++){
                this.dynamicValidateFormOpen.push({open:true})
            }
            console.log(num,this.dynamicValidateFormOpen);
        },
        //展开-收起
        changeBlock: function(event){
          this.dynamicValidateFormOpen[event].open = !this.dynamicValidateFormOpen[event].open;
        },
    }
}
</script>

<style lang="scss" scoped>
.procedure-preview{
    margin-top: 50px;
}
.procedure-step{
    position: fixed;
    top: 45px;
    width: 100%;
}
.preview-content{
    margin-top: 100px;
    overflow: hidden;
    height: calc(100vh - 145px);
    .preview-scroll{
        height: 100%;
        overflow: scroll;
    }
    .preview-part{
        background: #fff;
        margin-top: 10px;
        position: relative;
        border-radius: 5px;
        .part-head{
            font-size: 13px;
            position: relative;
            line-height: 30px;
            padding: 5px 10px;
            button{
                font-size: 12px;
                padding: 8px 20px;
                position: absolute;
                right: 15px;
                border: 1px solid #62b4ff;
                color: #62b4ff;
            }
        }
    }
    .part-content{
        padding: 10px;
        border-top: 1px solid #bfbfbf;
        ul{
            list-style-type: none;
        }
    }
    .part-unit{
        p{
            padding: 3px 0;
            span{
                &:first-child{
                    text-align: justify;
                    display: inline-block;
                    width: 80px;
                    vertical-align: top;
                }
                &:first-child::after {
                    display: inline-block;
                    width: 100%;
                    content: '';
                    height: 0;
                    position: absolute;
                }
                &:nth-child(2){
                    vertical-align: top;
                }
                &:last-child{
                    width: calc(100% - 100px);
                    display: inline-block;
                }
            }
        }
    }
    .part-service{
        p{
            padding: 3px 0;
            span{
                &:first-child{
                    text-align: justify;
                    display: inline-block;
                    width: 110px;
                    vertical-align: top;
                }
                &:first-child::after {
                    display: inline-block;
                    width: 100%;
                    content: '';
                    height: 0;
                    position: absolute;
                }
                 &:nth-child(2){
                    vertical-align: top;
                }
                &:last-child{
                    width: calc(100% - 130px);
                    display: inline-block;
                }
            }
        }
    }
    .part-remark{
        p,div{
            padding: 3px 0;
            span{
                &:first-child{
                    text-align: justify;
                    display: inline-block;
                    width: 60px;
                    vertical-align: top;
                }
                &:first-child::after {
                    display: inline-block;
                    width: 100%;
                    content: '';
                    height: 0;
                    position: absolute;
                }
                &:nth-child(2){
                    vertical-align: top;
                }
                &:last-child{
                    width: calc(100% - 80px);
                    display: inline-block;
                }
            }
        }
        ul {
            list-style-type: none;
            li{
                width: 74px;
                height: 74px;
                img{
                    width: 100%;
                    height: 100%;

                }
            }
        }
    }
    .part-plan-inform{
        p{
            padding: 3px 0;
            span{
                &:first-child{
                    text-align: justify;
                    display: inline-block;
                    width: 70px;
                    vertical-align: top;
                }
                &:first-child::after {
                    display: inline-block;
                    width: 100%;
                    content: '';
                    height: 0;
                    position: absolute;
                }
                 &:nth-child(2){
                    vertical-align: top;
                }
                &:last-child{
                    width: calc(100% - 90px);
                    display: inline-block;
                }
            }
        }
    }
    .plan-base{
        position: relative;
        &::after{
            content: '';
            height: 100%;
            width: 2px;
            border-left: 2px solid #f8b95b;
            position: absolute;
            top: 0;
            left: -10px;
        }
        
    }
    .plan-deploy{
        position: relative;
        padding-top: 1px;
        &::after{
            content: '';
            height: 100%;
            width: 2px;
            border-left: 2px solid #62b4ff;
            position: absolute;
            top: 0;
            left: -10px;
        }
    }
}
.plan-base{
    padding-top: 10px;
}
.basic-information{
    font-size: 12px;
    // padding: 5px 15px;
    .infor{
        p{
            margin-top: 5px;
        span{
                &:first-child{
                    width: 22%;
                    display: inline-block;
                }
                &:last-child{
                    width: 78%;
                    display: inline-block;
                    vertical-align: text-top;
                }
            }
        }
    }
    ul{
        list-style-type: none;
        li{
            margin-top: 5px;
            div{
                margin-top: 5px;
                .desc{
                    font-size: 11px;
                    span{
                        padding: 3px 0;
                    }
                }
            }
            p{
                span{
                    display: inline-block;
                    width: auto;
                }
            }
            .kind{
                text-indent: 1em;
            }
            .kind-explain-1{
                text-indent: 1em;
            }
            .kind-explain-2{
                margin-left: 4em;
            }
        }
    }
}
.preview-scroll{
    font-size: 12px;
    padding: 0 15px;
}
.procedure-btn{
    width: 100%;
    position: fixed;
    bottom: 0;
    font-size: 0;
    button{
        width: 25%;
        height: 36px;
        background: #fff;
        border: none;
        border-left: 1px solid #d5d4d4;
        color: #62b4ff;
        &:first-child{
            border-left: 0;
        }
        &:last-child{
            color: #fff;
            background: #62b4ff;
        }
    }
}
</style>
<style lang="scss">
.procedure-preview{
    .el-steps{
        height: 40px;
        .el-step{
            top: -15px;
            .el-step__title{
                 font-size: 10px;
                 line-height: 15px;
            }
            .el-step__title.is-process{
                font-weight: 400;
            }
        }
        .el-step__title.is-success{
            color: #6db9fe;
        }
        .el-step__head.is-success{
            border-top-color: #6db9fe;
            border-bottom-color: inherit;
        }
        
        .el-step__icon-inner.is-status{
            color: #6db9fe;
        }
        .el-step__head.is-success{
            color: #6db9fe;
        }
        .el-step__title.is-process,.el-step__head.is-process{
            color: #f8b95b;
        }
        .el-step__icon{
            background: #ededed;
        }
        .el-step.is-horizontal .el-step__line{
            height: 1px;
        }
        .el-step.is-horizontal .el-step__line{
            top: 35px;
        }
        .el-step__icon.is-text{
            border: 1px solid;
        }
        .el-step__icon{
            width: 20px;
            height: 20px;
            font-size: 12px;
        }
        
    }
    .el-divider--horizontal{
        margin: 20px 0;
    }
    .el-divider__text{
        font-size: 11px;
    }
}
</style>