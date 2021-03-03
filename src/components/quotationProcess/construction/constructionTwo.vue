<template>
    <div class="procedure-two">
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

        <!-- 配置责任 -->
        <div class="configuration-responsibility">
            <div class="configuration-responsibility-box">
                <!-- 单独一个计划-开始 -->
                <div class="responsibility-part" v-for="(item,index) in configurationResponsibility.domains" :key="index">
                    <!-- 表头-计划几 -->
                    <div class="procedure-corner-mark"><span> 计划{{index+1}}({{item.planName}}) </span></div>
                    <!-- 可展开收起块 -->
                    <div>
                        <!-- 主体配置内容-块 -->
                        <div class="responsibility-part-content" v-for="(responsibilityItem,index1) in item.data" :key="index1">
                            <p class="content-title"><span>{{responsibilityItem.risktype}}</span></p>
                            <div class="content-clause" ref="touchmove" v-leftMove="{container: '[data-touchmove-con]'}" v-for="(allresponsibilityItem,index2) in responsibilityItem.responsibilityData" :key="index2">
                                <i v-if="allresponsibilityItem.ifMainInsurance == true"><img :src="zhu" alt=""></i>
                                <i v-else><img :src="fu" alt=""></i>
                                <span class="content-clause-name">{{allresponsibilityItem.riskshort}}<i class="el-icon-warning-outline"></i></span>
                                <div class="content-clause-mony" v-if="allresponsibilityItem.ifHaveSubResponsibility == false">
                                    <span>保额({{allresponsibilityItem.insuredUnit}})</span>
                                    <el-input-number :min=0 size="small" v-model="allresponsibilityItem.trueConfigurationStep" :step="allresponsibilityItem.defaultConfigurationStep"></el-input-number>
                                </div>
                                <div class="content-clause-mony" v-else>
                                        <span><span v-if="allresponsibilityItem.responsibilityNameCode == '110'">门诊、住院</span>是否共用额度</span>
                                        <el-switch
                                        v-model="allresponsibilityItem.ifDefaultConfiguration"
                                        active-color="#6db9fe"
                                        inactive-color="#d4d4d4">
                                        </el-switch>
                                </div>
                                <div class="sub-responsibility clear-self">
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
                                            <el-input-number :min=0 size="small" v-model="subresponsibilityItem.trueConfigurationStep" :step="subresponsibilityItem.subDefaultConfigurationStep"></el-input-number>
                                        </div>
                                    </div>
                                </div>
                                <div class="delete_item" @click="deleteItem(index,index1,index2)">
                                   <span><i class="el-icon-delete"></i></span>
                                </div>
                            </div>

                        </div>
                        <!-- 复制，添加按钮 -->
                        <p class="tip-move"><span style="color:red">*</span>左滑险种可以删除</p>
                        <div class="button-btn">
                            <button @click.stop="addResponsibility(index)"><i class="el-icon-plus"></i>添加其他险种责任</button>
                        </div>
                    </div>
                    <!-- 可收起展开块 -->
                    
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
                    <li v-for="(subResponsibilityList,index3) in item.responsibilityData" :key="index3"  @click.stop="addResponsibilityNow(index0,index3)">
                        <div class="content-clause">
                            <i v-if="subResponsibilityList.ifMainInsurance == true"><img :src="zhu" alt=""></i>
                            <i v-else><img :src="fu" alt=""></i>
                            <span class="content-clause-name">{{subResponsibilityList.riskshort}}<i class="el-icon-warning-outline"></i></span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else>
            <p style="text-align:center">该计划已经没有可以添加的险种责任了</p>
        </div>

        </el-dialog>

        <!-- 底部按钮  -->
        <div class="procedure-btn">
            <button>返回主页</button><button @click="goPrev">上一步</button><button>暂存</button><button @click="goNext">下一步</button>
        </div>
    </div>
</template>

