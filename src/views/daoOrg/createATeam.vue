<template>
  <div class="createATeam">
    <div class="createATeam-header">
      <persHeader />
    </div>
    <div class="overlay"></div>
    <div class="createATeam-main">
      <div class="createATeam-main-concent">
        <div class="page-head">
          <div class="page-head-icon">
            <i class="icon font_family icon-tuanduichengyuan24"></i>
          </div>
          <div class="page-head-name">创建团队</div>
        </div>
        <div class="page-content">
          <div class="page-content-main">
            <div class="page-content-main-top">
              <div class="main-top-l">
                <div class="item-main mat-0 height-100">
                  <div class="item-main-desc">
                    <div class="item-main-desc-l-m">
                      <div class="item-main-desc-l-m-icon" :class="{ focused: coverEr }">
                        <template v-if="defaultCover !== '' || defaultCover == null">
                          <div class="cover-img">
                            <img :src="defaultCover" alt="" />
                            <div class="cover-del" @click="removeCover">
                              <div class="close-button-icon">
                                <i class="icon font_family icon-guanbi24"></i>
                              </div>
                            </div>
                            <div class="cover-option">
                              <div class="cover-option-btn">查看</div>
                              <div class="cover-option-split"></div>
                              <div class="cover-option-btn">
                                <div class="replace-text">替换</div>
                                <div class="replace-upload">
                                  <el-upload
                                    ref="uploadRef"
                                    class="upload-demo"
                                    action=""
                                    :auto-upload="false"
                                    :show-file-list="false"
                                    drag
                                    :limit="1"
                                    accept="image/*"
                                    :on-change="handleImageChange"
                                  ></el-upload>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <el-upload
                            ref="uploadRef"
                            class="upload-demo"
                            action=""
                            :auto-upload="false"
                            :show-file-list="false"
                            drag
                            :limit="1"
                            accept="image/*"
                            :on-change="handleImageChange"
                          >
                          <div class="upload-main">
                            <div class="upload-main-icon">
                              <div class="icon-main-bg">
                                <i class="icon font_family icon-jiahaowubeijing20"></i>
                              </div>
                            </div>
                            <div class="upload-main-text">上传团队封面图</div>
                            <div class="upload-main-title">建议最小宽度为 800 像素，文件最大10MB</div>
                          </div>
                          </el-upload>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="main-top-r">
                <div class="item-main">
                  <div class="item-main-flex">
                    <div class="item-main-flex-main" :class="{ focused: nameEr }">
                      <div class="item-main-flex-head">
                        <div class="head-main">
                          <div class="item-main-icon">
                            <i class="icon font_family icon-renwumingcheng"></i>
                          </div>
                          <div class="item-main-name">团队名称</div>
                        </div>
                      </div>
                      <div class="item-main-content">
                        <div class="item-main-time">
                          <div class="item-main-time-group" >
                            <div class="item-main-slider">
                              <div class="item-main-slider-num">
                                <input
                                  type="text" 
                                  v-model="reqData.name" 
                                  maxlength="64"
                                  @blur="verifyForm('name')"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-main">
                  <div class="item-main-flex">
                    <div class="item-main-flex-main">
                      <div class="item-main-flex-head">
                        <div class="head-main">
                          <div class="item-main-icon">
                            <i class="icon font_family icon-hangyeleixing24"></i>
                          </div>
                          <div class="item-main-name">所属行业</div>
                        </div>
                      </div>
                      <div class="item-main-content">
                        <div class="item-main-time">
                          <div class="item-main-time-group" >
                            <div class="item-main-slider">
                              <div class="item-main-slider-num">
                                <input
                                  type="text" 
                                  v-model="reqData.categoryName" 
                                  maxlength="64"
                                  disabled
                                  @blur="verifyForm('name')"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-main">
                  <div class="item-main-flex">
                    <div class="item-main-flex-main" :class="{ focused: passRateEr }">
                      <div class="item-main-flex-head">
                        <div class="head-main">
                          <div class="item-main-icon">
                            <i class="icon font_family icon-xinren24"></i>
                          </div>
                          <div class="item-main-name">投票通过率</div>
                        </div>
                      </div>
                      <div class="item-main-content">
                        <div class="item-main-time-group-input">
                          <div class="item-main-time-group-input-num">
                            <input 
                              type="text"
                              v-model.number="reqData.passRate" 
                              placeholder="" 
                              maxlength="9"
                              @input="handleInput"
                              @blur="verifyForm('trustValue')"
                            />
                          </div>
                          <div class="item-main-time-group-input-unit">%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-main">
                  <div class="item-main-flex">
                    <div class="item-main-flex-main" :class="{ focused: votePeriodEr }">
                      <div class="item-main-flex-head">
                        <div class="head-main">
                          <div class="item-main-icon">
                            <i class="icon font_family icon-xinren24"></i>
                          </div>
                          <div class="item-main-name">投票周期</div>
                        </div>
                      </div>
                      <div class="item-main-content">
                        <div class="item-main-time-group-input">
                          <div class="item-main-time-group-input-num">
                            <input 
                              type="text"
                              v-model.number="reqData.votePeriod" 
                              placeholder="" 
                              maxlength="9"
                              @input="handleVotePeriodInput"
                              @blur="verifyForm('trustValue')"
                            />
                          </div>
                          <div class="item-main-time-group-input-unit">天</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-main">
                  <div class="item-main-perm textarea_title_bg">
                    <div class="item-main-perm-content" :class="{ focused: targetEr }">
                      <div class="item-main-perm-top">
                        <div class="item-main-icon">
                          <i class="icon font_family icon-mubiao24"></i>
                        </div>
                        <div class="item-main-perm-name">团队目标</div>
                      </div>
                      <div class="item-main-content">
                        <TextareaWithCounter 
                          v-model="reqData.target" 
                          :placeholder="'请输入团队目标'" 
                          :maxLength="100" 
                          @blur="verifyForm('competencyRequirement')"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="page-content-main-bott">
              <div class="introduce-container" :class="{ focused: descriptionEr }">
                <div class="introduce-head">
                  <div class="introduce-head-main">
                    <div class="introduce-head-main-left">
                      <div class="introduce-head-main-left-flex">
                        <div class="introduce-head-main-left-icon">
                          <i class="icon font_family icon-xuanyan24"></i>
                        </div>
                        <div class="introduce-head-main-left-name">团队宣言</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="introduce-content">
                  <TextareaWithCounter 
                    v-model="reqData.description" 
                    :placeholder="'请输入团队宣言'" 
                    :maxLength="200" 
                    @blur="verifyForm('competencyRequirement')"
                  />
                  <div class="data-from-remember">
                    <div class="data-from-remember-main">
                        <div class="remember-checkbox">
                            <i 
                                class="icon font_family" 
                                :class="isAgree ? 'icon-weixuanzebiankuangzhengfangxing24' : 'icon-yixuanzebiankuangzhengfangxing24'"
                                @click="checkboxHandler"
                            >
                            </i>
                        </div>
                        <div class="remember-tips">阅读并同意<span @click="findisPrivacyFun">《团队组织公约》</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="submitTheRelease">
        <div class="submitTheRelease-main">
          <div class="draft" @click="uploadToCOS(1)">
            <div class="draft-main">保存</div>
          </div>
          <div class="publish" @click="ispostTask = true">
            <div class="publish-main">立即创建</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="popupModal" v-if="ispostTask">
      <div class="masking"></div>
      <div class="popupModal-center">
          <div class="popupModal-main">
            <div class="popupModal-module"></div>
            <div class="popupModal-main-content">
              <div class="popupModal-main-title">发布确认</div>
              <div class="popupModal-main-tips">是否确认创建内容</div>
              <div class="popupModal-main-but-group">
                <div class="popupModal-main-but close_relievoShadow" @click="ispostTask = false">取消</div>
                <div class="popupModal-main-but relievoShadow" @click="uploadToCOS(2)">确定</div>
              </div>
            </div>
          </div>
          <div class="close" @click="isPayType = false">
              <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
          </div>
      </div>
    </div>

    <PayBg :payData="payData" @close="closePayModal" v-if="payData.isPay" @button-click="pointsDeduction" />
    
    <div class="popupModal" v-if="isPayType">
      <div class="masking"></div>
      <div class="popupModal-center">
          <div class="popupModal-main">
            <div class="popupModal-module"></div>
            <div class="popupModal-main-content">
              <div class="popupModal-main-title">订单明细</div>
              <div class="popupModal-main-compAmt">
                <div class="compAmt-name">手续费</div>
                <div class="compAmt-val">¥{{ expense }}</div>
              </div>
              <div class="popupModal-main-compAmt">
                <div class="compAmt-name">NFT费用</div>
                <div class="compAmt-val">¥{{ createNftFee }}</div>
              </div>
              <div class="popupModal-item-content" v-if="isPointOpen == 1">
                <div class="item-content-icon" @click="isIntegral = !isIntegral">
                  <i 
                    class="icon font_family"
                    :class="isIntegral ? 'icon-gouxuanyuanxingbiankuang24' : 'icon-weigouxuanyuanxingbiankuang24'"
                  ></i>
                </div>
                <div class="item-content-txt">{{ Number(expense) + Number(createNftFee) }}积分可抵NFT费用{{ Number(expense) + Number(createNftFee) }}元（可用积分{{ integralBalance }}）</div>
              </div>
              <div class="item-content-reward">
                <div class="item-content-reward-name">订单总费用</div>
                <div class="item-content-reward-val">
                  <template v-if="isIntegral">¥{{ (Number(expense) + Number(createNftFee)) - (Number(expense) + Number(createNftFee)) }}</template>
                  <template v-else>¥{{ Number(expense) + Number(createNftFee) }}</template>
                </div>
              </div>
              <div class="popupModal-main-but-group">
                <template v-if="isIntegral">
                  <div class="popupModal-main-but relievoShadow" @click="findPayWithPointsFun">
                    <div class="exhibit-publish-main">
                      <div class="exhibit-publish-name">立即支付</div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="popupModal-main-but relievoShadow" @click="findAggregatePayFun">
                    <div class="exhibit-publish-main">
                      <div class="exhibit-publish-name">立即支付</div>
                    </div>
                  </div>
                </template>
              </div>
              <!-- <div class="popupModal-main-title">请选择支付方式！</div>
              <div class="popupModal-main-tips">积分支付限时开启，积分可用于抵扣手续费！</div>
              <div class="popupModal-main-but-group">
                <div class="popupModal-main-but ae-btn" @click="findAggregatePayFun">聚合支付</div>
                <div class="popupModal-main-but ae-btn" v-if="isPointOpen == 1" @click="findPayWithPointsFun">积分支付</div>
              </div> -->
            </div>
          </div>
          <!-- <div class="close" @click="isPayType = false">
              <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
          </div> -->
      </div>
    </div>
    
    <ImageCropper 
      :cropperImg="cropperImg" 
      :type= "clippingType"
      :fileName="cropperImgName" 
      v-if="isCropperAvatar" 
      :isShow="isCropperAvatar" 
      @close="handleClose"
      :on-upload-success="handleCropperSuccess"
      :aspectRatio="[3, 4]"
    />
    <Convention
        v-if="isConventionVisible"
        @update:content="updateConvention"
        @close="closeConvention"
    />
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElUpload } from 'element-plus';
  import persHeader from '@/components/header/persHeader.vue';
  import Convention from '@/components/policy/convention/index.vue';
  import PayBg from '@/components/pay/index.vue';
  import { upChainPoundages, pointIsOpen, orderSave, orderQuery, chainBalance } from '@/api/pay';
  import { setMissionsDraft, getMissionsDraft } from '@/api/task';
  import { filesCos, categoryGet } from '@/api/common';
  import { uploadFileToCOS } from '@/services/uploadService';
  import { useUploadStore } from '@/stores/uploadStore';
  import { aePublishStore } from '@/stores/publish';
  import { aeUseStore } from '@/stores/user';
  import { setItem, getItem, isNumeric, computeHmac, extractIdFromUrl } from '@/utils/index';
  import { showPopup } from '@/utils/usePopup';
  import { FILENAMELENGTH } from '@/utils/common';
  import ImageCropper from '@/components/tailor/ImageCropper.vue';
  import TextareaWithCounter from '@/components/TextareaWithCounter/index.vue';

  const router = useRouter();
  const userStore = aeUseStore();
  const publishStore = aePublishStore();
  const userInfo = userStore.getUserInfo;
  const ispostTask = ref(false);
  const isAgree = ref(true);
  const sbumitData = ref({});
  const isIntegral = ref(false); // 是否选择积分支付

  const AuthorizationToken = ref('');
  if( userInfo.token == ''){
    AuthorizationToken.value = getItem('token');
  } else {
    AuthorizationToken.value = userInfo.token;
  }
  
  const expense = ref(0);
  const isDraft = ref(2); // 1草稿，2发布
  const reqData = ref({
    cover: '',
    name: '',
    categoryId: userInfo.categoryId,
    categoryName: userInfo.categoryName,
    passRate: '',
    votePeriod: null as number | null,
    description: '',
    target: '',
    missionId: '',
    isAgreeContract: 0
  });
  const leavePage = ref(2); // 1:发布成功离开页面，2：非正常离开页面

  const clippingType = '2'; // 是否裁剪
  const isCropperAvatar = ref(false); // 是否显示裁剪图片弹窗
  const cropperImg = ref<string | ArrayBuffer | null>(null); // 裁剪图片
  const cropperImgName = ref(''); // 裁剪图片名称
  const defaultCover = ref(''); // 裁剪后的默认展示图片
  
  const resetReqData = () => {
    reqData.value = {
      cover: '',
      name: '',
      categoryId: '',
      categoryName: '',
      passRate: '',
      votePeriod: null as number | null,
      description: '',
      target: '',
      missionId: '',
      isAgreeContract: 0
    };
  };

  // 获取从草稿列表传参过来的草稿id详情
  const getTaskDraft = () => {
    const resData = {
      id: userInfo.taskDraftId
    }
    return new Promise<void>((resolve, reject) => {
      getMissionsDraft(resData).then((response: any) => {
        const { code, data, message } = response;
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        console.log('0000000000000', resultData)
        let attr: any = [];
        if(resultData.description.length > 0) {
          resultData.description.forEach(v => {
            let types = '';
            if(v.type == '1') { types = 'text' }
            if(v.type == '2') { types = 'image' }
            if(v.type == '3') { types = 'audio' }
            if(v.type == '4') { types = 'video' }
            if(v.content !== '' && v.content !== undefined && v.content !== null) {
              attr.push({
                type: types,
                content: v.content
              })
            }
          });
        }
        resultData.description = attr;
        defaultCover.value = resultData.cover;
        contents.value = resultData.description;
        reqData.value = resultData;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

  // 控制投票通过率只能输入0-100
  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();

    // 防止XSS攻击
    if (!/^\d*$/.test(value)) {
      showPopup('请输入有效的数字！', 'error', 3000);
      return;
    }

    const numValue = Number(value);

    if (Number.isNaN(numValue)) {
      reqData.value.passRate = null;
    } else if (numValue >= 0 && numValue <= 100) {
      reqData.value.passRate = numValue;
    } else {
      showPopup('请输入0到100之间的数字！', 'error', 3000);
      // 统一处理边界条件
      reqData.value.passRate = Math.max(0, Math.min(100, numValue));
    }
  };

  // 投票周期只能输入数字
  const handleVotePeriodInput = (event: any) => {
    reqData.value.votePeriod = isNumeric(event.target.value);
    if( reqData.value.votePeriod < 1 ) {
      reqData.value.votePeriod = null;
    }
  }

  const getData = () => {
      let setData = reqData.value; 
      setData.missionId = userInfo.missionId;
      setData.taskPeriod = 3;
      setData.votePeriod = Number(setData.votePeriod);
      return setData;
  };

  const checkboxHandler = () => {
    if (isAgree.value) {
        isAgree.value = false;
        reqData.value.isAgreeContract = 1;
    } else {
        isAgree.value = true;
        reqData.value.isAgreeContract = 0;
    }
  }

  // 查看组织公约
  const isConventionVisible = ref(false);

  // 打开组织公约
  const findisPrivacyFun = () => {
      isConventionVisible.value = true;
  };

  // 同意组织公约
  const updateConvention = () => {
      isAgree.value = false;
      reqData.value.isAgreeContract = 1;
      isConventionVisible.value = false;
  }

  // 关闭组织公约
  const closeConvention = () => {
      isAgree.value = true;
      reqData.value.isAgreeContract = 0;
      isConventionVisible.value = false;
  };

  // 判断点击弹框外关闭弹框
  const currentDropdown = ref<string | null>(null);
  const toggleDropdown = (dropdownName: string) => {
    currentDropdown.value = currentDropdown.value === dropdownName ? null : dropdownName;
    console.log('currentDropdown.value1', currentDropdown.value);
    document.addEventListener('click', handleClickOutside);
    
  };
  const handleClickOutside = () => {
    currentDropdown.value = null;
  };

  // 发布任务
  const isUnll = ref(true); // 提交按钮是否禁用
  const isPayType = ref(false); // 是否显示支付方式
  const isPayTypeShow = ref(false); // 是否显示积分支付
  const nameEr = ref(false);
  const coverEr = ref(false);
  const targetEr = ref(false);
  const passRateEr = ref(false);
  const votePeriodEr = ref(false);
  const isAgreeContractEr = ref(false);
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
  const uploadToCOS = async (index: number) => {
    isDraft.value = index;
    ispostTask.value = false;
    let resData = {};
    await findChainBalanceFun();
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

        // 所有文件上传成功后，执行发布操作
        submitContents();
        // 清空上传状态
        uploadStore.clearAllFiles();

      } catch (error) {
        console.error('发布失败：', error);
        showPopup('发布失败，请重试！', 'error', 3000);
      } finally {
        isPublishing.value = false;
      }
  };


  const submitContents = () => {
    let resData = getData();
    isUnll.value = true;
    
    // 根据是否保存草稿进行判断， 1草稿，2发布
    if(isDraft.value == 1) {
      submitDraft(resData);
      return;
    }

    // 检查对象中的每个键值对
    for (const key in resData) {
      if (key === 'id') {
        continue;
      }
      if (key === 'categoryId') {
        continue;
      }
      if (key === 'categoryName') {
        continue;
      }
      if (resData.hasOwnProperty(key)) {
          console.log('resData.key', resData[key]);
          const value = resData[key];
          if (value === '' || value === null || value === undefined) {
            console.log(`键 ${key} 的值为空`);
            switch (key) {
                case 'cover':
                    coverEr.value = true;
                break;
                case 'name':
                    nameEr.value = true;
                break;
                case 'passRate':
                    passRateEr.value = true;
                break;
                case 'votePeriod':
                    votePeriodEr.value = true;
                break;
                case 'description':
                    descriptionEr.value = true;
                break;
                case 'target':
                    targetEr.value = true;
                break;
                case 'isAgreeContract':
                  isAgreeContractEr.value = true;
                break;
                default:
                break;
            }
            isUnll.value = false;
          } else {
          switch (key) {
            case 'cover':
                  coverEr.value = false;
              break;
              case 'name':
                  nameEr.value = false;
              break;
              case 'passRate':
                  passRateEr.value = false;
              break;
              case 'votePeriod':
                  votePeriodEr.value = false;
              break;
              case 'description':
                  descriptionEr.value = false;
              break;
              case 'target':
                  targetEr.value = false;
              break;
              case 'isAgreeContract':
                isAgreeContractEr.value = false;
              break;
              default:
              break;
          }
        }
      }
    }
    console.log('isUnll.value', isUnll.value)
    if(!isUnll.value){
      showPopup('您还有未填的信息！', 'error', 3000);
      return false;
    } else {
      sbumitData.value = resData;
      isPayType.value = true;
      payData.value.payAmount = Number(expense.value) + Number(createNftFee.value);
    }
  };

  // 保存草稿
  const submitDraft = (data: any) => {
    const resData = data;
    return new Promise<void>((resolve, reject) => {
      setMissionsDraft(resData).then((response: any) => {
        const { code, data, message } = response;
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        showPopup('保存草稿成功！', 'success', 3000);
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };


  // 聚合支付
  const findAggregatePayFun = () => {
    isPayType.value = false;
    payData.value.type = 1;
    payFee(3, 6, sbumitData.value);
  }

  // 积分支付
  const findPayWithPointsFun = () => {
    isPayType.value = false;
    payData.value.type = 2;
    payData.value.poundage = 0;
    payData.value.mps = 0;
    payData.value.isPay = true;
  }
  // 积分支付-立即支付
  const pointsDeduction = () => {
    payData.value.poundage = 0;
    payData.value.mps = 0;
    payFee(3, 5, sbumitData.value);
  };


  // 查询积分余额
  const integralBalance = ref(0);
  const findChainBalanceFun = () => {
    // type 1积分 2支付
    let reqData = {
      type: 1
    }
    return new Promise<void>((resolve, reject) => {
      chainBalance(reqData).then((response: any) => {
        const { code, data, message } = response;
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        
        integralBalance.value = resultData;
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
    clearTimeout(timer);
    payData.value.isPay = false;
  }

  // 计算链上手续费
  const createNftFee = ref(0); // 创建nft费用
  const findupChainPoundage = () => {
      let resData = {
      type: 1
      };
      return new Promise<void>((resolve, reject) => {
      upChainPoundages(resData).then((response: any) => {
          const { code, data, message } = response;
          
          const resultData = data;
          if (code !== 200) {
              showPopup(message, 'error', 3000);
              return;
          }
          
          expense.value = resultData.upChainPoundage;
          createNftFee.value = resultData.createNftFee;
          resolve()
      }).catch((error: any) => {
          reject(error)
      })
      })
  }

  // 判断是否开启显示积分支付，开启的话显示积分支付和聚合支付按钮，不开启则直接显示聚合支付二维码
  const isPointOpen = ref(0); // 0 关闭，1 开启
  const findPointIsOpenFun = () => {
    return new Promise<void>((resolve, reject) => {
      pointIsOpen({}).then((response: any) => {
        const { code, data, message } = response;
        
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        
        isPointOpen.value = resultData;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  }

  // 创建支付订单
  const orderNo = ref(''); // 订单号
  const payFee = (type: number, payType: number, daoData: any) => {
    let timestamp = Date.now();
    let content = type + '0' + expense.value + timestamp;
    content = payType+''+createNftFee.value+expense.value+timestamp;
    let userId = '';
    if(userStore.userInfo.id !== '') {
      userId = userStore.userInfo.id;
    } else {
      userId = getItem('id');
    }
    
    let reqData = {
        businessData: daoData,
        businessType: payType,
        amount: createNftFee.value,
        poundage: expense.value,
        timeStamp: timestamp,
        sign: computeHmac(content.toString(), userId.toString())
    };

    return new Promise<void>((resolve, reject) => {
      orderSave(reqData).then((response: any) => {
        const { code, data, message } = response;
        
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        payData.value.minute = resultData.minute;
        payData.value.createTime = resultData.createTime;
        if(payType == 5) {
            let id = data.daoId;
            userInfo.daoType = 1;
            setItem('daoType', 1);
            router.push({ name: 'DaoDetails', params: { id } });
        } else {
            
            orderNo.value = resultData.orderNo;
            payData.value.payUrl = resultData.qrcode;
            payData.value.isPay = true;
            findOrderResult();
        }
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
    
  }

  // 查询订单结果
  const isActive = ref(true); // 使用 ref 存储活动状态
  let timer: number | undefined; // 定义定时器变量
  const findOrderResult = async () => {
    const getData = { orderNo: orderNo.value };

    const retry = async () => {
      if (!isActive.value) return; // 如果活动状态为 false，退出重试

      try {
        const response = await orderQuery(getData);
        const { code, data, message } = response;

        if (code === 200) {
          if (data.orderStatus == 2) {
            showPopup(message, 'success', 3000);
            resetReqData(); // 重置数据
            setItem('createATeam', findClearDraft());
            console.log('getItem("createATeam")', getItem('createATeam'))
            publishStore.questInfo.data = {};
            payData.value.isPay = false;
            clearTimeout(timer);
            isActive.value = false;
            let id = data.businessId;
            userInfo.taskType = 1;
            setItem('taskType', 1);
            leavePage.value = 1;
            router.push({ name: 'TataskDetails', params: { id } });
          } else if (data.orderStatus == 4) {
            showPopup(message, 'error', 3000);
            payData.value.isPay = false;
            clearTimeout(timer);
            isActive.value = false;
          } else if (data.orderStatus == 7) {
            showPopup('订单已关闭', 'error', 3000);
            payData.value.isPay = false;
            clearTimeout(timer);
            isActive.value = false;
          } else {
            timer = setTimeout(retry, 10000); // 继续重试
          }
        } else if(code === 500) {
              showPopup(message, 'error', 3000);
              return false;
        } else {
          showPopup(message, 'error', 3000);
          timer = setTimeout(retry, 10000); // 继续重试
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        timer = setTimeout(retry, 10000); // 继续重试
      }
    };

    retry();
  };

  const findClearDraft = () => {
    let reqData = {
      cover: '',
      name: '',
      categoryId: '',
      categoryName: '',
      passRate: '',
      votePeriod: null as number | null,
      description: '',
      target: '',
      missionId: '',
      isAgreeContract: 0
    }
    return reqData;
  }

  /**
   * 封面裁剪
   * **/
  // 上传图片
  const handleImageChange = (file) => {
    const reader = new FileReader();
    const isJPG = file.raw.type === 'image/jpeg';
    const isPNG = file.raw.type === 'image/png';
    if (!isJPG && !isPNG) {
        showPopup('只能上传jpg/png文件', 'error', 3000);
        clearUploadFiles();
        return false;
    }
    const nameSize = file.name.length;
    if(nameSize > FILENAMELENGTH) {
      showPopup('文件名称过长，请修改后再进行上传，谢谢！', 'error', 3000);
      clearUploadFiles();
      return false;
    }
    // 检查文件大小
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        showPopup('图片大小不能超过10M', 'error', 3000);
        clearUploadFiles();
        return false;
    }
    console.log(reader, 'reader');
    reader.onload = (e) => {
      const target = e.target;
      if (target && typeof target.result === 'string') {
        cropperImg.value = target.result;
        cropperImgName.value = file.name;
        isCropperAvatar.value = true;
      }
    }
    reader.readAsDataURL(file.raw)
  }

  const handleCropperSuccess = (url: any) => {
      defaultCover.value = url;
      isCropperAvatar.value = false;
  };
  const uploadRef = ref<InstanceType<typeof ElUpload> | null>(null);
  const handleClose = () => {
    isCropperAvatar.value = false;
    cropperImg.value = null;
    cropperImgName.value = "";
    // 重置上传状态
    defaultCover.value = '';
    clearUploadFiles();
  };
  const clearUploadFiles = () => {
    // 清除 el-upload 的文件列表
    uploadRef.value.clearFiles();
  };
  const removeCover = () => {
    defaultCover.value = '';
    clearUploadFiles();
  };


  // 页面卸载时停止重试并清除定时器
  onBeforeUnmount(() => {
    isActive.value = false;
    if(leavePage.value !== 1) {
      let resData = getData();
      console.log('页面注销后缓存的resData', resData);
      setItem('createATeam', resData);
    }
    clearTimeout(timer);
  });

  // 在路由变化时停止重试并清除定时器
  router.beforeEach((to, from, next) => {
    isActive.value = false;
    clearTimeout(timer);
    next();
  });
  

  // 监听填的数据进行验证
  const verifyForm = (item: any) => {
    if (item == 'cover') {
      if(reqData.value.cover !== '') {
        coverEr.value = false;
      }
    }
    if (item == 'name') {
      if(reqData.value.name !== '') {
        nameEr.value = false;
      }
    }
    if (item == 'passRate') {
      if(reqData.value.passRate !== '') {
        passRateEr.value = false;
      }
    }
    if (item == 'votePeriod') {
      if(reqData.value.votePeriod !== '') {
        votePeriodEr.value = false;
      }
    }
    if (item == 'description') {
      if(reqData.value.description !== '') {
        descriptionEr.value = false;
      }
    }
    if (item == 'target') {
      if(reqData.value.target !== '') {
        targetEr.value = false;
      }
    }
    isUnll.value = true;
  }

  onMounted(() => {
    if(userInfo.opencreateATeamType == 1) {
      if(getItem('createATeam') !== null) {
        reqData.value = getItem('createATeam');
      } else {
        reqData.value = findClearDraft();
      }
      
    } else if(userInfo.opencreateATeamType == 2) {
      getTaskDraft(); // 获取任务草稿
    }
    
    findupChainPoundage(); // 计算链上手续费
    findPointIsOpenFun(); // 判断是否开启积分支付
  })
  
</script>

<style lang='scss' scoped>
  @use '@/assets/styles/common.scss';
  @use '@/assets/styles/createATeam.scss';
  @use '@/assets/styles/popupModal.scss';
</style>
