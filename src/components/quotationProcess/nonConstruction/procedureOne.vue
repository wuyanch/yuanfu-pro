<template>
    <div class="procedure-one" vkshop-event-scope="非建工险-分配计划(1)">
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

        <div class="procedure-form">
            
            <!-- 单独计划 -->
            <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
                <div class="proce-scroll">
                <div class="procedure-content" v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key">
                    <div class="procedure-corner-mark"><span> 计划{{index+1}} </span></div>
                    <el-button @click.prevent="removeDomain(domain)" class="remove-procedure"><i class="el-icon-delete"></i></el-button>
                    <el-form-item
                        :prop="'domains.' + index + '.activeName'"
                        label="计划名称："
                        :rules="[
                        { required: true,message: '必填',  trigger: 'blur' }
                        ]"
                    > 
                        <el-input @focus="handleFocus" @blur="handleblur" clearable maxlength="20" minlength="2" v-model="domain.activeName" placeholder="请填写，限20个字。如：高管，普通员工等"></el-input>
                    </el-form-item>
                    <div v-if="dynamicValidateFormOpen[index].open">
                      
                        <el-form-item
                            :prop="'domains.' + index + '.numberOfInsured'"
                            label="投保人数："
                            :rules="[
                            { required: true, message: '必填',  trigger: 'blur' },
                            { type: 'number', message: '须为数值'}
                            ]"
                        > 
                            <el-input @focus="handleFocus" @blur="handleblur" type="number" clearable v-model.number.trim = "domain.numberOfInsured" placeholder="" class="small-input"></el-input>
                            <span>人</span>
                        </el-form-item>
                        
                        <el-form-item
                                :prop="'domains.' + index + '.averageAge'"
                                label="平均年龄："
                                :rules="[
                                { required: true, message: '必填', trigger: 'blur'},
                                { type: 'number', message: '须为数值'},
                                { type: 'number', max:70, message: '平均年龄超过70，请核实'}
                                ]"
                        > 
                            <el-input clearable  @focus="handleFocus" @blur="handleblur" type="number" v-model.number.trim = "domain.averageAge" maxlength=2  placeholder="" class="small-input"></el-input>
                            <span>岁</span>
                        </el-form-item>


                          <el-form-item 
                        label="人员类型：" 
                        :prop="'domains.' + index + '.personnelType'"
                        :rules="[
                            { required: true,  trigger: 'change' }
                            ]"
                            >
                            <el-radio-group v-model="domain.personnelType">
                                <el-radio :label="'员工'" border>员工</el-radio>
                                <el-radio :label="'家属'" border>家属</el-radio>
                            </el-radio-group>
                        </el-form-item>


                        <el-form-item 
                        label="社保情况：" 
                        :prop="'domains.' + index + '.socialSecurity'"
                        :rules="[
                            { required: true,  trigger: 'change' }
                            ]"
                        >
                            <el-radio-group v-model="domain.socialSecurity">
                                <el-radio :label="'有社保'" border>有社保</el-radio>
                                <el-radio :label="'无社保'" border>无社保</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        

                        <el-form-item 
                            label="职业类别：" 
                            :prop="'domains.' + index + '.occupationCategory'"
                            :rules="[
                                { required: true,  trigger: 'change' }
                            ]"
                            style="margin-bottom: 0;"
                            >
                                <el-radio-group v-model = "domain.occupationCategory">
                                    <el-radio :label="'1-3类'" border class="small-radio">1-3类</el-radio>
                                    <el-radio :label="'4类'" border class="small-radio">4类</el-radio>
                                    <el-radio :label="'5类及以上'" border class="small-radio">5类及以上</el-radio>
                                </el-radio-group>
                        </el-form-item>
                        <span class="tip">职业工种说明：{{tipPlaceholder[index][domain.occupationCategory]}}
                            <el-button class="select-cate" @click="cateVisible"><i class="el-icon-search">类别</i></el-button>
                        </span>
                        

                        <el-form-item 
                        label="工种描述：" 
                        :prop="'domains.' + index + '.jobDescription'"
                        :rules="[
                            { required: true, message: '必填', trigger: 'change' }
                        ]"
                        class="textareaEl"
                        >
                        <el-input type="textarea" resize="none" v-model="domain.jobDescription" maxlength="200" show-word-limit  @focus="handleFocus" @blur="handleblur" 
                            :placeholder="textareaPlaceholder[index][domain.occupationCategory]"></el-input>
                        </el-form-item>
                    </div>
                    <div class="if-open">
                        <el-button @click="changeBlock(index)"><i v-if="dynamicValidateFormOpen[index].open" class="el-icon-arrow-up"></i><i v-else class="el-icon-arrow-down"></i></el-button>
                    </div>
                </div> 
            <!-- 单独计划-结束 -->
                </div> 
            </el-form>

        </div>


        <!-- 按钮 -->
        <div class="button-btn">
           <button  @click="addDomain('dynamicValidateForm')">添加新计划</button>
        </div>
        <div class="procedure-btn">
            <button @click="goHome" vkshop-event-name="返回主页" vkshop-event-type="click">返回主页</button><button @click="goPrev" vkshop-event-name="上一步" vkshop-event-type="click">上一步</button><button @click="tempStorage" vkshop-event-name="暂存" vkshop-event-type="click" v-loading="loading" :disabled="loading" element-loading-spinner="el-icon-loading"  element-loading-text="拼命暂存中" :class="{ loadingFont : loading}">暂存</button><button @click="submitForm('dynamicValidateForm')" vkshop-event-name="下一步" vkshop-event-type="click">下一步</button>
        </div>
        
        <el-dialog
        title="职业分类查询"
        :visible.sync="catedialogVisible"
        width="100%"
        class="cate-dialog">
        <div>
            <el-input placeholder="输入工种关键字搜索职业类别" v-model="cateKeyword" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="searchCate"></el-button>
            </el-input>
            <div v-if="tableData.length != 0">
                <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%">
                    <el-table-column
                    prop="speciesname"
                    label="工种名称"
                    width="90">
                    </el-table-column>
                    <el-table-column
                    prop="industrytype"
                    label="类别"
                    width="90">
                    </el-table-column>
                    <el-table-column
                    prop="industry"
                     width="90"
                    label="行业">
                    </el-table-column>
                    <el-table-column
                    prop="professiontype"
                    label="职业类别">
                    </el-table-column>
                </el-table>
            </div>
            <div v-else class="cate-nodata">
                <img :src="[cateImg?cateImgA:cateImgB]" alt="" srcset="">
                <p>{{cateMsg}}</p>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="catedialogVisible = false">关 闭</el-button>
        </span>
        </el-dialog>

    </div>

    
