<template>
  <div class="taskList">
    <persHeader />
    <div class="taskList-container">
      <div class="taskList-header">
        <div class="taskList-header-flex">
          <div class="taskList-header-flex-r">
            <div class="taskList-header-flex-r-main">
              <div class="personal-list-sort relievoShadow">
                <div class="personal-list-sort-main ">
                  <!-- <div class="sort-icon"> 
                    <i class="icon font_family icon-suoyouhuodong20"></i>
                  </div> -->
                  <div class="sort-select">
                    <TreeSelect
                      :options="taskStatus"
                      v-model="taskData.taskStatus"
                      placeholder="我的任务"
                      @selected="onSelected"
                    />
                  </div>
                </div>
              </div>
              <!-- <div class="personal-list-sort">
                <div class="personal-list-sort-main">
                  <div class="sort-icon">
                    <i class="icon font_family icon-shaixuan20"></i>
                  </div>
                  <div class="sort-select">
                    <TreeSelect
                      :options="screenData"
                      v-model="taskData.screenData"
                      placeholder="筛选与排序"
                    />
                  </div>
                </div>
              </div> -->
            </div>
          </div>
          <div class="taskList-header-flex-c"></div>
          <div class="taskList-header-flex-l">
            <div class="taskList-header-flex-l-main">
              <div
                class="flex-l-main-typeList"
                :class="{ active: type.value === isType}"
                v-for="(type, index) in typeList"
                :key="index"
                @click="findTypeFun(type)"
              >
                <div class="flex-l-main-typeList-item">
                  <div class="flex-l-main-typeList-item-icon">
                    <i :class="`icon font_family ${type.icon}`"></i>
                  </div>
                  <div class="flex-l-main-typeList-item-text">{{ type.label }}</div>
                  <div class="flex-l-main-typeList-item-line">
                    <template v-if="type.value === '1'"> {{ taskData.concern }} </template>
                    <template v-else-if="type.value === '2'"> {{ taskData.ongoing }} </template>
                    <template v-else> {{ taskData.completed }} </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="taskList-content" data-aos="fade-up">
        <div class="taskList-content-main">
          <infinite-scroll-list
            :fetchFunction="fetchNews"
            :hasMore="hasMore"
            :filterCriteria="currentFilterCriteria"
          >
            <template #item="{ items }">
              <wc-waterfall :gap="30" :cols="4">
                <div 
                  v-for="(item, index) in items" 
                  :key="item.missionId" 
                  class="list-item fade-up-item"
                  @click="toTaskDetail(item.missionId, index)"
                >
                  <div class="subTask-item-type">
                    <template v-if="item.isUrgent == 1">
                      <img :src="TaskExigency" alt="紧急" title="紧急任务" />  
                    </template>
                    <template v-if="item.status == 2">
                      <img :src="TaskComplete" alt="完成" title="任务已完成" />
                    </template>
                  </div>
                  <template v-if="hasDraft == 1">
                    <template v-if="index == 0">
                      <div class="list-item-main">
                          <div class="list-item-main-img">
                            <el-image
                              style="width: 100%; height: 100%"
                              :src="item.cover"
                              fit="cover"
                            >
                              <template #error>
                                <img src="@/assets/images/common/default.png" alt="Default Image" />
                              </template>
                            </el-image>
                          </div>
                          <div class="activities-draft">
                            <div class="activities-draft-main">
                              <div class="activities-draft-main-icon">
                                <i class="icon font_family icon-lianjie24"></i>
                              </div>
                              <div class="activities-draft-main-text">草稿箱·{{ draftNum || 0 }}</div>
                            </div>
                          </div>
                          <div class="list-item-main-content">
                            <div class="item-content-info">
                              <div class="item-content-name">{{ item.name }}</div>
                              <div class="item-content-taskId">
                                <div class="item-content-taskId-id">创建时间：{{ item.createTime }}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </template>
                    <template v-else>
                      <template v-if="item.cover !== ''">
                        <div class="list-item-main">
                          <div class="list-item-main-img">
                            <el-image
                              style="width: 100%; height: 100%"
                              :src="item.cover"
                              fit="cover"
                            >
                              <template #error>
                                <img src="@/assets/images/common/default.png" alt="Default Image" />
                              </template>
                            </el-image>
                          </div>
                          <div class="list-item-main-content">
                            <div class="item-content-info">
                              <div class="item-content-name">{{ item.name }}</div>
                              <div class="item-content-taskId">
                                <div class="item-content-taskId-id">任务ID：{{ item.missionId }}</div>
                                <div class="item-content-taskId-cmtcnt">
                                  <div class="item-content-taskId-cmtcnt-item">
                                    <div class="item-content-taskId-cmtcnt-item-icon">
                                      <!-- 0 未启动 1执行中 2已完成 3暂停 4取消  -->
                                      <template v-if="item.status === 0">
                                        <i class="icon font_family icon-shaloushijian24"></i>
                                      </template>
                                      <template v-else-if="item.status === 1">
                                        <i class="icon font_family icon-jinhangzhong"></i>
                                      </template>
                                      <template v-else-if="item.status === 2">
                                        <i class="icon font_family icon-gouxuanyuanxingbiankuang24"></i>
                                      </template>
                                      <template v-else-if="item.status === 3">
                                        <i class="icon font_family icon-shaloushijian24"></i>
                                      </template>
                                      <template v-else-if="item.status === 4">
                                        <i class="icon font_family icon-dachayuanxingbiankuang68"></i>
                                      </template>
                                    </div>
                                    <div class="item-content-taskId-cmtcnt-item-num">
                                      <template v-if="item.status === 0">
                                        未开始
                                      </template>
                                      <template v-else-if="item.status === 1">
                                        执行中
                                      </template>
                                      <template v-else-if="item.status === 2">
                                        已结束
                                      </template>
                                      <template v-else-if="item.status === 3">
                                        暂未开启
                                      </template>
                                      <template v-else-if="item.status === 4">
                                        已取消
                                      </template>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="item-content-flex">
                                <div class="item-content-participant">
                                  <div class="item-content-participant-num">
                                    <template v-if="item.no < 1">
                                      暂无人接收任务
                                    </template>
                                    <template v-else>
                                      <template v-if="item.status === 0">
                                        <em>{{ item.no }}</em>人已申请任务
                                      </template>
                                      <template v-else-if="item.status == 2">
                                      <em>{{ item.partCnt }}</em>人已执行任务
                                    </template>
                                      <template v-else>
                                        <em>{{ item.no }}</em>人参与任务
                                      </template>
                                    </template>
                                  </div>
                                  <div 
                                    class="item-content-participant-user"
                                    v-if="item.users !== null && item.users.length > 0"
                                  >
                                    <div
                                      class="user-list"
                                      v-for="(user, index) in item.users.slice(0, 3)"
                                      :key="index"
                                    >
                                      <img :src="user.avatar" alt="" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="list-item-main">
                          <div class="list-item-main-content posInit">
                            <div class="item-content-info">
                              <div class="item-content-name">{{ item.name }}</div>
                              <div class="item-content-taskId">
                                <div class="item-content-taskId-id">任务ID：{{ item.missionId }}</div>
                                <div class="item-content-taskId-cmtcnt">
                                  <div class="item-content-taskId-cmtcnt-item">
                                    <div class="item-content-taskId-cmtcnt-item-icon">
                                      <!-- 0 未启动 1执行中 2已完成 3暂停 4取消  -->
                                      <template v-if="item.status === 0">
                                        <i class="icon font_family icon-shaloushijian24"></i>
                                      </template>
                                      <template v-else-if="item.status === 1">
                                        <i class="icon font_family icon-renwujinhangzhong44"></i>
                                      </template>
                                      <template v-else-if="item.status === 2">
                                        <i class="icon font_family icon-gouxuanyuanxingbiankuang24"></i>
                                      </template>
                                      <template v-else-if="item.status === 3">
                                        <i class="icon font_family icon-shaloushijian24"></i>
                                      </template>
                                      <template v-else-if="item.status === 4">
                                        <i class="icon font_family icon-dachayuanxingbiankuang68"></i>
                                      </template>
                                    </div>
                                    <div class="item-content-taskId-cmtcnt-item-num">
                                      <template v-if="item.status === 0">
                                        未开始
                                      </template>
                                      <template v-else-if="item.status === 1">
                                        执行中
                                      </template>
                                      <template v-else-if="item.status === 2">
                                        已结束
                                      </template>
                                      <template v-else-if="item.status === 3">
                                        暂未开启
                                      </template>
                                      <template v-else-if="item.status === 4">
                                        已取消
                                      </template>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="item-content-flex">
                                <div class="item-content-participant">
                                  <div class="item-content-participant-num">
                                    <template v-if="item.no < 1">
                                      暂无人接收任务
                                    </template>
                                    <template v-else>
                                      <template v-if="item.status === 0">
                                        <em>{{ item.no }}</em>人已申请任务
                                      </template>
                                      <template v-else-if="item.status == 2">
                                      <em>{{ item.partCnt }}</em>人已执行任务
                                    </template>
                                      <template v-else>
                                        <em>{{ item.no }}</em>人参与任务
                                      </template>
                                    </template>
                                  </div>
                                  <div 
                                    class="item-content-participant-user"
                                    v-if="item.users !== null && item.users.length > 0"
                                  >
                                    <div
                                      class="user-list"
                                      v-for="(user, index) in item.participant.slice(0, 3)"
                                      :key="index"
                                    >
                                      <img :src="user.avatar" alt="" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                    </template>
                  </template>
                  <template v-else>
                    <template v-if="item.cover !== ''">
                      <div class="list-item-main">
                        <div class="list-item-main-img">
                          <el-image
                            style="width: 100%; height: 100%"
                            :src="item.cover"
                            fit="cover"
                          >
                            <template #error>
                              <img src="@/assets/images/common/default.png" alt="Default Image" />
                            </template>
                          </el-image>
                        </div>
                        <div class="list-item-main-content">
                          <div class="item-content-info">
                            <div class="item-content-name">{{ item.name }}</div>
                            <div class="item-content-taskId">
                              <div class="item-content-taskId-id">任务ID：{{ item.missionId }}</div>
                              <div class="item-content-taskId-cmtcnt">
                                <div class="item-content-taskId-cmtcnt-item">
                                  <div class="item-content-taskId-cmtcnt-item-icon">
                                    <!-- 0 未启动 1执行中 2已完成 3暂停 4取消  -->
                                    <template v-if="item.status === 0">
                                      <i class="icon font_family icon-shaloushijian24"></i>
                                    </template>
                                    <template v-else-if="item.status === 1">
                                      <i class="icon font_family icon-jinhangzhong"></i>
                                    </template>
                                    <template v-else-if="item.status === 2">
                                      <i class="icon font_family icon-gouxuanyuanxingbiankuang24"></i>
                                    </template>
                                    <template v-else-if="item.status === 3">
                                      <i class="icon font_family icon-shaloushijian24"></i>
                                    </template>
                                    <template v-else-if="item.status === 4">
                                      <i class="icon font_family icon-dachayuanxingbiankuang68"></i>
                                    </template>
                                  </div>
                                  <div class="item-content-taskId-cmtcnt-item-num">
                                    <template v-if="item.status === 0">
                                      未开始
                                    </template>
                                    <template v-else-if="item.status === 1">
                                      执行中
                                    </template>
                                    <template v-else-if="item.status === 2">
                                      已结束
                                    </template>
                                    <template v-else-if="item.status === 3">
                                      暂未开启
                                    </template>
                                    <template v-else-if="item.status === 4">
                                      已取消
                                    </template>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="item-content-flex">
                              <div class="item-content-participant">
                                <div class="item-content-participant-num">
                                  <template v-if="item.no < 1">
                                    暂无人接收任务
                                  </template>
                                  <template v-else>
                                    <template v-if="item.status === 0">
                                      <em>{{ item.no }}</em>人已申请任务
                                    </template>
                                    <template v-else>
                                      <em>{{ item.no }}</em>人参与任务
                                    </template>
                                  </template>
                                  
                                </div>
                                <div 
                                  class="item-content-participant-user"
                                  v-if="item.users !== null && item.users.length > 0"
                                >
                                  <div
                                    class="user-list"
                                    v-for="(user, index) in item.users.slice(0, 3)"
                                    :key="index"
                                  >
                                    <img :src="user.avatar" alt="" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="list-item-main">
                        <div class="list-item-main-content posInit">
                          <div class="item-content-info">
                            <div class="item-content-name">{{ item.name }}</div>
                            <div class="item-content-taskId">
                              <div class="item-content-taskId-id">任务ID：{{ item.missionId }}</div>
                              <div class="item-content-taskId-cmtcnt">
                                <div class="item-content-taskId-cmtcnt-item">
                                  <div class="item-content-taskId-cmtcnt-item-icon">
                                    <!-- 0 未启动 1执行中 2已完成 3暂停 4取消  -->
                                    <template v-if="item.status === 0">
                                      <i class="icon font_family icon-shaloushijian24"></i>
                                    </template>
                                    <template v-else-if="item.status === 1">
                                      <i class="icon font_family icon-renwujinhangzhong44"></i>
                                    </template>
                                    <template v-else-if="item.status === 2">
                                      <i class="icon font_family icon-gouxuanyuanxingbiankuang24"></i>
                                    </template>
                                    <template v-else-if="item.status === 3">
                                      <i class="icon font_family icon-shaloushijian24"></i>
                                    </template>
                                    <template v-else-if="item.status === 4">
                                      <i class="icon font_family icon-dachayuanxingbiankuang68"></i>
                                    </template>
                                  </div>
                                  <div class="item-content-taskId-cmtcnt-item-num">
                                    <template v-if="item.status === 0">
                                      未开始
                                    </template>
                                    <template v-else-if="item.status === 1">
                                      执行中
                                    </template>
                                    <template v-else-if="item.status === 2">
                                      已结束
                                    </template>
                                    <template v-else-if="item.status === 3">
                                      暂未开启
                                    </template>
                                    <template v-else-if="item.status === 4">
                                      已取消
                                    </template>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="item-content-flex">
                              <div class="item-content-participant">
                                <div class="item-content-participant-num">
                                  <em>{{ item.partCnt }}</em>人已接收任务
                                </div>
                                <div 
                                  class="item-content-participant-user"
                                  v-if="item.users !== null && item.users.length > 0"
                                >
                                  <div
                                    class="user-list"
                                    v-for="(user, index) in item.participant.slice(0, 3)"
                                    :key="index"
                                  >
                                    <img :src="user.avatar" alt="" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
              </wc-waterfall>
            </template>
          </infinite-scroll-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { mineList } from '@/api/task';
  import TreeSelect from '@/components/TreeSelect/index.vue';
  import persHeader from '@/components/header/persHeader.vue';
  import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
  import defaultImage from '@/assets/images/common/default.png';
  import { setItem } from '@/utils/index';
  import { aeUseStore } from '@/stores/user';
  import { showPopup } from '@/utils/usePopup';
  import { initAOS } from '@/animations/aos';
  import TaskExigency from '@/assets/images/common/exigency.png';
  import TaskComplete from '@/assets/images/common/complete.png';

  const userId = ref(''); // 查看他人的用户id
  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;
  const hasDraft = ref(0);
  const router = useRouter();

  // 如果没有他人id，则取登录人id
  if(userInfo.othersId !== '') {
      userId.value = userInfo.othersId;
  } else {
      userId.value = userInfo.id;
  }

  const taskData = ref({
    taskStatus: 0,
    screenData: '',
    concern: 0,
    ongoing: 0,
    completed: 0,
  });

  const hasMore = ref(true);

  const isfoll = ref(0); // 关注
  const isStates = ref(99);
  const draftNum = ref(0);
  const currentFilterCriteria = ref({
    type: taskData.value.taskStatus,
    status: isStates.value,
    isFollow: isfoll.value,
    seeUserId: userId.value
  }); 

  watch(() => userInfo.othersId, (newValue) => {
      if(newValue !== '') {
          userId.value = userInfo.othersId;
      } else {
          userId.value = userInfo.id;
      }
      currentFilterCriteria.value.seeUserId = userId.value;
  });

  const fetchNews = async (page: number) => {
      let getData = {
        pageNum: page,
        pageSize: 16,
        type: taskData.value.taskStatus,
        status: isStates.value,
        isFollow: isfoll.value,
        seeUserId: userId.value
      }
      console.log(getData);
      try {
        const response = await mineList(getData);
        const { code, data, message } = response;

        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return null;
        }
        hasDraft.value = data.hasDraft;
        draftNum.value = data.draftNum;
        taskData.value.concern = data.followNum;
        taskData.value.ongoing = data.statusIngNum;
        taskData.value.completed = data.statusDoneNum;
        if(data.missionDTOS.length == 0) {
          hasMore.value = false;
          return false;
        } else {
          return data.missionDTOS;
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        return [];
      }
  };
  
  const isType = ref('0');
  const typeList = [
    { value: '1', label: '关注', icon: 'icon-guanzhu20' },
    { value: '2', label: '进行中', icon: 'icon-jinhangzhong'},
    { value: '3', label: '已完成', icon: 'icon-gouxuanyuanxingbiankuang24' },
    { value: '4', label: '已取消', icon: 'icon-shibaiyuanxingbiankuang20' },
  ]
  const findTypeFun = async (item: any) => {
    isType.value = item.value;
    if (item.value == 1) {
      if (isfoll.value == 0) {
        isfoll.value = 1;
      } else {
        isfoll.value = 0;
      }
    } else if (item.value == 2) {
      if (isStates.value == 99) {
        isStates.value = 1;
      } else {
        isStates.value = 99;
      }
    } else if (item.value == 3) {
      if (isStates.value == 99) {
        isStates.value = 2;
      } else {
        isStates.value = 99;
      }
    } else if (item.value == 4) {
      if (isStates.value == 99) {
        isStates.value = 4;
      } else {
        isStates.value = 99;
      }
    }
    currentFilterCriteria.value.isFollow = isfoll.value; // 更新 filterCriteria
    currentFilterCriteria.value.status = isStates.value; // 更新 filterCriteria
  };

  const taskStatus = [
    { value: 0, label: '所有任务' },
    { value: 1, label: '我参与的' },
    { value: 2, label: '我发布的' },
    { value: 3, label: '我申请过的' },
  ];
  // 获取选中的筛选条件
  const onSelected = async (option: any) => {
      console.log('option', option);
      taskData.value.taskStatus = option.value;
      currentFilterCriteria.value.type = option.value; // 更新 filterCriteria
    };


  const screenData = [
    { value: '1', label: '进行中' },
    { value: '2', label: '进行中' },
    { value: '3', label: '进行中' },
  ];

  // 点击任务详情
  const toTaskDetail = async (missionId: string, index: number) => {
    // 是否有草稿 0否 1是
    if(hasDraft.value == 1) {
      if(index !== 0) {
        openTaskDetail(missionId);
      } else {
        // showPopup('跳转到草稿列表', 'error', 3000);
        router.push({ name: 'TaskDraft'});
      }
    } else {
      openTaskDetail(missionId);
    }
  };

