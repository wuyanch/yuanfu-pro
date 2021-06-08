<template>
<!-- 完善企业信息 -->
    <div vkshop-event-scope="新建投保单-完善信息" class="cor-inform">
        <enterprise-name :enterpriseCurCall="enterpriseCurName"></enterprise-name>
        <div v-loading="initLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" class="el-hyq-loading">
            <div class="unit-form" v-show="!initLoading">
                <el-form :model="unitForm" ref="unitForm" :rules="rules">
                    <!-- 1、企业名字 -->
                    <div class="unit-part">
                        <p class="unit-part-title">01 投保单位</p>
                        <span class="tip tip-f">投保单位名称需与证件上的完整名称及公章一致。</span>
                        <p @click="toPopup" class="unit-mo-t" v-if="status == 0 || status == 2 "><span><i class="xin">*</i>投保单位名称：</span><span>{{unitForm.subproname}}</span></p>
                        <p @click="unitNameCant" class="unit-mo" v-else-if="status == 3 || status ==4 "><span><i class="xin">*</i>投保单位名称：</span><span>{{unitForm.subproname}}</span></p>
                        <el-form-item
                            prop="subproname"
                            label="投保单位名称"
                            v-else
                        >
                            <el-input v-model="unitForm.subproname" placeholder="请输入投保单位名称"  @focus.native="ifTip"></el-input>
                        </el-form-item>
                    </div>
                    <!-- 2、单位基本信息 -->
                <div class="unit-part unit-part-chara">
                    <p class="unit-part-title">02 单位基本信息</p>
                    <el-form-item label="证件类型" prop="companyCertificatesType">
                            <el-select v-model="unitForm.companyCertificatesType" placeholder="请选择证件类型">
                                <el-option v-for="(valueUnit,unitIndex) in unitCidType" :key="unitIndex" :label=valueUnit.label :value=valueUnit.value></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item
                            prop="companyCrtificatesCode"
                            label="证件号码"
                        >
                            <el-input v-model="unitForm.companyCrtificatesCode" placeholder="请输入证件号码"></el-input>
                        </el-form-item>

                        <el-form-item
                            label="注册地址"
                            prop="area"
                            required
                        >
                            <v-distpicker
                            :placeholders="unitForm.companyAddress" 
                            :province="defaultAddress.province" 
                            :city="defaultAddress.city"
                            :area="defaultAddress.area"
                            @selected="distpickerCheck">
                            </v-distpicker>
                        </el-form-item>

                        <el-form-item
                            prop="registerAddress"
                            label="注册详细地址"
                        >
                            <el-input type="textarea"  v-model="unitForm.registerAddress" placeholder="如：珠江东路6号周大福金融中心37楼"></el-input>
                        </el-form-item>

                        <el-form-item
                            prop="taxmark"
                            label="纳税人标识"
                            class="taxpayerId-f"
                        >
                            <el-radio-group v-model="unitForm.taxmark" class="group-tra">
                                <el-radio label="0" border>一般纳税人</el-radio>
                                <el-radio label="1" border>小规模纳税人</el-radio>
                            </el-radio-group>
                            
                        </el-form-item>
                        <div class="taxpayerId-from" v-if="unitForm.taxmark == '0' ">
                            <el-form-item
                                prop="taxbank"
                                label="①注册开户行"
                                :required="unitForm.taxmark == '0'? 'required': false"
                            >
                                <el-input v-model="unitForm.taxbank" placeholder="请输入注册开户行"></el-input>
                            </el-form-item>

                            <el-form-item
                                prop="taxphone"
                                label="②注册电话"
                                :required="unitForm.taxmark == '0'? 'required': false"
                            >
                                <el-input maxlength=12 type="tel" v-model="unitForm.taxphone" placeholder="请输入注册电话"></el-input>
                            </el-form-item>

                            <el-form-item
                                prop="taxAccountNumber"
                                label="③注册开户账号"
                                :required="unitForm.taxmark == '0'? 'required': false"
                            >
                                <el-input type="tel" v-model="unitForm.taxAccountNumber" placeholder="请输入注册开户账号"></el-input>
                            </el-form-item>
                        </div>
                        <el-divider class="divider-f"></el-divider>

                        <el-form-item label="单位性质" prop="unitNature" required>
                            <el-select v-model="unitForm.unitNature" placeholder="请选择单位性质">
                                <el-option v-for="(valueNature,unitNature) in unitNatureType" :key="unitNature" :label=valueNature.label :value=valueNature.value></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="行业类别" prop="industryType" required>
                            <el-select v-model="unitForm.industryType" placeholder="请选择行业类别">
                                <el-option v-for="(valueIndustry,unitIndustry) in unitIndustryType" :key="unitIndustry" :label=valueIndustry.label :value=valueIndustry.value></el-option>
                            </el-select>
                        </el-form-item>

                </div>
                    <!-- 3、经办人信息 -->
                <div class="unit-part unit-part-chara">
                    <p class="unit-part-title">03 经办人信息</p>
                    <span class="tip tip-f">请务必核对准确经办人手机号，后续流程需接收短信验证码</span>
                    <el-form-item
                            prop="agentPhone"
                            label="手机号"
                        >
                            <el-input maxlength=11 type="tel" v-model="unitForm.agentPhone" placeholder="请输入经办人手机号"></el-input>
                        </el-form-item>
                    <el-form-item
                            prop="agentName"
                            label="姓名"
                        >
                            <el-input v-model="unitForm.agentName" placeholder="请输入经办人姓名"></el-input>
                        </el-form-item>
                        
                    <el-form-item label="证件类型" prop="agentCertificatesType">
                            <el-select v-model="unitForm.agentCertificatesType" placeholder="请选择经办人证件类型">
                                <el-option label="身份证" value="0"></el-option>
                                <el-option label="护照" value="1"></el-option>
                                <el-option label="军官证" value="2"></el-option>
                                <el-option label="港澳同胞回乡证" value="d"></el-option>
                                <el-option label="台胞证" value="e"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            prop='agentCertificatesCode'
                            label="证件号码"
                            required
                        >
                            <el-input maxlength="18" v-model="unitForm.agentCertificatesCode" placeholder="请输入经办人证件号码"></el-input>
                        </el-form-item>

                        <el-form-item
                            prop="agentSex"
                            label="性别"
                            v-if="unitForm.agentCertificatesType != '0'"
                            :required = "unitForm.agentCertificatesType == '0'? false:true"
                        >
                            <el-radio-group v-model="unitForm.agentSex" >
                                <el-radio label="0" border>男</el-radio>
                                <el-radio label="1" border>女</el-radio>
                            </el-radio-group>
                        </el-form-item>

                    <el-form-item label="证件有效期" required class="Validity-f">
                            <el-radio-group @change="changeValidity('agentCertificatesValidity',unitForm.agentValidityIdType)" v-model="unitForm.agentValidityIdType" class="group-tra group-tra-f">
                                <el-radio label="0" border>非长期有效</el-radio>
                                <el-radio label="1" border>长期有效</el-radio>
                            </el-radio-group>
                            <el-form-item 
                                prop="agentCertificatesValidity" 
                                v-if="unitForm.agentValidityIdType == '0'"
                                :required = "unitForm.agentValidityIdType == '0'? true:false"
                            >
                                <el-date-picker type="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" placeholder="请选择证件有效期" v-model="unitForm.agentCertificatesValidity" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-form-item>

                </div>
                <!-- 4、该单位总保费是否达到20万 -->
                <div class="unit-part unit-part-chara unit-part-chara-f">
                    <p class="unit-part-title">04 保费规模</p>
                    <el-form-item
                            prop="totalPremium"
                            label="保费规模达到20万"
                            required
                        >
                            <el-radio-group v-model="unitForm.totalPremium" >
                                <el-radio label="1" border>是</el-radio>
                                <el-radio label="0" border>否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                </div>
                <!-- 5、 法定代表人/负责人信息 -->
                <div class="unit-part unit-part-chara" v-if="unitForm.totalPremium==1">
                    <p class="unit-part-title">05 法定代表人/负责人信息</p>
                    <span class="tip tip-f">根据监管机构的反洗钱规定，保费达到20万需要提供法定代表人/负责人的信息。</span>
                    <el-form-item
                            prop="legalPersonName"
                            label="姓名"
                            :required="unitForm.totalPremium =='1' ? 'required': false"
                        >
                            <el-input v-model="unitForm.legalPersonName" placeholder="请输入法定代表人/负责人姓名"></el-input>
                        </el-form-item>
                    
                        <el-form-item 
                        label="证件类型" 
                        prop="legalPersonCertificatesType"
                        :required="unitForm.totalPremium == '1'? 'required': false"
                        >
                            <el-select v-model="unitForm.legalPersonCertificatesType" placeholder="请选择法定代表人/负责人证件类型">
                                <el-option label="身份证" value="0"></el-option>
                                <el-option label="护照" value="1"></el-option>
                                <el-option label="军官证" value="2"></el-option>
                                <el-option label="港澳同胞回乡证" value="d"></el-option>
                                <el-option label="台胞证" value="e"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item
                            prop="legalPersonCertificatesCode"
                            label="证件号码"
                            :required="unitForm.totalPremium == '1'? 'required': false"
                        >
                            <el-input maxlength="18" v-model="unitForm.legalPersonCertificatesCode" placeholder="请输入法定代表人/负责人证件号码"></el-input>
                        </el-form-item>

                        <el-form-item 
                        prop="legalValidityIdType"
                        label="证件有效期" 
                        :required="unitForm.totalPremium == '1'? 'required': false"
                        class="Validity-f"
                        >
                            <el-radio-group @change="changeValidity('legalPersonCertificatesValidity',unitForm.legalValidityIdType)" v-model="unitForm.legalValidityIdType" class="group-tra group-tra-f">
                                <el-radio label="0" border>非长期有效</el-radio>
                                <el-radio label="1" border>长期有效</el-radio>
                            </el-radio-group>
                            <el-form-item 
                                prop="legalPersonCertificatesValidity" 
                                v-if="unitForm.legalValidityIdType == '0'"
                                :required = "unitForm.legalValidityIdType == '0'? true:false"
                            >
                                <el-date-picker type="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" placeholder="请选择证件有效期" v-model="unitForm.legalPersonCertificatesValidity" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-form-item>
                </div>
                </el-form>
            </div>
            <div class="footer-button" v-if="status== 3 || status== 4">
                <el-button 
                @click="waiverModification(status)">
                放弃修改</el-button>
                <el-button @click="submitForm('unitForm')"
                vkshop-event-name="修改企业信息" 
                vkshop-event-type="click" 
                v-loading="submitloading" 
                :disabled="submitloading"  
                element-loading-spinner="el-icon-loading"  
                element-loading-text="拼命修改中" 
                :class="{ loadingFont : submitloading}">
                    确认修改</el-button>
            </div>
            <div class="footer-button" v-else>
                <el-button @click="waiverModification(status)">取消</el-button><el-button 
                @click="tempSaveForm"
                vkshop-event-name="暂存" 
                vkshop-event-type="click" 
                v-loading="storageloading" 
                :disabled="storageloading"  
                element-loading-spinner="el-icon-loading"  
                element-loading-text="拼命暂存中" 
                :class="{ loadingFont : storageloading}">暂存</el-button><el-button type="primary" 
                @click="submitForm('unitForm')"
                vkshop-event-name="提交" 
                vkshop-event-type="click" 
                v-loading="submitloading" 
                :disabled="submitloading"  
                element-loading-spinner="el-icon-loading"  
                element-loading-text="拼命提交中" 
                :class="{ loadingFont : submitloading}">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import enterpriseName from '../quotationProcess/processEnterpriseName.vue'
