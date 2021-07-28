<template>
    <div class="quotation-list-page" vkshop-event-scope="报价清单列表">
         <enterprise-name :enterpriseCurCall="enterpriseCurName"></enterprise-name>
         <div class="quotation">
             <!-- 搜索 -->
             <div class="quotation-search">
                <div>
                    <el-select v-model="selectContent" slot="prepend" placeholder="请选择" class="quotation-search-btn" @change="changeSelectContent">
                        <el-option label="查看全部" value="1"></el-option>
                        <el-option label="提交日期" value="2"></el-option>
                        <el-option label="核保日期" value="3"></el-option>
                        <el-option label="核保状态" value="4"></el-option>
                    </el-select><div class="quotation-change-condition">
                        <el-input
                        placeholder="不需要输入内容"
                        :disabled="true"
                        v-if="selectContent=='1'">
                        </el-input>
                        <el-date-picker
                        type="daterange"
                        v-model="selectTime"
                        size="mini"
                        :unlink-panels=true
                        placeholder="选择时间范围" 
                        @focus = 'dateFocus'
                        @blur= 'dateBlur'
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                        v-else-if="selectContent=='2'|| selectContent=='3'">
                        </el-date-picker>
                        <el-radio-group v-model="radio" v-else-if="selectContent=='4'" class="select-radio" @change="radioChange">
                            <el-radio :label="1">待审核</el-radio>
                            <el-radio :label="2">审核中</el-radio>
                            <el-radio :label="3">已审核</el-radio>
                        </el-radio-group>
                    </div>
                    
                </div>
             </div>
             <!-- 展示框 -->
             <div class="quotation-list">
                <ul v-if="quotationListArray.length > 0">
                     <li v-for="(item,index) in quotationListArray" :key="index" @click="lookDetail(item.proserialno,item.status)">
                         <p class="qutotation-title" :class="{'qutotation-ifread': item.examineTime>item.looklastTime}">{{item.proserialno}} <i class="el-icon-arrow-right"></i></p>
                         <p v-if="item.status == 1" class="angle-sign angle-sign-right">待审核</p>
                         <p v-else-if="item.status == 2" class="angle-sign angle-sign-wait">审核中</p>
                         <p v-else-if="item.status == 3 || item.status == 4" class="angle-sign angle-sign-success">审核完成</p>
                         <div class="qutotation-time">
                            <p><span>提交时间</span><span>{{item.createtime}}</span></p><p>
                                <span>核保时间</span><span v-if="item.approvetime!=null">{{item.approvetime}}</span>
                                <span v-else-if="item.approvetime==null && item.status == 1">--</span>
                                <span v-else-if="item.approvetime==null && item.status == 2">--</span></p>
                         </div>
                         <div class="qutotaion-btn" v-if="item.status != 2">
                            <button @click.stop="askAgain(item.proserialno,item.mouldcode)" vkshop-event-name="再询一次" vkshop-event-type="click">再询一次</button>
                         </div>
                     </li>
                </ul>
                <ul v-else-if="selectContentFlag == false">
                    <li class="nodata">等待搜索条件中...</li>
                </ul>
                <ul v-else-if="quotationListArray.length <= 0">
                    <li class="nodata"><img src="../../assets/img/nodata.png" v-if="isNodata == true"><i class="el-icon-loading" v-else></i><p>{{noDataTip}}</p></li>
                </ul>
                  
                 <!-- 到底部的提醒 -->
                <p style="color:#999;text-align:center;padding:10px 0 5px;font-size:12Px">------------------- 已经到底部了 -------------------</p>
                
                <!-- 分页区 -->
                <div class="pagination-m">
                    <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next,jumper,total"
                    :current-page.sync="currentPage"
                    :pager-count="5"
                    :total="totalAll"
                    :hide-on-single-page="true">
                    </el-pagination>
                </div>
             </div>
             <!-- 按钮 -->
             <div class="button-btn">
                <button @click="goHome" vkshop-event-name="返回项目主页" vkshop-event-type="click">返回项目主页</button>
                <button @click="rulesLook" vkshop-event-name="规则说明" vkshop-event-type="click"><i class="el-icon-info"></i>规则说明</button>
             </div>
            
             <!-- 对话框 -->
            <el-dialog
            :visible.sync="centerDialogVisible"
            width="100%"
            class="pDialog">
                <div class="rule-all">
                    <div class="rule-title"><i class='el-icon-document'></i> 规则说明</div>
                    <div class="rule-content">
                        <p><b>询价状态：</b><br/>未提交、已提交待审核、审核中、审核完成
                            <br/><span class="rule-tip">只展示与提供查询其中3种状态：“待审核”、“审核中"、“审核完成”</span>
                        </p>
                        <br/>
                        <p><b>再询一次：</b>
                            <span>询价处于“待审核”或“审核完成”状态，可操作“再询一次”（您可在提交前，进行内容调整）。</span>
                            <span class="rule-tip"><i>区别：</i><i>“待审核”状态：按提交的内容，填写一个新的询价单。
                            <br/>“审核完成”状态：按团核审批后的内容，填写一个新的询价单。</i></span>
                            <span>询价处于“审核中"状态，不可操作“再询一次”。</span>
                        </p>
                        <br/>
                        <p><b>查看详情：</b><br/>
                            <span>询价处于“待审核”或“审核中”状态，看到的是提交的内容。</span>
                            <span>询价处于“审核完成”状态，可以看到团核审批的内容。</span>
                        </p>
                    </div>
                </div>
            </el-dialog>


             <!-- 假装关闭日期弹框 -->
             <div class="date-close" v-if="(selectContent == 2 || selectContent == 3 )&& dateClose == true">
                 <button @click="dateCloseBtn"><i class="el-icon-circle-close"></i></button>
             </div>

            <div class="eaxc-loading" v-if="loadingEaxc">
                <p v-loading="loadingEaxc"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)">
                </p>
            </div>
         </div>
    </div>
