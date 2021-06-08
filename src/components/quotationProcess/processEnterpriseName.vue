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
@mixin font-dpr($font-size){
    font-size: $font-size;

    [data-dpr="1"] & {
        font-size: $font-size;
    }

    [data-dpr="1.75"] & {//杨老师
        font-size: $font-size * 1.2;
    }

    [data-dpr="2"] & {
        font-size: $font-size * 1.2;
    }

    [data-dpr="2.75"] & {
        font-size: $font-size * 1.2;
    }

    [data-dpr="3"] & {//韩老师
        font-size: $font-size * 1.4;
    }

    [data-dpr="4"] & {
        font-size: $font-size * 1.4;
    }

    [data-dpr="5"] & {
        font-size: $font-size * 1.4;
    }

    [data-dpr="6"] & {
        font-size: $font-size * 1.4;
    }
}
.enterprise-name{
    padding: 15px;
    background: linear-gradient(180deg,#5092fc,#94adec);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 99;
    p{
        font-size: 14px;
        //  @include font-dpr(14px);
        color: white;
    }
}
</style>