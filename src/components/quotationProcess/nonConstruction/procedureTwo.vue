<template>
    <div class="procedure-two" vkshop-event-scope="非建工险-配置责任(2)" v-loading = "padeLoading">
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

        <!-- 配置责任 -->
        <div class="configuration-responsibility">
            <div class="configuration-responsibility-box">
                <!-- 单独一个计划-开始 -->
                <div class="responsibility-part" v-for="(item,index) in configurationResponsibility.domains" :key="item.planName">
                    <!-- 表头-计划几 -->
                    <div class="procedure-corner-mark"><span> 计划{{index+1}}({{item.planName}}) </span></div>
                    <!-- 可展开收起块 -->
                    <div v-if="dynamicValidateFormOpen[index].open">
                        <!-- 主体配置内容-块 -->
                        <div class="responsibility-part-content" v-for="(responsibilityItem,index1) in item.data" :key="index1">
                            <p class="content-title"><span>{{responsibilityItem.risktype}}</span></p>
                            <div class="content-clause" ref="touchmove" v-leftMove="{container: '[data-touchmove-con]'}" v-for="(allresponsibilityItem,index2) in responsibilityItem.responsibilityData" :key="allresponsibilityItem.responsibilityNameCode">
                                <!-- <i v-if="allresponsibilityItem.ifMainInsurance == true"><img :src="allresponsibilityItem.ifMainInsurance == true?zhu:fu" alt=""></i>
                                <i v-else><img :src="fu" alt=""></i> -->
                               <div :class="allresponsibilityItem.ifOffShelf? 'need-remove-riskcode':''" >
                                    <p v-if="allresponsibilityItem.ifOffShelf" :class="allresponsibilityItem.ifOffShelf ? 'need-remove-content':''">
                                       已下架，需左滑删除<span v-show="allresponsibilityItem.riskReplace != null"> （推荐替换成{{allresponsibilityItem.riskReplace}}）</span>
                                    </p>
                                    <i><img :src="allresponsibilityItem.ifMainInsurance == true ? zhu:fu" alt="" /></i>
                                    <span class="content-clause-name" @click="lookResponsibility(allresponsibilityItem.responsibilityNameCode)">{{allresponsibilityItem.riskshort}}<i class="el-icon-warning-outline"></i></span>
                                    <!-- 如果没有子责任 -->
                                    <div class="content-clause-mony" v-if="allresponsibilityItem.subResponsibilityData == null">
                                        <span>保额({{allresponsibilityItem.insuredUnit}})</span>
                                        <el-input-number
                                        type='number'
                                        :min=0.1 
                                        size="small"
                                        @focus="handleFocus" 
                                        @blur="handleblur"
                                        @change="checkNo(index,index1,index2,null)"
                                        v-model.trim="allresponsibilityItem.trueConfigurationStep" 
                                        :step="allresponsibilityItem.defaultConfigurationStep">
                                        </el-input-number>
                                    </div>
                                    <!-- 如果有子责任 -->
                                    <div class="content-clause-mony" v-else v-show="allresponsibilityItem.responsibilityNameCode == 110">
                                            <span v-if="allresponsibilityItem.responsibilityNameCode == 110">门诊、住院是否共用额度</span>
                                            <el-switch
                                            v-if="allresponsibilityItem.responsibilityNameCode == 110"
                                            v-model="allresponsibilityItem.ifDefaultConfiguration"
                                            active-color="#6db9fe"
                                            inactive-color="#d4d4d4"
                                            >
                                            </el-switch>
                                    </div>
                                    <!-- 如果是110险种 -->
                                    <div class="yl-comm" v-if="allresponsibilityItem.responsibilityNameCode == 110 && allresponsibilityItem.ifDefaultConfiguration == true">
                                        <p v-if="allresponsibilityItem.subResponsibilityData[0].trueConfigurationStep > allresponsibilityItem.subResponsibilityData[1].trueConfigurationStep">共用额度：{{allresponsibilityItem.subResponsibilityData[0].trueConfigurationStep}}万元</p>
                                        <p v-else>共用额度：{{allresponsibilityItem.subResponsibilityData[1].trueConfigurationStep}}万元</p>
                                    </div>
                                    <!-- 如果有子责任且险种代码不为573 || 580 -->
                                    <div class="sub-responsibility clear-self" v-if="allresponsibilityItem.responsibilityNameCode !='573' && allresponsibilityItem.responsibilityNameCode !='580'">
                                        <div class="content-clause" v-for="(subresponsibilityItem,index3) in allresponsibilityItem.subResponsibilityData" :key="index3">
                                            <span class="content-clause-name">{{subresponsibilityItem.subResponsibilityName}}</span>
                                            <span>配置本项</span>
                                            <el-switch
                                            v-model="subresponsibilityItem.subIfDefaultConfiguration"
                                            active-color="#6db9fe"
                                            inactive-color="#d4d4d4"
                                            @change='changeStatus($event,index3,index2,index1,index,allresponsibilityItem.responsibilityNameCode)'>
                                            </el-switch>
                                            <div class="content-clause-mony" v-if="subresponsibilityItem.subIfDefaultConfiguration == true">
                                                <span>保额({{subresponsibilityItem.insuredUnit}})</span>
                                                <el-input-number 
                                                type='number'
                                                :min=0.1
                                                size="small" 
                                                @focus="handleFocus" 
                                                @blur="handleblur"
                                                @change="checkNo(index,index1,index2,index3)" 
                                                v-model.trim="subresponsibilityItem.trueConfigurationStep" 
                                                :step="subresponsibilityItem.subDefaultConfigurationStep==null||subresponsibilityItem.subDefaultConfigurationStep==0?1:subresponsibilityItem.subDefaultConfigurationStep">
                                                </el-input-number>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 如果有子责任且险种代码为573 || 580 -->
                                     <div class="sub-responsibility clear-self" v-else>
                                        <div class="content-clause" v-for="(subresponsibilityItem,index3) in allresponsibilityItem.subResponsibilityData" :key="index3">
                                            <span class="content-clause-name">{{subresponsibilityItem.subResponsibilityName}}</span>
                                            <span>配置本项</span>
                                            <el-switch
                                            v-model="subresponsibilityItem.subIfDefaultConfiguration"
                                            active-color="#6db9fe"
                                            inactive-color="#d4d4d4"
                                            @change='changeStatus($event,index3,index2,index1,index,allresponsibilityItem.responsibilityNameCode)'>
                                            </el-switch>
                                            <div v-if="subresponsibilityItem.subResponsibilityNameCode=='573001' || subresponsibilityItem.subResponsibilityNameCode=='580001'">
                                                <div class="content-clause-mony" v-if="subresponsibilityItem.subIfDefaultConfiguration == true">
                                                    <span>保额({{subresponsibilityItem.insuredUnit}})</span>
                                                    <el-input-number 
                                                    type='number'
                                                    :min=0.1
                                                    size="small" 
                                                    @focus="handleFocus" 
                                                    @blur="handleblur"
                                                    @change="checkNo(index,index1,index2,index3)" 
                                                    v-model.trim="subresponsibilityItem.trueConfigurationStep" 
                                                    :step="subresponsibilityItem.subDefaultConfigurationStep==null||subresponsibilityItem.subDefaultConfigurationStep==0?1:subresponsibilityItem.subDefaultConfigurationStep">
                                                    </el-input-number>
                                                </div>
                                            </div>
                                            <div v-else-if="subresponsibilityItem.subResponsibilityNameCode=='573002'">
                                                <div class="content-clause-mony" v-if="subresponsibilityItem.subIfDefaultConfiguration == true">
                                                    <span>保额({{subresponsibilityItem.insuredUnit}})</span>
                                                    <el-input-number 
                                                    type='number'
                                                    :min=0.1
                                                    :max=Number(((allresponsibilityItem.subResponsibilityData[0].trueConfigurationStep)*0.3).toFixed(2))
                                                    size="small" 
                                                    @focus="handleFocus" 
                                                    @blur="handleblur"
                                                    @change="checkNo(index,index1,index2,index3)" 
                                                    v-model.trim="subresponsibilityItem.trueConfigurationStep" 
                                                    :step="subresponsibilityItem.subDefaultConfigurationStep==null||subresponsibilityItem.subDefaultConfigurationStep==0?1:subresponsibilityItem.subDefaultConfigurationStep">
                                                    </el-input-number>
                                                </div>
                                            </div>
                                         
                                            <div v-else-if="subresponsibilityItem.subResponsibilityNameCode=='580002'">
                                                <div class="content-clause-mony" v-if="subresponsibilityItem.subIfDefaultConfiguration == true">
                                                    <span>保额({{subresponsibilityItem.insuredUnit}})</span>
                                                    <el-input-number 
                                                    type='number'
                                                    :min=0.1
                                                    :max="(allresponsibilityItem.subResponsibilityData[0].trueConfigurationStep)*1"
                                                    size="small" 
                                                    @focus="handleFocus" 
                                                    @blur="handleblur"
                                                    @change="checkNo(index,index1,index2,index3)" 
                                                    v-model.trim="subresponsibilityItem.trueConfigurationStep" 
                                                    :step="subresponsibilityItem.subDefaultConfigurationStep==null||subresponsibilityItem.subDefaultConfigurationStep==0?1:subresponsibilityItem.subDefaultConfigurationStep">
                                                    </el-input-number>
                                                </div>
                                            </div>
                                            <div v-else-if="subresponsibilityItem.subResponsibilityNameCode=='580003'">
                                                <div class="content-clause-mony" v-if="subresponsibilityItem.subIfDefaultConfiguration == true">
                                                    <span>保额({{subresponsibilityItem.insuredUnit}})</span>
                                                    <el-input-number 
                                                    type='number'
                                                    :min=0.1
                                                    :max=Number(((allresponsibilityItem.subResponsibilityData[0].trueConfigurationStep)*0.2).toFixed(2))
                                                    size="small" 
                                                    @focus="handleFocus" 
                                                    @blur="handleblur"
                                                    @change="checkNo(index,index1,index2,index3)" 
                                                    v-model.trim="subresponsibilityItem.trueConfigurationStep" 
                                                    :step="subresponsibilityItem.subDefaultConfigurationStep==null||subresponsibilityItem.subDefaultConfigurationStep==0?1:subresponsibilityItem.subDefaultConfigurationStep">
                                                    </el-input-number>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <div class="content-clause-mony" v-if="subresponsibilityItem.subIfDefaultConfiguration == true">
                                                    <span>保额({{subresponsibilityItem.insuredUnit}})</span>
                                                    <el-input-number 
                                                    type='number'
                                                    :min=0.1
                                                    :max=Number(((allresponsibilityItem.subResponsibilityData[0].trueConfigurationStep)*0.5).toFixed(2))
                                                    size="small" 
                                                    @focus="handleFocus" 
                                                    @blur="handleblur"
                                                    @change="checkNo(index,index1,index2,index3)" 
                                                    v-model.trim="subresponsibilityItem.trueConfigurationStep" 
                                                    :step="subresponsibilityItem.subDefaultConfigurationStep==null||subresponsibilityItem.subDefaultConfigurationStep==0?1:subresponsibilityItem.subDefaultConfigurationStep">
                                                    </el-input-number>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>

                                    <div class="delete_item" @click="deleteItem(index,index1,index2)">
                                        <span><i class="el-icon-delete"></i></span>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <!-- 复制，添加按钮 -->
                        <p class="tip-move"><span style="color:red">*</span>左滑险种可以删除</p>
                        <div class="button-btn">
                            <button @click="checkReplicate(index)" vkshop-event-name="复制本计划至其他计划" vkshop-event-type="click">复制本计划至其他计划</button><button @click="addResponsibility(index)"  vkshop-event-name="添加其他险种责任" vkshop-event-type="click"><i class="el-icon-plus"></i>添加其他险种责任</button>
                        </div>
                    </div>
                    <!-- 可收起展开块 -->
                    <!-- 展开收起按钮 -->
                    <div class="if-open">
                        <el-button  @click="changeBlock(index)"><i class="el-icon-arrow-up" v-if="dynamicValidateFormOpen[index].open"></i><i class="el-icon-arrow-down" v-else></i></el-button>
                    </div>
                </div>
            <!-- 单独一个计划-结束 -->
            </div>
        </div>

        <!-- 弹框显示可添加的险种 -->
        <el-dialog
        title="请选择需要添加的险种责任"
        :visible.sync="responsibilityDialogVisible"
        width="100%"
        center
        class="pDialog">
        <div v-if="responsibilityList.allresponsibilityData.length != 0">
            <div v-for="(item,index0) in responsibilityList.allresponsibilityData" :key="index0" >
                <p class="content-title"><span>{{item.risktype}}</span></p>
                <ul>
                    <li v-for="(subResponsibilityList,index3) in item.responsibilityData" :key="index3"  @click.stop="addResponsibilityNow(index0,index3)" >
                        <div class="content-clause">
                            <i v-if="subResponsibilityList.ifMainInsurance == true"><img :src="zhu" alt=""></i>
                            <i v-else><img :src="fu" alt=""></i>
                            <span class="content-clause-name">{{subResponsibilityList.riskshort}}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else>
            <p style="text-align:center">该计划已经没有可以添加的险种责任了</p>
        </div>

        </el-dialog>

        <!-- 弹框显示可添复制的计划 -->
        <el-dialog
        :visible.sync="replicatedScheduleDialogVisible"
        width="100%"
        center
        :show-close=false
        class="pDialog">
        <p slot="title" class="dialog-title">复制<span style="color:#fd8423">计划{{this.currentNeedAddResponsibility+1}}({{this.planNameT[this.currentNeedAddResponsibility]}})</span>至以下计划：</p>
            <div>
                 <el-checkbox-group v-model="replicatedGroup" size="medium">
                    <div v-for="(item,index) in planNameT" :key="index">
                        <el-checkbox  :label="index" border v-if="index == currentNeedAddResponsibility" disabled>计划{{index+1}}({{item}})</el-checkbox>
                        <el-checkbox  :label="index" border v-else>计划{{index+1}}({{item}})</el-checkbox>
                   </div>
                </el-checkbox-group>
            </div>

            <span slot="footer" class="dialog-footer">
                <p class="tip"><span class="tip-red">*</span> 即以上选中的计划，其责任<span class="tip-red">（有什么险种责任、保额分别是多少）</span>全部改成跟<span style="color:#fd8423">计划{{this.currentNeedAddResponsibility+1}}({{this.planNameT[this.currentNeedAddResponsibility]}})</span>一样。</p>
                <el-button @click="replicatedScheduleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="replicatedOk">确 认 复 制</el-button>
            </span>
        </el-dialog>

         <!-- 险种对话框 -->
        <el-dialog
        :visible.sync="insuranceDialogVisible"
        width="100%"
        class="pDialog_p">
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

        <!-- 底部按钮  -->
        <div class="procedure-btn" >
            <button @click="goHome" vkshop-event-name="返回主页" vkshop-event-type="click">返回主页</button><button @click="goPrev" vkshop-event-name="上一步" vkshop-event-type="click">上一步</button><button @click="tempStorage" vkshop-event-name="暂存" vkshop-event-type="click" v-loading="loading" :disabled="loading"  element-loading-spinner="el-icon-loading"  element-loading-text="拼命暂存中" :class="{ loadingFont : loading}">暂存</button><button @click="goNext" vkshop-event-name="下一步" vkshop-event-type="click">下一步</button>
        </div>
    </div>