</template>

<script>
import enterpriseName from '../quotationProcess/processEnterpriseName.vue'
export default {
    name:'quotationList',
    components:{enterpriseName},
    data(){
        return{
            enterpriseCurName:localStorage.getItem('YF_mainstream_project'),
            inputContent:'',//搜索输入框
            selectContent:'',//搜索选择框
            selectTime:'',//选择的时间段
            radio:'' ,//默认选择核保状态为1
            currentPage:1,//当前页数
            totalAll:0,
            quotationListArray:[],
            dateClose:false,
            selectContentFlag: true,
            noDataTip:'正在加载',//没有数据时候的提示语
            centerDialogVisible:false,//对话框是否展示
            centerDialogVisibleList:[],//行业
            isNodata: false,//是否真的没有数据
            loadingEaxc:false,//加载中的提示语
            isKeepAlive:false
        }
    },
    created(){
        this.initQuotation();
    },
    activated() {
        if(!this.$route.meta.isUseCache){ //isUseCache 时添加中router中的元信息，判读是否要缓存
            this.initQuotation();
            this.inputContent = '';//搜索输入框
            this.selectContent = '';//搜索选择框
            this.selectTime = '';//选择的时间段
            this.radio = ''
        }
    },
    // 设置了keepAlive缓存的组件：      
　  //第一次进入：beforeRouterEnter ->created->…->activated->…->deactivated        
　　//后续进入时：beforeRouterEnter ->activated->deactivated 可以看出，只有第一次进入该组件时，
    //才会走created钩子，而需要缓存的组件中activated是每次都会走的钩子函数。所以，我们要在这个钩子里面去判断，
    //当前组件是需要使用缓存的数据还是重新刷新获取数据。
    methods:{
        //初始化页面
        initQuotation(){
            console.log("跑这里初始化页面")
            this.noDataTip = '正在拼命加载中';
            this.isNodata = false;
            this.selectContentFlag = true;
            this.enterpriseCurName = localStorage.getItem('YF_mainstream_project');
            
            this.$axios.post('/index/getProMouldPage',{
                procode: localStorage.getItem('YF_mainstream_project_code'),
                rand: new Date().getTime()
            }).then(response =>{
                console.log(response);
                if(response.data.code == 200){
                    if(response.data.data.total != 0){
                        this.quotationListArray = response.data.data.items;
                        this.totalAll = response.data.data.total;
                        this.currentPage = 1;
                    }else{
                        this.quotationListArray = [];
                        this.selectContentFlag = true;
                        this.noDataTip = '暂时还没有报价哦~';
                        this.isNodata = true;
                        this.totalAll = 0;
                    }
                }else{
                    this.$alert('出错啦！获取不到报价','',{
                        confirmButtonText:'好的，我明白了'
                    }).catch(()=>{})
                }
            }).catch(error =>{
                this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                    confirmButtonText:'好的，我明白了'
                }).catch(()=>{})
            })
        },
        //规则说明
        rulesLook: function(){
            this.centerDialogVisible = !this.centerDialogVisible;
        },
        //选择失去焦点的时候
        changeSelectContent: function(){
            console.log('selectContent')
            console.log(this.selectContent)
            this.selectTime = '';
            this.radio = '';
            this.selectContentFlag = false;
            this.quotationListArray = [];
            this.totalAll = 0;
            this.dateClose = false;

            if(this.selectContent == 1){
                this.initQuotation();
            }
             if(this.selectContent == 4){
                this.radio = 1;
                this.radioChange("1");
            }
        },
        //日期获得聚焦的时候
        //关闭按钮出现，假装可以关闭
        dateFocus: function(){
            console.log('关闭按钮出现')
            document.activeElement.blur()
            this.$nextTick(() => {
                let inputTime = document.querySelectorAll('.el-input__inner')
                inputTime.forEach(item => {
                item.addEventListener('focus', () => {
                    document.activeElement.blur()
                })
                })
            })
            this.dateClose = true;
        },
        //日期失去焦点的时候，获取时间
        dateBlur: function(){
            console.log('selectTime')
            console.log(this.selectTime)
            console.log("跑这里日期失去焦点的时候，获取时间")
            console.log(new Date(this.selectTime[0]).toLocaleDateString().replace(/\//g, '-'))
            this.selectContentFlag = true;
            if(this.selectTime == ''){
                this.selectContent = '';//搜索选择框
                this.initQuotation();
                return
            }
            this.dateClose = false

            this.$axios.post('/index/getProMouldPage',{
                    procode: localStorage.getItem('YF_mainstream_project_code'),
                    createTimeStart: this.selectContent==2 ? this.formatDateTime(this.selectTime[0]):'',
                    createTimeEnd: this.selectContent==2 ? this.formatDateTime(this.selectTime[1]):'',
                    approveTimeStart: this.selectContent==3 ? this.formatDateTime(this.selectTime[0]):'',
                    approveTimeEnd: this.selectContent==3 ? this.formatDateTime(this.selectTime[1]):'',
                    rand: new Date().getTime()
                }).then(response =>{
                    console.log("日期失去焦点的时候，获取时间")
                    console.log(response)
                    if(response.data.code == 200){
                        if(response.data.data.total != 0){
                            this.quotationListArray = response.data.data.items;
                            this.totalAll = response.data.data.total
                        }else{
                            this.totalAll = 0;
                            this.quotationListArray = [];
                            this.noDataTip = "此时间段内没有询价，请更换条件";
                            this.isNodata = true;
                        }
                    }else{
                        this.$alert('出错啦！没有获取到该条件的询价','',{
                            confirmButtonText:'好的，我明白了'
                        }).catch(()=>{})
                    }
                }).catch(error =>{
                    this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                        confirmButtonText:'好的，我明白了'
                    }).catch(()=>{})
                })
        },
        //单选失去焦点
        radioChange: function(value){
            this.noDataTip = '正在拼命加载中';
            this.totalAll = 0;
            this.quotationListArray = [];
            this.selectContentFlag = true;
            // this.selectContentFlag = false;
            this.isNodata = false;
            console.log(value)
            console.log("跑这里单选失去焦点")
            this.$axios.post('/index/getProMouldPage',{
                procode: localStorage.getItem('YF_mainstream_project_code'),
                rand: new Date().getTime(),
                status: value
            }).then(response =>{
                console.log(response);
                if(response.data.code == 200){
                    if(response.data.data.total != 0){
                        this.quotationListArray = response.data.data.items;
                        this.totalAll = response.data.data.total;
                    }else{
                        this.totalAll = 0;
                        this.quotationListArray = [];
                        this.selectContentFlag = true;
                        this.noDataTip = "此条件内没有询价，请更换条件"
                        this.isNodata = true;
                    }
                }else{
                    this.$alert('查询失败，请重新查询','',{
                        confirmButtonText:'好的，我明白了'
                    }).catch(()=>{})
                }
            }).catch(error =>{
                this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                    confirmButtonText:'好的，我明白了'
                }).catch(()=>{})
            })
        },
        //假装的关闭按钮
        dateCloseBtn: function(){
            this.dateClose = false
        },
        //时间转换
        formatDateTime(inputTime) {
            var date = new Date(inputTime);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
        },
        //再询一单
        askAgain: function(proserialno,mouldcode){
            console.log("我是再询一单的："+proserialno);
            let params = {proserialno: proserialno, rand: new Date().getTime()}, that = this;
            this.beforeCreateAnother(params,function(response){
                console.log(response);
                let msgg = ''
                if(response.data.code == "200"){
                    if(response.data.msg != null &&  response.data.msg != ''){
                        msgg = '请确认是否参照本方案提交一份新的询价。<br/>请问您确定再询一次吗？<br/><span style="color:red">注意：'+response.data.msg+'责任已下架。需要删除该责任后重新提交询价。</span><br/>如有疑问，请咨询您的团核人员。'
                        that.trueAskAgain(proserialno,mouldcode,msgg);
                    }else{
                        msgg = '请确认是否参照本方案提交一份新的询价。（可以微调细节）<br/>请问您确定再询一次吗？'
                        that.trueAskAgain(proserialno,mouldcode,msgg);
                    }
                }
            });
            
        },
        //真的开始询价
        trueAskAgain: function(proserialno,mouldcode,msg){
            this.$confirm(msg, '', {
                distinguishCancelAndClose: true,
                dangerouslyUseHTMLString:  true,
                confirmButtonText: '确认再询一次',
                cancelButtonText: '取消'
            }).then(()=>{
               
                let _that = this;
                 //获取未提交模板(看有没有暂存) /index/checkFillMould  mouldcode--模板编码   procode--项目编码
                let paramsCheck = {mouldcode:mouldcode,procode:localStorage.getItem('YF_mainstream_project_code'),rand: new Date().getTime()}
                new Promise(function(resolve,reject){
                    _that.$axios.post('/index/checkFillMould',_that.$qs.stringify(paramsCheck)).then(response =>{
                        console.log(response)
                        resolve(response);
                    }).catch(error =>{
                        _that.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                            confirmButtonText:'好的，我明白了'
                        }).catch(()=>{})
                    })
                }).then(function(responseF){
                    console.log('如果data不为空，那么用户之前一定选择过这个模板')
                    console.log(responseF)
                //如果data不为空，那么用户之前一定选择过这个模板
                    if(responseF.data != '' && responseF.data != null){
                        //判断模板是否被暂存过
                            //如果为真，那么之前就被暂存过了
                        if(responseF.data.ifHaveTempData){
                            _that.$confirm('该模板您之前有暂存过内容，是否参照本方案替换原来的暂存内容来提交一份新的询价？','',{
                                confirmButtonText:'确定使用本方案',
                                cancelButtonText:'放弃替换',
                                distinguishCancelAndClose:true
                            }).then(()=>{//继续编辑
                                _that.loadingEaxc = true;
                                console.log('缓存')
                                //把所有的数据存储在localstorage里
                                _that.getPlanContent(proserialno,mouldcode,0);
                                localStorage.setItem('YF_quotationInformation_proserialno',responseF.data.proserialno);
                            }).catch(action =>{})
                        }else{//若果为假，那么从头开始填写
                            _that.loadingEaxc = true;
                            _that.getPlanContent(proserialno,mouldcode,0);
                            localStorage.setItem('YF_quotationInformation_proserialno',responseF.data.proserialno);
                        }

                    }else{//如果data为空，那么用户之前一定没有选择过这个版本
                        _that.loadingEaxc = true;
                        _that.getPlanContent(proserialno,mouldcode,1);
                    }
                }).catch(error =>{
                    this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                        confirmButtonText:'好的，我明白了'
                    }).catch(()=>{})
                })
                
            }).catch(()=>{})
        },
        //拿到方案的内容
        getPlanContent: function(proserialno,mouldcode,ifCreateSerialText){
            console.log(proserialno)
            let that = this;
            let params = {proserialno: proserialno, rand: new Date().getTime(), ifCreateSerial: ifCreateSerialText}
            this.$axios.post('/index/createAnotherOrder',this.$qs.stringify(params)).then(response =>{
                    console.log(response);
                    that.loadingEaxc = false;
                    if(response.data.code == 200){
                        if(ifCreateSerialText == 1){
                            localStorage.setItem('YF_quotationInformation_proserialno',response.data.data.proserialno);
                        }
                        let quotationInformation = {templateSelection:mouldcode,templateCode:mouldcode.split('')[0]};
                        localStorage.setItem("YF_quotationInformation_1",JSON.stringify(quotationInformation));
                        that.putDataToLocal(response.data.data);
                        that.jumpPage(mouldcode,response.data.tempsavestep);
                        that.getItemP();
                       
                    }else{
                        that.$alert('再询一单操作失败，请稍后重试','',{
                            confirmButtonText:'好的，我明白了'
                        }).catch(()=>{})
                    }
                }).catch(error =>{
                    that.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                        confirmButtonText:'好的，我明白了'
                    }).catch(()=>{})
                })
        },
        //再询一单的询价前检测是否含有下架产品
        beforeCreateAnother: function(params,fun){
            console.log(params)
            this.$axios.post('/index/beforeCreateAnother',this.$qs.stringify(params)).then(response =>{
                fun(response)
                console.log("ma呀，不是删数据，是检测数据")
                console.log(response);
            })
        },
        // 检测获取的信息中是否含有下架的产品--20210126
        checkShelfProduct: function(param,funProduct){
            let shelfProduct = '', checkShelfProductFlag = false, tempShelf = [];//false--不含有下架产品
            param.forEach(element => {
                element.data.forEach(index => {//进入每个data里面
                    index.responsibilityData.forEach(indexData => {
                        if( indexData.ifOffShelf != undefined && indexData.ifOffShelf == true ){
                            checkShelfProductFlag = true;
                            if(tempShelf.indexOf(indexData.responsibilityNameCode) == -1){
                                shelfProduct +=  indexData.responsibilityNameCode + indexData.riskshort + '、'  ;
                                tempShelf.push(indexData.responsibilityNameCode);
                            }
                        }
                    })
                })
            });

            funProduct(shelfProduct.slice(0,shelfProduct.length-1),checkShelfProductFlag)
        },
        //获取项目信息
        getItemP: function(){
            let _that = this;
            new Promise(function(resolve,reject){
                _that.$axios.get('/index/getIndustryList').then(response => {
                    _that.centerDialogVisibleList = response.data.data;
                    resolve(response.data.code)
                }).catch(error =>{
                    this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                        confirmButtonText:'好的，我明白了'
                    }).catch(()=>{})
                })
            }).then(function(industryCode){
                if(industryCode == 200){
                    _that.$axios.get('/index/getProDetail',{
                        params:{
                            procode : localStorage.getItem('YF_mainstream_project_code'),
                            rand: new Date().getTime()
                        }
                    }).then((response) => {//当行业已经获取好之后，获取项目信息
                       
                        if(response.data.code != 500){//500--项目信息不存在
                         let selectIndustry = null;
                             _that.centerDialogVisibleList.forEach(function(currentValue, index, arr){
                                if(Number(currentValue.industrycode) == Number(response.data.data[0].industrycode)){
                                    selectIndustry = currentValue.industry;
                                }
                            })
                            let quotationInformation = {
                                totalNum:response.data.data[0].unitnum,
                                industry:selectIndustry,
                                selectIndustryCode:response.data.data[0].industrycode,
                                textareaRecode:response.data.data[0].remark
                            };
                            localStorage.setItem("quotationInformation_0",JSON.stringify(quotationInformation));
                        }else{
                            this.$alert('该项目信息不存在','',{
                                confirmButtonText:'好的，我明白了'
                            }).catch(()=>{})
                        }
                    })
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
        //跳转链接typecode--类型 tempsavestepC--暂存的步数
        jumpPage: function(typecode,tempsavestepC){
            this.loadingEaxc = false;
            let reg = /A/gi;
             if(reg.test(typecode)){//非建工险
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
                this.$router.push({path:'/constructionProcess/constructionOne'})
            }
        },
        //进入详情页面
        lookDetail:function(proserialno,status){
            console.log(this)
            this.$router.push({path:'/quotationDetail',query:{id:proserialno,status:status}})
        },
        //回到主页
        goHome: function(){
            this.$router.push({name:'OtoIndex'});
        },
        //分页两个函数
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            // this.noDataTip = '正在拼命加载中';
            // this.isNodata = false;
            // this.quotationListArray = [];

            let data = {};
            if(this.radio != ''){
                data={
                    procode: localStorage.getItem('YF_mainstream_project_code'),
                    createTimeStart: this.selectContent==2  ? this.formatDateTime(this.selectTime[0]):'',
                    createTimeEnd: this.selectContent==2 ?  this.formatDateTime(this.selectTime[1]):'',
                    approveTimeStart: this.selectContent==3 ? this.formatDateTime(this.selectTime[0]):'',
                    approveTimeEnd: this.selectContent==3 ? this.formatDateTime(this.selectTime[1]):'',
                    page: val,
                    size:10,
                    status:this.radio,
                    rand: new Date().getTime()
                }
            }else{
                data={
                    procode: localStorage.getItem('YF_mainstream_project_code'),
                    createTimeStart: this.selectContent==2  ? this.formatDateTime(this.selectTime[0]):'',
                    createTimeEnd: this.selectContent==2 ?  this.formatDateTime(this.selectTime[1]):'',
                    approveTimeStart: this.selectContent==3 ? this.formatDateTime(this.selectTime[0]):'',
                    approveTimeEnd: this.selectContent==3 ? this.formatDateTime(this.selectTime[1]):'',
                    page: val,
                    size:10,
                    rand: new Date().getTime()
                }
            }
             this.$axios.post('/index/getProMouldPage',data).then(response =>{
                    console.log("我是分页")
                    console.log(response)
                    window.scrollTo(0,0);
                    if(response.data.code == 200){
                        if(response.data.data.total != 0){
                            this.quotationListArray = response.data.data.items;
                            this.totalAll = response.data.data.total
                        }else{
                            this.totalAll = 0;
                            this.quotationListArray = [];
                            this.noDataTip = "此时间段内没有询价，请更换条件";
                            this.isNodata = true;
                        }
                    }else{
                        this.$alert('查询失败，请重试','',{
                            confirmButtonText:'好的，我明白了'
                        }).catch(()=>{})
                    }
                   
                }).catch(error =>{
                    this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                        confirmButtonText:'好的，我明白了'
                    }).catch(()=>{})
                })
        }
    },
    beforeRouteLeave(to, from, next){
        // 列表页面跳转到 详情页时，设置需要缓存
        if(to.name=='quotationDetail'){
            from.meta.isUseCache = true;
        }else{
            from.meta.isUseCache = false;
        }
        next()
    }
}
</script>

