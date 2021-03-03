<template>
    <div class="procedure-three">
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

        <!-- 主体内容 -->
        <div class="set-conditions">
            <div class="scroll-conditions">
                <!-- 计划 -->
                <div>
                    <!-- 每个计划 -->
                    <div class="pre-conditions" v-for="(item,index) in conditionsList.domains" :key="index">
                        <div class="procedure-corner-mark"><span>计划1(建工险)</span></div>
                        <!-- 可展开块 -->
                        <div class="plan-condition">
                            <div v-if="item.data.length > 0">
                                <div class="conditions" v-for="(item1,index1) in item.data" :key="index1">
                                    <el-divider>{{item1.risktype}}</el-divider>
                                    <ul v-for="(item2,index2) in item1.responsibilityData" :key="index2">
                                        
                                        <li class="part-li">
                                            <p class="part-li-title">{{item2.riskshort}}</p>
                                            <div class="level-btn" >
                                                <button @click="changeLevel(index,index1,index2,0,$event)">低档</button><button @click="changeLevel(index,index1,index2,1,$event)" class="active">中档</button><button @click="changeLevel(index,index1,index2,2,$event)" >高档</button><button @click="changeLevel(index,index1,index2,3,$event)" >自定义</button><button v-if="conditionsList.domains.length >= 2" @click="copyTo(index,index1,index2,$event)">复制其他计划</button>
                                            </div>
                                            <!-- 显示的档次的配置    -->
                                            <div class="grade-content">
                                                <ul v-for="(content,indexC) in item2.level" :key="indexC">
                                                    <li v-for="(contentSon,indexCSon) in content.resp_conditionList" :key="indexCSon">
                                                        <div class="condition-content">
                                                            <span>{{contentSon.resp_condition}}：</span>
                                                            <span v-if="content.levelcode != 'Z'">{{contentSon.levelvalue}}</span>
                                                            <div v-else class="self-edit">
                                                                <span class="block">{{contentSon.levelvalue}}</span>
                                                                <el-input class="none"  v-model.number.trim="contentSon.levelvalue" autocomplete="off"></el-input>
                                                                <button class="block" @click="edit($event)">编辑</button><button @click="editSuccess($event)" class="none" >完成</button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <!-- 可展开块 -->
                    </div>
                </div>
            </div>
        </div>

        

        <!-- 固定在下方的按钮 -->
        <div class="procedure-btn">
            <button>返回主页</button><button >上一步</button><button>暂存</button><button @click="goNext">下一步</button>
        </div>
    </div>
</template>

