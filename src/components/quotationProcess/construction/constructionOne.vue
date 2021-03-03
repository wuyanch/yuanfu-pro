<template>
    <div class="procedure-one">
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

        <div class="procedure-form">
            <!-- 单独计划 -->
            <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
                <div class="procedure-content" v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key">
                    <div class="procedure-corner-mark"><span> 工程基础信息 </span></div>

                    <el-form-item 
                        label="工程类型：" 
                        :prop="'domains.' + index + '.projectType'"
                        :rules="[
                            { required: true,message: '必选', trigger: 'change' }
                            ]"
                    >
                        <el-radio-group v-model="domain.projectType">
                            <el-radio :label="'房屋(非分包)工程'" border>房屋(非分包)工程</el-radio>
                            <el-radio :label="'装修工程'" border>装修工程</el-radio>
                            <el-radio :label="'其他'" border>其他</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item
                        :prop="'domains.' + index + '.projectName'"
                        label="工程名称："
                        :rules="[
                        { required: true,message: '必填',trigger: 'blur' }
                        ]"
                    > 
                        <el-input clearable v-model="domain.projectName" placeholder="请输入完整的工程名称"></el-input>
                    </el-form-item>

                    <el-form-item
                        :prop="'domains.' + index + '.projectAddress'"
                        label="工程地点："
                        :rules="[
                        { required: true,message: '必填',trigger: 'blur' }
                        ]"
                    > 
                        <el-input clearable v-model="domain.projectAddress" placeholder="请输入详细的工程地点"></el-input>
                    </el-form-item>

                    <el-form-item
                        :prop="'domains.' + index + '.projectContent'"
                        label="工程内容："
                        :rules="[
                        { required: true,message: '必填',trigger: 'blur' }
                        ]"
                    > 
                        <el-input clearable v-model="domain.projectContent" placeholder="请简述具体的工程内容"></el-input>
                    </el-form-item>
                   
                   <el-form-item
                        :prop="'domains.' + index + '.projectDuring'"
                        label="工程期间："
                        :rules="[
                        { required: true, message: '必填', trigger: 'blur' }
                        ]"
                    > 
                        <el-input clearable v-model="domain.projectDuring" placeholder="请输入工程期间"></el-input>
                    </el-form-item>

                     <el-form-item 
                        label="保险期间：" 
                        :prop="'domains.' + index + '.projectInsure'"
                        :rules="[
                            { required: true,message: '必填', trigger: 'change' }
                            ]"
                    >
                        <el-radio-group v-model="domain.projectInsure">
                            <el-radio :label="1" border>与工程期间一致</el-radio>
                            <el-radio :label="2" border>其他</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    
                    <el-form-item
                        :prop="'domains.' + index + '.projectCost'"
                        label="工程总造价(/万元）："
                        :rules="[
                        { required: true,message: '必填',trigger: 'blur' }
                        ]"
                        class="short-input"
                    > 
                        <el-input clearable v-model="domain.projectCost" placeholder="请填写工程总造价"></el-input>
                    </el-form-item>

                    <el-form-item
                        :prop="'domains.' + index + '.projectArea'"
                        label="施工总面积(/平方米)："
                        class="short-input"
                    > 
                        <el-input clearable v-model="domain.projectArea" placeholder="请填写施工总面积"></el-input>
                    </el-form-item>

                    <el-form-item
                        :prop="'domains.' + index + '.projectQualifications'"
                        label="施工单位对应上述工程资质："
                        class="short-select"
                    > 
                        <span>{{domain.projectType}}—</span>
                        <el-select v-model="domain.projectQualifications"  placeholder="请选择">
                            <el-option :label="'特级'" value="特级"></el-option>
                            <el-option :label="'一级'" value="一级"></el-option>
                            <el-option :label="'二级'" value="二级"></el-option>
                            <el-option :label="'三级'" value="三级"></el-option>
                            <el-option :label="'无施工资质'" value="无施工资质"></el-option>
                        </el-select>
                    </el-form-item>

                </div> 
            <!-- 单独计划-结束 --> 
            </el-form>
        </div>


        
        <div class="procedure-btn">
            <button>返回主页</button><button @click="goPrev">上一步</button><button>暂存</button><button @click="submitForm('dynamicValidateForm')">下一步</button>
        </div>
        

    </div>

    
