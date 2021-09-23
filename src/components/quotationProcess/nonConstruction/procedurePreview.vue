<template>
    <div class="procedure-preview"  vkshop-event-scope="非建工险-预览(5)">
         <!-- 进度条 -->
        <div class="procedure-step">
            <el-steps 
            :active="active" 
            finish-status="success"
            align-center>
                <el-step title="分配计划"></el-step>
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
                        <el-button  @click="changeBlock(0)"><span v-if="dynamicValidateFormOpen[0].open">收起<i class="el-icon-d-arrow-right"></i></span><span v-else>展开<i class="el-icon-d-arrow-left"></i></span></el-button>
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
                        <el-button  @click="changeBlock(1)">{{dynamicValidateFormOpen[1].open?'收起':'展开'}}<i :class="[dynamicValidateFormOpen[1].open?'el-icon-d-arrow-right':'el-icon-d-arrow-left']"></i></el-button>
                    </div>
                    <!-- 内容 -->
                    
                    <div class="part-content part-service" v-if="dynamicValidateFormOpen[1].open">
                        <p><span>业务渠道</span><span>：</span><span>{{aggregate[1].premium.businessInformationName}}</span></p>
                        <p v-if="aggregate[1].premium.agency!='' && aggregate[1].premium.agency!=null"><span>代理机构名称</span><span>：</span><span>{{aggregate[1].premium.agency}}</span></p>
                        <p v-if="aggregate[1].premium.agencyFee!=''&&aggregate[1].premium.agencyFee!=null"><span>代理费</span>：<span>{{aggregate[1].premium.agencyFee}}</span></p>
                        <p><span>保期</span><span>：</span><span v-show="aggregate[1].premium.yfyear != 0">{{aggregate[1].premium.yfyear}} 年</span><span v-show="aggregate[1].premium.yfmonth != 0">{{aggregate[1].premium.yfmonth}} 月</span><span v-show="aggregate[1].premium.yfday != 0">{{aggregate[1].premium.yfday}} 天</span></p>
                        <p><span>拟投保总人数(人)</span><span>：</span><span>{{aggregate[1].premium.totalPeople}}</span></p>
                        <p><span>期望整单总保费(元)</span><span>：</span><span>{{aggregate[1].premium.totalPremium}}</span></p>
                    </div>
                </div>
                <!-- 补充信息 -->
                <div class="preview-part">
                    <!-- 头部 -->
                    <div class="part-head">
                        <span>补充信息</span>
                        <el-button  @click="changeBlock(2)">{{dynamicValidateFormOpen[2].open?'收起':'展开'}}<i :class="[dynamicValidateFormOpen[2].open?'el-icon-d-arrow-right':'el-icon-d-arrow-left']"></i></el-button>
                    </div>
                    <!-- 内容 -->
                    <div class="part-content part-remark" v-if="dynamicValidateFormOpen[2].open">
                        <p><span>备注</span><span>：</span><span>{{aggregate[1].premium.textareaRemarks==''?'——':aggregate[1].premium.textareaRemarks}}</span></p>
                        <div>
                            <span>上传图片</span><span>：</span>
                            <div v-if="isPicList == true">
                                <ul v-if="picList.length > 0">
                                     <li v-for="(item,index) in picList" :key="index">
                                            <el-image 
                                            style="width: 100px; height: 100px"
                                            :src="item.url"
                                            fit="contain"
                                            :preview-src-list="PhotoList">
                                        </el-image>
                                    </li>
                                </ul>
                                <span v-else>——</span>
                            </div>
                            <div v-else><i class="el-icon-loading"></i>正在加载中...</div>
                        </div>
                    </div>
                </div>
                <!-- 计划信息 -->
                <div class="preview-part" v-for="(item1,index1) in aggregate[1].expectedPremiumList" :key="index1">
                    <!-- 头部 -->
                    <div class="part-head">
                        <span>计划{{index1+1}}({{item1.planName}})</span>
                        <!-- <el-button  @click="changeBlock(index1+3)"><span v-if="dynamicValidateFormOpen[index1+3].open">收起<i class="el-icon-d-arrow-right"></i></span><span v-else>展开<i class="el-icon-d-arrow-left"></i></span></el-button> -->
                        <el-button  @click="changeBlock(index1+3)">{{dynamicValidateFormOpen[index1+3].open?'收起':'展开'}}<i :class="[dynamicValidateFormOpen[index1+3].open?'el-icon-d-arrow-right':'el-icon-d-arrow-left']"></i></el-button>
                    </div>
                    <!-- 内容 -->
                    <div class="part-content" v-if="dynamicValidateFormOpen[index1+3].open">
                        <!-- 计划基础信息 -->
                       <div class="part-plan-inform plan-base">
                           <p><span>人员类型</span><span>：</span><span>{{item1.basicInformation.personnelType}}</span></p>
                           <p><span>社保情况</span><span>：</span><span>{{item1.basicInformation.socialSecurity}}</span></p>
                           <p><span>投保人数(人)</span><span>：</span><span>{{item1.basicInformation.numberOfInsured}}</span></p>
                           <p><span>平均年龄(岁)</span><span>：</span><span>{{item1.basicInformation.averageAge}}</span></p>
                           <p><span>职业类别</span><span>：</span><span>{{item1.basicInformation.occupationCategory}}</span></p>
                           <p><span>工种描述</span><span>：</span><span v-if="item1.basicInformation.jobDescription != ''">{{item1.basicInformation.jobDescription}}</span><span v-else>无</span></p>
                       </div>
                       <!-- 险种责任 -->
                       <div class="plan-deploy">
                            <div class="basic-information" v-for="(item2,index2) in item1.insuranceLiability" :key="index2">
                                <el-divider>{{item2.risktype}}</el-divider>
                                <div>
                                    <ul>
                                        <li v-for="(item3,index3) in item2.responsibilityData" :key="index3">
                                            <!-- 没有子责任 -->
                                            <div v-if="item3.subResponsibilityData == null">
                                                <p class="kind-title-1"><span>{{item3.riskshort}}：</span><span>{{item3.trueConfigurationStep}}{{item3.insuredUnit}}</span></p>
                                                <p v-if="item3.level != null" class="kind-explain-1 desc-nosub">
                                                    <span v-for="(item4,index4) in item3.level[0].resp_conditionList" :key="index4">{{item4.resp_condition}}：{{item4.levelvalue}} ；</span>
                                                </p>
                                            </div>
                                            <!-- 有子责任 -->
                                            <div v-else>
                                                <p class="kind-title-2">{{item3.riskshort}}：
                                                     <span v-if="item3.responsibilityNameCode =='110'" class="yl-comm">门诊、住院是否共用保额：
                                                        <span v-if="item3.ifDefaultConfiguration == true">是</span><span v-else>否</span></span>
                                                        <span class="yl-comm" v-if="item3.responsibilityNameCode == 110 && item3.ifDefaultConfiguration == true">
                                                            <span v-if="item3.subResponsibilityData[0].trueConfigurationStep > item3.subResponsibilityData[1].trueConfigurationStep">(共用额度：{{item3.subResponsibilityData[0].trueConfigurationStep}}万元)</span>
                                                            <span v-else>(共用额度：{{item3.subResponsibilityData[1].trueConfigurationStep}}万元)</span>
                                                        </span>
                                                </p>
                                                <div v-for="(itemSub,indexSub) in item3.subResponsibilityData" :key="indexSub">
                                                    <p v-if="itemSub.subIfDefaultConfiguration == true" class="kind"><span>{{itemSub.subResponsibilityName}}：</span><span>{{itemSub.trueConfigurationStep}}{{itemSub.insuredUnit}}</span></p>
                                                    <div v-if="itemSub.subIfDefaultConfiguration == true">
                                                        <p v-if="itemSub.level != null" class="kind-explain-1 desc desc-sub">
                                                            <span v-for="(itemSubL,index5) in itemSub.level[0].resp_conditionList" :key="index5">
                                                               <span v-if="itemSubL.resp_condition.indexOf('限额') != -1">
                                                                   <!-- 含有限额 -->
                                                                  <span v-if="itemSubL.levelvalue == -1 || itemSubL.levelvalue == -2">{{itemSubL.resp_condition}}：{{itemSubL.levelvalue == -1?'按照社保标准':'无限额'}}；</span> 
                                                                  <span v-else>{{itemSubL.resp_condition}}({{itemSubL.resp_condition.indexOf('床位费') != -1?'不按照社保标准':'限额'}})：{{itemSubL.levelvalue}}；</span> 
                                                                </span> 
                                                                <span v-else>{{itemSubL.resp_condition}}：{{itemSubL.levelvalue}}；</span> 
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                       </div>
                       <!-- 计划的期望保费 -->
                       <div class="plan-base">
                           <p>本计划期望保费(元/人)：{{item1.premium}}</p>
                       </div>
                    </div>
                </div>
                <!-- 到底部的提醒 -->
                <p style="color:#999;text-align:center;padding:10px 0 5px;font-size:12Px">------------------- 已经到底部了 -------------------</p>
            </div>
        </div>

        <div class="procedure-btn">
            <button @click="goHome"  vkshop-event-name="返回主页" vkshop-event-type="click">返回主页</button><button @click="goPrev"  vkshop-event-name="上一步" vkshop-event-type="click">上一步</button><button @click="tempStorage"  vkshop-event-name="暂存" vkshop-event-type="click"  v-loading="loading" :disabled="loading"  element-loading-spinner="el-icon-loading"  element-loading-text="拼命暂存中" :class="{ loadingFont : loading}">暂存</button><button @click="goConfirm" vkshop-event-name="确认提交" vkshop-event-type="click"  v-loading="loadingTJ" :disabled="loadingTJ"  element-loading-spinner="el-icon-loading"  element-loading-text="拼命提交中" :class="{ loadingFont : loadingTJ}">确认提交</button>
        </div>
    </div>
