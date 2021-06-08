<template>
  <div class="oto-index" vkshop-event-scope="我的员福首页">
    <!-- 头部 -->
    <div class="header">
      <button class="creat-change" @click="createEnterprise" >
        <span v-if="haveEnterprise" :vkshop-event-param="'project=' + proname"  vkshop-event-name="切换项目" vkshop-event-type="click"><i class="el-icon-sort" ></i> 切换项目</span>
        <span v-else vkshop-event-name="创建项目" vkshop-event-type="click"><i class="el-icon-plus" ></i> 创建项目</span>
      </button>
      <p class="establishment">{{proname}}</p>
      <span class="left-q qq"><i></i><i></i></span>
      <span class="right-q qq"><i></i><i></i></span>
    </div>
    <!-- 主体内容 -->
    <div class="main">
      <!-- 保费展示 2020-11-10注释（不上线）-->
      <!-- <div class="Premium">
        <ul class="Premium-ul">
          <li v-for="(item,index) in variousPremiums" :key="index"><span>{{item.premiums}}</span><span>{{item.name}}</span></li>
        </ul>
      </div> -->
      <!-- 服务展示 -->
      <div class="service">
        <!-- 询报价 -->
        <div>
          <p class="service-title">询报价</p>
          <ul class="service-ul">
              <li  :class="{ newLaunch: item.ifNew }" v-for="(item,index) in quotedPriceList" :key="index" :data-state="item.state" @click="modularGo(item.address)" :vkshop-event-name="item.name" vkshop-event-type="click"><img :src="item.src" alt=""><span>{{item.name}}</span></li>
          </ul>
        </div>
        <!-- 承保保全 -->
        <div>
          <p class="service-title">承保保全</p>
          <ul class="service-ul">
              <li :class="{ newLaunch: item.ifNew }" v-for="(item,index) in coverWorkList" :key="index" :data-state="item.state" @click="modularGo(item.address)" :vkshop-event-name="item.name" vkshop-event-type="click"><img :src="item.src" alt=""><span>{{item.name}}</span></li>
          </ul>
        </div>
        <!-- 承保服务 -->
        <div>
          <p class="service-title">承保服务</p>
          <ul class="service-ul">
              <li :class="{ uncultivated: item.ifDevlop }" v-for="(item,index) in vocationalWorkList" :key="index" :data-state="item.state" @click="modularGo(item.address)" :vkshop-event-name="item.name" vkshop-event-type="click"><img :src="item.src" alt=""><span>{{item.name}}</span></li>
          </ul>
        </div>
        <!-- 增值服务 -->
        <div>
          <p class="service-title">增值服务</p>
          <ul class="service-ul">
              <li :class="{ uncultivated: item.ifDevlop }" v-for="(item,index) in otherList" :key="index" :data-state="item.state" @click="modularGo(item.address)" :vkshop-event-name="item.name" vkshop-event-type="click"><img :src="item.src" alt=""><span>{{item.name}}</span></li>
          </ul>
        </div>
      </div>
      <!-- 是否关注 -->
      <div class="is-follow" v-if="haveEnterprise && isAttention != null">
        <button class="is-or-follow" @click="addFollow" ><span v-if="isAttention == 0">添加到关注</span><span v-else>已关注</span></button>
      </div>
    </div>
  </div>
  
</template>

