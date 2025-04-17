<template>
  <div class="height-100">
    <persHeader />
    <div class="work">
      <div class="work_title">
        <div class="work_title_icon">
          <i class="icon font_family icon-fabuzuopin34"></i>
        </div>
        <div class="work_title_name">发布作品</div>
      </div>
      <div class="work_main">
        <div class="work_main_tab">
          <TabFileUpload @file-upload="handleFileUpload"  />
        </div>
        <div class="work_main_top">
          <div class="work_main_top_left">
            <div class="item-main">
              <div class="item-main-pulldown">
                <div class="item-main-pulldown-content" :class="{ focused: entityTypeEr }">
                  <div class="item-main-pulldown-flex">
                    <div class="item-main-pulldown-flex-l">
                      <div class="item-main-pulldown-flex-l-m">
                        <div class="item-main-pulldown-flex-l-m-icon">
                          <i class="icon font_family icon-fenlei24"></i>
                        </div>
                        <div class="item-main-pulldown-flex-l-m-name">作品属性</div>
                      </div>
                    </div>
                    <div class="item-main-pulldown-flex-c" @click.stop="toggleDropdown('modele1')">
                      <div class="item-main-pulldown-flex-c-m">
                        <span class="item-main-pulldown-flex-c-m-name">
                          <template v-if="isNoOff == 1">虚拟</template>
                          <template v-if="isNoOff == 2">实物</template>
                          <template v-if="isNoOff == 3">虚拟+实物</template>
                        </span>
                        <span class="item-main-pulldown-flex-c-m-num">{{ reqData.entityQuantity }}</span>
                      </div>
                    </div>
                    <div class="item-main-pulldown-flex-r" @click.stop="toggleDropdown('modele1')">
                      <i 
                        class="icon font_family"
                        :class="currentDropdown === 'modele1' ? 'icon-a-jiantouxiangshangshousuo24' : 'icon-a-jiantouxiangxiazhankai24'"
                      >
                      </i>
                    </div>
                  </div>
                </div>
                <div class="item-main-pulldown-module dropdown" v-if="currentDropdown === 'modele1'" @click.stop>
                  <div class="module-content">
                    <div class="module-content-list">
                      <div 
                        class="module-content-list-item"
                        v-for="(item, index) in statsList"
                        :key="index"
                        @click="findStatsFun(item.value)"
                      >
                      <div class="list-item-flex">
                        <div class="list-item-flex-name">{{ item.label }}</div>
                        <div class="list-item-flex-icon">
                          <i 
                            class="icon font_family"
                            :class="isNoOff == index + 1 ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                          >
                          </i>
                        </div>
                      </div>
                      </div>
                    </div>
                    <div class="module-content-input" v-if="isEntityQuantity">
                      <input type="text" v-model.number="reqData.entityQuantity" placeholder="设置数量" maxlength="9" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="item-main">
              <div class="item-main-pulldown">
                <div class="item-main-pulldown-content" :class="{ focused: sellTypeEr }">
                  <div class="item-main-pulldown-flex">
                    <div class="item-main-pulldown-flex-l">
                      <div class="item-main-pulldown-flex-l-m">
                        <div class="item-main-pulldown-flex-l-m-icon">
                          <i class="icon font_family icon-tuozhan24"></i>
                        </div>
                        <div class="item-main-pulldown-flex-l-m-name">商业扩展</div>
                      </div>
                    </div>
                    <div class="item-main-pulldown-flex-c" @click.stop="toggleDropdown('modele2')">
                      <div class="item-main-pulldown-flex-c-m">
                        <span class="item-main-pulldown-flex-c-m-name">
                          <!-- 商业拓展：0: 免费 1.付费观看(币/次) 2终身版权 3二次创作权 -->
                          <template v-if="isSellNoOff == 0"></template>
                          <template v-if="isSellNoOff == 1">付费观看</template>
                          <template v-if="isSellNoOff == 3">二次创作权</template>
                          <template v-if="isSellNoOff == 2">终身版权</template>
                        </span>
                        <span class="item-main-pulldown-flex-c-m-num">{{ reqData.sellAmount }}</span>
                      </div>
                    </div>
                    <div class="item-main-pulldown-flex-r" @click.stop="toggleDropdown('modele2')">
                      <i 
                        class="icon font_family"
                        :class="currentDropdown === 'modele2' ? 'icon-a-jiantouxiangshangshousuo24' : 'icon-a-jiantouxiangxiazhankai24'"
                      >
                      </i>
                    </div>
                  </div>
                </div>
                <div class="item-main-pulldown-module dropdown" v-if="currentDropdown === 'modele2'" @click.stop>
                  <div class="module-content">
                    <div class="module-content-list">
                      <div 
                        class="module-content-list-item"
                        v-for="(item, index) in sellTypeList"
                        :key="index"
                        @click="findSellTypeFun(item.value)"
                      >
                      <div class="list-item-flex">
                        <div class="list-item-flex-name">{{ item.label }}</div>
                        <div class="list-item-flex-icon">
                          <i 
                            class="icon font_family"
                            :class="isSellNoOff == item.value ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                          >
                          </i>
                        </div>
                      </div>
                      </div>
                    </div>
                    <div class="module-content-input" v-if="isSellType">
                      <div class="content-input-flex">
                        <div class="content-input-flex-num">
                          <input type="text" v-model.number="reqData.sellAmount"  @input="findSellAmountFun" placeholder="设置价格" maxlength="9" />
                        </div>
                        <div class="content-input-flex-unit">豆</div>
                      </div>
                    </div>
                  </div>
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
                    placeholder="作品封面描述" 
                    maxlength="200" 
                    @focus="coverDescriptionEr = true" 
                    @blur="coverDescriptionEr = false" 
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="work_main_top_right">
            <div class="item-main actAddress" :class="{ focused: addressEr }">
              <div class="item-main-address">
                <div class="item-main-icon">
                  <i class="icon font_family icon-shengshidizhi24"></i>
                </div>
                <div class="item-main-content">
                  <div class="item-main-content-m">
                    <div class="item-main-content-m-title">创作地址</div>
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
            <div class="item-main">
              <div class="item-main-flex" :class="{ focused: tagEr }">
                <div class="item-main-icon">
                  <i class="icon font_family icon-biaoqian24"></i>
                </div>
                <div class="item-main-content">
                  <input 
                    type="text" 
                    placeholder="作品标签" 
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
                      <span>是否上链</span>
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
        <div class="work_main_bottom" :class="{ focused: descriptionEr }">
          <ContentManager name="作品创作过程" v-model:modelValue="contents" />
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
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted, onBeforeUnmount, reactive } from 'vue';
  import ImageUpload from '@/components/upload/index.vue';
  import persHeader from '@/components/header/persHeader.vue';
  import ContentManager from '@/components/module/ContentManager.vue';
  import LocationPicker  from '@/components/TreeSelect/address.vue';
  import TabFileUpload from '@/components/tabFileUpload/index.vue';
  import { filesCos } from '@/api/common';
  import { uploadFileToCOS } from '@/services/uploadService';
  import { useUploadStore } from '@/stores/uploadStore';
  import PayBg from '@/components/pay/index.vue';
  import { worksPublish } from '@/api/userContent';
   import { showPopup } from '@/utils/usePopup';
  import { aeUseStore } from '@/stores/user';
  import { aePublishStore } from '@/stores/publish';
  import { setItem, getItem } from '@/utils/index';

  const userStore = aeUseStore();
  const publishStore = aePublishStore();
  const userInfo = userStore.getUserInfo;
  
  const AuthorizationToken = ref('');
  if( userInfo.token == ''){
    AuthorizationToken.value = getItem('token');
  } else {
    AuthorizationToken.value = userInfo.token;
  }
  

  const expense = ref(null as number | null);
  const reqTime= ref([]);
  const ticketFee = ref('');
  const reqData = ref({
    type: null as number | null,
    title: '',
    url: '',
    tag: '',
    content: '',
    entityType: null as number | null,
    sellType: null as number | null,
    sellAmount: null as number | null,
    cover: '',
    coverDescription: '',
    address: '',
    fullAddress: '',
    isOnChain: 1,
    entityQuantity: null as number | null,
    description: []
  });


  // 判断点击弹框外关闭弹框
  const currentDropdown = ref<string | null>(null);
  const toggleDropdown = (dropdownName: string) => {
    currentDropdown.value = currentDropdown.value === dropdownName ? null : dropdownName;
    document.addEventListener('click', handleClickOutside);
    
  };
  const handleClickOutside = () => {
    currentDropdown.value = null;
    findSellAmountFun();
  };
  /*******************************/

  // 作品属性： 1 虚拟 2 实物 3 虚拟+实物
  const isNoOff = ref(null as number | null);
  const isEntityQuantity = ref(false);
  const statsList = ref([
    {
      label: '虚拟',
      value: 1,
    },
    {
      label: '实物',
      value: 2,
    },
    {
      label: '虚拟+实物',
      value: 3,
    }
  ]);
  const findStatsFun = (index: number) => {
    isNoOff.value = index;
    reqData.value.entityType = index;
    if(index !== 1){
      isEntityQuantity.value = true;
    } else {
      isEntityQuantity.value = false;
    }
  };


  // 商业拓展： 1.付费观看(币/次) 2终身版权 3二次创作权
  const isSellNoOff = ref(null as number | null);
  const isSellType = ref(false);
  const sellTypeList = ref([
    {
      label: '付费观看',
      value: 1,
    },
    {
      label: '二次创作权',
      value: 3,
    },
    {
      label: '终身版权',
      value: 2,
    }
  ]);
  const findSellTypeFun = (index: number) => {
    isSellNoOff.value = index;
    reqData.value.sellType = index;
    // if(index !== 1){
      isSellType.value = true;
    // } else {
    //   isSellType.value = false;
    // }
  };

  // 金额为空的时候，表示免费
  const findSellAmountFun = () => {
    let amount = reqData.value.sellAmount || null; 
    if(amount === null){
      reqData.value.sellType = 0;
      isSellNoOff.value = 0;
      reqData.value.sellAmount = null;
    }
    if(isSellNoOff.value == 0){
      reqData.value.sellAmount = null;
    }
  };

  //获取上传的封面图
  const findGetImageUrlFun = (urls: string[]) => {
    console.log('上传的图片文件', urls);
    reqData.value.cover = urls[0];
  };


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
  }

  // 获取选项卡切换

  const tabData= ref();
  const handleFileUpload = (fileData: { title: string, content: string, fileType: string, file: Array<T> }) => {
    console.log('File Uploaded父页面接收选项卡的数据', fileData);
    tabData.value = fileData;
    // 作品类型： 1 video视频类 2 picture图片类 3 voice语音类 4 text文字类
      let types = null;
      if(fileData.fileType === '视频类') { types = 1 }
      if(fileData.fileType === '图片类') { types = 2 }
      if(fileData.fileType === '语音类') { types = 3 }
      if(fileData.fileType === '文字类') { types = 4 }
      reqData.value.title = fileData.title;
      reqData.value.type = types;
      reqData.value.url = (fileData.file).join(',');
      if(types == 4) {
        reqData.value.content = fileData.content;
      }
  };

  // 介绍 	介绍类型：类型：1文本 2图片 3语音 4视频

  const contents = ref<{ type: string; data: any }[]>([]);
  const getData = () => {
    console.log('Submitted contents:', contents.value);
    // 你可以在这里处理提交的内容
    let attr: any = [];
    contents.value.forEach(v => {
      let types = '';
      if(v.type === 'text') { types = '1' }
      if(v.type === 'image') { types = '2' }
      if(v.type === 'audio') { types = '3' }
      if(v.type === 'video') { types = '4' }
      attr.push({
        type: types,
        content: v.data
      })
    });
    if (reqTime.value.length > 0) {
      reqData.value.startTime = reqTime.value[0];
      reqData.value.endTime = reqTime.value[1];
    }
    reqData.value.ticketFee = ticketFee.value ? Number(ticketFee.value) : 0;

    reqData.value.entityQuantity = reqData.value.entityQuantity || 1;
    reqData.value.sellAmount = reqData.value.sellAmount || 0;

    reqData.value.description = attr;



    let resData = reqData.value;
    
    return resData;
  };

  // 保存草稿
  const submitDraft = () => {
    let resData = getData();
    console.log('获取到的所有数据', resData);
    publishStore.worksInfo.data = resData;
    setItem('work', resData);
    console.log('publishStore', publishStore.worksInfo)
  };

  // 计算链上手续费
  const isExpense = ref(false);
  const changeTicketAmount = () => {
    console.log('计算链上手续费');
    isExpense.value = true;
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

  // 发布作品
  const state = reactive({
    uploadStatus: {} as Record<string, boolean>,
    totalUploads: 0, // 总的上传任务数量
    completedUploads: 0, // 已完成的上传任务数量
  });

  
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
      let attr = [];
      for (const [index, file] of uploadStore.mainFiles.entries()) {
        const mainResult = await uploadFileToCOS(file, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
        console.log('mainResult', mainResult);
        console.log('index', index);
        attr.push(`https://${mainResult.data.Location}`)
        reqData.value.url = attr.join(',');
        if (!mainResult.success) throw mainResult.error;
      };

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


  const submitContents = async () => {
    submitWork();
  };

  const isUnll = ref(true);
  const tagEr = ref(false);
  const typeEr = ref(false);
  const titleEr = ref(false);
  const urlEr = ref(false);
  const contentEr = ref(false);
  const entityTypeEr = ref(false);
  const sellTypeEr = ref(false);
  const sellAmountEr = ref(false);
  const coverEr = ref(false);
  const coverDescriptionEr = ref(false);
  const addressEr = ref(false);
  const fullAddressEr = ref(false);
  const isOnChainEr = ref(false);
  const entityQuantityEr = ref(false);
  const descriptionEr = ref(false);

  const submitWork = () => {
    let resData = getData();
    console.log('resDataresData562', resData);

    // 检查对象中的每个键值对
    for (const key in resData) {
      if (resData.hasOwnProperty(key)) {
        console.log('resData.key', resData[key]);
        const value = resData[key];

        // 作品属性： 1 虚拟 2 实物 3 虚拟+实物
        if (key === 'entityType') {
          if (value == 1) {
            entityTypeEr.value = false;
          } else if(value == 2 && value == 3) {
            let entityQuantity = resData.entityQuantity || 0
            if(entityQuantity < 1) {
              entityTypeEr.value = true;
              isUnll.value = false;
            } else {
              entityTypeEr.value = false;
            }
          } else {
            entityTypeEr.value = true;
            isUnll.value = false;
          }
        }
        // 商业拓展：0.免费 1.付费观看 2终身版权 3二次创作权
        if (key === 'sellType') {
          if (value == 0) {
            sellTypeEr.value = false;
          } else if(value == 1 && value == 2 && value == 3) {
            let sellAmount = resData.sellAmount || 0
            if(sellAmount < 1) {
              sellTypeEr.value = true;
              isUnll.value = false;
            } else {
              sellTypeEr.value = false;
            }
          } else {
            sellTypeEr.value = false;
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

        if(key !== 'content') {
          if(resData.type !== 4){
            isUnll.value = true;
          } else {
            if(value === ''){
              isUnll.value = false;
            } else {
              isUnll.value = true;
            }
          }
        }

        if (value === '' || value === null || value === undefined) {
          console.log(`键 ${key} 的值为空`);

          switch (key) {
            case 'type':
              typeEr.value = true;
              break;
            case 'title':
              titleEr.value = true;
              break;
            case 'tag':
              tagEr.value = true;
              break;
            case 'url':
              urlEr.value = true;
              break;
            case 'entityType':
              entityTypeEr.value = true;
              break;
            case 'sellType':
              sellTypeEr.value = true;
              break;
            case 'sellAmount':
              sellAmountEr.value = true;
              break;
            case 'cover':
              coverEr.value = true;
              break;
            case 'coverDescription':
              coverDescriptionEr.value = true;
              break;
            case 'address':
              addressEr.value = true;
              break;
            case 'fullAddress':
              fullAddressEr.value = true;
              break;
            case 'isOnChain':
              isOnChainEr.value = true;
              break;
            case 'entityQuantity':
              entityQuantityEr.value = true;
              break;
            default:
              break;
          }
          if(key !== 'content') {
            if(resData.type !== 4)
            isUnll.value = true;
          } else {
            isUnll.value = false;
          }
        } else {
          switch (key) {
            case 'type':
              typeEr.value = false;
              break;
            case 'title':
              titleEr.value = false;
              break;
            case 'tag':
              tagEr.value = false;
              break;
            case 'url':
              urlEr.value = false;
              break;
            case 'entityType':
              entityTypeEr.value = false;
              break;
            case 'sellType':
              sellTypeEr.value = false;
              break;
            case 'sellAmount':
              sellAmountEr.value = false;
              break;
            case 'cover':
              coverEr.value = false;
              break;
            case 'coverDescription':
              coverDescriptionEr.value = false;
              break;
            case 'address':
              addressEr.value = false;
              break;
            case 'fullAddress':
              fullAddressEr.value = false;
              break;
            case 'isOnChain':
              isOnChainEr.value = false;
              break;
            case 'entityQuantity':
              entityQuantityEr.value = false;
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
        worksPublish(resData).then((response: any) => {
          const { code, data, message } = response;
          
          const resultData = data;
          if (code !== 200) {
            showPopup(message, 'error', 3000);
              return;
          }
          
          publishStore.worksInfo.data = {};
          setItem('work', {});
          resolve()
        }).catch((error: any) => {
            reject(error)
        })
      })
    }
  };


  onMounted(() => {
    if(!isEmptyObject(publishStore.questInfo.data)) {
      reqData.value = publishStore.questInfo.data; // 有值
    } else {
      if(getItem('work') !== null) {
        reqData.value = getItem('work'); // 有值
      }
    }
    reqData.value.isOnChain = reqData.value.isOnChain ?? 1;
  })
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<style lang='scss' scoped>
  @use '@/assets/styles/publishTheWork.scss';
  
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