</template>

<script>
import baseURL from '@/js/base.js';
export default {
    name:'procedurePreview',
    data(){
        return{
            active:3,
            dynamicValidateFormOpen:[],
            aggregate:[],
            expectedPremiumList:{//计划内容
                domains:[]
            },
            planNameT:null,
            loading:false,
            loadingTJ:false,
            isPicList:false,
            picList:[],//图片
            PhotoList:[],//图片列表
        }
    },
    created(){
       this.getAllContent();
    },
    methods:{
        // 取出图片列表---可放大功能
        getPhotoList:function(){
            let that = this;
            if(this.picList != null && this.picList != '') {
               this.picList.forEach(function(current,index){
                   that.PhotoList.push(current.url);
               })
           }
        },
        // 取图片列表--得到图片
        getListPhoto: function(){
            let _that = this;
            console.log('取图片列表环境URL')
            console.log(process.env.NODE_ENV==='production'?baseURL.production:baseURL.test)
            const imgBaseURL = process.env.NODE_ENV ==='production'?baseURL.production:baseURL.test;
            this.$axios.get('/index/list/images',{
                    params:{
                        proserialno:localStorage.getItem('YF_quotationInformation_proserialno'),
                        rand:new Date().getTime()
                    }
                },{
                'Content-Type':'application/json'
            }).then(res =>{
                    //  成功
                    console.log(res);
                    console.log('333');
                    _that.isPicList = true;
                    if(res.data.code=="200"){
                        if( res.data.data != null){
                             res.data.data.forEach(function(current,index){
                            // that.$set(current,"status",'success');//改变状态位
                                current.status = 'success';
                                current.url = imgBaseURL+current.viewurl;
                            })
                            _that.picList = res.data.data;
                            console.log("打印出新的图片链接")
                            console.log(_that.picList)
                            _that.getPhotoList();
                        }
                    }else{
                       
                    }
                }).catch(error =>{
                    _that.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                        confirmButtonText:'好的，我明白了'
                    }).catch(()=>{})
                })
        },
        //获取需要展示的内容
        getAllContent: function(){
            this.getInitData();
            let information_0, information_1,pic;
            //获取单位信息quotationInformation_0
            if(!!localStorage.getItem('quotationInformation_0') && localStorage.getItem('quotationInformation_0')!=''){
                information_0 = JSON.parse(localStorage.getItem('quotationInformation_0'));
                this.aggregate.push(information_0)
                
            }
            // 获取图片
            this.getListPhoto();
            // if(!!localStorage.getItem('quotationInformation_pic') && localStorage.getItem(' quotationInformation_pic')!=''){
            //     pic = JSON.parse(localStorage.getItem('quotationInformation_pic')).picList;
            //     console.log('pic')
            //     console.log(pic)
                
            // }
           
            //获取业务信息、补充信息、计划整合信息quotationInformation_5
            if(!!localStorage.getItem('quotationInformation_5') && localStorage.getItem('quotationInformation_5')!=''){
                information_1 = JSON.parse(localStorage.getItem('quotationInformation_5')).premiumPage;
                this.aggregate.push(information_1);
            }
            console.log(this.aggregate)
            let num = information_1.expectedPremiumList.length;
            for(let i = 0; i < Number(num+3) ;i++){
                this.dynamicValidateFormOpen.push({open:true})
            }
            console.log(num,this.dynamicValidateFormOpen);
        },
        //进入该页面的一个初始化
        getInitData: function(){
            let tempc = [];
            let information_2 = JSON.parse(localStorage.getItem('quotationInformation_2'));
            let information_3 = JSON.parse(localStorage.getItem('quotationInformation_3'));
            let information_4 = JSON.parse(localStorage.getItem('quotationInformation_4'));
            this.planNameT = [];
            //对比第一步的顺序与暂存里的顺序对不对的上
            for(let i = 0; i < information_2.distributionPlan.length; i++){
                //压入名字
                this.planNameT.push(information_2.distributionPlan[i].activeName)
            }
            this.planNameT.forEach(function(currentValue,index){
                let premiun_5=0;
                let temD = information_3.configurationResponsibility[index].data;//第二步
                let temD_4 = information_4.conditionsList[index].data;//第三步
                temD.forEach(function(currentTemdValue,indexTemd){
                    let flag = false;
                    let nowIndex ;
                    if(temD_4.length > 0){
                        temD_4.forEach(function(currentTemdAValue,indexTemdA){
                            if(currentTemdValue.responsibilityCode == currentTemdAValue.responsibilityCode){
                                //判断有大类
                                flag = true;
                                nowIndex = indexTemdA;
                            }
                        })
                    }
                    if(flag){
                        //有大类的时候
                        for(let j = 0; j <currentTemdValue.responsibilityData.length;j++){
                            if(j < temD_4[nowIndex].responsibilityData.length){
                                if(currentTemdValue.responsibilityData[j].subResponsibilityData == null){//没有子责任
                                // currentTemdValue.responsibilityData[j].level = temD_4[nowIndex].responsibilityData[j].level;
                                    temD_4[nowIndex].responsibilityData.forEach(function(currentSubValueData,indexSubData){
                                        if(currentTemdValue.responsibilityData[j].responsibilityNameCode == currentSubValueData.responsibilityNameCode.substring(0,3)){
                                            currentTemdValue.responsibilityData[j].level = currentSubValueData.level;
                                            return;
                                        }
                                    })
                                }else{
                                    currentTemdValue.responsibilityData[j].subResponsibilityData.forEach(function(currentSubValue,indexSub){
                                        // if(currentSubValue.subIfDefaultConfiguration == true){
                                        //      currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = temD_4[nowIndex].responsibilityData[j+indexSub].level
                                        // }else{
                                        //      currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = null
                                        // }
                                        if(currentSubValue.subIfDefaultConfiguration == true){
                                            let last_flag = false;
                                            let last_index;
                                            if(temD_4.length > 0){
                                                temD_4[nowIndex].responsibilityData.forEach(function(lastValue,lastIndex){
                                                    if(lastValue.responsibilityNameCode == currentSubValue.subResponsibilityNameCode){
                                                        last_flag = true;
                                                        last_index = lastIndex;
                                                    }
                                                })
                                            }
                                            if(last_flag){
                                                currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = temD_4[nowIndex].responsibilityData[last_index].level
                                            }else{
                                                currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = null
                                            }
                                        }else{
                                            currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = null
                                        }
                                    })
                                }
                            }
                            
                        }

                    }else{
                        //没有大类的时候
                        for(let j = 0; j <currentTemdValue.responsibilityData.length;j++){
                            if(currentTemdValue.responsibilityData[j].subResponsibilityData == null){//没有子责任
                                currentTemdValue.responsibilityData[j].level = null;
                            }else{
                                currentTemdValue.responsibilityData[j].subResponsibilityData.forEach(function(currentSubValue,indexSub){
                                    currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = null
                                    // if(currentSubValue.subIfDefaultConfiguration == true){
                                    //     let last_flag = false;
                                    //     let last_index ;
                                    //     if(temD_4.length > 0){
                                    //         temD_4[nowIndex].responsibilityData.forEach(function(lastValue,lastIndex){
                                    //             if(lastValue.responsibilityNameCode == currentSubValue.subResponsibilityNameCode){
                                    //                 last_flag = true;
                                    //                 last_index = lastIndex;
                                    //             }
                                    //         })
                                    //     }
                                    //     if(last_flag){
                                    //         currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = temD_4[nowIndex].responsibilityData[last_index].level
                                    //     }else{
                                    //         currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = null
                                    //     }
                                    // }else{
                                    //     currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = null
                                    // }
                                })
                            }
                        }
                    }
                })
                
                if(!!localStorage.getItem('quotationInformation_5_0')&&!!localStorage.getItem('quotationInformation_5_1')&&localStorage.getItem('quotationInformation_5_1')!=''){
                    let current_5 = JSON.parse(localStorage.getItem('quotationInformation_5_1')).premiunFP
                    current_5.forEach(function(currentValue_p,index_p){
                        if(currentValue_p.planName == currentValue){
                            premiun_5 = currentValue_p.premium;
                        }
                    })
                }
                tempc.push({
                    planName:currentValue,//名称
                    premium:premiun_5,//期望保费
                    basicInformation:information_2.distributionPlan[index],//基础信息
                    insuranceLiability:temD,//险种责任
                })
            })
           
            this.expectedPremiumList.domains = tempc;
            let prem_5 = null;
            if(!!localStorage.getItem('quotationInformation_5_1')&&!!localStorage.getItem('quotationInformation_5_0')&&localStorage.getItem('quotationInformation_5_0')!=''){
                prem_5 = JSON.parse(localStorage.getItem('quotationInformation_5_0')).premiunF
            }
            let inform = {
                premium:prem_5,
                expectedPremiumList: this.expectedPremiumList.domains,
            }
            let quotationInformation = {"premiumPage":inform};
                    localStorage.setItem("quotationInformation_5",JSON.stringify(quotationInformation));
                console.log("expectedPremiumList")
                console.log(this.expectedPremiumList.domains)
        },
        //展开-收起
        changeBlock: function(event){
          this.dynamicValidateFormOpen[event].open = !this.dynamicValidateFormOpen[event].open;
        },
        //返回上一步
        goPrev: function(){
            // this.$router.go(-1);
            this.$router.push({path:'procedurePremium'})
        },
         //回到主页
        goHome: function(){
            //  this.$router.go(-6);
            this.$clearTemporaryAll();//清楚所有步骤的信息
            this.$router.push({name:'OtoIndex'})
        },
        //暂存
        tempStorage: function(){
            localStorage.setItem('quotationInformation_tempsavestep',5);
            this.$temporary().then((code)=>{
                this.loading = false;
            });
        },
        //提交 /index/saveInquiry
        goConfirm: function(){
            this.loadingTJ = true;
            let that = this;
            let information_2 = JSON.parse(localStorage.getItem('quotationInformation_2')).distributionPlan;
            let information_3 = JSON.parse(localStorage.getItem('quotationInformation_3')).configurationResponsibility;
            let information_4 = JSON.parse(localStorage.getItem('quotationInformation_4')).conditionsList;
            let information_5_0 = JSON.parse(localStorage.getItem('quotationInformation_5_0')).premiunF;
            let information_5_1 = JSON.parse(localStorage.getItem('quotationInformation_5_1')).premiunFP;
          
            this.$axios.post('/index/saveInquiry',{
                plan:information_2,
                resp:information_3,
                conf:information_4,
                other:information_5_0,
                premium:information_5_1,
                proserialno:localStorage.getItem('YF_quotationInformation_proserialno'),
                submit:'commit',
                rand:new Date().getTime()
            },{
                'Content-Type':'application/json'
            }).then(response=>{                
                 console.log(response); 
                 that.loadingTJ = false;
                 if(response.data.code == 200){//上传成功
                    that.$router.push({name:'procedureFinish',params:{"proserialno":localStorage.getItem('YF_quotationInformation_proserialno')}})
                 }else{//上传报错
                    that.loadingTJ = false;
                    that.$alert(response.data.msg?response.data.msg:'抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                        confirmButtonText:'好的，我知道了'
                    }).catch(()=>{})

                 }               
            }).catch(()=>{
                that.loadingTJ = false;
                that.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                    confirmButtonText:'好的，我知道了'
                }).catch(()=>{})
            })
        }
    }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
    width: 0px;
}
.procedure-preview{
    margin-top: 50px;
}
// .procedure-step{
//     position: fixed;
//     top: 45px;
//     width: 100%;
// }
.preview-content{
    margin-top: 100px;
    overflow: hidden;
    height: calc(100vh - 20vh);
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
        // padding: 10px;
        border-top: 1px solid #bfbfbf;
        ul{
            list-style-type: none;
        }
    }
    .part-unit{
        padding: 10px;
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
        padding: 10px;
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
        padding: 10px;
        p,div{
            padding: 3px 0;
            height: 100%;
            width: 100%;
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
                width: 90px;
                height: 78px;
                margin-left: 10px;
                margin-bottom: 10px;
                display: inline-block;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .part-plan-inform{
        padding: 10px;
        p{
            padding: 3px 0;
            span{
                &:first-child{
                    text-align: justify;
                    display: inline-block;
                    width: 78px;
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
                    width: calc(100% - 98px);
                    display: inline-block;
                }
            }
        }
    }
    .plan-base{
        padding: 10px;
        position: relative;
        &::after{
            content: '';
            height: 100%;
            width: 2px;
            border-left: 2px solid #f8b95b;
            position: absolute;
            top: 0;
            left: 0;
        }
        
    }
    .plan-deploy{
        padding: 10px;
        position: relative;
        &::after{
            content: '';
            height: 100%;
            width: 2px;
            border-left: 2px solid #62b4ff;
            position: absolute;
            top: 0;
            left: 0;
        }
    }
}
.yl-comm{
    display: inline;
    text-align: right;
    font-size: 11px;
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
            margin-top: 15px;
            div{
                // margin-top: 3px;
                .desc{
                    font-size: 11px;
                    span{
                        padding: 3px 0 0 0;
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
                padding: 3px 0 0 0;
               
            }
            .kind-explain-1.desc-nosub{
                // text-indent: 1em;
                margin-left: 2em;
                margin-bottom: 3px;
                span{
                    padding: 3px 0 0 0;
                }
            }
            .kind-explain-1.desc-sub{
                margin-left: 4em;
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
        font-size: 12px;
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
    .loadingFont {
        .el-loading-text{
            font-size: 10px;
        }
        .el-loading-spinner {
          margin-top: -15px;
        }
    }
    .el-steps{
        height: 40px;
        .el-step{
            // top: -15px;
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
        .el-step__line-inner{
            border-bottom: 0px;
        }
        .el-step__title.is-process,.el-step__head.is-process{
            color: #f8b95b;
        }
        .el-step__icon{
            background: #f5f5f5;
        }
        .el-step.is-horizontal .el-step__line{
            height: 1px;
        }
        // .el-step.is-horizontal .el-step__line{
        //     top: 35px;
        // }
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
    .preview-content{
        [class*=" el-icon-"], [class^=el-icon-]{
            transform: rotate(-90deg);
        }
    }
    
     .el-icon-circle-close:before{
        color: #fca50c;
    }
}

</style>