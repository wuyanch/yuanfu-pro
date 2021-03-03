import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  scrollBehavior(to,from,savedPosition){
    console.log(savedPosition);
    if(savedPosition){
      return savedPosition;
    }else{
      return {x:0,y:0}
    }
  },
  // base:"/mybp",//正式环境需要添加的二级域名
  routes: [
    {
      path: '/',
      name: 'OtoIndex',
      component: () => import('@/components/index'),
      meta:{
        // 页面标题title
        title: '员福首页'
      }
    },
    // {
    //   path: '/',
    //   name: 'transferStation',
    //   component: () => import('@/components/transferStation'),
    //   meta:{
    //     // 页面标题title
    //     title: '加载中...'
    //   }
    // },
    {
      path: '/createEnterprise',
      name: 'createEnterprise',
      component: () => import('@/components/createEnterprise/CreateEnterprise.vue'),
      meta:{
        // 页面标题title
        title: '创建项目'
      }
    },{
      path: '/enterpriseList',
      name: 'enterpriseList',
      component: () => import('@/components/enterpriseList/enterpriseList.vue'),
      meta:{
        // 页面标题title
        title: '项目列表'
      }
    },{
      path: '/enterpriseConfirm',
      name: 'enterpriseConfirm',
      component: () => import('@/components/quotationProcess/enterpriseConfirm.vue'),
      meta:{
        // 页面标题title
        title: '项目确认信息'
      }
    },{
      path:'/templateSelection',
      name:'templateSelection',
      component: () => import('@/components/quotationProcess/TemplateSelection.vue'),
      meta:{
        // 页面标题title
        title: '报价模板'
      }
    },{
      path:'/procedure',
      component: () => import('@/components/quotationProcess/nonConstruction/procedure.vue'),
      children:[
        {
          path: '/',
          component: () => import('@/components/quotationProcess/nonConstruction/procedureOne.vue'),
          meta:{
            // 页面标题title
            title: '分配计划'
          }
        },{
            path: 'procedureOne',
            component: () => import('@/components/quotationProcess/nonConstruction/procedureOne.vue'),
            meta:{
              // 页面标题title
              title: '分配计划'
            }
        },{
            path: 'procedureTwo',
            component: () => import('@/components/quotationProcess/nonConstruction/procedureTwo.vue'),
            meta:{
              // 页面标题title
              title: '配置责任'
            }
        },{
            path: 'procedureThree',
            component: () => import('@/components/quotationProcess/nonConstruction/procedureThree.vue'),
            meta:{
              // 页面标题title
              title: '设置条件'
            }
        },{
            path: 'procedurePremium',
            component: () => import('@/components/quotationProcess/nonConstruction/procedurePremium.vue'),
            meta:{
              // 页面标题title
              title: '补充信息'
            }
        },{
          path: 'procedurePreview',
          component: () => import('@/components/quotationProcess/nonConstruction/procedurePreview.vue'),
          meta:{
            // 页面标题title
            title: '预览'
          }
        },{
          path: 'procedureFinish',
          name:'procedureFinish',
          component: () => import('@/components/quotationProcess/procedureFinish.vue'),
          meta:{
            // 页面标题title
            title: '询价成功'
          }
        }
      ]
    },{
      path:'/constructionProcess',
      component: () => import('@/components/quotationProcess/construction/constructionProcess.vue'),
      children:[
        {
          path: '/',
          component: () => import('@/components/quotationProcess/construction/constructionOne.vue'),
          meta:{
            // 页面标题title
            title: '建工险-分配计划'
          }
        },{
            path: 'constructionOne',
            component: () => import('@/components/quotationProcess/construction/constructionOne.vue'),
            meta:{
              // 页面标题title
              title: '建工险-分配计划'
            }
        },{
          path: 'constructionTwo',
          component: () => import('@/components/quotationProcess/construction/constructionTwo.vue'),
          meta:{
            // 页面标题title
            title: '建工险-配置责任'
          }
        },{
          path: 'constructionThree',
          component: () => import('@/components/quotationProcess/construction/constructionThree.vue'),
          meta:{
            // 页面标题title
            title: '建工险-设计条件'
          }
        },{
          path: 'constructionPreview',
          component: () => import('@/components/quotationProcess/construction/constructionPreview.vue'),
          meta:{
            // 页面标题title
            title: '建工险-预览'
          }
        }
      ]
    },{
      path:'/quotationList',
      name:'quotationList',
      component: () => import('@/components/quotationList/quotationList.vue'),
      meta:{
        // 页面标题title
        title: '询价清单列表',
        isUseCache: false, // 默认不缓存
        keepAlive: true//keep-alive
      }
    },{
      path:'/quotationDetail',
      name:'quotationDetail',
      component: () => import('@/components/quotationList/quotationDetail.vue'),
      meta:{
        // 页面标题title
        title: '询价详情'
      }
    },{
      path:'/develop',
      name:'develop',
      component: () => import('@/components/devePage/develop.vue'),
      meta:{
        // 页面标题title
        title: '开发中'
      }
    },{
      path:'/overLogin',
      name:'overLogin',
      component: () => import('@/components/devePage/overLogin.vue'),
      meta:{
        // 页面标题title
        title: '身份过期'
      }
    },{
      path:'/error',
      name:'error',
      component: () => import('@/components/devePage/error.vue'),
      meta:{
        // 页面标题title
        title: '错误页面'
      }
    }

  ]
})
