
<template>
  <div class="createATeam">
    <div class="createATeam-header">
      <persHeader />
    </div>
    <!-- {{ subTaskList }} -->
    <div class="overlay"></div>
    <div class="createATeam-main">
      <div class="createATeam-main-concent" ref="overlay">
        <div class="page-head">
          <template v-if="subTaskList.length <= 1">
            <div class="previous-icon">
              <div class="num-pad">
                <div class="previous-icon-num">
                  1
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div 
              class="subTask-item"
              v-for="(item, index) in subTaskList"
              :key="index"
              @click="echoSunTaskDetail(index)"
            >
              <div class="previous-icon">
                <div class="num-pad">
                  <div class="previous-icon-num" :class="{ flag: item.type == 1 }">
                    {{ index + 1 }}
                  </div>
                </div>
              </div>
              <div class="previous-spilt">-</div>
            </div>
          </template>
        </div>
        <div class="page-content">
          <div class="page-content-main">
            <div class="page-content-main-top">
              <div class="main-top-l">
                <div class="item-main">
                  <div class="item-main-flex">
                    <div class="item-main-flex-main" :class="{ focused: nameEr }">
                      <div class="item-main-flex-head">
                        <div class="head-main">
                          <div class="item-main-icon">
                            <i class="icon font_family icon-renwumingcheng"></i>
                          </div>
                          <div class="item-main-name">任务名称</div>
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
                  <div class="item-main-two">
                    <div class="item-main-two-l">
                      <div class="item-main-two-l-m" :class="{ focused: rewardEr }">
                        <div class="item-main-flex-head">
                          <div class="head-main">
                            <div class="item-main-icon">
                              <i class="icon font_family icon-feiyong24"></i>
                            </div>
                            <div class="item-main-name">任务报酬</div>
                          </div>
                        </div>
                        <div class="item-main-content">
                          <div class="item-main-time-group-input">
                            <div class="item-main-time-group-input-num">
                              <input 
                                type="text"
                                v-model.number="reqData.reward" 
                                placeholder=""
                                maxlength="7" 
                                @input="handleRewardInput"
                                @blur="verifyForm('reward')"
                              />
                            </div>
                            <div class="item-main-time-group-input-unit">元</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="item-main-two-r">
                      <div class="item-main-two-r-m" :class="{ focused: trustValueEr }">
                        <div class="item-main-flex-head">
                          <div class="head-main">
                            <div class="item-main-icon">
                              <i class="icon font_family icon-feiyong24"></i>
                            </div>
                            <div class="item-main-name">信任值要求</div>
                          </div>
                        </div>
                        <div class="item-main-content">
                          <div class="item-main-time-group-input">
                            <div class="item-main-time-group-input-num">
                              <input 
                                type="text"
                                v-model.number="reqData.trustValue" 
                                placeholder="输入0~100"
                                maxlength="3" 
                                @input="handleInput"
                                @blur="verifyForm('trustValue')"
                              />
                            </div>
                            <div class="item-main-time-group-input-unit"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-main">
                  <div class="item-main-two">
                    <div class="item-main-two-l">
                      <div class="item-main-two-l-m" :class="{ focused: dayEr }">
                        <div class="item-main-flex-head">
                          <div class="head-main">
                            <div class="item-main-icon">
                              <i class="icon font_family icon-rili24"></i>
                            </div>
                            <div class="item-main-name">任务时间</div>
                          </div>
                        </div>
                        <div class="item-main-content">
                          <div class="item-main-time-group-input">
                            <div class="item-main-time-group-input-num">
                              <input 
                                type="text"
                                v-model.number="reqData.day" 
                                placeholder=""
                                maxlength="7" 
                                @input="handleNumberInput('day', $event)"
                                @blur="verifyForm('day')"
                              />
                            </div>
                            <div class="item-main-time-group-input-unit">天</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="item-main-two-r">
                      <div class="item-main-two-r-m" :class="{ focused: nodeChangeTimesEr }">
                        <div class="item-main-flex-head">
                          <div class="head-main">
                            <div class="item-main-icon">
                              <i class="icon font_family icon-feiyong24"></i>
                            </div>
                            <div class="item-main-name">节点可改</div>
                          </div>
                        </div>
                        <div class="item-main-content">
                          <div class="item-main-time-group-input">
                            <div class="item-main-time-group-input-num">
                              <input 
                                type="text"
                                v-model.number="reqData.nodeChangeTimes" 
                                placeholder="0~2"
                                maxlength="1" 
                                @input="handleNodeChangeTimesInput"
                                @blur="verifyForm('nodeChangeTimes')"
                              />
                            </div>
                            <div class="item-main-time-group-input-unit">次</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-main">
                  <div class="item-main-two">
                    <div class="item-main-two-l">
                      <div class="item-main-two-l-m" :class="{ focused: nodePeriodEr }" @click.stop>
                        <div class="item-main-flex-head">
                          <div class="head-main">
                            <div class="item-main-icon">
                              <i class="icon font_family icon-rili24"></i>
                            </div>
                            <div class="item-main-name">单节点周期</div>
                          </div>
                        </div>
                        <div class="item-main-content">
                          <div class="item-main-time-group-input">
                            <div class="item-main-time-group-input-num" @click="toggleDropdown('modele1')">
                              <input 
                                type="text"
                                v-model.number="reqData.nodePeriod" 
                                placeholder=""
                                maxlength="3" 
                                @input="handleNumberInput('nodePeriod', $event)"
                                @blur="verifyForm('nodePeriod')"
                                
                              />
                            </div>
                            <div class="item-main-time-group-input-unit" @click.stop="toggleDropdown('modele1')">
                              <i 
                                class="icon font_family"
                                :class="currentDropdown === 'modele1' ? 'icon-a-jiantouxiangshangshousuo24' : 'icon-a-jiantouxiangxiazhankai24'"
                              >
                              </i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="item-main-pulldown-module dropdown" v-if="currentDropdown === 'modele1'" @click.stop>
                        <div class="module-content">
                          <div class="module-content-list">
                            <div class="tips">为了确保任务的明确性，建议您上传各节点的具体标准或要求。</div>
                            <div class="node-content overflowYAuto">
                              <div 
                                class= "node-item"
                                v-for="(item, index) in nodeList" 
                                :key="index"
                              >
                                <div class="node-item-name">
                                  <div class="node-item-name-main">
                                    <div :class="['node-icon', index === nodeList.length - 1 ? 'last-node-icon' : '']">
                                      <i class="icon font_family icon-rili24"></i>
                                    </div>
                                    <div class="node-txt">节点{{ item.sort }}</div>
                                  </div>
                                </div>
                                <div class="node-item-operation">
                                  <div class="operation-main">
                                    <template v-if="item.url !== ''">
                                      <div class="operation-but" @click="findSeeNodeUrlFun(item)">查看</div>
                                      <div class="operation-but" @click="findDelNodeUrlFun(index)">删除</div>
                                    </template>
                                    <template v-else>
                                      <div class="operation-but">
                                        <NodeFileUpload
                                          upload-type="*"
                                          :index="index"
                                          upload-name ='上传标准'
                                          :on-upload-success="findGetImageUrlFun"
                                        />
                                      </div>
                                    </template>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="item-main-two-r">
                      <div class="item-main-two-r-m" :class="{ focused: nodeChangeHourEr }">
                        <div class="item-main-flex-head">
                          <div class="head-main">
                            <div class="item-main-icon">
                              <i class="icon font_family icon-rili24"></i>
                            </div>
                            <div class="item-main-name">修改期限</div>
                          </div>
                        </div>
                        <div class="item-main-content">
                          <div class="item-main-time-group-input">
                            <div class="item-main-time-group-input-num">
                              <input 
                                type="text"
                                v-model.number="reqData.nodeChangeHour" 
                                placeholder=""
                                maxlength="3" 
                                @input="handleNumberInput('nodeChangeHour', $event)"
                                @blur="verifyForm('day')"
                              />
                            </div>
                            <div class="item-main-time-group-input-unit">时</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-main">
                  <div class="item-main-perm textarea_title_bg">
                    <div class="textarea_bg">
                      <div class="textarea_bg_t"></div>
                      <div class="textarea_bg_c"></div>
                      <div class="textarea_bg_b"></div>
                    </div>
                    <div class="item-main-perm-content" :class="{ focused: competencyRequirementEr }">
                      <div class="item-main-perm-top">
                        <div class="item-main-icon">
                          <i class="icon font_family icon-mubiao24"></i>
                        </div>
                        <div class="item-main-perm-name">能力要求</div>
                      </div>
                      <div class="item-main-content">
                        <TextareaWithCounter 
                          v-model="reqData.competencyRequirement" 
                          :placeholder="'请输入能力要求'" 
                          :maxLength="500" 
                          @blur="verifyForm('competencyRequirement')"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="main-top-r">
                <div class="item-main mat-0">
                  <div class="item-main-desc">
                    <div class="item-main-desc-l-m">
                      <div class="item-main-desc-l-m-icon" :class="{ focused: coverEr }">
                        <template v-if="reqData.cover !== '' || reqData.cover == null">
                          <div class="cover-img">
                            <img :src="reqData.cover" alt="" />
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
                            <div class="upload-main-text">上传子任务封面图</div>
                            <div class="upload-main-title">建议最小宽度为 800 像素，文件最大10MB</div>
                          </div>
                          </el-upload>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="page-content-main-bott">
              <div class="postATask_main_bottom" :class="{ focused: descriptionEr }">
                <ContentManager name="任务介绍" v-model:modelValue="contents" :isprevious="isOnce" />
                <div class="item-switch">
                  <div class="item-switch-main">
                    <div class="item-switch-main-title">任务是否紧急</div>
                    <div class="item-switch-main-switch">
                      <SwitchBut v-model="switchValue" /> 
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
          <div class="draft" @click="uploadToCOS(3)">
            <div class="draft-main">新增子任务</div>
          </div>
          <div class="draft" @click="uploadToCOS(1)">
            <div class="draft-main">存草稿</div>
          </div>
          <div class="publish" @click="ispostTask = true">
            <div class="publish-main">立即发布</div>
          </div>
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
              <div class="popupModal-item-content" v-if="isPointOpen == 1">
                <div class="item-content-icon" @click="isIntegral = !isIntegral">
                  <i 
                    class="icon font_family"
                    :class="isIntegral ? 'icon-gouxuanyuanxingbiankuang24' : 'icon-weigouxuanyuanxingbiankuang24'"
                  ></i>
                </div>
                <div class="item-content-txt">{{ expense }}积分可抵NFT费用{{ expense }}元（可用积分{{ integralBalance }}）</div>
              </div>
              <div class="item-content-reward">
                <div class="item-content-reward-name">订单总费用</div>
                <div class="item-content-reward-val">
                  <template v-if="isIntegral">¥{{ Number(expense) - Number(expense) }}</template>
                  <template v-else>¥{{ Number(expense) }}</template>
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
                <div class="popupModal-main-but ae-btn" @click="findAggregatePayFun">
                  <div class="exhibit-publish-main">
                    <div class="exhibit-publish-name">聚合支付</div>
                  </div>
                </div>
                <div class="popupModal-main-but ae-btn" v-if="isPointOpen == 1" @click="findPayWithPointsFun">
                  <div class="exhibit-publish-main">
                    <div class="exhibit-publish-name">积分支付</div>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
          <!-- <div class="close" @click="isPayType = false">
              <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
          </div> -->
      </div>
    </div>
    <!-- 发布确认 -->
    <div class="popupModal" v-if="ispostTask">
      <div class="masking"></div>
      <div class="popupModal-center">
          <div class="popupModal-main">
            <div class="popupModal-module"></div>
            <div class="popupModal-main-content">
              <div class="popupModal-main-title">发布确认</div>
              <div class="popupModal-main-tips">是否确认发布内容</div>
              <div class="popupModal-main-but-group">
                <div class="popupModal-main-but close_relievoShadow" @click="ispostTask = false">
                  <div class="exhibit-publish-main">
                    <div class="exhibit-publish-name">取消</div>
                  </div>
                </div>
                <div class="popupModal-main-but relievoShadow" @click="uploadToCOS(2)">
                  <div class="exhibit-publish-main">
                    <div class="exhibit-publish-name">确定</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="close" @click="isPayType = false">
              <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
          </div>
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
      :isprevious="isOnce"
    />
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted, nextTick, onBeforeUnmount, Ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElUpload } from 'element-plus';
  import ContentManager from '@/components/module/ContentManager.vue';
  import persHeader from '@/components/header/persHeader.vue';
  import ImageUpload from '@/components/upload/index.vue';
  import PayBg from '@/components/pay/index.vue';
  import { upChainPoundages, pointIsOpen, orderSave, orderQuery, chainBalance } from '@/api/pay';
  import { missionsDaosTasksDraft, getMissionsDaosTasksDraft } from '@/api/task';
  import { filesCos, categoryGet } from '@/api/common';
  import { missionsPublish } from '@/api/userContent';
  import { uploadFileToCOS } from '@/services/uploadService';
  import { useUploadStore } from '@/stores/uploadStore';
  import { aePublishStore } from '@/stores/publish';
  import { aeUseStore } from '@/stores/user';
  import { setItem, getItem, isNumeric, computeHmac } from '@/utils/index';
  import { FILENAMELENGTH } from '@/utils/common';
  import { showPopup } from '@/utils/usePopup';
  import SwitchBut from '@/components/SwitchBut.vue';
  import ImageCropper from '@/components/tailor/ImageCroppers.vue';
  import NodeFileUpload from '@/components/upload/nodeFileUpload.vue';
  import TextareaWithCounter from '@/components/TextareaWithCounter/index.vue';
  

  const router = useRouter();
  const userStore = aeUseStore();
  const publishStore = aePublishStore();
  const userInfo = userStore.getUserInfo;
  const ispostTask = ref(false);
  const isAgree = ref(true);
  const switchValue = ref(false);
  const nameEr = ref(false);
  const coverEr = ref(false);
  const rewardEr = ref(false);
  const targetEr = ref(false);
  const nodePeriodEr = ref(false);
  const payAmountEr = ref(false);
  const dayEr = ref(false);
  const trustValueEr = ref(false);
  const descriptionEr = ref(false);
  const isCoverBgColor = ref(false);
  const categoryNameEr = ref(false);
  const nodeChangeTimesEr = ref(false);
  const nodeChangeHourEr = ref(false);
  const competencyRequirementEr = ref(false);
  const nodeList: Ref<{ sort: number; url: string; }[]> = ref([]);
  const isIntegral = ref(false); // 是否选择积分支付

 interface SubTask {
    type: number;
    data: any;
  }
  const subTaskList = ref<SubTask[]>([{type: 1, data: {}}]); // 子任务缓存列表
  const overlay = ref<HTMLDivElement | null>(null); // 遮罩层

  const AuthorizationToken = ref('');
  if( userInfo.token == ''){
    AuthorizationToken.value = getItem('token');
  } else {
    AuthorizationToken.value = userInfo.token;
  }
  

  const expense = ref(0);
  const isDraft = ref(2); // 1草稿，2发布，3多个
  const reqTime= ref([]);
  const reqData = ref({
    missionId: '',
    daoId: '',
    name: '',
    day: '',
    reward: null as number | null,
    trustValue: '',
    nodePeriod: null as number | null,
    nodeChangeTimes: null as number | null,
    nodeChangeHour: null as number | null,
    competencyRequirement: '',
    cover: '',
    description: '',
    isUrgent: 0,
    nodeStandards: []
  });
  const leavePage = ref(2); // 1:发布成功离开页面，2：非正常离开页面
  const desTitle = ref('任务封面描述');

  const clippingType = '2'; // 是否裁剪
  const isCropperAvatar = ref(false); // 是否显示裁剪图片弹窗
  const cropperImg = ref<string | ArrayBuffer | null>(null); // 裁剪图片
  const cropperImgName = ref(''); // 裁剪图片名称
  const defaultCover = ref(''); // 裁剪后的默认展示图片
  
  // 介绍 	介绍类型：类型：1文本 2图片 3语音 4视频
  const contents = ref<{ type: string; data: any }[]>([]); // 任务介绍内容
  const convertContents = ref<{ type: string; data: any }[]>([]); // 任务介绍内容转换

  // 清空数据
  const resetReqData = () => {
    isUnll.value = true;
    contents.value = [];
    convertContents.value = [];
    reqData.value = {
      missionId: '',
      daoId: '',
      name: '',
      day: '',
      reward: null as number | null,
      trustValue: '',
      nodePeriod: null as number | null,
      nodeChangeTimes: null as number | null,
      nodeChangeHour: null as number | null,
      competencyRequirement: '',
      cover: '',
      description: '',
      isUrgent: 0,
      nodeStandards: []
    };
    dayEr.value = false;
    nameEr.value = false;
    coverEr.value = false;
    rewardEr.value = false;
    targetEr.value = false;
    payAmountEr.value = false;
    nodePeriodEr.value = false;
    trustValueEr.value = false;
    descriptionEr.value = false;
    isCoverBgColor.value = false;
    categoryNameEr.value = false;
    nodeChangeTimesEr.value = false;
    nodeChangeHourEr.value = false;
    competencyRequirementEr.value = false;
  };

  // 获取从草稿列表传参过来的草稿id详情
  const getTaskDraft = () => {
    const resData = {
      id: userInfo.subTaskDraftId
    }
    return new Promise<void>((resolve, reject) => {
      getMissionsDaosTasksDraft(resData).then((response: any) => {
        const { code, data, message } = response;
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
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
                data: v.content,
                content: v.content
              })
            }
          });
        }
        convertContents.value = attr;
        resultData.description = attr;
        contents.value = resultData.description;

        switchValue.value = resultData.isUrgent == 1 ? true : false;

        reqData.value = resultData;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

  // 控制信任值只能输入0-100
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
      reqData.value.trustValue = null;
    } else if (numValue >= 0 && numValue <= 100) {
      reqData.value.trustValue = numValue;
    } else {
      showPopup('请输入0到100之间的数字！', 'error', 3000);
      // 统一处理边界条件
      reqData.value.trustValue = Math.max(0, Math.min(100, numValue));
    }
  };
  
  // 任务报酬只能输入数字
  const handleRewardInput = (event: any) => {
    const value = event.target.value;
    const numericValue = parseInt(value, 10);

    if (!isNaN(numericValue) && numericValue > 0) {
        reqData.value.reward = numericValue;
    } else {
        reqData.value.reward = null;
    }
  }

  // 节点可改只能输入数字
  const handleNodeChangeTimesInput = (event: any) => {
    const value = event.target.value;
    const numericValue = parseInt(value, 10);

    if (!isNaN(numericValue) && numericValue >= 0) {
        reqData.value.nodeChangeTimes = numericValue;
    } else {
        reqData.value.nodeChangeTimes = null;
    }
  }

  // 单节点周期
  const handleNumberInput = (field: any, event: any) => {
    reqData.value[field] = isNumeric(event.target.value);
    if(field == 'day') {
      if (parseInt(reqData.value[field], 10) < 1) {
        reqData.value[field] = '';
      }
    }
    if(field == 'nodePeriod') {
      let day = parseInt(reqData.value.day, 10);
      let nodePeriod = parseInt(reqData.value.nodePeriod, 10);
      if (!isNaN(day) && !isNaN(nodePeriod) && day !== '' && nodePeriod !== '') {
          const arrayLength = Math.ceil(day / nodePeriod);
          nodeList.value = Array.from({ length: arrayLength }, (_, i) => ({
            sort: i + 1,
            url: ''
          }));
      } else {
        nodeList.value= [];
      }
    }
    if(field == 'nodeChangeHour') {
      if (parseInt(reqData.value[field], 10) < 0) {
        reqData.value[field] = '';
      }
    }
  }

  // 所属行业
  const indList = ref([]);
  const findCategoryGetFun = () => {
    const resData = {
      type: 1,
    }
    return new Promise<void>((resolve, reject) => {
      categoryGet(resData).then((response: any) => {
        const { code, data, message } = response;
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        indList.value = resultData;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  }

  // 判断点击弹框外关闭弹框
  const currentDropdown = ref<string | null>(null);
  const toggleDropdown = (dropdownName: string) => {
    console.log('打开弹框了');
    // currentDropdown.value = currentDropdown.value === dropdownName ? null : dropdownName;
    // console.log('currentDropdown.value1', currentDropdown.value);
    // document.addEventListener('click', handleClickOutside);
    currentDropdown.value = dropdownName;
    document.addEventListener('click', handleClickOutside);
  };

  const handleClickOutside = () => {
    console.log('关闭弹框了')
    currentDropdown.value = null;
  };

   //获取上传标准
  const findGetImageUrlFun = (index: number, urls: any) => {
    nodeList.value[index].url = urls;
    console.log('nodeList.value', nodeList.value); 
  };
  // 查看上传标准
  const findSeeNodeUrlFun = (item: any) => {
    window.open(item.url);
  };
  // 删除上传标准
  const findDelNodeUrlFun = (index: number) => {
    nodeList.value[index].url = '';
    uploadStore.removeNodeFile(index)
  };

  const getData = () => {
    // 你可以在这里处理提交的内容
    let attr: any = [];
    convertContents.value.forEach(v => {
      let types = '';
      if(v.type === 'text') { types = '1' }
      if(v.type === 'image') { types = '2' }
      if(v.type === 'audio') { types = '3' }
      if(v.type === 'video') { types = '4' }
      if(v.data !== '' && v.data !== undefined && v.data !== null) {
        attr.push({
          type: types,
          content: v.data
        })
      }
    });
    // if (reqTime.value.length > 0) {
    //   reqData.value.startTime = reqTime.value[0];
    //   reqData.value.endTime = reqTime.value[1];
    // }
    reqData.value.description = attr;
    if(switchValue.value) {
      reqData.value.isUrgent = 1;
    } else {
      reqData.value.isUrgent = 0;
    }
    if(userInfo.openCreateSubTaskType == 1) {
      reqData.value.missionId = userInfo.missionId;
      reqData.value.daoId = userInfo.daoId;
    }else if(userInfo.openCreateSubTaskType == 2) {
      reqData.value.missionId = reqData.value.missionId;
      reqData.value.daoId = reqData.value.daoId;
    }
    
    let resData = reqData.value;
    
    return resData;
  };

  // 点击序列号回显任务数据
  const isOnce = ref(0); // 点击的索引
  const isprevious = ref(0); // 上一个索引
  const echoSunTaskDetail = (index: number) => {
    // 保存上一个的索引
    const previousIndex = isOnce.value;
    isprevious.value = previousIndex;
    console.log('上一个的索引', previousIndex);
    console.log('上一个的索引isprevious', isprevious.value);
    // 更新当前索引
    isOnce.value = index;
    // 给当前条数据进行赋值
    if (subTaskList.value.length > 0) {
      let type = findVerificationFun() ? 2 : 1;
      subTaskList.value[previousIndex].type = type;
      subTaskList.value[previousIndex].data = reqData.value;
      
    }
      
    // }
    // 更新上一条数据的类型
    // let type = findVerificationFun() ? 2 : 1;
    // subTaskList.value[previousIndex].type = type;
    // 渲染当前条的数据
    console.log('渲染当前条的数据', subTaskList.value[index].data);
    contents.value = subTaskList.value[index].data.description;
    reqData.value = subTaskList.value[index].data;
    console.log('reqData.value', reqData.value);
  };
  
  // 发布任务
  const isUnll = ref(true); // 提交按钮是否禁用
  const isPayType = ref(false); // 是否显示支付方式
  const isPayTypeShow = ref(false); // 是否显示积分支付

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
    if(index = 1) {
      if (subTaskList.value.length > 0) {
        subTaskList.value[subTaskList.value.length - 1].type = 1;
        subTaskList.value[subTaskList.value.length - 1].data = getData();
      }
      findFilesCosFun();
    }else if(index == 2){
      if (subTaskList.value.length > 0) {
        subTaskList.value[subTaskList.value.length - 1].type = 1;
        subTaskList.value[subTaskList.value.length - 1].data = getData();
      }
      if(subTaskList.value){
        const hasTypeOne = subTaskList.value.some(item => item.type === 1);
        if (hasTypeOne) {
          showPopup('创建的子任务中有未填写的项，请检查后再发布！', 'error', 3000);
          return false;
        }
      }
      findFilesCosFun();
    }else if(index == 3){
      submitContents();
    }
  };
   
  const findFilesCosFun = () => {
    
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
      convertContents.value = [...contents.value];
      try {
        // 上传封面图片
        let covers = [];
        for (const file of uploadStore.coverImages) {
          const coverResult = await uploadFileToCOS(file.file, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
          console.log('封面图片的文件序号', file.isprevious);
          covers.push(`https://${coverResult.data.Location}`)
          subTaskList.value[subTaskList.value.length - 1].data.cover = `https://${coverResult.data.Location}`;
          if (!coverResult.success) throw coverResult.error;
        }

        // 上传详情文件
        let attr = [];
        for (const files of uploadStore.detailFiles) {
          const detailResult = await uploadFileToCOS(files.file, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
          console.log('详细介绍的文件序号', files.isprevious);
          attr.push(`https://${detailResult.data.Location}`)
          let urlArrt = attr.join(',');
          // contents.value[files.id].data = urlArrt;
        
          convertContents.value[files.id].data = urlArrt;
          let attr1: any = [];
          convertContents.value.forEach(v => {
            let types = '';
            if(v.type === 'text') { types = '1' }
            if(v.type === 'image') { types = '2' }
            if(v.type === 'audio') { types = '3' }
            if(v.type === 'video') { types = '4' }
            if(v.data !== '' && v.data !== undefined && v.data !== null) {
              attr1.push({
                type: types,
                content: v.data
              })
            }
          });
          subTaskList.value[subTaskList.value.length - 1].data.description = attr1;
          // contents.value[file.id].data = `https://${detailResult.data.Location}`;
          if (!detailResult.success) throw detailResult.error;
        }

        // 上传节点标准文件
        let nodeAttr = [];
        for (const files of uploadStore.nodeFiles) {
          const nodeResult = await uploadFileToCOS(files.file, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
          console.log('节点标准文件序号', files.isprevious);
          let url = `https://${nodeResult.data.Location}`;
          nodeList.value[files.isprevious].url = url;
          // contents.value[files.id].data = urlArrt;
          subTaskList.value[subTaskList.value.length - 1].data.nodeStandards = nodeList.value;
          // contents.value[file.id].data = `https://${nodeResult.data.Location}`;
          if (!nodeResult.success) throw nodeResult.error;
        }
        // 所有文件上传成功后，执行发布操作
        submitContents();
        // 清空上传状态
        uploadStore.clearAllFiles();

      } catch (error) {
        console.log('error', error);
        showPopup('发布失败，请重试！', 'error', 3000);
      } finally {
        isPublishing.value = false;
      }
  };

  const sbumitData = ref({});
  // 表单校验
  const findVerificationFun = () => {
    let resData = getData();
    // 检查对象中的每个键值对
    for (const key in resData) {
      if (resData.hasOwnProperty(key)) {
        const value = resData[key];
        if(key === 'id') {
          continue;
        }
        if (key === 'daoId') {
          continue;
        }
        if (key === 'missionId') {
          continue;
        }
        if (key === 'nodeStandards') {
          continue;
        }
    
        if(key === 'trustValue') {
          let values = value || 0;
          if(values <= 0) {
            trustValueEr.value = true;
            isUnll.value = false;
          } else {
            trustValueEr.value = false;
          }
        }
        if(key === 'description') {
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
            case 'day':
              dayEr.value = true;
              break;
            case 'reward':
              rewardEr.value = true;
              break;
            case 'nodePeriod':
              nodePeriodEr.value = true;
              break;
            case 'cover':
              coverEr.value = true;
              break;
            case 'competencyRequirement':
              competencyRequirementEr.value = true;
              break;
            case 'nodeChangeHour':
              nodeChangeHourEr.value = true;
              break;
            case 'nodeChangeTimes':
              nodeChangeTimesEr.value = true;
              break;
            default:
              break;
          }
          isUnll.value = false;
        } else {
          switch (key) {
            case 'name':
              nameEr.value = false;
              break;
            case 'day':
              dayEr.value = false;
              break;
            case 'reward':
              rewardEr.value = false;
              break;
            case 'nodePeriod':
              nodePeriodEr.value = false;
              break;
            case 'cover':
              coverEr.value = false;
              break;
            case 'competencyRequirement':
              competencyRequirementEr.value = false;
              break;
            case 'nodeChangeHour':
              nodeChangeHourEr.value = false;
              break;
            case 'nodeChangeTimes':
              nodeChangeTimesEr.value = false;
              break;
            default:
              break;
          }
          isUnll.value = true;
        }
      }
    }
    return isUnll.value;
  };
  const submitContents = () => {
    let resData = getData();
    isUnll.value = true;
    // 根据是否保存草稿进行判断， 1草稿，2发布，3多个发布
    if(isDraft.value == 1) {
      // findVerificationFun();
      submitDraft(subTaskList.value);
      return;
    }
    
    // type: 1:有未填写信息 2:无未填写信息
    if(!findVerificationFun()){
      if(isDraft.value == 3) {
        let obj = {
          type: 1,
          data: {}
        };
        subTaskList.value.push(obj);
        switchValue.value = false;
        isOnce.value = subTaskList.value.length - 1;
        isprevious.value = subTaskList.value.length - 1;
        resetReqData();
      } else {
        showPopup('您还有未填的信息！', 'error', 3000);
        return false;
      }
    } else {
      if(isDraft.value == 2) {
        sbumitData.value = resData;
        // 判断是否开启积分支付，开启积分支付时判断积分是否够支付，够的话显示积分支付按钮反之不显示
        if(isPointOpen.value == 1) {
          if(Number(integralBalance.value) > Number(expense.value)) {
            isPointOpen.value = 1;
            isPayType.value = true;
            payData.value.type = 2;
          } else {
            isPointOpen.value = 0;
            isPayType.value = true;
            payData.value.type = 1;
          }
        } else {
          isPointOpen.value = 0;
          isPayType.value = true;
          payData.value.type = 1;
        }
      } else if(isDraft.value == 3) {

        let obj = {
          type: 1,
          data: {}
        };
        subTaskList.value.push(obj);
        switchValue.value = false;
        console.log('subTaskList.value2', subTaskList.value);
        isOnce.value = subTaskList.value.length - 1;
        isprevious.value = subTaskList.value.length - 1;
        subTaskList.value[isprevious.value-1].type = 2;
        resetReqData();
      }
      
    }
  };

  const handleAnimationEnd = () => {
    if (overlay.value) {
      overlay.value.classList.remove('shrink-animation');
      overlay.value.removeEventListener('animationend', handleAnimationEnd);
      resetReqData(); // 清空表单数据
    }
  };

  // 保存草稿
  const submitDraft = (getData: any) => {
    let arrt = [];
    getData.forEach((v: any)=>{
      arrt.push(v.data);
    })
    const setData = arrt;
    return new Promise<void>((resolve, reject) => {
      missionsDaosTasksDraft(setData).then((response: any) => {
        const { code, data, message } = response;
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        showPopup('保存草稿成功！', 'success', 3000);
        let id = userInfo.daoId;
        userInfo.daoType = 1;
        setItem('daoType', 1);
        router.push({ name: 'DaoDetails', params: { id } });
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
    let arrt = [];
    subTaskList.value.forEach((v: any)=>{
      arrt.push(v.data);
    })
    payFee(1, 8, arrt);
  }

  // 积分支付
  const findPayWithPointsFun = () => {
    isPayType.value = false;
    payData.value.type = 2;
    payData.value.payAmount = Number(expense.value) * subTaskList.value.length;
    payData.value.poundage = 0;
    payData.value.mps = 0;
    payData.value.isPay = true;
  }
  // 积分支付-立即支付
  const pointsDeduction = () => {
    let arrt = [];
    subTaskList.value.forEach((v: any)=>{
      arrt.push(v.data);
    })
    payFee(1, 7, arrt);
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
  const isExpense = ref(false);
  const findupChainPoundage = () => {
    let resData = {
      type: 1
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
        
        expense.value = resultData.upChainPoundage;
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
  const payFee = (type: number, payType: number, taskData: any) => {
    let timestamp = Date.now();
    let expenses = Number(expense.value) * subTaskList.value.length;
    let content = "";
     content = payType+''+expenses+'0'+timestamp;
    let userId = '';
    if(userStore.userInfo.id !== '') {
      userId = userStore.userInfo.id;
    } else {
      userId = getItem('id');
    }
    let setData = {
        // businessId: taskId,
        businessData: {
          list: taskData
        },
        businessType: payType,
        amount: expenses,
        poundage: 0,
        timeStamp: timestamp,
        sign: computeHmac(content.toString(), userId.toString())
    };
            
    return new Promise<void>((resolve, reject) => {
      orderSave(setData).then((response: any) => {
        const { code, data, message } = response;
        
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        payData.value.minute = resultData.minute;
        payData.value.createTime = resultData.createTime;
        orderNo.value = resultData.orderNo;
        payData.value.payUrl = resultData.qrcode;
        payData.value.payAmount = expenses;
        payData.value.minute = resultData.minute;
        payData.value.createTime = resultData.createTime;
        if(payType == 7) {
          isPayType.value = false;
          showPopup(message, 'success', 3000);
          resetReqData(); // 重置数据
          setItem('subTaskDraft', findClearDraft());
          console.log('getItem("subTaskDraft")111', getItem('subTaskDraft'))
          convertContents.value = [];
          publishStore.questInfo.data = {};
          payData.value.isPay = false;
          isActive.value = false;
          let id = data.daoId;
          userInfo.taskType = 1;
          setItem('taskType', 1);
          leavePage.value = 1;
          router.push({ name: 'DaoDetails', params: { id } });
        } else if(payType == 8) {
          isActive.value = true;
          findOrderResult();
          payData.value.isPay = true;
        }
        // let id = data.daoId;
        // userInfo.daoType = 1;
        // setItem('daoType', 1);
        // router.push({ name: 'DaoDetails', params: { id } });
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
        ;

        if (code === 200) {
          if (data.orderStatus == 2) {
            showPopup(message, 'success', 3000);
            resetReqData(); // 重置数据
            setItem('subTaskDraft', findClearDraft());
            console.log('getItem("subTaskDraft")111', getItem('subTaskDraft'))
            convertContents.value = [];
            publishStore.questInfo.data = {};
            payData.value.isPay = false;
            clearTimeout(timer);
            isActive.value = false;
            let id = data.businessId;
            userInfo.taskType = 1;
            setItem('taskType', 1);
            leavePage.value = 1;
            router.push({ name: 'DaoDetails', params: { id } });
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
      missionId: '',
      daoId: '',
      name: '',
      day: '',
      reward: null as number | null,
      trustValue: '',
      nodePeriod: null as number | null,
      nodeChangeTimes: null as number | null,
      nodeChangeHour: null as number | null,
      competencyRequirement: '',
      cover: '',
      description: '',
      isUrgent: 0,
      nodeStandards: []
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
      subTaskList.value[isOnce.value].data.cover = url;
      reqData.value.cover = url;
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
      setItem('subTaskDraft', resData);
    }
    clearTimeout(timer);
  });

  // 在路由变化时停止重试并清除定时器
  router.beforeEach((to, from, next) => {
    isActive.value = false;
    clearTimeout(timer);
    next();
  });
  

  // 判断是否为空对象
  const isEmptyObject = (obj: Record<string, any>): boolean => {
    return Object.keys(obj).length === 0;
  }

  // 监听填的数据进行验证
  const verifyForm = (item: any) => {
    if (item == 'name') {
      if(reqData.value.name !== '') {
        nameEr.value = false;
      }
    }
    if (item == 'payAmount') {
      if(reqData.value.payAmount !== '') {
        payAmountEr.value = false;
      }
    }
    if (item == 'target') {
      if(reqData.value.natargetme !== '') {
        targetEr.value = false;
      }
    }
    if (item == 'competencyRequirement') {
      if(reqData.value.competencyRequirement !== '') {
        competencyRequirementEr.value = false;
      }
    }
    if (item == 'day') {
      if(reqData.value.day !== '') {
        dayEr.value = false;
      }
    }
    if (item == 'cover') {
      if(reqData.value.cover !== '') {
        coverEr.value = false;
      }
    }
    if (item == 'coverDescription') {
      if(reqData.value.coverDescription !== '') {
        isCoverBgColor.value = false;
      }
    }
    if (item == 'categoryName') {
      if(reqData.value.categoryName !== '') {
        categoryNameEr.value = false;
      }
    }
    if (item == 'trustValue') {
      if(reqData.value.trustValue !== '') {
        trustValueEr.value = false;
      }
    }
    if (item == 'description') {
      if(reqData.value.description !== '') {
        descriptionEr.value = false;
      }
    }
    isUnll.value = true;
  }

  onMounted(() => {
    if(userInfo.openCreateSubTaskType == 1) {
      if(getItem('subTaskDraft') !== null) {
        reqData.value = getItem('subTaskDraft');
      } else {
        reqData.value = findClearDraft();
      }
      
    } else if(userInfo.openCreateSubTaskType == 2) {
      getTaskDraft(); // 获取任务草稿
    }
    
    findCategoryGetFun(); // 获取行业列表
    findupChainPoundage(); // 计算链上手续费
    findPointIsOpenFun(); // 判断是否开启积分支付
    findChainBalanceFun(); // 查询用户积分余额
  })
  
</script>

<style lang='scss' scoped>
  @use '@/assets/styles/createSubtask.scss';
  @use '@/assets/styles/popupModal.scss';
  @use '@/assets/styles/common.scss';
  /* 添加到你的样式文件中 */
  @keyframes shrink {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(0.1);
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      transform-origin: top left;
    }
  }

  .shrink-animation {
    animation: shrink 0.5s forwards;
  }
</style>
