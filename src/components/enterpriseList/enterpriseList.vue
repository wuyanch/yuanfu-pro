<template>
    <div class="enterprise-list"  vkshop-event-scope="项目列表">
        <!-- 头部 -->
        <div class="list-top">
            <ul class="list-ul">
                <li :class="{active:(curActive && isSelect == 0)}" @click="changeActive(0)">全部项目</li>
                <li :class="{active:(!curActive && isSelect == 0)}" @click="changeActive(1)">已关注</li>
            </ul>
            <div class="search-div">
                <el-autocomplete
                class="search-input"
                v-model="enterpriseName"
                :fetch-suggestions="querySearch"
                placeholder="请输入项目名称"
                :trigger-on-focus="false"
                @select="handleSelect"
                @focus="changeStatu"
                @change="handleChange"
                ></el-autocomplete><button class="search-btn" @click="goSelect">搜索</button>
            </div>
        </div>
        <!-- 列表 -->
        <div class="enterprise-list-content">
            <div class="enterprise-scroll" v-if="initLoading == true">
                <!-- 全部项目为0 -->
                <ul v-if="enterpriseList != null">
                    <li v-for="(item,index) in enterpriseList" :key="index" @click.stop="lookProject(item)" >
                        <div :vkshop-event-param="'project=' + item.proname" vkshop-event-name="切换项目" vkshop-event-type="click">
                            <p class="enterprise-name">{{item.proname}}</p><p class="enterprise-time">项目创建时间：{{item.createtime}}</p>
                            <p class="enterprise-follow-btn"><button v-if="item.isattention == '1'" class="follow" @click.stop="followClick(item.procode,index)">已关注</button><button class="no-follow" @click.stop="followClick(item.procode,index)" v-else>添加到关注</button></p>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </li>
                </ul>
                <ul v-else-if="isSelect == 1 && enterpriseList == null && isSelect_flag == false">
                    <li class="nodata">等待输入项目名称中...</li>
                </ul>
                <ul v-else-if="isSelect_flag == false && enterpriseList == null && isSelect == 0">
                    <li class="nodata"><img src="../../assets/img/nodata.png"><p>{{noDataTip}}</p></li>
                </ul>
                <ul v-else-if="isSelect_flag == true && enterpriseList == null && isSelect == 1">
                    <li class="nodata"><img src="../../assets/img/nodata.png"><p>{{noDataTip}}</p></li>
                </ul>
                <!-- 分页区 -->
                <div class="pagination-m">
                    <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next,jumper,total"
                    :current-page.sync="currentPage"
                    :pager-count="5"
                    :total="allTotal"
                    :hide-on-single-page="true">
                    </el-pagination>
                </div>
            </div>
            <div class="enterprise-scroll" v-else>
                <li class="nodata"><i class="el-icon-loading"></i><p>正在拼命加载中，请稍等</p></li>
            </div>
        </div>
       
        <!-- 固定按钮区 -->
        <div class="creat-new-enterprise">
            <button @click="goHome" vkshop-event-name="返回首页" vkshop-event-type="click">返回</button>
            <button @click="goCreatProject" vkshop-event-name="创建新项目" vkshop-event-type="click">创建新项目</button>
        </div>

       
    </div>
</template>

<script>
import { error } from 'util';