</template>

<script>

export default {
    name:'procedureOne',
    data(){
        return{
            dynamicValidateForm: {
                domains: [{
                    activeName: '',//活动名称
                    personnelType:'员工',//人员类型
                    socialSecurity:'有社保',//社保情况
                    numberOfInsured: '',//投保人数
                    averageAge: '',//平均年龄
                    occupationCategory:'1-3类',//职业类别
                    jobDescription:'',//工种描述
                    planCode:localStorage.getItem('YF_quotationInformation_proserialno')+'01',//计划编码
                }]
            },
            active:0,
            dynamicValidateFormOpen:[{open:true}],
            textareaPlaceholder:[{
                '1-3类':'请填写具体的工种及人数。如：办公室文员：20人，销售人员：50人。',
                '4类':'请填写具体的工种及人数。如：装配工：20人，叉车司机：10人，4.5吨以下小货车20人。',
                '5类及以上':'请填写具体的工种及人数。如：冲压工：15人，五金切割：15人，拖头车货车司机：20人。'
            }],
            tipPlaceholder:[{
                '1-3类':'指主要工作场所为办公室或普通外勤人员，或从事手工操作、 包装等不涉及机器操作工作的人员。',
                '4类':'指从事各种动力机械、仪器、仪表及其他机械设备等小型机器或全自动机器生产的行业，但不涉及操作大型机床的人员。',
                '5类及以上':'使用车床、铣床、剪床等大型机械将五金原料按图纸样品加工成各种零件/建筑工地工人/涉及2米及以上工作等。'
            }],
            loading:false,
            foucesTimer:null,//ios键盘回落参数
            catedialogVisible:false,//职业分类的弹窗
            tableData: [],
            cateKeyword:null,//搜索关键字的词
            cateImg:false,
            cateImgA:require('@a/img/nodata.png'),
            cateImgB:require('@a/img/no-result.png'),
            cateMsg:'等待输入关键字搜索'
        }
    },
    created(){
        if(!!localStorage.getItem('quotationInformation_2')&&localStorage.getItem('quotationInformation_2')!=''){
            this.getLocalStroage();
        }
      
    },
    mounted(){
        // window.onresize监听页面高度的变化
         window.onresize = () => {
            return (() => {
               window.screenHeight = document.body.clientHeight;
               this.showHeight = window.screenHeight;
            })()
         }
    },
    methods:{
        //上一步
        goPrev: function(){
            let quotationInformation = {"distributionPlan":this.dynamicValidateForm.domains};
                localStorage.setItem("quotationInformation_2",JSON.stringify(quotationInformation));
            // this.$router.go(-1);
            this.$router.push({name:'templateSelection'})
        },
        //下一步--存储表单到localstroage
        submitForm(formName) {
            let that = this;
            
            this.checkName(function(response){
                if(response){
                    that.$alert('计划名称不能重复，请修改计划名称','',{
                        confirmButtonText:'好的，我知道了~'
                    }).catch(()=>{})
                }else{
                    that.$refs[formName].validate((valid) => {
                        if (valid) {
                            console.log(that.dynamicValidateForm.domains);
                            let quotationInformation = {"distributionPlan":that.dynamicValidateForm.domains};
                            localStorage.setItem("quotationInformation_2",JSON.stringify(quotationInformation));
                            that.$router.push({path:'procedureTwo'});
                        } else {
                            that.$alert('填写的数据有误，请检查并修改后再下一步','',{
                                confirmButtonText:'好的，我知道了~'
                            }).catch(()=>{})
                            console.log('error submit!!');
                            return false;
                        }
                    });
                
                }
            })
            
        },
        //删除一组
        removeDomain(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1 && this.dynamicValidateForm.domains.length != 1) {
                this.$confirm('你确定要删除计划'+(index+1)+'吗？','',{
                    confirmButtonText:'确定删除',
                    cancelButtonText:'我再想想',
                    type: 'warning'
                }).then(()=>{
                    this.dynamicValidateForm.domains.splice(index, 1)
                    this.dynamicValidateFormOpen.splice(index,1)
                    this.textareaPlaceholder.splice(index,1)
                    this.tipPlaceholder.splice(index,1)
                    this.$message({
                        message: '已成功删除计划'+(index+1),
                        type: 'success'
                    });
                    let quotationInformation = {"distributionPlan":this.dynamicValidateForm.domains};
                        localStorage.setItem("quotationInformation_2",JSON.stringify(quotationInformation));
                }).catch(()=>{

                })
                
            }else{
                this.$alert('至少要保留一个计划', '', {
                    confirmButtonText: '确定',
                     callback: action => {
                        
                    }
                });
            }
        },
        //新增一组
        addDomain(formName) {
            if(this.dynamicValidateForm.domains[this.dynamicValidateFormOpen.length-1].activeName!=='' 
            && this.dynamicValidateForm.domains[this.dynamicValidateFormOpen.length-1].numberOfInsured!==''
            && this.dynamicValidateForm.domains[this.dynamicValidateFormOpen.length-1].averageAge !==''
            && this.dynamicValidateForm.domains[this.dynamicValidateFormOpen.length-1].jobDescription !==''){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.textareaPlaceholder.push(
                        {
                            '1-3类':'请填写具体的工种及人数。如：办公室文员：20人，销售人员：50人。',
                            '4类':'请填写具体的工种及人数。如：装配工：20人，叉车司机：10人，4.5吨以下小货车20人。',
                            '5类及以上':'请填写具体的工种及人数。如：冲压工：15人，五金切割：15人，拖头车货车司机：20人。'
                        }
                    );
                    this.tipPlaceholder.push(
                        {
                            '1-3类':'指主要工作场所为办公室或普通外勤人员，或从事手工操作、 包装等不涉及机器操作工作的人员。',
                            '4类':'指从事各种动力机械、仪器、仪表及其他机械设备等小型机器或全自动机器生产的行业，但不涉及操作大型机床的人员。',
                            '5类及以上':'使用车床、铣床、剪床等大型机械将五金原料按图纸样品加工成各种零件/建筑工地工人/涉及2米及以上工作等。'
                        }
                    )
                    // let nowPlanCodeNum = this.dynamicValidateForm.domains[this.dynamicValidateFormOpen.length-1].planCode;
                    // nowPlanCodeNum = (Number(nowPlanCodeNum.substr(-2))+1)>9?(Number(nowPlanCodeNum.substr(-2))+1):'0'+(Number(nowPlanCodeNum.substr(-2))+1);
                    this.dynamicValidateForm.domains.push({
                        activeName: '',//活动名称
                        personnelType:'员工',//人员类型
                        socialSecurity:'有社保',//社保情况
                        numberOfInsured:'',//投保人数
                        averageAge:'',//平均年龄
                        occupationCategory:'1-3类',//职业类别
                        jobDescription:'',//工种描述
                        planCode:localStorage.getItem('YF_quotationInformation_proserialno')+'0'+ new Date().getTime(),//计划编码
                    });
                    this.dynamicValidateFormOpen.unshift({
                        open:false
                    })
                    this.dynamicValidateFormOpen.forEach((current,index) => {
                        if(index == this.dynamicValidateFormOpen.length-1){
                            this.$set(this.dynamicValidateFormOpen[index],"open",true);
                        }else{
                            this.$set(this.dynamicValidateFormOpen[index],"open",false);
                        }
                    });
                    this.$nextTick(() => {
                        document.getElementsByClassName('proce-scroll')[0].childNodes[document.getElementsByClassName('procedure-content').length-1].scrollIntoView();
                    })
                   
                }else{
                    let tip = '请把计划'+ this.dynamicValidateFormOpen.length+'填写好，再新增计划'
                    this.$alert(tip,'',function(){
                        confirmButtonText:'好的，我知道了~'
                    })
                }
            })
            }else{
                let tip = '请把计划'+ this.dynamicValidateFormOpen.length+'填写好，再新增计划'
                    this.$alert(tip,'',function(){
                        confirmButtonText:'好的，我知道了~'
                    })
            }
        },
        //展开-收起
        changeBlock: function(event){
          this.dynamicValidateFormOpen[event].open = !this.dynamicValidateFormOpen[event].open;
        },
        //从loclstroage里获取消息
        getLocalStroage:function(){
            if(!!localStorage.getItem('quotationInformation_2')&&localStorage.getItem('quotationInformation_2')!=''){
                let information = JSON.parse(localStorage.getItem('quotationInformation_2'));
                
                for(let j = 0; j < information.distributionPlan.length;j++){
                    this.dynamicValidateForm.domains.push(information.distributionPlan[j])
                }
                for(let i = 0; i < this.dynamicValidateForm.domains.length-1;i++){
                    this.textareaPlaceholder.push(
                        {
                        '1-3类':'请填写具体的工种及人数。如：办公室文员：20人，销售人员：50人。',
                        '4类':'请填写具体的工种及人数。如：装配工：20人，叉车司机：10人，4.5吨以下小货车20人。',
                        '5类及以上':'请填写具体的工种及人数。如：冲压工：15人，五金切割：15人，拖头车货车司机：20人。'
                        }
                    );
                    this.tipPlaceholder.push(
                        {
                            '1-3类':'指主要工作场所为办公室或普通外勤人员，或从事手工操作、 包装等不涉及机器操作工作的人员。',
                            '4类':'指从事各种动力机械、仪器、仪表及其他机械设备等小型机器或全自动机器生产的行业，但不涉及操作大型机床的人员。',
                            '5类及以上':'使用车床、铣床、剪床等大型机械将五金原料按图纸样品加工成各种零件/建筑工地工人/涉及2米及以上工作等。'
                        }
                    )
                    if(i == 0){
                        this.dynamicValidateFormOpen.push({open:true})
                    }else{
                        this.dynamicValidateFormOpen.push({open:false})
                    } 
                }
                this.dynamicValidateForm.domains.splice(0,1);
                this.dynamicValidateFormOpen.splice(0,1);
                this.textareaPlaceholder.splice(0,1);
                this.tipPlaceholder.splice(0,1);
            }  
        },
        //暂存
        tempStorage: function(){
            this.loading = true;
            let quotationInformation = {"distributionPlan":this.dynamicValidateForm.domains};
                    localStorage.setItem("quotationInformation_2",JSON.stringify(quotationInformation));
            localStorage.setItem('quotationInformation_tempsavestep',1);
            this.$temporary().then((code)=>{
                this.loading = false;
            });
           
        },
        goHome: function(){
            // var numberOfEntries = window.history.length;
            // console.log('算出一共有多少history')
            // console.log(Number(-numberOfEntries))
            // console.log( window.history)
            this.$clearTemporaryAll();//清楚所有步骤的信息
            this.$router.push({name:'OtoIndex'})
        },
        //检测计划里的名字是否相同
        checkName(fun){
            let falg = false;
            let nameArray = [];
            if(this.dynamicValidateForm.domains.length >= 2){
                this.dynamicValidateForm.domains.forEach(function(current,index){
                    nameArray.push(current.activeName)
                })
                nameArray.forEach(function(currentA,indexA){
                    for (let indexB = indexA+1; indexB < nameArray.length; indexB++) {
                        if(currentA == nameArray[indexB]) {
                            falg = true;
                        }
                    }
                })
                fun(falg);
            }else{
                fun(falg);
            }
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
        },
        cateVisible: function(){
            this.cateKeyword = null;
            this.tableData = [];
            this.cateImg=false;
            this.cateMsg='等待输入关键字搜索';
            this.catedialogVisible = true;
        },
        //搜索职业类别
        searchCate: function(){
            //speciesname
            console.log("开始搜索职业类别")
            if(this.cateKeyword == ''){
                this.$alert('关键字不能为空')
                return
            }else{
                this.$axios.post('/index/getProfessTypeBySpeciesname',{
                    speciesname:this.cateKeyword,
                    rand:new Date().getTime()
                }).then(response => {
                    console.log("搜索职业类别")
                    console.log(response)
                    if(response.data.code == 200){
                        if(response.data.data.length != 0){//搜索出来
                            this.tableData = response.data.data
                        }else{//没有搜索出来
                            this.tableData = [];
                            this.cateImg = true;
                            this.cateMsg = '搜索结果为空 ，请换个关键字'
                        }
                    }
                })
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
    width: 0px;
}
.procedure-one{
    margin-top: 50px;
    margin-bottom: 50px;
}
// .procedure-step{
//     position: fixed;
//     top: 55px;
//     width: 100%;
// }
.procedure-form{
    margin-top: 100px;
    overflow: hidden;
    height: calc(100vh - 185px);
    .el-form{
        overflow: auto;
        height: 100%;
    }
}
.procedure-content{
    margin: 0 15px;
    font-size: 12px;
    background: #fff;
    border-radius: 10px;
    padding:30px 6px 5px 6px;
    overflow: hidden;
    position: relative;
    // height: 100%;
    // height: -webkit-fill-available;
    &:not(:first-child){
        margin-top: 10px;
    }
    span{
        font-size: 12px;
    }
    .tip{
        font-size: 10px;
        // color: #bfbfbf;
        // color: #d9d9d9;
        color: #c5c5c5;
        line-height: 10px;
        margin-top: -4px;
        text-align: left !important;
        text-align: -webkit-left;
    }
    .el-form-item{
        // margin-bottom: 10px;
        margin-bottom: 6px;
    }
    .procedure-corner-mark{
        width: 106px;
        height: 60px;
        border-radius: 100%;
        background: #5393fc;
        position: absolute;
        top: -35px;
        left: 50%;
        transform: translateX(-50%);
        span{
            color: #fff;
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 13px;
        }
    }
    .remove-procedure{
        background: #ededed;
        position: absolute;
        right: -10px;
        top: -10px;
        width: 40px;
        height: 40px;
        border-radius: 100%;
        border: none;
        .el-icon-delete{
            font-size: 20px;
            position: relative;
            bottom: 0px;
            left: -12px;
        }
    }
    div.procedure-part{
        margin-top: 12px;
    }
    i.xing{
        color: red;
        font-style: normal;
    }
    input{
        font-size: 12px;
    }
}
.button-btn{
    text-align: center;
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    button{
        width: 150px;
        height: 38px;
        border-radius: 5px;
        position: relative;
        overflow: hidden;
        font-size: 12px;
        // margin-top: 40px;
        &:last-child{
            background: #60b3ff;
            color: white;
            border: 1px solid #60b3ff;
            // margin-left: 15px;
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
.if-open{
    text-align: center;
    .el-button{
        border: none;
        padding: 8px 20px;
    }
    .el-button:focus, .el-button:hover{
        background: #fff;
    }
}
.select-cate{
    padding: 0;
    color: #5cb2ff;
    border: none;
    font-size: 11px;
    border-bottom: 1px solid #5cb2ff;
    border-radius: 0;
}
.cate-nodata{
    text-align: center;
    font-size:13px ;
    img{
        width: 150px;
        margin-top: 40px;
    }
}
</style>

<style lang="scss">
.procedure-one{
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
        //     // top: 35px;
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
        // height: 35px;
        // line-height: 35px;
        height: auto;
        line-height: 35px;
        .el-form-item__content{
            line-height: 35px;
            // line-height: 40px;
        }
    }
    .cate-dialog{
        .el-dialog{
            position: fixed;
            bottom: 0;
            top: 0;
            margin-bottom: 0;
        }
        .input-with-select .el-input-group__prepend {
            background-color: #fff;
        }
        .el-dialog__body{
            padding: 10px;
        }
        .el-dialog__footer{
            font-size: 0;
            position: fixed;
            bottom: 0;
            right: 0;
        }
        .el-table__body-wrapper{
            height: 48vh;
            overflow: scroll;
        }
    }
    .el-input-group>.el-input__inner{
        vertical-align: middle  !important;
    }
}
.procedure-content{
    .el-textarea__inner{
        padding: 15px 15px 25px 15px;
    }
    .el-textarea .el-input__count{
        background: none;
        bottom: -8px;
    }
    .el-textarea{
        font-size: 12px;
    }
    .el-radio__label{
        font-size: 12px;
    }
    .el-radio{
        margin-right: 5px;
        height: 35px;
        box-sizing: border-box;
        padding-top: 9px;
    }
    .el-radio.small-radio{
        padding-right: 8px;
    }
    .el-radio.is-bordered+.el-radio.is-bordered{
        margin-left: 0;
    }
    .el-input{
        width: 78%;
    }
    .el-input.small-input{
        width: 30%;
    }
    .el-input__inner{
        width: 100%;
        display: inline-block;
        font-size: 12px;
        border: none;
        border-bottom: 1px solid #DCDFE6;
        border-radius: 0;
        height: 35px;
        line-height: 35px;
        box-sizing: border-box;
    }
    .el-form-item.textareaEl{
        height: 90px;
    }
    .el-form-item.textareaEl.el-textarea__inner{
        height: 80px;
        width: 100%;
        font-size: 12px;
    }
    .el-form-item__label{
        padding: 0;
        font-size: 12px;
    }
    .el-form-item__error{
        left:0px;
        top:25px;
    }
    .remove-procedure.el-button:active{
        color: #373737;
    }
    .remove-procedure.el-button:focus{
        color: #373737;
    }
    .el-icon-arrow-up:before,.el-icon-arrow-down:before {
        font-weight: 700;
    }
}
</style>