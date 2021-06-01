<template>
    <div vkshop-event-scope="生成定投资料-完成页面">
        <enterprise-name :enterpriseCurCall="enterpriseCurName"></enterprise-name>
        <!-- 生成定投资料的详情 -->
        <div class="determine-detail"  v-loading="initLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
            <div v-show="!initLoading" class="determine-detail-content">
                <!-- 基本信息 -->
                <div class="detail-essential">
                    <p class="detail-essentail-time">创建时间：{{detailData.createtime}}</p>
                    <p class="detail-essentail-dw"><span>投保单位：</span><span>{{detailData.subproname}}</span></p>
                    <p class="detail-essentail-dh"><span>单号：{{detailData.policynumber}}</span></p>
                    <p :class="[policyStatusList[status].policyStatusClass]" class="policyStatusNomal"><span>{{policyStatusList[status].policyStatusCN}}</span></p>
                </div>
                <!-- 企业信息 -->
                <div class="detail-part">
                    <p class="detail-part-ba"><span class="detail-part-title">企业信息</span></p>
                    <div class="detail-part-content">
                        <p class="part-content-title" data-order="01"><span>投保单位基本信息</span></p>
                        <p class="flex-p"><span>{{detailData.companyCertificatesType | filterText(unitCidType)}}：</span>{{detailData.companyCrtificatesCode}}</p>
                        <p class="part-content-special flex-p"><span>注册地址：</span><span>{{detailData.province}}{{detailData.city}}{{detailData.area}}{{detailData.registerAddress}}</span></p>
                        <p class="flex-p"><span>纳税人标识：</span>{{detailData.taxmark == 1?'小规模纳税人':'一般纳税人'}}</p>
                        <div class="taxes-infor" v-if='detailData.taxmark==0'>
                            <p><span>①注册开户行：</span><span>{{detailData.taxbank}}</span></p>
                            <p>②注册电话：{{detailData.taxphone}}</p>
                            <p>③注册开户账号：{{detailData.taxAccountNumber}}</p>
                        </div>
                        <p class="flex-p"><span>单位性质：</span>{{detailData.unitNature | filterText(unitNatureType)}}</p>
                        <p class="flex-p"><span>行业类型：</span>{{detailData.industryType | filterText(unitIndustryType)}}</p>
                    </div>
                    <div class="detail-part-content">
                        <p class="part-content-title part-content-title-small" data-order="02"><span>经办人信息</span></p>
                        <p class="flex-p"><span>手机号：</span>{{detailData.agentPhone}}</p>
                        <p class="flex-p"><span>姓名：</span>{{detailData.agentName}}  （{{detailData.agentSex == 0?'女士':'先生'}}）</p>
                        <p class="flex-p"><span>证件类型：</span>{{detailData.agentCertificatesType | filterText(cidType)}}</p>
                        <p class="flex-p"><span>证件号码：</span>{{detailData.agentCertificatesCode}}</p>
                        <p class="flex-p"><span>证件有效期：</span>{{detailData.agentCertificatesValidity == '9999-01-01'?'长期有效':detailData.agentCertificatesValidity}}</p>
                    </div>
                    <div :class="[detailData.totalPremium == 1?'detail-part-content':'detail-part-common']">
                        <p class="part-content-title part-content-title-small" data-order="03"><span>保费规模</span></p>
                        <p>保费规模：{{detailData.totalPremium == 1?'已达20万':'未达20万'}}</p>
                    </div>
                    <div class="detail-part-common" v-if="detailData.totalPremium == 1">
                        <p class="part-content-title" data-order="04"><span>法人代表/负责人信息</span></p>
                        <p class="flex-p"><span>姓名：</span>{{detailData.legalPersonName}}</p>
                        <p class="flex-p"><span>证件类型：</span>{{detailData.legalPersonCertificatesType | filterText(cidType)}}</p>
                        <p class="flex-p"><span>证件号码：</span>{{detailData.legalPersonCertificatesCode}}</p>
                        <p class="flex-p"><span>证件有效期：</span>{{detailData.legalPersonCertificatesValidity == '9999-01-01'?'长期有效':detailData.legalPersonCertificatesValidity}}</p>
                    </div>
                </div>
                <!-- 投保单信息 -->
                <div class="detail-part">
                    <p class="detail-part-ba"><span class="detail-part-title">投保单信息</span></p>
                    <div class="detail-part-content">
                        <p class="part-content-title part-content-title-small" data-order="01"><span>计划 & 人数</span></p>
                        <p class="flex-p"><span>询价号：</span><span>{{detailData.proserialno}}</span></p>
                        <p class="flex-p"><span>提交时间：</span><span>{{detailData.createtime}}</span></p>
                        <p class="flex-p"><span>报价有效期：</span><span>{{detailData.loseefficacytime}}</span></p>
                        <p class="flex-p"><span>保费合计：</span><span>{{detailData.premiumsum}} 元</span></p>
                        <div>
                            <div class="part-plan" v-for="(item,index) in detailData.policyDetailVo" :key="index">
                                <p>计划名称：{{item.schemename}}</p>
                                <p>投保人数：{{item.insurenumber}}</p>
                                <p>保费小计：{{item.premium}} 元/人  ×  {{item.insurenumber}}  人  = {{MonyFrist(item.premium,item.insurenumber)}}.{{MonyLast(item.premium,item.insurenumber)}} 元</p>
                            </div>
                        </div>
                    </div>
                    <div :class="[detailData.taxmark == 0?'detail-part-content':'detail-part-common']">
                        <p class="part-content-title part-content-title-small" data-order="02"><span>保险期间</span></p>
                        <p>保期：{{detailData.insurPeriod}}</p>
                        <p>保险开始时间：{{detailData.insurstarttime}}</p>
                        <p>保险结束期间：{{detailData.insurendtime}}</p>
                    </div>
                    <div class="detail-part-common" v-if="detailData.taxmark == 0">
                        <p class="part-content-title part-content-title-small" data-order="03"><span>发票</span></p>
                        <p>发票类型：{{detailData.invoice == 0?'不需要发票':'需要专票'}}</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 底部按钮 -->
         <div class="footer-button">
            <el-button @click="waiverModification">返回</el-button><el-button :class="[status == 3 ? 'go-send':'no-send']" @click="sendMessage(status)">再次发送</el-button>
        </div>
    </div>
