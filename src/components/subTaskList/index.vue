<template>
    <div class="subTask">
      <div class="subTask-container">
        <div class="subTask-centnet" data-aos="fade-up">
          <div class="subTask-centnet-main">
            <div class="subTask-grid" >
              <aeRow class="grid-demo">
                <template v-for="(item, index) in subTsskList" :key="index">
                    <aeCol 
                      :xs="24" 
                      :sm="24" 
                      :md="12" 
                      :lg="12" 
                      :xl="8"
                      :xxl="8" 
                      :xxxl="8" 
                      class="subTask-item"
                    >
                      <div class="subTask-item-type">
                        <template v-if="item.isUrgent == 1">
                          <img :src="TaskExigency" alt="紧急" title="紧急任务" />  
                        </template>
                        <template v-if="item.status == 2">
                          <img :src="TaskComplete" alt="完成" title="任务已完成" />
                        </template>
                      </div>
                      <div 
                        class="subTask-item-content" 
                        :class="item.taskAdminUserId == userInfo.id ? 'myTask' :''"
                      >
                        <div 
                          class="subTask-item-pic" 
                          @click="onClick(item, index)"
                        >
                          <div class="subTask-item-pic-main">
                            <img :src="item.cover" alt="" />
                            <div class="sunTaskName">{{ item.name }}</div>
                          </div>
                        </div>
                        <div 
                          class="subTask-item-info" 
                          @click="onClick(item, index)"
                        >
                          <div class="item-info-datas">
                            <div class="datas-item">
                              <div class="datas-item-icon">
                                  <i class="icon font_family icon-rili24"></i>
                              </div>
                              <div class="datas-item-progress">
                                <div class="progress-bar">
                                    <div class="progress-bar-display">
                                        <div class="link-l"></div>
                                        <div class="link-c">{{ item.day }}天</div>
                                        <div class="link-r"></div>
                                    </div>
                                </div>
                              </div>
                              <div class="progress-name">任务周期</div>
                            </div>
                            <div class="datas-item">
                              <div class="datas-item-icon">
                                  <i class="icon font_family icon-jiedian24_1"></i>
                              </div>
                              <div class="datas-item-progress">
                                <div class="progress-bar">
                                    <div class="progress-bar-display">
                                        <div class="link-l"></div>
                                        <div class="link-c">{{ item.nodePeriod }}天</div>
                                        <div class="link-r"></div>
                                    </div>
                                </div>
                              </div>
                              <div class="progress-name">节点周期</div>
                            </div>
                            <div class="datas-item">
                              <div class="datas-item-icon">
                                  <i class="icon font_family icon-xinren24"></i>
                              </div>
                              <div class="datas-item-progress">
                                <div class="progress-text" :style="{left: (Number(item.trustValue) ? Number(item.trustValue) - 6 : 0) +'%'}">{{ item.trustValue || 0 }}</div>
                                  <div class="progress-bar">
                                      <ScaleProgressBar :max="100" :progress="Number(item.trustValue) || 0" :showPercentage="true" />
                                  </div>
                              </div>
                              <div class="progress-name">信任值</div>
                            </div>
                          </div>
                          <div class="item-info-operation">
                            <div class="item-info-operation-icon">
                              <template v-if="item.status == 0">
                                <img :src="applyFor" alt="申请中" title="任务申请中" />
                              </template>
                              <template v-if="item.status == 1">
                                <img :src="underWay" alt="进行中" title="任务进行中" />
                              </template>
                              <template v-if="item.status == 2">
                                <img :src="complete" alt="已完成" title="任务已完成" />
                              </template>
                            </div>
                          </div>
                        </div>
                        <div class="subTask-item-receive">
                          <div class="receive-content">
                            <div class="receive-content-left">
                              <template v-if="index == 0">
                                <template v-if="hasDraft !== 0">
                                  <div class="task-draft">
                                    <div class="task-draft-main">
                                      <div class="task-draft-icon">
                                        <i class="icon font_family icon-caogao24"></i>
                                      </div>
                                      <div class="task-draft-text">草稿箱·{{ draftNum }}</div>
                                    </div>
                                  </div>
                                </template>
                                <template v-else>
                                  <div class="list-info">
                                      <div class="list-info-name">
                                          <div class="list-info-name-text">任务接收:</div>
                                          <template v-if="item.taskAdminUserId !== null">
                                            <div class="list-info-name-img-list">
                                              <div 
                                                  class="list-info-name-img-list-item"
                                              >
                                                  <el-image
                                                      :src="item.taskAdminUserAvatar"
                                                      fit="cover"
                                                      @click="findViewPersonalInfo(item.taskAdminUserId)"
                                                      >
                                                      <template #error>
                                                          <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                      </template>
                                                  </el-image>
                                              </div>
                                            </div>
                                          </template>
                                          <template v-else>
                                            <template v-if="item.applies.length > 0">
                                              <div class="list-info-name-img-list">
                                                <div 
                                                    class="list-info-name-img-list-item"
                                                    v-for="(items, index) in item.applies.slice(0, 2)" 
                                                    :key="index"
                                                >
                                                    <el-image
                                                        :src="items.avatar"
                                                        fit="cover"
                                                        @click="findViewPersonalInfo(item.userId)"
                                                        >
                                                        <template #error>
                                                            <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                        </template>
                                                    </el-image>
                                                </div>
                                                <div class="list-info-name-img-list-item" v-if="item.applies.length - 2 > 0">
                                                    <p>+ {{ item.applies.length - 2 }}</p>
                                                </div>
                                              </div>
                                            </template>
                                            <template v-else>
                                              <div class="list-info-name-val">暂无人申请</div>
                                            </template>
                                          </template>
                                      </div>
                                  </div>
                                  <div class="user-uuid">
                                    <template v-if="item.taskAdminUserId !== null">
                                      <div class="multi-line-1">账号ID：{{ item.taskAdminUserId }}</div>
                                    </template>
                                  </div>
                                </template>
                              </template>
                              <template v-else>
                                <div class="list-info">
                                    <div class="list-info-name">
                                        <div class="list-info-name-text">任务接收:</div>
                                        <template v-if="item.status === 2">
                                          <template v-if="item.taskAdminUserId !== null">
                                            <div class="list-info-name-img-list">
                                              <div 
                                                  class="list-info-name-img-list-item"
                                              >
                                                  <el-image
                                                      :src="item.taskAdminUserAvatar"
                                                      fit="cover"
                                                      @click="findViewPersonalInfo(item.taskAdminUserId)"
                                                      >
                                                      <template #error>
                                                          <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                      </template>
                                                  </el-image>
                                              </div>
                                            </div>
                                          </template>
                                        </template>
                                        <template v-else>
                                          <template v-if="item.taskAdminUserId !== null">
                                            <div class="list-info-name-img-list">
                                              <div 
                                                  class="list-info-name-img-list-item"
                                              >
                                                  <el-image
                                                      :src="item.taskAdminUserAvatar"
                                                      fit="cover"
                                                      @click="findViewPersonalInfo(item.taskAdminUserId)"
                                                      >
                                                      <template #error>
                                                          <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                      </template>
                                                  </el-image>
                                              </div>
                                            </div>
                                          </template>
                                          <template v-else>
                                            <template v-if="item.applies.length > 0">
                                              <div class="list-info-name-img-list">
                                                <div 
                                                    class="list-info-name-img-list-item"
                                                    v-for="(items, index) in item.applies.slice(0, 2)" 
                                                    :key="index"
                                                >
                                                    <el-image
                                                        :src="items.avatar"
                                                        fit="cover"
                                                        @click="findViewPersonalInfo(items.userId)"
                                                        >
                                                        <template #error>
                                                            <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                        </template>
                                                    </el-image>
                                                </div>
                                                <div class="list-info-name-img-list-item" v-if="item.applies.length - 2 > 0">
                                                    <p>+ {{ item.applies.length - 2 }}</p>
                                                </div>
                                              </div>
                                            </template>
                                            <template v-else>
                                              <div class="list-info-name-val">暂无人申请</div>
                                            </template>
                                          </template>
                                        </template>
                                    </div>
                                </div>
                                <div class="user-uuid">
                                  <template v-if="item.status === 1">
                                    <template v-if="item.taskAdminUserUuid !== null">
                                      <div class="multi-line-1">账号ID：{{ item.taskAdminUserUuid }}</div>
                                    </template>
                                  </template>
                                </div>
                              </template>
                            </div>
                            <div class="receive-content-right">
                              <div class="payAmount">¥{{ item.reward }}</div>
                              <div class="operation-bot">
                                <!-- 组织管理者 -->
                                <template v-if="userInfo.id == missionAdminUserId">
                                  <template v-if="index == 0">
                                    <template v-if="hasDraft !== 0">
                                      <div class="flex-main-select" @click="findEditDraftFun">编辑草稿</div>
                                    </template>
                                  </template>
                                  <template v-if="item.status == 0">
                                    <template v-if="item.taskAdminUserId == null">
                                      <template v-if="item.applies.length > 0">
                                        <div class="flex-main-select" @click="selectResponsiblePerson(item)">筛选成员</div>
                                      </template>
                                      <template v-else>
                                        <div class="flex-main-select" @click="deleteSubTask(item.taskId)">删除</div>
                                      </template>
                                    </template>
                                    <template v-else>
                                      <!-- <div class="flex-main-select" @click="findPayThePledgeImmediately(item)">
                                        立即支付质押1
                                      </div> -->
                                      <template v-if="item.payStatus == -1 || item.payStatus == 3 || item.payStatus == 4 || item.payStatus == 5 || item.payStatus == 7">
                                        <div class="flex-main-select" @click="findCreateAPaymentPledge(item)">
                                          立即支付质押2
                                        </div>
                                      </template>
                                      <template v-else>
                                        <div class="flex-main-select" @click="findPayThePledgeImmediately(item)">
                                          立即支付质押3
                                        </div>
                                      </template>
                                    </template>
                                  </template>
                                  <template v-if="item.status == 1">
                                    <div class="flex-main-select" @click="handleExecuteDetails(item)">
                                          任务详情
                                      </div>
                                  </template>
                                </template>
                                <!-- 管理员 -->
                                <template v-else-if="item.taskAdminUserId == userInfo.id">
                                  <template v-if="item.status == 1">
                                      <div class="flex-main-select" @click="handleExecuteDetails(item)">
                                          执行任务
                                      </div>
                                  </template>
                                  <template v-else>
                                      <div class="flex-main-select">
                                          等待审核
                                      </div>
                                  </template>
                                </template>
                                <!-- 其他人 -->
                                <template v-else>
                                  <template v-if="item.hasApply !== 1">
                                    <template v-if="item.taskAdminUserId == null">
                                      <div class="flex-main-select" @click="applyToParticipate(item)">申请参与</div>
                                    </template>
                                    <template v-else>
                                      <div class="flex-main-select" @click="handleExecuteDetails(item)">
                                          任务详情
                                      </div>
                                    </template>
                                  </template>
                                  <!-- hasApply： 1已申请，2没申请 -->
                                  <template v-else-if="item.hasApply == 1">
                                    <template v-if="item.taskAdminUserId !== null">
                                      <div class="flex-main-select" @click="handleExecuteDetails(item)">
                                          任务详情
                                      </div>
                                    </template>
                                    <template v-else>
                                      <div class="flex-main-select">
                                        您已申请
                                      </div>
                                    </template>
                                  </template>
                                </template>
                              </div>
                            </div>
                          </div>
                        </div>
                        <template v-if="item.isAlertAuditFailure == 1">
                          <div class="msg-tips myTask">
                            <div class="msg-tips-main">
                              <template v-if="item.adminUserId !== userInfo.id">
                                <div class="tips-main-type tips-error">
                                  <div class="tips-main-icon">
                                      <i class="icon font_family icon-shenheshibai68"></i>
                                  </div>
                                  <div class="tips-main-title">很遗憾</div>
                                  <div class="tips-main-tips">任务申请未通过！</div>
                                  <div class="tips-main-but">查看更多任务</div>
                                </div>
                              </template>
                              <template v-else>
                                <div class="tips-main-type tips-success">
                                  <div class="tips-main-icon">
                                      <i class="icon font_family icon-shenhezhong68"></i>
                                  </div>
                                  <div class="tips-main-title">恭喜您</div>
                                  <div class="tips-main-tips">申请成功成为此任务的责任人！</div>
                                  <div class="tips-main-but">我知道了</div>
                                </div>
                              </template>
                            </div>
                          </div>
                        </template>
                      </div>
                    </aeCol>
                  </template>
                </aeRow>
            </div>
          </div>
        </div>
      </div>
      <!-- 选择任务责任人 -->
      <div class="popupModal" v-if="isApplyList" @click="findApplyListFun">
          <div class="masking"></div>
          <div class="personInCharge-center" @click.stop>
              <div class="personInCharge-center-title">请选择任务接收人</div>
              <div class="personInCharge-center-select">
                  <div class="search-main">
                      <div class="search-icon">
                          <i class="icon font_family icon-fangdajing24"></i>
                      </div>
                      <div class="search-input">
                          <input 
                              ref="inputRefs"
                              type="text" 
                              v-model="search" 
                              placeholder="Search..." 
                              @keyup.enter="handleEnter"
                          />
                      </div>
                      <div class="search-clear">
                          <i 
                              class="icon font_family icon-shanchuyuanquanbeijing24" 
                              v-if="search !== ''"
                              @click="search = ''"
                          ></i>
                      </div>
                  </div>
              </div>
              <div class="personInCharge-center-list">
                  <div class="applies-list">
                      <div
                          class="applies-list-item"
                          :class="applyId == item.userId ? 'active' : ''"
                          v-for="(item, index) in applyListData" 
                          :key="item.userId"
                      >
                          <div class="item-content">
                              <div class="item-content-left">
                                  <div class="item-content-left-main">
                                      <div class="item-content-left-main-avatar" @click="findViewPersonalInfo(item.userId)">
                                          <img :src="item.avatar" alt="" />
                                      </div>
                                      <div class="item-content-left-main-info">
                                          <div class="item-content-left-main-info-name">{{ item.username }}</div>
                                          <div class="item-content-left-main-info-tips">{{ item.post }}</div>
                                      </div> 
                                  </div>
                              </div>
                              <div class="item-content-right" @click="chooseApply(item)">
                                <div class="ae-btn">
                                  <div class="exhibit-publish-main">
                                    <div class="exhibit-publish-name">选择</div>
                                  </div>
                                </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <!-- 选择任务责任人二次确认  -->
      <div class="popupModal" v-if="isApplyListVerify" @click="isApplyListVerify = false">
          <div class="masking"></div>
          <div class="popupModal-center" @click.stop>
              <div class="popupModal-main">
                <div class="popupModal-module"></div>
                <div class="popupModal-main-content">
                  <div class="popupModal-main-title">确定选“{{ applyName }}”为任务责任人</div>
                  <div class="popupModal-main-but-group">
                    <div class="popupModal-main-but close_relievoShadow" @click="isApplyListVerify = false">
                      <div class="exhibit-publish-main">
                        <div class="exhibit-publish-name">取消</div>
                      </div>
                    </div>
                    <div class="popupModal-main-but relievoShadow" @click="findsbumitApplySubmit">
                      <div class="exhibit-publish-main">
                        <div class="exhibit-publish-name">确定选择</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
      </div>
      
      <!-- 选择支付类型  -->
      <div class="popupModal" v-if="isPayType" @click="isPayType = false">
        <div class="masking"></div>
        <div class="popupModal-center" @click.stop>
          <div class="popupModal-main compAmt">
            <div class="popupModal-module"></div>
            <div class="popupModal-main-content">
              <div class="popupModal-main-title">订单明细</div>
              <div class="popupModal-main-compAmt">
                <div class="compAmt-name">任务押金</div>
                <div class="compAmt-val">¥{{ reward }}</div>
              </div>
              <div class="popupModal-main-compAmt">
                <div class="compAmt-name">NFT费用</div>
                <div class="compAmt-val">¥{{ createNftFee }}</div>
              </div>
              <div class="popupModal-item-content" v-if="isPointOpen !== 1">
                <div class="item-content-icon" @click="isIntegral = !isIntegral">
                  <i 
                    class="icon font_family"
                    :class="isIntegral ? 'icon-gouxuanyuanxingbiankuang24' : 'icon-weigouxuanyuanxingbiankuang24'"
                  ></i>
                </div>
                <div class="item-content-txt">{{ createNftFee }}积分可抵NFT费用{{ createNftFee }}元（可用积分{{ integralBalance }}）</div>
              </div>
              <div class="item-content-reward">
                <div class="item-content-reward-name">订单总费用</div>
                <div class="item-content-reward-val">
                  <template v-if="status !== '3'">
                    <template v-if="isIntegral">¥{{ reward }}</template>
                    <template v-else>¥{{ Number(reward) + Number(createNftFee) }}</template>
                  </template>
                  <template v-else>
                    <template v-if="isIntegral">¥{{ Number(reward) - Number(createNftFee) }}</template>
                    <template v-else>¥{{ Number(reward) + Number(createNftFee) }}</template>
                  </template>
                </div>
              </div>
              <div class="popupModal-main-but-group">
                <div class="popupModal-main-but relievoShadow" @click="findGoToPayFun">
                  <div class="exhibit-publish-main">
                    <div class="exhibit-publish-name">立即支付</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      </div>
      <!-- 扫码支付  -->
      <PayBg :payData="payData" v-if="payData.isPay" @close="closePayModal" @button-click="pointsDeduction" />
    </div>
  </template>
   
  <script lang="ts">
    import { ref, defineComponent, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
    import router from '@/router';
    import PayBg from '@/components/pay/index.vue';
    import ScaleProgressBar from '@/components/progress/scaleProgressBar.vue';
    import AeRow from '@/components/aeRow/Row.vue';
    import AeCol from '@/components/aeCol/Col.vue';
    import { initAOS } from '@/animations/aos';
    import { showPopup } from '@/utils/usePopup';
    import { aeUseStore } from '@/stores/user';
    import { applyAdd, applyList, daosTasksCancel, subTasksList } from '@/api/dao';
    import { chainBalance, orderQuery, orderSave, pointIsOpen, upChainPoundages } from '@/api/pay';
    import { computeHmac, extractIdFromUrl, getItem, setItem } from '@/utils';
    
    // import { setRem } from '../utils/rem' // 引入文件
    // import { debounce } from 'throttle-debounce' // 用于防抖的
  
    import applyFor from '@/assets/images/task/applyFor.png';
    import complete from '@/assets/images/task/complete.png';
    import underWay from '@/assets/images/task/underWay.png';
    import TaskExigency from '@/assets/images/common/exigency.png';
    import TaskComplete from '@/assets/images/common/complete.png';

    export default defineComponent({
      components: {
        ScaleProgressBar,
        AeRow,
        AeCol,
        PayBg,
      },
      props: {
        daoId: {
          type: String,
          default: ''
        },
        missionId: {
          type: String,
          default: ''
        },
        missionAdminUserId: {
          type: String,
          default: ''
        }
      },
      setup(props) {
        const userStore = aeUseStore();
        const userInfo = userStore.getUserInfo;
        const draftNum = ref(0);
        const hasDraft = ref(0);
      
        const parentSearchQuery = ref('');
        const parentSelectedOption = ref('');
        const daoId = ref(props.daoId);
        const missionId = ref(props.missionId);
        const missionAdminUserId = ref(props.missionAdminUserId);
      
        const subTsskList = ref([]);

        const isApplyList = ref(false); // 显示任务申请人列表
        const isApplyListVerify = ref(false); // 显示二次确认任务申请人列表
        const applyListData = ref([]); // 任务申请人列表
        const search = ref(''); // 搜索框
        const applyId = ref(0); // 选中的任务申请人id
        const applyName = ref(''); // 选中的任务申请人姓名
        const status = ref(''); // 子任务状态
        const reward = ref(0); // 报酬金额
        const sbumitData = ref({}); // 提交数据
        const isPayType = ref(false); // 是否显示支付方式
        const isIntegral = ref(false); // 是否选择积分支付
        const isPointOpen = ref(0); // 0 关闭，1 开启
        const integralBalance = ref(0); // 积分余额
        const expense = ref(0); // 上链手续费
        const createNftFee = ref(0); // 创建nft费用

        const handleSearchQueryUpdate = (newSearchQuery: string) => {
          parentSearchQuery.value = newSearchQuery;
          findsunTaskListFun();
        };
        const handleSelectedOptionUpdate = (newSelectedOption: string) => {
          parentSelectedOption.value = newSelectedOption;
          findsunTaskListFun();
        };

        // 获取List数据
        const findsunTaskListFun = () => {
          let id = missionId.value;
          const resData = {
            id
          }
          return new Promise<void>((resolve, reject) => {
            subTasksList(resData).then((response: any) => {
              const { code, data, message } = response;
              
              const resultData = data;
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                  return;
              }
              if(resultData.length < 1) {
                return false;
              } else {
                subTsskList.value = data.daoTasks;
                draftNum.value = data.draftNum;
                hasDraft.value = data.hasDraft;
              }
              resolve()
            }).catch((error: any) => {
                reject(error)
            })
          })
        }

        // 点击跳转到dao详情
        const onClick = (item: any, index: number) => {
          if(hasDraft.value == 1) {
            if(index === 0) {
              let id = missionId.value;
              router.push({ name: 'SubTaskDraft', params: { id: id}});
            } else {
              let id = item.daoId;
              router.push({ name: 'DaoDetails', params: { id } });
            }
          } else {
            let id = item.daoId;
            router.push({ name: 'DaoDetails', params: { id } });
          }
        };

        // 跳到草稿列表
        const findEditDraftFun = () => {
          let id = missionId.value;
          router.push({ name: 'SubTaskDraft', params: { id: id}});
        }

        // 申请参与子任务
        const applyToParticipate = (data: any) => {
          let reqData = {
              id: data.taskId,
              missionId: missionId.value
          }
          return new Promise<void>((resolve, reject) => {
            applyAdd(reqData).then((response: any) => {
              const { code, message } = response;
              
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                  return;
              }
              findsunTaskListFun();
              resolve()
            }).catch((error: any) => {
                reject(error)
            })
          })
        };

        // 取消DAO子任务
        const deleteSubTask = (id: any) => {
          let reqData = {
            id
          }
          daosTasksCancel(reqData).then((response: any) => {
            const { code, message } = response;
            if (code !== 200) {
              showPopup(message, 'error', 3000);
              return;
            }
            findsunTaskListFun();
          })
        };


        /** 选择任务负责人数据 ***/
        const taskId = ref(''); // 任务ID
        const selectResponsiblePerson = (item: any) => {
          taskId.value = item.taskId;
          reward.value = item.reward;
          status.value = item.status;
          let reqData = {
            id: Number(item.taskId),
            value: ''
          }
          getApplyaList(reqData);
        };

        /** 获取用户申请列表数据 ***/
        const getApplyaList = (reqData: any) => {
            console.log('获取用户申请列表数据', reqData);
            return new Promise<void>((resolve, reject) => {
                applyList(reqData).then((response: any) => {
                    const { code, message } = response;
                    
                    if (code !== 200) {
                      showPopup(message, 'error', 3000);
                        return;
                    }
                    applyListData.value = response.data;
                    isApplyList.value = true;
                    resolve()
                }).catch((error: any) => {
                    reject(error)
                })
            })
        };

        /** 处理回车事件 搜索责任人 ***/
        const handleEnter = () => {
            console.log('search', search.value);
            let reqData = {
                id: taskId.value,
                value: search.value
            };
            getApplyaList(reqData);
        };

        const chooseApply = (item: any) => {
            applyId.value = item.userId;
            applyName.value = item.username;
            isApplyListVerify.value = true;
        };

        /** 点击确认选择责任人 ***/
        const findsbumitApplyClick = async () => {
          isApplyList.value = false;
          isApplyListVerify.value = true;
        };

        /** 二次确认选择责任人提交 **/
        const findsbumitApplySubmit = async () => {
          await findupChainPoundage(); // 计算链上手续费
          await findChainBalanceFun();
          // 积分已开启
          if(isPointOpen.value == 1) {
            // 积分大于手续费
            if(Number(integralBalance.value) > Number(expense.value)) {  
              isPointOpen.value = 1;
            } else {
              isPointOpen.value = 0;
            }
          } else {
            isPointOpen.value = 0;
          }
          isPayType.value = true;
        }

        // 选择支付类型后去支付
        const findGoToPayFun = () => {
          let reqData = {};
          // type: 2 指定子任务责任人, 3 子任务质押金
          // 积分已开启
          if(isPointOpen.value == 1) {
              openPayModal(3, 12, reqData);
          } else {
            // 状态为3时，说明任务暂停，需要选择责任人只需要支付手续费
            if(status.value == '3') {
              reqData = {
                id: taskId.value,
                daoId: daoId.value,
                assignUserId: applyId.value
              }
              if(isIntegral) {
                openPayModal(2, 9, reqData);
              } else {
                openPayModal(2, 10, reqData);
              }
            } else {
              // 手续费和押金需要同时支付
              reqData = {
                taskId: taskId.value,
                daoId: daoId.value,
                assignUserId: applyId.value
              }
              openPayModal(3, 12, reqData);
            }
          }
        };

        const findApplyListFun = () => {
          isApplyList.value = false;
          applyId.value = 0;
        };

        // 打开子任务执行详情
        const handleExecuteDetails = (item: any) => {
          console.log('打开子任务详情', item);
          // 	0未指定 1个人 2DAO
          userInfo.taskId = item.taskId;
          userInfo.daoId = props.daoId;
          userInfo.missionId = missionId.value;
          userInfo.subtaskAdminUserId = item.taskAdminUserId;
          setItem('missionId', missionId.value)
          router.push({ name: 'executeDetails', params: { id: item.taskId} })
        };

        // 查看用户个人中心
        const findViewPersonalInfo = (userId: any) => {
          userInfo.othersId = userId;
          router.push('/PersonalHomepage');
          // window.open(`${window.location.origin}/personalHomepage`, '_blank');
        };


         /** 支付模块 **/

        // 聚合支付
        const findAggregatePayFun = () => {
              isPayType.value = false;
              payData.value.type = 1;
              openPayModal(2, 10, sbumitData.value);
          }

          // 积分支付
          const findPayWithPointsFun = () => {
              isPayType.value = false;
              payData.value.type = 2;
              payData.value.payAmount = expense.value;
              payData.value.isPay = true;
          }
          // 积分支付-立即支付
          const pointsDeduction = () => {
            payData.value.payAmount = createNftFee.value;
            payData.value.poundage = 0;
            payData.value.mps = 0;
            openPayModal(2, 9, sbumitData.value);
          };


          // 查询积分余额
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

          // 判断是否开启显示积分支付，开启的话显示积分支付和聚合支付按钮，不开启则直接显示聚合支付二维码
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
          findsunTaskListFun();
          clearTimeout(timer);
          payData.value.isPay = false;
        }

        // 待支付-支付指定责任人的NFT费用
        const findPayNftImmediately = (item: any) => {
          payData.value.payUrl = item.assignQrcode;
          orderNo.value = item.assignOrderNo;
          payData.value.payAmount = item.assignPoundage;
          payData.value.minute = item.minute;
          payData.value.createTime = item.createTime;
          payData.value.isPay = true;
          isActive.value = true;
          findOrderResult(2);
        };

        // 待支付-支付子任务费用
        const findPayThePledgeImmediately = (item: any) => {
          payData.value.payUrl = item.qrcode;
          orderNo.value = item.orderNo;
          payData.value.payAmount = item.amount;
          payData.value.minute = item.minute;
          payData.value.createTime = item.createTime;
          payData.value.isPay = true;
          payData.value.type = 1;
          isActive.value = true;
          findOrderResult(3);
        };

        // 正常创建支付子任务费用
        const findCreateAPaymentPledge = (item: any) => {
          payData.value.type = 1;
          let reqData = {
            taskId: taskId.value,
            daoId: daoId.value,
            assignUserId: applyId.value
          }
          openPayModal(3, 12, reqData)
        }

          // 计算链上手续费+NFT费用
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
          // 创建支付订单
          const orderNo = ref(''); // 订单号
          const isActive = ref(true); // 使用 ref 存储活动状态
          // type: 1 创建子任务，2 指定子任务责任人,3 子任务质押金
          const openPayModal = (type: number, busType: number, getData: any) => {
              // let taskId = taskDetails.value.id; 
              
              let userId = '';
              if(userStore.userInfo.id !== '') {
                  userId = userStore.userInfo.id;
              } else {
                  userId = getItem('id');
              }

              let content = '';
              let reqData = {};
              let timestamp = Date.now();
              console.log('timestamp', timestamp);
              /**
              * 1、判断type是什么类型支付，1：创建子任务，businessType为8；2：指定子任务责任人，businessType为10；3：子任务质押金，businessType为12
              * 2、如果支付时选择为积分支付，则直接进行支付，不需要创建订单，积分支付只能用于创建任务，不能用于指定责任人质押费
              * 3、业务类型：发布任务上链费用积分支付1 发布任务上链费用：2 发布任务赏金：4 创建DAO积分支付：5 创建DAO：6 
              * 发布子任务上链费用积分支付：7 发布子任务上链费用：8 指定子任务责任人积分支付:9 指定子任务责任人：10 发布子任务赏金：12
              * **/
              isApplyListVerify.value = false;
              if(type == 2) {
                if(isIntegral.value) {
                  content = busType+'0'+createNftFee.value+timestamp;
                  reqData = {
                      // businessId: taskId,
                      businessType: busType,
                      businessData: getData,
                      amount: 0,
                      poundage: createNftFee.value,
                      timeStamp: timestamp,
                      sign: computeHmac(content.toString(), userId.toString())
                  };
                } else {
                  content = busType+'0'+createNftFee.value+timestamp;
                  reqData = {
                      // businessId: taskId,
                      businessType: busType,
                      businessData: getData,
                      amount: 0,
                      poundage: createNftFee.value,
                      timeStamp: timestamp,
                      sign: computeHmac(content.toString(), userId.toString())
                  };
                }
                  
              } else if(type == 3) {
                if(isIntegral.value) {
                  content = busType+''+reward.value+ createNftFee.value +timestamp;
                  console.log('合并支付，勾选积分', content);
                  getData.payType = 1;
                  reqData = {
                      // businessId: newDaoId.value,
                      businessData: getData,
                      businessType: busType,
                      amount: reward.value,
                      poundage: createNftFee.value,
                      timeStamp: timestamp,
                      sign: computeHmac(content.toString(), userId.toString())
                  };
                } else {
                  content = busType+''+reward.value+ createNftFee.value +timestamp;
                  console.log('合并支付，不勾选积分', content);
                  getData.payType = 2;
                  reqData = {
                      // businessId: newDaoId.value,
                      businessData: getData,
                      businessType: busType,
                      amount: reward.value,
                      poundage: createNftFee.value,
                      timeStamp: timestamp,
                      sign: computeHmac(content.toString(), userId.toString())
                  };
                }
              }
              
              return new Promise<void>((resolve, reject) => {
                orderSave(reqData).then((response: any) => {
                    const { code, data, message } = response;
                    
                    const resultData = data;
                    if (code !== 200) {
                      showPopup(message, 'error', 3000);
                      return;
                    }
                    
                    orderNo.value = resultData.orderNo;
                    payData.value.payUrl = resultData.qrcode;
                    payData.value.minute = resultData.minute;
                    payData.value.createTime = resultData.createTime;
                    
                    if(type == 2) {
                      payData.value.payAmount = createNftFee.value;
                      if(busType == 9) {
                        isApplyListVerify.value = false;
                        isbusType.value = false;
                        payData.value.isPay = false;
                        findsunTaskListFun();
                      } else if(busType == 10) {
                        payData.value.payAmount = expense.value;
                        isApplyListVerify.value = false;
                        isActive.value = true;
                        payData.value.isPay = true;
                        findOrderResult(type);
                      }
                    }
                    if(type == 3) {
                      if(isIntegral.value) {
                        payData.value.payAmount = createNftFee.value
                      } else {
                        payData.value.payAmount = Number(reward.value) + Number(createNftFee.value);
                      }
                      isActive.value = true;
                      payData.value.isPay = true;
                      findOrderResult(type);
                    }
                    resolve()
                }).catch((error: any) => {
                    reject(error)
                })
              })
          }

          // 查询订单结果
          let timer: number | undefined; // 定义定时器变量
          const findOrderResult = async (type: number) => {
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
                        payData.value.isPay = false;
                        isPayType.value = false;
                        isApplyList.value = false;
                        clearTimeout(timer);
                        isActive.value = false;
                        if(type == 1) {
                          findsunTaskListFun();
                        } else if(type == 2) {
                          findApplyListFun();
                          findsunTaskListFun();
                        } else if(type == 3) {
                          findsunTaskListFun();
                        }
                        findsunTaskListFun();
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
                    clearTimeout(timer);
                    return false;
                  }else {
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

        watch(
          () => [props.daoId, props.missionId, props.missionAdminUserId],
          ([newDaoId, newMissionId, newmissionAdminUserId]) => {
            daoId.value = newDaoId;
            missionId.value = newMissionId;
            missionAdminUserId.value = newmissionAdminUserId;
            findsunTaskListFun();
          }
        );
        
        onMounted(() => {
          findsunTaskListFun();
          initAOS();
        });
        return {
          daoId,
          reward,
          status,
          search,
          missionId,
          hasDraft,
          draftNum,
          applyFor,
          underWay,
          complete,
          userInfo,
          applyId,
          applyName,
          sbumitData,
          subTsskList,
          isApplyList,
          isPayType,
          isIntegral,
          expense,
          orderNo,
          isActive,
          payData,
          TaskExigency,
          TaskComplete,
          createNftFee,
          integralBalance,
          isPointOpen,
          applyListData,
          isApplyListVerify,
          missionAdminUserId,
          parentSearchQuery,
          parentSelectedOption,
          handleSearchQueryUpdate,
          handleSelectedOptionUpdate,
          findEditDraftFun,
          findsunTaskListFun,
          applyToParticipate,
          onClick,
          selectResponsiblePerson,
          handleEnter,
          chooseApply,
          findsbumitApplyClick,
          findsbumitApplySubmit,
          findApplyListFun,
          findGoToPayFun,
          findAggregatePayFun,
          findPayWithPointsFun,
          pointsDeduction,
          findChainBalanceFun,
          findPointIsOpenFun,
          closePayModal,
          findPayNftImmediately,
          findPayThePledgeImmediately,
          findCreateAPaymentPledge,
          findupChainPoundage,
          openPayModal,
          findOrderResult,
          handleExecuteDetails,
          findViewPersonalInfo,
          deleteSubTask
        };
      },
    });
  </script>
   
  <style lang="scss" scoped>
    @use '@/assets/styles/subTaskList.scss';
    @use '@/assets/styles/popupModal.scss';
    @use '@/assets/styles/common.scss';
    * { margin: 0; padding: 0; }
    html,body {
      width: 100%;
      height: 100%;
    }
    .arco-space {
      display: inherit;
    }
    .highlight-lines {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none; /* 禁止事件穿透 */
    }
  </style>: { dataTransfer: { getData: (arg0: string) => string; }; }: number: { dataTransfer: { getData: (arg0: string) => string; }; }: number
  