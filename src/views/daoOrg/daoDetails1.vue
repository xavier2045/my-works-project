<template>
  <div class="daoDetails">
    <div class="daoDetails-container">
      <div class="daoDetails-container-head">
        <div class="head-title-flex">
          <div class="head-title-flex-icon">
            <i class="icon font_family icon-fabuxuqiu34"></i>
          </div>
          <div class="head-title-flex-text">柔性供应链任务管理</div>
        </div>
        <div class="head-butt-flex">
          <template v-if="userInfo.id == daoDetails.missionAdminUserId">
            <div class="head-butt-flex-item">
              <div class="head-butt-flex-item-content" @click="isKnowledgeBaseVisible = true">
                <div class="head-butt-flex-icon">
                  <i class="icon font_family icon-suipian24"></i>
                </div>
                <div class="head-butt-flex-text">上传知识库</div>
              </div>
            </div>
            <div class="head-butt-flex-item">
              <div class="head-butt-flex-item-content" @click="isNodeShow = !isNodeShow">
                <div class="head-butt-flex-icon">
                  <i class="icon font_family icon-jiedian24_1"></i>
                </div>
                <div class="head-butt-flex-text">上传节点</div>
              </div>
              <div class="nodeList" v-if="isNodeShow">
                <div class="nodeList-content">
                  <div class="masking"></div>
                  <div class="nodeList-content-list">
                    <div class="timeline">
                      <div class="event" v-for="(item, index) in nodeList" :key="index">
                        <div class="connectingLine">
                          <i class="icon font_family icon-liuyandiandian24"></i>
                        </div>
                        <div class="event-info">
                          <div class="event-info-main">
                            <div class="icon" :class="item.isUpload == 0 ? 'iconBg' : ''">
                              <template v-if="item.isUpload == 2">
                                <i class="icon font_family icon-guanbiwubeijing20"></i>
                              </template>
                              <template v-if="item.isUpload == 1">
                                <i class="icon font_family icon-xuanzedagou24"></i>
                              </template>
                              <template v-if="item.isUpload == 0">
                                <i class="icon font_family icon-jiedian24_1"></i>
                              </template>
                            </div>
                            <div class="details">
                                <p class="date" :class="item.highlighted ? 'detailsColor' : ''">{{ item.deadline }}</p>
                                <p class="status" :class="item.highlighted ? 'detailsColor' : ''">
                                  <template v-if="item.isUpload == 0">
                                    <span class="status-text">请上传节点</span>
                                  </template>
                                  <template v-if="item.isUpload == 1">
                                    <span class="status-text">已上传</span>
                                  </template>
                                  <template v-if="item.isUpload == 2">
                                    <span class="status-text">未上传节点</span>
                                  </template>
                                </p>
                            </div>
                          </div>
                        </div>
                        <div 
                          class="event-but" 
                          :class="item.highlighted ? 'completed' : ''"
                          v-bind="item.highlighted ? { onClick: () => uploadNode(item) } : {}"
                        >
                          <template v-if="item.isUpload == 0">
                            <div class="but">上传节点</div>
                          </template>
                          <template v-if="item.isUpload == 1">
                            <div class="but">已上传</div>
                          </template>
                          <template v-if="item.isUpload == 2">
                            <div class="but">上传节点</div>
                          </template>
                        </div>
                      </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="head-butt-flex-item" @click="openEditor">
              <div class="head-butt-flex-item-content">
                <div class="head-butt-flex-icon">
                  <i class="icon font_family icon-tian24"></i>
                </div>
                <div class="head-butt-flex-text">发起提案</div>
              </div>
            </div>
          </template>
          <!-- <div class="head-butt-flex-item">
            <div class="head-butt-flex-item-content">
              <div class="head-butt-flex-icon">
                <i class="icon font_family icon-shangchuanwenjian24"></i>
              </div>
              <div class="head-butt-flex-text">提交任务</div>
            </div>
          </div> -->
        </div>
        
        <div class="head-body-flex">
          <template v-if="daoDetails.isDaoMember == 1">
            <div class="body-flex-item" @click="handShowMsgModalFun" @click.stop>
              <i class="icon font_family icon-xiaoxitongzhi24"><span></span></i>
            </div>
            <div class="body-flex-item" title="社区互动">
              <i class="icon font_family icon-shequhudong34"></i>
            </div>
            <!-- <div class="body-flex-item">
              <i class="icon font_family icon-zhuanrangshenfen34"></i>
            </div> -->
          </template>
        </div>
      </div>
      <div class="daoDetails-container-body">
        <div class="body-info-link">
          <div class="body-info-link-flex" @click="routerPush(daoDetails.daoId)">
            <div class="body-info-link-flex-img">
              <img :src="daoDetails.cover" alt="" />
            </div>
            <div class="body-info-link-flex-text">查看Dao详情</div>
            <div class="body-info-link-flex-icon">
              <i class="icon font_family icon-shijianjiantouyuanquan24"></i>
            </div>
          </div>
        </div>
        <div class="body-info-content">
          <div class="body-info-content-flex">
            <div class="item-main">
              <div class="item-main-border pointer" @click="getRouterPush(daoDetails.missionId)">
                <div class="item-mian-title">总任务</div>
                <div class="item-mian-content">
                  <div class="item-mian-content-text">{{ daoDetails.missionName }}</div>
                  <div class="item-mian-content-icon">
                    <i class="icon font_family icon-shijianjiantouyuanquan24"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="item-main">
              <div class="item-main-border">
                <div class="item-mian-title">行业属性</div>
                <div class="item-mian-content">
                  <div class="item-mian-content-text">{{ daoDetails.categoryName }}</div>
                </div>
              </div>
            </div>
            <div class="item-main">
              <div class="item-main-border">
                <div class="item-mian-title">投票通过率</div>
                <div class="item-mian-content">
                  <div class="item-mian-content-text">≥{{ daoDetails.passRate }}%</div>
                </div>
              </div>
            </div>
            <div class="item-main">
              <div class="item-main-border">
                <div class="item-mian-title">任务周期</div>
                <div class="item-mian-content">
                  <div class="item-mian-content-text">{{ daoDetails.missionDay }}天</div>
                </div>
              </div>
            </div>
            <div class="item-main">
              <div class="item-main-border">
                <div class="item-mian-title">任务进度</div>
                <div class="item-mian-content">
                    <template v-if="daoDetails.schedule > 0">
                      <div class="item-mian-content-text">未开启</div>
                    </template>
                    <template v-else>
                      <div class="item-mian-content-text">{{ daoDetails.schedule || 0 }}%</div>
                    </template>
                </div>
              </div>
            </div>
            <template v-if="daoDetails.isDaoMember == 1">
              <div class="item-main">
                <div class="item-main-border" @click="handMemberListDataFun">
                  <div class="item-mian-title">
                    <div class="item-mian-title-flex">
                      <div class="item-mian-title-text">团队成员</div>
                      <div class="item-mian-title-icon">
                        <i class="icon font_family icon-a-jiantouxiangshangshousuo24"></i>
                      </div>
                    </div>
                  </div>
                  <div class="item-mian-content">
                    <div class="member-avatar-main-lsit">
                        <div 
                            class="member-avatar-main-lsit-item"
                            v-for="(item, index) in daoDetails.avatars.slice(0, 2)" 
                            :key="index"
                        >
                            <img :src="item" alt="" />
                        </div>
                        <div class="member-avatar-main-lsit-item" v-if="daoDetails.daoNum - 2 > 0">
                            <p>+ {{ daoDetails.avatars.length - 2 }}</p>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="daoDetails-container-subtask" :class="taskData.length > 0 ? '': 'staskNull'">
        <div class="subtask-main" v-if="taskData.length > 0">
          <div class="subtask-main-line"></div>
          <div
            class="subtask-main-content no-select"
            @mousedown="startDrag"
            @mousemove="onDrag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
          >
            <div v-for="(group, index) in groupedData" :key="index" class="subtask-main-group">
              <div v-for="(item, idx) in group" :key="idx" class="subtask-main-group-item">
                <div class="item-content-body-link" @click="openDetails(item)">
                  <template v-if="item.status == 0">
                    <i class="icon font_family icon-jiantouyoushang24"></i>
                  </template>
                  <template v-if="item.status == 1">
                    <img :src="inExecution" alt="" />
                  </template>
                  <template v-if="item.status == 2">
                    <i class="icon font_family icon-renwuyiwancheng44"></i>
                  </template>
                  <template v-if="item.status == 3">
                    <i class="icon font_family icon-renwuyijiesan44"></i>
                  </template>
                </div>
                <div class="subtask-main-group-item-mask">
                  <div class="subtask-main-group-item-content">
                    <div class="item-content-body">
                      <div class="item-content-body-info">
                        <template v-if="item.adminUserId == null">
                          <div class="body-info-amount" >
                            <div class="icon-amount">
                              <i class="icon font_family icon-zongshouru24"></i>
                            </div>
                            <div class="amount">{{ item.reward }}元</div>
                          </div>
                        </template>
                        <div class="body-info-name">{{ item.name }}</div>
                        <template v-if="item.adminUserId == null">
                          <div class="body-info-desc">{{ item.description }}</div>
                          <div class="body-info-trust">信任值：{{ item.trustValue }}</div>
                        </template>
                        <template v-if="item.adminUserId != null">
                          <div class="body-info-schedule">
                            <div class="schedule-text">{{ item.progress || 0 }}<span>%</span></div>
                            <div class="schedule-line">
                              <div class="schedule-lint-padding" :style="{ width: item.progress || 0 + '%'}"></div>
                            </div>
                          </div>
                          <div class="body-info-cycle">
                            <div class="cycle-text">任务周期</div>
                            <div class="cycle-time">
                              <div class="cycle-time-start"><span>{{ item.day }}天</span></div>
                            </div>
                          </div>
                        </template>
                        <div class="body-info-apply">
                          <div class="body-info-apply-flex">
                            <div class="flex-applies">
                              <!-- 组织管理者 -->
                              <template v-if="userInfo.id == daoDetails.missionAdminUserId">
                                <template v-if="item.adminUserId == null">
                                  <template v-if="item.applyNo == 0">
                                    <div class="applyNum-no-flex">
                                      <div class="applyNum-no">暂无人申请此任务</div>
                                      <div class="applyNum-butt">
                                        <template v-if="item.applyNo == 0">
                                          <div @click="deleteSubTask(item.taskId)">删除</div>
                                        </template>
                                      </div>
                                    </div>
                                  </template>
                                  <template v-else-if="item.applyNo > 0">
                                    <template v-if="item.status == 0 || item.status == 3">
                                      <template v-if="item.assignPayStatus == 0">
                                        <div class="flex-main-apply">
                                          <div class="flex-main-apply-list">
                                            <div class="flex-main-apply-list-item">
                                                <img :src="item.adminUserAvatar" alt="" />
                                              </div>
                                              <div class="flex-main-applicant">
                                                  <p><span>已指定责任人</span></p>
                                              </div>
                                          </div>
                                          <div class="flex-main-select" @click="findPayNftImmediately(item)">
                                              立即支付Nft
                                          </div>
                                        </div>
                                      </template>
                                      <template v-if="item.assignPayStatus == -1 || item.assignPayStatus == 1">
                                        <div class="flex-main-apply">
                                            <div class="flex-main-apply-list">
                                                <div 
                                                  class="flex-main-apply-list-item"
                                                  v-for="(items, index) in item.applyUsers.slice(0, 3)" 
                                                  :key="index"
                                                >
                                                    <img :src="items.avatar" alt="" />
                                                </div>
                                                <div class="flex-main-applicant" v-if="item.applyUsers.length - 3 > 0">
                                                    <p>+ {{ item.applyUsers.length - 3 }}<span>申请</span></p>
                                                </div>
                                                <div class="flex-main-applicant" v-else>
                                                    <p>{{ item.applyUsers.length }}<span>人申请</span></p>
                                                </div>
                                            </div>
                                            <div class="flex-main-select" @click="selectResponsiblePerson(item.taskId)">
                                                筛选成员
                                            </div>
                                        </div>
                                      </template>
                                      <template v-else-if="item.assignPayStatus !== 2 && item.status == 0">
                                        <template v-if="item.assignPayStatus == 3 || item.assignPayStatus == 4 || item.assignPayStatus == 5 || item.assignPayStatus == 6 || item.assignPayStatus == 7">
                                          <div class="flex-main-apply">
                                            <div class="flex-main-apply-list">
                                                <div 
                                                  class="flex-main-apply-list-item"
                                                  v-for="(items, index) in item.applyUsers.slice(0, 3)" 
                                                  :key="index"
                                                >
                                                    <img :src="items.avatar" alt="" />
                                                </div>
                                                <div class="flex-main-applicant" v-if="item.applyUsers.length - 3 > 0">
                                                    <p>+ {{ item.applyUsers.length - 3 }}<span>申请</span></p>
                                                </div>
                                                <div class="flex-main-applicant" v-else>
                                                    <p>{{ item.applyUsers.length }}<span>人申请</span></p>
                                                </div>
                                            </div>
                                            <div class="flex-main-select" @click="selectResponsiblePerson(item.taskId)">
                                                筛选成员
                                            </div>
                                          </div>
                                        </template>
                                      </template>
                                    </template>
                                  </template>
                                </template>
                                <template v-else-if="item.adminUserId !== null">
                                  <template v-if="item.rewardPayStatus !== 2 && item.status == 1">
                                    <div class="flex-main-apply">
                                        <div class="flex-main-apply-list">
                                          <div class="flex-main-apply-list-item">
                                              <img :src="item.adminUserAvatar" alt="" />
                                            </div>
                                            <div class="flex-main-applicant">
                                                <p><span>已指定责任人</span></p>
                                            </div>
                                        </div>
                                        <template v-if="item.rewardPayStatus == -1 || item.rewardPayStatus == 3 || item.rewardPayStatus == 4 || item.rewardPayStatus == 5 || item.rewardPayStatus == 7">
                                          <div class="flex-main-select" @click="findCreateAPaymentPledge(item)">
                                            立即支付质押
                                          </div>
                                        </template>
                                        <template v-else>
                                          <div class="flex-main-select" @click="findPayThePledgeImmediately(item)">
                                            立即支付质押
                                          </div>
                                        </template>
                                    </div>
                                  </template>
                                  <template v-else>
                                    <div class="flex-main-apply">
                                      <div class="flex-main-apply-list">
                                          <div 
                                            class="flex-main-apply-list-item"
                                          >
                                              <img :src="item.adminUserAvatar" alt="" />
                                          </div>
                                      </div>
                                      <div class="flex-main-select" @click="handleExecuteDetails(item)">
                                          任务详情
                                      </div>
                                      <template v-if="daoDetails.missionAdminUserId == userInfo.id">
                                        <div class="subtask-operation"
                                          @click="handleModuleSubtask(item.id)"
                                          v-if="item.adminUserId == userInfo.id"
                                        >
                                          <div class="icon-operation-box">
                                            <i class="icon font_family icon-liuyandiandian24"></i>
                                          </div>
                                        </div>
                                      </template>
                                    </div>
                                  </template>
                                </template>
                              </template>
                              <!-- 管理员 -->
                              <template v-else-if="item.adminUserId == userInfo.id">
                                <template v-if="item.rewardPayStatus == 2 && item.status == 1">
                                  <div class="flex-main-apply">
                                    <div class="flex-main-apply-list">
                                        <div 
                                          class="flex-main-apply-list-item"
                                        >
                                            <img :src="item.adminUserAvatar" alt="" />
                                        </div>
                                    </div>
                                    <div class="flex-main-select" @click="handleExecuteDetails(item)">
                                        任务详情
                                    </div>
                                  </div>
                                </template>
                                <template v-else>
                                  <div class="flex-main-apply">
                                    <div class="flex-main-apply-list">
                                        <div 
                                          class="flex-main-apply-list-item"
                                        >
                                            <img :src="item.adminUserAvatar" alt="" />
                                        </div>
                                    </div>
                                    <div class="flex-main-select">
                                        等待审核
                                    </div>
                                  </div>
                                </template>
                                
                              </template>
                              <!-- 其他人 -->
                              <template v-else>
                                <template v-if="item.hasApply !== 1">
                                  <template v-if="item.adminUserId == '' || item.adminUserId == null">
                                    <div class="flex-main-apply">
                                      <div class="flex-main-apply-list">
                                        <template v-if="item.applyUsers.length > 0">
                                          <div 
                                            class="flex-main-apply-list-item"
                                            v-for="(items, index) in item.applyUsers.slice(0, 3)" 
                                            :key="index"
                                          >
                                              <img :src="items.avatar" alt="" />
                                          </div>
                                          <div class="flex-main-applicant" v-if="item.applyUsers.length - 3 > 0">
                                              <p>+ {{ item.applyUsers.length - 3 }}<span>申请</span></p>
                                          </div>
                                          <div class="flex-main-applicant" v-else>
                                              <p>{{ item.applyUsers.length}}<span>人申请</span></p>
                                          </div>
                                        </template>
                                        <template v-else>
                                          <div class="applyNum-no">暂无人申请此任务</div>
                                        </template>
                                      </div>
                                      <div class="flex-main-select">
                                        <div @click="applyToParticipate(item)">申请参与</div>
                                      </div>
                                    </div>
                                  </template>
                                  <template v-else>
                                    <div class="flex-main-apply">
                                      <div class="flex-main-apply-list">
                                          <div 
                                            class="flex-main-apply-list-item"
                                          >
                                              <img :src="item.adminUserAvatar" alt="" />
                                          </div>
                                      </div>
                                      <div class="flex-main-select" @click="handleExecuteDetails(item)">
                                          任务详情
                                      </div>
                                    </div>
                                  </template>
                                </template>
                                <!-- hasApply： 1已申请，2没申请 -->
                                <template v-else-if="item.hasApply == 1">
                                    <div class="flex-main-apply">
                                      <div class="flex-main-apply-list">
                                        <template v-if="item.applyUsers.length > 0">
                                          <div 
                                            class="flex-main-apply-list-item"
                                            v-for="(items, index) in item.applyUsers.slice(0, 3)" 
                                            :key="index"
                                          >
                                              <img :src="items.avatar" alt="" />
                                          </div>
                                          <div class="flex-main-applicant" v-if="item.applyUsers.length - 3 > 0">
                                              <p>+ {{ item.applyUsers.length - 3 }}<span>申请</span></p>
                                          </div>
                                          <div class="flex-main-applicant" v-else>
                                              <p>{{ item.applyUsers.length}}<span>人申请</span></p>
                                          </div>
                                        </template>
                                      </div>
                                      <div class="flex-main-select">
                                        等待审核
                                      </div>
                                  </div>
                                </template>
                              </template>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-line-icon" :class="item.imgClass">
                  <img :src="item.img" alt="" />
                  <i class="icon font_family" :class="item.icon"></i>
                </div>
                <!-- <div class="icon-operation-module" v-if="isModule == item.id"> 
                  <div class="icon-operation-module-list">
                    <template v-if="daoDetails.missionAdminUserId == userInfo.id">
                      <div class="icon-operation-module-item"
                        @click="handleExitTask(item.id)"
                      >
                        退出任务
                      </div>
                      <div class="icon-operation-module-item"
                        @click="showUpDataUser(item.id)"  
                      >
                        更新成员
                      </div>
                        <div class="icon-operation-module-item"
                          @click="handleAuditTask(item.id)"
                          >
                        审核任务
                      </div>
                    </template>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <div class="add-substask" v-if="userInfo.id == daoDetails.missionAdminUserId">
          <div class="add-substask-img" @click="handleAddSubtask">
            <img :src="found" alt="" />
          </div>
          <div class="add-substask-text">创建子任务</div>
        </div>
      </div>
      <div class="daoDetails-container-butt" v-if="taskData.length > 0">
        <template v-if="daoDetails.isDaoMember == 1">
          <div class="daoDetails-container-butt-line">
            <div class="butt-line-l">
              <div class="node-content">
                <div class="item-content-flex" @click="handNodeList">
                  <div class="item-num">{{ daoDetails.nodeDataNum || 0 }}</div>
                  <div class="item-content">
                    <div class="item-content-title">任务节点</div>
                    <div class="item-content-desc">参与此任务的人提交的所有关键节点成果。</div>
                  </div>
                  <div class="item-link">
                    <i class="icon font_family icon-jiantouxiangyou24"></i>
                  </div>
                </div>
              </div>
              <div class="knowledge-base-content">
                <div class="item-content-flex" @click="handKnowledgeBase">
                  <div class="item-num">{{ daoDetails.knowledgeNum || 0 }}</div>
                  <div class="item-content">
                    <div class="item-content-title">任务知识库</div>
                    <div class="item-content-desc">任务过程中团队所产生的价值。</div>
                  </div>
                  <div class="item-link">
                    <i class="icon font_family icon-jiantouxiangyou24"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="butt-line-r">
              <div class="proposal-content" @click="handleRouterProposal">
                <div class="item-content-title">任务提案</div>
                <div class="item-content-desc">参与此任务的成员对任务提出的创新思路，以及针对任务中 遇到的问题提出解决方案。</div>
                <div class="item-content-link">
                  <div class="item-content-link-flex">
                    <div class="item-content-link-proposal">
                      <div class="user-list">
                        <div class="user-list-avatar">
                          <div class="avatar" v-for="(item, index) in daoDetails.proposalAvatars" :key="index">
                            <img :src="item.avatar" alt="" />
                          </div>
                        </div>
                        <div class="user-list-num"><span>{{ daoDetails.proposalNum || 0 }}</span>个提案</div>
                      </div>
                    </div>
                    <div class="item-content-link-icon">
                      <i class="icon font_family icon-jiantouxiangyou24"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- 新增子任务  -->
    <div class="popupModal clipPathNo" v-if="isAddSubtask" @click="closeAddSubtask">
      <div class="masking"></div>
      <div class="popupModal-wrapper suntask" @click.stop>
        <div class="popupModal-wapper-center">
            <div class="popupModal-wrapper-mask"></div>
            <div class="password-from">
                <div class="password-from-title">创建任务</div>
                <div class="password-from-tips">{{ formTips }}</div>
                <div class="password-from-content">
                    <div class="suntask-item">
                      <div class="item-l">
                          <div class="item-main" :class="{ focused: nameEr }">
                              <div class="item-main-flex">
                                <div class="item-main-title">
                                  <div class="item-main-icon">
                                      <i class="icon font_family icon-renwumingcheng"></i>
                                  </div>
                                  <div class="item-main-label">任务名称</div>
                                </div>
                                <div class="item-main-content">
                                    <input
                                        type="text" 
                                        v-model="subtaskData.name" 
                                        maxlength="64"
                                    />
                                </div>
                              </div>
                          </div>
                      </div>
                      <div class="item-r">
                        <div class="item-main" :class="{ focused: trustValueEr }">
                          <div class="item-main-flex">
                            <div class="item-main-title">
                              <div class="item-main-icon">
                                  <i class="icon font_family icon-xinren24"></i>
                              </div>
                              <div class="item-main-label">信任值要求</div>
                            </div>
                            <div class="item-main-content">
                                <input
                                    type="text" 
                                    v-model="subtaskData.trustValue" 
                                    maxlength="9"
                                    @input="handleInput"
                                />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="suntask-item">
                      <div class="item-l">
                          <div class="item-main" :class="{ focused: rewardEr }">
                              <div class="item-main-flex">
                                <div class="item-main-title">
                                  <div class="item-main-icon">
                                      <i class="icon font_family icon-feiyong24"></i>
                                  </div>
                                  <div class="item-main-label">任务报酬</div>
                                </div>
                                <div class="item-main-content">
                                  <!-- <input
                                      type="text" 
                                      v-model="subtaskData.reward" 
                                      maxlength="9"
                                  /> -->
                                  <div class="item-main-time-group-input">
                                    <div class="item-main-time-group-input-num">
                                      <input 
                                        type="text"
                                        v-model.number="subtaskData.reward" 
                                        maxlength="3" 
                                        @input="handlePayAmountInput"
                                      />
                                    </div>
                                    <div class="item-main-time-group-input-unit">元</div>
                                  </div>
                                </div>
                              </div>
                          </div>
                      </div>
                      <div class="item-r">
                        <div class="item-main" :class="{ focused: dayEr }">
                          <div class="item-main-flex">
                            <div class="item-main-title">
                              <div class="item-main-icon">
                                  <i class="icon font_family icon-rili24"></i>
                              </div>
                              <div class="item-main-label">任务时间</div>
                            </div>
                            <div class="item-main-content">
                              <!-- <el-date-picker
                                v-model="tabTime"
                                type="daterange"
                                format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                              /> -->
                              <div class="item-main-time-group-input">
                                <div class="item-main-time-group-input-num">
                                  <input 
                                    type="text"
                                    v-model.number="subtaskData.day" 
                                    maxlength="3" 
                                    @input="handleDayInput"
                                  />
                                </div>
                                <div class="item-main-time-group-input-unit">天</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="suntask-item">
                      <div class="item-l">
                          <div class="item-main pull-down" :class="{ focused: nodePeriodEr }">
                              <div class="item-main-flex">
                                <div class="item-main-title">
                                  <div class="item-main-icon">
                                      <i class="icon font_family icon-suipian24"></i>
                                  </div>
                                  <div class="item-main-label">节点周期</div>
                                </div>
                                <div class="item-main-content" @click.stop="toggleDropdown('modele1')">
                                    <template v-if="isSellNoOff == 1">一周</template>
                                    <template v-else-if="isSellNoOff == 2">半个月</template>
                                    <template v-else-if="isSellNoOff == 3">一个月</template>
                                    <template v-else-if="isSellNoOff == 4">三个月</template>
                                    <template v-else-if="isSellNoOff == 5">{{ custom }}天</template>
                                </div>
                                <div class="item-main-arrow" @click.stop="toggleDropdown('modele1')">
                                  <i 
                                    class="icon font_family"
                                    :class="currentDropdown === 'modele1' ? 'icon-a-jiantouxiangshangshousuo24' : 'icon-a-jiantouxiangxiazhankai24'"
                                  >
                                  </i>
                                </div>
                              </div>
                              <div class="item-main-dropdown" v-if="currentDropdown === 'modele1'" @click.stop>
                                <div class="module-content-list">
                                  <div 
                                    class="module-content-list-item"
                                    :class="item.id === 5 ? 'width-66' : ''"
                                    v-for="(item, index) in nodeCycleData"
                                    :key="index"
                                    @click="findSellTypeFun(item.id)"
                                  >
                                    <template v-if="item.id !== 5">
                                      <div class="list-item-flex">
                                        <div class="list-item-flex-icon">
                                          <i 
                                            class="icon font_family"
                                            :class="isSellNoOff == item.id ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                                          >
                                          </i>
                                        </div>
                                        <div class="list-item-flex-name">{{ item.label }}</div>
                                      </div>
                                    </template>
                                    <template v-else>
                                      <div class="list-item-custom">
                                        <div class="lsit-item-custom-l">
                                          <div class="list-item-custom-l-main">
                                            <div class="list-item-custom-icon">
                                              <i 
                                                class="icon font_family"
                                                :class="isSellNoOff == item.id ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                                              >
                                              </i>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="list-item-custom-r">
                                          <div class="list-item-custom-r-main">
                                            <div class="list-item-custom-r-input">
                                              <input
                                                type="text" 
                                                @input="filterInput"
                                                v-model.number="custom" 
                                                :placeholder="item.label"
                                                maxlength="3"
                                              />
                                            </div>
                                            <div class="list-item-custom-r-label">天</div>
                                          </div>
                                        </div>
                                      </div>
                                    </template>
                                  </div>
                                </div>
                              </div>
                          </div>
                      </div>
                      <div class="item-r">
                        <div class="item-main" :class="{ focused: nodePassRateEr }">
                          <div class="item-main-flex">
                            <div class="item-main-title">
                              <div class="item-main-icon">
                                  <i class="icon font_family icon-zantong24"></i>
                              </div>
                              <div class="item-main-label">节点通过率</div>
                            </div>
                            <div class="item-main-content">
                              <div class="item-main-time-group-input">
                                <div class="item-main-time-group-input-num">
                                  <input 
                                    type="text"
                                    v-model.number="subtaskData.nodePassRate" 
                                    maxlength="3" 
                                    @input="handlenodePassRateInput"
                                  />
                                </div>
                                <div class="item-main-time-group-input-unit">%</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="suntask-item">
                      <div class="item-main" :class="{ focused: competencyRequirementEr }">
                          <div class="item-main-perm">
                              <div class="item-main-perm-top">
                                  <div class="item-main-icon">
                                  <i class="icon font_family icon-gongzuojingyan24"></i>
                                  </div>
                                  <div class="item-main-perm-name">能力要求</div>
                              </div>
                              <div class="item-main-content">
                                  <textarea 
                                  type="textarea"
                                  v-model="subtaskData.competencyRequirement" 
                                  placeholder="" 
                                  maxlength="200"
                                  :show-word-limit="true"
                                  ></textarea>
                              </div>
                          </div>
                      </div>
                    </div>
                    <div class="suntask-item">
                      <div class="two-main">
                          <div class="teo-main-avatar" :class="{ focused: coverEr }">
                            <ImageUpload
                              upload-type="image"
                              upload-name ='上传任务封面'
                              :on-upload-success="findGetImageUrlFun"
                            />
                          </div>
                          <div class="item-main-perm" :class="{ focused: descriptionEr }">
                              <div class="item-main-perm-top">
                                  <div class="item-main-icon">
                                  <i class="icon font_family icon-jieshao24"></i>
                                  </div>
                                  <div class="item-main-perm-name">任务描述</div>
                              </div>
                              <div class="item-main-content">
                                  <textarea 
                                      type="textarea"
                                      v-model="subtaskData.description" 
                                      placeholder="" 
                                      maxlength="200" 
                                      :show-word-limit="true"
                                  ></textarea>
                              </div>
                          </div>
                      </div>
                    </div>
                    <div class="suntask-submit" @click="uploadToCOS">立即创建</div>
                </div>
            </div>
        </div>
        <div class="close" @click="closeAddSubtask">
          <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
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
                            <div class="item-content-right" @click="chooseApply(item, index)">
                                <i 
                                    class="icon font_family"
                                    :class="applyId == item.userId ? 'icon-gouxuanyuanxingbiankuang24' : 'icon-weigouxuanyuanxingbiankuang24'"
                                ></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="personInCharge-main-selectBut">
                <div 
                    class="personInCharge-main-selectBut-item"
                    @click="findApplyListFun"
                >取消</div>
                <div 
                    class="personInCharge-main-selectBut-item"
                    @click="findsbumitApplyClick"
                >确认</div>
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
                <div class="popupModal-main-title">是否确认选择该用户成为任务责任人？</div>
                <div class="popupModal-main-tips">如确定选择后需支付该任务的质押金，请知悉！</div>
                <div class="popupModal-main-but-group">
                  <div class="popupModal-main-but" @click="isApplyListVerify = false">否</div>
                  <div class="popupModal-main-but" @click="findsbumitApplySubmit">是</div>
                </div>
              </div>
            </div>
            <div class="close" @click="isApplyListVerify = false">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div>
        </div>
    </div>
    <!-- 任务申请未通过   -->
    <div class="popupModal" v-if="isNotPass" @click="isNotPass = false">
        <div class="masking"></div>
        <div class="popupModal-center" @click.stop>
            <div class="popupModal-main">
              <div class="popupModal-module"></div>
              <div class="popupModal-main-content">
                <div class="popupModal-main-icon">
                    <i class="icon font_family icon-shenheshibai68"></i>
                </div>
                <div class="popupModal-main-title">任务申请未通过！</div>
                <div class="popupModal-main-but" @click="isNotPass = false">确定</div>
              </div>
            </div>
            <div class="close" @click="isNotPass = false">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div>
        </div>
    </div>
    <!-- 任务申请审核中 -->
    <div class="popupModal" v-if="isUnderReview" @click="isUnderReview = false">
        <div class="masking"></div>
        <div class="popupModal-center" @click.stop>
            <div class="popupModal-main">
              <div class="popupModal-module"></div>
              <div class="popupModal-main-content">
                <div class="popupModal-main-icon">
                    <i class="icon font_family icon-shenhezhong68"></i>
                </div>
                <div class="popupModal-main-title">您已申请参与！</div>
                <div class="popupModal-main-tips">正在审核中，请耐心等待结果!</div>
              </div>
            </div>
            <div class="close" @click="isUnderReview = false">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div>
        </div>
    </div>
    <!-- 退出任务二次确认 -->
    <div class="popupModal" v-if="isExitTask" @click="isExitTask = false">
        <div class="masking"></div>
        <div class="popupModal-center" @click.stop>
            <div class="popupModal-main">
              <div class="popupModal-module"></div>
              <div class="popupModal-main-content">
                <div class="popupModal-main-title">是否确认要退出此任务？</div>
                <div class="popupModal-main-tips">如果选择退出此任务，您将无法获得相应的奖励。</div>
                <div class="popupModal-main-but-group">
                  <div class="popupModal-main-but" @click="isExitTask = false">否</div>
                  <div class="popupModal-main-but" @click="handSubmitExitTask">是</div>
                </div>
              </div>
            </div>
            <div class="close" @click="isExitTask = false">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div>
        </div>
    </div>
    <!-- 转让任务通知 -->
    <div class="popupModal" v-if="isTod" @click="isTod = false">
      <div class="masking"></div>
      <div class="popupModal-center">
          <div class="popupModal-main" @click.stop>
            <div class="popupModal-module"></div>
            <div class="popupModal-main-content">
              <div class="popupModal-main-title">任务身份转让成功！您已不是此任务管理者者.</div>
              <div class="popupModal-main-but" @click="isTod = false">确定</div>
            </div>
          </div>
          <div class="close" @click="isTod = false">
              <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
          </div>
      </div>
    </div>
    <!-- 审核任务 -->
    <div class="popupModal" v-if="isAuditTask" @click="isAuditTask = false">
        <div class="masking"></div>
        <div class="popupModal-center" @click.stop>
            <div class="popupModal-main">
              <div class="popupModal-module"></div>
              <div class="popupModal-main-content">
                <div class="popupModal-main-title">审核任务</div>
                <div class="popupModal-main-tips"></div>
                <div class="popupModal-main-but-group">
                  <div class="popupModal-main-but" @click="isAuditTask = false">不通过</div>
                  <div class="popupModal-main-but" @click="handSubmitAuditTask">通过</div>
                </div>
              </div>
            </div>
            <div class="close" @click="isAuditTask = false">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div>
        </div>
    </div>
    <!-- 更新成员 -->
    <div class="popupModal" v-if="isUpDataUser" @click="isUpDataUser = false">
        <div class="masking"></div>
        <div class="popupModal-center" @click.stop>
            <div class="popupModal-main">
              <div class="popupModal-module"></div>
              <div class="popupModal-main-content">
                <div class="popupModal-main-title">是否确定更新成员</div>
                <div class="popupModal-main-tips"></div>
                <div class="popupModal-main-but-group">
                  <div class="popupModal-main-but" @click="isUpDataUser = false">否</div>
                  <div class="popupModal-main-but" @click="handSubmitUpDataUser">是</div>
                </div>
              </div>
            </div>
            <div class="close" @click="isUpDataUser = false">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div>
        </div>
    </div>
    <!-- 提示需质押押金金额 -->
    <div class="popupModal" v-if="isDepositOfPledge" @click="isDepositOfPledge = false">
      <div class="masking"></div>
      <div class="popupModal-center"  @click.stop>
          <div class="popupModal-main">
            <div class="popupModal-module"></div>
            <div class="popupModal-main-content">
              <div class="popupModal-main-title">需支付质押押金</div>
              <div class="popupModal-main-amount">¥{{ payAmount }}</div>
              <div class="popupModal-main-but" @click="findDepositOfPledge">确定</div>
            </div>
          </div>
          <div class="close" @click="isDepositOfPledge = false">
              <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
          </div>
      </div>
    </div>
    <!-- 扫码支付 -->
    <PayBg :payData="payData" @close="closePayModal" v-if="payData.isPay" @button-click="pointsDeduction" />
    <!-- 团队管理 -->
    <div class="popupModal" v-if="isTeamManage" @click="isTeamManage = false, popUserId = ''">
        <div class="masking"></div>
        <div class="team-center" @click.stop>
          <div class="team-wrapper">
            <div class="team-wrapper-mask"></div>
            <div class="team-center-main">
              <div class="team-center-title">团队管理</div>
              <div class="team-center-select">
                  <div class="search-main">
                      <div class="search-icon">
                          <i class="icon font_family icon-fangdajing24"></i>
                      </div>
                      <div class="search-input">
                          <input 
                              ref="inputRefs"
                              type="text" 
                              v-model="searchUserValue" 
                              placeholder="输入用户名或账号" 
                              @keyup.enter="handleSearchUserEnter"
                          />
                      </div>
                      <div class="search-clear">
                          <i 
                              class="icon font_family icon-shanchuyuanquanbeijing24" 
                              v-if="searchUserValue !== ''"
                              @click="searchUserValue = ''"
                          ></i>
                      </div>
                  </div>
                  <div class="search-result" v-if="isSearchUser" @click.stop>
                    <div class="search-result-main">
                      <div class="masking"></div>
                      <div class="search-result-wrapper">
                        <div
                          class="user-item"
                          v-for="(item, index) in searchListData" 
                          :key="index"
                        >
                          <div class="user-item-main">
                            <div class="user-item-main-info">
                              <div class="user-item-main-info-content">
                                <div class="user-item-avatar">
                                  <img :src="item.avatar" alt="" />
                                </div>
                                <div class="user-item-info">
                                  <div class="user-item-name">{{ item.username }}</div>
                                  <div class="user-item-post">{{ item.post }}</div>
                                </div>
                              </div>
                            </div>
                            <div class="user-item-main-btn" @click="handleInviteJoin(item)">
                              邀请加入
                            </div>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
              </div>
              <div class="team-center-list">
                <div class="applies-list">
                    <div class="applies-list-item">
                      <div class="item-content">
                          <div class="item-content-left rowColor"> 团队成员</div>
                          <div class="item-content-center rowColor">职责</div>
                          <div class="item-content-right rowColor">操作</div>
                      </div>
                    </div>
                    <div
                        class="applies-list-item"
                        v-for="(item, index) in findMemberListData" 
                        :key="item.userId"
                    >
                        <div class="item-content">
                            <div class="item-content-left">
                                <div class="item-content-left-main">
                                    <div class="item-content-left-main-avatar">
                                        <img :src="item.userAvatar" alt="" />
                                    </div>
                                    <div class="item-content-left-main-info">
                                        <div class="item-content-left-main-info-name" :title="item.username">{{ item.username }}</div>
                                    </div> 
                                </div>
                            </div>
                            <div class="item-content-center">
                              <template v-if="item.taskId == 0 || item.taskId == '' || item.taskId == null">
                                任务管理者
                              </template>
                              <template v-else>
                                {{ item.taskName }}
                                <!-- <template v-if="item.taskName !== 0 && item.taskName !== '' && item.taskName !== null">{{ item.taskName }}</template>
                                <template v-else>
                                  <div class="item-content-center-null" @click="togglePopup(index, item.userId,  $event)">
                                    <div class="item-content-center-null-icon"></div>
                                    <div class="item-content-center-null-text">待指定任务</div>
                                    <div class="item-content-center-null-but">
                                      <i 
                                        class="icon font_family"
                                        :class="popUserId !== item.userId ? 'icon-a-jiantouxiangxiazhankai24' : 'icon-a-jiantouxiangshangshousuo24'"
                                      ></i>
                                    </div>
                                  </div>
                                  
                                </template> -->
                              </template>
                            </div>
                            <div class="item-content-right">
                              <template v-if="userInfo.id == missionAdminUserId">
                                <template v-if="item.userId !== missionAdminUserId">
                                  <template v-if="item.taskStatus !== 2">
                                    <span  @click="delTaskUser(item)">删除</span>
                                  </template>
                                </template>
                            </template>
                            </div>
                        </div>
                    </div>
                    
                </div>
              </div>
            </div>
          </div>
          <div class="close" @click="findscloseClick">
              <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
          </div>
        </div>
        <div 
          class="popup-modal" 
          v-if="showInnerPopup"
          :style="{ top: innerPopupTop + 'px' }"
        >
          <div class="popup-modal-center">
            <div class="masking"></div>
            <div class="popup-modal-main">
              <div class="personInCharge-center-title">可指定任务</div>
              <div class="personInCharge-center-list">
                  <div class="applies-list">
                      <div
                          class="applies-list-item"
                          v-for="(item, index) in tasksListAdminData" 
                          :key="item.taskId"
                      >
                          <div class="item-content">
                              <div class="item-content-left">
                                  <div class="item-content-left-main">
                                      <div class="item-content-left-main-info">
                                          <div class="item-content-left-main-info-name">{{ item.name }}</div>
                                      </div> 
                                  </div>
                              </div>
                              <div class="item-content-right" @click="chooseApplys(item, index)">
                                  <i 
                                      class="icon font_family"
                                      :class="applyIds == item.taskId ? 'icon-gouxuanyuanxingbiankuang24' : 'icon-weigouxuanyuanxingbiankuang24'"
                                  ></i>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="personInCharge-main-selectBut">
                  <div 
                      class="personInCharge-main-selectBut-item"
                      @click="showInnerPopup = false, popUserId = ''"
                  >取消</div>
                  <div 
                      class="personInCharge-main-selectBut-item"
                      @click="findTasksListAdminDataClick"
                  >确认</div>
              </div>
            </div>
          </div>
      </div>
    </div>
    <!-- 提案 弹窗 -->
    <Proposal
      v-if="isEditorVisible" 
      :isVisible="isEditorVisible"
      :initialContent="content"
      :maxLength="200"
      :daoId="daoId"
      :missionId="missionId"
      type="1"
      @update:content="updateContent"
      @close="closeEditor"
    />
    <!-- 上传知识库 -->
    <KnowledgeBase
      v-if="isKnowledgeBaseVisible"
      type="1"
      :isVisible="isKnowledgeBaseVisible"
      :initialContent="kbContent"
      :daoId="daoId"
      :missionId="missionId"
      :maxLength="200"
      @update:content="updateKbContent"
      @close="closeKnowledgeBase"
    />
    <!-- 上传节点 -->
    <NodeModal
      v-if="isNodeModalVisible"
      :type="1"
      :isVisible="isNodeModalVisible"
      :initialContent="nodeContent"
      :daoId="daoId"
      :missionId="missionId"
      :maxLength="200"
      @update:content="updateNodeContent"
      @close="closeNodeBase"
    />
    <div class="popupModal" v-if="isPayType" @click="isPayType = false">
        <div class="masking"></div>
        <div class="popupModal-center" @click.stop>
            <div class="popupModal-main">
              <div class="popupModal-module"></div>
              <div class="popupModal-main-content">
                <div class="popupModal-main-title">请选择支付方式！</div>
                <div class="popupModal-main-tips">积分支付限时开启，积分可用于抵扣手续费！</div>
                <div class="popupModal-main-but-group">
                  <div class="popupModal-main-but" @click="findAggregatePayFun">聚合支付</div>
                  <div class="popupModal-main-but" v-if="isPointOpen == 1" @click="findPayWithPointsFun">积分支付</div>
                </div>
              </div>
            </div>
            <div class="close" @click="isPayType = false">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import router from '@/router';
  import { computeHmac, extractIdFromUrl, getItem, isNumeric, setItem } from '@/utils/index';
  import { applyList, applyChoose } from '@/api/dao';
  import { getDaoDetails, tasksSave, subTasksList, proposalsSave, applyAdd, memberList, memberAdd, memberDelete, tasksListAdmin, searchUser, daosTasksCancel, nodePeriodList, nodeDataAdd, knowledgeAdd } from '@/api/dao';
  import { upChainPoundages, pointIsOpen, orderSave, orderQuery, chainBalance } from '@/api/pay';
  import { filesCos, categoryGet } from '@/api/common';
  import { uploadFileToCOS } from '@/services/uploadService';
  import { useUploadStore } from '@/stores/uploadStore';
  import { aeUseStore } from '@/stores/user';
  import PayBg from '@/components/pay/index.vue';
  import Proposal from '@/components/popUp/proposal/index.vue';
  import KnowledgeBase from '@/components/popUp/knowledgeBase/index.vue';
  import NodeModal from '@/components/popUp/node/index.vue';
  import ImageUpload from '@/components/upload/index.vue';
  import inExecution from '@/assets/images/dao/inExecution.png';

  import found from '@/assets/images/common/found.png';
  import line1 from '@/assets/images/common/line1.png';
  import line2 from '@/assets/images/common/line2.png';
  import line3 from '@/assets/images/common/line3.png';
  import line4 from '@/assets/images/common/line4.png';
  import line5 from '@/assets/images/common/line5.png';
  import line6 from '@/assets/images/common/line6.png';
  import { showPopup } from '@/utils/usePopup';
  // 图片数组
  const guideLineImg = ref([
    {name: 'line1', url: line1, icon: 'icon-sanjiaoxing30'},
    {name: 'line2', url: line2, icon: 'icon-zhengfangxing30'},
    {name: 'line3', url: line3, icon: 'icon-zhengfangxing30'},
    {name: 'line4', url: line4, icon: 'icon-cha30'},
    {name: 'line5', url: line5, icon: 'icon-sanjiaoxing30'},
    {name: 'line6', url: line6, icon: 'icon-zhengfangxing30'}
  ]);

  const isAddSubtask = ref(false); // 显示新增子任务弹窗
  const isApplyList = ref(false); // 显示任务申请人列表
  const isApplyListVerify = ref(false); // 显示二次确认任务申请人列表
  const isNotPass = ref(false); // 显示任务申请未通过
  const isUnderReview = ref(false); // 显示任务申请审核中
  const isExitTask = ref(false); // 显示退出任务二次确认
  const applyListData = ref([]); // 任务申请人列表
  const isTod = ref(false); // 显示任务转让通知
  const isAuditTask = ref(false); // 显示任务审核
  const isUpDataUser = ref(false); // 更新成员 
  const isDepositOfPledge = ref(false); // 显示质押押金
  const isTeamManage = ref(false); // 显示团队管理
  const applyId = ref(0);
  const search = ref(''); // 搜索任务申请人
  const formTips = ref(''); // 提示信息
  const payAmount = ref(0); // 押金金额
  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;
  console.log('userInfo', userInfo);
  const isPayType = ref(false); // 是否显示支付方式
  const isPayTypeShow = ref(false); // 是否显示积分支付\
  const sbumitData = ref({}); // 提交数据
  const isModelName = ref(1); // 1: 创建子任务 2：指定责任人

  // 打开消息通知弹框
  const handShowMsgModalFun = () => {
    userInfo.isMsgShow = !userInfo.isMsgShow;
  };

  // 子任务表单数据
  const subtaskData = ref({
    missionId: '',
    daoId: '',
    name: '',
    day: '',
    cover: '',
    trustValue: '',
    reward: null as number | null,
    competencyRequirement: '',
    description: '',
    nodePeriod: '',
    nodePassRate: ''
  });

  const currentDropdown = ref<string | null>(null);
  const tabTime = ref([]);


  // dao 详情数据
  const daoDetails = ref({
    missionId: '',
    missionCover: '',
    daoId: '',
    name: '',
    industry: '',
    passRate: '',
    taskPeriod: '',
    isDaoMember: '',  // 是否是dao成员 0否 1是
    cover: ''
  });

  // 跳转Dao详情
  const routerPush = (id: any) => {
    userInfo.daoType = 1;
    setItem('daoType', 1);
    router.push({ name: 'TeamDetails', params: { id: id} })
  }

  const getRouterPush = async (id: any) => {
    router.push({ name: 'TataskDetails', params: { id: id} })
  }

  // 子任务数据
  const taskData = ref([]);
  
  // 将数据每两项分为一组
  const groupedData = computed(() => {
    const result = [];
    if (taskData.value.length > 0){
      for (let i = 0; i < taskData.value.length; i++) {
        // result.push(taskData.value.slice(i, i + 2));
        // 将 img 直接添加到对应的 data 中
        taskData.value[i].img = guideLineImg.value[i % guideLineImg.value.length].url;
        taskData.value[i].icon = guideLineImg.value[i % guideLineImg.value.length].icon;
        taskData.value[i].imgClass = guideLineImg.value[i % guideLineImg.value.length].name;
      }
      // 将数据按两项一组分组
      for (let i = 0; i < taskData.value.length; i += 2) {
        result.push(taskData.value.slice(i, i + 2));
      }
    }
    
    return result;
  });

  // 时间转换
  const conversionTime = (time: string) => {
    if(time !== '' && time !== undefined && time !== null) {
      time = time.replace(/-/g, '.');
      return time.slice(5, 10);
    }
  }
  const conversionYeaTime = (time: string) => {
    if(time !== '' && time !== undefined && time !== null) {
      time = time.replace(/-/g, '.');
      return time.slice(0, 5);
    }
  }

  // 拖动滚动条
  const isDragging = ref(false);
  const startX = ref(0);
  const scrollLeft = ref(0);

  const startDrag = (event: MouseEvent) => {
    isDragging.value = true;
    startX.value = event.pageX - event.currentTarget!.offsetLeft;
    scrollLeft.value = event.currentTarget!.scrollLeft;
  };

  const onDrag = (event: MouseEvent) => {
    if (!isDragging.value) return;
    event.preventDefault();
    const x = event.pageX - event.currentTarget!.offsetLeft;
    const walk = (x - startX.value) * 2; // 拖动速度，可以调整
    event.currentTarget!.scrollLeft = scrollLeft.value - walk;
  };

  const endDrag = () => {
    isDragging.value = false;
  };

  // 负责人操作子任务
  const isModule = ref(''); // 显示的弹框id索引
  const handleModuleSubtask = (index: any) => {
    if (isModule.value === index) {
        isModule.value = '';
      } else {
        isModule.value = index;
      }
  };

  // 获取Dao详情数据
  const missionId = ref('');
  const daoId = ref('');
  const missionAdminUserId = ref('');
  const daoType = ref(0);  // 1 正常流程进去DAO详情 2 待支付进去DAO详情
  const findGetDaoDetailsFun = () => {
    const currentUrl = window.location.href; // 获取当前页面的 URL
    let id = extractIdFromUrl(currentUrl)+'';
    let types = 0;
    if(userInfo.daoType !== '') {
        types = userInfo.daoType;
    } else {
        types = getItem('daoType');
    }
    daoType.value = types;
    let reqData = {
      id: id,
      type: types
    }
    return new Promise<void>((resolve, reject) => {
      getDaoDetails(reqData).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        daoDetails.value = response.data;
        missionAdminUserId.value = daoDetails.value.missionAdminUserId;
        missionId.value = daoDetails.value.missionId;
        daoId.value = daoDetails.value.daoId;
        console.log('daoDetails.value', daoDetails.value);
        setItem('teamDetails', daoDetails.value); // 缓存团队信息在本地,用于团队详情页面回显
        findSubTasksListFun(daoDetails.value.missionId);
        if(userInfo.id == daoDetails.value.missionAdminUserId) {
          fingNodePeriodList();
        }
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

  // 获取子任务列表
  const findSubTasksListFun = (id: any) => {
    let reqData = {
      id
    }
    return new Promise<void>((resolve, reject) => {
      subTasksList(reqData).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        taskData.value = response.data;
        subtaskData.value = {
          missionId: '',
          daoId: '',
          name: '',
          day: '',
          cover: '',
          trustValue: '',
          reward: null,
          competencyRequirement: '',
          description: '',
          nodePeriod: '',
          nodePassRate: ''
        };
        tabTime.value = [];
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

  // 删除子任务
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
      findSubTasksListFun(missionId.value);
    })
  };

  // 新增子任务
  const  nameEr = ref(false);
  const  dayEr = ref(false);
  const  coverEr = ref(false);
  const  trustValueEr = ref(false);
  const  rewardEr = ref(false);
  const  competencyRequirementEr = ref(false);
  const  descriptionEr = ref(false);
  const  nodePeriodEr = ref(false);
  const  nodePassRateEr = ref(false);

  const handleAddSubtask = () => {
    custom.value = null;
    isAddSubtask.value = true;
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
      subtaskData.value.trustValue = '';
    } else if (numValue >= 0 && numValue <= 100) {
      subtaskData.value.trustValue = numValue+'';
    } else {
      showPopup('请输入0到100之间的数字！', 'error', 3000);
      // 统一处理边界条件
      subtaskData.value.trustValue = Math.max(0, Math.min(100, numValue))+'';
    }
  };
  
  // 任务报酬只能输入数字
  const handlePayAmountInput = (event: any) => {
    const value = event.target.value;
    const numericValue = parseInt(value, 10);

    if (!isNaN(numericValue) && numericValue > 0) {
      subtaskData.value.reward = numericValue;
    } else {
      subtaskData.value.reward = null;
    }
  }

  // 任务周期只能输入数字
  const handleDayInput = (event: any) => {
    subtaskData.value.day = isNumeric(event.target.value);
    if(Number(subtaskData.value.day) < 1 ) {
      subtaskData.value.day = '';
    }
    else if(Number(subtaskData.value.day) > Number(daoDetails.value.missionDay) ) {
      subtaskData.value.day = '';
      showPopup('子任务时间大于大任务时间，请注意！', 'error', 3000);
    }
  }

  // 节点通过率只能输入数字
  const handlenodePassRateInput = (event: any) => {
    const value = event.target.value;
    if (isNumeric(value)) {
      const numberValue = Number(value);
      if (numberValue >= 1 && numberValue <= 100) {
        subtaskData.value.nodePassRate = numberValue+ '';
      } else {
        subtaskData.value.nodePassRate = '';
      }
    } else {
      subtaskData.value.nodePassRate = '';
    }
  };

  //获取上传的封面图
  const findGetImageUrlFun = (urls: string[]) => {
    console.log('上传的图片文件', urls);
    subtaskData.value.cover = urls[0];
  };

  // 选择节点周期
  const custom = ref(null); // 自定义时间
  const nodeCycleData = ref([
    { id: 1, label: '一周', value: 7 },
    { id: 2, label: '半个月', value: 15 },
    { id: 3, label: '一个月', value: 30 },
    { id: 4, label: '三个月', value: 90 },
    { id: 5, label: '自定义周期', value: null }
  ]);

  const filterInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    target.value = target.value.replace(/[^0-9]/g, '');
  };
  const toggleDropdown = (dropdownName: string) => {
    currentDropdown.value = currentDropdown.value === dropdownName ? null : dropdownName;
    console.log('currentDropdown.value1', currentDropdown.value);
    document.addEventListener('click', handleClickOutside);
    
  };
  const handleClickOutside = () => {
    currentDropdown.value = null;
    console.log('currentDropdown.value2', currentDropdown.value);
  };
  const isSellNoOff = ref(null as number | null);
  const findSellTypeFun = (index: number) => {
    isSellNoOff.value = index;
  };

  // 关闭新增子任务弹窗
  const closeAddSubtask = () => {
    isAddSubtask.value = false;
    isSellNoOff.value = null;
    currentDropdown.value = null;
    nameEr.value = false;
    dayEr.value = false;
    coverEr.value = false;
    trustValueEr.value = false;
    rewardEr.value = false;
    competencyRequirementEr.value = false;
    descriptionEr.value = false;
    nodePeriodEr.value = false;
    nodePassRateEr.value = false;
  };
  // 提交新增子任务
  const getData = () => {
    let resData = subtaskData.value;
    let nodeTiem = '';
    resData.missionId = daoDetails.value.missionId;
    resData.daoId = daoDetails.value.daoId;
    if(isSellNoOff.value == 1) {
      nodeTiem = '7';
    } else if (isSellNoOff.value == 2){
      nodeTiem = '15';
    } else if (isSellNoOff.value == 3){
      nodeTiem = '30';
    } else if (isSellNoOff.value == 4){
      nodeTiem = '90';
    } else if (isSellNoOff.value == 5){
      nodeTiem = custom.value+'';
    }
    resData.nodePeriod = nodeTiem;
    
    return resData;
  };

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
          subtaskData.value.cover = `https://${coverResult.data.Location}`;
          if (!coverResult.success) throw coverResult.error;
        }
        // 所有文件上传成功后，执行发布操作
        isUnll.value = true;  
        submitContents();
        // 清空上传状态
        uploadStore.clearAllFiles();

      } catch (error) {
        console.error('发布失败：', error);
        showPopup('封面发布失败，请重试！', 'error', 3000);
      } finally {
        isPublishing.value = false;
      }
    };

  const isUnll = ref(true); // 提交按钮是否禁用
  const submitContents = () => {
    let resData = getData();
    
    // 检查对象中的每个键值对
    for (const key in resData) {
      if (resData.hasOwnProperty(key)) {
        console.log('resData.key', resData[key]);
        const value = resData[key];
        if (value === '' || value === null || value === undefined) {
          console.log(`键 ${key} 的值为空`);
          switch (key) {
            case 'name':
              nameEr.value = true;
              break;
            case 'day':
              dayEr.value = true;
              break;
            case 'cover':
              coverEr.value = true;
              break;
            case 'trustValue':
              trustValueEr.value = true;
              break;
            case 'reward':
              rewardEr.value = true;
              break;
            case 'cover':
              coverEr.value = true;
              break;
            case 'competencyRequirement':
            competencyRequirementEr.value = true;
              break;
            case 'description':
              descriptionEr.value = true;
              break;
            case 'nodePeriod':
              nodePeriodEr.value = true;
              break;
            case 'nodePassRate':
              nodePassRateEr.value = true;
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
            case 'cover':
              coverEr.value = false;
              break;
            case 'trustValue':
              trustValueEr.value = false;
              break;
            case 'reward':
              rewardEr.value = false;
              break;
            case 'cover':
              coverEr.value = false;
              break;
            case 'competencyRequirement':
            competencyRequirementEr.value = false;
              break;
            case 'description':
              descriptionEr.value = false;
              break;
            case 'nodePeriod':
              nodePeriodEr.value = false;
              break;
            case 'nodePassRate':
              nodePassRateEr.value = false;
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
      isModelName.value = 1;
      submitSubTask(resData);
    }
  };


  const submitSubTask = (reqData: any) => {
    findupChainPoundage(); // 查询是否开启上链
    
    if(isPointOpen.value == 1) {
        if(Number(integralBalance.value) > Number(expense.value)) {
            isPointOpen.value = 1;
            sbumitData.value = reqData;
            isPayType.value = true;
        } else {
            isPointOpen.value = 0;
            openPayModal(1, 8, reqData);
        }
    } else {
      isPointOpen.value = 0;
      openPayModal(1, 8, reqData);
    }
  };

  
  // 申请参与子任务
  const applyToParticipate = (data: any) => {
    console.log('data', data);
    let reqData = {
        id: data.taskId,
        missionId: daoDetails.value.missionId
    }
    return new Promise<void>((resolve, reject) => {
      applyAdd(reqData).then((response: any) => {
          const { code, message } = response;
          
          if (code !== 200) {
            showPopup(message, 'error', 3000);
              return;
          }
          findSubTasksListFun(missionId.value);
          isUnderReview.value = true;
          setTimeout(() => {
              isUnderReview.value = false;
          }, 3000);
          resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

  /** 选择任务负责人数据 ***/
  const taskId = ref(''); // 任务ID
  const selectResponsiblePerson = (id: any) => {
    taskId.value = id;
    let reqData = {
      id: Number(id),
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

  const chooseApply = (item: any, index: number) => {
      applyId.value = item.userId;
  };

  /** 点击确认选择责任人 ***/
  const findsbumitApplyClick = async () => {
    isApplyList.value = false;
    isApplyListVerify.value = true;
  };

  /** 二次确认选择责任人提交 **/
  const findsbumitApplySubmit = async () => {
      let reqData = {
          id: taskId.value,
          daoId: daoId.value,
          assignUserId: applyId.value
      }
      isModelName.value = 2;
      await findupChainPoundage(); // 计算链上手续费
      if(isPointOpen.value == 1) {
        if(Number(integralBalance.value) > Number(expense.value)) {
            isPointOpen.value = 1;
            sbumitData.value = reqData;
            isPayType.value = true;
            payData.value.payAmount = expense.value;
            payData.value.poundage = 0;
            payData.value.mps = 0;
        } else {
            isPointOpen.value = 0;
            openPayModal(2, 10, reqData);
        }
      } else {
        isPointOpen.value = 0;
        openPayModal(2, 10, reqData);
      }
    }

  const findApplyListFun = () => {
    isApplyList.value = false;
    applyId.value = 0;
  };

  // 二次确认退出任务
  const exitTaskId = ref('');
  const handleExitTask = (id: any) => {
    isExitTask.value = true;
    exitTaskId.value = id;
  };
  // 退出任务
  const handSubmitExitTask = () => {
    exitTaskId.value = '';
  };

  // 点击审核任务按钮
  const subTaskId = ref('');
  const handleAuditTask = (id: any) => {
    subTaskId.value =  id;
    isAuditTask.value = true;
  };

  // 审核任务通过
  const handSubmitAuditTask = () => {
    // let reqData = {
    //   id: exitTaskId.value
    // }
    // return new Promise<void>((resolve, reject) => {
    //   auditTask(reqData).then((response: any) => {
    //     const { code, message } = response;
    //     
    //     if (code !== 200) {
    //       console.log(message);
    //       return;
    //     }
    //    // 需要刷新子任务列表
    //   })
    // })
  }

  // 显示更新成员
  const upDataUserId = ref('');
  const showUpDataUser = (id: any) => {
    upDataUserId.value = id;
    isUpDataUser.value = true;
  };

  // 更新成员
  const handSubmitUpDataUser = () => {
    // let reqData = {
    //   id: exitTaskId.value
    // }
    // return new Promise<void>((resolve, reject) => {
    //   auditTask(reqData).then((response: any) => {
    //     const { code, message } = response;
    //     
    //     if (code !== 200) {
    //       console.log(message);
    // }
    // })
    // })
  }

  // 节点操作模块
  const isNodeModalVisible = ref(false); // 是否显示节点操作弹窗
  const isNodeShow = ref(false); // 是否显示节点列表
  // 节点列表 0 已上传 1 未上传
  const nodeList = ref([]);

  const uploadNode = (item: any) => {
    userInfo.nodeId = item.id;
    isNodeModalVisible.value = true;
  };

  // 节点
  const nodeContent = ref<string>('');

  // 获取节点周期列表
  const fingNodePeriodList = async () => {
    let getData = {
      id: missionId.value
    };
    return new Promise<void>((resolve, reject) => {
      nodePeriodList(getData).then((response: any) => {
        const { code, data, message } = response;
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        // isUpload	String	是否已经上传：0没上传 1已经上传 2过期未上传
        let hasHighlighted = false;
        resultData.map((item: any) => {
          let disabled = false;
          let highlighted = false;

          if (item.isUpload == 1) {
            item.disabled = true;
            item.disabled = false;
            item.highlighted = false;
          } else if (item.isUpload == 0 || item.isUpload == 2) {
            if (hasHighlighted) {
              item.disabled = true;
              item.highlighted = false;
              hasHighlighted = true;
            } else {
              item.disabled = false;
              item.highlighted = true;
              hasHighlighted = true;
            }
          }
          return { ...item, disabled, highlighted };
        });
        
        nodeList.value = resultData;

        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

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

        fingNodePeriodList();
        findGetDaoDetailsFun();
        isNodeShow.value = false;
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


  // 发起提案
  const isEditorVisible = ref(false);
  const content = ref<string>('');
  // 打开编辑器
  const openEditor = () => {
    isEditorVisible.value = true;
  };

  // 关闭编辑器
  const closeEditor = () => {
    isEditorVisible.value = false;
  };

  // 发起提案
  const updateContent = (newContent: any) => {
    // content.value = newContent.content;
    console.log('content.value', newContent.value);
    newContent.missionId = missionId.value;
    // delete newContent.daoId;
    return new Promise<void>((resolve, reject) => {
      proposalsSave(newContent).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }

        findGetDaoDetailsFun();
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
    router.push({ name: 'Proposal', params: { id: daoId.value} })
  };

  // 跳转到任务知识库
  const handKnowledgeBase = () => {
    router.push({ name: 'KnowledgeBase', params: { id: daoId.value} })
  };

  // 跳转到节点知识库
  const handNodeList = () => {
    userInfo.nodeType = 3;
    userInfo.routerNodeId = daoDetails.value.missionAdminUserId;
    router.push({ name: 'NodeList', params: { id: daoId.value} })
  };

  // 团队知识库
  const isKnowledgeBaseVisible = ref(false);
  const kbContent = ref<string>('');
  // 提交知识库
  const updateKbContent = (newContent: any) => {
    console.log('newContent', newContent);
    newContent.missionId = missionId.value;
    return new Promise<void>((resolve, reject) => {
      knowledgeAdd(newContent).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        findGetDaoDetailsFun();
        isKnowledgeBaseVisible.value = false;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  }
  // 关闭团队知识库
  const closeKnowledgeBase = () => {
    isKnowledgeBaseVisible.value = false;
  };

  // 打开子任务详情
  const openDetails = (item: any) => {
    userInfo.subTaskType = 1;
    setItem('subTaskType', 1);
    router.push({ name: 'subTaskDetails', params: { id: item.taskId} })
  };

  // 打开子任务执行详情
  const handleExecuteDetails = (item: any) => {
    console.log('打开子任务详情', item);
    // 	0未指定 1个人 2DAO
    userInfo.missionId = missionId.value;
    setItem('missionId', missionId.value)
    router.push({ name: 'executeDetails', params: { id: item.taskId} })
  };

  // 获取团队成员列表
  const memberListData = ref([]);
  const handMemberListDataFun = () => {
    let reqData = {
      id: daoId.value
    }
    return new Promise<void>((resolve, reject) => {
      memberList(reqData).then((response: any) => {
        const { code, message, data } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        memberListData.value = data;
        isTeamManage.value = true
      })

    })
  };

  // 关闭团队成员弹框
  const findscloseClick = () => {
    isTeamManage.value = false;
  };

  // 搜索团队成员
  interface User {
    userId: number;
    userUuid: string;
    userAvatar: string;
    username: string;
    taskId: string;
    taskName: string;
  }
  const searchListData = ref<User[]>([]);
  const searchUserValue = ref('');
  const isSearchUser = ref(false);

  const handleSearchUserEnter = () => {
    // let reqData = {
    //   type: 1,
    //   value: searchUserValue.value
    // }
    // return new Promise<void>((resolve, reject) => {
    //   searchUser(reqData).then((response: any) => {
    //     const { code, message, data } = response;
    //     if (code !== 200) {
    //       console.log(message);
    //       return;
    //     }
    //     searchListData.value = data;
    //     isSearchUser.value = true;
    //   })
    // })
  }
  // 根据搜索框内容筛选数据
  const findMemberListData = computed(() => {
    return memberListData.value.filter(member => 
      member.username.toLowerCase().includes(searchUserValue.value.toLowerCase()) || 
      member.userUuid.toLowerCase().includes(searchUserValue.value.toLowerCase())
    );
  });

  // 邀请加入团队
  const handleInviteJoin = (item: any) => {
    let reqData = {
      id: daoId.value,
      inviteUserId: item.userId
    }
    return new Promise<void>((resolve, reject) => {
      memberAdd(reqData).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        isSearchUser.value = false;
        searchUserValue.value = '';
        handMemberListDataFun();
      })
    })
  }

  // 移除团队成员
  const delTaskUser = (item: any) => {
    let reqData = {
      id: daoId.value,
      deleteUserId: item.userId
    }
    return new Promise<void>((resolve, reject) => {
      memberDelete(reqData).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
      })
    })
  }


  // 子弹框的显示状态和位置
  const showInnerPopup = ref(false);
  const innerPopupTop = ref(0);
  const innerPopupLeft = ref(0);
  const popUserId = ref(''); // 弹窗中选中的用户id
  const togglePopup = (index: any, userId: any, event: MouseEvent) => {
    popUserId.value = userId;
    // 获取鼠标点击的位置
    innerPopupTop.value = event.clientY - 120;
    // innerPopupLeft.value = event.clientX;
    // 切换子弹框的显示状态
    findTasksListAdminFun();
    showInnerPopup.value = true;
  }

  // 获取可分配的任务列表
  const tasksListAdminData = ref([]);
  const findTasksListAdminFun = () => {
    let reqData = {
      id: missionId.value
    }
    return new Promise<void>((resolve, reject) => {
      tasksListAdmin(reqData).then((response: any) => {
        const { code, message, data } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        tasksListAdminData.value = data;
      })
    })
  }
  const applyIds = ref(0);
  const chooseApplys = (item: any, index: number) => {
    applyIds.value = item.taskId;
  };

  // 指定任务
  const findTasksListAdminDataClick = () => {
    let reqData = {
      id: applyIds.value,
      daoId: daoId.value,
      assignUserId: popUserId.value
    }
    return new Promise<void>((resolve, reject) => {
      applyChoose(reqData).then((response: any) => {
        const { code, message, data } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        showInnerPopup.value = false;
        handMemberListDataFun();
      })
    })
  }

  /** 支付模块 **/

  // 聚合支付
  const findAggregatePayFun = () => {
        isPayType.value = false;
        payData.value.type = 1;
        // 1: 创建子任务 2：指定责任人
        if(isModelName.value == 1) {
          openPayModal(1, 8, sbumitData.value);
        } else if(isModelName.value == 2) {
          openPayModal(2, 10, sbumitData.value);
        }
        
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
      // 1: 创建子任务 2：指定责任人
      if(isModelName.value == 1) {
        payData.value.payAmount = expense.value;
        payData.value.poundage = 0;
        payData.value.mps = 0;
        openPayModal(1, 7, sbumitData.value);
      } else if(isModelName.value == 2) {
        payData.value.payAmount = createNftFee.value;
        payData.value.poundage = 0;
        payData.value.mps = 0;
        openPayModal(2, 9, sbumitData.value);
      }
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
    findSubTasksListFun(daoDetails.value.missionId);
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
    payData.value.payUrl = item.rewardQrcode;
    orderNo.value = item.rewardOrderNo;
    payData.value.payAmount = item.rewardAmount;
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
    openPayModal(3, 12, item)
   }

    // 计算链上手续费
    const expense = ref(0); // 上链手续费
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
     // 创建支付订单
    const orderNo = ref(''); // 订单号
    const isActive = ref(true); // 使用 ref 存储活动状态
    // type: 1 创建子任务，2 指定子任务责任人,3 子任务质押金
    const openPayModal = (type: number, payType: number, getData: any) => {
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
         if(type == 1) {
            content = payType+''+subtaskData.value.reward+'0'+timestamp;
            console.log('userId', userId);
            console.log('content', content)
            console.log('Date.now()', timestamp)
            reqData = {
                // businessId: taskId,
                businessData: getData,
                businessType: payType,
                amount: subtaskData.value.reward,
                poundage: 0,
                timeStamp: timestamp,
                sign: computeHmac(content.toString(), userId.toString())
            };
            
        } else if(type == 2) {
            content = payType+'0'+expense.value+timestamp;
            reqData = {
                // businessId: taskId,
                businessType: payType,
                businessData: getData,
                amount: 0,
                poundage: expense.value,
                timeStamp: timestamp,
                sign: computeHmac(content.toString(), userId.toString())
            };
        } else if(type == 3) {
            content = payType+''+getData.reward+'0'+timestamp;
            reqData = {
                // businessId: newDaoId.value,
                businessData: {taskId: getData.taskId},
                businessType: payType,
                amount: getData.reward,
                poundage: 0,
                timeStamp: timestamp,
                sign: computeHmac(content.toString(), userId.toString())
            };
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
              payData.value.payAmount = expense.value;
              payData.value.minute = resultData.minute;
              payData.value.createTime = resultData.createTime;
              
              if(type == 1) {
                if(payType == 7) {
                  isAddSubtask.value = false;
                  isPayType.value = false;
                  payData.value.isPay = false;
                  findSubTasksListFun(missionId.value);
                } else if(payType == 8) {
                  closeAddSubtask();
                  isActive.value = true;
                  findOrderResult(type);
                  payData.value.isPay = true;
                }
                
              }
              if(type == 2) {
                if(payType == 9) {
                  isApplyListVerify.value = false;
                  isPayType.value = false;
                  payData.value.isPay = false;
                  findSubTasksListFun(missionId.value);
                } else if(payType == 10) {
                  payData.value.payAmount = expense.value;
                  isApplyListVerify.value = false;
                  isActive.value = true;
                  payData.value.isPay = true;
                  findOrderResult(type);
                }
              }
              if(type == 3) {
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
                  clearTimeout(timer);
                  isActive.value = false;
                  if(type == 1) {
                    findSubTasksListFun(missionId.value);
                    closeAddSubtask();
                  } else if(type == 2) {
                    findApplyListFun();
                    findSubTasksListFun(missionId.value);
                  } else if(type == 3) {
                    findSubTasksListFun(missionId.value);
                    closeAddSubtask();
                  }
                  findSubTasksListFun(missionId.value);
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
    // 页面卸载时停止重试并清除定时器
    onBeforeUnmount(() => {
      isActive.value = false;
      clearTimeout(timer);
    });

    // 在路由变化时停止重试并清除定时器
    router.beforeEach((to, from, next) => {
      isActive.value = false;
      clearTimeout(timer);
      next();
    });


  onMounted(() => {
    findGetDaoDetailsFun();
    findChainBalanceFun();
    findPointIsOpenFun();
    findupChainPoundage();
  })

  // 查看用户个人中心
  const findViewPersonalInfo = (userId: any) => {
    userInfo.othersId = userId;
    router.push('/PersonalHomepage');
    // window.open(`${window.location.origin}/personalHomepage`, '_blank');
  };

</script>

<style lang='scss' scoped>
  @use '@/assets/styles/daoDetails.scss';
</style>
