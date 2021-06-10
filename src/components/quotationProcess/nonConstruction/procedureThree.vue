<template>
    <div class="procedure-three" vkshop-event-scope="非建工险-设置条件(3)">
        <!-- 进度条 -->
        <div class="procedure-step">
            <el-steps 
            :active="active_step" 
            finish-status="success"
            align-center>
                <el-step title="分配计划"></el-step>
                <el-step title="配置责任"></el-step>
                <el-step title="设置条件"></el-step>
            </el-steps>
        </div>

        <!-- 主体内容 -->
        <div class="set-conditions">
            <div class="scroll-conditions">
                <!-- 计划 -->
                <div class="no-mean">
                    <!-- 每个计划 -->
                    <div class="pre-conditions" v-for="(item,index) in conditionsList.domains" :key="index">
                        <div class="procedure-corner-mark"><span>计划{{index+1}}({{item.planName}})</span></div>
                        <!-- 可展开块 -->
                        <div v-if="dynamicValidateFormOpen[index].open" class="plan-condition">
                            <div v-if="item.data.length > 0">
                                <div class="conditions" v-for="(item1,index1) in item.data" :key="index1">
                                    <el-divider>{{item1.risktype}}</el-divider>
                                    <div v-if="item1.responsibilityData.length != 0">
                                        <ul v-for="(item2,index2) in item1.responsibilityData" :key="index2">
                                            <li class="part-li">
                                                <p class="part-li-title">{{item2.riskshort}}</p>
                                                <div class="level-btn" >
                                                    <button @click="changeLevel(index,index1,index2,0,$event)" :class="[item2.level[0].levelcode == 'L'? 'active':'']">低档</button><button @click="changeLevel(index,index1,index2,1,$event)" :class="[item2.level[0].levelcode == 'M'?'active':'']">中档</button><button @click="changeLevel(index,index1,index2,2,$event)" :class="[item2.level[0].levelcode == 'H'?'active':'']">高档</button><button @click="changeLevel(index,index1,index2,3,$event)" :class="[item2.level[0].levelcode == 'Z'?'active':'']">自定义</button><button v-if="conditionsList.domains.length >= 2" class="fz-button" @click="copyTo(index,index1,index2,$event)"  vkshop-event-name="复制其他计划" vkshop-event-type="click">复制其他计划</button>
                                                </div>
                                                <!-- 显示的档次的配置    -->
                                                <div class="grade-content" >
                                                    <ul v-for="(content,indexC) in item2.level" :key="indexC">
                                                        <li v-for="(contentSon,indexCSon) in content.resp_conditionList" :key="indexCSon">
                                                            <div class="condition-content">
                                                                <span class="resp-span">{{contentSon.resp_condition}}：</span>
                                                                <span v-if="content.levelcode != 'Z' && content.levelcode != 'L' ">{{contentSon.levelvalue}}</span>
                                                                <span v-else-if="content.levelcode != 'Z'  && content.levelcode == 'L' &&  contentSon.resp_condition != '床位费日限额(元)'">{{contentSon.levelvalue}}</span>
                                                                <span v-else-if="content.levelcode == 'L' &&  contentSon.resp_condition == '床位费日限额(元)'">按照社保标准</span>
                                                                <div v-else-if="(content.levelcode == 'Z' || content.levelcode == 'L') && contentSon.resp_condition == '床位费日限额(元)'" class="exp-edit">
                                                                    <span>是否按照社保标准  </span><el-switch
                                                                        active-color="#6db9fe"
                                                                        inactive-color="#d4d4d4"
                                                                        v-model="contentSon.isnorm"
                                                                        @change="isnormQ(contentSon.isnorm,index,index1,index2,indexCSon)"
                                                                        :disabled="editSuccessList[index][index1][index2] ? false : 'disabled'">
                                                                    </el-switch>
                                                                    <label class="standard-span" v-if="contentSon.isnorm == false">日限额(元）：<el-input type="number" v-model.number.trim="contentSon.levelvalue"  @focus="handleFocus" @blur="handleblur"  autocomplete="off" :readonly="editSuccessList[index][index1][index2] ? false : 'readonly'"></el-input></label>
                                                                </div>
                                                               
                                                                <div v-else-if="content.levelcode == 'Z'" class="self-edit">
                                                                    <el-input type="number" v-if="content.levelcode == 'Z'  && editSuccessList[index][index1][index2] == true"  @focus="handleFocus" @blur="handleblur"   v-model.trim="contentSon.levelvalue" autocomplete="off"></el-input>
                                                                    
                                                                    <span v-else>{{contentSon.levelvalue}}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <button class="edit-btn" v-if="content.levelcode == 'Z' && editSuccessList[index][index1][index2] == false"  @click="edit(index,index1,index2)">编辑</button><button class="edit-btn" v-if="content.levelcode == 'Z' && editSuccessList[index][index1][index2] == true" @click="editSuccess(index,index1,index2)" >完成</button>
                                                    </ul>
                                                    
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="no-condition">
                                <p>本计划无需“配置条件”的责任</p>
                            </div>
                        </div>
                        <!-- 可展开块 -->
                        <!-- 展开收起按钮 -->
                        <div class="if-open">
                            <el-button @click="changeBlock(index)"><i v-if="dynamicValidateFormOpen[index].open" class="el-icon-arrow-up" ></i><i v-else class="el-icon-arrow-down" ></i></el-button>
                        </div>
                    </div>

                </div>
            </div>
        </div>

         <!-- 弹框显示可添复制的计划 -->
        <el-dialog
        :visible.sync="replicatedScheduleDialogVisible"
        width="100%"
        center
        :show-close=false
        class="pDialog">
        <div slot="title" class="dialog-title">我要复制以下计划的<span style="color:#fd8423">{{planResponsibility}}</span>条件：<br/><span class="dialog-tip"><i class="tip-red">*</i>说明：只能从有{{planResponsibility}}责任的计划复制。</span></div>
            <div class="group-radio" v-if="replicatedDialogVisibleList.length != 0">
                <el-radio-group v-model="replicatedGroup" size="medium">
                    <el-radio v-for="(item,index) in replicatedDialogVisibleList" :key="index" :label="index" border>计划{{item.planNum+1}}({{item.name}})</el-radio>
                </el-radio-group>
            </div>
            <div v-else>
                <p>其他计划没有该责任项，无法通过“复制”进行责任条件配置。</p>
            </div>
            <span slot="footer" class="dialog-footer">
               
                <p class="tip" v-if="replicatedGroup.length != 0"><span class="tip-red">*</span> 即<span class="tip-red">计划{{firstIndex+1}}({{conditionsList.domains[firstIndex].planName}})</span>的
                <span style="color:#fd8423">{{planResponsibility}}</span> 责任条件要改成与<span class="tip-red">计划{{replicatedDialogVisibleList[replicatedGroup].planNum+1}}({{replicatedDialogVisibleList[replicatedGroup].name}})</span>一样。</p>
               
                <el-button @click="replicatedScheduleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="replicatedOk"><span v-if="replicatedGroup.length == 0">确 认</span><span v-else>确 认 复 制</span></el-button>
            </span>
        </el-dialog>


        <!-- 固定在下方的按钮 -->
        <div class="procedure-btn">
            <button @click="goHome" vkshop-event-name="返回主页" vkshop-event-type="click">返回主页</button><button @click="goPrev"  vkshop-event-name="上一步" vkshop-event-type="click">上一步</button><button @click="tempStorage" vkshop-event-name="暂存" vkshop-event-type="click" v-loading="loading" :disabled="loading" element-loading-spinner="el-icon-loading"  element-loading-text="拼命暂存中" :class="{ loadingFont : loading}">暂存</button><button @click="goNext"  vkshop-event-name="下一步" vkshop-event-type="click">下一步</button>
        </div>
    </div>
</template>

<script>
import { parse } from 'querystring';
export default {
    name:'procedureThree',
    data(){
        return{
            active_step:2,
            active:'active',
            textareaRemarks:'',
            fileList:[],//上传列表
            conditionsList:{domains:[]},//配置列表
            conditionsListOrigin:{domains:[]},//配置列表原始数据
            conditionsListAll:[],//存储配置的所有内容
            dynamicValidateFormOpen:[],
            editSuccessList:[],//编辑之后是否点击完成
            planResponsibility:'',//需要复制的计划责任名称
            replicatedScheduleDialogVisible:false,//对话框是否出来
            replicatedDialogVisibleList:[],//展示可以选择的内容
            replicatedGroup:'',//单选
            copyToName : [],//可以被复制的压入名字
            copyToArray1: [],//可以被复制的压入这里第一层
            copyToArray2: [],//可以被复制的压入这里第二层
            copyToArray3 : [],//可以被复制的压入这里第三层
            eventT:'',
            firstIndex:'',
            secIndex:'',
            threeIndex:'',
            information_3_falg:[],//为缓存里计划对不对的上的flag
            planNameT:[],//将上一步的名字压进去
            plancodeT:[],//将上一步的计划编码压进去
            planInsure:[],//将上一步的险种code大类压进去
            loading:false,//点击暂存出现的圈圈
            foucesTimer:null,//ios键盘回落参数
        }
    },
    created(){
        this.getRespConByRiskCode();
    },
    methods:{
        //是否按照社保标准
        isnormQ: function(newValue,index,index1,index2,indexCSon){
            // console.log("isnorm");
            console.log(newValue);
            console.log(index,index1,index2,indexCSon)
            var that = this;
            this.$nextTick(()=> {
                if(newValue == true){//旧值为false，新值为true
                    that.$set(that.conditionsList.domains[index].data[index1].responsibilityData[index2].level[0].resp_conditionList[indexCSon],"levelvalue","-1")
                }else{
                    that.$set(that.conditionsList.domains[index].data[index1].responsibilityData[index2].level[0].resp_conditionList[indexCSon],"levelvalue","0")
                }
            })
            
            console.log(this.conditionsList.domains[index].data[index1].responsibilityData[index2].level[0].resp_conditionList[indexCSon].levelvalue)
        },
        //展开-收起
        changeBlock: function(event){
          this.dynamicValidateFormOpen[event].open = !this.dynamicValidateFormOpen[event].open;
        },
        //选择中高低
        changeLevel: function(index,index1,index2,btnIndex,event){
            console.log(index,index1)
            console.log(arguments)
            console.log(event)
            console.log(event.target.classList.contains("active"))
            console.log(event.path[1].children.length)
            
            // console.log(arguments[4].path[1].childNodes,arguments[4].path[1],document.getElementsByClassName("level-btn"));
            //判断当前按钮是否已经处于选中状态
            if(event.target.classList.contains("active") == false){
                // let currentBtn = arguments[4].path[1].children;//childNodes;
                let pathC = event.path || event.composedPath && event.composedPath();
                let currentBtn = pathC[1].children;
                console.log(currentBtn)
                let needBth = currentBtn.length > 4 ? 4:currentBtn.length;
                for(let i = 0; i < needBth; i++){
                    currentBtn[i].removeAttribute("class","active");
                }
                currentBtn[btnIndex].setAttribute("class","active");
                let oldData = JSON.parse(JSON.stringify(this.conditionsList.domains[index].data[index1].responsibilityData[index2].level[0].resp_conditionList));
                let setData =  JSON.parse(JSON.stringify(this.conditionsListOrigin.domains[index].data[index1].responsibilityData[index2].level[btnIndex]));
                this.conditionsList.domains[index].data[index1].responsibilityData[index2].level.splice(0,1,setData);
                if(btnIndex==3){
                    this.editSuccessList[index][index1].splice(index2,1,true);
                    this.conditionsList.domains[index].data[index1].responsibilityData[index2].level[0].resp_conditionList.length = 0;
                    for(let l = 0; l < oldData.length; l++){
                        this.conditionsList.domains[index].data[index1].responsibilityData[index2].level[0].resp_conditionList.push(oldData[l]);
                    }
                    
                }else{
                     this.editSuccessList[index][index1].splice(index2,1,false);
                }
                console.log(this.conditionsList.domains);
            }
        },
        //编辑
        edit: function(index,index1,index2){//1,3;0,2
           this.editSuccessList[index][index1].splice(index2,1,true)
        },
        //完成
        editSuccess: function(index,index1,index2){//1,3; 0,2
            // this.editSuccessList[index][index1].list.splice(index2,1,false)
            this.editSuccessList[index][index1].splice(index2,1,false)
            console.log(index,index1)
            this.conditionsList.domains[index].data[index1].responsibilityData[index2].level[0].resp_conditionList.forEach(function(current,index){
                current.levelvalue = current.levelvalue == undefined || current.levelvalue == ''? 0 : Number(current.levelvalue);
                console.log(current.resp_condition.indexOf('%') != -1)
                if(current.resp_condition.indexOf('%') != -1){//含有%
                    if(current.levelvalue > 100){
                        current.levelvalue = 100;
                    }else if(current.levelvalue < 0){
                         current.levelvalue = 0;
                    }
                }
                 if((current.resp_condition.indexOf('元') != -1 || current.resp_condition.indexOf('天') != -1) && current.resp_condition.indexOf('床位费') == -1){//含有元
                    if(current.levelvalue < 0){
                         current.levelvalue = 0;
                    }
                }
                
            })
        },
        //复制其他计划--完成步骤
        replicatedOk:function(){
            console.log(this.replicatedGroup)
            this.replicatedScheduleDialogVisible = false;
             if(this.copyToArray3.length != 0){//复制完成
                let nowCopyEd =JSON.parse(JSON.stringify(this.conditionsList.domains[this.copyToArray1[this.replicatedGroup]].data[this.copyToArray2[this.replicatedGroup]].responsibilityData[this.copyToArray3[this.replicatedGroup]]));
                this.conditionsList.domains[this.firstIndex].data[this.secIndex].responsibilityData.splice(this.threeIndex,1,nowCopyEd);
                // this.conditionsList.domains[this.firstIndex].data[this.secIndex].responsibilityData[this.threeIndex].level[0].levelname="自定义";
                // this.conditionsList.domains[this.firstIndex].data[this.secIndex].responsibilityData[this.threeIndex].level[0].levelcode="Z";
                let currentCode =  this.conditionsList.domains[this.firstIndex].data[this.secIndex].responsibilityData[this.threeIndex].level[0].levelcode

                switch (currentCode) {
                    case 'L':
                        this.eventT.path[1].children[3].removeAttribute("class","active");
                        this.eventT.path[1].children[1].removeAttribute("class","active");
                        this.eventT.path[1].children[2].removeAttribute("class","active");
                        this.eventT.path[1].children[0].setAttribute("class","active");
                        break;
                    case 'M':
                        this.eventT.path[1].children[0].removeAttribute("class","active");
                        this.eventT.path[1].children[3].removeAttribute("class","active");
                        this.eventT.path[1].children[2].removeAttribute("class","active");
                        this.eventT.path[1].children[1].setAttribute("class","active");
                        break;
                    case 'H':
                        this.eventT.path[1].children[0].removeAttribute("class","active");
                        this.eventT.path[1].children[1].removeAttribute("class","active");
                        this.eventT.path[1].children[3].removeAttribute("class","active");
                        this.eventT.path[1].children[2].setAttribute("class","active");
                        break;
                    case 'Z':
                        this.eventT.path[1].children[0].removeAttribute("class","active");
                        this.eventT.path[1].children[1].removeAttribute("class","active");
                        this.eventT.path[1].children[2].removeAttribute("class","active");
                        this.eventT.path[1].children[3].setAttribute("class","active");
                        break;
                    default:
                        break;
                }
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            }
        },
        //从别处复制该计划过来--复制第一步
        copyTo: function(index,index1,index2,event){
            this.replicatedGroup = '';
            this.eventT = event ;
            this.firstIndex = index
            this.secIndex = index1
            this.threeIndex= index2
            this.copyToName.length = 0;
            this.copyToArray1.length = 0;
            this.copyToArray2.length = 0;
            this.copyToArray3.length = 0;
            //获得当前的一个需要被复制的名字
             this.planResponsibility = this.conditionsList.domains[index].data[index1].responsibilityData[index2].riskshort;
            //获得当前的一个需要被复制的code
            let needCode = this.conditionsList.domains[index].data[index1].responsibilityData[index2].responsibilityNameCode;
            //循环看有没有可以复制到这里的数
            for(let i = 0; i < this.conditionsList.domains.length; i++){//第一层list的层数
                if(i != index){
                    for(let k = 0; k < this.conditionsList.domains[i].data.length; k++){//第二层list的层数
                        for(let p = 0; p < this.conditionsList.domains[i].data[k].responsibilityData.length; p++){//第二层list的层数
                            if(needCode == this.conditionsList.domains[i].data[k].responsibilityData[p].responsibilityNameCode){
                                this.copyToName.push(this.conditionsList.domains[i].planName)
                                this.copyToArray1.push(i);//可以被复制的压入这里第一层
                                this.copyToArray2.push(k);//可以被复制的压入这里第二层
                                this.copyToArray3.push(p);//可以被复制的压入这里第三层
                            }
                        }
                    }
                }
            }
            this.replicatedScheduleDialogVisible = true;
            this.replicatedDialogVisibleList.length = 0;
            for(let i = 0; i < this.copyToName.length; i++){
                this.replicatedDialogVisibleList.push({
                    name:this.copyToName[i],
                    planNum:this.copyToArray1[i]
                })
            }
           
        },
        //上一步
        goPrev: function(){
            if(document.getElementsByClassName('no-mean')[0].textContent != ''){
                let quotationInformation = {"conditionsList":this.conditionsList.domains};
                    localStorage.setItem("quotationInformation_4",JSON.stringify(quotationInformation));
             }
            // this.$router.go(-1);
             this.$router.push({path:'procedureTwo'})
        },
        //暂存
        tempStorage: function(){
            if(document.getElementsByClassName('set-conditions')[0].textContent != ''){
                let checkFlag = this.checkEditSuccessLis();
                if(checkFlag){
                    this.$alert('尚有“自定义”还没编辑完，请编辑完再下一步','',{
                        confirmButtonText: '确定',
                        callback: action => {}
                    })
                }else{
                    this.loading = true;
                    let quotationInformation = {"conditionsList":this.conditionsList.domains};
                        localStorage.setItem("quotationInformation_4",JSON.stringify(quotationInformation));
                    localStorage.setItem('quotationInformation_tempsavestep',3);
                    this.$temporary().then((code)=>{
                        this.loading = false;
                    });
                }
               
            }else{
                this.$alert('请耐心等待页面加载完再暂存','',{
                    confirmButtonText:'好的',
                }).catch(()=>{

                })
            }
           
            
        },
        //下一步
        goNext: function(){
            let checkFlag = this.checkEditSuccessLis();
            if(checkFlag){
                this.$alert('尚有“自定义”还没编辑完，请编辑完再下一步','',{
                    confirmButtonText: '确定',
                    callback: action => {}
                })
            }else{
                let quotationInformation = {"conditionsList":this.conditionsList.domains};
                    localStorage.setItem("quotationInformation_4",JSON.stringify(quotationInformation));
                    console.log(JSON.stringify(this.conditionsList.domains))
                this.$router.push({path:'procedurePremium'})
            }
        },
        // 检测是否编辑完
        checkEditSuccessLis: function(){
            let falg = false;
            this.editSuccessList.forEach(function(current,index){
                current.forEach(function(current1,index1){
                    if(current1.includes(true)){
                        falg = true;
                    }
                })
            })
            return falg;
        },
        //回到主页
        goHome: function(){
            // this.$router.push({path:'/'})
            //  this.$router.go(-5);
            this.$clearTemporaryAll();//清楚所有步骤的信息
             this.$router.push({name:'OtoIndex'})
        },
        //选择险种数据/index/getRiskRespByMouldcode--对比历史
        getRiskRespByMouldcode: function(){
            //那最新的和存储里的对比
            //----------假如有暂存过
            let information_4,information_3;
            let planNameT_3 = [];//名字
            let plancodeT_3 = [];//计划编码
            let tempC = [];
            let that = this;

             console.log('debug0')
              console.log(this.conditionsList.domains);
                        console.log(this.conditionsListOrigin.domains)

            information_3 = JSON.parse(localStorage.getItem('quotationInformation_3'));//有暂存
            //一、先匹配名字---获得第三步以及暂存的第四步的名字
            for(let j = 0; j < information_3.configurationResponsibility.length;j++){
                planNameT_3.push(information_3.configurationResponsibility[j].planName)
                plancodeT_3.push(information_3.configurationResponsibility[j].planCode)
            }
            
            if(!!localStorage.getItem('quotationInformation_4') && localStorage.getItem('quotationInformation_4')!=''){
                information_4 = JSON.parse(localStorage.getItem('quotationInformation_4'));//有暂存
                let resetInformation = information_4.conditionsList;

                for(let j = 0; j < planNameT_3.length; j++){
                    let isPushflag = false;//不等于false， 等于true
                    let recodeK ;
                    for(let k = j; k < resetInformation.length;k++){
                        if(plancodeT_3[j] == resetInformation[k].planCode){//planNameT_3[j] == resetInformation[k].planName
                            isPushflag = true;
                            recodeK = k;
                        }
                    }
                    if(isPushflag){//如果有这个名称
                        //---对比有没有这个险种大类
                        let tempData = [];
                        if( resetInformation[recodeK].data != null){
                            that.conditionsList.domains[j].data.forEach(function(currentValue,index){
                                console.log("currentValue")
                                console.log(currentValue)
                                let falg = false;//判断有没有匹配到
                                resetInformation[recodeK].data.forEach(function(currentValueRest,indexRest){
                                if(currentValue.responsibilityCode == currentValueRest.responsibilityCode){
                                    let tempResponsibilityData = [];
                                    falg = true;
                                    //对比这个大类下的小类是否一致
                                    currentValue.responsibilityData.forEach(function(currentSonValue,indexSon){//currentValue-最新的
                                        let sonFlag = false;
                                        for(let t = 0; t < currentValueRest.responsibilityData.length; t++){
                                            // if(currentSonValue.responsibilityNameCode == resetInformation[recodeK].data[p].responsibilityData[t].responsibilityNameCode){
                                            if(currentSonValue.level[0].resp_conditionList[0].resp_code == currentValueRest.responsibilityData[t].level[0].resp_conditionList[0].resp_code){
                                            // if(currentSonValue.level[0].resp_conditionList[0].resp_code == resetInformation[recodeK].data[p].responsibilityData[t].responsibilityNameCode){
                                               sonFlag = true;

                                               tempResponsibilityData.push({
                                                    riskshort:JSON.parse(JSON.stringify(currentSonValue.riskshort)),
                                                    responsibilityNameCode:JSON.parse(JSON.stringify(currentSonValue.responsibilityNameCode)),
                                                    level:JSON.parse(JSON.stringify(resetInformation[recodeK].data[indexRest].responsibilityData[t].level))
                                                })
                                            }
                                        }
                                        if(!sonFlag){
                                            tempResponsibilityData.push({
                                                riskshort:JSON.parse(JSON.stringify(currentSonValue.riskshort)),
                                                responsibilityNameCode:JSON.parse(JSON.stringify(currentSonValue.responsibilityNameCode)),
                                                level:JSON.parse(JSON.stringify(currentSonValue.level))
                                            })
                                        }
                                        
                                    })
                                    //将这个大类压进去
                                    tempData.push({
                                        risktype:JSON.parse(JSON.stringify(currentValue.risktype)),
                                        responsibilityCode:JSON.parse(JSON.stringify(currentValue.responsibilityCode)),
                                        responsibilityData:JSON.parse(JSON.stringify(tempResponsibilityData))
                                    })
                                }
                            })

                                if(!falg){//如果没有这个大类，直接压入
                                    tempData.push({
                                            risktype:currentValue.risktype,
                                            responsibilityCode:JSON.parse(JSON.stringify(currentValue.responsibilityCode)),
                                            responsibilityData:JSON.parse(JSON.stringify(currentValue.responsibilityData))
                                    })
                                }
                            })

                            let param = {
                                planName: planNameT_3[j],//计划名称
                                planCode: plancodeT_3[j],//计划名称编码
                                data:JSON.parse(JSON.stringify(tempData))
                            }
                            tempC.push(param);

                        }else{
                            //有名称,但没数据
                            let tep = JSON.parse(JSON.stringify(that.conditionsList.domains[j].data))//----conditionsListOrigin
                            let param = {
                                    planName: planNameT_3[j],//计划名称
                                    planCode: plancodeT_3[j],//计划名称编码
                                    data:JSON.parse(JSON.stringify(tep))
                                }
                                tempC.push(param);
                        }

                    }else{//如果没有名称
                        let tep = JSON.parse(JSON.stringify(that.conditionsList.domains[j].data))//----conditionsListOrigin
                        let param = {
                            planName: planNameT_3[j],//计划名称
                            planCode: plancodeT_3[j],//计划名称编码
                            data:JSON.parse(JSON.stringify(tep))
                        }
                        tempC.push(param);
                    }
                    
                }
               

                let pt = {"conditionsList":tempC};
                        localStorage.setItem("quotationInformation_4",JSON.stringify(pt));

            }else{//----------没有有暂存过
                let quotationInformation_data = {"conditionsList":that.conditionsList.domains};
                    localStorage.setItem("quotationInformation_4",JSON.stringify(quotationInformation_data));
            }
            that.conditionsList.domains = JSON.parse(localStorage.getItem('quotationInformation_4')).conditionsList
            console.log("last-domain")
            console.log(that.conditionsList.domains)
         
        },
        //获取最初的全值
        getData: function(){
            let temp = [];//临时变量
            let information;//拿来存储第二步骤的数据
            let _that = this;
            //压入名称
            if(!!localStorage.getItem('quotationInformation_3')&&localStorage.getItem('quotationInformation_3')!=''){
                information = JSON.parse(localStorage.getItem('quotationInformation_3'));
                for(let j = 0; j < information.configurationResponsibility.length;j++){
                    this.planNameT.push(information.configurationResponsibility[j].planName);
                    this.plancodeT.push(information.configurationResponsibility[j].planCode);
                    
                }
                console.log(this.planNameT);
            }
            //获取每个计划的大类
            for(let k = 0; k < this.planNameT.length; k++){
                let riskData = [];
                for(let l = 0; l <  information.configurationResponsibility[k].data.length; l++){
                    let responsibilityDataTemp = [];//riskshort: "疾病身故", responsibilityNameCode: "998"
                    information.configurationResponsibility[k].data[l].responsibilityData.forEach(function(currentValue,index){
                        if(currentValue.subResponsibilityData == null){
                            let tempResNameCode;
                            _that.conditionsListAll.forEach(function(currentC,indexC){
                                currentC.riskData.forEach(function(currentSonC,indexSonC){
                                    tempResNameCode = JSON.parse(JSON.stringify(currentSonC.responsibilityNameCode));
                                    // console.log('00000')
                                    // console.log(tempResNameCode.split('').splice(0,3).join(''));
                                    if(tempResNameCode.split('').splice(0,3).join('') == currentValue.responsibilityNameCode){
                                        responsibilityDataTemp.push({
                                            riskshort:JSON.parse(JSON.stringify(currentValue.riskshort)),
                                            responsibilityNameCode:JSON.parse(JSON.stringify(currentValue.responsibilityNameCode)),
                                            level:JSON.parse(JSON.stringify(currentSonC.level))
                                        })
                                    }
                                    
                                })
                            })
                            
                           
                        }else{
                            currentValue.subResponsibilityData.forEach(function(currentSonValue,indexSon){
                                if(currentSonValue.trueConfigurationStep > 0 && currentSonValue.subIfDefaultConfiguration == true){//如果
                                    _that.conditionsListAll.forEach(function(currentC,indexC){
                                        currentC.riskData.forEach(function(currentSonC,indexSonC){
                                            if(currentSonC.level[0].resp_conditionList[0].resp_code == currentSonValue.subResponsibilityNameCode){
                                                responsibilityDataTemp.push({
                                                    riskshort:JSON.parse(JSON.stringify(currentSonValue.subResponsibilityName)),
                                                    responsibilityNameCode:JSON.parse(JSON.stringify(currentSonValue.subResponsibilityNameCode)),
                                                    level:JSON.parse(JSON.stringify(currentSonC.level))
                                                })
                                            }
                                        })
                                    })
                                }
                            })
                        }
                        
                    })
                    if(responsibilityDataTemp.length>0){
                        riskData.push({
                            risktype:JSON.parse(JSON.stringify(information.configurationResponsibility[k].data[l].risktype)),
                            responsibilityCode:JSON.parse(JSON.stringify(information.configurationResponsibility[k].data[l].responsibilityCode)),
                            responsibilityData:JSON.parse(JSON.stringify(responsibilityDataTemp))
                        })
                    }
                     
                }
                //形成新的初始值
                _that.conditionsList.domains.push({
                    planName: this.planNameT[k],//计划名称
                    planCode: this.plancodeT[k],//计划名称编码
                    data:JSON.parse(JSON.stringify(riskData))
                })
            }
            console.log(_that.conditionsList.domains);
            // _that.conditionsListOrigin.domains = _that.conditionsList.domains;//赋值一份完整的给原始数据保存起来
             _that.conditionsListOrigin.domains = JSON.parse(JSON.stringify(_that.conditionsList.domains));

            for(let n = 0; n < _that.planNameT.length; n++){
                if(n == 0){
                    _that.dynamicValidateFormOpen.push({open:true})
                }else{
                    _that.dynamicValidateFormOpen.push({open:false})
                } 
            }
            //把低档以及高档去掉，保留中档数据
            this.conditionsList.domains.forEach(function(currentValue,index){
                currentValue.data.forEach(function(currentValueSon,indexSon){
                    if(currentValueSon.responsibilityData.length != 0){
                        for(var t = 0; t < currentValueSon.responsibilityData.length; t++){
                            let needData = currentValueSon.responsibilityData[t].level[1];
                            currentValueSon.responsibilityData[t].level.length = 0;
                            currentValueSon.responsibilityData[t].level.push(JSON.parse(JSON.stringify(needData)));
                        }
                        
                    }
                })
            })
            console.log(this.conditionsList.domains);
            console.log("aaaaaaaaaaaaaaaa")
            this.conditionsList.domains.forEach(function(editValue,editIndex){
                let listL = [];
                editValue.data.forEach(function(editSonValue,editSonIndex){
                    let list = [];
                    editSonValue.responsibilityData.forEach(function(editSonGValue,editSonGIndex){
                        list.push(false);
                        // listL.push(false);
                    })
                    listL.push(list);
                })
               
                _that.editSuccessList.push(listL);
            })
            console.log("list")
            console.log(this.editSuccessList)
            console.log(this.conditionsList.domains)


            this.getRiskRespByMouldcode();//看有没有暂存
        },
        //获取最初的值全职--/index/getRespConfByRiskCode获取要设置的条件
        getRespConByRiskCode: function(){
            let _that = this;
            this.$axios.get('/index/getRespConfByRiskCode').then(response => {
                console.log(response)
                console.log(JSON.parse(JSON.stringify(response.data)));
                let tempData = response.data.data;
                response.data.data.forEach(function(currentValue,index){
                    currentValue.riskData.forEach(function(currentSonValue,indexSon){
                      //没有排序
                        let arr = [];
                        for(let i = 0; i < currentSonValue.level.length; i++){
                            if(currentSonValue.level[i].levelcode == 'L'){
                                arr[0] = currentSonValue.level[i];
                            }else if(currentSonValue.level[i].levelcode == 'M'){
                                arr[1] = currentSonValue.level[i];
                            }else if(currentSonValue.level[i].levelcode == 'H'){
                                arr[2] = currentSonValue.level[i];
                            }else if(currentSonValue.level[i].levelcode == 'Z'){
                                arr[3] = currentSonValue.level[i];
                            }
                        }
                        tempData[index].riskData[indexSon].level = JSON.parse(JSON.stringify(arr));
                    })
                })
                _that.conditionsListAll = JSON.parse(JSON.stringify(tempData));
                console.log(_that.conditionsListAll);
                _that.getData();

            }).catch(error =>{
                console.log("是这里么")
                console.log(error)
                this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                    confirmButtonText:'好的，我明白了'
                }).catch(()=>{})
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
.none{
    display: none !important;
}
.block{
    display: inline-block !important;
}
.procedure-three{
    margin-top: 50px;
    margin-bottom: 40px;
}
.set-conditions{
    margin-top: 100px;
    height: calc(100vh - 140px);
    padding: 0 15px;
    overflow: hidden;
    .scroll-conditions{
        height: calc(100vh - 140px);
        overflow: scroll;
    }
}

.pre-conditions{
    width: 100%;
    background: #fff;
    border-radius: 10px;
    padding: 35px 10px 5px 10px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    margin-top: 10px;
    &:first-child{
        margin-top: 0;
    }
    .el-divider__text, .el-link{
        font-size: 12px;
    }
    .part-li-title{
        font-size: 12px;
        font-weight: 700;
    }
    div.plan-condition{
        .conditions{
            margin-top: 30px;
            &:first-child{
                margin-top: 10px;
            }
        }
    }
   
    ul{
        margin-top: 18px;
        list-style-type: none;
        position: relative;
        :first-child{
            margin-top: 0;
        }
        button.edit-btn{
            position: absolute;
            right: 0;
            top: 0;
            color: #f8b95b;
            border: 1px solid #f8b95b;
            height: 25px;
            // cursor:pointer;
        }
        li{
            // cursor:pointer;
            // p{
            //     // margin-bottom: -8px;
            // }
            button{
                min-width: 48px;
                height: 38px;
                background: inherit;
                border: 1px solid #d4d4d4;
                border-radius: 5px;
                font-size: 12px;
                position: relative;
                margin-right: 5px;
                z-index: 2;
                // cursor:pointer;
            }
            button.fz-button{
                padding-left: 4px;
                padding-right: 4px;
            }
            button.active{
                color: #fff;
                background: #6db9fe;
                border-color: #6db9fe;
            }
            button.active::before{
                content: '';
                position: absolute;
                border-top: 7px solid transparent;
                border-bottom: 7px solid #d7d7d7;
                border-left: 7px solid transparent;
                border-right: 7px solid transparent;
                bottom: -9px;
                left: 50%;
                transform: translateX(-50%);
            }
            button.active::after{
                content: '';
                position: absolute;
                border-top: 7px solid transparent;
                border-bottom: 7px solid #fff;
                border-left: 7px solid transparent;
                border-right: 7px solid transparent;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
            }
            .level-btn{
               button:last-child{
                    margin-right: 0;
               }
           }
            .grade-content{
                font-size: 12px;
                border: 1px solid #d7d7d7;
                padding: 5px 10px;
                box-sizing: border-box;
                border-radius: 10px;
                margin-top: 8px;
                .resp-span{
                    vertical-align: top;
                }
                ul{
                    li{
                        // margin-top: 10px;
                        padding: 4px 0;
                        position: relative;
                        &:first-child{
                            margin-top: 0;
                        }
                    }
                    .exp-edit{
                        display: inline-block;
                        width: 180px;
                        label.standard-span{
                            display: block;
                            margin-top: 10px;
                            .el-input{
                                width: 80px;
                            }
                        }
                        
                    }
                    .self-edit{
                        display: inline-block;
                        width: 100px;
                        span{
                            width: 70px;
                            // height: 38px;
                            display: inline-block;
                        }
                        div{
                            width: 70px;
                            height: 35px;
                        }
                        button{
                            position: absolute;
                            right: 0;
                            font-size: 10px;
                            height: 20px;
                        }
                    }
                }
            }
        }
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
.part-remark{
    height: 90px;
    margin-top: 10px;
}
.no-condition{
    font-size: 12px;
    text-align: center;
    margin-top: 10px;
}
.upload-attachment{
    font-size: 12px;
    background: #fff;
    border-radius: 10px;
    padding: 10px 15px;
    .attachment-tip{
        font-size: 11px;
        color: #bfbfbf;
    }
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
// .procedure-step{
//     position: fixed;
//     top: 45px;
//     width: 100%;
// }
.if-open{
    font-size: 12px;
    margin-top: 10px;
    text-align: center;
    .el-button{
        border: none;
        padding: 8px 20px;
    }
    .el-button:focus, .el-button:hover{
        background: #fff;
    }
}
</style>

<style lang="scss">
.procedure-three{
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
    .el-form-item{
        height: 35px;
        line-height: 35px;
        .el-form-item__content{
            line-height: 35px;
        }
    }
    .el-divider--horizontal{
        margin: 10px 0 10px 0;
    }
    .procedure-three .el-steps .el-step__head.is-success .el-step__line-inner{
        height: 0;
        border-top: 0px !important;
    }
    .procedure-three .el-steps .el-step__head.is-success .el-step__line{
        background-color: #6db9fe;
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
        .dialog-title{
            font-size: 14px;
            text-align: left;
            .dialog-tip{
                font-size: 12px;
                color: #bfbfbf;
                margin-left: 10px;
                .tip-red{
                    color: red;
                    font-style: normal;
                }
            }
        }
        .dialog-footer{
            font-size: 12px;
            .tip{
                text-align: left;
            }
        }
        .tip-red{
            color: red;
        }
        .el-dialog__body{
            max-height: calc(100vh - 200px);
            overflow: scroll;
        }
        .group-radio{
            text-align: center;
        }
        .el-radio-group{
            label{
                display: block;
                text-align: center;
                margin: 0 auto;
                margin-top: 10px;
                width: 200px;
                height: auto;
                &:not(:first-child){
                    margin-left: 0;
                }
            }
        }
        .el-radio{
            white-space: break-spaces;
            line-height: 20px;
        }
        .el-radio.is-bordered.el-radio--medium{
            padding: 7px 10px 7px 10px;
        }
        .el-radio__input{
            position: absolute;
            top: 50%;
            left: 10px;
            transform: translateY(-50%);
        }
        .el-radio__label{
            padding-left: 22px;
        }
    }
    .el-switch{
        font-size: 10px; 
    }
    .el-switch__label *{
        font-size: 12px;
    }
    label.standard-span{
         .el-switch__label{
            font-size: 12px;
         }
       .el-input__inner{
           height: 30px;
       }
    }
}
.part-remark{
    .el-textarea__inner{
        border: 1px solid #fff;
        font-size: 12px;
        border-radius: 10px;
    }
}
.self-edit{
    .el-input{
        width: 70px;
    }
    .el-input__inner{
        height: 38px;
        width: 100px;
    }
}
</style>