<script>
export default {
    name:'constructionTwo',
    data(){
        return{
            active: 1,
            zhu:require('../../../assets/img/zhu.png'),//主险图片--主
            fu:require('../../../assets/img/fu.png'),//附险图片--附
            currentNeedAddResponsibility: 0,//当前需要添加险种的计划
            responsibilityDialogVisible:false,//添加险种对话框
            replicatedScheduleDialogVisible:false,//复制的计划险种对话框
            configurationResponsibility:{domains:[]},//所有计划的所有内容
            planName:[],//计划名称
            replicatedGroup:[],//复制的计划的选择组
            // configurationResponsibility:{//所有计划的所有内容
            //     domains:[{
            //         planName:'管理人员',//计划名称
            //         data:[{//所有的计划下的内容
            //             risktype:'医疗类',//类别
            //             responsibilityCode:'12',//类别的代码
            //             responsibilityData:[{
            //                 riskshort:'疾病医疗',//险种名称
            //                 responsibilityNameCode:'110',//险种名称代码
            //                 riskorder:2,//险种排序
            //                 ifMainInsurance:true,//是否为主险
            //                 defaultConfigurationStep:5,//默认配置的步长
            //                 trueConfigurationStep: 5,//默认初始值的步长
            //                 ifHaveSubResponsibility:true,//是否有子责任，true---有子责任  false---没有子责任
            //                 insuredUnit:'',//保额单位
            //                 ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
            //                 subResponsibilityData:[{//子责任内容
            //                     subResponsibilityName:'疾病住院医疗',//子责任名称
            //                     subResponsibilityNameCode:'120101',//子责任名称代码
            //                     insuredUnit:'/万元',//保额单位
            //                     commonAssociation:true,//共用关联
            //                     subIfDefaultConfiguration:true,//是否默认配置子责任
            //                     subDefaultConfigurationStep:5,//默认配置子责任的步长
            //                     trueConfigurationStep:5//默认初始值的步长
            //                 },{//子责任内容
            //                     subResponsibilityName:'疾病门诊医疗',//子责任名称
            //                     subResponsibilityNameCode:'120102',//子责任名称代码
            //                     insuredUnit:'/万元',//保额单位
            //                     commonAssociation:true,//共用关联
            //                     subIfDefaultConfiguration:true,//是否默认配置子责任
            //                     subDefaultConfigurationStep:5,//默认配置子责任的步长
            //                     trueConfigurationStep:5//默认初始值的步长
            //                 },{//子责任内容
            //                     subResponsibilityName:'女性生育',//子责任名称
            //                     subResponsibilityNameCode:'120103',//子责任名称代码
            //                     insuredUnit:'/万元',//保额单位
            //                     commonAssociation:false,//共用关联
            //                     subIfDefaultConfiguration:false,//是否默认配置子责任
            //                     subDefaultConfigurationStep:5,//默认配置子责任的步长
            //                     trueConfigurationStep:5//默认初始值的步长
            //                 }]
            //             },{
            //                 riskshort:'意外医疗',//险种名称
            //                 responsibilityNameCode:'1202',//险种名称代码
            //                 riskorder:3,//险种排序
            //                 ifMainInsurance:true,//是否为主险
            //                 defaultConfigurationStep:5,//默认配置的步长
            //                 trueConfigurationStep: 5,//默认初始值的步长
            //                 ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
            //                 insuredUnit:'/万元',//保额单位
            //                 ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
            //                 subResponsibilityData:[]
            //             }]
            //             },{//所有的计划下的内容
            //             risktype:'津贴类',//类别
            //             responsibilityCode:'13',//类别的代码
            //             responsibilityData:[{
            //                 riskshort:'意外住院津贴',//险种名称
            //                 responsibilityNameCode:'1301',//险种名称代码
            //                 riskorder:4,//险种排序
            //                 ifMainInsurance:false,//是否为主险
            //                 defaultConfigurationStep:5,//默认配置的步长
            //                 trueConfigurationStep: 5,//默认初始值的步长
            //                 ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
            //                 insuredUnit:'/元/天',//保额单位
            //                 ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
            //                 subResponsibilityData:[]
            //             }]//一个类别的结束
            //         }]
            //     },{//一个计划结束
            //         planName:'底层人员',//计划名称
            //         data:[{//所有的计划下的内容
            //             risktype:'医疗类',//类别
            //             responsibilityCode:'12',//类别的代码
            //             responsibilityData:[{
            //                 riskshort:'疾病医疗',//险种名称
            //                 responsibilityNameCode:'110',//险种名称代码
            //                 riskorder:2,//险种排序
            //                 ifMainInsurance:true,//是否为主险
            //                 defaultConfigurationStep:5,//默认配置的步长
            //                 trueConfigurationStep: 5,//默认初始值的步长
            //                 ifHaveSubResponsibility:true,//是否有子责任，true---有子责任  false---没有子责任
            //                 insuredUnit:'',//保额单位
            //                 ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
            //                 subResponsibilityData:[{//子责任内容
            //                     subResponsibilityName:'疾病住院医疗',//子责任名称
            //                     subResponsibilityNameCode:'120101',//子责任名称代码
            //                     insuredUnit:'/万元',//保额单位
            //                     commonAssociation:true,//共用关联
            //                     subIfDefaultConfiguration:true,//是否默认配置子责任
            //                     subDefaultConfigurationStep:5,//默认配置子责任的步长
            //                     trueConfigurationStep:5//默认初始值的步长
            //                 },{//子责任内容
            //                     subResponsibilityName:'疾病门诊医疗',//子责任名称
            //                     subResponsibilityNameCode:'120102',//子责任名称代码
            //                     insuredUnit:'/万元',//保额单位
            //                     commonAssociation:true,//共用关联
            //                     subIfDefaultConfiguration:true,//是否默认配置子责任
            //                     subDefaultConfigurationStep:5,//默认配置子责任的步长
            //                     trueConfigurationStep:5//默认初始值的步长
            //                 },{//子责任内容
            //                     subResponsibilityName:'女性生育',//子责任名称
            //                     subResponsibilityNameCode:'120103',//子责任名称代码
            //                     insuredUnit:'/万元',//保额单位
            //                     commonAssociation:false,//共用关联
            //                     subIfDefaultConfiguration:false,//是否默认配置子责任
            //                     subDefaultConfigurationStep:5,//默认配置子责任的步长
            //                     trueConfigurationStep:5//默认初始值的步长
            //                 }]
            //             },{
            //                 riskshort:'意外医疗',//险种名称
            //                 responsibilityNameCode:'1202',//险种名称代码
            //                 riskorder:3,//险种排序
            //                 ifMainInsurance:true,//是否为主险
            //                 defaultConfigurationStep:5,//默认配置的步长
            //                 trueConfigurationStep: 5,//默认初始值的步长
            //                 ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
            //                 insuredUnit:'/万元',//保额单位
            //                 ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
            //                 subResponsibilityData:[]
            //             }]
            //             },{//所有的计划下的内容
            //             risktype:'津贴类(底层人员)',//类别
            //             responsibilityCode:'13',//类别的代码
            //             responsibilityData:[{
            //                 riskshort:'意外住院津贴(底层人员)',//险种名称
            //                 responsibilityNameCode:'1301',//险种名称代码
            //                 riskorder:4,//险种排序
            //                 ifMainInsurance:false,//是否为主险
            //                 defaultConfigurationStep:5,//默认配置的步长
            //                 trueConfigurationStep: 5,//默认初始值的步长
            //                 ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
            //                 insuredUnit:'/元/天',//保额单位
            //                 ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
            //                 subResponsibilityData:[]
            //             }]//一个类别的结束
            //         }]
            //     }]//一个计划结束
            // },
            dynamicValidateFormOpen:[],//展开收起
            responsibilityList:{allresponsibilityData:[]},//添加责任因计划改变的数据
            responsibilityListOrigin:{//添加责任原始数据
                allresponsibilityData:[{//所有的计划下的内容
                    risktype:'医疗类',//类别
                    responsibilityCode:'12',//类别的代码
                    responsibilityData:[{
                        riskshort:'疾病医疗',//险种名称
                        responsibilityNameCode:'110',//险种名称代码
                        riskorder:4,//险种排序
                        ifMainInsurance:true,//是否为主险
                        defaultConfigurationStep:5,//默认配置的步长
                        trueConfigurationStep: 5,//默认初始值的步长
                        ifHaveSubResponsibility:true,//是否有子责任，true---有子责任  false---没有子责任
                        insuredUnit:'',//保额单位
                        ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
                        subResponsibilityData:[{//子责任内容
                            subResponsibilityName:'疾病住院医疗',//子责任名称
                            subResponsibilityNameCode:'120101',//子责任名称代码
                            insuredUnit:'/万元',//保额单位
                            commonAssociation:true,//共用关联
                            subIfDefaultConfiguration:true,//是否默认配置子责任
                            subDefaultConfigurationStep:5,//默认配置子责任的步长
                            trueConfigurationStep:5//默认初始值的步长
                        },{//子责任内容
                            subResponsibilityName:'疾病门诊医疗',//子责任名称
                            subResponsibilityNameCode:'120102',//子责任名称代码
                            insuredUnit:'/万元',//保额单位
                            commonAssociation:true,//共用关联
                            subIfDefaultConfiguration:true,//是否默认配置子责任
                            subDefaultConfigurationStep:5,//默认配置子责任的步长
                            trueConfigurationStep:5//默认初始值的步长
                        },{//子责任内容
                            subResponsibilityName:'女性生育',//子责任名称
                            subResponsibilityNameCode:'120103',//子责任名称代码
                            insuredUnit:'/万元',//保额单位
                            commonAssociation:false,//共用关联
                            subIfDefaultConfiguration:false,//是否默认配置子责任
                            subDefaultConfigurationStep:5,//默认配置子责任的步长
                            trueConfigurationStep:5//默认初始值的步长
                        }]
                    },{
                        riskshort:'意外医疗',//险种名称
                        responsibilityNameCode:'1202',//险种名称代码
                        riskorder:3,//险种排序
                        ifMainInsurance:true,//是否为主险
                        defaultConfigurationStep:5,//默认配置的步长
                        trueConfigurationStep: 5,//默认初始值的步长
                        ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
                        insuredUnit:'/万元',//保额单位
                        ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
                        subResponsibilityData:[]
                    },{
                        riskshort:'意外医疗',//险种名称
                        responsibilityNameCode:'1203',//险种名称代码
                        riskorder:4,//险种排序
                        ifMainInsurance:true,//是否为主险
                        defaultConfigurationStep:5,//默认配置的步长
                        trueConfigurationStep: 5,//默认初始值的步长
                        ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
                        insuredUnit:'/万元',//保额单位
                        ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
                        subResponsibilityData:[]
                    },{
                        riskshort:'意外医疗2',//险种名称
                        responsibilityNameCode:'1205',//险种名称代码
                        riskorder:5,//险种排序
                        ifMainInsurance:true,//是否为主险
                        defaultConfigurationStep:5,//默认配置的步长
                        trueConfigurationStep: 5,//默认初始值的步长
                        ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
                        insuredUnit:'/万元',//保额单位
                        ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
                        subResponsibilityData:[]
                    },{
                        riskshort:'意外医疗4',//险种名称
                        responsibilityNameCode:'1207',//险种名称代码
                        riskorder:7,//险种排序
                        ifMainInsurance:true,//是否为主险
                        defaultConfigurationStep:5,//默认配置的步长
                        trueConfigurationStep: 5,//默认初始值的步长
                        ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
                        insuredUnit:'/万元',//保额单位
                        ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
                        subResponsibilityData:[]
                    },{
                        riskshort:'意外医疗5',//险种名称
                        responsibilityNameCode:'1209',//险种名称代码
                        riskorder:9,//险种排序
                        ifMainInsurance:true,//是否为主险
                        defaultConfigurationStep:5,//默认配置的步长
                        trueConfigurationStep: 5,//默认初始值的步长
                        ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
                        insuredUnit:'/万元',//保额单位
                        ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
                        subResponsibilityData:[]
                    }]
                },{//所有的计划下的内容
                    risktype:'津贴类',//类别
                    responsibilityCode:'13',//类别的代码
                    responsibilityData:[{
                        riskshort:'意外住院津贴2',//险种名称
                        responsibilityNameCode:'1301',//险种名称代码
                        riskorder:1,//险种排序
                        ifMainInsurance:false,//是否为主险
                        defaultConfigurationStep:5,//默认配置的步长
                        trueConfigurationStep: 5,//默认初始值的步长
                        ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
                        insuredUnit:'/元/天',//保额单位
                        ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
                        subResponsibilityData:[]
                    },{
                        riskshort:'意外住院津贴3',//险种名称
                        responsibilityNameCode:'1303',//险种名称代码
                        riskorder:4,//险种排序
                        ifMainInsurance:false,//是否为主险
                        defaultConfigurationStep:5,//默认配置的步长
                        trueConfigurationStep: 5,//默认初始值的步长
                        ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
                        insuredUnit:'/元/天',//保额单位
                        ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
                        subResponsibilityData:[]
                    },{
                        riskshort:'意外住院津贴6',//险种名称
                        responsibilityNameCode:'1302',//险种名称代码
                        riskorder:6,//险种排序
                        ifMainInsurance:false,//是否为主险
                        defaultConfigurationStep:5,//默认配置的步长
                        trueConfigurationStep: 5,//默认初始值的步长
                        ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
                        insuredUnit:'/元/天',//保额单位
                        ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
                        subResponsibilityData:[]
                    },{
                        riskshort:'意外住院津贴7',//险种名称
                        responsibilityNameCode:'1307',//险种名称代码
                        riskorder:7,//险种排序
                        ifMainInsurance:false,//是否为主险
                        defaultConfigurationStep:5,//默认配置的步长
                        trueConfigurationStep: 5,//默认初始值的步长
                        ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
                        insuredUnit:'/元/天',//保额单位
                        ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
                        subResponsibilityData:[]
                    },{
                        riskshort:'意外住院津贴9',//险种名称
                        responsibilityNameCode:'1309',//险种名称代码
                        riskorder:9,//险种排序
                        ifMainInsurance:false,//是否为主险
                        defaultConfigurationStep:5,//默认配置的步长
                        trueConfigurationStep: 5,//默认初始值的步长
                        ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
                        insuredUnit:'/元/天',//保额单位
                        ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
                        subResponsibilityData:[]
                    },{
                        riskshort:'意外住院津贴10',//险种名称
                        responsibilityNameCode:'1307',//险种名称代码
                        riskorder:8,//险种排序
                        ifMainInsurance:false,//是否为主险
                        defaultConfigurationStep:5,//默认配置的步长
                        trueConfigurationStep: 5,//默认初始值的步长
                        ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
                        insuredUnit:'/元/天',//保额单位
                        ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
                        subResponsibilityData:[]
                    }]
                },{//所有的计划下的内容
                    risktype:'交通类',//类别
                    responsibilityCode:'18',//类别的代码
                    responsibilityData:[{
                        riskshort:'泰康意外险2',//险种名称
                        responsibilityNameCode:'1301',//险种名称代码
                        riskorder:1,//险种排序
                        ifMainInsurance:false,//是否为主险
                        defaultConfigurationStep:5,//默认配置的步长
                        trueConfigurationStep: 5,//默认初始值的步长
                        ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
                        insuredUnit:'/元/天',//保额单位
                        ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
                        subResponsibilityData:[]
                    },{
                        riskshort:'免费泰康意外险',//险种名称
                        responsibilityNameCode:'1302',//险种名称代码
                        riskorder:2,//险种排序
                        ifMainInsurance:false,//是否为主险
                        defaultConfigurationStep:5,//默认配置的步长
                        trueConfigurationStep: 5,//默认初始值的步长
                        ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
                        insuredUnit:'/元/天',//保额单位
                        ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
                        subResponsibilityData:[]
                    }]
                }]
            },
            mocData:[{//初始化
                        risktype:'医疗类',//类别
                        responsibilityCode:'12',//类别的代码
                        responsibilityData:[{
                            riskshort:'意外医疗',//险种名称
                            responsibilityNameCode:'1202',//险种名称代码
                            riskorder:3,//险种排序
                            ifMainInsurance:true,//是否为主险
                            defaultConfigurationStep:5,//默认配置的步长
                            trueConfigurationStep: 5,//默认初始值的步长
                            ifHaveSubResponsibility:false,//是否有子责任，true---有子责任  false---没有子责任
                            insuredUnit:'/万元',//保额单位
                            ifDefaultConfiguration:true,//如果有子责任，是否默认配置子责任，配置---true，不配置--false
                            subResponsibilityData:[]
                        }]
            }],
            information_3_falg:[]
        }
    },
    created(){
  
        if((!!localStorage.getItem('quotationInformation_3') && localStorage.getItem('quotationInformation_3')!='') ){
            this.getLocalStroage();
             let information_3_ = JSON.parse(localStorage.getItem('quotationInformation_3'));

            
            if(this.planName.length < information_3_.configurationResponsibility.length){
                //若果上一步删除了一个
                let resetInformation = JSON.parse(JSON.stringify(information_3_.configurationResponsibility))
                for(let p = 0; p < this.information_3_falg.length; p++){
                    if(!this.information_3_falg[p]){
                        resetInformation.splice(p,1)
                    }
                }
                localStorage.setItem("quotationInformation_3",JSON.stringify(resetInformation));
            }

        }else{
            //获取步骤一分配计划的计划名称
            if(!!localStorage.getItem('quotationInformation_2')&&localStorage.getItem('quotationInformation_2')!=''){
                    let information = JSON.parse(localStorage.getItem('quotationInformation_2'));
                    for(let j = 0; j < information.distributionPlan.length;j++){
                        this.planName.push(information.distributionPlan[j].activeName)
                    }
            }
            for(let i = 0; i < this.planName.length; i++){
                let tep = JSON.parse(JSON.stringify(this.mocData))
                this.configurationResponsibility.domains.push({
                    planName: this.planName[i],//计划名称
                    data:tep
                })
            } 
        }

        for(let i = 0; i < this.configurationResponsibility.domains.length;i++){
            if(i == 0){
                this.dynamicValidateFormOpen.push({open:true})
            }else{
                this.dynamicValidateFormOpen.push({open:false})
            } 
        }

        
    },
    methods:{
        //删除险种
        deleteItem: function(index,index1,index2){
            console.log(index,index1,index2);
            console.log(this.configurationResponsibility.domains[index].data[index1].responsibilityData[index2].ifMainInsurance);
            if (this.$refs['touchmove'][index1]) {
                this.$refs['touchmove'][index1].style.transform = "translateX(0px)";
            }
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
                    this.configurationResponsibility.domains[index].data[index1].responsibilityData.splice(index2,1);
                }else{
                    this.$alert('每个计划必须至少包含一个主险。本险种是本计划唯一的主险，不能删除。', '', {
                        confirmButtonText: '确定',
                        callback: action => {
                            
                        }
                    });
                }
            }else{
                this.configurationResponsibility.domains[index].data[index1].responsibilityData.splice(index2,1);
                
                if(this.configurationResponsibility.domains[index].data[index1].responsibilityData.length == 0){
                    this.configurationResponsibility.domains[index].data.splice(index1,1);
                }
            }
            
        },

        //复制险种到其他的计划里
        replicatedOk: function(){
            console.log(this.replicatedGroup);
             let planMuch = '';
            if(this.replicatedGroup.length != 0){
                for(let i = 0; i < this.replicatedGroup.length; i++){
                    if(i == this.replicatedGroup.length-1){
                        planMuch += '<span style="color:#5092fc">计划'+(this.replicatedGroup[i]+1)+'('+this.planName[this.replicatedGroup[i]]+')</span>'
                    }else{
                        planMuch += '<span style="color:#5092fc">计划'+(this.replicatedGroup[i]+1)+'('+this.planName[this.replicatedGroup[i]]+')</span>、'
                    }
                
                }
                let html = '<p>复制后，'+planMuch+'的责任 （有什么险种责任、保额分别是多少）全部改成跟<span style="color:#fd8423"> 计划'+(this.currentNeedAddResponsibility+1)+'('+this.planName[this.currentNeedAddResponsibility]+')</span>'+'一样。</p><br/>请问您确定复制吗？'
                this.$confirm( html, '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    let replicatedMock = JSON.parse(JSON.stringify(this.configurationResponsibility.domains[this.currentNeedAddResponsibility].data));
                    for(let i = 0; i < this.replicatedGroup.length; i++){
                        this.configurationResponsibility.domains[this.replicatedGroup[i]].data = replicatedMock;
                    }
                    this.replicatedScheduleDialogVisible = false;
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
            console.log(event);
            //获取当前点击按钮的计划位置
            this.currentNeedAddResponsibility = event;
            //打开对话框
            this.responsibilityDialogVisible = true;
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
                    for(let p = 0; p < cloneResponsibilityList[recodeSon].responsibilityData.length; p++){//responsibilityNameCode
                     //④匹配符合的，并去掉
                        if(convenientDomains.data[l].responsibilityData[u].responsibilityNameCode == cloneResponsibilityList[recodeSon].responsibilityData[p].responsibilityNameCode){//responsibilityNameCode
                            cloneResponsibilityList[recodeSon].responsibilityData.splice(p,1);
                            p--;
                        }
                    }
                    if(u==convenientDomains.data[l].responsibilityData.length-1){
                       if(cloneResponsibilityList[recodeSon].responsibilityData.length == 0){
                           cloneResponsibilityList.splice(recodeSon,1);
                       } 
                    }
                }
            }
            this.responsibilityList.allresponsibilityData = JSON.parse(JSON.stringify(cloneResponsibilityList)); 

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
            //获取当前计划的总体数据
            let nowHaveAllData = this.configurationResponsibility.domains[this.currentNeedAddResponsibility].data;
            //获取当前计划所拥有的类别
            let nowHaveResponsibility = [];
            for(let i = 0; i < nowHaveAllData.length; i++){
                nowHaveResponsibility.push(Number(nowHaveAllData[i].responsibilityCode));
            }
            //排序
            nowHaveResponsibility.sort();
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
        //上一步
        goPrev: function(){
            let quotationInformation = {"configurationResponsibility":this.configurationResponsibility.domains};
                localStorage.setItem("quotationInformation_3",JSON.stringify(quotationInformation));
            this.$router.go(-1);
        },
        //下一步
        goNext: function(){
            let quotationInformation = {"configurationResponsibility":this.configurationResponsibility.domains};
                localStorage.setItem("quotationInformation_3",JSON.stringify(quotationInformation));
                this.$router.push({path:'procedureThree'});
        },
        //从loclstroage里获取消息
        getLocalStroage:function(){
            if(!!localStorage.getItem('quotationInformation_3')&&localStorage.getItem('quotationInformation_3')!=''){
                let information = JSON.parse(localStorage.getItem('quotationInformation_3'));
                let information_2 = JSON.parse(localStorage.getItem('quotationInformation_2'));
                //对比第一步的顺序与暂存里的顺序对不对的上
                for(let i = 0; i < information_2.distributionPlan.length; i++){
                    //压入名字
                    this.planName.push(information_2.distributionPlan[i].activeName)
                }
                let tep;
                for(let j = 0; j < information.configurationResponsibility.length;j++){
                    this.information_3_falg.push(false);
                }
                 for(let k = 0; k < this.planName.length;k++){
                    let haveFalg = false
                    for(let j = 0; j < information.configurationResponsibility.length;j++){
                        // this.configurationResponsibility.domains.push(information.configurationResponsibility[j])

                        //对比名字
                        if(this.planName[k] == information.configurationResponsibility[j].planName){
                             tep = JSON.parse(JSON.stringify(information.configurationResponsibility[j]))
                             this.configurationResponsibility.domains.push({
                                planName: this.planName[k],//计划名称
                                data:tep.data
                            })
                            haveFalg = true;
                            this.information_3_falg[j] = true;
                        }
                    }
                    if(!haveFalg){
                        tep = JSON.parse(JSON.stringify(this.mocData))
                        this.configurationResponsibility.domains.push({
                            planName: this.planName[k],//计划名称
                            data:tep
                        })
                    }
                 }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
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
                margin: 5px 3px 10px 0px;
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
                vertical-align: baseline;
                padding-left: 1px;
            }
        }
        .content-clause-name{
            width: 105px;
            display: inline-block;
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
            width: 150px;
            height: 38px;
            border-radius: 5px;
            position: relative;
            overflow: hidden;
            margin-top: 35px;
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
.procedure-step{
    position: fixed;
    top: 45px;
    width: 100%;
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
</style>

<style lang="scss">
.procedure-two{
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
                padding: 10px 0;
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
            text-align: center;
            label{
                display: block;
                text-align: center;
                margin: 0 auto;
                margin-top: 10px;
                width: 200px;
                height: 38px;
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

}
</style>