</template>

<script>

export default {
    name:'procedureTwo',
    data(){
        return{
            active: 1,
            zhu:require('../../../assets/img/zhu.png'),//主险图片--主
            fu:require('../../../assets/img/fu.png'),//附险图片--附
            currentNeedAddResponsibility: 0,//当前需要添加险种的计划
            responsibilityDialogVisible:false,//添加险种对话框
            replicatedScheduleDialogVisible:false,//复制的计划险种对话框
            insuranceDialogVisible: false,//险种对话框
            insuranceDialogData:{},
            configurationResponsibility:{domains:[]},//所有计划的所有内容
            planNameT:[],//计划名称
            plancodeT:[],//计划名称编码
            replicatedGroup:[],//复制的计划的选择组
            dynamicValidateFormOpen:[],//展开收起
            responsibilityList:{allresponsibilityData:[]},//添加责任因计划改变的数据
            responsibilityListOrigin:{allresponsibilityData:[]},//添加责任原始数据
            mocData:[],//模板初始化的数据
            information_3_falg:[],
            pdfUrlIframe:null,//PDF预览
            insuranceDialogVisiblePDF:false,//PDF预览view
            loading:false,//点击暂存出现的圈圈
            padeLoading: true,
            foucesTimer:null,//ios键盘回落参数
            riskReplaceShlef:[],//20210121新增的上下架的数组
            ifRiskReplaceShlef:false,//20210121新增的上下架的标红，默认为没有下架产品
            shelfProduct:''//20210126新增的上下架的标红，下架产品
        }
    },
    created(){
        this.getRiskRespByMouldcode();
        this.getRiskData();
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            this.padeLoading = false;
        });
    },
    methods:{
        //修改输入为数字
        checkNo:function(index,index1,index2,index3) {
           this.$forceUpdate();
           console.log("我是我是")
            if(index3 != null){
                let nowValue = this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[index3].trueConfigurationStep;
                
                 this.$nextTick(() => {
                    this.$set(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[index3],"trueConfigurationStep", nowValue == undefined ? 0 : nowValue.toFixed(4))
                })
               
            }else{
                let nowValue = this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].trueConfigurationStep;
                console.log(nowValue)
                this.$nextTick(() => {
                    this.$set( this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2],"trueConfigurationStep", nowValue == undefined ? 0 : nowValue.toFixed(4))
                })
                
            }
            // 573险种第一个子责任牵制其他子责任
            if(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].responsibilityNameCode == '573' && index3 == 0){
                // 30%
                let threePoint = (this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[index3].trueConfigurationStep)*0.3;
                // 50%
                let fivePoint = (this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[index3].trueConfigurationStep)*0.5;
                
                if(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[1].trueConfigurationStep > threePoint ){
                    this.$set(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[1],"trueConfigurationStep", Number(threePoint.toFixed(2)))
                }
                if(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[2].trueConfigurationStep > threePoint ){
                    this.$set(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[2],"trueConfigurationStep", Number(fivePoint.toFixed(2)))
                }
            }
            //580险种第一个子责任牵制其他子责任
            if(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].responsibilityNameCode == '580' && index3 == 0){
                // 100%
                let onePointTemp = (this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[index3].trueConfigurationStep)*1;
                // 20%
                let twoPointTemp = (this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[index3].trueConfigurationStep)*0.2;
               
                // 50%
                let fivePointTemp = (this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[index3].trueConfigurationStep)*0.5;

                if(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[1].trueConfigurationStep > onePointTemp ){
                    this.$set(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[1],"trueConfigurationStep", Number(onePointTemp.toFixed(2)))
                }
                if(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[2].trueConfigurationStep > twoPointTemp ){
                    this.$set(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[2],"trueConfigurationStep", Number(twoPointTemp.toFixed(2)))
                }
                if(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[3].trueConfigurationStep > fivePointTemp ){
                    this.$set(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[3],"trueConfigurationStep", Number(fivePointTemp.toFixed(2)))
                }
                if(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[4].trueConfigurationStep > fivePointTemp ){
                    this.$set(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[4],"trueConfigurationStep", Number(fivePointTemp.toFixed(2)))
                }
            }
            
        },
        //switch--change事件
        changeStatus: function($event,index3,index2,index1,index,code){
            let that = this;
            if(code == '110'){
                if($event == false){
                    console.log(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2])
                    let a =  this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[0].subIfDefaultConfiguration;
                    let b =  this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[1].subIfDefaultConfiguration;
                    let c =  this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[2].subIfDefaultConfiguration;
                    if(a == false && b == false && c == false){
                        this.$alert('门诊，住院，女性生育至少保留一个', '', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[index3].subIfDefaultConfiguration=true;
                            }
                     });
                    }
                }else{
                   let a =  this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[0].subIfDefaultConfiguration;
                   let b =  this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[1].subIfDefaultConfiguration;
                   if(a&&b){
                       this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].ifDefaultConfiguration = true;
                   }
                }
                if(index3 != 2 && $event == false){
                    this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].ifDefaultConfiguration = false;
                }
            }
            if(code == '604' || code == '605'){
                //先把所有的true ，false 集合
                let arryEvent = [];
                this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData.forEach(function(conArry,conIndex){
                    arryEvent.push(conArry.subIfDefaultConfiguration)
                })
                if($event == false){
                    if(index3 == 0){
                        arryEvent.forEach(function(conChangeArry,conChangeIndex){
                            if(conChangeIndex != 0){
                                that.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[conChangeIndex].subIfDefaultConfiguration = true;
                            }
                        })
                    }else{
                        let copyArryEvent = JSON.parse(JSON.stringify(arryEvent));
                        copyArryEvent.splice(0,1);
                        if(!copyArryEvent.includes(true)){
                             that.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[0].subIfDefaultConfiguration = true;
                        }
                    }
                }else{
                    if(index3 == 0){
                        let copyArryEvent = JSON.parse(JSON.stringify(arryEvent));
                        arryEvent.forEach(function(conChangeArry,conChangeIndex){
                            if(conChangeIndex != 0){
                                that.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[conChangeIndex].subIfDefaultConfiguration = false;
                            }
                        })
                    }else{
                        that.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].subResponsibilityData[0].subIfDefaultConfiguration = false;
                    }
                }
            }
            console.log($event+','+index3+','+index2+','+index1+','+code)//false,0,0,1,604
        },
        //删除险种
        deleteItem: function(index,index1,index2){
            console.log(index,index1,index2);
            if(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].ifMainInsurance){
                //主险--判断是不是最后一个主险
                let haveMainInsurance = 0;//初始有0个主险
                for(let i = 0; i < this.configurationResponsibility.domains[index].data.length; i++){
                    for(let j = 0; j < this.configurationResponsibility.domains[index].data[i].responsibilityData.length; j++){
                        if(this.configurationResponsibility.domains[index].data[i].responsibilityData[j].ifMainInsurance){
                                haveMainInsurance++;
                        }
                    }
                }
                if(haveMainInsurance-1 >= 1){
                    this.deleteComfirm(index,index1,index2);
                }else{
                    this.$alert('每个计划必须至少包含一个主险。本险种是本计划唯一的主险，不能删除。', '', {
                        confirmButtonText: '确定',
                        callback: action => {}
                    });
                    this.$refs['touchmove'].forEach(function(currentValue,index){
                        currentValue.style.transform = "translateX(0px)"; 
                        currentValue.removeAttribute('data-touchmove-active');
                    })
                }
            }else{//responsibilityData
                this.deleteComfirm(index,index1,index2);
            }
        },
        //删除险种前的二次确认
        deleteComfirm(index,index1,index2){
            this.$confirm('你确定要删除 计划'+ (index+1) + ' <span style="color:red">'+ this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].riskshort + '</span> 吗？','',{
                dangerouslyUseHTMLString:true,
                confirmButtonText:'确定删除',
                cancelButtonText:'我再想想',
                type: 'warning'
            }).then(()=>{
                this.configurationResponsibility.domains[index].data[index1].responsibilityData.splice(index2,1);
                if(this.configurationResponsibility.domains[index].data[index1].responsibilityData.length == 0){
                    this.configurationResponsibility.domains[index].data.splice(index1,1);
                }
                this.$message({
                    message: '成功删除',
                    type: 'success'
                });
                console.log(this.$refs['touchmove'])
                this.$refs['touchmove'].forEach(function(currentValue,index){
                    currentValue.style.transform = "translateX(0px)"; 
                    currentValue.removeAttribute('data-touchmove-active');
                })
            }).catch(()=>{})
        },
        //复制计划之前的检查是否可以复制
        checkReplicate: function(index){
            if(this.configurationResponsibility.domains.length > 1){
                this.replicatedScheduleDialogVisible = true;
                this.currentNeedAddResponsibility = index;
            }else{
                this.$alert('您没有可以复制该计划的其他计划哦','',{
                    confirmButtonText:'好的，我知道了',
                    showClose:false
                })
            }
        },
        //复制险种到其他的计划里
        replicatedOk: function(){
            console.log(this.replicatedGroup);
             let planMuch = '';
            if(this.replicatedGroup.length != 0){
                for(let i = 0; i < this.replicatedGroup.length; i++){
                    if(i == this.replicatedGroup.length-1){
                        planMuch += '<span style="color:#5092fc">计划'+(this.replicatedGroup[i]+1)+'('+this.planNameT[this.replicatedGroup[i]]+')</span>'
                    }else{
                        planMuch += '<span style="color:#5092fc">计划'+(this.replicatedGroup[i]+1)+'('+this.planNameT[this.replicatedGroup[i]]+')</span>、'
                    }
                
                }
                let html = '<p>复制后，'+planMuch+'的责任 （有什么险种责任、保额分别是多少）全部改成跟<span style="color:#fd8423"> 计划'+(this.currentNeedAddResponsibility+1)+'('+this.planNameT[this.currentNeedAddResponsibility]+')</span>'+'一样。</p><br/>请问您确定复制吗？'
               
                this.$confirm( html, '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    
                    // let replicatedMock = JSON.parse(JSON.stringify(this.configurationResponsibility.domains[this.currentNeedAddResponsibility].data));
                    for(let i = 0; i < this.replicatedGroup.length; i++){
                        this.configurationResponsibility.domains[this.replicatedGroup[i]].data = JSON.parse(JSON.stringify(this.configurationResponsibility.domains[this.currentNeedAddResponsibility].data));
                    }
                    this.replicatedScheduleDialogVisible = false;
                    this.$message({
                        message: '复制成功',
                        type: 'success'
                    });
                }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消复制'
                    // });      
                });
            }else{
                
            }
           
        },
        //添加其他险种
        addResponsibility: function(event){
            if(this.responsibilityListOrigin.allresponsibilityData.length == 0){
                this.getRiskData();
                console.log("我在这呀")
            }
            
            //获取当前点击按钮的计划位置
            this.currentNeedAddResponsibility = event;
            //深拷贝一份数组
            this.responsibilityList.allresponsibilityData = JSON.parse(JSON.stringify(this.responsibilityListOrigin.allresponsibilityData));
            let cloneResponsibilityList = this.responsibilityList.allresponsibilityData
            // console.log("cloneResponsibilityList "+ JSON.stringify(cloneResponsibilityList));
            //除去当前计划有的险种
            let convenientDomains = this.configurationResponsibility.domains[this.currentNeedAddResponsibility];
            let recodeSon;//记录下弹框类所处位置
            //  ①获取当前计划大类
            for(let l = 0; l < convenientDomains.data.length; l++){
                let firstData = convenientDomains.data[l].responsibilityCode;//获得大类的code
                //②获得该大类在弹框里的位置，并记录下该位置--recodeSon
                for(let p = 0; p < cloneResponsibilityList.length; p++){
                    if(firstData == cloneResponsibilityList[p].responsibilityCode){
                       recodeSon = p;
                    }
                }
                //③获得当前计划下得大类下的所有责任
                for(let u = 0; u  < convenientDomains.data[l].responsibilityData.length; u++){
                    //判断有没有110，有110，就不能有140,141/ 有140,141 就不能有110
                    
                    for(let t = 0; t < cloneResponsibilityList[recodeSon].responsibilityData.length; t++){//responsibilityNameCode

                        if(convenientDomains.data[l].responsibilityData[u].responsibilityNameCode == '110'){

                            if(cloneResponsibilityList[recodeSon].responsibilityData[t].responsibilityNameCode == '140'
                            || cloneResponsibilityList[recodeSon].responsibilityData[t].responsibilityNameCode == '141'){
                                cloneResponsibilityList[recodeSon].responsibilityData.splice(t,1);
                                t--;
                            }
                        }
                        else if(convenientDomains.data[l].responsibilityData[u].responsibilityNameCode == '140'
                            || convenientDomains.data[l].responsibilityData[u].responsibilityNameCode == '141'){

                            if(cloneResponsibilityList[recodeSon].responsibilityData[t].responsibilityNameCode == '110'){
                                cloneResponsibilityList[recodeSon].responsibilityData.splice(t,1);
                                t--;
                            }
                        }
                     //④匹配符合的，并去掉
                        if(t < 0){
                            t = 0;
                            if(convenientDomains.data[l].responsibilityData[u].responsibilityNameCode == cloneResponsibilityList[recodeSon].responsibilityData[t].responsibilityNameCode){//responsibilityNameCode
                                cloneResponsibilityList[recodeSon].responsibilityData.splice(t,1);
                                t--;
                            }
                        }else{
                            if(convenientDomains.data[l].responsibilityData[u].responsibilityNameCode == cloneResponsibilityList[recodeSon].responsibilityData[t].responsibilityNameCode){//responsibilityNameCode
                                cloneResponsibilityList[recodeSon].responsibilityData.splice(t,1);
                                t--;
                            }
                        }
                       
        
                    }

                    if(u==convenientDomains.data[l].responsibilityData.length-1){
                       if(cloneResponsibilityList[recodeSon].responsibilityData.length == 0){
                           cloneResponsibilityList.splice(recodeSon,1);
                        //    cloneResponsibilityList.splice(recodeSon,0,{});
                       } 
                    }

                }
            }
            this.responsibilityList.allresponsibilityData = JSON.parse(JSON.stringify(cloneResponsibilityList)); 
            console.log(this.responsibilityList.allresponsibilityData);
             //打开对话框
            this.responsibilityDialogVisible = true;
        },
        //在对话框里选择险种index--responsibilityList.allresponsibilityData,index2--responsibilityList.allresponsibilityData.responsibilityData
        addResponsibilityNow: function(index,index2){
            //index--当前点击的险种在第几个大类 index2--当前点击的险种在第几个大类下的第几个
            this.responsibilityDialogVisible = false;//将对话框收起来
            //insertLocation,fatherInsertLocation当前应该插入的位置
            let flag = false,currentSit, insertLocation=0, fatherInsertLocation=0;
            //选中险种的所属类的代码
            let fatherResponsibility = this.responsibilityList.allresponsibilityData[index].responsibilityCode;
             //选中险种的所属类的名称
            let fatherRisktype= this.responsibilityList.allresponsibilityData[index].risktype;
            //获取点击时的责任的排序
            let clickResponsibility = this.responsibilityList.allresponsibilityData[index].responsibilityData[index2].riskorder;
            //获取点击时的责任
            let setData =  this.responsibilityList.allresponsibilityData[index].responsibilityData[index2];
            console.log(setData)
            //获取当前计划的总体数据
            let nowHaveAllData = this.configurationResponsibility.domains[this.currentNeedAddResponsibility].data;
            //获取当前计划所拥有的类别
            let nowHaveResponsibility = [];
            for(let i = 0; i < nowHaveAllData.length; i++){
                nowHaveResponsibility.push(Number(nowHaveAllData[i].responsibilityCode));
            }
            //排序
            // nowHaveResponsibility.sort();
            //对比 选中险种的所属类的代码:获取当前计划所拥有的类别
            for(let k = 0; k < nowHaveResponsibility.length; k++){
                if(nowHaveResponsibility[k] == fatherResponsibility){
                    flag = true;
                    currentSit = k;
                }
            }
            //对比 选中险种的所属类的代码:获取当前计划所拥有的类别,选中险种的所属类的代码排行第几
            for(let n = 0; n < nowHaveResponsibility.length; n++){
                if(nowHaveResponsibility[n] > fatherResponsibility){
                    fatherInsertLocation = n;
                }else{
                    fatherInsertLocation = nowHaveResponsibility.length;
                }
            }
            if(flag){//含有这个大类
                //获取当前大类下的所有险种的排序
                let SortInsurance = [];
                for(let j = 0; j < nowHaveAllData[currentSit].responsibilityData.length; j++){
                   var temNum = nowHaveAllData[currentSit].responsibilityData[j].riskorder;
                    SortInsurance.push(temNum)
                }
                SortInsurance.sort();//排序
                //对比选择的顺序应排的位置
                for(let m = 0; m < SortInsurance.length; m++){
                   if(clickResponsibility < SortInsurance[m]){
                       //记录下比当前现有的责任哪个更大的位置
                       insertLocation = m;
                   }else{
                       insertLocation = SortInsurance.length;
                   }
                }
                //插入
                this.configurationResponsibility.domains[this.currentNeedAddResponsibility].data[currentSit].responsibilityData.splice(insertLocation,0,setData)
            }else{//不含有这个大类
                let tempList = {//所有的计划下的内容
                        risktype:fatherRisktype,//类别
                        responsibilityCode:fatherResponsibility,//类别的代码
                        responsibilityData:[]//一个类别的结束
                    }
                tempList.responsibilityData.push(setData);
                this.configurationResponsibility.domains[this.currentNeedAddResponsibility].data.splice(fatherInsertLocation,0,tempList);
            }
            
        },
        //展开-收起
        changeBlock: function(event){
          this.dynamicValidateFormOpen[event].open = !this.dynamicValidateFormOpen[event].open;
        },
        //查看险种简单条款
        lookResponsibility: function(code){
             this.$axios.get('/index/getRiskDetail',{
                params:{
                    riskno: code
                }
            }).then(response =>{
                if(response.data.code == 200){
                    this.insuranceDialogData = response.data.data[0];
                    this.insuranceDialogVisible = true;
                }
                console.log(code,response);
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
        // 初始化获取pdf文件
        getPdfCode (currentInsurance) {
            console.log("获取pdf文件")
            let url = encodeURIComponent('/mybp/work/index/getPdfIo?riskcode='+currentInsurance)
            this.pdfUrlIframe = '../../../mybp/static/pdf/web/viewer.html?file='+ url;
            this.insuranceDialogVisiblePDF = true;
        },
        //回到主页
        goHome: function(){
            // var numberOfEntries = window.history.length;
            // console.log('算出一共有多少history2')
            // console.log(Number(-numberOfEntries))
            // console.log( window.history)
            // // this.$router.push({path:'/'});
            // this.$router.go(-4);
            this.$clearTemporaryAll();//清楚所有步骤的信息
             this.$router.push({name:'OtoIndex'})
        },
        //上一步
        goPrev: function(){
            if(document.getElementsByClassName('configuration-responsibility-box')[0].textContent != ''){
                let quotationInformation = {"configurationResponsibility":this.configurationResponsibility.domains};
                    localStorage.setItem("quotationInformation_3",JSON.stringify(quotationInformation));
             }
              this.$router.push({path:'procedureOne'})
            //  this.$router.go(-1);
        },
        //暂存
        tempStorage: function(){
            this.checkTrueShelf();
            // this.ifRiskReplaceShlef = false;
            if(document.getElementsByClassName('configuration-responsibility-box')[0].textContent != ''){
                if(!this.ifRiskReplaceShlef){//没有下架的产品
                    this.loading = true;
                    let quotationInformation = {"configurationResponsibility":this.configurationResponsibility.domains};
                        localStorage.setItem("quotationInformation_3",JSON.stringify(quotationInformation));
                    localStorage.setItem('quotationInformation_tempsavestep',2);
                    this.$temporary().then((code)=>{
                        this.loading = false;
                    });
                }else{
                     this.$alert("计划中含有下架产品"+this.shelfProduct.slice(0,this.shelfProduct.length-1)+"，请删除下架产品再操作",'',{
                        confirmButtonText:'好的，我知道了'
                    }).catch(()=>{})
                }
                
            }else{
                this.$message.error('页面还没加载完，请耐心等待或手动刷新')
            }
        },
        //下一步
        goNext: function(){
            if(document.getElementsByClassName('configuration-responsibility-box')[0].textContent != ''){
                this.checkTrueShelf();
                 if(!this.ifRiskReplaceShlef){//没有下架的产品
                    let checkPlanHasMainA = this.checkPlanHasMain();
                    console.log(checkPlanHasMainA)
                    console.log(checkPlanHasMainA.includes(false))
                    if(checkPlanHasMainA.includes(false)){
                        this.$alert('请确保每个计划都有一个主险','',{
                            confirmButtonText:'好的，我知道了'
                        }).catch(()=>{})
                    }else{
                        let quotationInformation = {"configurationResponsibility":this.configurationResponsibility.domains};
                        localStorage.setItem("quotationInformation_3",JSON.stringify(quotationInformation));
                        this.$router.push({path:'procedureThree'});
                    }
                }else{
                    this.$alert("计划中含有下架产品"+this.shelfProduct.slice(0,this.shelfProduct.length-1)+"，请删除下架产品再操作",'',{
                        confirmButtonText:'好的，我知道了'
                    }).catch(()=>{})
                    
                }
                
                
            }else{
                this.$message.error('页面还没加载完，请耐心等待')
            }
            
        },
        //检查每个计划是否都包含一个主险
        checkPlanHasMain: function(){
            let arry = [];
            for(let k = 0; k < this.configurationResponsibility.domains.length; k++){
                if(this.configurationResponsibility.domains[k].data==''){
                    arry.push(false);
                }else{
                    for(let j = 0; j < this.configurationResponsibility.domains[k].data.length; j++){
                        for(let i = 0; i < this.configurationResponsibility.domains[k].data[j].responsibilityData.length; i++){
                            if(this.configurationResponsibility.domains[k].data[j].responsibilityData[i].ifMainInsurance == true){
                                 arry.push(true);
                                 i = this.configurationResponsibility.domains[k].data[j].responsibilityData.length;
                                 
                            }
                        }
                        j = this.configurationResponsibility.domains[k].data.length;
                    }
                }
            }
            return arry;
        },
        //获取初始化数据 /index/getRiskRespByMouldcode
        getRiskRespByMouldcode: function(){
            let that = this;
            console.log("hello,第二步开始")
            this.$axios.get('/index/getRiskRespByMouldcode',{
                params:{
                    mouldcode:JSON.parse(localStorage.getItem('YF_quotationInformation_1')).templateSelection,
                    rand:new Date().getTime()
                }
            }).then(response => {
                if(response.data.code == 200){
                    that.mocData = response.data.data;
                    let tempC = [];
                     if((!!localStorage.getItem('quotationInformation_3') && localStorage.getItem('quotationInformation_3')!='') ){
                        let information_2 = JSON.parse(localStorage.getItem('quotationInformation_2'));
                        //对比第一步的顺序与暂存里的顺序对不对的上
                        for(let i = 0; i < information_2.distributionPlan.length; i++){
                            //压入名字plancode plancodeT
                            // that.planNameT.push(information_2.distributionPlan[i].activeName)
                            that.planNameT.push(information_2.distributionPlan[i].activeName)
                            that.plancodeT.push(information_2.distributionPlan[i].planCode)
                        }
                        //获取上次暂存的第二步的内容
                        let information_3_ = JSON.parse(localStorage.getItem('quotationInformation_3'));
                        
                        for(let j = 0; j < that.planNameT.length;j++){
                            let resetInformation = JSON.parse(localStorage.getItem('quotationInformation_3')).configurationResponsibility;
                            let isPushflag = false;//不等于false， 等于true
                            let recodeK ;
                            for(let k = j; k < resetInformation.length;k++){
                                if(that.plancodeT[j] == resetInformation[k].planCode){//that.planNameT[j] == resetInformation[k].planName
                                    isPushflag = true;
                                    recodeK = k;
                                }
                            }
                            if(isPushflag){
                                if(information_3_.configurationResponsibility[recodeK].data != null){
                                    let param = {
                                        planName: that.planNameT[j],//计划名称
                                        planCode: that.plancodeT[j],//计划名称编码
                                        data:information_3_.configurationResponsibility[recodeK].data
                                    }
                                    tempC.push(param);
                                }else{
                                    let tep = JSON.parse(JSON.stringify(that.mocData))
                                    let param = {
                                        planName: that.planNameT[j],//计划名称
                                        planCode: that.plancodeT[j],//计划名称编码
                                        data:tep
                                    }
                                    tempC.push(param);
                                }
                            }else{
                                let tep = JSON.parse(JSON.stringify(that.mocData))
                                let param = {
                                    planName: that.planNameT[j],//计划名称
                                    planCode: that.plancodeT[j],//计划名称编码
                                    data:tep
                                }
                                tempC.push(param);
                            }
                            
                        }

                        let pt = {"configurationResponsibility":tempC};
                             localStorage.setItem("quotationInformation_3",JSON.stringify(pt));

                    }else{
                        //获取步骤一分配计划的计划名称
                        if(!!localStorage.getItem('quotationInformation_2')&&localStorage.getItem('quotationInformation_2')!=''){
                                let information = JSON.parse(localStorage.getItem('quotationInformation_2'));
                                for(let j = 0; j < information.distributionPlan.length;j++){
                                    that.planNameT.push(information.distributionPlan[j].activeName)
                                    that.plancodeT.push(information.distributionPlan[j].planCode)
                                }
                        }
                        for(let i = 0; i < that.planNameT.length; i++){
                            let tep = JSON.parse(JSON.stringify(that.mocData))
                            that.configurationResponsibility.domains.push({
                                planName: that.planNameT[i],//计划名称
                                planCode: that.plancodeT[i],//计划名称编码
                                data:tep
                            })
                        }

                       let quotationInformation = {"configurationResponsibility":that.configurationResponsibility.domains};
                        localStorage.setItem("quotationInformation_3",JSON.stringify(quotationInformation));

                    }
                    that.configurationResponsibility.domains = JSON.parse(localStorage.getItem('quotationInformation_3')).configurationResponsibility;
                    console.log(that.configurationResponsibility.domains.length);

                    for(let n = 0; n < that.configurationResponsibility.domains.length; n++){
                        if(n == 0){
                            that.dynamicValidateFormOpen.push({open:true})
                        }else{
                            that.dynamicValidateFormOpen.push({open:false})
                        } 
                    }

                }
            }).catch(error =>{
                this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                    confirmButtonText:'好的，我明白了'
                }).catch(()=>{})
            })
        },
        //在下一步和暂存检查是否有删除干净应该删除的险种
        checkTrueShelf: function(){
            let that = this;
            this.ifRiskReplaceShlef = false;
            this.checkShelf();
            this.riskReplaceShlef.forEach(element => {
                element.forEach(index => {
                    if(index.ifOffShelf){//还含有下架的产品
                        that.ifRiskReplaceShlef = true;
                    }
                })
            })
        },
        // 看是否含有下架产品-20210121
        checkShelf: function(){
            let that = this, tempShelf = [], tempRiskReplaceShlef = [];
            this.shelfProduct = '';
            that.riskReplaceShlef = [];
            that.configurationResponsibility.domains.forEach(element => {
                tempRiskReplaceShlef = [];
                element.data.forEach(index => {//进入每个data里面
                    index.responsibilityData.forEach(indexData => {
                        if(indexData.ifOffShelf == undefined){
                            tempRiskReplaceShlef.push({ifOffShelf:false, riskReplace:null})
                        }else{
                            tempRiskReplaceShlef.push({ifOffShelf:indexData.ifOffShelf, riskReplace:indexData.riskReplace})
                        }
                        if(tempShelf.indexOf(indexData.responsibilityNameCode) == -1 && indexData.ifOffShelf != undefined && indexData.ifOffShelf == true){
                                this.shelfProduct +=  indexData.responsibilityNameCode + indexData.riskshort + '、'  ;
                                tempShelf.push(indexData.responsibilityNameCode);
                        }
                    })
                })
                that.riskReplaceShlef.push(tempRiskReplaceShlef);
            });
            // this.$forceUpdate();//强制刷新，，看看有没有效果
            console.log("我是新增的上下架炮灰---初始化")
            console.log(that.riskReplaceShlef);
        },
        //获取所有的能添加的数据 /index/getRiskData
        getRiskData: function(){
            let that = this;
            this.$axios.get('/index/getRiskData',{
                params:{
                    mouldcode:JSON.parse(localStorage.getItem('YF_quotationInformation_1')).templateCode,
                    rand:new Date().getTime()
                }
            }).then(response => {
                console.log(response);
                that.responsibilityListOrigin.allresponsibilityData.length = 0;
                response.data.data.forEach(function(currentValue,index){
                    that.responsibilityListOrigin.allresponsibilityData.push(response.data.data[index].risklist[0]);
                })
                 console.log(that.responsibilityListOrigin.allresponsibilityData);
            })
        },
        //解决ios键盘回落，内容不回落问题
        handleFocus(event) {
            clearTimeout(this.foucesTimer);
        },
        handleblur() {
            this.foucesTimer = setTimeout(() => {
                document.body.scrollTop = 0;
                window.pageXOffset = 0;
                document.documentElement.scrollTop = 0;
            }, 100);
        }
    }
    
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
    width: 0px;
}
.procedure-two{
    margin-top: 50px;
    margin-bottom: 40px;
    overflow: hidden;
}
.configuration-responsibility{
    margin-top: 50px;
    padding: 0 15px;
    height: calc(100vh - 145px);
    overflow: hidden;
    .configuration-responsibility-box{
        height: 100%;
        overflow: scroll;
    }
    .content-title{
        position: relative;
        height: 14px;
        &::before{
            content: '';
            position: absolute;
            width: 100%;
            height: 1px;
            background:#bfbfbf;
            top: 50%;
            transform: translateY(-50%);
        }
        span{
            font-size: 12px;
            display: inline-block;
            padding: 0 20px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            background: #fff;
        }
    }
    .responsibility-part{
        position: relative;
        overflow: hidden;
        padding-top: 30px;
        margin-top: 15px;
        background: #fff;
        border-radius: 10px;
        &:first-child{
            margin-top: 0;
        }
        .procedure-corner-mark{
            position: relative;
            // width: 170px;
            width: 500px;
            height: 60px;
            border-radius: 100%;
            background: #5393fc;
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            span{
                color: #fff;
                position: absolute;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 12px;
                width: 100%;
                font-weight: 700;
                text-align: center;
            }
        }
    }
    .responsibility-part-content{
        margin-top: 15px;
        .sub-responsibility{
            .content-clause-name{
                width: 108px;
                margin-left: 30px;
                text-align: left;
            }
            .content-clause-mony{
                float:  right;
                margin: 5px 3px 20px 0px;
            }
        }
    }
    .content-clause{
        font-size: 13px;
        margin-top: 10px;
        padding: 5px 0;
        i{
            img{
                width: 12px;
                vertical-align: middle;
                padding-left: 1px;
            }
        }
        .content-clause-name{
            width: 105px;
            display: inline-block;
            vertical-align: middle;
        }
        .content-clause-mony{
            width: calc(100% - 128px);
            text-align: right;
            display: inline-block;
            span{
                &:first-child{
                    font-size: 11px;
                }
            }
        }
        .delete_item {
            position: absolute;
            top: 5px;
            right: -60px;
            width: 32px;
            height: 32px;
            border-radius: 32px;
            margin-right: 10px;
            // padding: 5px 0;
            line-height: 32px;
            box-sizing: border-box;
            text-align: center;
            background: red;
            span{
                position: absolute;
                width: 50px;
                height: 20px;
                top: 3px;
                left: -8px;
                font-size: 12px;
                color: #fff;
                i{
                   font-size: 20px;
                }
            }
        }
        
    }
    .need-remove-riskcode{
        border:2px solid red;
        padding-bottom: 10px;
        .need-remove-content{
            padding: 5px 0 5px 5px;
            background: red;
            color: white;
            font-size: 14px;
            margin-bottom: 10px;
        }
    }
    .tip-move{
            color:#bfbfbf;
            font-size:10px;
            text-align:right;
            padding-right:5px;
            position: absolute;
            bottom: 80px;
            right: 5px;
    }
    .button-btn{
    text-align: center;
    width: 100%;
        button{
            width: 160px;
            height: 38px;
            border-radius: 5px;
            position: relative;
            overflow: hidden;
            margin-top: 35px;
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
                margin-left: 10px;
            }
        }
    }
    .yl-comm{
        text-align: right;
        margin-top: 2px;
        margin-right: 5px;
        font-size: 12px;
    }
    .if-open{
        text-align: center;
        font-size: 0;
        padding-top: 5px;
        .el-button{
            border: none;
            padding: 8px 20px;
        }
        .el-button:focus, .el-button:hover{
            background: #fff;
        }
    }
}
.procedure-btn{
    width: 100%;
    position: fixed;
    bottom: 0;
    font-size: 0;
    z-index: 2;
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
.content-clause{
    font-size: 12px;
    i{
        img{
            width: 12px;
            vertical-align: baseline;
            padding-left: 1px;
        }
    }
}
.clear-self {zoom:1;}    /*==for IE6/7 Maxthon2==*/
.clear-self::after {
   clear:both;
   content:'.';
   display:block;
   width: 0;
   height: 0;
   visibility:hidden;
}
.pDialog{
    .content-title{
        position: relative;
        height: 14px;
        padding: 5px 0;
        &::before{
            content: '';
            position: absolute;
            width: 100%;
            height: 1px;
            background:#bfbfbf;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
        }
        span{
            font-size: 12px;
            display: inline-block;
            padding: 0 20px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            background: #fff;
        }
    } 
}
.pDialog_p {
        .insurance-dialog-btn{
            width: 150px;
            height: 38px;
            border-radius: 5px;
            background: inherit;
            border: 1px solid #60b3ff;
            color: #60b3ff;
            position: absolute;
            top: 15px;
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
</style>

<style lang="scss">
.procedure-two{
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
            background: #f5f5f5;
        }
        .el-step.is-horizontal .el-step__line{
            height: 1px;
        }
        // .el-step.is-horizontal .el-step__line{
        //     top: 25px;
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
    .el-form-item{
        height: 35px;
        line-height: 35px;
        .el-form-item__content{
            line-height: 35px;
        }
    }

    .pDialog {
        .el-dialog--center .el-dialog__body{
            padding-top: 5px;
        }
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
            text-align: center;
            li{
                padding: 10px 25px;
                text-align: left;
            }
        }
        .tip{
            position: relative;
            font-size: 12px;
            text-align: left;
        }
        .tip-red{
            color: red;
        }
        .el-checkbox-group{
            text-align: left;
            label{
                display: block;
                text-align: left;
                margin: 0 auto;
                margin-top: 10px;
                width: 200px;
                height: auto;
            }
            .el-checkbox.is-bordered+.el-checkbox.is-bordered{
                margin: 0 auto;
                margin-top: 10px;
            }
            .el-checkbox__inner:hover{
                border-color: #DCDFE6;
            }
            .el-checkbox_input.is-focus{
                border-color: #DCDFE6;
            }
            .el-checkbox{
                white-space: break-spaces;
            }
            .el-checkbox.is-bordered.el-checkbox--medium{
                padding: 7px 10px 7px 10px;
            }
            .el-checkbox__input{
                position: absolute;
                top: 50%;
                left: 10px;
                transform: translateY(-50%);
            }
            .el-checkbox__label{
                padding-left: 22px;
            }
        }
        .dialog-title{
            font-size: 14px;
            text-align: left;
        }
        .el-dialog__body{
           max-height: calc(100vh - 200px);
           overflow: scroll;
        }
    }
    .pDialog_p{
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
        height: calc(100% - 7vh);
        box-sizing: border-box;
        margin-top:5vh !important;
        .el-dialog{
            height: 100% !important;
            box-sizing: border-box;
            .el-dialog__body{
                height: calc(100% - 7vh);
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
                top: 5px;
            }
        }
        
    }
    .el-input-number--small,.el-input--small .el-input__inner{
        height: 36px;
        line-height: 34px;
    }
}
</style>