export default {
    name:'enterpriseList',
    data(){
        return {
            ifLoading : false,
            enterpriseName:'',//搜索框里的项目名称,
            curActive:true,//当前聚焦的
            isSelect : 0,//是否要搜索
            isSelect_flag:false,//是否已经点击搜索按钮
            exhibitionItems:0,//是否关注 0--全部项目，1--已关注
            currentPage:1,//默认页
            allTotal:0,//总条数
            enterpriseList:null,//项目列表
            errorContent:'',//报错内容
            allProjectName:[],//模糊搜索的字
            timeout:null,
            noDataTip:'暂时没有项目，请创建项目',//没有数据时候的提示语
            initLoading:false,//初始化加载
        }
    },
    created(){
       
    },
    mounted() {
      this.init();
    },
    methods: {
        //初始化获取列表
        init: function(){
            let that = this;
            new Promise(function (resolve, reject) {
                that.$axios.get('/index/getProjectList',{
                    params:{
                        page:1,
                        size:10,
                        rand:new Date().getTime()
                    }
                }).then((response) => {
                    console.log("getProjectList")
                    console.log(response.data)
                       if(response.data.code == 200){
                            that.enterpriseList = null;
                            if(response.data.data.items.length > 0){
                                that.enterpriseList = response.data.data.items;
                                that.allTotal = response.data.data.total;
                            }
                        }else{
                            that.$alert('出错啦！获取数据失败','',{
                                confirmButtonText:'好的，我知道了~'
                            }).catch(()=>{})
                        }
                        console.log(that.enterpriseList);
                        resolve(response);
                })
            }).then(function (amount){
                 console.log("getAllByUserInfo")
                return that.$axios.get('/index/getAllByUserInfo',{
                    params:{
                        rand:new Date().getTime()
                    }
                }).then((response) => { // 重要，注意添加了return
                        if(response.data.code == 200){
                            that.initLoading = true;
                            that.allProjectName.length = 0;
                            console.log(response.data)
                            if(response.data.data != null){
                                for(var i = 0; i < response.data.data.length; i++){
                                    that.allProjectName.push({'value': response.data.data[i].proname})
                                }
                            }
                        }else{
                            that.$alert('出错啦！获取数据失败','',{
                                confirmButtonText:'好的，我知道了~'
                            }).catch(()=>{})
                        }
                    console.log(that.allProjectName)
                })
            }).catch(function (error) {
                that.$alert('服务器开小差，请稍后再来~','',{
                    confirmButtonText:'好的，我知道了~'
                }).catch(()=>{})
            })
        },
        handleChange(val){},
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            let that = this;
            if(this.curActive && this.isSelect == 0){//全部项目且不是搜索的
             //page--页数,proname--项目名称,isSelect_flag--是否为搜索
                this.getData({page:val});//page:val,size:10,
            }else if(!this.curActive && isSelect == 0){//关注项目且不是搜索的
                this.getData({page:val,isattention:this.exhibitionItems});
            }
        },
        //切换关注项目或是全部项目
        changeActive: function(currentProject){
            this.enterpriseName = '';
            this.isSelect = 0;
            this.curActive = (currentProject == 0 && this.curActive) || (currentProject == 1 && !this.curActive)?this.curActive:!this.curActive;
            this.currentPage = 1;
            if(this.curActive){
                this.exhibitionItems = 0;
                //page--页数,proname--项目名称,isSelect_flag--是否为搜索
                this.getData({page:1});
            }else{
                this.exhibitionItems = 1;
                this.getData({page:1,isattention:1});
            }
        },
        //点击关注按钮
        followClick:function(procode,index){
            let newAttention = this.enterpriseList[index].isattention == "1"? "0":"1";
            let params = {isAttention:newAttention, procode:procode,rand:new Date().getTime()}
            this.$axios.post('/index/isAttention',this.$qs.stringify(params))
            .then(response => {
                this.$set(this.enterpriseList[index],"isattention",this.enterpriseList[index].isattention == "1"? "0":"1");//改变状态位
            }).catch(error => {

            })
            
        },
        //输入框获取焦点，改变状态
        changeStatu: function(){
            this.isSelect = 1;
            this.enterpriseList = null;
            this.allTotal = 0;
            this.isSelect_flag = false;
        },
        //搜索选择
        querySearch(queryString, cb) {
            var allProjectNames = this.allProjectName;
            var results = queryString ? allProjectNames.filter(this.createFilter(queryString)) : allProjectNames;
            console.log(results);
            // 调用 callback 返回建议列表的数据
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            },  Math.random());
        },
        createFilter(queryString) {
            return (restaurant) => {
                // return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
            };
        },
        //搜索选择的项目名称
        handleSelect: function(item){
            this.$nextTick(function () {
                console.log('搜索选择的项目名称',item.value)
                this.getData({page:1,proname:item.value,isSelect_flag:true});
            });
        },
        goSelect: function(){
            console.log(this.enterpriseName);
            //page--页数,proname--项目名称,isSelect_flag--是否为搜索
            this.getData({page:1,proname:this.enterpriseName,isSelect_flag:true});
        },
        //创建新项目按钮
        goCreatProject: function(){
            this.$router.push({path:'createEnterprise'})
        },
        //选中要查看的项目
        lookProject: function(event){
            localStorage.setItem('YF_mainstream_project',event.proname)
            localStorage.setItem('YF_mainstream_project_code',event.procode)
            localStorage.setItem('YF_mainstream_project_isAttention',event.isattention)
            this.$clearTemporaryAll();//清楚所有步骤的信息
            this.$router.push({path:'/',query:{procode:localStorage.getItem('YF_mainstream_project_code')}});
        },
        //返回上一步
        goHome: function(){
            this.$router.push({path:'/',query:{procode:localStorage.getItem('YF_mainstream_project_code')}});
        },
        //统一一个函数page--页数,proname--项目名称,isSelect_flag--是否为搜索
        getData: function (obj) {
            let that = this;
            let objc = {
                page:obj.page,
                proname:(obj.proname==undefined||obj.proname==null)?'':obj.proname,
                isattention:(obj.isattention==undefined||obj.isattention==null)?'':obj.isattention,
                isSelect_flag:(obj.isSelect_flag==undefined||obj.isSelect_flag==null)?false:obj.isSelect_flag
            }
            this.$axios.get('/index/getProjectList',{
                    params:{
                        page:objc.page,
                        size:10,
                        proname:objc.proname,
                        isattention:objc.isattention,
                        rand:new Date().getTime()
                    }
                }).then(response=>{
                    console.log(response);
                    if(response.data.code == 200){
                        that.enterpriseList = null;
                        if(response.data.data.items.length != 0){
                            that.enterpriseList = response.data.data.items;
                            that.allTotal = response.data.data.total;
                            that.isSelect_flag = objc.isSelect_flag;
                        }else{
                            that.isSelect_flag = objc.isSelect_flag;
                            that.enterpriseList = null;
                            that.allTotal = response.data.data.total;
                            if(that.isSelect_flag == false){
                                that.noDataTip = '目前您还没有关注任何项目哦~，先去关注项目吧'
                            }else{
                                that.noDataTip = '没有符合条件的项目'
                            }
                        }
                    }else{
                        that.$alert('出错啦！获取数据失败','',{
                            confirmButtonText:'好的，我知道了~'
                        }).catch(()=>{})
                    }
                    document.getElementsByClassName("enterprise-scroll")[0].scrollTop = 0;
                }).catch(function (error) {
                    this.errorContent = '服务器开小差，请稍后再来~'
                })
        }

  }
}
</script>