<style lang="scss" scoped>
.quotation{
    margin-top: 48px;
    padding-bottom: 50px;
    font-size: 0px;
    .quotation-search{
        background: #fff;
        padding: 5px 0;
        position: fixed;
        height: 40px;
        z-index: 99;
        width: 100%;
        .quotation-search-btn{
            width: 110px;
            .el-input__inner{
                font-size: 12px;
            }
        }
        .quotation-change-condition{
            display: inline-block;
            height: 40px;
            border: 1px solid #DCDFE6;
            width: 240px;
            vertical-align: bottom;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            border-left: 0;
            padding-left: 5px;
        }
        .select-radio{
            label{
               line-height: 40px;
            }
        }
    }
    
    .quotation-list{
        padding:50px 15px 50px 15px;
        ul{
            list-style-type: none;
        }
        li{
            background: #fff;
            border-radius: 10px;
            position: relative;
            padding: 10px 15px;
            box-sizing: border-box;
            margin-top: 10px;
            &::before{
                content: '';
                position: absolute;
                width: 15px;
                height: 15px;
                border-radius: 50px;
                background: #f5f5f5;
                top: 35px;
                left: -7px;
            }
            &::after{
                content: '';
                position: absolute;
                width: 15px;
                height: 15px;
                border-radius: 50px;
                background: #f5f5f5;
                top: 35px;
                right: -7px;
            }
            .qutotation-title{
                font-size: 14px;
            }
            .qutotation-ifread{
                 &::before{
                    content: '';
                    position: absolute;
                    left: -2px;
                    top: -2px;
                    width: 10px;
                    height: 10px;
                    background: red;
                    border-radius: 50px;
                }
            }
            .angle-sign{
                font-size: 10px;
                width: 70px;
                padding: 7px 0;
                border-bottom-left-radius: 10px;
                border-top-right-radius: 10px;
                text-align: center;
                position: absolute;
                top: 0;
                right: 0;
            }
            .angle-sign-right{
                background: #f9b131;
                color: white;
            }
            .angle-sign-wait{
                // background: #cedef9;
                background: #449af1;
                color: white;
            }
            .angle-sign-success{
                // background: #60b3ff;
                background: #57b7aa;
                color: white;
            }
            .qutotation-time{
                font-size: 12px;
                margin-top: 20px;
                p{
                    display: inline-block;
                    width: 50%;
                    text-align: center;
                    span{
                        display: block;
                        &:first-child{
                            font-size: 12px;
                        }
                        &:last-child{
                            font-size: 13px;
                        }
                    }
                    &:first-child{
                        border-right: 1px solid #b8b8b8;
                        box-sizing: border-box;
                    }
                }
            }
            .qutotaion-btn{
                text-align: center;
                font-size: 12px;
                margin-top: 20px;
                button{
                    width: 150px;
                    height: 30px;
                    font-size: 12px;
                    border-radius: 10px;
                    position: relative;
                    overflow: hidden;
                    &:first-child{
                        background: inherit;
                        border: 1px solid #60b3ff;
                        color: #60b3ff;
                    }
                }
            }
        }
        li.nodata{
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translate(-50%);
            font-size: 13px;
            text-align: center;
            background: inherit;
            img{
                object-fit : contain
            }
        }
       
    }

    .date-close{
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        left: 0px;
        width: 100%;
        height: 50px;
        background: #fff;
        z-index: 2003;
        button{
            border: 1px solid #fff;
            background: #fff;
            width: 80px;
            height: 35px;
            border-radius: 8px;
            position: absolute;
            right: 10px;
            bottom: 10px;
            color: #60b3ff;
            text-align: right;
            i{
                font-size: 20px;
            }
        }
    }
    .eaxc-loading{
        width: 50%;
        height: 70px;
        // position: absolute;
        position: fixed;
        top: 50%;
        margin: 0 auto;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,.7);
        font-size: 20px;
        border-radius: 5px;
    }
}
.pagination-m{
    margin-top: 30px;
    line-height: 40px;
}
.el-pagination{
    white-space: normal;
    text-align: center;
}
span.el-pagination__total{
    margin-left: 10px !important;
    color: #acacac;
}
.el-pagination.is-background .btn-next{
        padding: 5px;
}

