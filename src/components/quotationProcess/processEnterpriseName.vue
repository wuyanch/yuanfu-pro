<template>
    <div class="enterprise-name">
        <p>{{enterpriseCurCall}}</p>
    </div>
</template>

<script>
export default {
    name:'processEnterpriseName',
    props:{enterpriseCurCall:String},
    data(){
        return{
           
        }
    }
}
</script>

<style lang="scss" scoped>
.enterprise-name{
    padding: 15px;
    background: linear-gradient(180deg,#5092fc,#94adec);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 99;
    p{
        font-size: 14px;
        color: white;
    }
}
</style>