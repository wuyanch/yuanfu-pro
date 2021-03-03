exports.install = function(Vue, options) {
    Vue.prototype.$temporary = function() { //全局函数----暂存
        //①点击暂存，返回数据
        let arr = {};
        //获取数据
        if(!!localStorage.getItem('quotationInformation_2')&&localStorage.getItem('quotationInformation_2')!=''){
            arr.plan = JSON.parse(localStorage.getItem('quotationInformation_2')).distributionPlan;
        }else{
            arr.plan = null;
        }
        if(!!localStorage.getItem('quotationInformation_3')&&localStorage.getItem('quotationInformation_3')!=''){
            arr.resp = JSON.parse(localStorage.getItem('quotationInformation_3')).configurationResponsibility;
        }else{
            arr.resp = null;
        }
        if(!!localStorage.getItem('quotationInformation_4')&&localStorage.getItem('quotationInformation_4')!=''){
            arr.conf = JSON.parse(localStorage.getItem('quotationInformation_4')).conditionsList;
        }else{
            arr.conf = null;
        }
        if(!!localStorage.getItem('quotationInformation_5_0')&&localStorage.getItem('quotationInformation_5_0')!=''){
            arr.other = JSON.parse(localStorage.getItem('quotationInformation_5_0')).premiunF;
        }else{
            arr.other = null;
        }
        if(!!localStorage.getItem('quotationInformation_5_0')&&!!localStorage.getItem('quotationInformation_5_1')&&localStorage.getItem('quotationInformation_5_1')!=''){
            arr.premium = JSON.parse(localStorage.getItem('quotationInformation_5_1')).premiunFP;
        }else{
            arr.premium = null;
        }
        console.log('暂存开始')
        console.log(arr);
        return this.$axios.post('/index/saveInquiry',{
            plan:arr.plan,
            resp:arr.resp,
            conf:arr.conf,
            other:arr.other,
            premium:arr.premium,
            submit:'tempsave',
            proserialno:localStorage.getItem('YF_quotationInformation_proserialno'),
            tempsavestep:localStorage.getItem('quotationInformation_tempsavestep'),
            rand:new Date().getTime()
        },{
            'Content-Type':'application/json'
        }).then(response=>{
            console.log(response);  
            if(response.data.code != 500){   
                this.$message({
                    message: '恭喜你，暂存成功',
                    type: 'success'
                }); 
            }else{
                this.$message.error(response.data.msg);
            }   
            console.log('暂存结束');      
           return response.data.code
        })
      
    };
  
    Vue.prototype.$clearTemporary = function() { //全局函数2--清楚暂存步骤
       
        for(let keys in localStorage){
            if(keys.includes('quotationInformation') && !keys.includes('YF')){
                localStorage.removeItem(keys);
                console.log(keys)
            }
        }
    };

    Vue.prototype.$clearTemporaryAll = function() { //全局函数2--清楚暂存步骤
       
        for(let keys in localStorage){
            if(keys.includes('quotationInformation')){
                localStorage.removeItem(keys);
                console.log(keys)
            }
        }
    };

    Vue.prototype.$clearTemporaryExceptToken = function() { //全局函数3--清楚除token 项目code 项目名称
       
        for(let keys in localStorage){
            if(!keys.includes('YF_mainstream') && !keys.includes('token')){
                localStorage.removeItem(keys);
                console.log(keys)
            }
        }
    };
   
};