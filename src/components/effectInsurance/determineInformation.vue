<template>
<!-- 确定投保信息 -->
    <div class="determine-information-page" vkshop-event-scope="定投保信息">
        <enterprise-name :enterpriseCurCall="enterpriseCurName"></enterprise-name>
        <div v-loading="initLoading" :class="[initLoading?'initLoading':'','el-hyq-loading']" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
            <div class="determine-information-content" v-if="!initLoading" >
                <!-- 投保单位 -->
                <div class="information-content-part information-content-unit">
                    <p class="unit-mo"><span>投保单位：</span><span>{{subprojectName}}</span></p>
                    <p class="tip-content">（需与证件上的完整名称及公章一致。）</p>
                </div>
                <!-- 确定计划和人数 -->
                <div class="information-content-part information-content-plan">
                    <div class="information-content-plan-top">
                        <span>1、确认 计划&人数</span>
                        <el-button @click="changeOffer"><i class="el-icon-refresh"></i>不是这个报价，换一个</el-button>
                    </div>
                    <!-- 报价具体内容 -->
                    <div class="information-content-plan-middle">
                        <div class="plan-top-inquiry">
                            <p class="plan-middle-inquiryNo"><el-button @click="lookDetail(proserialno)">询价号：{{proserialno}} <i class="el-icon-arrow-right"></i></el-button> </p>
                            <p>提交时间：{{createtime | filterTime()}}</p>
                            <p>报价有效期：{{loseefficacytime | filterTime()}} </p>
                        </div>
                        <div class="plan-detail">
                            <div :class="[prePlan.isprint == 0?'no-print':'','plan-detail-div']" v-for="(prePlan,planIndex) in planList" :key='planIndex'>
                                <p>承保方案名称：<span>{{prePlan.planname}}</span><span class="no-print-show" v-if="prePlan.isprint == 0">不打印</span></p>
                                <p>首次投保人数 <el-input-number size="small" v-model="prePlan.insurenumber" @change="handleChange(planIndex)" :min="0"></el-input-number></p>
                                <p>保费小计：  {{prePlan.premium}}  人/元 ×  {{prePlan.insurenumber}}  人  = {{prePlan.planCalcFeeM | numFilterBefore()}}.<span class="fixed-two">{{prePlan.planCalcFeeM | numFilterAfter()}}</span> 元</p>
                            </div>
                        </div>
                    </div>
                    <p class="total-premium">保费合计：<span class="fixed-block">{{ PlanMoneyA() }}</span>.<span class="fixed-two">{{ PlanMoneyB() }}</span> 元</p>
                </div>
                <!-- 确认保险期间 -->
                <div class="information-content-part ">
                    <div class="information-content-plan-top">
                        <span>2、确认 保险期间  </span>
                    </div>
                    <div class="information-content-time">
                        <p>保期：{{guarantee()}}</p>
                        <p><span class="start-time">保险开始时间： </span><el-date-picker
                            v-model="insurstarttime"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy - MM - dd "
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions"
                            default-value
                            >
                            </el-date-picker></p>
                        <p>保险结束时间：<span class="deadline">{{calculDate()}} 24点 </span> （系统自动计算）</p>
                    </div>
                </div>
                <!-- 确认发票类型 -->
                <div class="information-content-part " v-show="!ifOverTwo">
                    <div class="information-content-plan-top">
                        <span>3、确认 发票类型 </span>
                    </div>
                    <div class="information-content-invoice">
                        <span>是否需要增值税专用发票</span>
                        <el-radio-group v-model="invoice" class="information-radio-group">
                            <el-radio label="1" border>需要</el-radio>
                            <el-radio label="0" border>不需要</el-radio>
                        </el-radio-group>
                        <p class="information-content-invoice-tip">“一般纳税人”投保的意外类、寿险类险种可开“增值税专用发票”，企业可以用来抵税，请与客户确认是否需要。<br>其他险种 或 小规模纳税人，系统统一开具“增值税普通发票”。</p>
                    </div>
                </div>
                <!-- 重要说明 -->
                <div class="important-note">
                    重要说明：
                    <p>1、人数是报价重要考虑因素，最终”首次投保人数“以审核后的名单为准，若其与询价时的“投保人数”差异较大，本次投保可能会重新报价。</p>
                    <p>2、“保险开始时间”需符合条件：不早于“保费到账”且“资料齐全”的次日。</p>
                    
                </div>
            </div>
            <!-- 底部按钮 -->
            <div class="footer-button" >
                <el-button @click="waiverModification">取消</el-button><el-button 
                @click="generateInfor"
                vkshop-event-name="生成投保资料" 
                vkshop-event-type="click" 
                v-loading="storageloading" 
                :disabled="storageloading"  
                element-loading-spinner="el-icon-loading"  
                element-loading-text="拼命生成中" 
                :class="{ loadingFont : storageloading}">生成投保资料</el-button>
            </div>
        </div>
        <!-- 切换报价弹框 -->
        <el-dialog title="切换报价" :visible.sync="dialogFormVisible">
            <div>
                <!-- 切换报价的内容 -->
                <div v-for="(item,index) in policys" :key="index" :label=item.proserialno 
                :class="[item.proserialno == proserialno ?'now-policy':'',item.proserialno == waitProserialno ?'wait-now-policy':'','pre-check-policy']" 
                @click="checkthis(item.proserialno)">
                    <p class="policy-no">询价号<span>{{item.proserialno}}</span></p>
                    <p>提交时间<span>{{item.createtime}}</span></p>
                    <p>报价有效期<span>{{item.loseefficacytime}}</span></p>
                    <p>计划数<span>{{item.planCount}}个</span></p>
                    <p>总保费<span>{{item.totalPremium}}元</span></p>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <p class="policy-num">共{{policys.length}}个有效报价</p>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="comfirmChangeCheck">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import enterpriseName from '../quotationProcess/processEnterpriseName.vue'
