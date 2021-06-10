<template>
    <div class="procedure-premium" vkshop-event-scope="非建工险-保费补充信息(4)">
        <!-- 进度条 -->
        <div class="procedure-step">
            <el-steps 
            :active="active" 
            finish-status="success"
            align-center>
                <el-step title="分配计划"></el-step>
                <el-step title="配置责任"></el-step>
                <el-step title="设置条件"></el-step>
            </el-steps>
        </div>
        <div class="set-conditions">
            <div class="scroll-conditions">
                <!-- 业务信息 -->
                <div class="premium-part">
                    <p class="part-title">业务信息</p>
                    <div class="part-select">
                        <div>
                            <label for=""><span class="tip">*</span>业务渠道：</label>
                            <el-select v-model="businessInformation"  placeholder="请选择">
                                <el-option
                                    v-for="item in options"
                                    :key="item.id"
                                    :label="item.channelsname"
                                    :value="item.channelscode">
                                </el-option>
                            </el-select>
                            <div class="supplement" v-if="businessInformation != 'C20' &&businessInformation != 'C10' && businessInformation != ''">
                               <p><label for=""><span class="tip" v-if="businessInformation != 'C40'">*</span>代理机构：</label>
                               <el-input 
                               type="textarea"
                               resize="none"
                               :rows="2"
                               v-model = "agency" placeholder="请输入内容" maxlength="50" show-word-limit @focus="handleFocus" @blur="handleblur"></el-input></p>
                               <p v-if="businessInformation != 'C40'"><label for=""><span class="tip">*</span>代理费：</label>
                               <el-input 
                               type="textarea"
                               resize="none"
                               :rows="2"
                               v-model = "agencyFee" placeholder="整单、分险种写都行" maxlength="200" show-word-limit @focus="handleFocus" @blur="handleblur"></el-input></p>
                            </div>
                        </div>
                        <div class="insurance-period">
                            <label for=""><span class="tip">*</span>保期：</label>
                            <el-select v-model="insurancePeriod"  placeholder="请选择">
                                <el-option
                                    v-for="item in insurancePeriodList"
                                    :key="item.id"
                                    :label="item.value"
                                    :value="item.periodId">
                                </el-option>
                            </el-select>
                            <p class="insurance-period-day" v-if="insurancePeriod==3"><el-input type="number" placeholder="输入小于365的整数" @input="periodDay" max="365" v-model="insurancePeriodDay"></el-input> 天</p>
                            
                        </div>
                    </div>
                </div>
                <!-- 期望保费 -->
                <div class="premium-part">
                    <p class="part-title">期望保费</p>
                    <div class="part-plan">
                        <!-- 单独一个计划-开始 -->
                        <div class="responsibility-part" v-for="(item,index) in expectedPremiumList.domains" :key="index">
                            <!-- 表头-计划几 -->
                            <div class="procedure-corner-mark"><span> 计划{{index+1}}({{item.planName}})</span></div>
                            <!-- 可展开收起块 -->
                            <!-- 不收起部分 -->
                            <div class="expected-premium">
                                <span>人数(人)：{{item.basicInformation.numberOfInsured}}</span>
                                <span>期望保费(元/人)：<el-input type="number" v-model.number="item.premium" @input="changePremium" @focus="handleFocus" @blur="handleblur"></el-input></span>
                            </div>
                            <div v-if="dynamicValidateFormOpen[index].open">
                                <!-- 主体配置内容-块 -->
                                <!-- 计划基本情况 -->
                                <div class="basic-information">
                                    <el-divider>计划基本情况</el-divider>
                                    <div class="infor">
                                        <p><span>人员类型：</span><span>{{item.basicInformation.personnelType}}</span></p>
                                        <p><span>社保情况：</span><span>{{item.basicInformation.socialSecurity}}</span></p>
                                        <p><span>平均年龄：</span><span>{{item.basicInformation.averageAge}}岁</span></p>
                                        <p><span>职业类别：</span><span>{{item.basicInformation.occupationCategory}}</span></p>
                                        <p><span>工种描述：</span><span>{{item.basicInformation.jobDescription}}</span></p>
                                    </div>
                                </div>
                                <!-- 责任类 -->
                                <div class="basic-information" v-for="(item1,index1) in item.insuranceLiability" :key="index1">
                                    <el-divider>{{item1.risktype}}</el-divider>
                                    <div>
                                        <ul>
                                            <li v-for="(item2,index2) in item1.responsibilityData" :key="index2">
                                                <!-- 没有子责任 -->
                                                <div v-if="item2.subResponsibilityData == null">
                                                    <p class="kind-title-1"><span>{{item2.riskshort}}：</span><span>{{item2.trueConfigurationStep}}{{item2.insuredUnit}}</span></p>
                                                    <p v-if="item2.level != null" class="kind-explain-1 desc desc-nosub">
                                                        <span v-for="(item3,index3) in item2.level[0].resp_conditionList" :key="index3">{{item3.resp_condition}}：{{item3.levelvalue}}；</span>
                                                    </p>
                                                </div>
                                                <!-- 有子责任 -->
                                                <div v-else>
                                                    <p class="kind-title-2">{{item2.riskshort}}：</p>
                                                    <div v-for="(itemSub,indexSub) in item2.subResponsibilityData" :key="indexSub">
                                                        <p v-if="itemSub.subIfDefaultConfiguration == true" class="kind"><span>{{itemSub.subResponsibilityName}}：</span><span>{{itemSub.trueConfigurationStep}}{{itemSub.insuredUnit}}</span></p>
                                                        <div v-if="itemSub.subIfDefaultConfiguration == true">
                                                            <p v-if="itemSub.level != null" class="kind-explain-1 desc desc-sub">
                                                                <span v-for="(item3,index3) in itemSub.level[0].resp_conditionList" :key="index3">{{item3.resp_condition}}：{{item3.levelvalue}}；</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>


                            </div>
                            <!-- 可收起展开块 -->
                            <!-- 展开收起按钮 -->
                            <div class="if-open">
                                <el-button  @click="changeBlock(index)"><i class="el-icon-arrow-up" v-if="dynamicValidateFormOpen[index].open"></i><i class="el-icon-arrow-down" v-else></i></el-button>
                            </div>
                        </div>
                    </div>
                    <!-- 合计整单期望保费 -->
                    <div class="total-whole">
                        <p><span>合计人数：{{totalPeople}} </span><span>合计整单期望保费(元)：{{totalPremium}}</span></p>
                    </div>

                </div>

                <!-- 备注 -->
                <div class="premium-part">
                    <p class="part-title">补充信息</p>
                    <div class="part-remark">
                        <el-input
                        type="textarea"
                        resize="none"
                        :rows="8"
                        placeholder="备注：如有其他需补充的信息或特殊需求，请填写在此处。 若无，可空。"
                        v-model="textareaRemarks"
                        @focus="handleFocus"
                        @blur="handleblur"
                        class="remarks"
                        maxlength="1000"
                        show-word-limit>
                        </el-input>
                    </div>
                    <!-- 上传附件 -->
                    <div class="upload-attachment">
                        <p>上传附件<span class="attachment-tip">(支持格式：png、jpg、bmp)</span></p>
                        <el-upload
                        action="no"
                        list-type="picture-card"
                        multiple
                        ref="upload"
                        :auto-upload="false"
                        :http-request="fileRequest"
                        :file-list="fileList"
                        :on-change="handleChange"
                        :on-progress="testProgress">
                            <i slot="default" class="el-icon-plus"></i>
                            <div slot="file" slot-scope="{file}">
                                <img
                                    class="el-upload-list__item-thumbnail"
                                    :src="file.url" alt=""
                                >
                                <span class="el-upload-list__item-actions">
                                    <span
                                    class="el-upload-list__item-preview"
                                    @click.stop="handlePictureCardPreview(file)"
                                    >
                                    <i class="el-icon-zoom-in"></i>
                                    </span>
                                    <span
                                    v-if="!disabled"
                                    class="el-upload-list__item-delete"
                                    @click.stop="handleRemove(file)"
                                    >
                                    <i class="el-icon-delete"></i>
                                    </span>
                                </span>
                            </div>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>

                    </div>
                </div>
            </div>
        </div>
        
        <!-- 固定在下方的按钮 -->
        <div class="procedure-btn">
            <button @click="goHome"  vkshop-event-name="返回主页" vkshop-event-type="click">返回主页</button><button @click="goPrev" vkshop-event-name="上一步" vkshop-event-type="click">上一步</button><button @click="tempStorage"  vkshop-event-name="暂存" vkshop-event-type="click" v-loading="loading" :disabled="loading"  element-loading-spinner="el-icon-loading"  element-loading-text="拼命暂存中" :class="{ loadingFont : loading}">暂存</button><button @click="goNext"  vkshop-event-name="提交" vkshop-event-type="click">提交</button>
        </div>
    </div>