const openTaskDetail = (missionId: string) => {
    let id = missionId;
    userInfo.taskType = 1;
    setItem('taskType', 1);
    router.push({ name: 'TataskDetails', params: { id } });
  };

  onMounted(() => {
    initAOS();
  });
</script>

<style lang='scss' scoped>
  .taskList{
    padding-left: 40px;
    height: calc(100% - 11px);
    .taskList-container{
      width: 100%;
      height: calc(100% - 114px);
      .taskList-header{
        width: 100%;
        height: auto;
        margin-top: 30px;
        .taskList-header-flex{
          width: 100%;
          height: auto;
          display: flex;
          .taskList-header-flex-l{
            height: auto;
            flex-shrink: 0;
            padding-left: 52px;
            .taskList-header-flex-l-main{
              width: 100%;
              height: auto;
              display: flex;
              justify-content: space-between;
              .flex-l-main-typeList{
                width: auto;
                height: auto;
                margin-right: 30px;
                display: inline-block;
                &:last-child{
                  margin-right: 0;
                }
                .flex-l-main-typeList-item{
                  cursor: pointer;
                  display: flex;
                  justify-content: center;
                  .flex-l-main-typeList-item-icon{
                    width: 24px;
                    height: auto;
                    margin-right: 7px;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      display: block;
                      line-height: 24px;
                    }
                  }
                  .flex-l-main-typeList-item-text{
                    display: inline-block;
                    font-weight: 500;
                    font-size: 16px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 24px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    margin-right: 5px;
                    white-space: nowrap;
                  }
                  .flex-l-main-typeList-item-line{
                    width: auto;
                    font-weight: 500;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 24px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                  }
                }
              }
            }
          }
          .taskList-header-flex-c{
            flex-grow: 1;
          }
          .taskList-header-flex-r{
            height: auto;
            flex-shrink: 0;
            .taskList-header-flex-r-main{
              width: 100%;
              height: auto;
              display: flex;
              justify-content: space-between;
              .personal-list-sort{
                width: auto;
                height: 38px;
                padding: 0 10px;
                display: inline-block;
                border-radius: 12px;
                &:last-child{
                  margin-right: 50px;
                }
                .personal-list-sort-main{
                  cursor: pointer;
                  display: flex;
                  justify-content: center;
                  .sort-select{
                    display: inline-block;
                    font-weight: 500;
                    font-size: 14px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 38px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    :deep(.cascader-input){
                      color: #FFFFFF;
                      .arrow{
                        i{
                          color: #FFFFFF
                        }
                      }
                    }
                    :deep(.cascader-dropdown){
                      left: -10px;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .taskList-content{
        width: 100%;
        height: calc(100% - 25px);
        .taskList-content-main{
          width: 100%;
          height: 100%;
          :deep(.el-scrollbar__view){
            padding-top: 52px;
          }
          .list-item{
            width: 270px;
            height: auto;
            border-radius: 24px;
            overflow: hidden;
            break-inside: avoid;
            margin-bottom: 30px;
            cursor: pointer;
            background-color: rgba(255, 255, 255, .06);
            backdrop-filter: blur(20px);
            box-shadow: 0px 0px 8px 9px rgb(0, 0, 0, .15);
            .subTask-item-type{
              width: 89px;
              height: 89px;
              position: absolute;
              top: -5px;
              right: -5px;
              z-index: 1;
              img{
                width: 100%;
                height: 100%;
                display: block;
              }
            }
            .list-item-main{
              width: 100%;
              height: auto;
              min-height: 270px;
              position: relative;
              .list-item-main-img{
                width: 100%;
                height: auto;
                display: block;
                img{
                  width: 100%;
                  height: auto;
                  display: block;
                }
              }
              .activities-draft{
                width: 130px;
                height: 38px;
                border-radius: 19px;
                position: absolute;
                top: 15px;
                left: 15px;
                z-index: 1;
                background: rgba(255, 255, 255, .16);
                backdrop-filter: blur(52px);
                .activities-draft-main{
                  width: 100%;
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  .activities-draft-main-icon{
                    width: 24px;
                    height: auto;
                    margin-right: 7px;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      display: block;
                      line-height:38px;
                    }
                  }
                  .activities-draft-main-text{
                    font-weight: 400;
                    font-size: 16px;
                    color:rgb(255, 255, 255, .7);
                    line-height: 38px;
                    text-align: left
                  }
                }
                
              }
              .list-item-main-content{
                height: auto;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
                border-radius: 8px 8px 24px 24px;
                padding: 20px 20px 16px 20px;
                background: rgba(255, 255, 255, .16);
                backdrop-filter: blur(52px);
                .item-content-info{
                  width: 100%;
                  height: auto;
                  .item-content-name{
                    width: 100%;
                    font-weight: 500;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 1;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }
                  .item-content-taskId{
                    width: 100%;
                    height: auto;
                    display: flex;
                    margin-top: 12px;
                    .item-content-taskId-id{
                      flex: 1;
                      font-weight: 400;
                      font-size: 14px;
                      color: rgb(255, 255, 255, .7);
                      line-height: 24px;
                      text-align: left;
                      font-style: normal;
                      text-transform: none;
                    }
                    .item-content-taskId-cmtcnt{
                      width: 73px;
                      height: auto;
                      .item-content-taskId-cmtcnt-item{
                        width: 100%;
                        height: auto;
                        display: flex;
                        .item-content-taskId-cmtcnt-item-icon{
                          width: 24px;
                          height: auto;
                          margin-right: 5px;
                          i{
                            font-size: 24px;
                            color: #FFFFFF;
                            display: block;
                            line-height: 24px;
                          }
                        }
                        .item-content-taskId-cmtcnt-item-num{
                          flex: 1;
                          font-weight: 400;
                          font-size: 14px;
                          color: rgb(255, 255, 255, .7);
                          line-height: 24px;
                          text-align: left;
                          font-style: normal;
                          text-transform: none;
                        }
                      }
                    }
                  }
                  .item-content-flex{
                    width: 100%;
                    height: auto;
                    .item-content-participant{
                      width: 100%;
                      height: auto;
                      display: flex;
                      justify-content: space-between;
                      .item-content-participant-num{
                        width: auto;
                        height: auto;
                        font-weight: 400;
                        font-size: 14px;
                        color: rgb(255, 255, 255, .7);
                        line-height: 1;
                        text-align: left;
                        font-style: normal;
                        text-transform: none;
                        margin-top: 25px;
                        em{
                          color: rgb(255, 255, 255, .7);
                        }
                      }
                      .item-content-participant-user{
                        height: auto;
                        clear: both;
                        margin-top: 13px;
                        .user-list{
                          width: 34px;
                          height: 34px;
                          float: left;
                          margin-left: -10px;
                          border-radius: 50%;
                          overflow: hidden;
                          img{
                            width: 100%;
                            height: 100%;
                            display: block;
                          }
                        }
                      }
                    }
                  }
                }
              }
              .posInit{
                position: initial;
                .item-content-name{
                  width: calc(100% - 40px) !important;
                }
              }
              .ntfPos{
                top: 15px !important;
              }
            }
          }
        }
      }
    }
  }
</style>
