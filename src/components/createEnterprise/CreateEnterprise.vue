<template>
    <div class="creat-enterperise" v-loading.fullscreen.lock="loading"  vkshop-event-scope="创建项目">
        <!-- 输入企业名 -->
        <div>
            <p class="input-label">项目名称（必填）</p>
            <el-input
            type="text"
            placeholder="输入证件上的名称。如：泰康养老保险股份有限公司广东分公司"
            v-model="enterpriseName"
            >
            </el-input>

            <p class="tip"><i>*</i>项目名称以后对您十分重要，创建后不能修改，请您仔细检查。</p>
            <img :src="forexampleImg" alt="">
           
        </div>
        <div class="button-btn">
            <button @click="noPcancelCreate" v-if="ifHavePro == false" vkshop-event-name="取消创建" vkshop-event-type="click">取消创建</button>
            <button @click="cancelCreate" v-else  vkshop-event-name="取消创建" vkshop-event-type="click">取消创建</button>
            <button @click="wantCreate"  vkshop-event-name="确定创建" vkshop-event-type="click">确定创建</button>
        </div>
    </div>
</template>

<script>
import { error } from 'util';
export default {
    name:'CreateEnterprise',
    data(){
        return{
            forexampleImg:require('../../assets/img/example.png'),
            enterpriseName:'',
            loading: false,
            ifHavePro:null//记录该用户是否有项目
        }
    },
    created(){
        this.checkIsPro();
    },
    methods:{
        // 进来检查是否有项目
        checkIsPro: function(){
            this.$axios.get('/index/getAllByUserInfo',{
                    params:{
                        rand:new Date().getTime()
                    }
            }).then((response) => { 
                if(response.data.data != null){
                    this.ifHavePro = true;
                }else{
                    this.ifHavePro = false;
                }
            })
        },
        //没有项目的情况下取消创建
        noPcancelCreate: function(){
            this.$confirm('您还没有项目，先创建项目再离开吧~','',{
                confirmButtonText:'继续创建',
                cancelButtonText:'返回主页',
                showClose:false
            }).then(()=>{
                
            }).catch(()=>{
                this.$router.go(-1)
            })
        },
        //有项目的情况下取消创建
        cancelCreate: function(){
            this.$confirm('您确定放弃创建项目吗？', '', {
                confirmButtonText: '继续创建',
                cancelButtonText: '返回项目列表',
                showClose:false
            }).catch(()=>{
                this.$router.go(-1);
            })
            
        },
        //确定创建
        wantCreate: function(){
            if(this.enterpriseName != ''){
                // this.loading = true;
                let _that = this;
                let params = {proname:this.enterpriseName.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,''),rand:new Date().getTime()}//去左右空格
                new Promise(function (resolve, reject) {
                    _that.$axios.post('/index/checkProjectName',_that.$qs.stringify(params)).then((response) => {
                        console.log(response.data.code);
                        // resolve(response.data.code);
                        resolve(response.data);
                    })
                }).then(function (resData){
                    console.log("里")
                    if(resData.code == 500){//有该项目
                         console.log("里1")
                        _that.$confirm("该项目已在您的“项目列表”中，无需重复创建。",'',{
                            confirmButtonText: '去看看',
                            cancelButtonText: '取消',
                            showClose:false
                        }).then(() => {
                            console.log("我按了确定");
                            _that.$clearTemporaryAll();//清空所有的步骤信息
                            localStorage.setItem('YF_mainstream_project',_that.enterpriseName.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,''))
                            //缺省了项目的project_code，project_isAttention
                            localStorage.setItem('YF_mainstream_project_code',resData.data.procode);
                            localStorage.setItem('YF_mainstream_project_isAttention',resData.data.isattention);
                            _that.$router.push({path:'/'});
                        }).catch(() => {
                            
                        })
                    }else{//没有该项目
                        _that.$confirm("项目名称对您十分重要，创建后不能修改，请您仔细检查。",'',{
                            confirmButtonText: '确认创建',
                            cancelButtonText: '再看看',
                            showClose:false
                        }).then(() => {
                            //要加return
                            return _that.$axios.post('/index/createProject',_that.$qs.stringify(params)).then(function (response) {
                                if(response.data.code == '200'){//创建成功
                                console.log(response.data)
                                    _that.$clearTemporaryAll();//清空所有的步骤信息
                                    localStorage.setItem('YF_mainstream_project',_that.enterpriseName.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,''))
                                    localStorage.setItem('YF_mainstream_project_code',response.data.data);
                                    localStorage.setItem('YF_mainstream_project_isAttention',0);
                                    _that.$router.push({path:'/'});
                                }else{
                                    _that.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                                        confirmButtonText:'确定',
                                        showClose:false
                                    })
                                }
                            })
                        }).catch(() => {
                            console.log("取消")
                        })
                    }  
                }).catch(function (error) {
                    // this. = '服务器开小差，请稍后再来~'
                }) 
                
            }else{
                this.$alert('项目名称不能为空。请输入证件上的名称', '', {
                    confirmButtonText: '确定',
                    showClose:false
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.creat-enterperise{
    padding: 15px;
    font-size: 12px;
    .input-label{
        margin-bottom: 5px;
    }
    .el-input{
        font-size: 12px;
    }
    img{
        width: 100%;
        margin-top: 40px;
    }
    .tip{
        font-size: 11px;
        margin-top: 30px;
        i{
            font-style: normal;
            font-weight: 700;
            color: #f91b1b;
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
            margin-top: 40px;
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
}
</style>