<style lang="scss" scoped>
$listTop : 110px;
$creatNewEnterprise:38px;
::-webkit-scrollbar {
    width: 0px;
}
.list-top{
    height: $listTop;
    background: #fff;
    padding: 0 15px;
    position: fixed;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: 1;
    .list-ul{
        margin-top: 10px;
        font-size: 12px;
        li{
            display: inline-block;
            margin: 0 13px;
            padding: 10px 0 ;
        }
        li.active{
            border-bottom: 2px solid #62b4ff;
            color: #62b4ff;
            font-size: 14px;
            font-weight: 700;
        }
    }
    .search-div{
        border: 1px solid #bfbfbf;
        border-radius: 30px;
        height: 36px;
        margin-top: 12px;
        vertical-align: middle;
        position: relative;
        .search-input{
            display: inline-block;
            height: 36px;
            vertical-align: text-top;
            padding: 0;
            margin: 0;
            width: 78%;
            border-top-left-radius: 50px;
            border-bottom-left-radius: 50px;
            border: none;
            padding-left: 20px;
            box-sizing: border-box;
        }
        ::-webkit-input-placeholder{
            color: #bfbfbf;
        }
        .search-btn{
            display: inline-block;
            height: 36px;
            background: #62b4ff;
            border-radius: 50px;
            padding: 0 20px;
            border: none;
            color: white;
            vertical-align: text-top;
            position: absolute;
            right: -1px;
            font-size: 12px;
        }
    }
}
.enterprise-list-content{
    padding: 10px 15px;
    margin-top: 110px;
    height: calc(100vh - #{$listTop} - #{$creatNewEnterprise} - 10px);
    overflow: hidden;
    .enterprise-scroll{
        height: 100%;
        overflow: auto;
    }
    ul{
        list-style-type: none;
        background: #f5f5f5;
    }
    li{
        margin-top: 8px;
        font-size: 12px;
        div{
            background: #fff;
            border-radius: 10px;
            position: relative;
            padding-bottom: 25px;
        }
    }
    li.nodata{
        position: fixed;
        top: 40%;
        left: 50%;
        transform: translate(-50%);
        font-size: 13px;
        text-align: center;
        list-style-type: none;
        img{
            object-fit : contain
        }
    }
    
    .pagination-m{
        margin-top: 15px;
        padding-bottom: 10px;
    }
    .enterprise-name{
        font-size: 12px;
        padding: 10px 20px 10px 10px;
    }
    .enterprise-time{
        font-size: 11px;
        color: #bfbfbf;
        padding: 0px 20px 10px 10px;
    }
    .enterprise-follow-btn{
        button{
            border: none;
            background: inherit;
            border-radius: 10px;
            font-size: 11px;
            padding: 4px 14px;
            position: absolute;
            right: 20px;
            bottom: 8px;
        }
        button.no-follow{
            border: 1px solid #62b4ff;
            color: #62b4ff;
        }
        button.follow{
            background: #62b4ff;
            color: white;
        }
    }
    .el-icon-arrow-right{
        color: #bfbfbf;
        font-size: 15px;
        position: absolute;
        right: 10px;
        top: 20px;
        transform: translateY(-50%);
    }
}
.el-pagination{
    white-space: normal;
    text-align: center;
}
.el-pagination__total{
    margin-left: 10px !important;
    color: #acacac;
}
.el-pagination.is-background .btn-next{
        padding: 5px;
}
.creat-new-enterprise{
    font-size: 0px;
    text-align: center;
    padding: 10px 5px;
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    background: #f5f5f5;
    button{
        // width: 100%;
        height: $creatNewEnterprise;
        border-radius: 5px;
        position: relative;
        overflow: hidden;
        font-size: 13px;
        background: inherit;
        &:first-child{
            width: 18%;
            border: 1px solid #60b3ff;
            color: #60b3ff;
            margin-right: 2%;
        }
        &:last-child{
            background: #60b3ff;
            color: white;
            border: 1px solid #60b3ff;
            width: 80%;
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
.enterprise-list{
    .search-div{
        .el-input{
        vertical-align: inherit;
        }
        .el-input__inner{
            display: inline-block;
            height: 36px;
            vertical-align: text-top !important;
            padding: 0;
            margin: 0;
            width: 100%;
            border-top-left-radius: 50px;
            border-bottom-left-radius: 50px;
            border: none;
            padding-left: 1px;
            box-sizing: border-box;
            font-size: 12px;
        }
    }
    .el-pagination__jump{
        margin-top: 0px;
    }
    .el-pagination__total{
        // margin-top: 10px;
        margin-left: 15px;
        color: #bfbfbf;
    }
    .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev{
       min-width: 35px;
    }
}
</style>