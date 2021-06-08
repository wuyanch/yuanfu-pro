<template>
    <div class="template-page">
        <enterprise-name :enterpriseCurCall="enterpriseCurName"></enterprise-name>
        <div class="template-selection">
            <p class="start-say">美好的报价之旅从一个匹配的模板开始。<br/> 请选择一个最接近本次报价的模板吧~</p>
            <!-- 非建工险模板 -->
            <div class="content-kind" v-for="(itemT,indexT) in allTemplate" :key="indexT">
                <p class="kind"><span @click="explainNonConstruction(indexT)">{{itemT.type}}<i class="el-icon-warning-outline"></i></span></p>
                <span class="explanatoryText" v-if="itemT.typecode == 'A'"><i>*</i>员福类模板险种可增删</span>
                <div class="kind-template">
                    <ul>
                        <li v-for="(item,index) in itemT.insuranceTemplate" :key="index" @click="choiceTemplate(item.id,itemT.typecode)">
                            <p class="template-title">{{item.name}}</p>
                            <p class="template-insurance" v-if="item.insurance.length!=0 && item.insurance[0].riskcode != ''">
                                带险种：<span v-for="(itemI,indexI) in item.insurance" :key="indexI">
                                    <span v-if="indexI < item.insurance.length-1" @click.stop="viewInsurance(itemI.riskcode)">{{itemI.riskshort}}<i class="el-icon-warning-outline"></i> + </span>
                                    <span v-else @click.stop="viewInsurance(itemI.riskcode)"> {{itemI.riskshort}}<i class="el-icon-warning-outline"></i></span>
                                </span>
                                <span v-if="itemT.typecode == 'B'" >，可删193</span>
                            </p>
                            <p class="template-insurance" v-else>不带险种，自行增删</p>
                            <i class="el-icon-arrow-right"></i>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 按钮 -->
            <div class="button-btn">
                <button @click="goHome">返回项目主页</button><button @click="goPrev">上一步</button>
            </div>
        </div>
        <!-- 话术对话框 -->
        <el-dialog
        :title="dialogTitle"
        :visible.sync="centerDialogVisible"
        width="100%"
        class="pDialog">
            <ul> 
                <li v-for="(item,index) in explainConstructionAB" :key="index">{{item.list}}</li>
            </ul>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 险种对话框 -->
        <el-dialog
        :visible.sync="insuranceDialogVisible"
        width="100%"
        class="pDialog">
            <button class="insurance-dialog-btn" @click="insuranceDialogBtn(insuranceDialogData.riskcode)">查看条款</button>
            <div class="insurance-content">
                <p><span>险种简称：</span><span>{{insuranceDialogData.riskshort}}</span></p>
                <p><span>险种代码：</span><span>{{insuranceDialogData.riskcode}}</span></p>
                <p><span>险种名称：</span><span>{{insuranceDialogData.riskname}}</span></p>
                <p><span>责任简述：</span><span>{{insuranceDialogData.respsummary}}</span></p>
            </div>
        </el-dialog>
        
        <!-- PDF预览 -->
        <el-dialog
        :visible.sync="insuranceDialogVisiblePDF"
        width="100%"
        :fullscreen="true"
        class="pDialog2">
            <div class="insurance-content">
               <iframe class="prism-player" :src="pdfUrlIframe"></iframe>
            </div>
        </el-dialog>
       
       <div class="eaxc-loading" v-if="loadingEaxc">
           <p v-loading="loadingEaxc"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
            </p>
       </div>
         
    </div>
</template>

