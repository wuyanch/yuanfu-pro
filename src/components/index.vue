<template>
  <div class="oto-index" vkshop-event-scope="我的员福首页">
    <div class="index-top">
      <div class="index-top-content">
        <p><span>我的B端项目</span><span>{{projectNumber}}<i>个</i></span></p>
      </div>
    </div>
    <div class="index-bottom">
      <p class="bottom-tagging">当前项目</p>
      <!-- 当前项目内容 -->
      <div class="bottom-content">
        <div class="content-top">
          <p class="content-top-proname">{{proname}} <button v-if="!haveEnterprise && proname != '--'" @click="createEnterprise"><i class="el-icon-plus"></i>创建项目</button></p>
          <button v-if="haveEnterprise" :class="[isAttention == '0'?'el-icon-plus':'el-icon-check']" @click="addFollow">{{isAttention != '0'?'已关注':'关注'}}</button>
          <button @click="createEnterprise" v-if="haveEnterprise" class="el-icon-refresh" :vkshop-event-param="'project=' + proname"  vkshop-event-name="切换项目" vkshop-event-type="click">换一个项目</button>
        </div>

        <div class="content-bottom">
          <!-- 询报价 -->
          <div class="per-content">
            <p class="service-title">询报价</p>
            <ul class="service-ul">
                <li  :class="{ newLaunch: item.ifNew }" v-for="(item,index) in quotedPriceList" :key="index" :data-state="item.state" @click="modularGo(item.address)" :vkshop-event-name="item.name" vkshop-event-type="click"><img :src="item.src" alt=""><span>{{item.name}}</span></li>
            </ul>
          </div>
          <!-- 承保保全 -->
          <div class="per-content">
            <p class="service-title">承保保全</p>
            <ul class="service-ul">
                <li :class="{ newLaunch: item.ifNew }" v-for="(item,index) in coverWorkList" :key="index" :data-state="item.state" @click="modularGo(item.address)" :vkshop-event-name="item.name" vkshop-event-type="click"><img :src="item.src" alt=""><span>{{item.name}}</span></li>
            </ul>
          </div>
          <!-- 承保服务 -->
          <div class="per-content">
            <p class="service-title">承保服务</p>
            <ul class="service-ul">
                <li :class="{ uncultivated: item.ifDevlop }" v-for="(item,index) in vocationalWorkList" :key="index" :data-state="item.state" @click="modularGo(item.address)" :vkshop-event-name="item.name" vkshop-event-type="click"><img :src="item.src" alt=""><span>{{item.name}}</span></li>
            </ul>
          </div>
          <!-- 增值服务 -->
          <div class="per-content">
            <p class="service-title">增值服务</p>
            <ul class="service-ul">
                <li :class="{ uncultivated: item.ifDevlop }" v-for="(item,index) in otherList" :key="index" :data-state="item.state" @click="modularGo(item.address)" :vkshop-event-name="item.name" vkshop-event-type="click"><img :src="item.src" alt=""><span>{{item.name}}</span></li>
            </ul>
          </div>
        </div>

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
     projectNumber: 0,//此人拥有的项目数量
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
    this.lookhowMuch();
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
    //看有多少项目
    lookhowMuch(){
      this.$axios.get('/index/getProjectList',{
          params:{
              page:1,
              size:10,
              rand:new Date().getTime()
          }
      }).then((response) => {
        this.projectNumber = response.data.data.items.length
      })
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
.index-top{
  height: 80px;
  position: relative;
  overflow: hidden;
  &::before{
    content: '';
    position: absolute;
    left: -10%;
    top: 15%;
    transform: translateY(-50%);
    height: 110px;
    width: 120%;
    background: #427cff;
    border-radius: 50%;
  }
  .index-top-content{
    position: relative;
    background: #fff;
    margin: 15px 10px;
    font-size: 16px;
    color: #02153e;
    padding: 18px 15px;
    border-radius: 10px;
    span{
      &:nth-child(2){
        float: right;
        font-weight: 600;
        i{
          font-style: normal;
          font-size: 12px;
          padding-left: 4px;
          font-weight: 400;
        }
      }
    }
  }
}
.index-bottom{
   font-size: 0;
  .bottom-tagging{
    font-size: 12px;
    font-weight: 700;
    margin-left: 15px;
    position: relative;
    display: inline-block;
    &::before{
      content: '';
      position: absolute;
      bottom: 0;
      height: 4px;
      width: 100%;
      background: #f7cc73;
      border-top-right-radius: 5px;
      border-bottom-left-radius: 5px;
      z-index: -1;
    }
  }
  .bottom-content{
    margin: 2px 10px 10px 10px;
    .content-top{
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      font-size: 18px;
      color: white;
      text-align: center;
      background: #427cff;
      position: relative;
      padding: 25px 10px 20px 10px;
      .content-top-proname{
        text-align: center;
        button{
          position: initial;
          margin: 0 auto;
          display: block;
        }
      }
      button{
        font-size: 14px;
        position: absolute;
        top: -15px;
        border: 1px solid #fff;
        background: #fff;
        color: #427cff;
        padding: 8px 10px;
        border-radius: 5px;
        &:nth-child(2){
          right: 130px;
        }
        &:last-child{
          right: 10px;
        }
      }
    }
    .content-bottom{
      font-size: 12px;
      position: relative;
      margin: 0 auto;
      padding: 10px;
      background: rgba(224,236,255,.6);
      overflow: hidden;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      &::before{
          content: '';
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          margin: -30px;
          z-index: 0;
          -webkit-filter: blur(60px);
          filter: blur(60px);
      }
      .per-content:not(:first-child){
        margin-top: 8px;
      }
      .service-title{
        font-weight: 700;
      }
      ul{
        li{
          background: #427cff;
          margin: 10px;
          height: 70px;
          width: 68px;
          border-radius: 8px;
          display: inline-block;
          text-align: center;
          overflow: hidden;
          position: relative;
          &::before{
            content: '';
            position: absolute;
            left: -35%;
            width: 170%;
            height: 90px;
            transform: translateY(-50%);
            border-radius: 50%;
            background: #fff;
            z-index: 0;
          }
          img{
            position: relative;
            width: 30px;
            margin-top: 8px;
            z-index: 9;
          }
          span{
            position: relative;
            bottom: -8px;
            font-size: 12px;
            color: white;
            display: block;
          }
          &:last-child{
            margin-right: 0;
          }
          &:first-child{
            margin-left: 0;
          }
        }
        li.newLaunch::after{
          content: '新';
          width: 45px;
          line-height: 20px;
          color: white;
          position: absolute;
          background: #f83e47;
          transform: rotate(45deg);
          top: 0px;
          right: -15px;
          font-size: 11px;
          // @include font-dpr(10px);
        }
        li.uncultivated{
          background: #c9c9c9;
          span{
            color: #999;
          }
        }
        li.uncultivated::after{
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
          z-index: 9;
          // @include font-dpr(10px);
        }
      }
    }
  }
}
</style>

<style lang="scss">
.el-select--medium,.el-input__inner{
  vertical-align: bottom !important;
}

</style>