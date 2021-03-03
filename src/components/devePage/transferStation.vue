<template>
    <div class="transferStation">
        
    </div>
</template>

<style lang="scss" scoped>

</style>

<script>
export default {
    name:'transferStation',
    data(){

    },
    created(){
        this.getToken();
    },
    methods:{
        getToken: function(){
            let search = window.location.search;
            let YF_token = this.getSearchString('token', search); //结果：18
            if((YF_token != undefined || YF_token != '' || YF_token != null) && !YF_token){
                localStorage.setItem('token',YF_token);
                 this.$router.push({name:'createEnterprise'});
            }else{
                this.$router.push({name:'error'});
            }
        },
        getSearchString: function(key, Url) {
            let str = Url;
            let arr ;
            str = str.substring(1, str.length); // 获取URL中?之后的字符（去掉第一位的问号）
            // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
            if(str.indexOf("&") != -1 ) {
                arr = [];
            }else{
                arr = str.split("&");
            }
           
            let obj = new Object();

            // 将每一个数组元素以=分隔并赋给obj对象 
            for (var i = 0; i < arr.length; i++) {
                var tmp_arr = arr[i].split("=");
                obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
            }
            return obj[key];
        }
    }
}
</script>