<script>
export default {
  name: 'OtoIndex',
  data () {
    return {
     count:'',
     haveEnterprise: false,//是否含有项目
     isAttention: null,//是否关注
     proname:'--',//项目名称
     variousPremiums:[
                {id:'0',name:'累计XX保费(元)',premiums:'0.00'},{id:'1',name:'累计XX保费(元)',premiums:'0.00'},
                {id:'2',name:'累计XX保费(元)',premiums:'0.00'},{id:'3',name:'年金XX(元)',premiums:'0.00'},
                {id:'4',name:'累计XX保费(元)',premiums:'0.00'},{id:'5',name:'累计XX保费(元)',premiums:'0.00'}
            ],//各种保费展示
     quotedPriceList:[
                {id:'0',name:'快速报价',src:require('../assets/img/kuaisubaojia.png'),state:1, address:'enterpriseConfirm',ifNew:false, ifDevlop:false},
                {id:'1',name:'报价查询',src:require('../assets/img/wodexunjia.png'),state:1, address:'quotationList',ifNew:false, ifDevlop:false}
            ],//询报价
     coverWorkList:[
                {id:'0',name:'我要投保',src:require('../assets/img/toubao.png'),state:0,address:'effectIndex',ifNew:true, ifDevlop:false}
            ],//业务xx
     vocationalWorkList:[
                {id:'0',name:'保全申请',src:require('../assets/img/xiazai.png'),state:0,address:'develop',ifNew:false, ifDevlop:true},
                {id:'1',name:'保全查询',src:require('../assets/img/baoquanchaxun.png'),state:0,address:'develop',ifNew:false ,ifDevlop:true}
            ],//承保保全
     otherList:[
                {id:'0',name:'获取年报',src:require('../assets/img/nianbao.png'),state:0,address:'develop',ifNew:false, ifDevlop:true},
                {id:'1',name:'增值服务',src:require('../assets/img/zengzhifuwu.png'),state:0,address:'develop',ifNew:false, ifDevlop:true}
            ]//增值服务
          
    }
  },
  created(){
    this.checkIfProject();
  },
  mounted(){
    this.clearUnderline();
  },
  methods: {
    //看是否有项目
    checkIfProject: function(){
      this.$clearTemporaryExceptToken();//清掉报价缓存(留下token，项目名称，项目是否关注，项目代码)
      let that = this;
      //①获取localstorage里面的项目名称--每个人名下只有一个名字相同的项目
      let currentProject = localStorage.getItem('YF_mainstream_project') == undefined || localStorage.getItem('YF_mainstream_project') == null?'':localStorage.getItem('YF_mainstream_project');
      if(currentProject != ''){//此时localstorage里面的有项目--前提是没有清缓存
      //②判断这个项目是不是在这个人名字拥有
       new Promise(function (resolve, reject) {
         that.$axios.get('/index/getProjectList',{
            params:{
                proname:currentProject,
                rand:new Date().getTime()
            }
          }).then(res=>{
            resolve(res);
          })
       }).then(function (response){
          if(response.data.code == 200){
                if(response.data.data.items.length == 0){//证明这个人名下没有这个项目
                  that.getNewClickProdction();
                }else{//证明这个人名下有这个项目
                   that.proname = currentProject;
                   that.isAttention = localStorage.getItem('YF_mainstream_project_isAttention');
                   that.haveEnterprise = true;
                }
            }
       }).catch(function (error) {})
      //</if>
      }else{//没有localstorage值，判断是否清缓存还是真的是个新人
        this.getNewClickProdction();
      }

      // new Promise(function (resolve, reject) {
      //     that.$axios.get('/index/getProjectList',{
      //         params:{
      //             page:1,
      //             size:10,
      //             rand:new Date().getTime()
      //         }
      //     }).then((response) => {
      //        resolve(response.data.data.items.length);
      //     })
      // }).then(function (amount){
      //     if(amount>0){
      //       if(localStorage.getItem('YF_mainstream_project') && localStorage.getItem('YF_mainstream_project') != ''){
      //           that.proname = localStorage.getItem('YF_mainstream_project');
      //           that.haveEnterprise = true;
      //       }else{
      //         that.$axios.get('/index/defuatProject',{
      //           params:{
      //             rand:new Date().getTime()
      //           }
      //         }).then(response=>{
      //           console.log(response);
      //           if(response.data.data != null){
      //             localStorage.setItem('YF_mainstream_project',response.data.data.proname)
      //             localStorage.setItem('YF_mainstream_project_code',response.data.data.procode)
      //             localStorage.setItem('YF_mainstream_project_isAttention',response.data.data.isattention)
      //             that.proname = localStorage.getItem('YF_mainstream_project');
      //             that.haveEnterprise = true;
      //           }
      //         })
      //       }
      //     }
      // })
    },
    //获取最近点击的项目（伪最近）
    getNewClickProdction: function(){
      this.$axios.get('/index/defuatProject',{
          params:{
            rand:new Date().getTime()
          }
        }).then(response=>{
          console.log(response);
          if(response.data.data != null){
            localStorage.setItem('YF_mainstream_project',response.data.data.proname)
            localStorage.setItem('YF_mainstream_project_code',response.data.data.procode)
            localStorage.setItem('YF_mainstream_project_isAttention',response.data.data.isattention)
            this.proname = localStorage.getItem('YF_mainstream_project');
            this.haveEnterprise = true;
          }else{//证明这个人是新人，没有创建过任何项目
            this.proname =  '您还没有项目，请先去创建项目哦~';//项目名称
          }
        })
    },
    //除去最后的下划线
    clearUnderline:function(){
      var list = document.getElementsByClassName('service-ul');
      for(let i = 0; i < list.length; i++){
        var kLength = list[i].children.length;
        var kLengthInit = list[i].children.length%3 == 0 ? kLength-3 : kLength-(list[i].children.length%3) ;
        for(let j = kLengthInit; j < kLength; j++){
          list[i].children[j].style.borderBottom = "none";
        }
      }
    },
    //创建企业
    createEnterprise: function(){
      if(this.haveEnterprise){
        this.$router.push({path:'/enterpriseList'});
      }else{
        this.$router.push({path:'/createEnterprise'});
        // this.$router.push({path:'/enterpriseList'});
      }
      
    },
    //点击下面的各个模块
    modularGo:function(event){//quotationProcess
      if(this.haveEnterprise){
        this.$router.push(event);
      }else{
        this.$confirm('您还没有项目哦~，请先创建项目','',{
           confirmButtonText: '去创建项目',
           cancelButtonText:'取消',
           showClose:false
        }).then(()=>{
           this.$router.push({name:'createEnterprise'})
        }).catch(() => {
          
        })
      }
      
    },
    //添加关注
    addFollow: function(){
      let that = this;
      let params = {isAttention:localStorage.getItem('YF_mainstream_project_isAttention')== 1? 0:1, procode:localStorage.getItem('YF_mainstream_project_code'),rand:new Date().getTime()}
            this.$axios.post('/index/isAttention',this.$qs.stringify(params))
            .then(response => {
              if(response.data.code == 200){
                that.isAttention = that.isAttention == 1? 0:1;//改变状态位
                console.log(that.isAttention);
                localStorage.setItem('YF_mainstream_project_isAttention',that.isAttention)
                if(that.isAttention == 1){
                   this.$message({
                      message: '关注成功',
                      type: 'success'
                  });
                }else{
                  this.$message({
                      message: '取消关注',
                      type: 'success'
                  });
                }
               
              }
                
            }).catch(error => {

            })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.header{
  text-align: center;
  height: 73px;
  padding: 0 15px;
  background: linear-gradient(180deg,#3d75ff,#94adec);
  position: relative;
  .creat-change{
    position: absolute;
    right: 0;
    top: 5px;
    border-radius: 10px;
    border: none;
    font-size: 10px;
    // @include font-dpr(10px);
    padding: 5px 15px 5px 6px;
    background: rgba(255,255,255,.9);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-right: 7px;
  }
  .establishment{
    font-size: 15px;
    // @include font-dpr(14px);
    color: white;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
  span.qq{
    position: absolute;
    bottom: -21px;
    display: inline-block;
    height: 31px;
    width: 6px;
    // background: #6ba3fe;
    // border-radius: 30px;
    // box-shadow:rgb(255, 255, 255) 0px 0px 4px inset;
  }   
  .left-q{
    left: 20px;
    i:first-child{
      width: 12px;
      height: 12px;
      background: #fff;
      border-radius: 12px;
      position: absolute;
      top: -6px;
      left: -3px;
      &::before{
        content: '';
        position: absolute;
        bottom: -25px;
        left: 3px;
        display: inline-block;
        height: 31px;
        width: 6px;
        background: #6ba3fe;
        border-radius: 30px;
        box-shadow:rgb(255, 255, 255) 0px 0px 4px inset;
      }
    }
    i:last-child{
      width: 12px;
      height: 12px;
      background: #e7e7e7;
      border-radius: 12px;
      position: absolute;
      bottom: -6px;
      left: -3px;
      &::before{
        content: '';
        position: absolute;
        bottom: 6px;
        left: 3px;
        display: inline-block;
        height: 31px;
        width: 6px;
        background: #6ba3fe;
        border-radius: 30px;
        box-shadow:rgb(255, 255, 255) 0px 0px 4px inset;
      }
    }
  }
  .right-q{
     right: 20px;
     i:first-child{
      width: 12px;
      height: 12px;
      background: #fff;
      border-radius: 12px;
      position: absolute;
      top: -6px;
      left: -3px;
      &::before{
        content: '';
        position: absolute;
        bottom: -25px;
        left: 3px;
        display: inline-block;
        height: 31px;
        width: 6px;
        background: #6ba3fe;
        border-radius: 30px;
        box-shadow:rgb(255, 255, 255) 0px 0px 4px inset;
      }
    }
    i:last-child{
      width: 12px;
      height: 12px;
      background: #e7e7e7;
      border-radius: 12px;
      position: absolute;
      bottom: -6px;
      left: -3px;
      &::before{
        content: '';
        position: absolute;
        bottom: 6px;
        left: 3px;
        display: inline-block;
        height: 31px;
        width: 6px;
        background: #6ba3fe;
        border-radius: 30px;
        box-shadow:rgb(255, 255, 255) 0px 0px 4px inset;
      }
    }
  }
  .el-icon-sort{
    transform: rotate(90deg);
  }
}
.main{
  background: #fff;
  margin-top: 12px;
  margin-bottom: 12px;
  padding: 15px;
  padding-bottom: 20px;
  border-radius: 5px;
  .Premium-ul{
    background: #3d75ff;
    color: white;
    margin-top: 5px;
    border-radius: 5px;
    list-style-type: none;
    li{
      // width: 107px;
      width: 33.3%;
      display: inline-block;
      text-align: center;
      line-height: 15px;
      padding: 15px 5px;
      box-sizing: border-box;
      span:first-child{
        display: block;
        font-size: 15px;
        // @include font-dpr(14px);
        font-weight: 700;
      }
      span:last-child{
        display: inline-block;
        font-size: 12px;
        // @include font-dpr(12px);
      }
    }
  }
  .service{
    .service-title{
      font-size: 12px;
      // @include font-dpr(12px);
      color: #787878;
      padding: 10px 0;
      margin-top: 10px;
    }
    .service-ul{
      list-style-type: none;
      border-top: 1px solid #e7e7e7;
      border-bottom: 1px solid #e7e7e7;
      font-size: 0;
      li{
        display: inline-block;
        width: 33.3%;
        height: 95px;
        font-size: 12px;
        // @include font-dpr(12px);
        box-sizing: border-box;
        text-align: center;
        padding-top: 23px;
        border-right: 1px solid #e7e7e7;
        border-bottom: 1px solid #e7e7e7;
        position: relative;
        overflow: hidden;
        &:nth-child(3n){
          border-right: none;
        }
        &:last-child{
          border-bottom: none;
        }
        img{
          display: block;
          margin: 0 auto;
          // width: 30px;
          height: 30px;
          margin-bottom: 3px;
        }
      }
      li.newLaunch::before{
        content: '新上线';
        width: 70px;
        line-height: 20px;
        color: white;
        position: absolute;
        background: #f83e47;
        transform: rotate(45deg);
        top: 8px;
        right: -18px;
        font-size: 11px;
        // @include font-dpr(10px);
      }
      li.uncultivated{
        color: #bababa;
      }
      li.uncultivated::before{
        content: '未上线';
        width: 70px;
        line-height: 20px;
        color: white;
        position: absolute;
        background: #bababa;
        transform: rotate(45deg);
        top: 8px;
        right: -18px;
        font-size: 11px;
        // @include font-dpr(10px);
      }
    }
  }
  .is-follow{
    font-size: 0;
    text-align: center;
    margin-top: 10px;
    button{
      font-size: 12px;
      // @include font-dpr(12px);
      color:#3d75ff;
      background: inherit;
      border: none;
      padding: 10px 0;
    }
  }
}
</style>

<style lang="scss">
.el-select--medium,.el-input__inner{
  vertical-align: bottom !important;
}

</style>