</template>

<script>
import enterpriseName from '../quotationProcess/processEnterpriseName.vue'
export default {
    name:'determineDetail',
    components:{enterpriseName},
    data(){
        return {
            initLoading: true,//初始化加载
            enterpriseCurName: localStorage.getItem('YF_mainstream_project'),//项目
            policyStatusList:[
                {policyStatusCN:'未使用',policyStatusClass:'not-used'},
                {policyStatusCN:'已下架',policyStatusClass:'removed-shelves'},
                {policyStatusCN:'已过期',policyStatusClass:'removed-shelves'},
                {policyStatusCN:'待回销',policyStatusClass:'sold-back'},
                {policyStatusCN:'已回销',policyStatusClass:'sold-allawy'}
            ],
            detailData:[],
            id:null,
            status:null,
             //单位证件类型
            unitCidType:[
                {
                    value:'01',label:'统一信用代码证'
                },
                {
                    value:'02',label:'企业法人营业执照'
                },
                {
                    value:'03',label:'中华人民共和国组织机构代码证'
                },
                {
                    value:'04',label:'税务登记证'
                },
                {
                    value:'05',label:'办学许可证'
                },
                {
                    value:'06',label:'社保登记号'
                },
                {
                    value:'07',label:'其他'
                }
            ],
            //单位性质
            unitNatureType:[
                {
                    value:'01',label:'国有'
                },
                {
                    value:'02',label:'集体'
                },
                {
                    value:'03',label:'私营'
                },
                {
                    value:'04',label:'个体'
                },
                {
                    value:'05',label:'法人联营'
                },
                {
                    value:'06',label:'股份制'
                },
                {
                    value:'07',label:'外国三资'
                },
                {
                    value:'08',label:'港澳台三资'
                },
                {
                    value:'09',label:'社团法人'
                },
                {
                    value:'10',label:'其他企业单位'
                },
                {
                    value:'11',label:'其他事业单位'
                },
                {
                    value:'12',label:'机关'
                },
                {
                    value:'13',label:'医院'
                },
                {
                    value:'14',label:'学校'
                },
                {
                    value:'15',label:'其他'
                }

            ],
            //行业类别
            unitIndustryType:[],
            //身份证件
            cidType:[
                { value:"0",label:'身份证'},
                { value:"1",label:'护照'},
                { value:"2",label:'军官证'},
                { value:"d",label:'港澳同胞回乡证'},
                { value:"e",label:'台胞证'}
            ]
        }
    },
    created(){
        // this.id = this.$route.params.policyNo;
        // this.status = this.$route.params.status;
        this.id = this.$route.query.policyNo;
        this.status = this.$route.query.status;
        this.getDictItemsA();
        this.initPolicDetail();
    },
    methods:{
        //获取行业类别/index/getDictItems
        getDictItemsA: function(){
            this.$axios.get('/index/getDictItems',{
                params:{
                   dictCode: 'industry_type'
                }
            }).then(response=>{
                console.log('获取行业类别')
                console.log(response);
                if(response.data.code == 200){ 
                    this.unitIndustryType = response.data.data;
                }
            })
        },
        // 初始化：
        initPolicDetail: function(){
            let param = {
                policynumber:this.id,
                rand: new Date().getTime()
            }
            this.$axios.post('/index/queryPolicDetail',this.$qs.stringify(param)).then(response=>{
                console.log('投保资料详情')
                console.log(response)
                if(response.data.code == 200){
                    this.detailData = response.data.data;
                }else{
                    this.$alert('报错，请联系信息技术部','报错',{
                        confirmButtonText:'好的',
                        callback: action => {
                            this.$router.go(-1)
                        }
                    })
                }
                this.initLoading = !this.initLoading;
            }).catch(error=>{})
        },
        // 发送信息
        sendMessage: function(status){
            if(status != 3){
                let html = '投保单已XXX(取投保单状态，例如”已过期“)，不能再次发送。如需投保单，请重新创建一份新的投保单。'
                this.$alert(html, '温馨提示', {
                    confirmButtonText: '确定',
                    dangerouslyUseHTMLString: true,
                    callback: action => {}
                });
            }else{
                // 发送短信
            }
        },
        // 返回子项目卡
        waiverModification: function () {
           this.$router.push({path:'/effectIndex'})
        },
        //钱
        MonyFrist: function(people,permony){
            let m = 2,money = 0;
            money = Number((permony)*100) * Number(people) / Math.pow(10, m);
            return (money.toFixed(2).split('.'))[0]
        },
        //钱
        MonyLast: function(people,permony){
            let m = 2,money = 0;
            money = Number((permony)*100) * Number(people) / Math.pow(10, m);
            return (money.toFixed(2).split('.'))[1]
        }
    },
    filters:{
        filterText: function(value,arry){
            let a = arry.filter(function(v){
                if(v.value == value){
                    return v
                }
            })
            if(a.length != 0){
                return a[0].label
            }
        }
    }
}
</script>

