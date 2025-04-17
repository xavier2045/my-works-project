<template>
  <div class="execute">
    <div class="execute-container">
      <div class="execute-header">
        <persHeader />
      </div>
      <div class="execute-content">
        <div class="execute-content-main">
          <div class="execute-content-main-body">
            <div class="main-body-content">
              <div class="main-body-content-banner">
                <div class="banner-main">
                  <div class="banner-main-cover">
                    <img :src="details.cover" alt="" />
                  </div>
                  <div class="banner-title">DAO</div>
                  <div class="daoType">
                    <template v-if="details.status == 0">
                      <img :src="applyFor" alt="申请中" title="任务申请中" />
                    </template>
                    <template v-if="details.status == 1">
                      <img :src="underWay" alt="进行中" title="任务进行中" />
                    </template>
                    <template v-if="details.status == 2">
                      <img :src="complete" alt="已完成" title="任务已完成" />
                    </template>
                  </div>
                </div>
              </div>
              <div class="main-body-content-timeline">
                <div class="timeline-content"></div>
                <div class="timeline-content-m">
                  <div class="module-heaer">
                    <div class="module-heaer-content">
                      <div class="heaer-content-l">
                        <div class="content-l-m">
                          <div class="currentYear">
                            {{ currentYear }}
                          </div>
                          <div class="data-type">
                            <div class="typeData">
                              <div class="typeData-main">
                                <div 
                                  class="typeData-main-item" 
                                  v-for="(item, index) in typeData" 
                                  :key="index"
                                >
                                  <i class="icon font_family" :class="item.icon"></i>
                                  <span>{{ item.name }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="time-select">
                            <template v-if="ctt == 1">
                              <div class="daoAdmin">
                                <div class="daoAdmin-avatar">
                                  <el-image
                                    :src="daoAdminAvarar"
                                    fit="cover"
                                  >
                                    <template #error>
                                      <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                    </template>
                                </el-image>
                                </div>
                                <div class="daoAdmin-name">{{ daoAdminName }}</div>
                              </div>
                            </template>
                            <template v-else>
                              <TaskSelect
                                :options="selectList"
                                v-model="selectedValue"
                                placeholder="任务责任人"
                                @open="handleOpen" 
                                @close="handleClose"
                                @update:modelValue="updateModelValue"
                              />
                            </template>
                          </div>
                        </div>
                      </div>
                      <div class="time-selece">
                        <div class="timeData">
                          <div class="timeData-main">
                            <div 
                              class="timeData-main-item" 
                              :class="isTime == item.id ? 'active' : ''"
                              v-for="(item, index) in timeData" 
                              @click="findTimeClick(item.id)"
                              :key="index"
                            >
                              {{ item.name }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="module-body">
                    <div class="module-body-content">
                      <div class="module-body-content-timeline">
                        <div class="timeline-main">
                          <div class="timeline-main-legend">
                            <div class="legend-main">
                              <div 
                                class="legend-main-item"
                                v-for="(item, index) in legendList" 
                                :key="index"
                              >
                                <div class="item-main-icon">
                                  <i class="icon font_family" :class="item.icon" />
                                </div>
                                <div class="item-main-name">{{ item.name }}</div>
                              </div>
                            </div>
                          </div>
                          <div class="timeline-main-content">
                            <!-- <ProjectTimeline v-if="progressData.length" :progress="50" :dayProgresses="progressData" /> -->
                            <ProjectTimeline :data="progressData" :filter="isTime" />
                          </div>
                        </div>
                      </div>
                      <div class="module-body-content-avatar">
                        <template v-if="ctt == 1">
                          <el-image
                              :src="progreasAvatar"
                              fit="cover"
                            >
                              <template #error>
                                <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                              </template>
                          </el-image>
                        </template>
                        <template v-else>
                          <el-image
                              :src="progreasAvatar"
                              fit="cover"
                            >
                              <template #error>
                                <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                              </template>
                          </el-image>
                        </template>
                      </div>
                    </div>
                  </div>
                  <div class="module-footer">
                    <div class="module-footer-content">
                      <div class="content-btn">
                        <!-- // ctt // 1 大任务发布者查看个人，2 大任务发布者查看全部，3 Dao管理员查看所有，4 子任务发布者查看个人， 5 路人查看全部 -->
                        <template v-if="ctt == 3 || ctt == 4">
                          <div
                            class="item-button ae-btn"
                            v-for="(item, index) in filteredPopupList"
                            :key="index"
                            @click="openPopupClick(item.id)"
                          >
                            {{ item.name }}
                          </div> 
                        </template>
                      </div>
                    </div>
                    <div class="select-user">
                      <div class="user-content">
                        <div class="user-avatar">
                          <el-image
                            :src="taskUserAvatar"
                            fit="cover"
                          >
                            <template #error>
                              <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                            </template>
                          </el-image>
                        </div>
                        <div class="user-info">
                          <div class="userName multi-line-1">{{ taskUserName }}</div>
                          <div class="userUuid multi-line-1">{{ taskUserUuid }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="main-body-content-footer">
                <div class="footer-content">
                  <div class="content-data-list">
                    <div class="list-title">任务数据</div>
                    <div
                      class="content-data-list-bg"
                      :class="ctt !== 1 ? 'ctt_small_bg' : 'ctt_big_bg'"
                    >
                      <div class="list-item-main">
                        <div class="filterList-selece">
                          <div
                            class="list-item-main-content"
                            :class="isDataType == index? 'flag' : ''"
                            @click="finFilterListFun(item, index)"
                            v-for="(item, index) in dataTypeList"
                            :key="index"
                          >
                            <div class="content-item-icon">
                              <i class="icon font_family" :class="item.icon"></i>
                            </div>
                          </div>
                        </div>
                        <div class="filterList-list">
                          <div class="filterList-list-main">
                            <template v-if="isDataType == 0">
                              <FormNodeList 
                                :type= "ctt"
                                :refresh="refreshFormNodeList"
                                @update:content="openNodeListClick"
                              />
                            </template>
                            <template v-else-if="isDataType == 1">
                              <div class="filter-criteria">
                                <FormProposalList
                                  :type= "ctt"
                                  :refresh="refreshFormProList"
                                  @update:content="openProposalListClick"
                                />
                              </div>
                            </template>
                            <template v-else-if="isDataType == 2">
                              <div class="filter-criteria">
                                <FormKbList
                                  :type= "ctt"
                                  :refresh="refreshFormKbList"
                                  @update:content="openKbListClick"
                                />
                              </div>
                            </template>
                            <template v-else-if="isDataType == 3">
                              <div class="filter-criteria">
                                <FormKbList />
                              </div>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <template v-if="ctt !== 1">
                    <div class="footer-right">
                      <div class="footer-right-content">
                        <div class="rtsk-module">
                          <div class="rtsk-module-main">
                            <div class="rtsk-module-title">
                              推荐任务
                            </div>
                            <div class="rtsk-module-content">
                              <Carousel
                                :images="carouselSlides"
                                :direction="direction"
                                :interval="interval"
                                @item-click="handleSlideClick"
                              />
                              <!-- <Carousel 
                                :images="carouselSlides" 
                                type="fade"
                                :interval="5000"
                                @item-click="handleSlideClick"
                              /> -->
                            </div>
                          </div>
                        </div>
                        <div class="taskp-module">
                          <div class="taskp-module-main">
                            <div class="taskp-module-title">
                              任务进程
                            </div>
                            <div class="taskp-module-content">
                              <div class="task-progress overflowYAuto">
                                <div 
                                  class="task-progress-item"
                                  v-for="(item, index) in details.taskProgress"
                                  :key="index"
                                >
                                  <div class="task-progress-bar">
                                    <ProgressWithAvatars
                                      :progress="Number(item.progress)" 
                                      :avatars="item.taskAdminUserAvatar"
                                      :barHeight="30"
                                      :name="item.taskName"
                                      :baseColor="'rgba(69, 65, 58, 0.5)'"
                                      :gradientColors="['rgba(106, 53, 234, .6)', 'rgb(107, 52, 234, 1)']" 
                                    />
                                  </div>
                                  <div class="task-progress-icon">
                                    <img :src="complete" alt="" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="execute-content-main-sidebar">
            <div class="sidebar-content">
              <div class="sidebar-content-t">
                <div class="sidebar-content-t-main">
                  <div class="latest-node">
                    <div class="latest-node-main">
                      <div class="latest-node-title">
                        最新节点
                      </div>
                      <div class="latest-node-content">
                        <Carousel
                          :images="latestNodes"
                          :direction="'horizontal'"
                          :interval="interval"
                          @item-click="handleSlideClick"
                        />
                        <!-- <Carousel 
                            :images="latestNodes" 
                            type="slide"
                            :interval="5000"
                            @item-click="handleSlideClick"
                          /> -->
                      </div>
                    </div>
                  </div>
                  <div class="latest-proposal">
                    <div class="latest-proposal-main">
                      <div class="latest-proposal-title">
                        最新提案
                      </div>
                      <div class="latest-proposal-content">
                        <Carousel
                          :images="latestProposals"
                          :direction="'horizontal'"
                          :interval="interval"
                          @item-click="handleSlideClick"
                        />
                        <!-- <Carousel 
                                :images="latestProposals" 
                                type="stacked"
                                :interval="5000"
                                @item-click="handleSlideClick"
                              /> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="sidebar-content-c">
                <!-- 用户互联 -->
                <img src="@/assets/images/common/default.png" alt="Default Image" />
              </div>
              <div class="sidebar-content-b">
                <template v-if="ctt == 1">
                  <div class="rtsk-module">
                    <div class="rtsk-module-main">
                      <div class="rtsk-module-title">
                        推荐任务
                      </div>
                      <div class="rtsk-module-content">
                        <Carousel
                          :images="carouselSlides"
                          :direction="direction"
                          :interval="interval"
                          @item-click="handleSlideClick"
                        />
                        <!-- <Carousel 
                                :images="carouselSlides" 
                                type="stacked"
                                :interval="5000"
                                @item-click="handleSlideClick"
                              /> -->
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="team-member">
                    <div class="team-member-main">
                      <div class="team-member-title">团队成员</div>
                      <div class="team-member-content">
                        <div class="team-member-content-main overflowYAuto">
                          <div 
                            class="team-member-item"
                            v-for="(item, index) in details.daoMembers" 
                            :key="index"
                          >
                            <div class="team-member-item-main">
                              <div class="team-member-item-tag" v-if="item.tag !== null">
                                <template v-if="item.tag == 1">卓越执行</template>
                                <template v-else-if="item.tag == 2">卓越执行</template>
                                <template v-else-if="item.tag == 3">探索之眼</template>
                              </div>
                              <div class="team-member-item-avatar">
                                <el-image
                                  :src="item.userAvatar"
                                  fit="cover"
                                >
                                  <template #error>
                                    <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                  </template>
                                </el-image>
                                <div class="team-member-item-tag-masking">
                                  <template v-if="item.tag == 1">
                                    <img src="@/assets/images/task/zyzx.png" alt="节点:卓越执行" />
                                  </template>
                                  <template v-else-if="item.tag == 2">
                                    <img src="@/assets/images/task/cyxf.png" alt="提案：创意先锋" />
                                  </template>
                                  <template v-else-if="item.tag == 3">
                                    <img src="@/assets/images/task/tszy.png" alt="知识库：探索之眼" />
                                  </template>
                                </div>
                              </div>
                              <div class="team-member-item-name">{{ item.username }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 上传节点 -->
    <NodeModal
      v-if="isNodeModalVisible"
      :type="nodeType"
      :isVisible="isNodeModalVisible"
      :initialContent="nodeContent"
      :daoId="daoId"
      :missionId="missionId"
      :maxLength="200"
      @update:content="updateNodeContent"
      @close="closeNodeBase"
    />
    <!-- 提案 弹窗 -->
    <Proposal
      v-if="isEditorVisible" 
      :isVisible="isEditorVisible"
      :initialContent="content"
      :maxLength="200"
      :daoId="daoId"
      :missionId="details.missionId"
      type="2"
      @update:content="updateContent"
      @close="closeEditor"
    />
    <!-- 奇点 弹框 -->
    <KnowledgeBase
      v-if="isKnowledVisible"
      :type="knowledType"
      :isVisible="isKnowledVisible"
      :initialContent="kbContent"
      :daoId="daoId"
      :missionId="missionId"
      :maxLength="200"
      @update:content="updateKbContent"
      @close="closeKnowledgeBase"
    />
    <!-- 节点详情 -->
    <NodeDetails
      v-if="isNodeDetailsVisible"
      :nodeId="proNodeId"
      :daoId="daoId"
      :type= "ctt"
      @close="closeNodeDetails"
    />

    <ProposalDetails
      v-if="isProposalDetailsVisible"
      :proId="proPropoaslId"
      :daoId="daoId"
      :type= "ctt"
      @close="closeProposalDetails"
    />
    <KbDetails
      v-if="isKbDetailsVisible"
      :proId="proKbId"
      :daoId="daoId"
      :type= "ctt"
      @close="closeKbDetails"
    />
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { extractIdFromUrl, getItem, setItem } from '@/utils/index';
  import { aeUseStore } from '@/stores/user';
  import { showPopup } from '@/utils/usePopup';
  import { proposalsSave, daosTasksGetDetail, proposaproposalsVotelsSave, nodeDataAdd, knowledgeAdd } from '@/api/dao';

  import { missionsDashboard, missionsDaosTasksDrop, missionsProgress, missionsDaosTasksProgress } from '@/api/kanban';

  import persHeader from '@/components/header/persHeader.vue';
  import Statistic from '@/components/statisticModule/statistic.vue';
  import Evaluate from '@/components/evaluate/index.vue';
  import NodeModal from '@/components/popUp/node/index.vue';
  import Proposal from '@/components/popUp/proposal/index.vue';
  import KnowledgeBase from '@/components/popUp/knowledgeBase/index.vue';
  import CountdownComponent from '@/components/CountdownComponent/index.vue';
  import ProjectTimeline from '@/components/ProjectTimeline/index2.vue';
  import nodeItem from '@/assets/images/dao/node_item.png';
  import NodeDetails from '@/components/task/detailsModal/nodeDetails.vue';
  import ProposalDetails from '@/components/task/detailsModal/proposalDetails.vue';
  import KbDetails from '@/components/task/detailsModal/kbDetails.vue';
  import TaskSelect from '@/components/TreeSelect/taskSelect.vue';
  import FormProposalList from '@/components/formList/formProposalList.vue';
  import FormNodeList from '@/components/formList/formNodeList.vue';
  import FormKbList from '@/components/formList/formKbList.vue';
  import Carousel from '@/components/carousel/index.vue';
  import ProgressWithAvatars from '@/components/progress/progressWithAvatars.vue';
  
  
  import applyFor from '@/assets/images/task/applyFor.png';
  import complete from '@/assets/images/task/complete.png';
  import underWay from '@/assets/images/task/underWay.png';


  const router = useRouter();
  const missionId = ref('');
  const daoId = ref('');
  const nodeId = ref(''); // 未提交的节点id
  const proNodeId = ref(''); // 节点详情id
  const proPropoaslId = ref(''); // 提案详情id
  const proKbId = ref(''); // 奇点详情id
  const progressData = ref([]);

  const nodeData = ref({}); // 节点详情数据 
  const isNodeDetailsVisible = ref(false); // 节点详情弹窗
  const isProposalDetailsVisible = ref(false); // 提案详情弹窗
  const isKbDetailsVisible = ref(false); // 奇点详情弹窗
  const currentYear = new Date().getFullYear(); // 当前年份
  const taskUserAvatar = ref(''); // 子任务用户头像
  const taskUserName = ref(''); // 子任务用户名称
  const taskUserUuid = ref(''); // 子任务用户uuid
  const knowledType = ref(0); // 判断当前登录人角色进行奇点类型传参
  const ctt = ref(1); // 1 大任务发布者查看个人，2 大任务发布者查看全部，3 Dao管理员查看所有，4 子任务发布者查看个人， 5 路人查看全部
  const daoAdminName = ref('');
  const daoAdminUserId = ref('');
  const daoAdminAvarar = ref('');
  const direction = ref('vertical'); // 可选值: 'horizontal' 或 'vertical'
  const interval = ref(3000); // 轮播间隔时间，单位为毫秒
  const progreasAvatar = ref(''); // 进度封面
  const nodeType = ref(0); // 判断谁提交节点
  const latestNodes = ref([]); // 最新节点
  const latestProposals = ref([]); // 最新节点

  const details = ref({
    missionId: null as number | null,
    cover: '',
    taskMode: null as number | null,
    daoId: null as number | null,
    status: null as number | null,
    latestNodes:	[],
    latestProposals:	[],
    taskProgress:	[],
    DaoMember: [],
  });
  console.log('details', details);

  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;
  console.log('userInfo', userInfo);

  const typeData = ref([
    { name: '知识库', icon: 'icon-suipian24' },
    { name: '提案', icon: 'icon-tian24' },
    { name: '节点', icon: 'icon-jiedian24_1' },
  ]);
  const legendList = ref([
    { name: '通过', id: 3, icon: 'icon-kongxinyuanquan20' },
    { name: '修改', id: 1, icon: 'icon-xiugaizhong20' },
    { name: '拒绝', id: 2, icon: 'icon-shenhebutongguo20' }
  ]);

  const isTime = ref("day");
  const timeData = ref([
    { name: '日', id: "day" },
    { name: '周', id: "week" },
    { name: '月', id: "month" },
  ]);
  const findTimeClick = (id: string) => {
    isTime.value = id;
    // if(id === 1) {
    //   progressData.value =  details.value.dayProgresses;
    // } else if(id === 2) {
    //   progressData.value =  details.value.weekProgresses;
    // } else if(id === 3) {
    //   progressData.value =  details.value.monthProgresses;
    // }
  };


  // 获取详情数据
  const getSubTaskDetails = () => {
    let reqData = {
      id: userInfo.missionId,
      isCreator: ctt.value == 1 ? 1 : ''
    }
    return new Promise<void>((resolve, reject) => {
      missionsDashboard(reqData).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        const res = response.data;

        // 最新节点
        if(res.latestNodes.length > 0) {
          let arrt: {}[] = [];
          res.latestNodes.forEach((item: any) => {
            let obj = {};
            obj.id = item.nodeDataId;
            obj.avatar = item.cover;
            obj.name = '';
            obj.type = 1;
            arrt.push(obj);
          })
          latestNodes.value = arrt;
        }

        // 最新提案
        if(res.latestProposals.length > 0) {
          let arrt2: {}[] = [];
          res.latestProposals.map((item: any) => {
            let obj2 = {};
            obj2.id = item.nodeDataId;
            obj2.avatar = item.cover;
            obj2.name = '';
            obj2.type = 1;
            arrt2.push(obj2);
          })
          latestProposals.value = arrt2;
        }

        details.value = res;
        daoId.value = details.value.daoId + '';
        missionId.value = res.missionId;
        console.log('details.value3', details.value);
        if( ctt.value == 4) { 
          missionId.value = userInfo.taskId;
        };
        if(res.taskProgress !== null){
          if(res.taskProgress.length > 0) {
            res.taskProgress.forEach((item: any) => {
              if(item.taskAdminUserId == userInfo.id) {
                
              }
            })
          } 
        }
        
        // ctt // 1 大任务发布者查看个人，2 大任务发布者查看全部，3 Dao管理员查看所有，4 子任务发布者查看个人， 5 路人查看全部
        if(ctt.value == 1 || ctt.value == 3) {
          findMissionsProgressFun(userInfo.missionId);
        } else {
          const currentUrl = window.location.href; // 获取当前页面的 URL
          let id = extractIdFromUrl(currentUrl)+'';
          findMissionsDaosTasksProgressFun(id);
          // findMissionsDaosTasksProgressFun(userInfo.daoAdminUserId);
        }
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  }
  
  // 任务看板用户记录-大任务
  const findMissionsProgressFun = (val: any) => {
    let reqData = {
      id: val
    }
    return new Promise<void>((resolve, reject) => {
      missionsProgress(reqData).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        const res = response.data;
        progressData.value = res;
        progreasAvatar.value = res.cover;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  }

  // 任务看板用户记录-子任务
  const findMissionsDaosTasksProgressFun = (val: any) => {
    let reqData = {
      id: val
    }
    return new Promise<void>((resolve, reject) => {
      missionsDaosTasksProgress(reqData).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        const res = response.data;
        progressData.value = res;
        progreasAvatar.value = res.cover;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  }

  // 筛选子任务
  const isSort = ref(false);
  const selectList = ref([]);
  const selectedValue = ref<string>('');
  // 列表下拉子任务数据
  const findMissionsDaosTasksDropFun = () => {
    let reqData = {
          businessId: userInfo.missionId,
          businessType: 1,
        }
        return new Promise<void>((resolve, reject) => {
          missionsDaosTasksDrop(reqData).then((response: any) => {
                const { code, data, message } = response;
                
                const resultData = data;
                if (code !== 200) {
                  showPopup(message, 'error', 3000);
                    return;
                }

                resultData.map((item: any) => {
                    item.value = item.jobId;
                    item.label = item.jobName;
                    item.avatar = item.adminAvatar;
                })

                selectList.value = resultData;
                // ctt // 1 大任务发布者查看个人，2 大任务发布者查看全部，3 Dao管理员查看所有，4 子任务发布者查看个人， 5 路人查看全部
                if(ctt.value == 1 || ctt.value == 3) {
                  daoAdminName.value = resultData[0].jobName;
                  daoAdminUserId.value = resultData[0].jobId; 
                  daoAdminAvarar.value = resultData[0].adminAvatar;

                  taskUserName.value = resultData[0].jobName;
                  taskUserUuid.value = resultData[0].adminUserId;
                  taskUserAvatar.value = resultData[0].adminAvatar;
                    
                } else if( ctt.value == 4) {
                  daoAdminUserId.value = userInfo.taskId;
                }
                console.log('daoAdminUserId', daoAdminUserId.value);
                resolve()
            }).catch((error: any  ) => {
                reject(error)
            })
        })
  }

  // 筛选列表
  const updateModelValue = (val: string) => {
    console.log('下拉框的选项', val);
    let userType = '';
    let taskId = '';
    selectList.value.forEach((item: any) => {
      if(item.value == val) {
        userType = item.type;
        taskId = item.jobId;
        taskUserAvatar.value = item.adminAvatar;
        taskUserName.value = item.jobName;
        taskUserUuid.value = item.adminUserId;
      }
    })
    // 	1.大任务 2.DAO 3.子任务
    if(userType == '1' || userType == '2') {
      findMissionsProgressFun(taskId);
    } else {
      findMissionsDaosTasksProgressFun(taskId);
    }
  };

  // 展开时添加背景色
  const handleOpen = () => {
    isSort.value = true;
  };
  // 展开时移除背景色
  const handleClose = () => {
    isSort.value = false;
  };

  // 推荐任务
  const carouselSlides = ref(
    [
      {
        avatar: 'https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/03/17/1742180138949-xzg_488450.png',
        name: '推荐任务一',
        id: 1,
        type: 0
      },
      {
        avatar: 'https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/03/05/1741165247567-medusa-1366362.jpg',
        name: '推荐任务二',
        id: 2,
        type: 0
      },
      {
        avatar: 'https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/03/05/1741160699056-tunnel-6344390.jpg',
        name: '推荐任务三',
        id: 3,
        type: 0
      }
    ]
  );
  const handleSlideClick = (index: number) => {
    console.log('Slide clicked:', index);
  };




  // 上传节点提案奇点按钮
  const popupList = ref([
    { name: '上传节点', id: 1 },
    { name: '发起提案', id: 2 },
    { name: '上传奇点', id: 3 },
  ]);
  const filteredPopupList = computed(() => {
    return popupList.value.filter((item, index) => !(ctt.value == 3 && index == 1));
  });

  // 点击打开上传弹框
  const openPopupClick = (type: number) => {
    if(type == 1) {
      isNodeModalVisible.value = true;
    } else if(type == 2) {
      isEditorVisible.value = true;
    } else if(type == 3) {
      isKnowledVisible.value = true;
    }
  };

  // 任务数据模块
  const dataTypeList = ref([
    { id: '1', name: '节点', icon: 'icon-a-jiedian243', isActive: false },
    { id: '2', name: '提案', icon: 'icon-tian24', isActive: false },
    { id: '3', name: '奇点', icon: 'icon-suipian24', isActive: false },
    { id: '4', name: '标记', icon: 'icon-biaoji20', isActive: false },
  ])

  // 筛选列表
  const isDataType = ref(0);
  const finFilterListFun = (item: any, index: number) => {
    console.log(item);
    isDataType.value = index;
  };

  // 格式化数字
  const formatValue = (value: number) => {
      return Number(value).toFixed(3);
  }

  // 返回上一页
  const goBack = () => {
    router.go(-1);
  };

  const formatDate = (time: string) => {
    const date = new Date(time);
    return `${date.getMonth() + 1}.${date.getDate()}`;
  };
  const formatDates = (time: string) => {
    const date = new Date(time);
    return `${date.getFullYear()}`;
  };

   // 打开子任务详情
  const openDetails = () => {
    const currentUrl = window.location.href; // 获取当前页面的 URL
    let id = extractIdFromUrl(currentUrl)+'';
    userInfo.subTaskType = 1;
    setItem('subTaskType', 1);
    router.push({ name: 'subTaskDetails', params: { id: id} })
  };

  // 打开大任务详情
  const skipRouteTask = () => {
    let id = details.value.missionId;
    router.push({ name: 'TataskDetails', params: { id } });
  };

  // 打开消息通知弹框
  const handShowMsgModalFun = () => {
    userInfo.isMsgShow = !userInfo.isMsgShow;
  };


  // 节点操作模块
  const isNodeModalVisible = ref(false); // 是否显示节点操作弹窗
  const uploadNode = () => {
    isNodeModalVisible.value = true;
  };

  // 节点
  const nodeContent = ref<string>('');
  // 提交节点
  const updateNodeContent = (newContent: any) => {
    console.log('newContent', newContent);
    return new Promise<void>((resolve, reject) => {
      nodeDataAdd(newContent).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        getSubTaskDetails();
        refreshFormNodeList.value = !refreshFormNodeList.value;
        isNodeModalVisible.value = false;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  }
  // 关闭节点
  const closeNodeBase = () => {
    isNodeModalVisible.value = false;
  };

  // 节点列表点击查看节点详情
  const openNodeListClick = (item: any) => {
    proNodeId.value = item;
    isNodeDetailsVisible.value = true;
  }
  // 关闭节点审核
  const refreshFormNodeList = ref(false);
  const closeNodeDetails = () => {
    refreshFormNodeList.value = !refreshFormNodeList.value;
    isNodeDetailsVisible.value = false;
  };

  // 节点查看更多
  const handleRouterNode = () => {
    const currentUrl = window.location.href; // 获取当前页面的 URL
    // 管理员进入传daoid，子任务进去传子任务id
    let id = '';
    if(userInfo.id == details.value.missionAdminUserId) {
      id = daoId.value;
      userInfo.nodeType = 3;
    } else {
      id = extractIdFromUrl(currentUrl)+'';
      userInfo.nodeType = 2;
    }
    
    router.push({ name: 'NodeList', params: { id: id} })
  };

  // 点击列表查看详情
  const handleRouterNodeDetail = (item: any) => {
    const currentUrl = window.location.href; // 获取当前页面的 URL
    let id = extractIdFromUrl(currentUrl)+'';
    let nodeId = item.id;
    userInfo.businessId = id;
    setItem('businessId', id);
    userInfo.nodeType = 2;
    setItem('nodeType', 2);
    router.push({ name: 'NodeDetails', params: { id: nodeId} })
  }

  // 提案
  /**  倒计时结束回调 **/
  const hiddenTime = ref(false);
  const handleCountdownFinished = () => {
    console.log('倒计时结束');
    hiddenTime.value = true;
    isAgrees.value = true;
  };

  // 处理投票的回调
  const votedResult = ref(0);  // 选择的结果
  const isAgrees = ref(true);  // 已经选择过禁止选择
  const handleVote = (result: string, id: any) => {
    
    ;
    votedResult.value = result === 'like' ? 1 : 0;
    console.log('proposalId.value', id);
    let reqData = {
      proposalId: id,
      isAgree: votedResult.value
    }
    console.log('reqData', reqData);
    return new Promise<void>((resolve, reject) => {
      proposaproposalsVotelsSave(reqData).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        
        isAgrees.value = true;
        showPopup('投票成功', 'success', 3000);
        getSubTaskDetails();
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
    
  };
    
  // 发起提案
  const isEditorVisible = ref(false);
  const content = ref<string>('');
  // 打开编辑器
  const openEditor = () => {
    isEditorVisible.value = true;
  };

  // 关闭编辑器
  const closeEditor = () => {
    console.log('closeEditor方法被调用')
    isEditorVisible.value = false;
  };

  // 发起提案
  const updateContent = (newContent: any) => {
    // content.value = newContent.content;
    console.log('content.value', newContent.value);
    newContent.missionId = details.value.missionId;
    // delete newContent.daoId;
    return new Promise<void>((resolve, reject) => {
      proposalsSave(newContent).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        refreshFormProList.value = !refreshFormProList.value;
        getSubTaskDetails();
        isAgrees.value = false;
        isEditorVisible.value = false;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

  // 跳转到提案列表
  const handleRouterProposal = () => {
    console.log('daoId.value',daoId.value);
    userInfo.proposalType = 1;
    userInfo.missionMode = details.value.missionMode;
    userInfo.missionCreateUserId = details.value.missionCreateUserId;
    setItem('missionMode', details.value.missionMode);
    setItem('missionCreateUserId', details.value.missionCreateUserId);
    router.push({ name: 'Proposal', params: { id: daoId.value} })
  };

  // 提案列表点击查看提案详情
  const openProposalListClick = (item: any) => {
    proPropoaslId.value = item;
    isProposalDetailsVisible.value = true;
  }
  // 关闭提案详情
  const refreshFormProList = ref(false);
  const closeProposalDetails = () => {
    refreshFormProList.value = !refreshFormProList.value;
    isProposalDetailsVisible.value = false;
  };

  // 奇点
  // 发起奇点
  const isKnowledVisible = ref(false);
  const kbContent = ref<string>('');
  // 提交知识库
  const updateKbContent = (newContent: any) => {
    console.log('newContent', newContent);
    newContent.missionId = missionId.value;
    // ctt // 1 大任务发布者查看个人，2 大任务发布者查看全部，3 Dao管理员查看所有，4 子任务发布者查看个人， 5 路人查看全部
    if(userInfo.id == userInfo.bigTaskUserId) {
      if(userInfo.isMissKanbanType == 1) {
        ctt.value = 1;
      } else {
        ctt.value = 2;
      }
      newContent.businessType = 3;
    } else if(userInfo.id == userInfo.daoAdminUserId) {
      ctt.value = 3;
      nodeType.value = 1;
      newContent.businessType = 3;
    } else if(userInfo.id == userInfo.subtaskAdminUserId) {
      ctt.value = 4;  
      nodeType.value = 2;
      newContent.businessType = 1;
      newContent.missionId = daoId.value;
      newContent.businessId = daoId.value;
    } else {
      ctt.value = 5;
    }
    
    return new Promise<void>((resolve, reject) => {
      knowledgeAdd(newContent).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        getSubTaskDetails();
        isKnowledVisible.value = false;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  }
  // 关闭团队知识库
  
  const closeKnowledgeBase = () => {
    isKnowledVisible.value = false;
  };
  // 奇点列表点击查看奇点详情
  const openKbListClick = (item: any) => {
    proKbId.value = item;
    isKbDetailsVisible.value = true;
  }
  
  // 关闭奇点详情
  const refreshFormKbList = ref(false);
  const closeKbDetails = () => {
    refreshFormKbList.value = !refreshFormKbList.value;
    isKbDetailsVisible.value = false;
  };


  // 退出任务
  const isexitTask = ref(true);
  const auditRemark = ref('');
  const exitTask = () => {
    isexitTask.value = true;
  }
  const handSubmitExitTask = () => {
    let getData = {
      missionId: missionId.value,
      isExit: 1
    }
    return new Promise<void>((resolve, reject) => {
      proposalsSave(getData).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }

        getSubTaskDetails();
        isEditorVisible.value = false;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };


  onMounted(() => {
    /**
    *bigTaskUserId // 大任务发布者id
    *daoAdminUserId // Dao管理id
    *subtaskAdminUserId // 子任务管理id
    *isMissKanbanType // 1：大任务发布者通过查看节点、查看提案进去看板；2：大任务发布者从进入任务进去看板
    *ctt // 1 大任务发布者查看个人，2 大任务发布者查看全部，3 Dao管理员查看所有，4 子任务发布者查看个人， 5 路人查看全部
    **/
    if(userInfo.id == userInfo.bigTaskUserId) {
      if(userInfo.isMissKanbanType == 1) {
        ctt.value = 1;
      } else {
        ctt.value = 2;
      }
      selectedValue.value = userInfo.bigTaskUserId;
    } else if(userInfo.id == userInfo.daoAdminUserId) {
      ctt.value = 3;
      nodeType.value = 1;
      selectedValue.value = userInfo.daoAdminUserId;
    } else if(userInfo.id == userInfo.subtaskAdminUserId) {
      ctt.value = 4;  
      nodeType.value = 2;
      selectedValue.value = userInfo.subtaskAdminUserId;
    } else {
      ctt.value = 5;
    }
    getSubTaskDetails();
    findMissionsDaosTasksDropFun();
  });
</script>

<style lang='scss' scoped>
  @use '@/assets/styles/common.scss';
  @use '@/assets/styles/executeDetails.scss';
</style>
