<template>
    <div class="quotationProcess-index" vkshop-event-scope="确认项目信息">
        <enterprise-name :enterpriseCurCall="enterpriseCurName"></enterprise-name>
        <!-- 确认信息 -->
        <div class="information-first" vkshop-event-scope="确认项目信息">
            <p class="decorate">请确认项目信息</p>
            <p class="information-ind"><span><i class="xing">*</i>行业</span><el-button type="text" @click="centerDialogVisible = true"><span v-if="hasInde" class="placeHolder">请选择行业</span><span v-else >{{selectIndustry}}</span><i class="el-icon-arrow-down"></i> </el-button></p>
            <p class="information-num" ><span><i class="xing">*</i>单位人数</span><el-input v-model.number="totalNum" placeholder="请填写单位人数"></el-input></p>
            <p class="information-remark"><span>备注</span>
                <el-input
                type="textarea"
                resize="none"
                placeholder="可描述本项目的其他基本背景情况。"
                v-model="textareaRecode"
                maxlength="2000"
                show-word-limit>
                </el-input></p>
        </div>
        <el-dialog
        title="请选择项目单位从事的行业"
        :visible.sync="centerDialogVisible"
        width="100%"
        center
        class="pDialog">
            <ul>
                <li v-for="(item,index) in centerDialogVisibleList" :key="index" @click="clickIndustry(index)">{{item.industry}}</li>
            </ul>
        </el-dialog>
        <!-- 承上启下的按钮 -->
        <div class="button-btn">
            <button @click="goHome" vkshop-event-name="返回主页" vkshop-event-type="click">返回项目主页</button><button @click="saveOrUpdateProDetail" vkshop-event-name="开启报价" vkshop-event-type="click">开启报价</button>
        </div>
    </div>
</template>

<script>
import enterpriseName from '../quotationProcess/processEnterpriseName.vue'
export default {
    name:'QuotationProcessIndex',
    components:{enterpriseName},
    data(){
        return{
            enterpriseCurName:'',
            totalNum:'',//总人数
            textareaRecode:'',//备注
            selectIndustry:'',//行业
            selectIndustryCode:'',//行业code
            hasInde:true,
            centerDialogVisible: false,//是否弹出对话框
            centerDialogVisibleList:[],
        }
    },
    created(){
        //获取行业信息
        this.getIndustryList();
        //获取当前的项目名称
        this.enterpriseCurName = localStorage.getItem('YF_mainstream_project');
    },
    methods:{
        //选择行业
        clickIndustry:function(event){
            this.centerDialogVisible = false;
            this.hasInde = false;
            this.selectIndustry = this.centerDialogVisibleList[event].industry;
            this.selectIndustryCode = this.centerDialogVisibleList[event].industrycode;
        },
        //回到首页
        goHome: function(){
            if(this.totalNum != '' && this.selectIndustry !=''){
                this.toSaveOrUpdateProDetail();
            }
            // this.$router.go(-1);
            this.$clearTemporaryAll();//清楚所有步骤的信息
            this.$router.push({name:'OtoIndex'})
        },
        //获取行业信息
        getIndustryList: function(){
            let _that = this;
            new Promise(function(resolve,reject){
                _that.$axios.get('/index/getIndustryList').then(response => {
                    _that.centerDialogVisibleList = response.data.data;
                    console.log(JSON.stringify(_that.centerDialogVisibleList))
                    resolve(response.data.code)
                }).catch(error =>{
                    _that.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
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
                             _that.centerDialogVisibleList.forEach(function(currentValue, index, arr){
                             if(Number(currentValue.industrycode) == Number(response.data.data[0].industrycode)){
                                _that.selectIndustry = currentValue.industry;
                             }
                         })
                            _that.selectIndustryCode = response.data.data[0].industrycode;
                            _that.totalNum = response.data.data[0].unitnum;
                            _that.textareaRecode = response.data.data[0].remark;
                            _that.hasInde = false;
                        }
                    }).catch(error =>{
                        _that.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                            confirmButtonText:'好的，我明白了'
                        }).catch(()=>{})
                    })
                }
            })
        },
        //开启报价--创建或者更新项目信息/index/saveOrUpdateProDetail
        saveOrUpdateProDetail: function(){//procode--项目编码  industrycode--行业编码 unitnum --单位人数  remark--描述
            if(this.totalNum != '' && this.selectIndustry !=''){
                this.toSaveOrUpdateProDetail();
                this.$router.push({name:'templateSelection'});
            }else{
                this.$alert('需要先填写完项目信息才可以开启报价哦~','',function(){
                    confirmButtonText:'好的，我知道了'
                }).catch(()=>{
                    
                })
            }
        },
        //存储项目，不管有没有该，都更新
        toSaveOrUpdateProDetail: function(){//procode--项目编码  industrycode--行业编码 unitnum --单位人数  remark--描述
            let params = {procode:localStorage.getItem('YF_mainstream_project_code'),industrycode:this.selectIndustryCode,unitnum:this.totalNum,remark:this.textareaRecode,rand:new Date().getTime()}
            
            this.$axios.post('/index/saveOrUpdateProDetail',this.$qs.stringify(params)).then(response => {
                let quotationInformation = {totalNum:this.totalNum,industry:this.selectIndustry,selectIndustryCode:this.selectIndustryCode,textareaRecode:this.textareaRecode};
                localStorage.setItem("quotationInformation_0",JSON.stringify(quotationInformation));
                console.log(response);
            }).catch(error =>{
                this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                    confirmButtonText:'好的，我明白了'
                }).catch(()=>{})
            })
        },

    },
    
}
</script>

<style lang="scss" scoped>
::-webkit-input-placeholder{
    color: #bfbfbf;
}
.information-first{
    padding: 15px;
    margin-top: 50px;
}
.decorate{
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 20px;
}
.information-ind,.information-num,.information-remark{
    font-size: 13px;
    background: #fff;
    border-radius: 10px;
    padding: 0 10px;
    margin-top: 10px;
    height: 40px;
    .el-icon-arrow-down{
        color: #bfbfbf;
    }
    i.xing{
        font-style: normal;
        color: red;
    }
    span:first-child{
        width: 68px;
        display: inline-block;
    }
    .el-input,.el-button{
        width: 240px;
        text-align: left;
        font-size: 13px;
    }
    .el-button{
        padding-left: 15px;
        span{
            display: inline-block;
            width: 100%;
            color: #373737;
        }
        span.placeHolder{
            color: #bfbfbf;
        }
    }
}
.information-remark{
    padding: 10px;
    height: 250px;
    span{
        display: inline-block;
        margin-bottom: 10px;
    }
}
 .button-btn{
    text-align: center;
    button{
        width: 150px;
        height: 38px;
        border-radius: 5px;
        position: relative;
        overflow: hidden;
        margin-top: 30px;
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
            margin-left: 15px;
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
</style>
<style lang="scss">
.quotationProcess-index{
    .information-num{
        .el-input__inner{
            border: 0px;
            height: 38px;
            line-height: 38px;
        }
    }
    .information-remark{
        textarea{
            height: 200px;
            width: 100%;
            font-size: 12px;
        }
        .el-textarea__inner{
            padding: 15px 15px 25px 15px;
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
            text-align: center;
            li{
                padding: 10px 0;
            }
        }
    }
}
</style>