<script>
import enterpriseName from '../quotationProcess/processEnterpriseName.vue'
import { error } from 'util';
export default {
    name:'templateSelection',
    components:{enterpriseName},
    data(){
        return{
            pdfUrlIframe:null,//PDF预览
            insuranceDialogVisiblePDF:false,//PDF预览view
            enterpriseCurName:'',
            dialogTitle:'非建工险类',
            centerDialogVisible : false,//话术对话框
            insuranceDialogVisible: false,//险种对话框
            insuranceDialogData:{},
            allTemplate:[],//装所有模板在这里
            explainConstructionAB:[],//解释建工险/非建工险的话术
            loadingEaxc:false
        }
    },
    created(){
        this.getModelData();//获取所有的模板信息
        this.enterpriseCurName = localStorage.getItem('YF_mainstream_project');
    },
    methods:{
        //选择模板
        choiceTemplate: function(typeId,typecode){
            this.loadingEaxc = true;
            console.log(typeId);
            let _that = this;
            //获取未提交模板(看有没有暂存) /index/checkFillMould  mouldcode--模板编码   procode--项目编码
            let params = {mouldcode:typeId,procode:localStorage.getItem('YF_mainstream_project_code'),rand: new Date().getTime()}
            new Promise(function(resolve,reject){
                _that.$axios.post('/index/checkFillMould',_that.$qs.stringify(params)).then(response =>{
                    console.log(response)
                    resolve(response);
                })
            }).then(function(responseF){
                let tempsavestepC = '1';
                let quotationInformation = {templateSelection:typeId,templateCode:typecode};
                localStorage.setItem("YF_quotationInformation_1",JSON.stringify(quotationInformation));
                let tempQuotation = localStorage.getItem("quotationInformation_0");
                 _that.$clearTemporary();
                localStorage.setItem("quotationInformation_0",tempQuotation);
               
                //如果data不为空，那么用户之前一定选择过这个模板
                if(responseF.data != '' && responseF.data != null){
                    //判断模板是否被暂存过
                        //如果为真，那么之前就被暂存过了
                    _that.loadingEaxc = false;
                    localStorage.setItem('YF_quotationInformation_proserialno',responseF.data.proserialno);
                    if(responseF.data.ifHaveTempData){
                        let tipContent = '该模板您之前有暂存过内容，是否继续编辑';
                        if(responseF.data.ifIncludeOffShelf){//暂存内容含有下架产品
                            tipContent ='该模板您之前有暂存过内容且暂存的内容中含有已下架'+responseF.data.message+'，是否继续编辑';
                        }
                        _that.$confirm(tipContent,'',{
                            confirmButtonText:'继续编辑',
                            cancelButtonText:'重新开始',
                            distinguishCancelAndClose:true,
                            showClose:false
                        }).then(()=>{//继续编辑
                            _that.loadingEaxc = true;
                            console.log('缓存')
                            //把所有的数据存储在localstorage里

                            _that.getTempData(responseF.data.proserialno,function(res,newOrCome){
                                _that.putDataToLocal(res);
                                if(newOrCome != null){
                                    _that.jumpPage(typecode,newOrCome?"2":"1");
                                }else{
                                    _that.jumpPage(typecode,res.tempsavestep);
                                }
                                
                                console.log("tempData")
                                console.log(res);
                                console.log(JSON.stringify(res))
                            });
                            
                        }).catch(action =>{
                            if(action === 'cancel'){//重新开始
                                if(typecode == "A"){//非建工险
                                    _that.$router.push({path:'/procedure/procedureOne'})
                                }else{//建工险
                                    // _that.$router.push({path:'/constructionProcess/constructionOne'})
                                    _that.$alert('建工险正在开发中，敬请期待','',{
                                        confirmButtonText:'确定'
                                    })
                                }
                                let quotationInformation = {templateSelection:typeId,templateCode:typecode};
                                localStorage.setItem("YF_quotationInformation_1",JSON.stringify(quotationInformation));
                            }
                        })
                    }else{//若果为假，那么从头开始填写

                        if(typecode == "A"){//非建工险
                            _that.$router.push({path:'/procedure/procedureOne'})
                        }else{//建工险
                            // _that.$router.push({path:'/constructionProcess/constructionOne'})
                             _that.$alert('建工险正在开发中，敬请期待','',{
                                confirmButtonText:'确定'
                            })
                        }
                        let quotationInformation = {templateSelection:typeId,templateCode:typecode};
                                localStorage.setItem("YF_quotationInformation_1",JSON.stringify(quotationInformation));
                    }

                }else{//如果data为空，那么用户之前一定没有选择过这个版本
                        console.log('没有选择过版本')
                         //选择模板开启报价，保存模板的险种代码 /index/saveFillMould  mouldcode --模板编码   procode --项目编码
                        _that.$axios.post('/index/saveFillMould',_that.$qs.stringify(params)).then(response =>{
                            _that.loadingEaxc = false;
                            if(response.data.code == 200){
                                console.log(response)
                                if(typecode == "A"){//非建工险
                                    _that.$router.push({path:'/procedure/procedureOne'})
                                }else{//建工险
                                    // _that.$router.push({path:'/constructionProcess/constructionOne'})
                                     _that.$alert('建工险正在开发中，敬请期待','',{
                                        confirmButtonText:'确定'
                                    })
                                }
                                localStorage.setItem('YF_quotationInformation_proserialno',response.data.data);
                                
                            }else{
                                _that.$alert(response.data.msg,'',{
                                        confirmButtonText:'好的',
                                })
                            }
                        }).catch(error =>{
                            _that.loadingEaxc = false;
                            _that.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                                confirmButtonText:'好的，我明白了'
                            }).catch(()=>{})
                        })

                         let quotationInformation = {templateSelection:typeId,templateCode:typecode};
                                localStorage.setItem("YF_quotationInformation_1",JSON.stringify(quotationInformation));
                   
                }
            }).catch(error => {
                 _that.loadingEaxc = false;
                 console.log("是我报出来的")
                 this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                        confirmButtonText:'好的，我知道了'
                })
            })
            
        },
        //解释建工险/非建工险的含义--对话框
        explainNonConstruction: function(event){
            this.explainConstructionAB.length = 0;
            if(event == "0"){
               this.dialogTitle = '员福类'
               this.explainConstructionAB.push(
                    {list:'①不含建工险险种（192、193)；'},{list:'②每次询价至少包含一个主险；'},
                    {list:'③其他险种可按运营规则自由组合。'})
            }else{
                this.dialogTitle = '建工险类'
                this.explainConstructionAB.push(
                    {list:'①主险有且仅有192险种；'},{list:'②附加险可选193、191（不推荐）。'})
            }
            this.centerDialogVisible = true;
        },
        //查看具体险种--对话框
        viewInsurance: function(event){
            this.$axios.get('/index/getRiskDetail',{
                params:{
                    riskno: event
                }
            }).then(response =>{
                console.log(response)
                if(response.data.code == 200){
                    this.insuranceDialogData = response.data.data[0];
                    this.insuranceDialogVisible = true;
                }else{
                    this.$alert('出错啦！无法获取相关的险种信息','',{
                        confirmButtonText:'好的，我明白了'
                    }).catch(()=>{})
                }
            }).catch(error =>{
                this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                    confirmButtonText:'好的，我明白了'
                }).catch(()=>{})
            })
        },
        //查看具体险种里面的条款
        insuranceDialogBtn: function(currentInsurance){
            this.insuranceDialogVisible = false;
            console.log(currentInsurance)
            this.getPdfCode (currentInsurance);
        },
        //上一步
        goPrev: function(){
            // this.$router.go(-1);
            this.$router.push({path:'enterpriseConfirm'})
        },
        //获取模板信息/index/getModelData
        getModelData: function(){
            this.$axios.get('/index/getModelData').then(response => {
                console.log(response);
                if(response.data.code == 200){
                    this.allTemplate = response.data.data;
                }
            }).catch(error =>{
                this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                    confirmButtonText:'好的，我明白了'
                }).catch(()=>{})
            })
        },
        //返回主页
        goHome: function(){
            this.$router.push({path:'/'})
            this.$clearTemporaryAll();//清楚所有步骤的信息
            // this.$router.go(-2)
        },
        //获取暂存之后重现的数据getInquiryData
        getTempData(proserialNo,fun){
            this.$axios.get('/index/getInquiryData',{
                params:{
                    proserialno: proserialNo,
                    rand:new Date().getTime()
                }
            }).then(response=>{
                console.log('重现数据')
                console.log(response);
                if(response.data.code != '500'){//获取成功
                    let tipContent = '';
                    if(response.data.data.ifIncludeOffShelf){//暂存内容含有下架产品
                        tipContent ='该模板您之前有暂存过内容且暂存的内容中'+response.data.data.message+'，是否继续编辑';
                        this.$confirm(tipContent,'',{
                            confirmButtonText:'继续编辑',
                            cancelButtonText:'重新开始',
                            distinguishCancelAndClose:true,
                            showClose:false
                        }).then(()=>{//继续编辑
                            fun(response.data.data,true)
                        }).catch(()=>{
                            fun(0,false)
                        });
                    }else{
                        fun(response.data.data,null)
                    }
                    
                }else{
                    fun(0,null)
                }
            }).catch(error =>{
                this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                    confirmButtonText:'好的，我明白了'
                }).catch(()=>{})
            })
        },
        //把获得的数据放在localstorage里面
        putDataToLocal: function(res){
            for(let key in res){
                if(key == 'plan'){//第一步计划
                 let quotationInformation1 = {"distributionPlan":res.plan};
                    localStorage.setItem('quotationInformation_2',JSON.stringify(quotationInformation1));
                }
                if(key == 'resp'){//第二步配置责任
                    if(res.resp != '' ){
                        if(res.resp[0].planName != null){
                             let quotationInformation2 = {"configurationResponsibility":res.resp};
                            localStorage.setItem('quotationInformation_3',JSON.stringify(quotationInformation2));
                        }
                    }
                }
                if(key == 'conf'){//第三步配置条件
                    if(res.conf != ''){
                        if(res.conf[0].planName != null){
                            let quotationInformation3 = {"conditionsList":res.conf};
                            localStorage.setItem('quotationInformation_4',JSON.stringify(quotationInformation3));
                        }
                    }
                }
                if(key == 'other'){//第四步其他
                    if(res.other.totalPremium != null){
                        let premiunF = {"premiunF":res.other}
                        localStorage.setItem("quotationInformation_5_0",JSON.stringify(premiunF));
                        if(res.other.fileList != null){
                            let premiunF = {"picList":res.other.fileList}
                            localStorage.setItem("quotationInformation_pic",JSON.stringify(premiunF));
                            this.fileList = JSON.parse(localStorage.getItem('quotationInformation_pic')).picList;
                        }
                    }
                }
                if(key == 'premium'){//第四步保费
                    if(res.premium != ''){
                        let premiunFP = {"premiunFP":res.premium}
                        localStorage.setItem("quotationInformation_5_1",JSON.stringify(premiunFP));
                    }
                }
            }
        },
        //跳转链接
        jumpPage: function(typecode,tempsavestepC){
            this.loadingEaxc = false;
             if(typecode == "A"){//非建工险
                switch (tempsavestepC) {
                    case "1":
                        this.$router.push({path:'/procedure/procedureOne'})
                        break;
                    case "2":
                        this.$router.push({path:'/procedure/procedureTwo'})
                        break;
                    case "3":
                        this.$router.push({path:'/procedure/procedureThree'})
                        break;
                    case "4":
                        this.$router.push({path:'/procedure/procedurePremium'})
                        break;
                        case "5":
                        this.$router.push({path:'/procedure/procedurePreview'})
                        break;
                
                    default:
                        this.$router.push({path:'/procedure/procedureOne'})
                        break;
                }
                    
            }else{//建工险
                // this.$router.push({path:'/constructionProcess/constructionOne'})
                 _that.$alert('建工险正在开发中，敬请期待','',{
                    confirmButtonText:'确定'
                })
            }
        },
        // 初始化获取pdf文件
        getPdfCode (currentInsurance) {
            console.log("获取pdf文件")
            let url = encodeURIComponent('/mybp/work/index/getPdfIo?riskcode='+currentInsurance)
            this.pdfUrlIframe = '../../../mybp/static/pdf/web/viewer.html?file='+ url;
            //------20210202测试
            // let url = encodeURIComponent('/index/getPdfIo?riskcode='+currentInsurance)
            // this.pdfUrlIframe = '../../../static/pdf/web/viewer.html?file='+ url;
            this.insuranceDialogVisiblePDF = true;
        }
    }
}
</script>