</template>

<script>
 // 引入image-conversion
import {compress, compressAccurately, imageConversion} from 'image-conversion';
import { error } from 'util';
export default {
    name:'procedureFinish',
    data(){
        return{
            active:2,
            dialogImageUrl: '',
            fileList:[],
            fileListCopy:[],
            dialogVisible: false,
            disabled: false,
            textareaRemarks:'',//备注
            businessInformation:'',//业务信息--选择
            businessInformationName:'',//业务信息--中文
            agencyFee:'',//如果需要填写的话--代理费
            agency:'',//如果需要填写的话--代理机构
            totalPeople:0,//合计总人数
            totalPremium: 0,//合计整单期望保费
            dynamicValidateFormOpen:[],
            expectedPremiumList:{//计划内容
                domains:[]
            },
            planNameT:[],//计划名称
            planCodeT:[],//计划编码
            fileData: new FormData(),  // 文件上传数据（多文件合一）
            options:null,//业务渠道的可选择
            loadingPic:null,//上传图片的时候的loading
            loading:false,
            foucesTimer:null,//ios键盘回落参数
            insurancePeriod:'',//20210422保期
            insurancePeriodDay:'',//20210422保期-天
            insurancePeriodList:[
                {periodId:1, value:'1年', id:0},
                {periodId:2, value:'1月', id:1},
                {periodId:3, value:'自定义', id:2}
            ],
            yfyear:null,//保期年
            yfmonth:null,//保期月
            yfday:null//保期日
        }
    },
    created(){
        this.getInitData();
        this.getSalesChannels();
        this.getListPhoto();
    },
    methods:{
        handleRemove(file,fileList) {
            console.log(file);
            let that = this;
            if(file.status == 'ready'){
                this.fileList.forEach(function(current,index){
                    if(file.name == current.name){
                         that.fileList.splice(index,1);
                         that.$message({
                            message: '图片删除成功',
                            type: 'success'
                        });
                    }
                })
            }else{
                this.$axios.delete('/index/delete/image',{
                    params:{
                        'filename':file.name,
                        'proserialno':localStorage.getItem('YF_quotationInformation_proserialno')
                    }
                },{
                    'Content-Type': 'multipart/form-data' 
                }).then(res =>{
                    //  成功
                    // console.log(params)
                    console.log(res);
                    console.log('333');
                    if(res.data.code=="200"){
                        // allPic.forEach(function(currentValue,index){
                        //     if(currentValue.name == file.name){
                        //         allPic.splice(index,1);
                        //         let premiunF = {"picList":allPic}
                        //             localStorage.setItem("quotationInformation_pic",JSON.stringify(premiunF));
                        //     }
                        // })
                        that.fileList.forEach(function(current,index){
                            if(file.name == current.name){
                                that.fileList.splice(index,1);
                            }
                        })
                        that.$message({
                            message: '图片删除成功',
                            type: 'success'
                        });
                    }else{
                        that.$alert('图片删除失败，请重新删除','',{
                            confirmButtonText:'好的，我知道了'
                        })
                    }
                })
                .catch(error =>{
                    this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                        confirmButtonText:'好的，我明白了'
                    }).catch(()=>{})
                })
            }
        },
        handlePictureCardPreview(file) {
            console.log(file);
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        /**
         * 文件上传之前 判断格式:before-upload="beforeFile accept=".jpg,.jpeg,.png,.bmp,.JPG,.JPEG,.BMP""
         * */
        // beforeFile(file){
        //     let name = file.name, flag = false;
        //     let type = name.substring(name.lastIndexOf('.')+1)
        //     if (type == 'png' || type == 'jpg' || type == 'bmp'|| type == 'jpeg') {
        //         return true
        //     }else{
        //         this.$message({
        //                     message: '请上传符合格式的图片',
        //                     type: 'warning'
        //                 });
        //         return false
        //     }
        // },
    //    beforeFile (file) { 
    //         let isLt2M = file.size / 1024  < 1 // 判定图片大小是否小于4MB
    //         if (!isLt2M) {
    //             console.log(file) // 压缩到400KB,这里的400就是要压缩的大小,可自定义
    //             imageConversion.compressAccurately(file, 400).then(res => { // console.log(res)
    //                 resolve(res)
    //                 console.log("压缩")
    //                 console.log(res);
    //                 this.fileData.append('files', res);  // append增加数据
    //             })
    //         }
           
        //    return new Promise((resolve, reject) => {
        //         let isLt2M = file.size / 1024  < 1 // 判定图片大小是否小于4MB
        //         if (isLt2M) {
        //             resolve(file)
        //         }
        //         console.log(file) // 压缩到400KB,这里的400就是要压缩的大小,可自定义
        //         imageConversion.compressAccurately(file, 400).then(res => { // console.log(res)
        //             resolve(res)
        //             console.log("压缩")
        //             console.log(res);
        //             this.fileData.append('files', res);  // append增加数据
        //         })
        //     })
        // }, 
        // 上传文件
		fileRequest(file) {
            // this.fileData.append('files', file.file);  // append增加数据
        },
     
        uploadFile(fun) {
            let that = this;
            // this.fileData = new FormData();  // new formData对象
            // this.$refs.upload.submit();  // 提交调用uploadFile函数
            // console.log(this.fileData.getAll("files"))
            if(that.fileList.length != 0){
                if(that.loading == false){
                    that.loadingPic = that.$loading({
                        lock: true,
                        text: '正在拼命制作预览页，请勿操作',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                }
            }
            Promise.all([
               this.compressPhoto()
            ]).then(resp=>{
                console.log(this.fileData.getAll("files"))
                that.fileData.append('proserialno',localStorage.getItem('YF_quotationInformation_proserialno'));
                if(that.fileData.get("files") != null){
                    that.$axios.post('/index/upload/image',that.fileData,{
                        'Content-Type': 'multipart/form-data' 
                    },{timeout: 1000*60*10}).then(res =>{
                        //  成功
                        console.log(res);
                        console.log("我是this.fileList")
                        console.log(that.fileList)
                        // 如何成功上传，则200
                        if(res.data.code == 200){
                            that.fileList.forEach(function(current,index){
                                that.$set(current,"status",'success');//改变状态位
                            })
                            // that.loadingPic.close();
                        }else{
                        // 如果上传不成功
                            that.$alert('图片上传失败，请检查你的网络，刷新重新上传','',{
                                confirmButtonText:'好的'
                            }).then(()=>{
                                // that.loadingPic.close();
                                // that.loadingPic==null?null:that.loadingPic.close();
                            })
                        }
                        that.loadingPic==null?null:that.loadingPic.close();
                        fun(res.data.code);
                    }).catch(error => {
                        console.log("上传图片的报错error")
                        console.log(error)
                        that.loadingPic==null?null:that.loadingPic.close();
                        that.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                            confirmButtonText:'好的，我知道了'
                        }).then(()=>{
                            // if(that.loading == false){
                            //     that.loadingPic.close();
                            // }
                            // that.loading = false;
                            // that.loadingPic==null?null:that.loadingPic.close();
                        }).catch(()=>{
                            // if(that.loading == false){
                            //     that.loadingPic.close();
                            // }
                            // that.loading = false;
                            // that.loadingPic==null?null:that.loadingPic.close();
                        })
                        fun("500");
                    })
                }else{
                    fun("100");
                }
            })
           
        },
        //压缩图片上传
        compressPhoto:function(){
            
            let _that = this;
            this.fileData.delete("files");
            this.fileData.delete("proserialno");
            return new Promise((resolve, reject) => {
                /* 你的逻辑代码 */
                console.log("我是compressPhoto");
                console.log(this.fileList);
                let flag = true;
                if(_that.fileList.length != 0){
                    let currentList = [];
                    _that.fileList.forEach(function(current,index){
                        if(current.status == 'ready'){
                            let isLt2M = current.size / 1024 / 1024 < 2 // 判定图片大小是否小于2MB
                            if (!isLt2M) {
                            flag = false;
                            console.log(current) // 压缩到400KB,这里的400就是要压缩的大小,可自定义
                            imageConversion.compressAccurately(current.raw,1024).then(res=>{
                                    //The res in the promise is a compressed Blob type (which can be treated as a File type) file;
                                    console.log(res);
                                    // let myFile = new File([res], current.name);
                                    flag = true;
                                    let myFile = new window.File([res], current.name,{type: current.raw.type})
                                    _that.fileData.append('files', myFile);
                                    currentList.push(1);
                                    console.log(index)
                                    // if(index ==  _that.fileList.length-1 && flag){
                                    if(currentList.length ==  _that.fileList.length && flag){
                                        console.log(_that.fileData.getAll('files'))
                                        return resolve();
                                    }
                                })
                            
                            }else{
                                currentList.push(1);
                                _that.fileData.append('files', current.raw);
                                // if(index ==  _that.fileList.length-1 && flag){
                                if(currentList.length ==  _that.fileList.length && flag){
                                    console.log(_that.fileData.getAll('files'))
                                    return resolve();
                                }
                            }
                            
                        }else{
                            currentList.push(1);
                            // if(index ==  _that.fileList.length-1 && flag){
                            if(currentList.length ==  _that.fileList.length && flag){
                                console.log(_that.fileData.getAll('files'))
                                return resolve();
                            }
                        }
                    
                    })
                }else{
                    return resolve();
                }
            });
            
        },
        //监控上传文件列表--检查图片是否重复
        handleChange(file, fileList) {
            let _that = this;
            let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name);
            if (existFile) {
                this.$message({
                    message: '新选择的图片已经存在,已剔除',
                    type: 'warning'
                });
                fileList.pop();
                // this.fileList = fileList;
                // return false;
            }else{
                let name = file.name, flag = false;
                let type = name.substring(name.lastIndexOf('.')+1)
                if (type == 'png' || type == 'jpg' || type == 'bmp'|| type == 'jpeg') {
                    // return true;
                }else{
                    this.$message({
                                message: '请上传符合格式的图片,不符合格式已剔除',
                                type: 'warning'
                            });
                    fileList.pop();
                    // this.fileList = fileList;
                    // return false;
                }
            }
            this.fileList = fileList;
            console.log("我是fileList:changeon");
            console.log(this.fileList);
        },
        // 取图片列表
        getListPhoto: function(){
            this.$axios.get('/index/list/image',{
                    params:{
                        proserialno:localStorage.getItem('YF_quotationInformation_proserialno'),
                        rand:new Date().getTime()
                    }
                },{
                'Content-Type':'application/json'
            }).then(res =>{
                    //  成功
                    console.log(res);
                    console.log('333');
                    if(res.data.code=="200"){
                        if( res.data.data != null){
                             res.data.data.forEach(function(current,index){
                            // that.$set(current,"status",'success');//改变状态位
                                current.status = 'success';
                            })
                            this.fileList = res.data.data;
                        }
                       
                        
                    }else{
                       
                    }
                }).catch(error =>{
                    this.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                        confirmButtonText:'好的，我明白了'
                    }).catch(()=>{})
                })
        },
        // 上传图片时的加载
        testProgress(event, file, fileList){
            console.log("正在上传");
            console.log(file)
        },
        //展开-收起
        changeBlock: function(event){
          this.dynamicValidateFormOpen[event].open = !this.dynamicValidateFormOpen[event].open;
        },
        //计算期望保费属性
        changePremium: function(){
            let sum = 0;
            for(let i = 0 ; i < this.expectedPremiumList.domains.length; i++){
                if(this.expectedPremiumList.domains[i].premium!= ''){
                    sum += this.expectedPremiumList.domains[i].premium*this.expectedPremiumList.domains[i].basicInformation.numberOfInsured;
                }
            }
            this.totalPremium = sum;
        },
        //下一步
        goNext: function(){
            let that = this;
            if(that.DataArrangement()){
                this.uploadFile(function(response){
                    if(response == 200 || response == 100){
                        that.loadingPic==null?null:that.loadingPic.close();
                        that.$router.push({path:'procedurePreview'})
                    }else if(response != 200 && response != 100){
                        // that.loadingPic.close();
                        that.loadingPic==null?null:that.loadingPic.close();
                        that.$alert('图片上传失败，请重新上传','',{
                            confirmButtonText:'好的，我知道了'
                        }).catch(()=>{})
                    }
                });
            }else{
                this.$alert('请完成“业务信息”相关必填内容','',{
                    confirmButtonText:'好的'
                }).catch(()=>{})
            }
            
        },
        //暂存
        tempStorage: function(){
            this.pureData();
            let that = this;
            that.loading = true;
            this.uploadFile(function(response){
                that.loadingPic==null?null:that.loadingPic.close();
                if(response == 200 || response == 100){
                    if(response == 200){
                        localStorage.setItem('quotationInformation_tempsavestep',4);
                        that.$temporary().then((code)=>{
                            that.loading = false;
                        });
                    }else if(response == 100){
                        localStorage.setItem('quotationInformation_tempsavestep',4);
                         that.$temporary().then((code)=>{
                            that.loading = false;
                        });
                    }
                }else if(response != 200 && response != 100){
                    // that.loadingPic.close();
                    that.$alert('图片上传失败，请重新上传','',{
                        confirmButtonText:'好的，我知道了'
                    }).then(()=>{
                        that.loading = false;
                    }).catch(()=>{
                      that.loading = false;
                    })
                    that.$temporary().then((code)=>{
                        that.loading = false;
                    });
                }
                
            });
            

            
        },
        //上一步
        goPrev: function(){
            this.pureData();
            // this.$router.go(-1);
             this.$router.push({path:'procedureThree'})
        },
        //进入该页面的一个初始化
        getInitData: function(){
            let tempc = [];
            let _that = this;
            let information_2 = JSON.parse(localStorage.getItem('quotationInformation_2'));
            let information_3 = JSON.parse(localStorage.getItem('quotationInformation_3'));
            let information_4 = JSON.parse(localStorage.getItem('quotationInformation_4'));
            // this.planNameT = [];//计划名字
            // this.planCodeT = [];//计划编码
            //对比第一步的顺序与暂存里的顺序对不对的上
            //把第一步的计划压入
            for(let i = 0; i < information_2.distributionPlan.length; i++){
                //压入名字
                this.planNameT.push(information_2.distributionPlan[i].activeName)
                this.planCodeT.push(information_2.distributionPlan[i].planCode)
                this.dynamicValidateFormOpen.push({open:false})
            }
            this.planNameT.forEach(function(currentValue,index){
                let premiun_5=0;
                let temD = information_3.configurationResponsibility[index].data;//第二步
                let temD_4 = information_4.conditionsList[index].data;//第三步
                temD.forEach(function(currentTemdValue,indexTemd){
                    let flag = false;
                    let nowIndex ;
                    if(temD_4.length > 0){
                        temD_4.forEach(function(currentTemdAValue,indexTemdA){
                            if(currentTemdValue.responsibilityCode == currentTemdAValue.responsibilityCode){
                                //判断有大类
                                flag = true;
                                nowIndex = indexTemdA;
                            }
                        })
                    }
                    if(flag){
                        //有大类的时候
                        for(let j = 0; j <currentTemdValue.responsibilityData.length;j++){
                            if(j < temD_4[nowIndex].responsibilityData.length){
                                if(currentTemdValue.responsibilityData[j].subResponsibilityData == null){//没有子责任
                                    currentTemdValue.responsibilityData[j].level = temD_4[nowIndex].responsibilityData[j].level;
                                }else{
                                    currentTemdValue.responsibilityData[j].subResponsibilityData.forEach(function(currentSubValue,indexSub){
                                        // if(currentSubValue.subIfDefaultConfiguration == true){
                                        //      currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = temD_4[nowIndex].responsibilityData[j+indexSub].level
                                        // }else{
                                        //      currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = null
                                        // }
                                        if(currentSubValue.subIfDefaultConfiguration == true){
                                            let last_flag = false;
                                            let last_index;
                                            if(temD_4.length > 0){
                                                temD_4[nowIndex].responsibilityData.forEach(function(lastValue,lastIndex){
                                                    if(lastValue.responsibilityNameCode == currentSubValue.subResponsibilityNameCode){
                                                        last_flag = true;
                                                        last_index = lastIndex;
                                                    }
                                                })
                                            }
                                            if(last_flag){
                                                currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = temD_4[nowIndex].responsibilityData[last_index].level
                                            }else{
                                                currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = null
                                            }
                                        }else{
                                            currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = null
                                        }
                                    })
                                }
                            }
                            
                        }

                    }else{
                        //没有大类的时候
                        for(let j = 0; j <currentTemdValue.responsibilityData.length;j++){
                            if(currentTemdValue.responsibilityData[j].subResponsibilityData == null){//没有子责任
                                currentTemdValue.responsibilityData[j].level = null;
                            }else{
                                currentTemdValue.responsibilityData[j].subResponsibilityData.forEach(function(currentSubValue,indexSub){
                                    currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = null
                                    // if(currentSubValue.subIfDefaultConfiguration == true){
                                    //     let last_flag = false;
                                    //     let last_index ;
                                    //     if(temD_4.length > 0){
                                    //         temD_4[nowIndex].responsibilityData.forEach(function(lastValue,lastIndex){
                                    //             if(lastValue.responsibilityNameCode == currentSubValue.subResponsibilityNameCode){
                                    //                 last_flag = true;
                                    //                 last_index = lastIndex;
                                    //             }
                                    //         })
                                    //     }
                                    //     if(last_flag){
                                    //         currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = temD_4[nowIndex].responsibilityData[last_index].level
                                    //     }else{
                                    //         currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = null
                                    //     }
                                    // }else{
                                    //     currentTemdValue.responsibilityData[j].subResponsibilityData[indexSub].level = null
                                    // }
                                })
                            }
                        }
                    }
                })
                
                if(!!localStorage.getItem('quotationInformation_5_0')&&!!localStorage.getItem('quotationInformation_5_1')&&localStorage.getItem('quotationInformation_5_1')!=''){
                    let current_5 = JSON.parse(localStorage.getItem('quotationInformation_5_1')).premiunFP
                    current_5.forEach(function(currentValue_p,index_p){
                        if(currentValue_p.planCode == _that.planCodeT[index]){//currentValue_p.planName == currentValue
                            premiun_5 = currentValue_p.premium;
                        }
                    })
                }
                tempc.push({
                    planName:currentValue,//名称
                    planCode:_that.planCodeT[index],//计划编码
                    premium:premiun_5,//期望保费
                    basicInformation:information_2.distributionPlan[index],//基础信息
                    insuranceLiability:temD,//险种责任
                })
            })
           
            this.expectedPremiumList.domains = tempc;

            
            this.expectedPremiumList.domains.forEach(function(currentD,indexD){
                _that.totalPeople += Number(currentD.basicInformation.numberOfInsured);
                _that.totalPremium += Number(currentD.premium);
            })

            if(!!localStorage.getItem('quotationInformation_5_0')&&localStorage.getItem('quotationInformation_5_0')!=''){
                let current = JSON.parse(localStorage.getItem('quotationInformation_5_0')).premiunF
                console.log(JSON.parse(localStorage.getItem('quotationInformation_5_0')));
                this.agencyFee = current.agencyFee;
                this.agency =  current.agency;
                this.businessInformation = current.businessInformation;
                this.businessInformationName = current.businessInformationName;
                this.textareaRemarks = current.textareaRemarks;
                this.totalPremium = current.totalPremium;
                //喜获保期
                if(current.yfyear != null && current.yfyear != ''){
                    this.insurancePeriod = 1;
                }else if(current.yfyear == 0 && current.yfmonth != null && current.yfmonth != ''){
                    this.insurancePeriod = 2;
                }else {
                    this.insurancePeriod = 3;
                    this.insurancePeriodDay = current.yfday;
                }
            }
            // 获取图片
            if(!!localStorage.getItem('quotationInformation_pic') && localStorage.getItem(' quotationInformation_pic')!=''){
               let pic = JSON.parse(localStorage.getItem('quotationInformation_pic')).picList;
               console.log(pic);
                this.fileList = pic;
                this.fileListCopy = pic;
            }
            
            console.log('保费');
        },
        //回到主页
        goHome: function(){
            //  this.$router.go(-6);
            this.$clearTemporaryAll();//清楚所有步骤的信息
             this.$router.push({name:'OtoIndex'})
        },
        //存储数据的整理
        DataArrangement(){
            let flag = false;
            let periodFlag = false;
            let allflag = false;//作用是所有的都填写了
            let that = this;
            console.log('businessInformation');
            console.log(this.businessInformation);
            if(this.businessInformation != '' ){
                this.options.forEach(function(current,index){
                    if(current.channelscode == that.businessInformation){
                        that.businessInformationName = current.channelsname;
                    }
                })
                if(this.businessInformation == 'C20' ||this.businessInformation == 'C10' || this.businessInformation == 'C40'){
                    if(this.businessInformation == 'C20' ||this.businessInformation == 'C10'){
                        this.agency = '';
                        this.agencyFee = '';
                    }
                    flag = true;
                }else if(this.businessInformation != 'C20' && this.businessInformation != 'C10' && this.businessInformation != 'C40'){
                    if(this.agency != '' && this.agencyFee != ''){
                         flag = true;
                    }
                }
            }
            if(this.insurancePeriod != '' ){
                if(this.insurancePeriod == 1){//选择1年
                    this.yfyear = 1;
                    this.yfmonth = 0;
                    this.yfday = 0;
                    periodFlag = true;
                }else if(this.insurancePeriod == 2){
                    this.yfyear = 0;
                    this.yfmonth = 1;
                    this.yfday = 0;
                    periodFlag = true;
                }else{
                    this.yfyear = 0;
                    this.yfmonth = 0;
                    if(this.insurancePeriodDay != ''){
                        this.yfday = this.insurancePeriodDay;
                        periodFlag = true;
                    }else{
                        periodFlag = false;
                    }
                }
            }else{
                periodFlag = false;
            }
            if(flag && periodFlag){
                    this.pureData();
                    // this.$router.push({path:'procedurePreview'})
            }else{
                this.$alert('请完成“业务信息”相关必填内容','',{
                    confirmButtonText: '确定',
                    callback: action => {}
                })
            }
            allflag = (flag && periodFlag) ? true: false;
            console.log(allflag);
            return allflag;
        },
        //单纯数据处理
        pureData(){
                let premiumFPT = [];//保费
                if(this.insurancePeriod != '' ){
                    if(this.insurancePeriod == 1){//选择1年
                        this.yfyear = 1;
                        this.yfmonth = 0;
                        this.yfday = 0;
                    }else if(this.insurancePeriod == 2){
                        this.yfyear = 0;
                        this.yfmonth = 1;
                        this.yfday = 0;
                    }else{
                        this.yfyear = 0;
                        this.yfmonth = 0;
                        this.yfday = this.insurancePeriodDay;
                    }
                }
                let prem = {//其他信息
                    agencyFee: this.agencyFee,
                    agency: this.agency,
                    businessInformation: this.businessInformation,
                    businessInformationName: this.businessInformationName,
                    totalPeople: this.totalPeople,
                    totalPremium: this.totalPremium,
                    textareaRemarks: this.textareaRemarks,
                    yfyear: this.yfyear,
                    yfmonth: this.yfmonth,
                    yfday: this.yfday
                }
                let inform = {
                    premium:prem,
                    expectedPremiumList: this.expectedPremiumList.domains,
                }
                for(let i = 0 ; i < this.expectedPremiumList.domains.length; i++){
                    premiumFPT.push({
                        planName:this.expectedPremiumList.domains[i].planName,
                        planCode:this.expectedPremiumList.domains[i].planCode,
                        premium:this.expectedPremiumList.domains[i].premium});
                }
                let quotationInformation = {"premiumPage":inform};
                        localStorage.setItem("quotationInformation_5",JSON.stringify(quotationInformation));
                        //总保费
                let premiunF = {"premiunF":prem}
                        localStorage.setItem("quotationInformation_5_0",JSON.stringify(premiunF));
                let premiumFP = {"premiunFP":premiumFPT}
                        localStorage.setItem("quotationInformation_5_1",JSON.stringify(premiumFP));
        },
        //获取业务渠道的内容/index/getAllSalesChannels获取业务渠道列表
        getSalesChannels(){
            let _that = this;
            this.$axios.get('/index/getAllSalesChannels').then(response => {
                _that.options = response.data.data;
                console.log(_that.options)
            }).catch(error =>{
                _that.$alert('抱歉，程序开小差了o(╥﹏╥)o，请稍后再试，或者联系IT人员','',{
                    confirmButtonText:'好的，我明白了'
                }).catch(()=>{})
            })
        },
        //解决ios键盘回落，内容不回落问题
        handleFocus(event) {
            clearTimeout(this.foucesTimer);
        },
        handleblur() {
            this.foucesTimer = setTimeout(() => {
                document.body.scrollTop = 0;
                window.pageXOffset = 0;
                document.documentElement.scrollTop = 0;
            }, 100);
        },
        //20210422控制最大值为365天保期
        periodDay: function () {
            if(this.insurancePeriodDay > 365){
                this.insurancePeriodDay = 365
            }else if(this.insurancePeriodDay < -1){
                this.insurancePeriodDay = 0
            }else{
                this.insurancePeriodDay = Number(this.insurancePeriodDay);
            }
        }
        
    }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
    width: 0px;
}
.procedure-premium{
    margin-top: 50px;
    margin-bottom: 40px;
}
.set-conditions{
    margin-top: 100px;
    height: calc(100vh - 140px);
    padding: 0 15px;
    overflow: hidden;
    .scroll-conditions{
        height: calc(100vh - 140px);
        overflow: scroll;
    }
}
.premium-part{
    .part-title{
        font-size: 12px;
        background: #f5f5f5;
        padding: 10px 15px;
        color: #292828;
        position: relative;
        &::before{
            content: '';
            height: 30%;
            width: 4px;
            background: #f8b95b;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    .part-select{
        font-size: 12px;
        padding: 5px 15px;
        border-radius: 10px;
        background-color: white;
        .tip{
            color: red;
        }
        label{
            margin-right: 5px;
            width: 21%;
            // width: 25%;
            display: inline-block;
            height: 35px;
            line-height: 35px;
            vertical-align: bottom;
        }
        .select{
            display: inline-block;
        }
        .el-input{
            width: 73%;
        }
        .supplement{
            margin-top: 5px;
            p{
                margin-top: 10px;
                label {
                    padding: 3px 0;
                }
            }
        }
    }
    .insurance-period{
        margin-top: 10px;
        .insurance-period-day{
            margin-top: 5px;
            text-align: center;
            .el-input{
                width: 42%;
                display: inline-block;
            }
           
        }
    }
}
.premium-part:not(:first-child){
    margin-top: 10px;
}
.expected-premium{
    font-size: 12px;
    padding: 5px 15px;
    height: 35px;
    line-height: 35px;
    position: relative;
    span{
        &:last-child{
           position: absolute;
           right: 0;
           top: 50%;
           transform: translateY(-50%);
           display: inline-block;
           width: 200px;
        }
    }
    .el-input{
        width: 36%;
        height: 35px;
    }
}
.remarks{
    font-size: 12px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}
.upload-attachment{
    background: #fff;
    margin-bottom: 10px;
    padding: 10px 5px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    p{
        margin-bottom: 5px;
    }
    .attachment-tip{
        font-size: 11px;
        color: #bfbfbf;
    }
}
.responsibility-part{
    position: relative;
    overflow: hidden;
    padding-top: 30px;
    margin-top: 15px;
    background: #fff;
    border-radius: 10px;
    &:first-child{
        margin-top: 0;
    }
    .procedure-corner-mark{
        position: relative;
        // width: 170px;
        width: 500px;
        height: 60px;
        border-radius: 100%;
        background: #5393fc;
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        span{
            color: #fff;
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            width: 100%;
            font-weight: 700;
            text-align: center;
        }
    }
}
.preimum-remark{
    margin-top: 10px;
}
.basic-information{
    font-size: 12px;
    padding: 5px 15px;
    .infor{
        p{
            margin-top: 5px;
        span{
                &:first-child{
                    width: 22%;
                    display: inline-block;
                }
                &:last-child{
                    width: 78%;
                    display: inline-block;
                    vertical-align: text-top;
                }
            }
        }
    }
    ul{
        list-style-type: none;
        li{
            margin-top: 5px;
            div{
                margin-top: 5px;
                .desc{
                    font-size: 11px;
                    span{
                        padding: 3px 0;
                    }
                }
            }
            p{
                span{
                    display: inline-block;
                    width: auto;
                }
            }
            .kind{
                text-indent: 1em;
            }
            .kind-explain-1.desc-nosub{
                text-indent: 1em;
            }
            .kind-explain-1.desc-sub{
                margin-left: 4em;
            }
            .kind-explain-2{
                margin-left: 4em;
            }
        }
    }
}
.upload-attachment{
    font-size: 12px;
}
.total-whole{
    font-size: 12px;
    margin-top: 10px;
    font-weight: 700;
    span{
        display: inline-block;
        &:first-child{
            width: 30%;
            margin-left: 5%;
        }
        &:last-child{
            width: 60%;
            text-align: right;
            margin-left: 5%;
            padding-right: 2%;
            box-sizing: border-box;
        }
    }
}
.procedure-btn{
    width: 100%;
    position: fixed;
    bottom: 0;
    font-size: 0;
    button{
        width: 25%;
        height: 36px;
        background: #fff;
        border: none;
        border-left: 1px solid #d5d4d4;
        color: #62b4ff;
        font-size: 12px;
        &:first-child{
            border-left: 0;
        }
        &:last-child{
            color: #fff;
            background: #62b4ff;
        }
    }
}
// .procedure-step{
//     position: fixed;
//     top: 45px;
//     width: 100%;
// }
.if-open{
    text-align: center;
    font-size: 12px;
    .el-button{
        border: none;
        padding: 8px 20px;
    }
    .el-button:focus, .el-button:hover{
        background: #fff;
    }
}

</style>

<style lang="scss">

.procedure-premium{
    .loadingFont {
        .el-loading-text{
            font-size: 10px;
        }
        .el-loading-spinner {
          margin-top: -15px;
        }
    }
   .el-steps{
        height: 40px;
        .el-step{
            // top: -15px;
            .el-step__title{
                 font-size: 10px;
                 line-height: 15px;
            }
            .el-step__title.is-process{
                font-weight: 400;
            }
        }
        .el-step__title.is-success{
            color: #6db9fe;
        }
        .el-step__head.is-success{
            border-top-color: #6db9fe;
            border-bottom-color: inherit;
        }
        
        .el-step__icon-inner.is-status{
            color: #6db9fe;
        }
        .el-step__head.is-success{
            color: #6db9fe;
        }
        .el-step__line-inner{
            border-bottom: 0px;
        }
        .el-step__title.is-process,.el-step__head.is-process{
            color: #f8b95b;
        }
        .el-step__icon{
            background: #f5f5f5;
        }
        .el-step.is-horizontal .el-step__line{
            height: 1px;
        }
        // .el-step.is-horizontal .el-step__line{
        //     // top: 35px;
        // }
        .el-step__icon.is-text{
            border: 1px solid;
        }
        .el-step__icon{
            width: 20px;
            height: 20px;
            font-size: 12px;
        }
        
    }
    .el-textarea__inner{
        padding: 5px 15px 25px 15px;
        font-size: 12px;
    }
    .el-form-item{
        height: 35px;
        line-height: 35px;
        .el-form-item__content{
            line-height: 35px;
        }
    }
    .el-divider--horizontal{
        margin: 10px 0 10px 0;
    }
    .el-divider .el-divider__text{
         font-size: 12px;
    }
    .procedure-three .el-steps .el-step__head.is-success .el-step__line-inner{
        height: 0;
        border-top: 0px !important;
    }
    .procedure-three .el-steps .el-step__head.is-success .el-step__line{
        background-color: #6db9fe;
    }
    .pDialog {
        .el-dialog--center .el-dialog__body{
            padding-top: 5px;
        }
        .el-dialog__header {
            padding: 10px 20px 10px;
        }
        .el-dialog{
            position: absolute;
            bottom: 0;
            margin: 0;
        }
        .dialog-title{
            font-size: 14px;
            text-align: left;
            .dialog-tip{
                font-size: 12px;
                color: #bfbfbf;
                margin-left: 10px;
                .tip-red{
                    color: red;
                    font-style: normal;
                }
            }
        }
        .dialog-footer{
            font-size: 12px;
            .tip{
                text-align: left;
            }
        }
        .tip-red{
            color: red;
        }
        .el-dialog__body{
            max-height: calc(100vh - 200px);
            overflow: scroll;
        }
        .group-radio{
            text-align: center;
        }
        .el-radio-group{
            label{
                display: block;
                text-align: center;
                margin: 0 auto;
                margin-top: 10px;
                width: 200px;
                height: 38px;
                &:not(:first-child){
                    margin-left: 0;
                }
            }
        }
    }
    .premium-part .el-input__inner{
        line-height: 35px;
        height: 35px;
        font-size: 12px;
        padding: 0 5px;
    }

    .el-upload--picture-card{
        width: 105px;
        height: 105px;
        line-height: 115px
    }
    .el-upload-list--picture-card .el-upload-list__item{
        width: 105px;
        height: 105px;
    }
    .el-upload-list--picture-card .el-upload-list__item:nth-child(3n){
        margin-right: 0;
    }
    .part-remark .el-textarea__inner{
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border: none;
        border-bottom: 1px solid #efefef;
    }
    .upload-attachment{
        .el-dialog{
            width: 100%;
            height: calc(100vh - 25vh);
        }
    }
    .el-upload-list--picture-card .el-upload-list__item-actions{
        color: black;
        opacity: 1;
        background-color: rgba(255,255,255,0)
    }
    .el-upload-list--picture-card .el-upload-list__item-actions span.el-upload-list__item-delete{
        display: inline-block;
        position: absolute;
        border-radius: 100%;
        padding: 0px 7px;
        right: -7px;
        top: -7px;
        background: rgba(255,255,255,.7);
    }
    .el-upload-list--picture-card .el-upload-list__item-actions span.el-upload-list__item-preview{
        width: 100%;
        height: 70%;
        position: absolute;
        bottom: 0;
        left: 0;
    }
}

</style>