.button-btn{
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background: #f5f5f5;
    width: 100%;
    font-size: 0;
    padding: 10px;
    button{
        width: 150px;
        height: 38px;
        border-radius: 5px;
        position: relative;
        overflow: hidden;
        font-size: 12px;
        &:first-child{
            background: inherit;
            border: 1px solid #60b3ff;
            color: #60b3ff;
        }
        &:last-child{
            background: inherit;
            color: #60b3ff;
            border: none;
            position: absolute;
            width: auto;
            right: 20px;
        }
    }
}
</style>

<style lang="scss">
.quotation-list-page{
    .eaxc-loading{
        .el-loading-spinner{
             margin-top: 6px;
             p{
                 font-size: 12px;
             }
        }
    }
}
.quotation-search {

    text-align: center;
    .el-input--suffix .el-input__inner{
        font-size: 12px;
        height: 40px;
    }
    .el-input__inner{
        border: none;
    }
    .el-select {
        border: 1px solid #DCDFE6;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    .el-date-editor--dates{
        border: none;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .el-range-editor--mini.el-input__inner{
        height: 100%;
        width: 100%;
        padding: 0;
    }
    .el-range-editor--mini .el-range-separator{
        line-height: 40px;
    }
   
   .el-input.is-disabled .el-input__inner{
       height: 40px;
   }
    
}
.quotation-list-page{
    .el-radio{
        margin-right: 20px;
        &:last-child{
            margin-right: 0px;
        }
        .el-radio__label{
            padding-left: 4px;
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
        .el-dialog__body{
            padding: 0 20px 30px 20px;
        }
        .rule-title{
            padding:10px 0;
            padding-bottom: 20px;
            color:#2f73ff;
            font-size: 14px;
            font-weight: 700;
        }
        .el-icon-document{
            font-weight: 700;
        }
        .rule-content{
            font-size: 13px;
            background: #E7F0FF;
            padding:10px 15px 15px 15px;
            border-radius: 5px;
            color: #3c649f;
            position: relative;
            &::before{
                content: '';
                position: absolute;
                width: 16px;
                height: 16px;
                background: #fff;
                border-radius:100%;
                left:-8px;
                top: 15px;
            }
            &::after{
                content: '';
                position: absolute;
                width: 16px;
                height: 16px;
                background: #fff;
                border-radius:100%;
                right:-8px;
                top: 15px;
            }
            p{
                font-size: 12px;
                span{
                    display: inline-block;
                    padding: 4px 0;
                    i{
                        display: inline-block;
                        font-style: normal;
                        &:first-child{
                            float: left;
                            position: absolute;
                        }
                        &:last-child{
                          margin-left: 30px;  
                          float: left;
                          
                        }
                    }
                }
                .rule-tip{
                    color: #999;
                    font-size: 11px;
                    padding-top: 0;
                }
            }
        }
    }
}
.el-date-range-picker{
    position: fixed !important;
    top: 50px !important;
    bottom: 0 !important;
    right: 0 !important;
}
.el-date-range-picker .el-picker-panel__body{
    width: auto;
}
.el-picker-panel__content{
    left: 0;
    background: #fff;
    margin: 0;
}
.el-date-range-picker__content.is-left,.el-date-range-picker__content.is-right{
    border: 0;
    width: 100%;
}
.el-date-range-picker__content.is-left{
    padding-bottom: 0;
    padding-top: 5px;
}
.el-date-range-picker__content.is-right{
    padding-top: 5px;
    padding-bottom: 5px;
}
.el-date-range-picker__content.is-right{
    top: 0;
    left: 0;
    background: #fff;
}
.el-picker-panel__body-wrapper::after, .el-picker-panel__body::after{
    content: '';
}
.el-date-range-picker{
    width: 100%;
}
.el-popper .popper__arrow, .el-popper .popper__arrow::after {
    position: relative;
}
.el-date-range-picker{
     overflow: scroll;
}
.el-date-range-picker .el-picker-panel__body{
    min-width: auto;
}
.el-date-range-picker[x-placement^=bottom]{
    margin-top: 0;
}
.el-picker-panel{
    margin: 0;
}
.quotation-list{
    .el-pagination__total{
        // margin-top: 10px;
        margin-left: 5px;
        color: #bfbfbf;
    }
}
</style>