<script>
export default {
    name:'constructionThree',
    data(){
        return{
             active:2,
             textareaRemarks:'',
             fileList:[],//上传列表
             conditionsList:{//配置列表
                 domains:[{//配置计划1
                    planName:'管理人员',
                    data:[{
                        risktype:'医疗类',//类别
                        responsibilityCode:'12',//类别的代码
                        responsibilityData:[{
                             riskshort:'意外医疗',//险种名称
                             responsibilityNameCode:'1202',//险种名称代码
                             level:[//各个档次
                                 {
                                    levelname:'中档',
                                    levelcode:'M',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:14
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:16
                                    }]
                                 }
                             ]
                        },{
                             riskshort:'疾病住院医疗',//险种名称
                             responsibilityNameCode:'1203',//险种名称代码
                             level:[//各个档次
                                 {
                                    levelname:'中档',
                                    levelcode:'M',
                                    resp_conditionList:[{
                                        resp_condition:'检查费次住院限额（元）',
                                        resp_code:1,
                                        levelvalue:14
                                    },{
                                        resp_condition: '床位费日限额（元）',
                                        resp_code:2,
                                        levelvalue:14
                                    },{
                                        resp_condition: '社保后赔付比例（%）',
                                        resp_code:3,
                                        levelvalue:14
                                    },{
                                        resp_condition: '未社保赔付比例（%）',
                                        resp_code:4,
                                        levelvalue:14
                                    }]
                                 }
                             ]
                        }]
                    },{
                        risktype:'津贴类',//类别
                        responsibilityCode:'13',//类别的代码
                        responsibilityData:[{
                             riskshort:'意外住院津贴',//险种名称
                             responsibilityNameCode:'1301',//险种名称代码
                             level:[//各个档次
                                 {
                                    levelname:'中档',
                                    levelcode:'M',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:14
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:16
                                    }]
                                 }
                             ]
                        }]
                    }]//一个大类别的结束
                 },{//配置计划2
                    planName:'普通人员',
                    data:[{
                        risktype:'医疗类',//类别
                        responsibilityCode:'12',//类别的代码
                        responsibilityData:[{
                             riskshort:'意外医疗',//险种名称
                             responsibilityNameCode:'1202',//险种名称代码
                             level:[//各个档次
                                 {
                                    levelname:'中档',
                                    levelcode:'M',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:14
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:16
                                    }]
                                 }
                             ]
                        },{
                             riskshort:'疾病住院医疗',//险种名称
                             responsibilityNameCode:'1203',//险种名称代码
                             level:[//各个档次
                                 {
                                    levelname:'中档',
                                    levelcode:'M',
                                    resp_conditionList:[{
                                        resp_condition:'检查费次住院限额（元）',
                                        resp_code:1,
                                        levelvalue:14
                                    },{
                                        resp_condition: '床位费日限额（元）',
                                        resp_code:2,
                                        levelvalue:14
                                    },{
                                        resp_condition: '社保后赔付比例（%）',
                                        resp_code:3,
                                        levelvalue:14
                                    },{
                                        resp_condition: '未社保赔付比例（%）',
                                        resp_code:4,
                                        levelvalue:14
                                    }]
                                 }
                             ]
                        }]
                    }]//一个大类别的结束
                 },{//配置计划3
                    planName:'普通员工',
                    data:[]
                 }]
             },
             conditionsListOrigin:{//配置列表原始数据
                 domains:[{//配置计划1
                    planName:'管理人员',
                    data:[{
                        risktype:'医疗类',//类别
                        responsibilityCode:'12',//类别的代码
                        responsibilityData:[{
                             riskshort:'意外医疗',//险种名称
                             responsibilityNameCode:'1202',//险种名称代码
                             level:[//各个档次
                                 {
                                    levelname:'低档',
                                    levelcode:'L',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:12
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:14
                                    }]
                                 },
                                 {
                                    levelname:'中档',
                                    levelcode:'M',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:14
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:16
                                    }]
                                 },
                                 {
                                    levelname:'高档',
                                    levelcode:'H',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:16
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:18
                                    }]
                                 },
                                 {
                                    levelname:'自定义',
                                    levelcode:'Z',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:0
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:0
                                    }]
                                 }
                             ]
                        },{
                             riskshort:'疾病住院医疗',//险种名称
                             responsibilityNameCode:'1203',//险种名称代码
                             level:[//各个档次
                                 {
                                    levelname:'低档',
                                    levelcode:'L',
                                    resp_conditionList:[{
                                        resp_condition:'检查费次住院限额（元）',
                                        resp_code:1,
                                        levelvalue:12
                                    },{
                                        resp_condition: '床位费日限额（元）',
                                        resp_code:2,
                                        levelvalue:12
                                    },{
                                        resp_condition: '社保后赔付比例（%）',
                                        resp_code:3,
                                        levelvalue:12
                                    },{
                                        resp_condition: '未社保赔付比例（%）',
                                        resp_code:4,
                                        levelvalue:12
                                    }]
                                 },
                                 {
                                    levelname:'中档',
                                    levelcode:'M',
                                    resp_conditionList:[{
                                        resp_condition:'检查费次住院限额（元）',
                                        resp_code:1,
                                        levelvalue:14
                                    },{
                                        resp_condition: '床位费日限额（元）',
                                        resp_code:2,
                                        levelvalue:14
                                    },{
                                        resp_condition: '社保后赔付比例（%）',
                                        resp_code:3,
                                        levelvalue:14
                                    },{
                                        resp_condition: '未社保赔付比例（%）',
                                        resp_code:4,
                                        levelvalue:14
                                    }]
                                 },
                                 {
                                    levelname:'高档',
                                    levelcode:'H',
                                    resp_conditionList:[{
                                        resp_condition:'检查费次住院限额（元）',
                                        resp_code:1,
                                        levelvalue:16
                                    },{
                                        resp_condition: '床位费日限额（元）',
                                        resp_code:2,
                                        levelvalue:16
                                    },{
                                        resp_condition: '社保后赔付比例（%）',
                                        resp_code:3,
                                        levelvalue:16
                                    },{
                                        resp_condition: '未社保赔付比例（%）',
                                        resp_code:4,
                                        levelvalue:16
                                    }]
                                 },
                                 {
                                    levelname:'自定义',
                                    levelcode:'Z',
                                    resp_conditionList:[{
                                        resp_condition:'检查费次住院限额（元）',
                                        resp_code:1,
                                        levelvalue:0
                                    },{
                                        resp_condition: '床位费日限额（元）',
                                        resp_code:2,
                                        levelvalue:0
                                    },{
                                        resp_condition: '社保后赔付比例（%）',
                                        resp_code:3,
                                        levelvalue:0
                                    },{
                                        resp_condition: '未社保赔付比例（%）',
                                        resp_code:4,
                                        levelvalue:0
                                    }]
                                 }
                             ]
                        }]
                    },{
                        risktype:'津贴类',//类别
                        responsibilityCode:'13',//类别的代码
                        responsibilityData:[{
                             riskshort:'意外住院津贴',//险种名称
                             responsibilityNameCode:'1301',//险种名称代码
                             level:[//各个档次
                                {
                                    levelname:'低档',
                                    levelcode:'L',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:12
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:12
                                    }]
                                 },
                                 {
                                    levelname:'中档',
                                    levelcode:'M',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:14
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:16
                                    }]
                                 },
                                 {
                                    levelname:'高档',
                                    levelcode:'H',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:16
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:16
                                    }]
                                 },
                                 {
                                    levelname:'自定义',
                                    levelcode:'Z',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:17
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:17
                                    }]
                                 }
                             ]
                        }]
                    }]//一个大类别的结束
                 },{//配置计划2
                    planName:'普通员工',
                    data:[{
                        risktype:'医疗类',//类别
                        responsibilityCode:'12',//类别的代码
                        responsibilityData:[{
                             riskshort:'意外医疗',//险种名称
                             responsibilityNameCode:'1202',//险种名称代码
                             level:[//各个档次
                                 {
                                    levelname:'低档',
                                    levelcode:'L',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:12
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:14
                                    }]
                                 },
                                 {
                                    levelname:'中档',
                                    levelcode:'M',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:14
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:16
                                    }]
                                 },
                                 {
                                    levelname:'高档',
                                    levelcode:'H',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:16
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:18
                                    }]
                                 },
                                 {
                                    levelname:'自定义',
                                    levelcode:'Z',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:0
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:0
                                    }]
                                 }
                             ]
                        },{
                             riskshort:'疾病住院医疗',//险种名称
                             responsibilityNameCode:'1203',//险种名称代码
                             level:[//各个档次
                                 {
                                    levelname:'低档',
                                    levelcode:'L',
                                    resp_conditionList:[{
                                        resp_condition:'检查费次住院限额（元）',
                                        resp_code:1,
                                        levelvalue:12
                                    },{
                                        resp_condition: '床位费日限额（元）',
                                        resp_code:2,
                                        levelvalue:12
                                    },{
                                        resp_condition: '社保后赔付比例（%）',
                                        resp_code:3,
                                        levelvalue:12
                                    },{
                                        resp_condition: '未社保赔付比例（%）',
                                        resp_code:4,
                                        levelvalue:12
                                    }]
                                 },
                                 {
                                    levelname:'中档',
                                    levelcode:'M',
                                    resp_conditionList:[{
                                        resp_condition:'检查费次住院限额（元）',
                                        resp_code:1,
                                        levelvalue:14
                                    },{
                                        resp_condition: '床位费日限额（元）',
                                        resp_code:2,
                                        levelvalue:14
                                    },{
                                        resp_condition: '社保后赔付比例（%）',
                                        resp_code:3,
                                        levelvalue:14
                                    },{
                                        resp_condition: '未社保赔付比例（%）',
                                        resp_code:4,
                                        levelvalue:14
                                    }]
                                 },
                                 {
                                    levelname:'高档',
                                    levelcode:'H',
                                    resp_conditionList:[{
                                        resp_condition:'检查费次住院限额（元）',
                                        resp_code:1,
                                        levelvalue:16
                                    },{
                                        resp_condition: '床位费日限额（元）',
                                        resp_code:2,
                                        levelvalue:16
                                    },{
                                        resp_condition: '社保后赔付比例（%）',
                                        resp_code:3,
                                        levelvalue:16
                                    },{
                                        resp_condition: '未社保赔付比例（%）',
                                        resp_code:4,
                                        levelvalue:16
                                    }]
                                 },
                                 {
                                    levelname:'自定义',
                                    levelcode:'Z',
                                    resp_conditionList:[{
                                        resp_condition:'检查费次住院限额（元）',
                                        resp_code:1,
                                        levelvalue:0
                                    },{
                                        resp_condition: '床位费日限额（元）',
                                        resp_code:2,
                                        levelvalue:0
                                    },{
                                        resp_condition: '社保后赔付比例（%）',
                                        resp_code:3,
                                        levelvalue:0
                                    },{
                                        resp_condition: '未社保赔付比例（%）',
                                        resp_code:4,
                                        levelvalue:0
                                    }]
                                 }
                             ]
                        }]
                    },{
                        risktype:'津贴类',//类别
                        responsibilityCode:'13',//类别的代码
                        responsibilityData:[{
                             riskshort:'意外住院津贴',//险种名称
                             responsibilityNameCode:'1301',//险种名称代码
                             level:[//各个档次
                                {
                                    levelname:'低档',
                                    levelcode:'L',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:12
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:12
                                    }]
                                 },
                                 {
                                    levelname:'中档',
                                    levelcode:'M',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:14
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:16
                                    }]
                                 },
                                 {
                                    levelname:'高档',
                                    levelcode:'H',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:16
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:16
                                    }]
                                 },
                                 {
                                    levelname:'自定义',
                                    levelcode:'Z',
                                    resp_conditionList:[{
                                        resp_condition:'次免陪（元）',
                                        resp_code:1,
                                        levelvalue:17
                                    },{
                                        resp_condition: '赔付给付（%）',
                                        resp_code:2,
                                        levelvalue:17
                                    }]
                                 }
                             ]
                        }]
                    }]//一个大类别的结束
                 },{//配置计划3
                    planName:'普通员工',
                    data:[]
                 }]
             },
            dynamicValidateFormOpen:[{open:true},{open:false},{open:false}],
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
            threeIndex:''
        }
    },
    methods:{
        //展开-收起
        changeBlock: function(event){
          this.dynamicValidateFormOpen[event].open = !this.dynamicValidateFormOpen[event].open;
        },
        //选择中高低
        changeLevel: function(index,index1,index2,btnIndex){
            console.log(index,index1)
            // console.log(arguments[4].path[1].childNodes,arguments[4].path[1],document.getElementsByClassName("level-btn"));
            //判断当前按钮是否已经处于选中状态
            if(arguments[4].target.className!="active"){
                let currentBtn = arguments[4].path[1].children;//childNodes;
                for(var i = 0; i < currentBtn.length-1; i++){
                    currentBtn[i].removeAttribute("class","active");
                }
                currentBtn[btnIndex].setAttribute("class","active");
                let oldData = JSON.parse(JSON.stringify(this.conditionsList.domains[index].data[index1].responsibilityData[index2].level[0].resp_conditionList));
                let setData =  JSON.parse(JSON.stringify(this.conditionsListOrigin.domains[index].data[index1].responsibilityData[index2].level[btnIndex]));
                this.conditionsList.domains[index].data[index1].responsibilityData[index2].level.splice(0,1,setData);
                if(btnIndex==3){
                    this.conditionsList.domains[index].data[index1].responsibilityData[index2].level[0].resp_conditionList.length = 0;
                    for(var l = 0; l < oldData.length; l++){
                        this.conditionsList.domains[index].data[index1].responsibilityData[index2].level[0].resp_conditionList.push(oldData[l]);
                    }
                    
                }
            }
        },
        //编辑
        edit: function(event){//1,3;0,2
            console.log(event.path[1].children)
            this.editSuccessList.push('false');
            console.log( this.editSuccessList)
            event.path[1].children[0].removeAttribute("class","block");
            event.path[1].children[0].setAttribute("class","none");

            
            event.path[1].children[2].removeAttribute("class","block");
            event.path[1].children[2].setAttribute("class","none");

            
            event.path[1].children[1].removeAttribute("class","none");
            event.path[1].children[1].setAttribute("class","block");

            
            event.path[1].children[3].removeAttribute("class","none");
            event.path[1].children[3].setAttribute("class","block");
        },
        //完成
        editSuccess: function(event){//1,3; 0,2
            console.log( event.path[1].children)
            this.editSuccessList.pop();
            console.log( this.editSuccessList)
            event.path[1].children[0].removeAttribute("class","none");
            event.path[1].children[0].setAttribute("class","block");

            event.path[1].children[2].removeAttribute("class","none");
            event.path[1].children[2].setAttribute("class","block");

            event.path[1].children[1].removeAttribute("class","block");
            event.path[1].children[1].setAttribute("class","none");
            
            event.path[1].children[3].removeAttribute("class","block");
            event.path[1].children[3].setAttribute("class","none");
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
            for(var i = 0; i < this.conditionsList.domains.length; i++){//第一层list的层数
                if(i != index){
                    for(var k = 0; k < this.conditionsList.domains[i].data.length; k++){//第二层list的层数
                        for(var p = 0; p < this.conditionsList.domains[i].data[k].responsibilityData.length; p++){//第二层list的层数
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
        //下一步
        goNext: function(){
            console.log(this.editSuccessList.length);
            if(this.editSuccessList.length != 0){
                this.$alert('尚有“自定义”还没编辑完，请编辑完再下一步','',{
                    confirmButtonText: '确定',
                    callback: action => {}
                })
            }else{
                let quotationInformation = {"conditionsList":this.conditionsList.domains};
                    localStorage.setItem("quotationInformation_4",JSON.stringify(quotationInformation));
                this.$router.push({path:'procedurePremium'})
            }
        }
        
    }
}
</script>

<style lang="scss" scoped>
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
            margin-top: 20px;
            &:first-child{
                margin-top: 10px;
            }
        }
    }
   
    ul{
        margin-top: 18px;
        list-style-type: none;
        :first-child{
            margin-top: 0;
        }
        li{
            p{
                margin-bottom: -8px;
            }
            button{
                min-width: 54px;
                height: 38px;
                background: inherit;
                border: 1px solid #d4d4d4;
                border-radius: 5px;
                font-size: 12px;
                position: relative;
                margin-right: 5px;
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
                ul{
                    li{
                        // margin-top: 10px;
                        padding: 4px 0;
                        position: relative;
                        &:first-child{
                            margin-top: 0;
                        }
                    }
                    .self-edit{
                        display: inline-block;
                        width: 100px;
                        span{
                            width: 70px;
                            height: 38px;
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
        &:first-child{
            border-left: 0;
        }
        &:last-child{
            color: #fff;
            background: #62b4ff;
        }
    }
}
.procedure-step{
    position: fixed;
    top: 45px;
    width: 100%;
}
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
                height: 38px;
                &:not(:first-child){
                    margin-left: 0;
                }
            }
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
    }
}
</style>