import VDistpicker from 'v-distpicker'
export default {
    name:'corporateInformation',
    components:{enterpriseName,VDistpicker },
    data(){
        let validID=(rule,value,callback)=>{
            if(value==''||value==undefined){
                callback(new Error('请填写证件号码'))
            }else{
                if(this.unitForm[rule.field.slice(0,-6)+'Type'] == '0'){
                    //选择的是身份证
                    if(this.checkCode(value)) {
                        let date = value.substring(6,14);
                        if(this.checkDate(date)) {
                            if(this.checkProv(value.substring(0,2))) {
                                callback();
                            }else{
                                callback(new Error('身份证号码不正确'))
                            }
                        }else{
                            callback(new Error('身份证号码不正确'))
                        }
                    }else{
                        callback(new Error('身份证号码不正确'))
                    }
                }else{
                    //选择的不是身份证
                     callback()
                }
                
                
            }
            
        };
        let accountBankNumberBT=(rule,value,callback)=>{
             if(value==''||value==undefined){
                callback(new Error('请填写注册开户账号'))
            }else{
                callback()
            }
        };
        let accountBankNumberT=(rule,value,callback)=>{
             if(value==''||value==undefined){
                callback(new Error('请填写注册电话'))
            }else{
                let pattern= /^1[3456789]\d{9}$/;
                let patternG = /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/;
                if(pattern.test(value) || patternG.test(value)){
                    callback()
                }else{
                    callback(new Error('请填写正确的注册电话'))
                }
                
            }
        };
        let accountBankNumberB=(rule,value,callback)=>{
             if(value==''||value==undefined){
                callback(new Error('请填写注册开户行'))
            }else{
                callback()
            }
        };
        let validArea=(rule,value,callback)=>{
            if(value == undefined){
                callback(new Error('请选择注册地址'))
            }else{
                callback()
            }
        };
        return{
            initLoading:true,//初始化加载
            storageloading:false,//暂存loading
            submitloading:false,//提交
            enterpriseCurName: localStorage.getItem('YF_mainstream_project'),//项目
            defaultAddress:{province: '广东省',city:'广州市',area:''}, 
            checkedpolicy:null,//询价的有效报价
            status:null,//当前企业信息子项目的状态
            unitId:null,//当前企业信息子项目的id
            istoTip:true,
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
            unitForm: {
                subproname: '',//子项目名称
                companyCertificatesType: '01',//证件类型
                companyCrtificatesCode: null,//证件号码
                companyAddress: {
                    province: '------- 省 --------',
                    city: '--- 市 ---',
                    area: '--- 区 ---',
                },
                province: null,
                city: null,
                area: null,
                registerAddress:null,//注册地址
                taxmark: '0',//纳税标识
                taxbank: null,//纳税开户银行
                taxphone: null,//纳税注册电话
                taxAccountNumber: null,//纳税开户账号
                unitNature:null,//单位性质
                industryType:null,//行业类别
                agentCertificatesValidity:null,//经办人证件有效期
                agentValidityIdType:'0',//经办人证件类型是否长期有效
                agentCertificatesCode:null,//经办人证件号码
                agentCertificatesType:'0',//经办人证件类型
                agentPhone:null,//经办人手机号
                agentName:null,//经办人名字
                agentSex: null,//经办人性别
                totalPremium:'1',//总保费是否超过20万
                legalPersonCertificatesValidity:null,//负责人证件号码有效期
                legalPersonCertificatesCode:null,//负责人证件号码
                legalPersonCertificatesType:'0',//负责人的证件类型
                legalPersonName:null,//负责人名字
                legalValidityIdType:'0'//负责人选择的证件是否长期有效
            },
            nolegalInfo:{
                legalPersonCertificatesValidity:null,//负责人证件号码有效期
                legalPersonCertificatesCode:null,//负责人证件号码
                legalPersonCertificatesType:null,//负责人的证件类型
                legalPersonName:null,//负责人名字
                legalValidityIdType:null//负责人选择的证件是否长期有效
            },
            rules: {
                subproname: [
                    { required: true, message: '请输入投保单位名称', trigger: 'blur' }
                ],
                companyCertificatesType: [
                    { required: true, message: '证件类型', trigger: 'change' }
                ],
                companyCrtificatesCode: [
                    { required: true, message: '请填写证件号码', trigger: 'blur' },
                    { maxlength:18,  message: '不能超18个字符', trigger: 'blur' }
                ],
                // companyAddress:[{validator:validArea,trigger:'blur'}],
                area:[
                    { validator:validArea,trigger:'blur' }
                ],
                registerAddress:[
                    {required: true, message: '请填写注册详细地址', trigger: 'change'}
                ],
                taxmark: [
                    { required: true, message: '请选择纳税人标识', trigger: 'change' }
                ],
                taxAccountNumber:[
                    {validator:accountBankNumberBT,trigger:'blur'}
                ],
                taxbank:[
                    {validator:accountBankNumberB,trigger:'blur'}
                ],
                taxphone:[
                    {validator:accountBankNumberT,trigger:'blur'}
                ],
                agentCertificatesValidity: [
                    { required: true, message: '请选择证件有效期', trigger: 'blur' }
                ],
                agentCertificatesCode: [
                    {validator:validID,trigger:'blur'}
                ],
                agentCertificatesType: [
                    { required: true, message: '请选择证件类型', trigger: 'blur' }
                ],
                agentPhone:[
                    { required: true,message: '请填写手机号码', trigger: 'blur' },
                    { pattern: /^1[3456789]\d{9}$/, message: '请填写正确的手机号码', trigger: 'blur'}
                ],
                agentName:[
                    { required: true, message: '请填写经办人姓名', trigger: 'blur' },
                    { pattern:/^[A-Za-z\u4e00-\u9fa5-\u2E80-\uFE4F|.|·]+$/,message: '填写的姓名不符合规则',trigger:'change'}
                ],
                legalPersonCertificatesValidity: [
                    { required: true, message: '请选择证件有效期', trigger: 'blur' }
                ],
                legalPersonCertificatesCode: [
                    // { required: true, message: '请填写证件号码', trigger: 'blur' }
                     {validator:validID,trigger:'blur'}
                ],
                legalPersonCertificatesType: [
                    { required: true, message: '请选择证件类型', trigger: 'blur' }
                ],
                legalPersonName:[
                    { required: true, message: '请填写法定代表人/负责人姓名', trigger: 'blur' },
                    { pattern:/^[A-Za-z\u4e00-\u9fa5-\u2E80-\uFE4F|.|·]+$/, message: '填写的姓名不符合规则',trigger:'change'}
                ],
                unitNature:[
                    { required: true, message: '请选择单位性质', trigger: 'blur' }
                ],
                industryType:[
                    { required: true, message: '请选择行业类别', trigger: 'blur' }
                ],
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() ;
                }
            },
        }
    },
    created(){
        this.status =  this.$route.query != undefined ? this.$route.query.status : null;
        this.unitId =  this.$route.query != undefined ? this.$route.query.unitId : null;
        this.checkedpolicy = this.$route.query != undefined ? (this.$route.query.checkedpolicy != undefined ? this.$route.query.checkedpolicy:null ): null;
        console.log(this.status)
        this.getuser();//获取用户所在地
        this.getDictItemsA();//获取行业类别
        this.initGetSubpro();//初始化获取单位信息
        this.getsubpro();//获取有效报价
    },
    methods:{
        //获取用户所在地/index/queryUserLoginInfo
        getuser: function () {
            if(this.status !=3 && this.status != 4){
                this.$axios.post('/index/queryUserLoginInfo',{}).then(response=>{
                    if(response.data.code == 200){
                        console.log('获取用户所在地')
                        console.log(response)
                        this.defaultAddress.city = response.data.data.organization+'市';
                    }else{
                            this.defaultAddress.city = '广州市'
                    }
                })
            }
        },
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
        //获取询价流水号
        getsubpro: function () {
            if(this.checkedpolicy == null){
                this.$axios.get('/index/queryInsureInfo',{
                    params:{
                        subprojectid: this.unitId,
                        random: new Date().getTime()
                    }
                }).then(response=>{
                    console.log(response)
                    this.checkedpolicy = response.data.data.proserialno;
                })
            }
            
        },
        //初始化
        initGetSubpro: function(){
            if(this.unitId != null && this.unitId != ''){//是过来完善的
                let param ={
                    id:this.unitId,
                    rand:new Date().getTime()
                }
                this.$axios.post('/index/getSubpro',this.$qs.stringify(param),{
                    'Content-Type':'application/json'
                }).then(response=>{
                    console.log('获取单位信息数据');  
                    console.log(response)
                    let companyAddressI = {
                        province: '------- 省 --------',
                        city: '--- 市 ---',
                        area: '--- 区 ---',
                    },
                    legal = {
                        legalPersonCertificatesValidity:null,//负责人证件号码有效期
                        legalPersonCertificatesCode:null,//负责人证件号码
                        legalPersonCertificatesType:'0',//负责人的证件类型
                        legalPersonName:null,//负责人名字
                        legalValidityIdType:'0'//负责人选择的证件是否长期有效
                    };
                    //是否长期有效agentValidityIdType
                    if(response.data.data.agentCertificatesValidity == "9999-01-01"){//长期有效
                        response.data.data['agentValidityIdType'] = "1"
                    }else{
                        response.data.data['agentValidityIdType'] = "0"
                    }
                    if(response.data.data.totalPremium == 1){
                        if(response.data.data.legalPersonCertificatesValidity = '9999-01-01'){
                            response.data.data['legalValidityIdType'] = "1"
                        }else{
                            response.data.data['legalValidityIdType'] = "0"
                        }
                    }
                    this.defaultAddress = {
                        province: response.data.data.province?response.data.data.province:'广东省',
                        city: response.data.data.city?response.data.data.city:'广州市',
                        area: response.data.data.area?response.data.data.area:''
                    }
                    response.data.data.companyAddress = companyAddressI;
                    if(response.data.data.totalPremium == '0'){
                        response.data.data = {...response.data.data,...legal}
                        console.log("我是未到20W的")
                        console.log(response.data.data)
                    }
                    this.unitForm = response.data.data;
                    this.initLoading = !this.initLoading
                })
            }else{
                this.initLoading = !this.initLoading
            }
        },
        // 提交信息
        submitForm(formName) {
            let that = this, tipContent ='';
            this.$refs[formName].validate((valid) => {
                console.log(this.unitForm);
                if (valid) {
                    if(!this.checkCodeIfLong()){
                        this.$alert('经办人不满46周岁,身份证证件有效期不符合长期有效，请核对身份证件有效期');
                        return
                    }
                    if(!this.checklegalCodeIfLong()){
                        this.$alert('法定代表人/负责人不满46周岁,身份证证件有效期不符合长期有效，请核对身份证件有效期');
                        return
                    }
                    //校验通过之后
                    if(this.status != 3 && this.status != 4){
                        if(this.enterpriseCurName != this.unitForm.subproname){
                            tipContent = '投保单位名称：<span style="color:red;">'+ this.unitForm.subproname + '</span><br/>投保单位名称与 询价的项目( '+this.enterpriseCurName+' ) 名称不一致，请确认录入是否正确。<br/>若信息录入无误，将需 团核人员审核。<br/>请确认是否提交。'
                        }else{
                            tipContent = '投保单位名称：<span style="color:red;">'+ this.unitForm.subproname + '</span><br/>需与投保时提供的营业执照名称一致。<br/>成功创建后，将无法修改。<br/>请确认是否提交。'
                        }
                        
                    }else{
                        tipContent = '请问是否保存修改？'
                    }
                    this.$confirm(tipContent, '提示', {
                        confirmButtonText: '确认提交',
                        cancelButtonText: '放弃',
                        dangerouslyUseHTMLString: true
                    }).then(() => {
                        this.submitloading = true;
                        // status:0 -- 不需审核，创建成功   1--需要审核
                        that.unitForm.procode=localStorage.getItem('YF_mainstream_project_code');
                        that.unitForm.proserialno =this.checkedpolicy;
                        that.unitForm.rand=new Date().getTime();
                        if(that.unitForm.agentValidityIdType == 1){
                            that.unitForm.agentCertificatesValidity = '9999-01-01'
                        }
                        if(this.unitForm.totalPremium == 1){
                            if(this.unitForm.legalValidityIdType == "1"){
                                this.unitForm.legalPersonCertificatesValidity = '9999-01-01'
                            }
                        }
                        if(that.unitForm.totalPremium == '0'){
                            that.unitForm ={...that.unitForm, ...that.nolegalInfo}
                            console.log('测试对象合并')
                            console.log(that.unitForm)
                        }
                        console.log('提交数据'+this.unitForm)
                        that.$axios.post('/index/saveSubpro',that.unitForm).then(response=>{
                            console.log(response);  
                            if(response.data.code == 200){
                                if(that.status == 3 || that.status == 4){//即将前往完成页面
                                    that.$router.push({path:'/corporateFinish',query:{status:response.data.data.status,id:response.data.data.id,repair:1}})
                                }else{
                                    that.$router.push({path:'/corporateFinish',query:{status:response.data.data.status,id:response.data.data.id,repair:0}})
                                }
                                
                            }else{
                                // that.$message.error(response.data.msg);
                                that.$alert(response.data.msg)
                            }   
                            this.submitloading = false;
                            console.log('提交结束');  
                        })
                    }).catch(() => {
                                
                    });
                    console.log("已经通过校验了")
                } else {
                    this.$alert("填写的信息不全或者没校验通过，请检查数据",'温馨提示')
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //暂存信息
        tempSaveForm: function(){
            if(this.unitForm.subproname == ''){
                this.$alert("请填写投保单位名称再暂存",'温馨提示')
            }else{
                if(this.unitForm.agentValidityIdType == "1"){
                    this.unitForm.agentCertificatesValidity = '9999-01-01'
                }
                if(this.unitForm.totalPremium == 1){
                    if(this.unitForm.legalValidityIdType == "1"){
                        this.unitForm.legalPersonCertificatesValidity = '9999-01-01'
                    }
                }
                this.unitForm.proserialno =this.checkedpolicy;
                this.unitForm.procode=localStorage.getItem('YF_mainstream_project_code');
                this.unitForm.status = this.status?this.status:0;//暂存
                this.unitForm.rand=new Date().getTime();
                if(this.unitForm.totalPremium == '0'){
                    this.unitForm ={...this.unitForm, ...this.nolegalInfo}
                    console.log('测试对象合并')
                    console.log(this.unitForm)
                }
                this.storageloading = true;
                this.$axios.post('/index/tempSaveSubpro',this.unitForm,{
                    'Content-Type':'application/json'
                }).then(response=>{
                    console.log('暂存数据'+response);  
                    if(response.data.code == 200){   
                        this.$message({
                            message: '恭喜你，暂存成功',
                            type: 'success'
                        }); 
                    }else{
                        this.$alert(response.data.msg)
                    }   
                    console.log('暂存结束'); 
                    this.storageloading = false; 
                })
            }
        },
        //取消修改或者取消填写
        waiverModification: function (status) {
            let tipHtml = '';
            if(status == 3 || status == 4){
                tipHtml = '是否确定离开页面，放弃修改信息？'
            }else{
                tipHtml = '是否确定离开页面？离开前若没有暂存当前信息，信息将不被保留。'
            }
            this.$confirm(tipHtml, '确认信息', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确定离开',
                cancelButtonText: '再看看'
            }).then(() => {
                this.$router.push({path:'/effectIndex'})
            }).catch(action => {});
        },
        // 当前企业单位不可改动
        unitNameCant: function(){
            this.$alert('当前投保单位名称不可改动','温馨提示',{
                confirmButtonText:'知道了'
            }).then({})
        },
        //监听子项目名字
        ifTip: function(){
            let that = this;
            if((this.status == 0 || this.status == 2) && this.istoTip){
                this.$alert('如果录入的“投保单位名称”与 询价的项目名称不一致，提交后，要 团核人员 审核。','提醒',{
                    confirmButtonText:'确定',
                    callback: action => {
                        that.istoTip = false;
                    }
                })
            }
        },
        // 城市联动
        distpickerCheck: function (data) {
            console.log('我是城市联动')
            // this.unitForm.companyAddress = data;
            this.unitForm.province = data.province.value;
            this.unitForm.city = data.city.value;
            this.unitForm.area = data.area.value;
            console.log(data.province.code + ' | ' + data.city.code + ' | ' + data.area.code )
            this.$refs.unitForm.validateField('area')
            return data.area.code;
        },
        //身份证校验
        //身份证--省级校验
       checkProv: function (val) {
            var pattern = /^[1-9][0-9]/;
            var provs = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门"};
            if(pattern.test(val)) {
                if(provs[val]) {
                    return true;
                }
            }
            return false;
        },
        //身份证--生日校验
        checkDate: function (val) {
            var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
            if(pattern.test(val)) {
                var year = val.substring(0, 4);
                var month = val.substring(4, 6);
                var date = val.substring(6, 8);
                var date2 = new Date(year+"-"+month+"-"+date);
                if(date2 && date2.getMonth() == (parseInt(month) - 1)) {
                    return true;
                }
            }
            return false;
        },
        //身份证--后四位
        checkCode: function (val) {
            var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var code = val.substring(17);
            if(p.test(val)) {
                var sum = 0;
                for(var i=0;i<17;i++) {
                    sum += val[i]*factor[i];
                }
                if(parity[sum % 11] == code.toUpperCase()) {
                    return true;
                }
            }
            return false;
        },
        //暂存或者审核不通过时，修改名字的弹框
        toPopup: function(){
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
            title: '修改投保单位名称',
            message: h('p', null, [
                h('p',{style: 'color: #07488b;font-size: 12px;background: #ededed;padding: 5px;border-radius: 5px;margin-bottom: 15px;line-height: 18px;'},'提醒：如果录入的“投保单位名称”与 询价的项目名称不一致，提交后，要 团核人员 审核。'),
                h('p', null, '当前投保单位名称： '+this.unitForm.subproname),
                h('span', null, '投保单位名称： '),
            ]),
            showInput:true,
            showClose:false,
            showCancelButton: true,
            confirmButtonText: '确认修改',
            cancelButtonText: '放弃修改',
            inputErrorMessage: '',
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    console.log(instance.inputValue)
                    if(instance.inputValue == that.unitForm.subproname){
                        this.$message.error('当前输入的投保单位名称与当前的投保单位名称一致，不可修改');
                        done();
                        instance.confirmButtonLoading = false;
                        instance.confirmButtonText = '确认修改';
                    }else{
                        let updateParam = {
                            name: that.unitForm.subproname,
                            newname: instance.inputValue,
                            procode: localStorage.getItem('YF_mainstream_project_code').toString(),
                            rand: new Date().getTime()
                        }
                        that.$axios.post('/index/updateSubproName',that.$qs.stringify(updateParam)).then(resp=>{
                            console.log(resp)
                            if(resp.data.code == 200){
                                this.$message({
                                    message: '已修改',
                                    type: 'success'
                                });
                                that.unitForm.subproname = instance.inputValue;
                                done();
                                instance.confirmButtonLoading = false;
                                instance.confirmButtonText = '确认修改';
                            }else{
                                this.$alert(resp.data.msg)
                                instance.confirmButtonLoading = false;
                                instance.confirmButtonText = '确认修改';
                            }
                        })
                    }
                    
                } else {
                    done();
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = '确认修改';
                }
            }
            }).then(action => {
                done();
                instance.confirmButtonLoading = false;
                instance.confirmButtonText = '确认修改';
            }).catch(()=>{
                
            })
        },
        //校验经办人身份证有效期是否为长期
        checkCodeIfLong(){
            if(this.unitForm.agentCertificatesType == '0'){//如果证件类型是身份证，检测是否长期有效
                if(this.unitForm.agentCertificatesCode != null){
                    let year = this.unitForm.agentCertificatesCode.slice(7,11);
                    let nowYear = (new Date()).getFullYear();
                    if((nowYear-year) < 45){
                        if(this.unitForm.agentValidityIdType=='1'){//不满46周岁但又选择了长期有效
                            return false;
                        }else{
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
            }else{
                return true;
            }
        },
        //校验责任人身份证有效期是否为长期
        checklegalCodeIfLong(){
            if(this.unitForm.totalPremium == '1' && this.unitForm.legalPersonCertificatesType == '0'){//如果证件类型是身份证，检测是否长期有效
                if(this.unitForm.legalPersonCertificatesCode != null){
                    let year = this.unitForm.legalPersonCertificatesCode.slice(7,11);
                    let nowYear = (new Date()).getFullYear();
                    if((nowYear-year) < 45){
                        if(this.unitForm.legalValidityIdType=='1'){//不满46周岁但又选择了长期有效
                            return false;
                        }else{
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
            }else{
                return true
            }
        },
        //改变身份证的有效期
        changeValidity(valueName,value){//0-非长期 1-长期
            console.log('改变身份证的有效期')
            console.log(valueName,value)
            if(value == '0'){
                this.unitForm[valueName] = null;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.unit-form{
    padding: 60px 15px 100px 15px;
}
.tip{
    font-size: 12px;
    color: #929292;
}
.unit-mo{
    font-size: 14px;
    padding: 5px 2px;
    display: flex;
    span{
        &:first-child{
            width: 120px;
        }
        &:last-child{
            width: 100%;
            flex: 1;
            color: #999;
        }
    }
}
.unit-part{
    background: #fff;
    padding: 30px 10px 5px 10px;
    border-radius: 5px;
    position: relative;
    &:not(:first-child){
        margin-top: 18px;
    }
    .unit-part-title{
        position: absolute;
        top: 7px;
        left: -4px;
        display: inline-block;
        background:linear-gradient(45deg, #FFAD86, #FF925D);;
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

.unit-part>.el-form-item, 
.taxpayerId-from>.el-form-item{
    border: none;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom: 1px solid #c6c9d5;
}

.el-radio-group{
    label{
        margin: 6px 0;
        &:not(:first-child){
            margin-left: 10px;
        }
    }
    
}
.tip-f{
    display: block;
    line-height: 20px;
    padding: 4px 5px;
    margin: 4px 0 10px 0;
    border: 1px dotted #FFD95D;
    background: #FFBD5D;
    color: white;
    border-radius: 5px;
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
        width: 30%;
        height: 36px;
        background: #fff;
        border: none;
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
.Validity-f.el-form-item{
    border: none;
    .el-input{
        border: 1px solid #ededed;
        border-radius: 5px;
    }
}
.taxpayerId-from{
    position: relative;
    .el-form-item{
        &:last-child{
            margin-bottom: 0;
            border: none;
        }
    }
    &::before{ 
        content: "";
        position: absolute;
        width: 15px;
        height: 15px;
        border-left: 1px solid #ddd;
        border-top: 1px solid #ddd;
        transform: rotate(45deg);
        left: 50%;
        top: -9px;
        z-index: 1;
        background: #fff;
    }
}
.divider-f{
    margin: 6px 0;
    border-top:1px solid#c6c9d5;
    height: 1px;
    background: inherit;
}
.unit-mo-t{
    font-size: 0;
    span{
        font-size: 14px;
        &:last-child{
            padding: 4px 5px 5px 10px;
            display: block;
            border-bottom: 1px solid #d3d5df;
        }
    }
}
.xin{
    color: #f58081;
    padding: 0 2px;
    text-align: left;
    display: inline-block;
    font-style: normal;
}

</style>

<style lang="scss">
.distpicker-address-wrapper {
    position: absolute;
    font-size: 0;
    height: 100%;
    overflow: hidden;
    select{
        width: 33.3%;
        padding-left: 3px;
        border: none;
        font-size: 12px;
        padding: 0;
        padding-left: 5px;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background: #fff;
        border-radius: 0;
        &:focus { outline: none; }
        option{
            padding: 0px 4px 1px;
        }
    }
    label{
        position: relative;
        &::after{
            content: ">";
            position: absolute;
            width: 10px;
            height: 10px;
            font-size: 12PX;
            z-index: 99;
            right: -15px;
            transform: rotate(90deg) scaleY(1.4) scaleX(.9);
            bottom: -2px;
            color: #d7d9e1;
            font-stretch: initial;
        }
    }
}
.unit-part{
    .el-input__inner{
        border: none;
    }
    textarea{
        border: none;
        padding-left: 0;
        padding-right: 0;
    }
}

.unit-part-chara{
    .el-form-item{
        display: flex;
        .el-form-item__label{
            width: 155px;
            text-align: left;
        }
        .el-form-item__content{
            width: 100%;
            .el-button,.el-select{
                width: 100%;
            }
            .el-button{
                border: none;
            }
        }
        .el-radio-group.group-tra{
            .el-radio.is-bordered{
                padding-left: 2px;
                padding-right: 1px;
            }
            .el-radio.is-bordered+.el-radio.is-bordered{
                margin-left: 2px;
            }
        }
        .el-radio-group.group-tra-f{
            .el-radio.is-bordered{
                padding-left: 4px;
                padding-right: 4px;
            }
            .el-radio.is-bordered+.el-radio.is-bordered{
                margin-left: 7px;
            }
        }
    }
    
}
.unit-part > .el-form-item.taxpayerId-f{
       border: none;
}
.unit-part.unit-part-chara-f{
    .el-form-item{
        border: none;
        .el-form-item__label{
            width: 240px;
        }
        .el-radio-group{
            width: 100%;
            text-align: left;
            label{
                margin:  0 10px;
            }
        }
    }
}
.el-select--medium,.el-input__inner{
    vertical-align: bottom !important;
}

.taxpayerId-from{
    width: 95%;
    margin: 0 auto;
    border: 1px solid #ddd;
    top: -15px;
    .el-form-item{
        .el-form-item__label{
            width: 195px;
            padding-right: 3px;
        }
        .el-input__inner{
            padding-left: 2px;
            padding-right: 2px;
        }
    }
}
.el-message-box__input{
    padding-top: 5px  !important;
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



</style>