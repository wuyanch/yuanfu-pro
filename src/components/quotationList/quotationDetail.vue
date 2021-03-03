<template>
    <div class="quotation-list-page">
        <enterprise-name :enterpriseCurCall="enterpriseCurName"></enterprise-name>
        <div class="quotation-detail">
            <div class="quotation-detail-content">
                <el-page-header @back="goBack" content="报价详情"></el-page-header>

                <!-- 展示内容区 -->
                <div class="preview-content">
                    <div class="preview-scroll" >
                        <div v-if="BusinessInformation.length != 0">
                            <!-- 核保结果 -->
                            <div class="preview-part">
                            <!-- 头部 -->
                            <div class="part-head">
                                <span>核保意见</span>
                                <img v-if="currentStatus == 1" :src="shenhe02" alt="" srcset="" class="gaiz">
                                <img v-else-if="currentStatus == 2" :src="shenhe01" alt="" srcset="" class="gaiz">
                                <img v-else-if="currentStatus == 3 || 4" :src="shenhe03" alt="" srcset="" class="gaiz">
                            </div>
                            <!-- 内容 -->
                            <div class="part-content part-unit">
                               
                                <div v-if="(currentStatus == 3 || currentStatus == 4) && InquiryResult.length != 0">
                                    <div v-if="InquiryResult[0].applyopinion != '' && InquiryResult[0].applyopinion != null">
                                        <p class="part-pre-title">核保意见</p>
                                        <p><b v-if="InquiryResult[0].conclusion == 4">通过，</b><b v-else>不通过，</b>{{InquiryResult[0].applyopinion}}</p>
                                    </div>
                                    <div v-if="InquiryResult[0].speagree != '' && InquiryResult[0].speagree != null">
                                        <p class="part-pre-title">特别约定</p>
                                        <p>{{InquiryResult[0].speagree}}</p>
                                    </div>
                                    <div v-if="InquiryResult[0].information != '' && InquiryResult[0].information != null">
                                        <p class="part-pre-title">核保资料</p>
                                        <p v-for="(inform,index) in InquiryResult[0].information" :key="index">
                                            <span>{{inform.type}} <span v-if="inform.remarks != ''">: {{inform.remarks}}</span></span><br/>
                                        </p>
                                    </div>
                                    <div v-if="InquiryResult[0].loseefficacytime != undefined && InquiryResult[0].loseefficacytime != null && InquiryResult[0].loseefficacytime != 'null'" class="baojia">
                                        <p class="part-pre-title">项目报价</p>
                                        <p class="confidential confidential-tip">注意：申请方案可能与批复方案不同，批复方案详见下表。</p>
                                        <ul class="part-suans">
                                            <li v-for="(item,index) in planHbFeeA" :key="index">
                                                <span>计划{{index+1}}</span>
                                                <span class="part-mony">{{item.allFee}}</span>
                                                <span class="part-mony-unit">元/人</span>
                                                <span class="part-mony-x">×</span>
                                                <span class="part-mony">{{item.num}}</span>
                                                <span class="part-mony-unit">人</span>
                                                <span>=</span>
                                                <span class="part-mony">{{item.planCalcFeeA | addDouHao}}</span>
                                                <span class="part-mony-unit">元</span>
                                            </li>
                                            <li class="part-li-last"><span>总计</span><span class="part-mony-all"> {{hbAllPlanFee | addDouHao}}<i> 元</i></span></li>
                                        </ul>
                                        <p>报价有效期：截止 {{InquiryResult[0].loseefficacytime instanceof Array?InquiryResult[0].loseefficacytime[0]+'-'+(InquiryResult[0].loseefficacytime[1]>9?InquiryResult[0].loseefficacytime[1]:'0'+InquiryResult[0].loseefficacytime[1])+'-'+InquiryResult[0].loseefficacytime[2]:InquiryResult[0].loseefficacytime.replace(/T/,' ').slice(0,16)}}</p>
                                    </div>
                                    <p class="underwriting-infor">核保人员/时间：{{InquiryResult[0].username}}/{{InquiryResult[0].createtime instanceof Array?InquiryResult[0].createtime[0]+'-'+(InquiryResult[0].createtime[1]>9?InquiryResult[0].createtime[1]:'0'+InquiryResult[0].createtime[1])+'-'+InquiryResult[0].createtime[2]+' '+InquiryResult[0].createtime[3]+':'+InquiryResult[0].createtime[4]+':'+InquiryResult[0].createtime[5]:InquiryResult[0].createtime.replace(/T/,' ').slice(0,16)}}</p>
                                </div>
                                <p class="confidential">内部签报，注意保密。请勿转发！</p>
                            </div>
                            </div>
                            <!-- 项目信息 -->
                            <div class="preview-part">
                           
                                <div class="part-head">
                                    <span>项目信息</span>
                                    <el-button  @click="changeBlock(0)"><span v-if="dynamicValidateFormOpen[0].open">收起</span><span v-else>展开</span></el-button>
                                
                                </div>
                                <div v-if="dynamicValidateFormOpen[0].open">
                                    <el-divider class ='headC'></el-divider>
                                    <!-- 单位信息 -->
                                    <div class="part-content part-unit" v-if="UnitInformation.length != 0">
                                        <div v-if="UnitInformation.isChange == false">
                                            <p class="part-pre-title">单位信息</p>
                                            <p><span>行业</span><span>：</span><span>{{UnitInformation.old.industry}}</span></p>
                                            <p><span>单位人数(人)</span><span>：</span><span>{{UnitInformation.old.unitnum}}</span></p>
                                        </div>
                                        <div v-else>
                                            <div>
                                                <p class="part-pre-title">提交时单位信息</p>
                                                <p><span>行业</span><span>：</span><span>{{UnitInformation.old.industry}}</span></p>
                                                <p><span>单位人数(人)</span><span>：</span><span>{{UnitInformation.old.unitnum}}</span></p>
                                            </div>
                                            <div>
                                                <p class="part-pre-title">目前的单位信息</p>
                                                <p><span>行业</span><span>：</span><span>{{UnitInformation.current.industry}}</span></p>
                                                <p><span>单位人数(人)</span><span>：</span><span>{{UnitInformation.current.unitnum}}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="part-content part-unit" v-else><p>没有获取到单位信息</p></div>
                                    <!-- 业务信息 -->
                                    <div class="part-content part-service" v-if="BusinessInformation.length != 0">
                                        <p class="part-pre-title">业务信息</p>
                                        <p><span>业务渠道</span><span>：</span><span>{{BusinessInformation.saleschannel}}</span></p>
                                        <p v-if="BusinessInformation.agencyname != null && BusinessInformation.agencyname != ''"><span>代理机构名称</span><span>：</span><span>{{BusinessInformation.agencyname}}</span></p>
                                        <p v-if="BusinessInformation.agencyfee != null && BusinessInformation.agencyfee != ''"><span>代理费</span>：<span>{{BusinessInformation.agencyfee}}</span></p>
                                        <p><span>拟投保总人数(人)</span><span>：</span><span>{{BusinessInformation.sum}}</span></p>
                                    </div>
                                    <div class="part-content part-service" v-else><p>没有获取到业务信息</p></div>
                                    <!-- 补充信息 -->
                                    <div class="part-content part-remark" v-if="BusinessInformation.length != 0">
                                        <p class="part-pre-title">补充信息</p>
                                        <p><span>备注</span><span>：</span><span v-if="BusinessInformation.sideinformation != null && BusinessInformation.sideinformation != ''">{{BusinessInformation.sideinformation}}</span><span v-else>--</span></p>
                                        <div>
                                            <span>上传图片</span><span>：</span>
                                            <div v-if="isPicList == true">
                                                <ul v-if="picList.length>0">
                                                    <li v-for="(item,index) in picList" :key="index">
                                                        <el-image 
                                                            style="width: 100px; height: 100px"
                                                            :src="item.url"
                                                            fit="cover"
                                                            :preview-src-list="PhotoList">
                                                        </el-image>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div v-else><i class="el-icon-loading"></i>正在加载中...</div>
                                        </div>
                                    </div>
                                    <div class="part-content part-remark" v-else><p>没有获取到业务信息</p></div>
                                </div>
                            </div>
                       
                     
                            <!-- 计划信息 -->
                            <div class="preview-part" v-for="(item1,index1) in aggregate" :key="index1">
                                
                                <div class="part-head">
                                    <span>计划{{index1+1}}({{item1.planname}})</span>
                                    <el-button  @click="changeBlock(index1+1)"><span v-if="dynamicValidateFormOpen[index1+1].open">收起</span><span v-else>展开</span></el-button>
                                </div>
                                <el-divider class ='headC'></el-divider>
                                <div class="part-content plan-pre" v-if="dynamicValidateFormOpen[index1+1].open"> 
                                    
                                    <div class="part-plan-inform plan-base">
                                        <p><span>人员类型</span><span>：</span><span>{{item1.ptype}}</span></p>
                                        <p><span>社保情况</span><span>：</span><span>{{item1.socialscy}}</span></p>
                                        <p><span>投保人数(人)</span><span>：</span><span>{{item1.insurenum}}</span></p>
                                        <p><span>平均年龄(岁)</span><span>：</span><span>{{item1.aveage}}</span></p>
                                        <p><span>职业类别</span><span>：</span><span>{{item1.jobtype}}</span></p>
                                        <p><span>工种描述</span><span>：</span><span>{{item1.worktype}}</span></p>
                                    </div> 
                                    <!-- 未审核完成 1/2 -->
                                    <div v-if="currentStatus == 1 ||currentStatus == 2 " class="plan-deploy">
                                        <div class="basic-information" v-for="(item2,index2) in item1.inquiryVoList" :key="index2">
                                            <el-divider>{{item2.typename}}</el-divider>
                                            <div>
                                                <ul v-for="(item3,index3) in item2.riskListVo" :key="index3">
                                                    <li v-if="item3.confoption == 0"> 
                                                    <!-- 没有子责任 -->
                                                    <div v-for="(item41,index41) in item3.respList" :key="index41">
                                                            <div class="kind-title-1"><span>{{item41.respshort}}：</span>
                                                                <span><span class="mony">
                                                                    <span class="mony-before">{{item41.insureamount | numFilterBefore}}</span>.<span class="mony-after">{{item41.insureamount | numFilterAfter}}</span>
                                                                    </span> {{item41.amountunit}}</span>
                                                                <div  v-if="item41.confList != null">
                                                                    <p class="kind-explain-1 desc kind-explain-nochild" v-for="(item41_sub,index41_sub) in item41.confList" :key="index41_sub">
                                                                        <span>{{item41_sub.levelname}}:</span>
                                                                        <span>
                                                                            {{item41_sub.levelvalue}}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li v-else> 
                                                        <!-- 有子责任 -->
                                                        <div class="kind-title-1"><span>{{item3.riskshort}}：</span>
                                                            <p v-if="item3.riskcode == 110" class="yl-comm">门诊、住院是否共用保额：
                                                                <span v-if="item3.shareamount ==1">是</span><span v-else>否</span>
                                                                <span v-if="item3.riskcode == 110 && item3.shareamount == 1">
                                                                    <span v-if="item3.respList[0].respcode == '110002'">
                                                                        <span v-if="item3.respList[1].insureamount > item3.respList[2].insureamount">
                                                                            (共用额度：<span class="mony"><span class="mony-before">{{item3.respList[1].insureamount | numFilterBefore}}</span>.<span class="mony-after">{{item3.respList[1].insureamount | numFilterAfter}}</span></span>万元)</span>
                                                                        <span v-else>(共用额度：<span class="mony"><span class="mony-before">{{item3.respList[2].insureamount | numFilterBefore}}</span>.<span class="mony-after">{{item3.respList[2].insureamount | numFilterAfter}}</span></span>万元)</span>
                                                                    </span>
                                                                    <span v-else>
                                                                            <span v-if="item3.respList[0].insureamount > item3.respList[1].insureamount">
                                                                            (共用额度：<span class="mony"><span class="mony-before">{{item3.respList[0].insureamount | numFilterBefore}}</span>.<span class="mony-after">{{item3.respList[0].insureamount | numFilterAfter}}</span></span>万元)</span>
                                                                        <span v-else>(共用额度：<span class="mony"><span class="mony-before">{{item3.respList[1].insureamount | numFilterBefore}}</span>.<span class="mony-after">{{item3.respList[1].insureamount | numFilterAfter}}</span></span>万元)</span>
                                                                    </span>
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div  v-for="(item42,index42) in item3.respList" :key="index42">
                                                            <div v-if="item42.insureamount > 0 && item42.subIfDefaultConfiguration == true">
                                                                <p class="kind-title-1 kind-explain-1"><span>{{item42.respshort}}：</span>
                                                                    <span>
                                                                        <span class="mony"><span class="mony-before">{{item42.insureamount | numFilterBefore}}</span>.
                                                                        <span class="mony-after">{{item42.insureamount | numFilterAfter}}</span></span> {{item42.amountunit}}
                                                                    </span>
                                                                </p>
                                                                <div class="kind-explain-1 kind-explain-2 desc" v-if="item42.confList != null">
                                                                    <p  v-for="(item42_sub,index42_sub) in item42.confList" :key="index42_sub">
                                                                    <span>{{item42_sub.levelname}}:</span>
                                                                        <span><span v-if="item42_sub.levelvalue < 0">按照社保标准</span><span v-else>{{item42_sub.levelvalue}}</span>
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

                                    <!-- 险种责任 已审核3/4-->
                                    <div v-else class="plan-deploy">
                                        <div class="basic-information" v-for="(item2,index2) in item1.inquiryVoList" :key="index2">
                                            <el-divider>{{item2.typename}}</el-divider>
                                            <div>
                                                <ul v-for="(item3,index3) in item2.riskListVo" :key="index3">
                                                    <li v-if="item3.confoption == 0"> 
                                                    <!-- 没有子责任 -->
                                                    <div v-for="(item41,index41) in item3.respList" :key="index41">
                                                            <div class="kind-title-1"><span>{{item41.respshort}}：</span>
                                                                <span v-if="item41.hbinsureamount != null"><i class="after-hbchange"><span class="mony"><span class="mony-before">{{item41.hbinsureamount | numFilterBefore}}</span>.<span class="mony-after">{{item41.hbinsureamount | numFilterAfter}}</span></span> {{item41.amountunit}}</i>
                                                                    <el-tooltip placement="top" class="item" effect="dark" v-if="item41.hbinsureamount != item41.insureamount">
                                                                        <div slot="content">申请设置条件为：{{item41.insureamount}}</div>
                                                                        <el-button class="hbchange"><i class="el-icon-warning-outline"></i>该数值核保有改动</el-button>
                                                                    </el-tooltip>
                                                                </span>
                                                                <span v-else><span class="mony"><span class="mony-before">{{item41.insureamount | numFilterBefore}}</span>.<span class="mony-after">{{item41.insureamount | numFilterAfter}}</span></span> {{item41.amountunit}}</span>
                                                                <span class="hb-money"  v-if="item41.hbamount != null"><i class="hb-money-f">￥</i><span class="mony"><span class="mony-before">{{item41.hbamount | numFilterBefore}}</span>.<span class="mony-after">{{item41.hbamount | numFilterAfter}}</span></span></span>
                                                            
                                                                <div  v-if="item41.confList != null">
                                                                    <p class="kind-explain-1 desc kind-explain-nochild" v-for="(item41_sub,index41_sub) in item41.confList" :key="index41_sub">
                                                                        <span>{{item41_sub.levelname}}:</span>
                                                                        <span v-if="item41_sub.hbvalue != null"><i class="after-hbchange">{{item41_sub.hbvalue}}</i>
                                                                            <el-tooltip placement="top" class="item" effect="dark" v-if="item41_sub.hbvalue != item41_sub.levelvalue">
                                                                                <div slot="content">申请设置条件为：{{item41_sub.levelvalue}}</div>
                                                                                <el-button class="hbchange"><i class="el-icon-warning-outline"></i>该数值核保有改动</el-button>
                                                                            </el-tooltip>
                                                                        </span>
                                                                        <span v-else>
                                                                            {{item41_sub.levelvalue}}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li v-else> 
                                                        <!-- 有子责任 -->
                                                        <div class="kind-title-1"><span>{{item3.riskshort}}：</span>
                                                            <p v-if="item3.riskcode == 110" class="yl-comm">门诊、住院是否共用保额：
                                                                <span v-if="item3.shareamount ==1">是</span><span v-else>否</span>
                                                                <span v-if="item3.riskcode == 110 && item3.shareamount == 1 && item3.hbinsureamount == null">
                                                                    <span v-if="item3.respList[0].respcode == '110002'">
                                                                        <span v-if="item3.respList[1].insureamount > item3.respList[2].insureamount">
                                                                            (共用额度：<span class="mony"><span class="mony-before">{{item3.respList[1].insureamount | numFilterBefore}}</span>.<span class="mony-after">{{item3.respList[1].insureamount | numFilterAfter}}</span></span>万元)</span>
                                                                        <span v-else>(共用额度：<span class="mony"><span class="mony-before">{{item3.respList[2].insureamount | numFilterBefore}}</span>.<span class="mony-after">{{item3.respList[2].insureamount | numFilterAfter}}</span></span>万元)</span>
                                                                    </span>
                                                                    <span v-else>
                                                                            <span v-if="item3.respList[0].insureamount > item3.respList[1].insureamount">
                                                                            (共用额度：<span class="mony"><span class="mony-before">{{item3.respList[0].insureamount | numFilterBefore}}</span>.<span class="mony-after">{{item3.respList[0].insureamount | numFilterAfter}}</span></span>万元)</span>
                                                                        <span v-else>(共用额度：<span class="mony"><span class="mony-before">{{item3.respList[1].insureamount | numFilterBefore}}</span>.<span class="mony-after">{{item3.respList[1].insureamount | numFilterAfter}}</span></span>万元)</span>
                                                                    </span>
                                                                </span>
                                                                <span v-if="item3.riskcode == 110 && item3.shareamount == 1 && item3.hbinsureamount != null">
                                                                    <span v-if="item3.respList[0].respcode == '110002'">
                                                                        <span v-if="item3.respList[1].hbinsureamount > item3.respList[2].hbinsureamount">
                                                                            (共用额度：<span class="mony"><span class="mony-before">{{item3.respList[1].hbinsureamount | numFilterBefore}}</span>.<span class="mony-after">{{item3.respList[1].hbinsureamount | numFilterAfter}}</span></span>万元)</span>
                                                                        <span v-else>(共用额度：<span class="mony"><span class="mony-before">{{item3.respList[2].hbinsureamount | numFilterBefore}}</span>.<span class="mony-after">{{item3.respList[2].hbinsureamount | numFilterAfter}}</span></span>万元)</span>
                                                                    </span>
                                                                    <span v-else>
                                                                            <span v-if="item3.respList[0].hbinsureamount > item3.respList[1].hbinsureamount">
                                                                            (共用额度：<span class="mony"><span class="mony-before">{{item3.respList[0].hbinsureamount | numFilterBefore}}</span>.<span class="mony-after">{{item3.respList[0].hbinsureamount | numFilterAfter}}</span></span>万元)</span>
                                                                        <span v-else>(共用额度：<span class="mony"><span class="mony-before">{{item3.respList[1].hbinsureamount | numFilterBefore}}</span>.<span class="mony-after">{{item3.respList[1].hbinsureamount | numFilterAfter}}</span></span>万元)</span>
                                                                    </span>
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div  v-for="(item42,index42) in item3.respList" :key="index42">
                                                            <div v-if="item42.insureamount > 0 && item42.subIfDefaultConfiguration == true">
                                                                <p class="kind-title-1 kind-explain-1"><span>{{item42.respshort}}：</span><span><span class="mony"><span class="mony-before">{{item42.insureamount | numFilterBefore}}</span>.<span class="mony-after">{{item42.insureamount | numFilterAfter}}</span></span> {{item42.amountunit}}</span><span class="hb-money" v-if="item42.hbamount != null"><i class="hb-money-f">￥</i><span class="mony"><span class="mony-before">{{item42.hbamount | numFilterBefore}}</span>.<span class="mony-after">{{item42.hbamount | numFilterAfter}}</span></span></span></p>
                                                                <div class="kind-explain-1 kind-explain-2 desc" v-if="item42.confList != null">
                                                                    <p  v-for="(item42_sub,index42_sub) in item42.confList" :key="index42_sub">
                                                                    <span>{{item42_sub.levelname}}:</span>
                                                                        <span v-if="item42_sub.hbvalue != null"><i class="after-hbchange" v-if="item42_sub.hbvalue < 0">按照社保标准</i><i v-else class="after-hbchange">{{item42_sub.hbvalue}}</i>
                                                                            <el-tooltip placement="top" class="item" effect="dark" v-if="item42_sub.hbvalue != item42_sub.levelvalue">
                                                                                <div slot="content">申请设置条件为：{{item42_sub.levelvalue}}</div>
                                                                                <el-button class="hbchange"><i class="el-icon-warning-outline"></i>该数值核保有改动</el-button>
                                                                            </el-tooltip>
                                                                        </span>
                                                                        <span v-else><span v-if="item42_sub.levelvalue < 0">按照社保标准</span><span v-else>{{item42_sub.levelvalue}}</span>
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
                                    <div class="plan-base" >
                                        <p v-if="currentStatus == 1 || currentStatus == 2">本计划期望保费(元/人)：<span class="mony"><span class="mony-before">{{item1.premium | numFilterBefore}}</span>.<span class="mony-after">{{item1.premium | numFilterAfter}}</span></span></p>
                                        <div v-else>
                                            <span>合计保费：<span class="mony"><span class="mony-before">{{planHbFeeA[index1].allFee | numFilterBefore}}</span>.<span class="mony-after">{{planHbFeeA[index1].allFee | numFilterAfter}}</span></span>元/人 × {{planHbFeeA[index1].num}}人 = {{planHbFeeA[index1].planCalcFeeA | addDouHao}} 元</span>
                                            <el-tooltip placement="top" class="item" effect="dark">
                                                <div slot="content">申请设置条件为：{{item1.premium}}(元/人)</div>
                                                <el-button class="hbchange"><i class="el-icon-warning-outline"></i>原申请保费</el-button>
                                            </el-tooltip>
                                        </div>
                                    </div> 
                                </div>
                            </div> 
                        </div>
                        <div v-else class="no-success">
                            <p><i class="el-icon-loading"></i>正在拼命加载中，请稍等</p>
                        </div>
                    </div>
                </div>
                <el-backtop target=".preview-content .preview-scroll" :bottom="10" :right="10"  :visibility-height="100"></el-backtop>
            </div>
             
        </div>
        
    </div>