</template>

<script>
export default {
    name:'procedureOne',
    data(){
        return{
            dynamicValidateForm: {
                domains: [{
                    projectType:'房屋(非分包)工程',//工程类型
                    projectName: '',//工程名称
                    projectAddress:'',//工程地点
                    projectContent:'',//工程内容
                    projectDuring:'',//工程期间
                    projectInsure:1,//保险期间
                    projectCost:'',//工程总造价
                    projectArea:'',//施工总面积
                    projectQualifications:'',//工程资质
                }]
            },
            active:0
        }
    },
    created(){
    },
    methods:{
        //上一步
        goPrev: function(){
            let quotationInformation = {"distributionPlan":this.dynamicValidateForm.domains};
                localStorage.setItem("quotationInformation_2",JSON.stringify(quotationInformation));
            this.$router.go(-1);
        },

        //下一步--存储表单到localstroage
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                console.log(this.dynamicValidateForm.domains);
                let quotationInformation = {"distributionPlan":this.dynamicValidateForm.domains};
                localStorage.setItem("quotationInformation_2",JSON.stringify(quotationInformation));
                this.$router.push({path:'constructionTwo'});
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        //从loclstroage里获取消息
        getLocalStroage:function(){
            if(!!localStorage.getItem('quotationInformation_2')&&localStorage.getItem('quotationInformation_2')!=''){
                let information = JSON.parse(localStorage.getItem('quotationInformation_2'));
                
                for(let j = 0; j < information.distributionPlan.length;j++){
                    this.dynamicValidateForm.domains.push(information.distributionPlan[j])
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.procedure-one{
    margin-top: 50px;
    margin-bottom: 50px;
}
.procedure-step{
    position: fixed;
    top: 45px;
    width: 100%;
}
.procedure-form{
    margin-top: 100px;
    overflow: hidden;
    height: calc(100vh - 150px);
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
        color: #bfbfbf;
        line-height: 10px;
        margin-top: -4px;
        text-align: left !important;
        text-align: -webkit-left;
    }
    .el-form-item{
        margin-bottom: 5px;
    }
    .procedure-corner-mark{
        // width: 106px;
        width: 100%;
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
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 14px;
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

</style>

<style lang="scss">
.procedure-one{
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
    // .el-form-item{
    //     // height: 35px;
    //     height: auto;
    //     line-height: 35px;
    //     .el-form-item__content{
    //         line-height: 35px;
    //     }
    // }
}
.procedure-content{
    .el-form-item{
        &:last-child{
            margin-bottom: 0;
        }
    }
    .el-radio__label{
        font-size: 12px;
        padding-left: 5px;
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
    .short-input .el-input{
        width: 60%;
    }
    .short-select .el-select{
        width: 20%;
        line-height: 35px;
    }
    .short-select .el-input{
        margin-right: 0;
        width: 100%;
    }
    .short-select .el-input--suffix{
        margin-right: 0;
    }
    .short-select .el-input__suffix{
        right: -14px;
    }
    .short-select .el-input__inner{
        padding-left: 0px;
        padding-right: 0px;
    }
    .el-input.small-input{
        width: 25%;
    }
    .el-input__inner{
        width: 100%;
        display: inline-block;
        font-size: 12px;
        border: none;
        border-bottom: 1px solid #DCDFE6;
        border-radius: 0;
        height: 35px;
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
        left:70px
    }
    .el-form-item.no-margin{
        margin-bottom: 3px;
    }
    .remove-procedure.el-button:active{
        color: #373737;
    }
    .remove-procedure.el-button:focus{
        color: #373737;
    }
}
</style>