<style lang="scss" scoped>
$fontSize-twelve: 12px;
$fontSize-thirteen: 13px;
$fontSize-fourteen: 14px;
.determine-detail{
    padding: 60px 10px;
    font-size: $fontSize-twelve;
}
.determine-detail-content{
    background: #fff;
}
.detail-essential{
    position: relative;
    background: #fff;
    border-radius: 5px;
    padding: 15px 10px;
    font-size: $fontSize-thirteen;
    // &::before{
    //     content: '';
    //     position: absolute;
    //     left: 0;
    //     bottom: 2px;
    //     width: 10px;
    //     height: 65px;
    //     border-top: 6px solid transparent;
    //     border-left: 5px solid #FF925D;
    //     border-right: 10px solid transparent;
    //     border-bottom: 6px solid transparent;
    // }
    // &::after{
    //     content: '';
    //     position: absolute;
    //     right: 0;
    //     bottom: 2px;
    //     width: 10px;
    //     height: 65px;
    //     border-top: 6px solid transparent;
    //     border-left: 10px solid transparent;
    //     border-right: 5px solid #FF925D;
    //     border-bottom: 6px solid transparent;
    // }
    .detail-essentail-time{
        font-size: 12px;
        color: #c5c4c4;
        margin-top: -5px;
    }
    .detail-essentail-dh{
        text-align: center;
        margin-top: 5px;
        span{
            display: inline-block;
            background: #eef1f7;
            padding: 2px 10px;
            border-radius: 2px;
        }
    }
    .detail-essentail-dw{
        text-align: center;
        font-size: 16px;
        margin-top: 5px;
        span{
            &:first-child{
                display: block;
                text-align: left;
                font-size: 12px;
            }
        }
    }
}
.detail-part{
    margin-top: 25px;
    background: #fff;
    border-radius: 5px;
    padding: 10px 5px;
    position: relative;
    border-top: 1px solid #c0bfbf;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    .detail-part-title{
        background: linear-gradient(45deg, #FFAD86, #FF925D);
        color: white;
        padding: 5px 20px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        font-size: 12px;
    }
    .detail-part-ba{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        z-index: 0;
        top: -5px;
         &::after{
            content: '';
            position: absolute;
            left: -9px;
            top: -15px;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 9px solid #e9b7a0;
            border-top: 10px solid transparent;
            z-index: -1;
        }
        &::before{
            content: '';
            position: absolute;
            right: -9px;
            top: -15px;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 9px solid #e9b7a0;
            border-top: 10px solid transparent;
            z-index: -1;
        }
    }
    .detail-part-common {
        padding: 10px 12px;
        position: relative;
        font-size: $fontSize-thirteen;
        p{
            padding: 2px 0;
        }
    }
    .detail-part-content{
        padding: 10px 12px;
        position: relative;
        border-bottom: 2px dotted #ededed;
        font-size: $fontSize-thirteen;
        p:not(.part-content-title){
            padding: 2px 0;
        }
        &::before{
            content: '';
            position: absolute;
            left: -13px;
            bottom: -10px;
            width: 16px;
            height: 16px;
            border-radius: 50px;
            background: #ededed;
        }
        &::after{
            content: '';
            position: absolute;
            right: -13px;
            bottom: -10px;
            width: 16px;
            height: 16px;
            border-radius: 50px;
            background: #ededed;
        }
    }
    
    .part-content-title{
        display: inline-block;
        padding: 3px 15px;
        position: relative;
        background: #FFD485;
        margin: 5px 0;
        transform: skewX(-20deg);
        width: 110px;
        margin-left: 30px;
        height: 16px;
        border-radius: 5px;
        span{
            transform: skewX(20deg);
            position: absolute;
            left: 15px;
            color: white;
            font-size: 12px;
        }
        &::before{
            content: attr(data-order);
            position: absolute;
            left: -28px;
            top: 0px;
            width: 30px;
            height: 35px;
            transform: skewX(0deg);
            font-size: 20Px;
            background-image:-webkit-linear-gradient(bottom, white, #ffd485);
            background-clip:text;
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
        }
    }
    .part-content-title-small{
        width: 80px;
    }
    .part-plan{
        background: #f6f6f6;
        padding: 5px;
        border-radius: 5px;
        margin-top: 5px;
    }
}
.part-content-special{
    display: flex;
    span{
        &:first-child{
            width: 80px;
        }
    }
}
.taxes-infor{
    text-indent: 2em;
}
.footer-button{
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
        min-width: 35%;
        height: 36px;
        background: #fff;
        border: none;
        color: #62b4ff;
        font-size: $fontSize-twelve;
        // @include font-dpr($fontSize-twelve);
        &:first-child{
            border-left: 0;
        }
        &.go-send{
            color: #fff;
            background: #62b4ff;
        }
        &.no-send{
            color: #666;
            background: #ccc;
        }
    }
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
    // right: 20px;
    // top: 12%;
    right: 0;
    top: -6%;
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
    // right: 54px;
    // top: 20%;
    right: 0;
    top: -6%;
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
    // right: 54px;
    // top: 20%;
    right: 0;
    top: -6%;
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
    // right: 54px;
    // top: 20%;
    right: 0;
    top: -6%;
    transform: rotateZ(40deg);
    border: 1px dotted #2cccd4;
    font-size: 4px;
    // @include font-dpr(11px);
}
.flex-p{
    display: flex;
    span:first-child{
        min-width: 80px;
        display: inline-block;
        text-align-last: justify;
    }
}
</style>
<style lang="scss">
.determine-detail{
    .el-loading-spinner{
        position: fixed;
        font-size: 20px;
    }
    .el-loading-mask{
        background-color:rgba(255,255,255,.1);
    }
}
</style>