</template>

<script>
import { nextTick } from 'process';
import enterpriseName from '../quotationProcess/processEnterpriseName.vue'
export default {
    name:'quotationDetail',
    components:{enterpriseName},
    data(){
        return{
            enterpriseCurName:'',
            currentId:'',//当前选中需要查看的企业的ID
            currentStatus:null,//当前选中需要查看的企业的状态
            dynamicValidateFormOpen:[{open:false}],
            aggregate:[],//计划信息
            BusinessInformation:[],//业务信息
            UnitInformation:[],//单位信息
            InquiryResult:[],//核保意见
            planHbFeeA:[],//计算审核通过之后的保费
            shenhe01:require('../../assets/img/shenhe01.png'),
            shenhe02:require('../../assets/img/shenhe02.png'),
            shenhe03:require('../../assets/img/shenhe03.png'),
            hbAllPlanFee:0,
            PhotoList:[],//存图片列表
            picList:[],//存图片
            isPicList:false,
        }
    },
    created(){
        this.currentId = this.$route.query.id;
        this.currentStatus = this.$route.query.status;
        this.enterpriseCurName = localStorage.getItem('YF_mainstream_project');
        this.getAllContent();
        console.log(this.currentId, this.currentStatus)
    },
    methods:{
        // 取出图片列表
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
            this.$axios.get('/index/list/image',{
                    params:{
                        proserialno: this.currentId,
                        rand:new Date().getTime()
                    }
                },{
                'Content-Type':'application/json'
            }).then(res =>{
                    //  成功
                    console.log(res);
                    console.log('333');
                    this.isPicList = true;
                    if(res.data.code=="200"){
                        if( res.data.data != null){
                             res.data.data.forEach(function(current,index){
                            // that.$set(current,"status",'success');//改变状态位
                                current.status = 'success';
                            })
                            this.picList = res.data.data;
                            this.getPhotoList();
                        }
                    }else{
                       
                    }
                }).catch(error =>{
                    this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                        confirmButtonText:'好的，我明白了'
                    }).catch(()=>{})
                })
        },
        //返回上一步
        goBack: function(){
            this.$router.go(-1);
        },
        getAllContent: function(){
            this.getUnitInformation();//单位信息内容
            this.getBusinessInformation();//业务信息内容
            this.getInquiryPlan();//计划信息内容
            this.getInquiryResult();//核保意见
            this.getListPhoto();//获取图片
        },
        //获取需要展示的 核保意见
        getInquiryResult: function(){
            let that = this;
            this.$axios.get('/index/getInquiryResult',{
                params:{
                    proserialno: this.currentId,
                    random: new Date().getTime()
                }
            }).then(response=>{
                console.log(response);
                if(response.data.code == 200 && response.data.data != null){
                    that.InquiryResult.push(response.data.data);
                    console.log(that.InquiryResult);
                }
            }).catch(error =>{
                this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                    confirmButtonText:'好的，我明白了'
                }).catch(()=>{})
            })
        },
        //获取需要展示的 单位信息内容
        getUnitInformation: function(){
            let that = this;
            this.$axios.get('/index/getInquiryUnitInformation',{
                params:{
                    proserialno: this.currentId,
                    random: new Date().getTime()
                }
            }).then(response=>{
                console.log(response);
                if(response.data.code == 200){
                    that.UnitInformation = response.data.data;
                    console.log(that.UnitInformation);
                }
            }).catch(error =>{
                this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                    confirmButtonText:'好的，我明白了'
                }).catch(()=>{})
            })
        },
        //获取需要展示的 业务信息内容
        getBusinessInformation: function(){
            let that = this;
            this.$axios.get('/index/getInquiryBusinessInformation',{
                params:{
                    proserialno: this.currentId,
                    random: new Date().getTime()
                }
            }).then(response=>{
                console.log(response);
                if(response.data.code == 200){
                    that.BusinessInformation = response.data.data;
                    console.log(that.BusinessInformation);
                    // that.getPhotoList();
                }
            }).catch(error =>{
                this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                    confirmButtonText:'好的，我明白了'
                }).catch(()=>{})
            })
        },
        //获取需要展示的 计划信息内容
        getInquiryPlan: function(){
            let that = this;
            this.$axios.get('/index/getInquiryPlan',{
                params:{
                    proserialno: this.currentId,
                    random: new Date().getTime()
                }
            }).then(response=>{
                console.log(response);
                if(response.data.code == 200){
                    that.aggregate = response.data.data;
                    that.calculationPremium(response.data.data); //计算保费
                    that.calcFormOpen(response.data.data);//计算dynamicValidateFormOpen
                    console.log(that.aggregate);
                }
            }).catch(error =>{
                this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                    confirmButtonText:'好的，我明白了'
                }).catch(()=>{})
            })
        },
        //计算保费
        calculationPremium: function(param){
            let that = this;
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
                planCalcFee = current.insurenum*planHbFee;
                that.hbAllPlanFee += planCalcFee;
                that.planHbFeeA.push({
                    num:current.insurenum,
                    allFee:planHbFee,
                    planCalcFeeA:planCalcFee
                })
            });
        },
        //计算dynamicValidateFormOpen
        calcFormOpen: function(param){
            let that = this;
            param.forEach((current,index) => {
                that.dynamicValidateFormOpen.push({open:false})
            })
        },
        //展开-收起
        changeBlock: function(event){
          this.dynamicValidateFormOpen[event].open = !this.dynamicValidateFormOpen[event].open;
        }
        
    },
    //变换数字
    filters: {
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
        addDouHao: function(value){
            let newPrice = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g,'$1,')
            return newPrice
        }
    }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
    width: 0px;
}
.quotation-detail{
    margin-top: 50px;
    padding: 0px 10px 5px 10px; 
    height: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
}
.quotation-list-page, .quotation-detail-content{
    height: 100%;
}
.no-success{
    font-size: 12px;
    text-align: center;
    margin-top: 167px;
}
.preview-content{
    overflow: hidden;
    height: calc(100vh - 100px);
    .gaiz{
        // position: absolute;
        right: 0;
        // top: 0;
        width: 80px;
        position: fixed;
        top: 50px;
        z-index: 1;
    }
    .preview-scroll{
        height: 100%;
        overflow: scroll;
    }
    .preview-part{
        background: #fff;
        margin-top: 10px;
        margin-bottom: 20px;
        position: relative;
        border-radius: 5px;
        &:first-child{
            margin-top: 0;
        }
        .part-head{
            font-size: 13px;
            position: relative;
            // padding: 5px 10px;
            padding: 10px 80px 10px 10px;
            button{
                font-size: 12px;
                padding: 8px 20px;
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                border: 1px solid #62b4ff;
                color: #62b4ff;
            }
        }
    }
    .yl-comm{
        display: inline-block;
        text-align: right;
        font-size: 11px;
    }
    .part-content{
         padding:2px  10px;
        // border-top: 1px solid #bfbfbf;
        ul{
            list-style-type: none;
        }
        .view-time{
            position: absolute;
            right: 15px;
            bottom: 10px;
        }
        .underwriting-infor{
            font-size: 11px;
            color: #bfbfbf;
            text-align: right;
        }
        .part-pre-title{
            font-weight: 700;
            font-size: 11px;
            position: relative;
            margin-top: 10px;
            &::before{
                content: '';
                // border-left:6px solid transparent;
                // border-right:6px solid transparent;
                // border-top:6px solid #ededed;
                // border-bottom:6px solid transparent;
                position: absolute;
                width: 4px;
                height: 15px;
                background: #fabc53;
                left: -10px;
                top: 3px;
            }
        }
        .part-suans{
            padding: 0 10px;
            margin-top: 10px;
            li{
                padding: 5px 10px;
                &:nth-child(odd){
                    background: #eff3fd;;
                }
            }
            
        }
        .part-mony{
            display: inline-block;
            min-width: 40px;
            font-weight: 700;
            text-align: right;
        }
        .part-mony-unit{
            font-size: 10px;

        }
        .part-mony-x{
            display: inline-block;
            width: 20px;
            text-align: right;
        }
        .part-li-last{
            border-top: 1px solid #bfbfbf;
        }
        .part-mony-all{
            width: 228px;
            // display: inline-block;
            text-align: right;
            float: right;
            margin-right: 5px;
            font-weight: 700;
            i{
                font-weight: 400;
                font-size: 10px;
                font-style: normal;
            }
        }
    }
    .mony{
        color: #f5b556;
    }
    .mony-before{
        font-size: 12.5px;
        // font-weight: 700;
    }
    .mony-after{
        font-size: 10px;
    }
   
    .part-unit{
        position: relative;
        .confidential{
            color: red;
            // color:#57b7aa;
            text-align: center;
        }
        p{
            padding: 3px 0;
        }
        .baojia{
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
                &:nth-child(2){
                    font-size: 13px;
                }
            }
        }
        
        .confidential-tip{
            text-align: left;
            font-size: 10px !important;
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
                min-width: 74px;
                min-height: 74px;
                display: inline-block;
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
.preview-scroll{
    font-size: 12px;
    padding: 0 10px;
}
.plan-base{
    padding-top: 10px;
    padding-bottom: 5px;
    .hbchange{
        border: none;
        font-size: 12px;
        padding: 5px 5px;
        color: #62b4ff;
        text-decoration: #62b4ff;
    }
    .hb-money{
        // color: red;
        color:#57b7aa;
        float: right;
        line-height: 20px;
        position: relative;
        font-size: 13px;
        font-weight: 700;
        .hb-money-f{
            font-style: normal;
            font-size: 11px;
            position: absolute;
            top: -4px;
            left: -10px;
        }
    }
}
.basic-information{
    font-size: 12px;
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
            margin-top: 10px;
            div{
                margin-top: 5px;
                position: relative;
                .desc{
                    font-size: 11px;
                    span{
                        padding: 3px 0;
                    }
                }
                div.kind-explain-nochild{
                    margin-top: 5px;
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
                width: 7rem;
                padding-left: 1em;
                // margin-top: .15rem;
                span{
                    text-indent: 0;
                }
            }
           
            .kind-explain-2{
                margin-left: 2em;
                // padding-left: 2em;
            }
            .kind-explain-1>p{
                line-height: 10px;
                margin-top: 5px;
            }
            div.kind-explain-nochild{
                margin-top: 5px;
            }
            .after-hbchange{
                // color: red;
                color:#232323;
                font-style: normal;
            }
            .hbchange{
                border: none;
                font-size: 12px;
                padding: 5px 5px 5px 2px;
                color: #62b4ff;
                text-decoration: #62b4ff;
                background: inherit;
            }
            .hb-money{
                color: #eb2020;
                // color:#57b7aa;
                float: right;
                line-height: 20px;
                top: 0;
                position: absolute;
                right: 0;
                font-size: 13px;
                font-weight: 700;
                .hb-money-f{
                    font-style: normal;
                    font-size: 10px;
                    position: absolute;
                    top: -4px;
                    left: -10px;
                }
                .mony{
                    color: #eb2020;
                }
            }
        }
    }
}
</style>

<style lang="scss">
.quotation-detail{
    .el-page-header{
        padding: 5px 0;
    }
    .el-page-header__left{
        color: #5695fc;
    }
    .el-page-.el-page-header__left::after{
        background: #5695fc;
    }
    .el-page-header__title{
        font-size: 13px
    }
    .el-page-header__content{
        font-size: 12px;
        color: #373737;
    }
    .el-collapse-item__header{
        border-radius: 10px;
        padding: 0 10px 0px 5px;
    }
    .el-collapse-item__header.is-active{
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom: 1px solid #bfbfbf;
    }
    .el-collapse-item__content{
        padding: 10px 5px;
    }
    .el-divider--horizontal{
        margin: 20px 0;
    }
    .headC.el-divider--horizontal{
        margin: 3px 0;
    }
    .el-divider{
        background-color: #ededed;
    }
    .el-divider__text{
        font-size: 11px;
    }
    .el-page-header__left .el-icon-back{
        margin-right: 0;
        margin-left: 10px;
    }
    .el-icon-back:before{
        content: "\E6DE";
    }
    .el-icon-circle-close:before{
        color: #fca50c;
    }
}
</style>