<style lang="scss" scoped>
.template-selection{
    padding: 10px 15px;
    margin-top: 50px;
    .start-say{
        font-size: 12px;
        line-height: 20px;
    }
    .kind{
        font-size: 12px;
        text-align: center;
        position: relative;
        &::before{
            content: '';
            width: 35%;
            height: 1px;
            border-radius: 10px;
            background: #bfbfbf;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
        }
         &::after{
            content: '';
            width: 35%;
            height: 1px;
            border-radius: 10px;
            background: #bfbfbf;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
        }
        span{
            position: relative;
        }
        .el-icon-warning-outline{
            transform: rotate(180deg);
            position: relative;
            top: -5px;
            font-size: 10px;
            color: #62b4ff;
        }
    }
    .content-kind{
        margin-top: 15px;
        .explanatoryText{
            font-size: 11px;
            color:#bfbfbf;
            display: inherit;
            i{
                color:red;
                font-style: normal;
            }
        }
    }
    .kind-template{
        ul{
            list-style-type: none;
            li{
                border-radius: 10px;
                background: #fff;
                margin-top: 15px;
                padding: 10px 5px 10px 10px;
                position: relative;
                .template-title{
                    color: #373737;
                    font-size: 14px;
                    font-weight: 700;
                }
                .template-insurance{
                    font-size: 12px;
                    color: #bfbfbf;
                    margin-top: 13px;
                    padding-right: 15px;
                    line-height: 23px;
                }
                i{
                    position: absolute;
                    top: 50%;
                    right: 10px;
                    transform: translateY(-50%);
                    font-size: 15px;
                    color: #bfbfbf;
                }
                .template-insurance{
                    span{
                        display: inline-block;
                        position: relative;
                        .el-icon-warning-outline{
                            transform: rotate(180deg);
                            position: relative;
                            top: -5px;
                            right: 0px;
                            font-size: 10px;
                            color: #62b4ff;
                        }
                    }
                }
            }
        }
        
    }

    .pdf-box {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        max-width: 1024px;
        width: 100%;
        margin: 0 auto;
        overflow-x: hidden;
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        font-size: .28rem;
        span {
        width: 100%;
        }
    }
}
.pDialog {
    .insurance-dialog-btn{
        width: 150px;
        height: 38px;
        border-radius: 5px;
        background: inherit;
        border: 1px solid #60b3ff;
        color: #60b3ff;
        position: absolute;
        top: 15px;
        font-size: 12px;
    }
    .insurance-content{
        p{
            margin-top: 10px;
            span{
                &:first-child{
                    vertical-align: top;
                    display: inline-block;
                    width: 75px;
                }
                &:last-child{
                    display: inline-block;
                    width: calc(100% - 75px);
                }
            }
            &:first-child{
                margin-top: 20px;
            }
        }
    }
    
}
.eaxc-loading{
    width: 50%;
    height: 70px;
    position: absolute;
    top: 50%;
    margin: 0 auto;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,.7);
    font-size: 20px;
    border-radius: 5px;
}
.button-btn{
    text-align: center;
    button{
        width: 150px;
        height: 38px;
        border-radius: 5px;
        position: relative;
        overflow: hidden;
        margin-top: 40px;
        font-size: 12px;
        &:first-child{
            background: inherit;
            border: 1px solid #60b3ff;
            color: #60b3ff;
        }
        &:last-child{
            background: #60b3ff;
            color: white;
            border: 1px solid #60b3ff;
            margin-left: 15px;
            &::before{
                content: '';
                position: absolute;
                width: 30px;
                height: 30px;
                right: -1px;
                top: -14px;
                border-radius: 50%;
                background: rgba(61, 169, 252, 0.8);
            }
                &::after{
                content: '';
                position: absolute;
                width: 60px;
                height: 40px;
                left: -10px;
                bottom: -15px;
                transform: rotate(45deg);
                border-radius: 50%;
                background: rgba(106, 185, 246, 0.8);
            }
        }
    }
}
</style>

<style lang="scss">
.template-page{
    .eaxc-loading{
        .el-loading-spinner{
             margin-top: 10px;
             p{
                 font-size: 12px;
             }
        }
    }
    .pDialog {
        .el-dialog__header {
            padding: 10px 20px 10px;
        }
        .el-dialog{
            position: absolute;
            bottom: 0;
            margin: 0;
        }
        ul{
            list-style-type: none;
            text-align: left;
            li{
                padding: 10px 0;
            }
        }
    }
    .pDialog2{
        height: calc(100% - 5vh);
        box-sizing: border-box;
        margin-top:5vh !important;
        .el-dialog{
            height: 100% !important;
            box-sizing: border-box;
            .el-dialog__body{
                height: calc(100% - 5vh);
                margin-top: 2vh;
                padding: 0px;
                box-sizing: border-box;
                 
            }
            .insurance-content{
                height: 100%;
                iframe{
                    height: 100%;
                    width: 100%;
                    border: none;
                }
            }
            .el-dialog__headerbtn{
                top: 12px;
            }
        }
        
    }
}
</style>