export default {
    name:'determineInformation',
    components:{enterpriseName},
    data(){
        return{
            // canshow:false,
            storageloading:false,//生成资料loading
            initLoading: true,
            ifOverTwo:'0',//是否超过20W保费
            dialogFormVisible:false,//是否展示切换
            waitProserialno:null,//需要切换的询价
            enterpriseCurName: localStorage.getItem('YF_mainstream_project'),//项目
            proserialno:'',//询价号
            subprojectid:'',//子项目编码
            subprojectName:null,//子项目名字
            insurstarttime:'',//保险开始时间
            insurendtime:'',//保险结束时间
            invoice:'0',//发票
            premiumsum:0,//合计保费
            createtime:'',
            loseefficacytime:'',
            planList:[],
            tempAllPlan:[],
            yfday:0,
            yfmonth:1,
            yfyear:0,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() || time.getTime() > Date.now() + 60 * 24 * 3600 * 1000;
                }
            },
            policys:[],
        }
    },
    created(){
        this.insurstarttime = this.convertToLateDate();
        this.subprojectid = this.$route.query != undefined ? this.$route.query.id : null;
        this.initFu();
    },
    methods:{
        //获取之前的选择的报价
        initFu: function(){
            // /index/queryInsureInfo
            this.$axios.get('/index/queryInsureInfo',{
                params:{
                    subprojectid: this.subprojectid,
                    random: new Date().getTime()
                }
            }).then(response=>{
                console.log(response)
                this.subprojectName = response.data.data.subproname;
                this.proserialno = response.data.data.proserialno;
                this.initInformation();//初始化询价单信息
                this.initLoading = false;
            })
        },
        //切换询价
        checkthis: function(value){
            if(value != this.proserialno){
                this.waitProserialno = value;
            }
        },
        // 初始化
        initInformation: function(){
            let that = this;
            Promise.all([
               this.getInquiryResult(),
               this.getInquiryPlan(),
               this.toGetSubpro()
            ]).then(resp=>{
                console.log('resp');
                console.log(resp);
                if(resp[0].code == 200 && resp[1].code == 200){//2个请求都好了
                    that.createtime = resp[0].data.createtime;
                    that.loseefficacytime = resp[0].data.loseefficacytime;
                    that.tempAllPlan = resp[1].data;
                    that.ifOverTwo = resp[2].data.totalPremium;
                    if(resp[2].data.totalPremium == 0){
                        that.invoice = '0'
                    }else{
                        that.invoice = '1'
                    }
                    that.calculationPremium(that.tempAllPlan);
                    // that.canshow = true;
                }
               
            })
        },
        //切换报价
        changeOffer: function(){
            this.$axios.get('/index/getEffectiveInquiry',{
                params:{
                    procode:localStorage.getItem('YF_mainstream_project_code'),
                    rand:new Date().getTime()
                }
            }).then(response => {
                if(response.data.code == 200){//成功请求
                    if(response.data.data.length != 0){//有子项目
                        this.policys = response.data.data;
                        this.dialogFormVisible = true;
                        console.log(this.policys);
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
        //确定切换询价
        comfirmChangeCheck: function(){
            this.$axios.post('/index/updateInquiry',{
                        subprojectid: this.subprojectid,
                        ordProserialno: this.proserialno,
                        newProserialno: this.waitProserialno,
                        random: new Date().getTime()
                }).then(response=>{
                   console.log(response);
                   if(response.data.code == 200){//切换成功
                        this.proserialno = response.data.data.proserialno;
                        this.waitProserialno = null;
                        this.initInformation();
                        this.dialogFormVisible = false;
                   }
                }).catch(error =>{
                   
                })
        },
        //取消定投保信息
        waiverModification: function () {
            this.$confirm('是否确定离开页面，放弃填写定投保信息？', '确认信息', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确定离开',
                cancelButtonText: '再看看'
            }).then(() => {
                this.$router.push({path:'/effectIndex'})
            }).catch(action => {});
        },
        //是否打印
        handleChange(planIndex) {
            this.calculationChangePremium(planIndex);
            if(this.planList[planIndex].insurenumber == 0){
                this.$confirm('该计划的首次投保人数为0，是否需在投保单上打印？。<br>（如果该计划后续需保全增人，请选择“打印”。）', '确认信息', {
                    confirmButtonText: '打印',
                    cancelButtonText: '不打印',
                    type: 'warning',
                    showClose:false,
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '打印!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '不打印'
                    }); 
                    this.$set(this.planList[planIndex],'isprint',0)          
                });
            }else{
                this.$set(this.planList[planIndex],'isprint',1)
            }
            console.log(this.planList[planIndex]);
        },
        //钱
        PlanMoneyA: function(){
            let m = 2,money = 0,planList = this.planList;
            planList.forEach(element => {
                // money+= Number((element.perMony).replace(".", "")) * Number(element.planNum) / Math.pow(10, m)
                money+= Number(element.planCalcFeeM);
            });
            this.premiumsum = money;
            return (money.toFixed(2).split('.'))[0]
        },
        //钱
        PlanMoneyB: function(){
            let m = 2,money = 0,planList = this.planList;
            planList.forEach(element => {
                // money+= Number((element.perMony).replace(".", "")) * Number(element.planNum) / Math.pow(10, m)
                money+= Number(element.planCalcFeeM);
            });
            return (money.toFixed(2).split('.'))[1]
        },
        //设置默认时间
        // 格式化时间，获取当前时间的一个月后的时间值
		convertToLateDate() {
            var data = new Date();
            var Da = new Date(data.getTime() + 24 * 60 * 60 * 1000 * 1);
            // 以上两行代码为关键代码，若想要返回一天后的时间，则可以将第二行代码更换为下面代码
            // var Da = new Date(data.getTime() + 24 * 60 * 60 * 1000);
            // 若是想要返回值为当前时间，则上面两行代码可以直接修改为下面代码即可。
            // var Da = new Date()
            var y = Da.getFullYear();
            var m = Da.getMonth() + 1;
            var d = Da.getDate();
            var H = Da.getHours();
            var mm = Da.getMinutes();
            m = m < 10 ? "0" + m : m;
            d = d < 10 ? "0" + d : d;
            H = H < 10 ? "0" + H : H;
            return y + "-" + m + "-" + d ;
		},
        //去看详情
        lookDetail: function(policyNo){
            console.log(policyNo);
            this.$router.push({path:'/quotationDetail',query:{id:policyNo,status:3}});
        },
        //获取需要展示的 核保意见
        getInquiryResult: function(){
            let that = this;
            return new Promise((resolve, reject) => {
                that.$axios.get('/index/getInquiryResult',{
                    params:{
                        proserialno: that.proserialno,
                        random: new Date().getTime()
                    }
                }).then(response=>{
                    resolve(response.data)
                }).catch(error =>{
                    reject(error)
                })
            })
        },
        //获取需要展示的 计划信息内容
        getInquiryPlan: function(){
            let that = this;
            return new Promise((resolve, reject) => {
                that.$axios.get('/index/getInquiryPlan',{
                    params:{
                        proserialno: that.proserialno,
                        random: new Date().getTime()
                    }
                }).then(response=>{
                    // if(response.data.code == 200){
                    //     // that.calculationPremium(response.data.data); //计算保费
                    // }
                    resolve(response.data)
                }).catch(error =>{
                    reject(error)
                })
            })
        },
        //变化过程中的保费
        calculationChangePremium: function (planIndex) {
             this.$set(this.planList[planIndex],'planCalcFeeM',(this.planList[planIndex].insurenumber*this.planList[planIndex].premium).toFixed(2))      
        },
        //初始化计算保费
        calculationPremium: function(param){
            let that = this;
            that.planList = [];
            param.forEach((current,index) => {
                let planHbFee = 0;
                let planCalcFee = 0;
                current.inquiryVoList.forEach((currentList,indexList)=>{
                    currentList.riskListVo.forEach((currentListVo,indexListVo)=>{
                        currentListVo.respList.forEach((currentListVoResp,indexListVoResp)=>{
                              planHbFee+=Number(currentListVoResp.hbamount == null?0:currentListVoResp.hbamount)
                        })
                    })
                })
                planCalcFee = (current.insurenum*planHbFee).toFixed(2);
                that.premiumsum += Number(planCalcFee);
                that.planList.push({
                    planname:current.ptype,
                    insurenumber:current.insurenum,
                    premium:planHbFee,
                    planCalcFeeM:planCalcFee,
                    isprint:1,
                })
                console.log(that.planList)
            });
        },
        //显示保障
        guarantee(){
            if(this.yfyear != 0 && this.yfyear != '' && this.yfyear != null){//选择的是年份
                return this.yfyear+'年';
            }else if(this.yfmonth != 0 && this.yfmonth != '' && this.yfmonth != null){//选择的是月份
                return this.yfmonth+'月';
            }else if(this.yfday != 0 && this.yfday != '' && this.yfday != null){//选择的是天数
                return this.yfday+'天';
            }else{
                this.yfmonth = 1;
                return this.yfmonth+'月';
            }
        },
        //提交定投保信息
        generateInfor: function(){
            let that = this;
            let param = {
                createtime : this.createtime,
                insurendtime: this.insurendtime+' 00:00:00',
                insurstarttime: this.insurstarttime+' 00:00:00',
                invoice: this.invoice,
                loseefficacytime: this.loseefficacytime,
                planList: this.planList,
                premiumsum: this.premiumsum,
                proserialno: this.proserialno,
                subprojectid: this.subprojectid,
                yfday:this.yfday,
                yfmonth:this.yfmonth,
                yfyear:this.yfyear
            }
            console.log(param)
            this.storageloading = true;
            this.$axios.post('/index/savePolicInfo',param).then(response=>{
                console.log(response)
                
                if(response.data.code == 200){
                    that.$router.push({path:'/determineFinish'})
                }else{
                    that.$alert('生成投保资料失败!'+response.data.msg,'失败',{
                        type:'error',
                        confirmButtonText:'确定',
                        callback: action=>{}
                    })
                }
                this.storageloading = false;
            })
        },
        //获取当下这个子项目的内容
        toGetSubpro: function(){
            let param ={
                id:this.subprojectid,
                rand:new Date().getTime()
            },that = this;
            return new Promise((resolve, reject) => {
                that.$axios.post('/index/getSubpro',that.$qs.stringify(param),{
                    'Content-Type':'application/json'
                }).then(response=>{
                    if(response.data.code == 200){
                        resolve(response.data);
                    }else{
                        //有问题
                    }
                })
            })
        },
        //算保障日期
        mGetDate: function(year, month){
            var d = new Date(year, month, 0);
            return d.getDate();
        },
        //看当前选择的月份和之后保障期的那个月份的天数，如果选择月的天数大于保障期的天数（不是2月），那么就要以保障期那个月的天数为准
        //否则就刚刚好
        calculDate: function(){
            let dt = new Date(this.insurstarttime),
                year = dt.getFullYear(),
                month = dt.getMonth(),
                day = dt.getDate(),
                dateTime='',y='',m='',d='',yyyy = '',mm ='', dd='';
            if(this.yfyear != 0 && this.yfyear != '' && this.yfyear != null){//如果是年4对应-5月 1对应2月
                let nowMonD = this.mGetDate(year,month+1);//当前日子假如28天
                let futMonD = this.mGetDate(year+1,month+1);//当前日子假如29天
                if(nowMonD > futMonD){//当前2月份日子大于明天2月份日子29 28
                    if(day == nowMonD){//选择的日期等于末日
                        // return (year+1) +"-"+(month+1)>9?(month+1):"0"+(month+1)+"-"+futMonD>9?futMonD:"0"+futMonD;
                        // dateTime = new Date(new Date((year+1) +"-"+(month+1) +"-"+futMonD).getTime() - 24 * 60 * 60 * 1000 * 1);
                        dateTime = new Date(new Date((year+1) +"-"+(month+1) +"-"+futMonD).getTime());
                    }else{//选择的日期不是末日
                        // return (year+1) +"-"+(month+1)>9?(month+1):"0"+(month+1)+"-"+day>9?day:"0"+day;//- 24 * 60 * 60 * 1000 * 1
                        dateTime = new Date(new Date((year+1) +"-"+(month+1) +"-"+day).getTime() );
                    }
                }else{//当前2月份日子小于明天2月份日子 28 29
                    if(day == nowMonD){//选择的日期等于末日
                        // return (year+1) +"-"+(month+1)>9?(month+1):"0"+(month+1)+"-"+futMonD>9?futMonD:"0"+futMonD;- 24 * 60 * 60 * 1000 * 1
                        dateTime = new Date(new Date((year+1) +"-"+(month+1) +"-"+nowMonD).getTime() );
                    }else{//选择的日期不是末日
                        // return (year+1) +"-"+(month+1)>9?(month+1):"0"+(month+1)+"-"+day>9?day:"0"+day;- 24 * 60 * 60 * 1000 * 1
                        dateTime = new Date(new Date((year+1) +"-"+(month+1) +"-"+day).getTime() );
                    }
                } 
            }else if(this.yfmonth != 0 && this.yfmonth != '' && this.yfmonth != null){//如果是月
                let nowMonDM = this.mGetDate(year,month+1);//当前日子假如28天
                let futMonDM = this.mGetDate(year,month+2);//当前日子假如29天
                if(nowMonDM > futMonDM){//当前2月份日子大于明天2月份日子29 28
                   if(day == nowMonDM){//选择的日期等于末日- 24 * 60 * 60 * 1000 * 1
                        dateTime = new Date(new Date(year +"-"+(month+2) +"-"+futMonDM).getTime() );
                    }else{//选择的日期不是末日- 24 * 60 * 60 * 1000 * 1
                        dateTime = new Date(new Date(year +"-"+(month+2) +"-"+day).getTime() );
                    }
                }else{//当前2月份日子小于明天2月份日子 28 29
                    if(day == nowMonDM){//选择的日期等于末日
                        // return year +"-"+((month+2)>9?(month+2):"0"+(month+2)) +"-"+(futMonD>9?futMonD:"0"+futMonD);- 24 * 60 * 60 * 1000 * 1
                        dateTime = new Date(new Date(year +"-"+(month+2) +"-"+futMonDM).getTime() );
                    }else{//选择的日期不是末日
                        // return year +"-"+((month+2)>9?(month+2):"0"+(month+2))+"-"+(day>9?day:"0"+day);- 24 * 60 * 60 * 1000 * 1
                        dateTime = new Date(new Date(year +"-"+(month+2) +"-"+day).getTime() );
                    }
                } 
            }else if(this.yfday != 0 && this.yfday != '' && this.yfday != null){//如果是天-1
                dateTime = new Date(new Date(this.insurstarttime).getTime() + (24 * 60 * 60 * 1000 * (this.yfday)));
            }
            y = dateTime.getFullYear();
            m = dateTime.getMonth()+1;
            d = dateTime.getDate();
            let bz = new Date(new Date(dateTime).getTime() + 24 * 60 * 60 * 1000 *1);
            yyyy = dateTime.getFullYear();
            mm = dateTime.getMonth()+1;
            dd = dateTime.getDate();
            this.insurendtime = yyyy +'-'+ (mm>9?mm:"0"+mm) +'-'+ (Number(dd)>9?Number(dd):"0"+Number(dd)) ;
            return (y +'-'+ (m>9?m:"0"+m) +'-'+ (d>9?d:"0"+d));
        }

    },
    filters:{
        numFilterAfter :function(value) {
            // 截取当前数据到小数点后两位
            let realValAfter = (value.toString().split('.'))[1] == undefined ? 0 : (value.toString().split('.'))[1];
            return realValAfter
        },
        numFilterBefore :function(value) {
            // 截取当前数据到小数点后两位
            let realValBefore = (value.toString().split('.'))[0] == undefined ? 0 : (value.toString().split('.'))[0];
            return realValBefore
        },
        filterTime: function (params) {
            return params.slice(0,-3)
        }
    }
}
</script>

<style lang="scss" scoped>
$fontSize-twelve: 12px;
$fontSize-thirteen: 13px;
$fontSize-fourteen: 14px;
.determine-information-content{
    padding: 60px 15px;
    font-size:$fontSize-thirteen;
}
.information-content-unit{
    padding: 15px 10px;
}
.information-content-part{
    background: #fff;
    border-radius: 5px;
    &:not(:first-child){
        margin-top: 15px;
    }
}
.information-content-plan{
    .information-content-plan-middle{
        .plan-top-inquiry{
            padding: 10px 15px;
        }
        p{
            padding: 2px 0;
        }
        .plan-middle-inquiryNo{
            .el-button{
                border: none;
                font-weight: 700;
                padding: 0;
                i{
                    font-weight: 700;
                }
            }
            
        }
        .plan-detail{
            margin-top: 10px;
            p{
                &:first-child{
                    span{
                        &:first-child{
                            font-weight: 700;
                        }
                    }
                }
                &:not(:first-child){
                    text-align: right;
                }
            }
        }
        .plan-detail-div{
            margin-top: 15px;
            margin: 0 5px;
            padding: 10px;
            border-radius: 5px;
        }
    }
    .total-premium{
        padding: 10px 15px;
        border-top: 1px solid #ededed;
        text-align: right;
    }
    .fixed-two{
        font-size: 10px;
    }
    .fixed-block{
        font-weight: 700;
    }
}
.information-content-plan-top{
        text-align: right;
        position: relative;
        padding: 10px 5px;
        .el-button{
            color: #64b4fc;
            border: none;
            padding: 5px 10px;
        }
        span{
            position: absolute;
            top: 10px;
            left: -7px;
            display: inline-block;
            background:linear-gradient(45deg, #FFAD86, #FF925D);
            padding: 3px 10px 3px 5px;
            border-top-right-radius: 20px;
            border-bottom-right-radius: 20px;
            color: #fff;
            font-size: 12px;
            &::before{
                content: "";
                position: absolute;
                left: 0;
                bottom: -20px;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                border-left: 10px solid #ac8978;
                border-right: 10px solid transparent;
                transform: rotate(90deg);
                z-index: -1;
            }
        }
}
.information-content-time{
    padding: 20px 15px;
    p{
        &:not(:first-child){
            padding-top: 10px;
        }
        .deadline{
            color: #999;
        }
    }
}
.information-content-invoice{
    padding: 20px 15px;
    span{
        margin-right: 10px;
    }
    .information-content-invoice-tip{
        color: #999;
        font-size: 12px;
        margin-top: 5px;
    }
}
.information-radio-group{
    .el-radio{
        margin-right: 0;
        padding: 10px 7px;
    }
}
.important-note{
    margin-top: 15px;
    display: block;
    padding: 4px 5px;
    border: 1px dotted #FFD95D;
    background: #FFBD5D;
    color: white;
    border-radius: 5px;
    p{
        text-indent: 2em;
        margin-top: 3px;
        line-height: 20px;
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
        min-width: 35%;
        height: 36px;
        background: #fff;
        border: none;
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
        background: #999;
        color: #666;
    }
}
.start-time{
    vertical-align: bottom;
    height: 40px;
    display: inline-block;
    line-height: 40px;
}
.tip-content{
    color: #999;
    padding-top: 4px;
}
.unit-mo{
    font-size: 14px;
    padding: 5px 2px;
    display: flex;
    span{
        &:first-child{
            width: 70px;
        }
        &:last-child{
            width: 100%;
            flex: 1;
        }
    }
}
.no-print{
    background: #ededed;
}
.no-print-show{
    background: red;
    color: white;
    border-radius: 5px;
    margin-left: 5px;
    padding: 2px 5px;
    font-size: 12px;
}
.pre-check-policy{
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
    padding: 19px 15px;
    position: relative;
    border: 1px solid #ededed;
    box-sizing: border-box;
    &:not(:first-child){
        margin-top: 15px;
    }
    p{
        line-height: 23px;
        span{
            float: right;
        }
    }
}
.pre-check-policy.now-policy{
    border: 1px solid #62b4ff;
    &::before{
        content: '当前';
        position: absolute;
        top: 0;
        left: 0;
        background: #62b4ff;
        color: white;
        font-size: 10px;
        padding: 2px 5px;
        border-bottom-right-radius: 5px;
    }
}
.pre-check-policy.wait-now-policy{
    border: 1px solid #FFD95D;
    &::before{
        content: '选中';
        position: absolute;
        top: 0;
        left: 0;
        background: #FFD95D;
        color: white;
        font-size: 10px;
        padding: 2px 5px;
        border-bottom-right-radius: 5px;
    }
}
.policy-num{
    font-size: 13px;
    float: left;
}
</style>
<style lang="scss">
.determine-information-page{
    
    .el-dialog{
        position: fixed;
        margin: 0 !important; 
        width: 100%;
        bottom: 0px;
        top: 10vh;
    }
    .el-dialog__body{
        height: 75%;
        overflow: scroll;
        padding: 10px 15px;
    }
    .el-dialog__header{
        padding: 15px 15px;
        font-size: 14px;
    }
    .initLoading{
        margin-top: 100px;
    }

    .el-hyq-loading {
        .el-loading-mask{
            .el-loading-text{
                font-size: 12px;
            }
            .el-loading-spinner {
                position: fixed;
                font-size: 21px;
            }
        }
    
    }
    .el-hyq-loading {
        .footer-button{
            .loadingFont {
                .el-loading-text{
                    font-size: 10px;
                }
                .el-loading-spinner {
                    margin-top: -15px;
                    position: absolute;
                    font-size: 12px;
                }
            }
        }
    }

}


</style>