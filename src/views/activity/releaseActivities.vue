<template>
  <div class="releaseActivity">
    <persHeader />
    <div class="releaseActivity_title">
      <div class="releaseActivity_title_icon">
        <i class="icon font_family icon-fabuhuodong34"></i>
      </div>
      <div class="releaseActivity_title_name">发布活动</div>
    </div>
    <div class="releaseActivity_main">
      <div class="releaseActivity_main_top">
        <div class="releaseActivity_main_top_left">
          <div class="item-main">
            <div class="item-main-flex" :class="{ focused: nameEr  }">
              <div class="item-main-icon">
                <i class="icon font_family icon-mingcheng24"></i>
              </div>
              <div class="item-main-content">
                <input
                  type="text" 
                  placeholder="活动名称" 
                  v-model="reqData.name" 
                  maxlength="64"
                  @focus="nameEr = true" 
                  @blur="nameEr = false" 
                />
              </div>
            </div>
          </div>
          <div class="item-main">
            <div class="item-main-group">
              <div class="item-main-group-l" :class="{ focused: ticketAmountEr }">
                <div class="item-main-group-l-m">
                  <div class="item-main-icon">
                    <i class="icon font_family icon-shuliang24"></i>
                  </div>
                  <div class="item-main-content">
                    <div class="item-main-group-l-m-c">
                      <div class="item-main-group-l-m-c-name">入场券数</div>
                      <div class="item-main-group-l-m-c-num">
                        <input 
                          type="text" 
                          v-model.number="reqData.ticketAmount" 
                          maxlength="7"
                          @change="changeTicketAmount"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="item-main-group-c">
                <i class="icon font_family icon-jiahao24" @click="addTicketAmount"></i>
              </div>
              <div class="item-main-group-r">
                <i class="icon font_family icon-jianhao24" @click="reduceTicketAmount"></i>
              </div>
            </div>
          </div>
          <div class="item-main">
            <div class="item-main-two">
              <div class="item-main-two-l" :class="{ focused: ticketFeeEr }">
                <div class="item-main-two-l-m">
                  <div class="item-main-icon">
                    <i class="icon font_family icon-shuliang24"></i>
                  </div>
                  <div class="item-main-content">
                    <div class="item-main-two-l-m-c">
                      <div class="item-main-two-l-m-c-name">票券价格</div>
                      <div class="item-main-two-l-m-c-num">
                        <div class="item-main-two-l-m-c-num-checkbox">
                          <span class="item-main-two-l-m-c-num-checkbox-name">免费</span>
                          <span class="item-main-two-l-m-c-num-checkbox-icon">
                            <i 
                              class="icon font_family"
                              :class="isTicketFee ? 'icon-kongxinyuanquan20' : 'icon-shixinyuanquan20'"
                              @click="checkboxHandler"
                            >
                            </i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="item-main-two-r" :class="{ focused: ticketFeeEr }">
                <input 
                  type="text"
                  v-model.number="ticketFee" 
                  :disabled="!isTicketFee" 
                  placeholder="自定义" 
                  maxlength="7" 
                  @focus="ticketFeeEr = true" 
                  @blur="ticketFeeEr = false" 
                />
              </div>
            </div>
          </div>
          <div class="item-main">
            <div class="item-main-desc">
              <div class="item-main-desc-l" :class="{ focused: coverEr }">
                <div class="item-main-desc-l-m">
                  <ImageUpload
                    upload-type="image"
                    upload-name ='上传封面'
                    :on-upload-success="findGetImageUrlFun"
                  />
                </div>
              </div>
              <div class="item-main-desc-r" :class="{ focused: coverDescriptionEr }">
                <textarea 
                  type="text"
                  v-model="reqData.coverDescription" 
                  placeholder="活动封面描述" 
                  maxlength="200" 
                  @focus="coverDescriptionEr = true" 
                  @blur="coverDescriptionEr = false" 
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="releaseActivity_main_top_right">
          <div class="item-main activityMode">
            <div class="item-main-flex" :class="{ focused: isOnlineEr }">
              <div class="item-main-icon">
                <i class="icon font_family icon-leixing24"></i>
              </div>
              <div class="item-main-content">
                <div class="item-main-online">
                  <div class="item-main-online-name">活动方式</div>
                  <div class="item-main-online-on">
                    <div class="item-main-online-checkbox" @click="checkboxOnliner1">
                      <span class="item-main-online-checkbox-name" :class="reqData.onlineType != null ? 'falg' : ''">{{ activityMode }}</span>
                      <span class="item-main-online-checkbox-icon">
                        <i 
                          class="icon font_family"
                          :class="reqData.onlineType != null ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                        >
                        </i>
                      </span>
                    </div>
                  </div>
                  <div class="item-main-online-of">
                    <div class="item-main-online-checkbox" @click="checkboxOnliner2">
                      <span class="item-main-online-checkbox-name" :class="!isOnline2 ? '' : 'falg'">线下活动</span>
                      <span class="item-main-online-checkbox-icon">
                        <i 
                          class="icon font_family"
                          :class="isOnline2 ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                        >
                        </i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="item-main-absolute" v-if='isOnlineAb'>
              <div class="item-main-absolute-info" :class="{ focused: onlineTypeEr }">
                <div 
                  class="item-main-absolute-name" 
                  :class="isOnlineType == item.value ? 'absFlag' : ''"
                  v-for="item in activityModeOptions" 
                  :key="item.value"
                  @click="changeActivityMode(item)">
                  {{ item.label }}
                </div>
              </div>
            </div>
          </div>
          <template v-if="isOnline2">
            <div class="item-main actAddress">
              <div class="item-main-address" :class="{ focused: addressEr }">
                <div class="item-main-icon">
                  <i class="icon font_family icon-shengshidizhi24"></i>
                </div>
                <div class="item-main-content">
                  <div class="item-main-content-m">
                    <div class="item-main-content-m-title">活动地址</div>
                    <!-- <div class="item-main-content-m-adderss">
                      <location-picker @location-selected="handleLocationSelected"></location-picker>
                    </div> -->
                  </div>
                </div>
                <div class="item-main-content-m-adderss">
                  <location-picker @location-selected="handleLocationSelected"></location-picker>
                </div>
              </div>
            </div>
            <div class="item-main">
              <div class="item-main-flex" :class="{ focused: fullAddressEr }">
                <div class="item-main-icon">
                  <i class="icon font_family icon-huodongdizhi24"></i>
                </div>
                <div class="item-main-content">
                  <input 
                    type="text" 
                    placeholder="详细地址" 
                    v-model="reqData.fullAddress" 
                    maxlength="200"
                    @focus="fullAddressEr = true" 
                    @blur="fullAddressEr = false" 
                  />
                </div>
              </div>
            </div>
          </template>
          <div class="item-main">
            <div class="item-main-flex" :class="{ focused: startTimeEr }">
              <div class="item-main-icon">
                <i class="icon font_family icon-rili24"></i>
              </div>
              <div class="item-main-content">
                <div class="item-main-time">
                  <div class="item-main-time-name">活动周期</div>
                  <div class="item-main-time-group" >
                    <el-date-picker
                      v-model="reqTime"
                      type="daterange"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    />
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          <div class="item-main">
            <div class="item-main-flex" :class="{ focused: tagEr }">
              <div class="item-main-icon">
                <i class="icon font_family icon-biaoqian24"></i>
              </div>
              <div class="item-main-content">
                <input 
                  type="text" 
                  placeholder="活动标签" 
                  v-model="reqData.tag" 
                  maxlength=""
                  @focus="tagEr = true" 
                  @blur="tagEr = false"
                />
              </div>
            </div>
          </div>
          <div class="item-main">
            <div class="item-main-flex">
              <div class="item-main-icon">
                <i class="icon font_family icon-leixing24"></i>
              </div>
              <div class="item-main-content">
                <div class="item-main-madeBy">
                  <div class="item-main-madeBy-name">
                    <span>是否确权</span>
                    <div class="item-main-madeBy-icon">
                      <i 
                        class="icon font_family icon-wenhaoyuanquan24"
                      ></i>
                      <div class="madeBy-title">确认和登记某项资产或权利的归属</div>
                    </div>
                  </div>
                  <div class="item-main-madeBy-on">
                    <div class="item-main-madeBy-checkbox" @click="checkboxOnChain(1)">
                      <span class="item-main-madeBy-checkbox-name" :class="!isOnChain1 ? 'falg' : ''">是</span>
                      <span class="item-main-madeBy-checkbox-icon">
                        <i 
                          class="icon font_family"
                          :class="isOnChain1 ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                        >
                        </i>
                      </span>
                    </div>
                  </div>
                  <div class="item-main-madeBy-of">
                    <div class="item-main-madeBy-checkbox" @click="checkboxOnChain(0)">
                      <span class="item-main-madeBy-checkbox-name" :class="!isOnChain2 ? 'falg' : ''">否</span>
                      <span class="item-main-madeBy-checkbox-icon">
                        <i 
                          class="icon font_family"
                          :class="isOnChain2 ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                        >
                        </i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="releaseActivity_main_bottom" :class="{ focused: descriptionEr }"> 
        <ContentManager name="活动介绍" v-model:modelValue="contents" />
      </div>
    </div>
    <div class="submitTheRelease">
      <div class="submitTheRelease-main">
        <div class="draft" @click="submitDraft">存草稿</div>
        <div class="theRelease">
          <div class="theRelease-main" :class="isExpense ? '' : 'falg'">
            <div class="theRelease-main-expense">
              <div class="theRelease-main-expense-main">
                <div class="theRelease-main-expense-icon">
                  <i class="icon font_family icon-lianjie24"></i>
                </div>
                <div class="theRelease-main-expense-name">支付<span>{{ expense }}</span>元上链费</div>
              </div>
            </div>
            <div class="theRelease-main-publish" @click="uploadToCOS">发布</div>
          </div>
        </div>
      </div>
    </div>
    <PayBg :payData="payData" @close="closePayModal" v-if="payData.isPay" @button-click="pointsDeduction" />
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted } from 'vue';
  import PayBg from '@/components/pay/index.vue';
  import ImageUpload from '@/components/upload/index.vue';
  import persHeader from '@/components/header/persHeader.vue';
  import ContentManager from '@/components/module/ContentManager.vue';
  import LocationPicker  from '@/components/TreeSelect/address.vue';
  import { activitiesPublish } from '@/api/userContent';
  import { upChainPoundages, pointIsOpen, orderSave, orderQuery } from '@/api/pay';
  import { filesCos } from '@/api/common';
  import { uploadFileToCOS } from '@/services/uploadService';
  import { useUploadStore } from '@/stores/uploadStore';
   import { showPopup } from '@/utils/usePopup';
  import { aeUseStore } from '@/stores/user';
  import { aePublishStore } from '@/stores/publish';
  import { setItem, getItem } from '@/utils/index';
  const userStore = aeUseStore();
  const publishStore = aePublishStore();
  const userInfo = userStore.getUserInfo;
  console.log('userInfo', userInfo);
  console.log('userInfo', getItem('token'));
  const AuthorizationToken = ref('');
  if( userInfo.token == ''){
    AuthorizationToken.value = getItem('token');
  } else {
    AuthorizationToken.value = userInfo.token;
  }
  

  // import { formatNumber } from '@/utils/index';
  // import { filterInput } from '@/utils/index';

  const expense = ref(0);
  const reqTime= ref([]);
  const ticketFee = ref('');
  const reqData = ref({
    name: '',  //	String	必传	活动名称
    ticketAmount: 0,  //	Integer	必传	入场券数，免费传0
    ticketFee: null as number | null,  //	BigDecimal	必传	票券价格，免费传0
    cover: '',  //	String	必传	封面url
    coverDescription: '',  //	String	必传	封面描述
    isOnline: 0,  //	Byte	必传	活动方式：线上：1 线下：0
    onlineType: null,  //	Byte	选传	活动方式为线上必传：1AETRIX平台 2其他平台
    address: '',  //	String	选传	线下活动必传：任务地址
    fullAddress: '',  //	String	选传	线下活动必传：详细地址
    startTime: '',  //	String	必传	开始时间
    endTime: '',  //	String	必传	结束时间
    tag: '',  //	String	必传	活动标签
    isOnChain: 1,  //	Byte	必传	是否确权：是否上链：0否1是
    description: [],  //	[]	必传	活动介绍数组
  });
  
  const isTicketFee = ref(true);
  const checkboxHandler = () => {
      if (isTicketFee.value) {
        isTicketFee.value = false;
        reqData.value.payAmount = 0;
      } else {
        isTicketFee.value = true;
        reqData.value.payAmount = null;
      }
  }

  // 票券数加减
  const addTicketAmount = () => {
    if(reqData.value.ticketAmount < 9999999) {
      reqData.value.ticketAmount++;
      changeTicketAmount();
    }
  }
  const reduceTicketAmount = () => {
    if(reqData.value.ticketAmount > 0) {
      reqData.value.ticketAmount--;
      changeTicketAmount();
    }
  }


  // 活动方式
  const activityMode = ref('线上活动');
  const isOnlineType = ref(null); // 1 AE线上 2 其他平台
  const isOnline1 = ref(false); // 线上活动
  const isOnline2 = ref(false); // 线下活动
  const isOnlineAb = ref(false); // 线上弹框判断
  const activityModeOptions = [
    { label: 'AE线上', value: 1 },
    { label: '其他平台', value: 2 },
  ];
  // 点击线上活动展开
  const checkboxOnliner1 = () => {
    isOnline1.value = !isOnline1.value;
    isOnlineAb.value = !isOnlineAb.value;
    // 清空线下选项
    isOnline2.value = false;
    reqData.value.address = '';
    reqData.value.fullAddress = '';
  };

  // 活动方式选择
  const changeActivityMode = (item: any) => {
    isOnlineType.value = item.value;
    activityMode.value = item.label;
    isOnlineAb.value =  false;
    reqData.value.onlineType = item.value;
    reqData.value.isOnline = 1;
    console.log('reqData.value.onlineType', reqData.value.onlineType);
  };

  // 选择线下模式
  const checkboxOnliner2 = () => {
    // 线下时将选中的线上方式清空
    reqData.value.onlineType = null;
    isOnlineType.value = null;
    activityMode.value = '线上活动';
    isOnlineAb.value =  false;

    isOnline2.value = !isOnline2.value;
    reqData.value.isOnline = 0;
  }

  // 是否确权
  const isOnChain1 = ref(true); 
  const isOnChain2 = ref(false);
  const checkboxOnChain = (num: number) => {
    if(num !== reqData.value.isOnChain) {
      if (isOnChain1.value) {
        isOnChain1.value = false;
        isOnChain2.value = true;
        reqData.value.isOnChain = 0;
        isExpense.value = false;
      } else {
        isOnChain1.value = true;
        isOnChain2.value = false;
        reqData.value.isOnChain = 1;
        changeTicketAmount();
      }
    }
  }

  // 选择省市县
  // 判断是否为空对象
  const isEmptyObject = (obj: Record<string, any>): boolean => {
    return Object.keys(obj).length === 0;
  }
  const handleLocationSelected = (location: {}) => {
    console.log(location);
    if(!isEmptyObject(location)) {
      reqData.value.address = location.province.value +','+ location.city.value +','+ location.district.value+','+location.province.label +','+ location.city.label +','+ location.district.label;
    }
    console.log('reqData.value.address', reqData.value.address);
  }


   //获取上传的封面图
   const findGetImageUrlFun = (urls: string[]) => {
    console.log('上传的图片文件', urls);
    reqData.value.cover = urls[0];
    console.log('封面URl', reqData.value.cover);
  };

  // 介绍 	介绍类型：类型：1文本 2图片 3语音 4视频

  const contents = ref<{ type: string; data: any }[]>([]);

  const getData = () => {
    console.log('Submitted contents:', contents.value);
    // 你可以在这里处理提交的内容
    let attr: any = [];
    contents.value.forEach(v => {
      let types = '';
      if(v.type === 'audio') { types = '3' }
      if(v.type === 'video') { types = '4' }
      attr.push({
        type: types,
        content: v.data
      })
    });
    if (reqTime.value.length > 0) {
      reqData.value.startTime = reqTime.value[0]+ ' 00:00:00';
      reqData.value.endTime = reqTime.value[1]+ ' 00:00:00';
    }
    reqData.value.ticketFee = ticketFee.value ? Number(ticketFee.value) : 0;

    reqData.value.description = attr;

    let resData = reqData.value;
    
    return resData;
  };

  // 保存草稿
  const submitDraft = () => {
    let resData = getData();
    publishStore.eventsInfo.data = resData;
    setItem('releaseActivity', resData);
    console.log('publishStore', publishStore.eventsInfo)
  };

  // 计算链上手续费
  const isExpense = ref(false);
  const changeTicketAmount = () => {
    let resData = {
      ticketAmount: reqData.value.ticketAmount,
    };
    isExpense.value = true;
    return new Promise<void>((resolve, reject) => {
      upChainPoundages(resData).then((response: any) => {
        const { code, data, message } = response;
        
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        
        expense.value = resultData;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

  /** 支付信息 **/
  const payData = ref({
    isPay: false,
    type: 1,
    payAmount: 0, // 总金额
    poundage: 0,  // 手续费
    mps: 0,  // 质押金
    createTime: '', // 创建时间
    minute: '', // 有效分钟
    payUrl: ''
  });

  // 关闭支付弹框
  const closePayModal = () => {
    payData.value.isPay = false;
  }

  const pointsDeduction = () => {

  };

  // 发布活动
  const isUnll = ref(true);
  const nameEr = ref(false);
  const ticketAmountEr = ref(false);
  const ticketFeeEr = ref(false);
  const coverEr = ref(false);
  const coverDescriptionEr = ref(false);
  const isOnlineEr = ref(false);
  const onlineTypeEr = ref(false);
  const addressEr = ref(false);
  const fullAddressEr = ref(false);
  const startTimeEr = ref(false);
  const tagEr = ref(false);
  const descriptionEr = ref(false);


  const uploadStore = useUploadStore();
  // 获取cos配置
  const bucket = ref('');
  const region = ref('');
  const sessionToken = ref('');
  const tmpSecretId = ref('');
  const tmpSecretKey = ref('');
  const token = ref('');

  const isPublishing = ref(false);
  // 上传前获取参数
  const uploadToCOS = async () => {
      let resData = {};
      return new Promise<void>((resolve, reject) => {
          filesCos(resData).then((response: any) => {
              const { code, data, message } = response;
              
              const resultData = data;
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                  return;
              }
              
              bucket.value = resultData.bucket;
              region.value = resultData.region;
              sessionToken.value = resultData.sessionToken;
              tmpSecretId.value = resultData.tmpSecretId;
              tmpSecretKey.value = resultData.tmpSecretKey;
              token.value = resultData.token;


              // if (uploadStore.coverImage) {
              //   await uploadFileToCOS(uploadStore.coverImage, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value );
              // }

              // for (const file of uploadStore.mainFiles) {
              //   await uploadFileToCOS(file, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
              // }

              // for (const file of uploadStore.detailFiles) {
              //   await uploadFileToCOS(file, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
              // }

              publish();
              resolve()
          }).catch((error: any) => {
              reject(error)
          })
      })
  
  };

  // 上传提交过的所有文件
  const publish = async () => {
      isPublishing.value = true;
      try {
        // 上传封面图片
        if (uploadStore.coverImage) {
          const coverResult = await uploadFileToCOS(uploadStore.coverImage, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value );
          console.log('coverResult', coverResult);
          reqData.value.cover = `https://${coverResult.data.Location}`;
          if (!coverResult.success) throw coverResult.error;
        }

        // 上传主体文件
        // let attr = [];
        // for (const [index, file] of uploadStore.mainFiles.entries()) {
        //   const mainResult = await uploadFileToCOS(file.file, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
        //   console.log('mainResult', mainResult);
        //   console.log('index', index);
        //   attr.push(`https://${mainResult.data.Location}`)
        //   reqData.value.url = attr.join(',');
        //   if (!mainResult.success) throw mainResult.error;
        // };

        // 上传详情文件
        for (const file of uploadStore.detailFiles) {
          const detailResult = await uploadFileToCOS(file.file, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
          console.log('detailResult', detailResult);
          contents.value[file.id].data = `https://${detailResult.data.Location}`;
          if (!detailResult.success) throw detailResult.error;
        }

        // 所有文件上传成功后，执行发布操作
        submitContents();
        // 清空上传状态
        uploadStore.clearAllFiles();

      } catch (error) {
        console.error('发布失败：', error);
        alert('发布失败，请重试！');
      } finally {
        isPublishing.value = false;
      }
    };

  const submitContents = () => {
    let resData = getData();
    

    // 检查对象中的每个键值对
    for (const key in resData) {
      if (resData.hasOwnProperty(key)) {
        console.log('resData.key', resData[key]);
        const value = resData[key];

        // isOnline: 0,  //	Byte	必传	活动方式：线上：1 线下：0
        // onlineType: null,  //	Byte	选传	活动方式为线上必传：1AETRIX平台 2其他平台
        // address: '',  //	String	选传	线下活动必传：任务地址
        // fullAddress: '',  //	String	选传	线下活动必传：详细地址
        if (key === 'isOnline') {
          if (value == 0) {
            if(resData.address == '' || resData.address === null || resData.address === undefined) {
              addressEr.value = true;
              isUnll.value = false;
            } else {
              addressEr.value = false;
            }
            if(resData.fullAddress == '' || resData.fullAddress === null || resData.fullAddress === undefined) {
              fullAddressEr.value = true;
              isUnll.value = false;
            } else {
              fullAddressEr.value = false;
            }
          } else {
            if(resData.onlineType == '' || resData.onlineType === null || resData.onlineType === undefined) {
              onlineTypeEr.value = true;
              isUnll.value = false;
            } else {
              onlineTypeEr.value = false;
            }
          }
        }
        
        if (key === 'description') {
          if(value.length < 1) {
            descriptionEr.value = true;
            isUnll.value = false;
          } else {
            descriptionEr.value = false;
          }
        }
        if (value === '' || value === null || value === undefined) {
          console.log(`键 ${key} 的值为空`);

          switch (key) {
            case 'name':
              nameEr.value = true;
              break;
            case 'ticketAmount':
            ticketAmountEr.value = true;
              break;
            case 'ticketFee':
            ticketFeeEr.value = true;
              break;
            case 'cover':
              coverEr.value = true;
              break;
            case 'coverDescription':
            coverDescriptionEr.value = true;
              break;
            case 'startTime':
              startTimeEr.value = true;
              break;
            case 'isOnline':
              onlineTypeEr.value = true;
              break;
            case 'tag':
              tagEr.value = true;
              break;
            default:
              break;
          }
          if(key === 'address' || key === 'fullAddress') {
            if (resData.isOnline == 1) {
              isUnll.value = true;
            } else {
              isUnll.value = false;
            }
          } else {
            isUnll.value = false;
          }
          
        } else {
          switch (key) {
            case 'name':
              nameEr.value = false;
              break;
            case 'ticketAmount':
              ticketAmountEr.value = false;
              break;
            case 'ticketFee':
              ticketFeeEr.value = false;
              break;
            case 'cover':
              coverEr.value = false;
              break;
            case 'coverDescription':
              coverDescriptionEr.value = false;
              break;
            case 'startTime':
              startTimeEr.value = false;
              break;
            case 'isOnline':
              onlineTypeEr.value = false;
              break;
            case 'tag':
              tagEr.value = false;
              break;
            default:
              break;
          }
        }
      }
    }
    console.log('isUnll.value', isUnll.value)
    if(!isUnll.value){
      showPopup('还有未填写的信息，请检查！', 'error', 3000);
      return false;
    } else {
      return new Promise<void>((resolve, reject) => {
        activitiesPublish(resData).then((response: any) => {
          const { code, data, message } = response;
          
          const resultData = data;
          if (code !== 200) {
            showPopup(message, 'error', 3000);
              return;
          }
          
          publishStore.eventsInfo.data = {};
          setItem('releaseActivity', {});
          resolve()
        }).catch((error: any) => {
            reject(error)
        })
      })
    }
  };

  onMounted(() => {
    console.log('publishStore.eventsInfo.data ', publishStore.eventsInfo );
    
    if(!isEmptyObject(publishStore.questInfo.data)) {
      reqData.value = publishStore.questInfo.data; // 有值
      reqTime.value= [reqData.value.startTime, reqData.value.endTime];
    } else {
      if(getItem('postATask') !== null) {
        reqData.value = getItem('postATask'); // 有值
        reqTime.value= [reqData.value.startTime, reqData.value.endTime];
      }
    }
    reqData.value.isOnChain = reqData.value.isOnChain ?? 1;
    console.log('releaseActivity', getItem('releaseActivity') );
  })
  
</script>

<style lang='scss' scoped>
  @use '@/assets/styles/releaseActivities.scss';
  :deep(.arco-picker-container){
    background-color: rgba(0, 0, 0, 0.02) !important;
    backdrop-filter: blur(8px);
  }
  :deep(.arco-picker-range-container){
    background-color: rgba(0, 0, 0, 0.02) !important;
    backdrop-filter: blur(8px);
  }
  /* 修改单个选择器的样式 */
  :deep(.arco-picker-container) {
      /* 设置背景颜色 */
      background-color: #f0f0f0;
      /* 设置边框 */
      border: 1px solid #d9d9d9;
      /* 圆角 */
      border-radius: 4px;
      /* 内边距 */
      padding: 8px;
      /* 其他样式 */
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  /* 修改范围选择器的样式 */
  :deep(.arco-picker-range-container) {
      /* 设置背景颜色 */
      background-color: #ffffff;
      /* 设置边框 */
      border: 1px solid #d9d9d9;
      /* 圆角 */
      border-radius: 4px;
      /* 内边距 */
      padding: 8px;
      /* 其他样式 */
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  /* 示例：修改日期选择器中的输入框样式 */
  :deep(.arco-picker-container input,
  .arco-picker-range-container input) {
      /* 修改字体颜色 */
      color: #333333;
      /* 修改字体大小 */
      font-size: 14px;
      /* 修改内边距 */
      padding: 4px 8px;
      /* 移除默认边框 */
      border: none;
      /* 添加自定义边框 */
      border-bottom: 1px solid #d9d9d9;
      /* 设置背景颜色 */
      background-color: transparent;
  }

  /* 示例：修改日期选择器中的清除按钮样式 */
  :deep(.arco-picker-container .arco-picker-clear,
  .arco-picker-range-container .arco-picker-clear) {
      /* 修改清除按钮颜色 */
      color: #ff4d4f;
  }

  /* 示例：修改日期选择器中的图标样式 */
  :deep(.arco-picker-container .arco-picker-icon,
  .arco-picker-range-container .arco-picker-icon) {
      /* 修改图标颜色 */
      color: #1890ff;
  }
</style>
