<template>
  <div class="taskDetails">
    <persHeader />
    <div class="taskDetails-container">
        <div class="taskDetails-container-body">
            <div class="body-main">
                <div class="body-main-info">
                    <div class="body-main-info-content">
                        <div class="info-content-cover">
                            <div class="info-content-cover-img">
                                <el-image
                                    style="width: 100%; height: 100%"
                                    :src="taskDetails.cover"
                                    fit="cover"
                                    >
                                    <template #error>
                                        <img src="@/assets/images/common/default.png" alt="Default Image" />
                                    </template>
                                </el-image>
                            </div>
                            <div class="info-content-cover-text">任务报酬：<span>¥<Statistic :NumberData="taskDetails.payAmount" /></span></div>
                        </div>
                        <div class="body-main-info-users">
                            <div class="info-users-time">
                                {{ taskDetails.createTime }}
                            </div>
                            <div class="info-users-initiator">
                                <div class="info-users-initiator-name multi-line-1">{{ taskDetails.name }}</div>
                                <div class="user-id multi-line-1">任务ID：{{ taskDetails.id }}</div>
                            </div>
                            <div class="info-users-list">
                                <div class="list-info">
                                    <div class="list-info-name">
                                        <div class="list-info-name-text">任务来源：</div>
                                        <div class="list-info-name-img" @click="findViewPersonalInfo(taskDetails.userId)">
                                            <el-image
                                                :src="taskDetails.createUserAvatar"
                                                fit="cover"
                                                >
                                                <template #error>
                                                    <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                </template>
                                            </el-image>
                                        </div>
                                    </div>
                                </div>
                                <div class="user-id multi-line-1 mat-0">账号ID：{{ taskDetails.createUserUuid }}</div>
                            </div>
                            <div class="info-users-list mat-10">
                                <template v-if="userInfo.id == taskDetails.userId || userInfo.id == taskDetails.adminUserId">
                                    <template v-if="taskType !== 2 && taskType !== 3">
                                        <template v-if="taskDetails.adminUserUuid !== '' && taskDetails.adminUserUuid !== null">
                                            <div class="list-info">
                                                <div class="list-info-name">
                                                    <div class="list-info-name-text">任务承接：</div>
                                                    <div 
                                                        class="list-info-name-img"
                                                        @click="findViewPersonalInfo(taskDetails.adminUserId)"
                                                        v-if="taskDetails.adminUserAvatar !== '' && taskDetails.adminUserAvatar !== null && taskDetails.adminUserAvatar !== undefined"
                                                    >
                                                        <el-image
                                                            :src="taskDetails.adminUserAvatar"
                                                            fit="cover"
                                                            >
                                                            <template #error>
                                                                <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                            </template>
                                                        </el-image>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="user-id multi-line-1 mat-0">账号ID：{{ taskDetails.adminUserUuid }}</div>
                                            <div class="task-categoryName">所属行业：{{ taskDetails.categoryName }}</div>
                                        </template>
                                        <template v-else>
                                            <template v-if="taskDetails.applies.length < 1">
                                                <div class="list-info">
                                                    <div class="list-info-name">
                                                        <div class="list-info-name-text">任务申请：</div>
                                                    </div>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div class="list-info">
                                                    <div class="list-info-name">
                                                        <div class="list-info-name-text">任务申请:</div>
                                                        <div class="list-info-name-img-list">
                                                            <div 
                                                                class="list-info-name-img-list-item"
                                                                v-for="(item, index) in taskDetails.applies.slice(0, 2)" 
                                                                :key="index"
                                                            >
                                                                <el-image
                                                                    :src="item.avatar"
                                                                    fit="cover"
                                                                    >
                                                                    <template #error>
                                                                        <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                                    </template>
                                                                </el-image>
                                                            </div>
                                                            <div class="list-info-name-img-list-item" v-if="taskDetails.applies.length - 2 > 0">
                                                                <p>+ {{ taskDetails.applies.length - 2 }}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </template>
                                    </template>
                                    <template v-else>
                                        <div class="toBePaid">
                                            <!-- businessType 业务类型：发布任务上链费用：2 发布任务赏金：4 创建DAO：6 发布子任务上链费用：8 指定子任务责任人：10 发布子任务赏金：12 -->
                                            <div class="toBePaid-amount">
                                                <div class="toBePaid-amount-icon">
                                                    <i class="icon font_family icon-daojishi24"></i>
                                                </div>
                                                <div class="toBePaid-amount-text">手续费：¥
                                                    <template v-if="businessType == '2'">
                                                        <span>1.00</span>
                                                    </template>
                                                    <template v-else-if="businessType == '4'">
                                                        <span>{{ taskDetails.amount }}</span>
                                                    </template>
                                                </div>
                                            </div>
                                            <div class="toBePaid-time">
                                                <span>剩</span>
                                                <span>
                                                    <CountdownComponent
                                                        :type="1"
                                                        :orderTime="createTime"
                                                        :validityMinutes="minute"
                                                        @countdownFinished="handleCountdownFinished"
                                                    />
                                                </span>
                                                <span>
                                                    <template v-if="businessType == '2'">
                                                        任务自动取消
                                                    </template>
                                                    <template v-else-if="businessType == '4'">
                                                        订单自动取消
                                                    </template>
                                                </span>
                                            </div>
                                        </div>
                                        
                                    </template>
                                </template>
                                <template v-else>

                                </template>
                                
                            </div>
                        </div>
                        <div class="body-main-info-datas">
                            <template v-if="taskDetails.status == 2">
                                <div class="datas-item">
                                    <div class="datas-item-icon">
                                        <i class="icon font_family icon-shaloushijian20"></i>
                                    </div>
                                    <div class="datas-item-progress">
                                        <div class="progress-text" :style="{left: (Number(taskDetails.progress) ? Number(taskDetails.progress) - 6 : 0) +'%'}">{{ taskDetails.progress || 0 }}</div>
                                        <div class="progress-bar">
                                            <ScaleProgressBar :max="100" :progress="Number(taskDetails.progress) || 0" :showPercentage="true" />
                                        </div>
                                        <div class="progress-name">任务总进度</div>
                                    </div>
                                </div>
                                <div class="datas-item">
                                    <div class="datas-item-two">
                                        <div class="datas-item-two-li">
                                            <div class="datas-item-two-li-m">
                                                <div class="li-m-icon">
                                                    <div class="datas-item-icon">
                                                        <i class="icon font_family icon-rili24"></i>
                                                    </div>
                                                </div>
                                                <div class="li-m-text">
                                                    <div class="li-m-text-name">任务总周期</div>
                                                    <div class="li-m-text-data">{{ taskDetails.day }}天 </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="datas-item-two-li">
                                            <div class="datas-item-two-li-m">
                                                <div class="li-m-icon">
                                                    <div class="datas-item-icon">
                                                        <i class="icon font_family icon-xinren24"></i>
                                                    </div>
                                                </div>
                                                <div class="li-m-text">
                                                    <div class="li-m-text-name">信任值要求</div>
                                                    <div class="li-m-text-data">{{ taskDetails.trustValue }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                           <template v-else>
                               <div class="datas-item">
                                    <div class="datas-item-icon">
                                        <i class="icon font_family icon-rili24"></i>
                                    </div>
                                    <div class="datas-item-progress">
                                        <div class="progress-bar">
                                            <div class="progress-bar-display">
                                                <div class="link-l"></div>
                                                <div class="link-c">{{ taskDetails.day }}天</div>
                                                <div class="link-r"></div>
                                            </div>
                                        </div>
                                        <div class="progress-name">任务总周期</div>
                                    </div>
                                </div>
                                <div class="datas-item">
                                    <div class="datas-item-icon">
                                        <i class="icon font_family icon-xinren24"></i>
                                    </div>
                                    <div class="datas-item-progress">
                                        <div class="progress-text" :style="{left: (Number(taskDetails.trustValue) ? Number(taskDetails.trustValue) - 6 : 0) +'%'}">{{ taskDetails.trustValue || 0 }}</div>
                                        <div class="progress-bar">
                                            <ScaleProgressBar :max="100" :progress="taskDetails.trustValue || 0" :showPercentage="true" />
                                        </div>
                                        <div class="progress-name">信任值要求</div>
                                    </div>
                                </div>
                            </template>
                            <div class="datas-item">
                                <div class="datas-item-two">
                                    <div class="datas-item-two-li">
                                        <div class="datas-item-two-li-m">
                                            <div class="li-m-icon">
                                                <div class="datas-item-icon">
                                                    <i class="icon font_family icon-quanxian24"></i>
                                                </div>
                                            </div>
                                            <div class="li-m-text">
                                                <div class="li-m-text-name">交付方式</div>
                                                <div class="li-m-text-data">
                                                    <template v-if="taskDetails.resultType == 1">产品</template>
                                                    <template v-else-if="taskDetails.resultType == 2">方案</template>
                                                    <template v-else-if="taskDetails.resultType == 3">产品+方案</template>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="datas-item-two-li">
                                        <div class="datas-item-two-li-m">
                                            <div class="li-m-icon">
                                                <div class="datas-item-icon">
                                                    <i class="icon font_family icon-rili24"></i>
                                                </div>
                                            </div>
                                            <div class="li-m-text">
                                                <div class="li-m-text-name">单节点周期</div>
                                                <div class="li-m-text-data">{{ taskDetails.nodePeriod }}天 </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="datas-item">
                                <div class="datas-item-two">
                                    <div class="datas-item-two-li">
                                        <div class="datas-item-two-li-m">
                                            <div class="li-m-icon">
                                                <div class="datas-item-icon">
                                                    <i class="icon font_family icon-a-jiedian243"></i>
                                                </div>
                                            </div>
                                            <div class="li-m-text">
                                                <div class="li-m-text-name">节点可改</div>
                                                <div class="li-m-text-data">{{ taskDetails.nodeChangeTimes }}次</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="datas-item-two-li">
                                        <div class="datas-item-two-li-m">
                                            <div class="li-m-icon">
                                                <div class="datas-item-icon">
                                                    <i class="icon font_family icon-a-jiedian243"></i>
                                                </div>
                                            </div>
                                            <div class="li-m-text">
                                                <div class="li-m-text-name">修改期限</div>
                                                <div class="li-m-text-data">{{ taskDetails.nodeChangeHour }}小时</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="body-main-operation">
                    <div class="operation-item">
                        <!-- 发布者 -->
                        <template v-if="userInfo.id == taskDetails.userId">
                            <template v-if="taskType !== 2 && taskType !== 3">
                                <template v-if="taskDetails.adminUserId == null">
                                    <template v-if="taskDetails.applyNum > 0">
                                        <div class="but-oper" @click="selectResponsiblePerson">选择责任人</div>
                                        <div class="but-oper" @click="findCancelATask">取消任务</div>
                                    </template>
                                    <template v-else-if="taskDetails.applyNum < 1">
                                        <div class="but-oper" @click="findCancelATask">取消任务</div>
                                    </template>
                                </template>
                                <template v-else-if="taskDetails.adminUserId !== null">
                                    <template v-if="taskDetails.taskMode == 0">
                                        <div class="text-tips">等待承接人开启任务</div>
                                    </template>
                                    <template v-else-if="taskDetails.status == 0">
                                        <template v-if="taskDetails.payStatus !== 2">
                                            <div class="but-oper" @click="findsbumitPaySubmit">立即支付</div>
                                        </template>
                                        <template v-else-if="taskDetails.payStatus == 2">
                                            <div class="text-tips">等待承接人开启任务</div>
                                        </template>
                                    </template>
                                    <template v-else-if="taskDetails.taskMode !== 0">
                                        <template v-if="taskDetails.taskMode == 1">
                                            <div class="but-oper" @click="routerViewLink(1)">查看节点</div>
                                            <div class="but-oper" @click="routerViewLink(2)">查看提案</div>
                                            <div class="but-oper" @click="skipRouteDao">进入任务</div>
                                        </template>
                                        <template v-if="taskDetails.taskMode == 2">
                                            <template v-if="taskDetails.daoId !== 0">
                                                <div class="but-oper" @click="routerViewLink(1)">查看节点</div>
                                                <div class="but-oper" @click="routerViewLink(2)">查看提案</div>
                                                <div class="but-oper" @click="skipRouteDao">进入任务</div>
                                            </template>
                                            <template v-else>
                                                <div class="text-tips">等待承接人开启任务</div>
                                            </template>
                                        </template>
                                    </template>
                                </template>
                            </template>
                            <template v-else>
                                <template v-if="businessType == '2'">
                                    <template v-if="!hiddenTime">
                                        <div class="but-oper" @click="findToBePaidTask">发布任务</div>
                                    </template>
                                </template>
                                <template v-else-if="businessType == '4'">
                                    <template v-if="!hiddenTime">
                                        <div class="but-oper" title="立即支付质押费" @click="findToBePaidTask">立即支付</div>
                                    </template>
                                    <template v-else>
                                        <div class="but-oper" title="立即支付质押费" @click="openPayModal(1, 4, null)">立即支付</div>
                                    </template>
                                </template>
                            </template>
                        </template>
                        <!-- 管理者 -->
                        <template v-else-if="userInfo.id == taskDetails.adminUserId">
                            <template v-if="taskDetails.status == 0">
                                <template v-if="taskDetails.payStatus == 2">
                                    <div class="open-task">
                                        <div class="text-tips">恭喜您成为任务责任人</div>
                                        <div class="but-oper" @click="findOpenMeansClick(1)">开启个人任务</div>
                                        <p>或</p>
                                        <div class="but-oper" @click="findOpenMeansClick(2), showisCreateTeam">开启团队任务</div>
                                    </div>
                                </template>
                            </template>
                            <template v-if="taskDetails.status == 1">
                                <template v-if="taskDetails.taskMode == 1">
                                    <div class="but-oper" @click="showViewLink(1)">上传节点</div>
                                    <div class="but-oper" @click="showViewLink(2)">发起提案</div>
                                    <div class="but-oper" @click="skipRouterDaoDetails(taskDetails.daoId)">进入任务</div>
                                </template>
                                <template v-else-if="taskDetails.taskMode == 2">
                                    <template v-if="taskDetails.daoId == 0">
                                        <div class="but-oper" @click="findOpenMeansClick(2), showisCreateTeam">开启团队任务</div>
                                    </template>
                                    <template v-else>
                                        <template v-if="taskDetails.hasCreateDao !== 0">
                                            <div class="but-oper" @click="skipRouterDaoDetails(taskDetails.daoId)">进入任务</div>
                                        </template>
                                        <template v-else>
                                            <div class="but-oper" @click="skipRouterTeamDetails">进入任务</div>
                                        </template>
                                    </template>
                                </template>
                            </template>
                        </template>
                        <!-- 用户 -->
                        <template v-else>
                            <template v-if="taskDetails.adminUserId == null">
                                <template v-if="taskDetails.myApplyAuditStatus == null">
                                    <div class="but-oper" @click="submitApplyFor">申请任务</div>
                                </template>
                                <template v-else-if="taskDetails.myApplyAuditStatus == 1">
                                    <div class="text-tips">您已申请此任务请等待审核</div>
                                </template>
                            </template>
                            <template v-else-if="taskDetails.adminUserId !== null">
                                <template v-if="taskDetails.myApplyAuditStatus == null">
                                    <div class="but-oper" @click="skipRouterDaoDetails(taskDetails.daoId)">任务执行详情</div>
                                </template>
                                <template v-else-if="taskDetails.myApplyAuditStatus == 3">
                                    <div class="text-tips">很遗憾此任务您申请未通过</div>
                                    <div class="but-oper" @click="skipRouteDaoList">其他任务</div>
                                    <div class="but-oper" @click="skipRouterDaoDetails(taskDetails.daoId)">任务执行详情</div>
                                </template>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <DisplayArea :tabData="proData" />
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
                    <div class="popupModal-main-but" @click="router.push({ name: 'TaskList' })">查看更多任务</div>
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
    <!-- 开启任务  -->
    <div class="popupModal" v-if="isStartTask" @click="isStartTask = false">
        <div class="masking"></div>
        <div class="popupModal-center" @click.stop>
            <div class="popupModal-main">
                <div class="popupModal-module"></div>
                <div class="popupModal-main-content">
                    <div class="popupModal-main-icon">
                        <i class="icon font_family icon-shenhechenggong68"></i>
                    </div>
                    <div class="popupModal-main-title">恭喜您成为此任务管理者 请选择任务开启方式！</div>
                    <div class="popupModal-main-selectBut">
                        <div 
                            class="popupModal-main-selectBut-item"
                            v-for="item in openMeans"
                            :key="item.value"
                            @click="findOpenMeansClick(item.value)"
                        >
                            {{ item.label }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="close" @click="isStartTask = false">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div>
        </div>
    </div>
    <!-- 选择任务责任人  -->
    <div class="popupModal" v-if="isApplyList" @click="isApplyList = false">
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
                    <div class="popupModal-main-but relievoShadow" @click="findsbumitApplySubmit(1)">
                        <div class="exhibit-publish-main">
                            <div class="exhibit-publish-name">确定选择</div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 节点周期设置 -->
    <div class="popupModal" v-if="isNodeCycle" @click="isNodeCycle = false">
        <div class="masking"></div>
        <div class="popupModal-center node-width" @click.stop>
            <div class="personInCharge-center-module"></div>
            <div class="personInCharge-center-main">
                <div class="node-center">
                    <div class="node-center-title">节点周期设置</div>
                    <div class="node-center-main">
                        <div class="node-center-main-content">
                            <div class="node-center-main-content-list">
                                <div 
                                    class="node-center-main-content-list-item"
                                    :class="item.id == 5 ? 'active' : ''"
                                    v-for="(item, index) in nodeData" 
                                    :key="index"
                                    @click="findNodeClick(item)"
                                >
                                    <template v-if="item.id != 5">
                                        <div class="node-item-main">
                                            <div class="node-item-main-icon">
                                                <i 
                                                    class="icon font_family"
                                                    :class="isNode == item.id ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                                                >
                                                </i>
                                            </div>
                                            <div class="node-item-main-name">{{ item.label }}</div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="node-item-main">
                                            <div class="node-item-main-icon">
                                                <i 
                                                    class="icon font_family"
                                                    :class="isNode == item.id ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                                                >
                                                </i>
                                            </div>
                                            <div class="node-item-main-name">
                                                <div class="node-item-main-name-input">
                                                    <input 
                                                        type="text"
                                                        placeholder="请输入节点周期"
                                                        v-model="cycle"
                                                        @click="isNodeShow = true"
                                                        @input="validateCycle"
                                                    >
                                                    <span>天</span>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="node-main-selectBut">
                        <div class="node-main-selectBut-item" @click="isNodeCycle = false,isNodePassRate = true">下一步</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 节点通过率设置 -->
    <div class="popupModal" v-if="isNodePassRate" @click="isNodePassRate = false">
        <div class="masking"></div>
        <div class="popupModal-center node-width" @click.stop>
            <div class="personInCharge-center-module"></div>
            <div class="personInCharge-center-main">
                <div class="node-center">
                    <div class="node-center-title">总节点通过率设置</div>
                    <div class="node-center-main">
                        <div class="node-center-main-content">
                            <div class="node-center-main-content-list">
                                <div class="nodePassRate">
                                    <div class="nodePassRate-main">
                                        <div class="nodePassRate-main-l">
                                            <div class="nodePassRate-main-l-m">
                                                <div class="nodePassRate-main-l-m-icon">
                                                    <i class="icon font_family icon-zantong24"></i>
                                                </div>
                                                <div class="nodePassRate-main-l-m-name">节点通过率</div>
                                            </div>
                                        </div>
                                        <div class="nodePassRate-main-r">
                                            <div class="nodePassRate-main-r-m">
                                                <input 
                                                    type="text"
                                                    v-model="nodePassRate"
                                                    @input="validateNodePassRate"
                                                >
                                                <span>%</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="node-main-selectBut">
                        <div class="node-main-selectBut-item" @click="isNodeCycle = true,isNodePassRate = false">上一步</div>
                        <div class="node-main-selectBut-item" @click="findSubmitNodeClick">确定</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 创建团队 -->
    <div class="popupModal clipPathNo" v-if="isCreateTeam" @click="isCreateTeam = false">
        <div class="masking"></div>
        <div class="popupModal-center team-width" @click.stop>
            <div class="personInCharge-center-module"></div>
            <div class="personInCharge-center-main">
                <div class="team-center">
                    <div class="team-center-title">创建团队</div>
                    <div class="team-center-main">
                        <div class="team-form-top">
                            <div class="team-form-top-l">
                                <div class="team-form-top-l-item">
                                    <div class="team-form-top-item-main" :class="{ focused: nameEr }">
                                        <div class="team-form-top-item-name">
                                            <div class="team-form-top-item-name-main">
                                                <div class="team-form-top-item-icon">
                                                    <i class="icon font_family icon-renwumingcheng"></i>
                                                </div>
                                                <div class="team-form-top-item-name-text">团队名称</div>
                                            </div>
                                        </div>
                                        <div class="team-form-top-item-input">
                                            <div class="input-box">
                                                <input type="text" v-model="teamData.name" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="team-form-top-l-item">
                                    <div class="team-form-top-item-main">
                                        <div class="team-form-top-item-name">
                                            <div class="team-form-top-item-name-main">
                                                <div class="team-form-top-item-icon">
                                                    <i class="icon font_family icon-hangyeleixing24"></i>
                                                </div>
                                                <div class="team-form-top-item-name-text">所属行业</div>
                                            </div>
                                        </div>
                                        <div class="team-form-top-item-input">
                                            <div class="input-box">
                                                <input type="text" v-model="teamData.categoryName" disabled />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="team-form-top-l-item">
                                    <div class="team-form-top-item-main" :class="{ focused: passRateEr }">
                                        <div class="team-form-top-item-name">
                                            <div class="team-form-top-item-name-main">
                                                <div class="team-form-top-item-icon">
                                                    <i class="icon font_family icon-zantong24"></i>
                                                </div>
                                                <div class="team-form-top-item-name-text">投票通过率</div>
                                            </div>
                                        </div>
                                        <div class="team-form-top-item-input">
                                            <div class="input-box">
                                                <input type="text" class="textR" v-model="proPassRate" @input="validatePassRate" />
                                            </div>
                                            <span>%</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="team-form-top-l-item">
                                    <div class="team-form-top-item-main" :class="{ focused: votePeriodEr }">
                                        <div class="team-form-top-item-name">
                                            <div class="team-form-top-item-name-main">
                                                <div class="team-form-top-item-icon">
                                                    <i class="icon font_family icon-rili24"></i>
                                                </div>
                                                <div class="team-form-top-item-name-text">投票周期</div>
                                            </div>
                                        </div>
                                        <div class="team-form-top-item-input">
                                            <div class="input-box">
                                                <input type="text" class="textR" v-model="proVotePeriod"  @input="validateVotePeriod" />
                                            </div>
                                            <span>天</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="team-form-top-r">
                                <div class="team-form-top-r-img" :class="{ focused: coverEr }">
                                    <AvatarUpload
                                        upload-type="image" 
                                        name="上传团队封面"
                                        :on-upload-success="findGetImageUrlFun"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="team-form-top-item-main" :class="{ focused: descriptionEr }">
                            <div class="item-main-perm">
                                <div class="item-main-perm-top">
                                    <div class="item-main-icon">
                                    <i class="icon font_family icon-xuanyan24"></i>
                                    </div>
                                    <div class="item-main-perm-name">团队宣言</div>
                                </div>
                                <div class="item-main-content">
                                    <textarea 
                                    type="text"
                                    v-model="teamData.description" 
                                    placeholder="" 
                                    maxlength="200" 
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="team-form-top-item-main" :class="{ focused: targetEr }">
                            <div class="item-main-perm">
                                <div class="item-main-perm-top">
                                    <div class="item-main-icon">
                                    <i class="icon font_family icon-mubiao24"></i>
                                    </div>
                                    <div class="item-main-perm-name">团队目标</div>
                                </div>
                                <div class="item-main-content">
                                    <textarea 
                                    type="text"
                                    v-model="teamData.target" 
                                    placeholder="" 
                                    maxlength="200" 
                                    ></textarea>
                                </div>
                            </div>
                        </div>
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
                        <div class="team-form-submit">
                            <div class="submit-but close_relievoShadow" @click="closeCreateTeam">取消</div>
                            <div class="submit-but relievoShadow" @click="submitDaosSave">立即创建</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 支付 -->
    <PayBg :payData="payData" @close="closePayModal" v-if="payData.isPay" @button-click="pointsDeduction" />
    <!-- 提案 弹窗 -->
    <Proposal
      v-if="isEditorVisible" 
      :isVisible="isEditorVisible"
      :initialContent="content"
      :maxLength="200"
      :daoId="daoId"
      :missionId="missionId"
      type = "1"
      @update:content="updateContent"
      @close="closeEditor"
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
    <!-- -->
    <Convention
        v-if="isConventionVisible"
        @update:content="updateConvention"
        @close="closeConvention"
    />
    <div class="popupModal" v-if="isPayType" @click="isPayType = false">
        <div class="masking"></div>
        <div class="popupModal-center" @click.stop>
            <div class="popupModal-main">
              <div class="popupModal-module"></div>
              <div class="popupModal-main-content">
                <div class="popupModal-main-title">订单明细</div>
                <div class="popupModal-main-compAmt">
                    <div class="compAmt-name">NFT费用</div>
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
                  <div class="popupModal-main-but" @click="findAggregatePayFun">聚合支付</div>
                  <div class="popupModal-main-but" v-if="isPointOpen == 1" @click="findPayWithPointsFun">积分支付</div>
                </div> -->
              </div>
            </div>
            <!-- <div class="close" @click="isPayType = false">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div> -->
        </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
    import { ref, onMounted, nextTick, computed, onBeforeUnmount } from 'vue';
    import router from '@/router';
    import { showPopup } from '@/utils/usePopup';
    import PayBg from '@/components/pay/index.vue';
    import { aeUseStore } from '@/stores/user';
    import { copyToClipboard, extractIdFromUrl, computeHmac, getItem, setItem, isNumeric } from '@/utils/index';
    import persHeader from '@/components/header/persHeader.vue';
    import AvatarUpload  from '@/components/upload/avatarUpload.vue';
    import Statistic from '@/components/statisticModule/statistic.vue';
    import CountdownComponent from '@/components/CountdownComponent/index.vue';
    import Proposal from '@/components/popUp/proposal/index.vue';
    import NodeModal from '@/components/popUp/node/index.vue';
    import Convention from '@/components/policy/convention/index.vue';
    import DisplayArea from '@/components/displayArea/index.vue';
    import ScaleProgressBar from '@/components/progress/scaleProgressBar.vue';
    import { details, applyAdd, applyList, applyChoose, followAdd, followCancel, payQrcode, payQuery, periodAdd, missionsType, cancelTask } from '@/api/task';
    import { upChainPoundages, pointIsOpen, orderSave, orderQuery, chainBalance, orderCancel } from '@/api/pay';
    import { daosSave, proposalsSave, nodePeriodList, nodeDataAdd } from '@/api/dao';
    import taskpayAmountBg from '@/assets/images/common/taskpayAmountBg.png';
    import { getDominantColorRGBA } from '@/utils/getDominantColor';

    const userStore = aeUseStore();
    const userInfo = userStore.getUserInfo;
    const route = router.currentRoute.value;
    const taskId = ref(route.params.id);
    const isbutClick = ref(false); // 是否点击立即参与
    const isShow = ref(true); // 是否显示按钮
    const isNotPass = ref(false); // 是否未通过
    const isUnderReview = ref(false); // 是否审核中 
    const isStartTask = ref(false); // 是否开启任务  
    const isApplyList = ref(false); // 显示任务申请人列表
    const isApplyListVerify = ref(false); // 显示二次确认任务申请人列表
    const applyListData = ref([]); // 任务申请人列表
    const isCreateTeam = ref(false); // 是否显示创建团队 
    const isNodeCycle = ref(false); // 是否显示节点周期设置
    const isNodePassRate = ref(false); // 是否显示节点通过率设置
    const applyId = ref(0);
    const applyName = ref(''); // 选中的任务申请人姓名
    const taskType = ref(0); // 1 创建进去大任务详情 2 大任务手续费待支付进去大任务详情 3 大任务指定责任人质押费待支付进去任务详情
    const daoId = ref('');
    const missionId = ref('');
    const minute = ref(0);
    const createTime = ref('');
    const businessType = ref('');
    const isPayType = ref(false); // 是否显示支付方式
    const isPayTypeShow = ref(false); // 是否显示积分支付
    const isIntegral = ref(false); // 是否选择积分支付

    // 定义一个类型别名，表示 content 可能的类型
    type Content = string | any[]; // any[] 表示数组，其元素可以是任意类型
    // 定义一个接口来描述数组中的对象结构
    interface ProDataItem {
        name: string;
        icon: string;
        tips: string;
        content: Content; // 使用上面定义的类型别名
    }
    const proData = ref<ProDataItem[]>([]); // 任务详情数据

    const taskDetails = ref({
        daos: [],
        applies: [],
        payAmount: 0,
        isFollow: 0,
        id: null as number | null, //	Long	任务id
        userId: '', //	String	发布用户id
        isOnChain: null as number | null, //	Byte	是否链上任务：0否1是
        cover: '', //	String	封面
        followNum: null as number | null, //	Integer	关注人数
        isFollow: null as number | null, //	Byte	是否关注: 0否 1是
        name: '', //	String	任务名称
        coverDescription: '', //	String	任务描述
        competencyRequirement: '', //	String	能力要求
        trustValue: null as number | null, //	Integer	信任值要求
        applyNum: null as number | null, //	Integer	申请人数
        adminUserUuid: '', //	String	责任人
        adminUserAvatar: '', //	String	责任人头像
        daoNum: null as number | null, //	Integer	DAO人数
        status: null as number | null, //	Byte	任务状态：0:未开始、1:执行中、2:已结束、3:已取消
        startTime: '', //	String	任务开始时间
        endTime: '', //	String	任务结束时间
        target: '', //	String	任务目标
        missionIntroductions: [], //	[]	任务介绍
        myApplyAuditStatus: null as number | null, //	Byte	审核状态: 1待审核 2审核通过 3审核失败
        isAlertAuditFailure: null as number | null, //	Byte	是否弹窗审核失败: 1是 0否
        isAlertStartTask: null as number | null, //	Byte	是否弹窗开启任务：1是 0否
        taskMode: null as number | null, //	Byte	0未指定 1个人 2DAO
        createDaoPayStatus: null as number | null, //	Byte	taskMode为2才有创建DAO支付状态：-1：未创建
        hasNodePeriod: null as number | null, //	Byte	是否有节点周期，0否 1是
        payStatus: null as number | null, //	Byte	支付状态： 0:待支付 1:支付中 2:支付成功 3:支付失败 4:已过期 5:已取消 6:部分退款或者全部退款 7:订单已关闭枚举
        qrcode: null as number | null, //	Byte	支付二维码
        daoId: null as number | null,
        poundage: null as number | null, //	Byte	支付发布手续费
        orderNo: '', //	String	订单号
        nodePeriodId: null as number | null,  // 当前可上传节点周期id
        nodePeriodSort: null as number | null, // 节点周期序号
        nodeDataSort: null as number | null, // 节点数据序号
        canlpload: null as number | null,  // status为1时返回:可上传:0否1是
    });

    const teamData = ref({
        cover: '',
        name: '',
        categoryId: '',
        categoryName: '',
        passRate: '',
        votePeriod: '',
        description: '',
        target: '',
        missionId: '',
        isAgreeContract: 0
    });

    /** 取消任务 **/
    const findCancelATask = () => {
        const currentUrl = window.location.href; // 获取当前页面的 URL
        let id = extractIdFromUrl(currentUrl)+'';
        let reqData = {
            id
        }
        return new Promise<void>((resolve, reject) => {
            cancelTask(reqData).then((response: any) => {
                const { code, data, message } = response;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }

                router.push({ name: 'MyTask' });
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    }

    /** 重新发布 **/
    const findReissueTask = () => {
        showPopup('重新发布', 'success', 3000);
    } 
    
    /** 管理员查看 **/ 
    const userButData = ref([
        { value: 1, label: '查看节点', icon: 'icon-suipian24' },
        { value: 2, label: '查看提案', icon: 'icon-tian24' },
        // { value: 3, label: '查看任务', icon: 'icon-jiedian24_1' },
    ]);
    /** 跳转查看对应页面 **/ 
    const routerViewLink = (val: any) => {
        const currentUrl = window.location.href; // 获取当前页面的 URL
        let id = extractIdFromUrl(currentUrl)+'';
        const taskMode = taskDetails.value.taskMode; // 0未指定 1个人 2DAO
        userInfo.daoId = taskDetails.value.daoId;
        userInfo.bigTaskUserId = taskDetails.value.userId;
        userInfo.daoAdminUserId = taskDetails.value.adminUserId;
        userInfo.isMissKanbanType = 1;
        userInfo.missionId = taskDetails.value.id;  //  大任务id
        if(taskMode == 0){
            showPopup('责任人暂未开启任务！', 'error', 3000);
            return;
        } else if (taskMode == 1){
            let id = extractIdFromUrl(currentUrl)+'';
            router.push({ name: 'PersonalTasks', params: { id } });
        } else {
            let id = taskDetails.value.daoId;
            router.push({ name: 'executeDetails', params: { id } });
        }
    }

    /** 跳转dao列表 **/
    const skipRouteDaoList = () => {
        router.push('/Dao');
    };

    /** 跳转到Dao详情 */
    const skipRouteDao = () => {
        const currentUrl = window.location.href; // 获取当前页面的 URL
        const taskMode = taskDetails.value.taskMode; // 0未指定 1个人 2DAO
        userInfo.daoId = taskDetails.value.daoId; 
        userInfo.missionId = taskDetails.value.id; 
        userInfo.isMissKanbanType = 2;
        userInfo.daoAdminUserId = taskDetails.value.userId;
        userInfo.bigTaskUserId = taskDetails.value.userId;
        if(taskMode == 0){
            showPopup('责任人暂未开启任务！', 'error', 3000);
            return;
        } else if (taskMode == 1){
            let id = extractIdFromUrl(currentUrl)+'';
            // userInfo.subTaskType = 1;
            // setItem('subTaskType', 1);
            router.push({ name: 'PersonalTasks', params: { id } });
        } else {
            let id = taskDetails.value.daoId;
            // userInfo.daoType = 1;
            // setItem('daoType', 1);
            // router.push({ name: 'DaoDetails', params: { id } });
            router.push({ name: 'executeDetails', params: { id } });
        }
    }

    const skipRouterDaoDetails = (daoId: any) => {
        userInfo.bigTaskUserId = taskDetails.value.userId;
        userInfo.daoAdminUserId = taskDetails.value.adminUserId;
        userInfo.missionId = taskDetails.value.id;  //  大任务id
        userInfo.isMissKanbanType = 1;
        const currentUrl = window.location.href; // 获取当前页面的 URL
        const taskMode = taskDetails.value.taskMode; // 0未指定 1个人 2DAO
        if(taskMode == 0){
            showPopup('责任人暂未开启任务！', 'error', 3000);
            return;
        } else if (taskMode == 1){
            let id = extractIdFromUrl(currentUrl)+'';
            userInfo.subTaskType = 1;
            setItem('subTaskType', 1);
            router.push({ name: 'PersonalTasks', params: { id } });
        } else {
            let id = taskDetails.value.daoId;
            userInfo.daoType = 1;
            setItem('daoType', 1);
            router.push({ name: 'DaoDetails', params: { id } });
        }
    };

    const skipRouterTeamDetails = () => {
        let id = taskDetails.value.daoId;
        userInfo.daoType = 2;
        setItem('daoType', 2);
        router.push({ name: 'TeamDetails', params: { id } });
    };

    // 选择开启任务方式
    const openMeans = ref([
        { value: 1, label: '个人' },
        { value: 2, label: 'Dao' }
    ]);

    
    const isExpanded = ref(true);
    const displayedText = ref<string>(taskDetails.coverDescription);

    const search = ref('');

    // 获取待支付传参
    const getToBePaid = () => {
        if(userStore.userInfo.minute !== '') {
            minute.value = Number(userStore.userInfo.minute);
        } else {
            minute.value = Number(getItem('minute'));
        }

        if(userStore.userInfo.createTime !== '') {
            createTime.value = userStore.userInfo.createTime;
        } else {
            createTime.value = getItem('createTime');
        }

        if(userStore.userInfo.businessType !== '') {
            businessType.value = userStore.userInfo.businessType;
        } else {
            businessType.value = getItem('businessType');
        }
        findupChainPoundage();
        findPointIsOpenFun();
    };

    /** 获取任务详情 **/
    const getTackDetails = async () => {
        const currentUrl = window.location.href; // 获取当前页面的 URL
        let id = extractIdFromUrl(currentUrl)+'';
        // 用于判断从哪进入的类型，1 任务列表进去大任务详情 2 待支付进去大任务详情
        let types = 0;
        if(userStore.userInfo.taskType !== '') {
            types = userStore.userInfo.taskType;
        } else {
            types = getItem('taskType');
        }
        taskType.value = types;

        if(taskType.value == 2 || taskType.value == 3) {
            getToBePaid();
        }
        let reqData = {
            id: id,
            type: types
        }
        return new Promise<void>((resolve, reject) => {
            details(reqData).then((response: any) => {
                const { code, data, message } = response;
                const resultData = data;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }

                daoId.value = resultData.daoId;
                missionId.value = resultData.id;
                let adminUserId = resultData.adminUserId ?? '';
                let status = resultData.status;
                let myApplyAuditStatus = resultData.myApplyAuditStatus ?? ''; 
                let isAlertAuditFailure = resultData.isAlertAuditFailure ?? ''; 
                let isAlertStartTask = resultData.isAlertStartTask ?? '';
                if (adminUserId !== '') {
                    isbutClick.value = true;
                    // 如果责任人和Dao多有值，将责任人和Dao合并成一个数组
                    // if (resultData.daoNum > 0) {
                    //     resultData.daos.unshift({
                    //         userUuid: resultData.adminUserId,
                    //         avatar: resultData.adminUserAvatar,
                    //     });
                    // }
                } else {
                    if (status !== 0) {
                        isbutClick.value = true;
                    } else {
                        if (myApplyAuditStatus === 1) {
                            isbutClick.value = true;
                        } else if (myApplyAuditStatus === 2) {
                            isShow.value = false;
                        } else if (myApplyAuditStatus === 3) {
                            isbutClick.value = true;
                        } else {
                            isbutClick.value = false;
                        }
                    }
                }

                /** 判断审核失败 1是 0否 **/
                if (isAlertAuditFailure !== ''){
                    if (isAlertAuditFailure == 1) {
                        isNotPass.value = true;
                    } else if (isAlertAuditFailure == 0) {
                        isNotPass.value = false;
                    }
                }

                /** 是否开启任务 1是 0否 ***/
                if (isAlertStartTask !== ''){
                    if (isAlertStartTask == 1) {
                        isStartTask.value = true;
                    } else if (isAlertStartTask == 0) {
                        isStartTask.value = false;
                    }
                }

                taskDetails.value = resultData;
                displayedText.value = resultData.coverDescription.substring(0, 62) + '...';
                proData.value = [];
                type Content = string | any[]; // any[] 表示数组，其元素可以是任意类型
                interface MissionIntroduction {
                    type: Number;
                    content: Content;
                }
                const duction = ref<MissionIntroduction[]>();
                taskDetails.value.missionIntroductions.unshift({
                  type: 1,
                  content: taskDetails.value.coverDescription
                });
                proData.value = [
                    {
                        name: '任务描述',
                        icon: 'icon-gexingmingyan24',
                        tips: taskDetails.value.coverDescription,
                        content: taskDetails.value.missionIntroductions
                    },
                    {
                        name: '任务目标',
                        icon: 'icon-renwumubiao24',
                        tips: taskDetails.value.target,
                        content: taskDetails.value.target
                    },
                    {
                        name: '能力要求',
                        icon: 'icon-gongzuojingyan24',
                        tips: taskDetails.value.competencyRequirement,
                        content: taskDetails.value.competencyRequirement
                    }
                ]
                teamData.value = {
                    cover: '',
                    name: '',
                    categoryId: '',
                    categoryName: '',
                    passRate: '',
                    votePeriod: '',
                    description: '',
                    target: '',
                    missionId: '',
                    isAgreeContract: 0
                };
                teamData.value.categoryId = taskDetails.value.categoryId;
                teamData.value.categoryName = taskDetails.value.categoryName;
                if(userInfo.id == taskDetails.value.adminUserId) {
                    // fingNodePeriodList();
                }
                extractColor(taskDetails.value.cover);
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    };

    /** 倒计时配置 **/
    const countdownConfig = {
        orderTime: taskDetails.value.endTime, // 订单的创建时间
        validityMinutes: 30, // 订单的有效期（单位：分钟）
    };
    /**  倒计时结束回调 **/
    const hiddenTime = ref(false);
    const handleCountdownFinished = () => {
        hiddenTime.value = true;
    };

    /*** v-html转换/n ***/
    const formattedText = (value: string) => {
        let text = value || '';
        if(text !== '') {
            return text.replace(/\n/g, '<br>');
        }
    };

    /** 是否关注:0否 1是 **/
    const findFollowAddFun = (id: any) => {
        nextTick(() => {
            let isFollow = taskDetails.value.isFollow ?? '';
            console.log('isFollow', isFollow);
            let reqData = {
                followUserId: id
            }
            if (isFollow !== 1) {
                return new Promise<void>((resolve, reject) => {
                    followAdd(reqData).then((response: any) => {
                        const { code, message } = response;
                        if (code !== 200) {
                            showPopup(message, 'error', 3000);
                            return;
                        }
                        getTackDetails();
                        resolve()
                    }).catch((error: any) => {
                        reject(error)
                    })
                })
            } else {
                return new Promise<void>((resolve, reject) => {
                    followCancel(reqData).then((response: any) => {
                        const { code, message } = response;
                        
                        if (code !== 200) {
                            showPopup(message, 'error', 3000);
                            return;
                        }
                        getTackDetails();
                        resolve()
                    }).catch((error: any) => {
                        reject(error)
                    })
                })
            }
            
        })
    };

    /**  点击立即参与 ***/
    const submitApplyFor = () => {
        const currentUrl = window.location.href; // 获取当前页面的 URL
        let id = extractIdFromUrl(currentUrl)+'';
        let reqData = {
            id
        }
        return new Promise<void>((resolve, reject) => {
            applyAdd(reqData).then((response: any) => {
                const { code, message } = response;
                
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                getTackDetails();
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

    /** 创建团队 **/
    const isAgree = ref(true);
    
    /** 选择开启任务方式 1个人 2Dao ***/
    const findOpenMeansClick = (type: number) => {
        console.log('type', type);
        const currentUrl = window.location.href; // 获取当前页面的 URL
        let id = extractIdFromUrl(currentUrl)+'';
        let reqData = {
            missionId: id,
            missionType: type
        }
        return new Promise<void>((resolve, reject) => {
            missionsType(reqData).then((response: any) => {
                const { code, message } = response;
                
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                getTackDetails();
                userInfo.categoryId = taskDetails.value.categoryId;
                userInfo.categoryName = taskDetails.value.categoryName;
                userInfo.missionId = taskDetails.value.id; //  大任务id
                isStartTask.value = false;
                if(type === 1) {
                    let id = extractIdFromUrl(currentUrl)+'';
                    userInfo.subTaskType = 1;
                    setItem('subTaskType', 1);
                    router.push({ name: 'PersonalTasks', params: { id } });
                }
                if(type === 2) {
                    userInfo.missionId = taskDetails.value.id;
                    router.push({ name: 'CreateATeam' });
                }
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    };

    /** 选择任务负责人数据 ***/
    const selectResponsiblePerson = () => {
        const currentUrl = window.location.href; // 获取当前页面的 URL
        let id = extractIdFromUrl(currentUrl)+'';
        let reqData = {
            missionId: id,
            value: ''
        }
        getApplyaList(reqData);
    };

    /** 获取用户申请列表数据 ***/
    const getApplyaList = (reqData: any) => {
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
        const currentUrl = window.location.href; // 获取当前页面的 URL
        let id = extractIdFromUrl(currentUrl)+'';
        let reqData = {
            missionId: id,
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
    const findsbumitApplyClick = () => {
        isApplyList.value = false;
        isApplyListVerify.value = true;
    };

    /** 二次确认选择责任人提交 **/
    const findsbumitApplySubmit = (index: number) => {
        const currentUrl = window.location.href; // 获取当前页面的 URL
        let id = extractIdFromUrl(currentUrl)+'';
        let assignUserId = null;
        if (index === 1) {
            assignUserId = applyId.value;
        } else {
            assignUserId = taskDetails.value.adminUserId;
        }
        let reqData = {
            missionId: id,
            assignUserId: assignUserId
        }
        openPayModal(1, 4, reqData);
    }

    // 显示创建团队
    const isUnll = ref(true); // 提交按钮是否禁用
    const showisCreateTeam = () => {
        isCreateTeam.value = true;
        isUnll.value = true;
        teamData.value.categoryId = taskDetails.value.categoryId;
        teamData.value.categoryName = taskDetails.value.categoryName;
    }

    const checkboxHandler = () => {
        if (isAgree.value) {
            isAgree.value = false;
            teamData.value.isAgreeContract = 1;
        } else {
            isAgree.value = true;
            teamData.value.isAgreeContract = 0;
        }
    }


    const findGetImageUrlFun = (urls: string[]) => {
        console.log('上传的团队封面文件', urls);
        teamData.value.cover = urls[0];
    };

    // 创建dao团队
    const coverEr = ref(false);
    const nameEr = ref(false);
    const passRateEr = ref(false);
    const votePeriodEr = ref(false);
    const descriptionEr = ref(false);
    const targetEr = ref(false);
    const proPassRate = ref<number | null>(null); // 投票通过率
    const proVotePeriod = ref<number | null>(null); // 投票周期
    // 投票通过率只能输入数字
    const validatePassRate = (event: any) => {
        proPassRate.value = isNumeric(event.target.value);
        if(proPassRate.value !== null) {
            if( proPassRate.value < 1 ) {
                proPassRate.value = null;
            } else if(proPassRate.value > 100) {
                proPassRate.value = null;
                showPopup('投票通过率不能大于100', 'error', 3000);
            }
        }
    }

    // 投票周期只能输入数字
    const validateVotePeriod = (event: any) => {
        proVotePeriod.value = isNumeric(event.target.value);
        if(proVotePeriod.value !== null) {
            if( proVotePeriod.value < 1 ) {
                proVotePeriod.value = null;
                showPopup('投票周期不能小于1', 'error', 3000);
            }
        }
    }
       
    // 关闭
    const closeCreateTeam = () => {
        isCreateTeam.value = false;
        coverEr.value = false;
        nameEr.value = false;
        passRateEr.value = false;
        votePeriodEr.value = false;
        descriptionEr.value = false;
        targetEr.value = false;
    };
    // 提交
    let newDaoId = ref(0);
    const submitDaosSave = async () => {
        const currentUrl = window.location.href; // 获取当前页面的 URL
        let id = extractIdFromUrl(currentUrl)+'';
        teamData.value.passRate = proPassRate.value +'';
        teamData.value.votePeriod = proVotePeriod.value +'';
        let reqData = teamData.value; 
        reqData.missionId = id;
        reqData.taskPeriod = 3;
        reqData.votePeriod = Number(reqData.votePeriod);
        isUnll.value = true;
        // return new Promise<void>((resolve, reject) => {
        //     daosSave(reqData).then((response: any) => {
        //         const { code, message } = response;
        //         
        //         if (code !== 200) {
        //             console.log(message);
        //             return;
        //         }
        //         newDaoId.value = response.data;
        //         isCreateTeam.value = false;
        //         findNext();
        //         resolve()
        //     }).catch((error: any) => {
        //         reject(error)
        //     })
        // })
        await findChainBalanceFun();
        await submitContents(reqData);
    };

    const getData = () => {
        const currentUrl = window.location.href; // 获取当前页面的 URL
        let id = extractIdFromUrl(currentUrl)+'';
        let reqData = teamData.value; 
        reqData.missionId = id;
        reqData.taskPeriod = 3;
        reqData.votePeriod = Number(reqData.votePeriod);
        return reqData;
    };

    const sbumitData = ref({});
    const submitContents = (reqData: any) => {
        let resData = getData();
        
        // 检查对象中的每个键值对
        for (const key in resData) {
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
            findNext(reqData);
        }
    };

    // 查看组织公约
    const isConventionVisible = ref(false);

    // 打开组织公约
    const findisPrivacyFun = () => {
        isConventionVisible.value = true;
    };

    // 同意组织公约
    const updateConvention = () => {
        isAgree.value = false;
        teamData.value.isAgreeContract = 1;
        isConventionVisible.value = false;
    }

    // 关闭组织公约
    const closeConvention = () => {
        isAgree.value = true;
        teamData.value.isAgreeContract = 0;
        isConventionVisible.value = false;
    };

    // 聚合支付
    const findAggregatePayFun = () => {
        isPayType.value = false;
        payData.value.type = 1;
        openPayModal(3, 6, sbumitData.value);
    }

    // 积分支付
    const findPayWithPointsFun = async () => {
        await findupChainPoundage();
        isPayType.value = false;
        payData.value.type = 2;
        payData.value.payAmount = Number(expense.value) + Number(createNftFee.value);
        payData.value.isPay = true;
    }
    // 积分支付-立即支付
    const pointsDeduction = () => {
        payData.value.payAmount = Number(expense.value) + Number(createNftFee.value);
        payData.value.poundage = 0;
        payData.value.mps = 0;
        openPayModal(3, 5, sbumitData.value);
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
    
    const findNext = async (reqData: any) => {
        await findupChainPoundage();
        await findPointIsOpenFun();
        if(isPointOpen.value == 1) {
            if(Number(integralBalance.value) > Number(expense.value)) {
                isPointOpen.value = 1;
                sbumitData.value = reqData;
                isPayType.value = true;
            } else {
                isPointOpen.value = 0;
                openPayModal(3, 6, reqData);
            }
        } else {
            isPointOpen.value = 0;
            openPayModal(3, 6, reqData);
        }
    };


    /** 节点周期设置 **/
    const isNode = ref(0); // 节点周期
    const cycle = ref<number | null>(null); // 周期时间
    const nodePassRate = ref<number | null>(null); // 节点通过率
    const isNodeShow = ref(false); // 是否显示节点周期设置
    const nodeData = ref([
        { id: 1, value: 7, label: '一周' },
        { id: 2, value: 14, label: '半个月' },
        { id: 3, value: 30, label: '一个月' },
        { id: 4, value: 90, label: '三个月' },
        { id: 5, value: null, label: '自定义周期' },
    ]); 
    const findNodeClick = (item: any) => {
        console.log('item', item);
        isNode.value = item.id;
        cycle.value = item.value;
    };
    // 周期时间只能输入数字
    const validateCycle = (event: any) => {
        cycle.value = isNumeric(event.target.value);
        if(cycle.value !== null) {
            if( cycle.value < 1 ) {
                cycle.value = null;
            } else if(cycle.value > taskDetails.value.day) {
                showPopup('周期时间不能小于任务周期时间', 'error', 3000);
            }
        }
    };
    // 节点通过率只能输入数字
    const validateNodePassRate = (event: any) => {
        nodePassRate.value = isNumeric(event.target.value);
        if(nodePassRate.value !== null) {
            if( nodePassRate.value < 1 ) {
                nodePassRate.value = null;
            } else if(nodePassRate.value > 100) {
                nodePassRate.value = null;
                showPopup('节点通过率不能大于100', 'error', 3000);
            }
        }
    }

    // const handlenodePassRateInput = (event: any) => {
    //     const value = event.target.value;
    //     if (isNumeric(value)) {
    //     const numberValue = Number(value);
    //     if (numberValue >= 1 && numberValue <= 100) {
    //         nodePassRate.value = numberValue;
    //     } else {
    //         nodePassRate.value = null;
    //     }
    //     } else {
    //         nodePassRate.value = null;
    //     }
    // };

    /** 提交节点周期 **/
    const findSubmitNodeClick = () => {
        const currentUrl = window.location.href; // 获取当前页面的 URL
        let id = extractIdFromUrl(currentUrl)+'';
        const day = taskDetails.value.day;
        if (day < cycle.value) {
            showPopup('周期时间不能小于任务周期时间', 'error', 3000);
            return;
        }
        let reqData = {
            missionId: id,
            period: cycle.value,
            nodePassRate: nodePassRate.value
        }
        return new Promise<void>((resolve, reject) => {
            periodAdd(reqData).then((response: any) => {
                const { code, message } = response;
                
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                payData.value.payUrl = response.data;
                isNodeCycle.value = false;
                isNodePassRate.value = false;
                getTackDetails();
                openPayModal(1, 4, null)
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    };

    // 当未支付订单从列表进入，非待支付列表进入时
    const findsbumitPaySubmit = () => {
        payData.value.payAmount = Number(taskDetails.value.payAmount);
        payData.value.createTime = taskDetails.value.orderCreateTime;
        payData.value.minute = taskDetails.value.minute;
        payData.value.payUrl = taskDetails.value.qrcode;
        orderNo.value = taskDetails.value.orderNo;
        payData.value.isPay = true;
        findOrderResult();
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
        router.replace({ path: router.currentRoute.value.path });
        router.go(0);
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
    // type: 1 指定责任人质押费，2 待支付创建任务费,3 dao创建费
    const openPayModal = (type: number, payType: number, daoData: any) => {
        let taskId = taskDetails.value.id; 
        
        let userId = '';
        if(userStore.userInfo.id !== '') {
            userId = userStore.userInfo.id;
        } else {
            userId = getItem('id');
        }

        let content = '';
        let reqData = {};
        let timestamp = Date.now();

        /**
         * 1、判断type是什么类型支付，1：指定责任人质押费，businessType为4；2：创建任务费，businessType为2;；3：创建DAO费，businessType为6
         * 2、如果支付时选择为积分支付，则直接进行支付，不需要创建订单，积分支付只能用于创建任务，不能用于指定责任人质押费
         * 3、业务类型：发布任务上链费用积分支付1 发布任务上链费用：2 发布任务赏金：4 创建DAO积分支付：5 创建DAO：6 发布子任务上链费用积分支付：7 
         *    发布子任务上链费用：8 发布子任务赏金：10
         * **/
         if(type == 1) {
            content = payType+''+taskDetails.value.payAmount+'0'+timestamp;
            console.log('userId', userId);
            console.log('content', content)
            console.log('Date.now()', timestamp)
            reqData = {
                // businessId: taskId,
                businessData: daoData,
                businessType: payType,
                amount: taskDetails.value.payAmount,
                poundage: 0,
                timeStamp: timestamp,
                sign: computeHmac(content.toString(), userId.toString())
            };
        } else if(type == 2) {
            content = payType+'0'+expense.value+timestamp;
            reqData = {
                // businessId: taskId,
                businessType: payType,
                businessData: {missionId: taskId},
                amount: 0,
                poundage: expense.value,
                timeStamp: timestamp,
                sign: computeHmac(content.toString(), userId.toString())
            };
        } else if(type == 3) {
            content = payType+''+createNftFee.value+expense.value+timestamp;
            reqData = {
                // businessId: newDaoId.value,
                businessData: daoData,
                businessType: payType,
                amount: createNftFee.value,
                poundage: expense.value,
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
                payData.value.minute = resultData.minute;
                payData.value.createTime = resultData.createTime;
                if(payType == 5) {
                    let id = data.daoId;
                    userInfo.daoType = 1;
                    setItem('daoType', 1);
                    router.push({ name: 'DaoDetails', params: { id } });
                } else {
                    
                    if(daoData == null) {
                        payData.value.payAmount = taskDetails.value.payAmount;
                    } else if(payType == 4) {
                        payData.value.payAmount = taskDetails.value.payAmount;
                        isApplyListVerify.value = false
                    } else if(payType == 5 || payType == 6) {
                        payData.value.payAmount = Number(expense.value) + Number(createNftFee.value);
                    } else {
                        payData.value.payAmount = expense.value;
                    }
                    
                    orderNo.value = resultData.orderNo;
                    payData.value.payUrl = resultData.qrcode;
                    
                    payData.value.isPay = true;
                    
                    findOrderResult();
                }
                if(type == 3) {
                    closeCreateTeam();
                }
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
        
    }

    // 支付
    const findToBePaidTask = () => {
        payData.value.payUrl = taskDetails.value.qrcode;
        orderNo.value = taskDetails.value.orderNo;
        if(businessType.value == '2') {
            payData.value.payAmount = taskDetails.value.payAmount;
        } else if(businessType.value == '4') {
            payData.value.payAmount = taskDetails.value.payAmount;
        }
        payData.value.minute = taskDetails.value.minute;
        payData.value.createTime = taskDetails.value.createTime;
        payData.value.isPay = true;
        findOrderResult();
    }

    // 取消订单
    const findCancelAnOrder = (orderNo: string) => {
        let repData = { orderNo: orderNo };
        return new Promise<void>((resolve, reject) => {
            orderCancel(repData).then((response: any) => {
                const { code, data, message } = response;
                
                const resultData = data;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                router.push({ name: 'PersonalHomepage' });
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
                    payData.value.isPay = false;
                    clearTimeout(timer);
                    isActive.value = false;
                    getTackDetails();
                    if(taskType.value == 2 || taskType.value == 3) {
                        if(businessType.value == '2' || businessType.value == '4') {
                            userInfo.taskType = 1;
                            setItem('taskType', 1);
                            let id = data.businessId;
                            router.push({ name: 'TataskDetails', params: { id } });
                        }
                    }
                } else if (data.orderStatus == 4) {
                    showPopup(message, 'error', 3000);
                    payData.value.isPay = false;
                    clearTimeout(timer);
                    isApplyList.value = false;
                    isActive.value = false;
                } else if (data.orderStatus == 7) {
                    showPopup('订单已关闭', 'error', 3000);
                    payData.value.isPay = false;
                    clearTimeout(timer);
                    isActive.value = false;
                } else {
                    timer = setTimeout(retry, 10000); // 继续重试
                }
                isApplyList.value = false;
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

    /** 责任人提交 **/ 
    const adminButData = ref([
        { value: 1, label: '上传节点', icon: 'icon-suipian24' },
        { value: 2, label: '发起提案', icon: 'icon-tian24' },
        { value: 3, label: '提交任务', icon: 'icon-shangchuanwenjian24' },
    ]);

    // 管理员操作上传模块
    const showViewLink = (val: number) => {
        if(val == 1) {
            isEditorVisible.value = !isEditorVisible.value;
        } else if(val == 2) {
            userInfo.uploadableBusinessIds = taskDetails.value.nodePeriodId;
            userInfo.nodePeriodSort = taskDetails.value.nodePeriodSort;
            userInfo.nodeDataSort = taskDetails.value.nodeDataSort;
            userInfo.canlpload = taskDetails.value.canlpload;
            isNodeModalVisible.value = !isNodeModalVisible.value;
        } else if(val == 3) {
            showPopup('提交成功', 'success', 3000);
            getTackDetails();
        }
    }

    // 节点操作模块
    const isNodeModalVisible = ref(false); // 是否显示节点操作弹窗
    const isNodeShows = ref(false); // 是否显示节点列表
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
                hasHighlighted = false;
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

            // fingNodePeriodList();
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

    // 关闭编辑器
    const closeEditor = () => {
        isEditorVisible.value = false;
    };

    // 发起提案
    const updateContent = (newContent: any) => {
        // content.value = newContent.content;
        console.log('content.value', newContent.value);
        newContent.missionId = taskDetails.value.id;
        newContent.daoId = taskDetails.value.daoId;
        return new Promise<void>((resolve, reject) => {
        proposalsSave(newContent).then((response: any) => {
            const { code, message } = response;
            if (code !== 200) {
                showPopup(message, 'error', 3000);
                return;
            }

            isEditorVisible.value = false;
            resolve()
        }).catch((error: any) => {
            reject(error)
        })
        })
    };

    // 查看用户个人中心
    const findViewPersonalInfo = (userId: any) => {
        userInfo.othersId = userId;
        router.push('/PersonalHomepage');
        // window.open(`${window.location.origin}/personalHomepage`, '_blank');
    };

    const dominantColor = ref<string | null>(null);
    // 定义一个 ref 来引用 DOM 元素
    const taskDetailsRef = ref<HTMLElement | null>(null);


    // 定义一个方法来改变背景色
    const changeBackgroundColor = (newColor: string) => {
        if (taskDetailsRef.value) {
            taskDetailsRef.value.style.setProperty('--common-bg-color', newColor);
        }
    };
    // 获取图片主色调并改变背景色
    const extractColor = async (url: string) => {
      try {
        dominantColor.value = await getDominantColorRGBA(url, 1);
        changeBackgroundColor(dominantColor.value);
        console.log('Dominant Color:', dominantColor.value);
      } catch (error) {
        console.error('Error extracting dominant color:', error);
      }
    };

    onMounted(() => {
        getTackDetails();
    })
</script>

<style lang='scss' scoped>
    @use '@/assets/styles/common.scss';
    @use '@/assets/styles/popupModal.scss';
    @use '@/assets/styles/taskDetails.scss';
    :root {
        --common-bg-color: rgba(0, 0, 0, .05);
    }
</style>
