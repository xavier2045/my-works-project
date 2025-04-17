// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import WebSocketService from '@/services/publicWebSocket';
// 初始化 WebSocketService 单例
const wsService = WebSocketService.getInstance();
import { aeUseStore } from '@/stores/user';

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/index/index.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/invite',
    name: 'Invite',
    component: () => import('../views/invite/index.vue'),
    meta: { title: '邀请页' },
  },
  {
    path: '/taskList',
    name: 'TaskList',
    component: () => import('../views/tasksList/taskList.vue'),
    meta: { title: '任务广场' },
  },
  {
    path: '/worksList',
    name: 'WorksList',
    component: () => import('../views/worksList/index.vue'),
    meta: { title: '作品广场' },
  },
  {
    path: '/daoOrg',
    name: 'DaoOrg',
    component: () => import('../views/daoOrg/index.vue'),
    meta: { title: 'Dao组织' },
  },
  {
    path: '/dao',
    name: 'Dao',
    component: () => import('../views/dao/mainPage.vue'),
    meta: { title: 'Dao广场' },
    redirect: '/dao/pageTwo', 
    children: [
      {
        path: 'pageOne',
        name: 'PageOne',
        component: () => import('../views/dao/pageOne.vue'),
        meta: { title: '第一屏' },
      },
      {
        path: 'pageTwo',
        name: 'PageTwo',
        component: () => import('../views/dao/pageTwo.vue'),
        meta: { title: '第二屏' },
        alias: '/dao'
      },
      {
        path: 'pageThree',
        name: 'PageThree',
        component: () => import('../views/dao/pageThree.vue'),
        meta: { title: '第三屏' },
      },
      {
        path: 'pageFour',
        name: 'PageFour',
        component: () => import('../views/dao/pageFour.vue'),
        meta: { title: '第四屏' },
      },
    
    ]
  },
  {
    path: '/personalHomepage',
    name: 'PersonalHomepage',
    component: () => import('../views/PersonalHomepage/index.vue'),
    meta: { title: '个人中心' },
    redirect: '/personalHomepage/personalCenter', 
    children: [
      {
        path: 'personalCenter',
        name: 'PersonalCenter',
        component: () => import('../views/PersonalHomepage/personalCenter/index.vue'),
        meta: { title: '个人主页' },
      },
      {
        path: 'buz-main/:page*',
        name: 'BuzMain',
        component: () => import('../views/PersonalHomepage/subapp.vue'),
        meta: { 
          title: 'Buz Main',
          keepAlive: true // 添加keepAlive以保持子应用状态
        },
      },
      {
        path: 'digitalIdentity',
        name: 'DigitalIdentity',
        component: () => import('../views/PersonalHomepage/digitalIdentity.vue'),
        meta: { title: '数字身份' },
      },
      {
        path: 'topPicks',
        name: 'TopPicks',
        component: () => import('../views/PersonalHomepage/digitalIdentity.vue'),
        meta: { title: '精选推荐' },
      },
      {
        path: 'selectPublishType',
        name: 'SelectPublishType',
        component: () => import('../views/PersonalHomepage/selectPublishType.vue'),
        meta: { title: '选择发布类型' },
      },
      {
        path: 'postATask',
        name: 'PostATask',
        component: () => import('../views/tasks/postATask.vue'),
        meta: { title: '发布任务' },
      },
      {
        path: 'myTask',
        name: 'MyTask',
        component: () => import('../views/tasks/myTask.vue'),
        meta: { title: '我的任务' },
      },
      {
        path: 'taskDraft',
        name: 'TaskDraft',
        component: () => import('../views/tasks/taskDraft.vue'),
        meta: { title: '任务草稿' },
      },
      {
        path: 'task/:id',
        name: 'TataskDetails',
        component: () => import('../views/tasks/taskDetails.vue'),
        meta: { title: '任务详情' },
      },
      {
        path: 'createATeam',
        name: 'CreateATeam',
        component: () => import('../views/daoOrg/createATeam.vue'),
        meta: { title: '创建团队' },
      },
      {
        path: 'createSubtask',
        name: 'CreateSubtask',
        component: () => import('../views/daoOrg/createSubtask.vue'),
        meta: { title: '创建子任务' },
      },
      {
        path: 'subTaskDraft/:id',
        name: 'SubTaskDraft',
        component: () => import('../views/daoOrg/subTaskDraft.vue'),
        meta: { title: '子任务草稿' },
      },
      {
        path: 'subTask/:id',
        name: 'subTaskDetails',
        component: () => import('../views/tasks/subTaskDetails.vue'),
        meta: { title: '子任务详情' },
      },
      {
        path: 'executeDetails/:id',
        name: 'executeDetails',
        component: () => import('../views/tasks/kanban/executeDetails1.vue'),
        meta: { title: '任务看板-Dao' },
      },
      {
        path: 'personalTasks/:id',
        name: 'PersonalTasks',
        component: () => import('../views/tasks/kanban/personalTasks.vue'),
        meta: { title: '任务看板-个人' },
      },
      {
        path: 'daoDetails/:id',
        name: 'DaoDetails',
        component: () => import('../views/daoOrg/daoDetails.vue'),
        meta: { title: 'Dao详情' },
      },
      {
        path: 'teamDetails/:id',
        name: 'TeamDetails',
        component: () => import('../views/daoOrg/teamDetails.vue'),
        meta: { title: '团队详情' },
      },
      {
        path: 'proposal/:id',
        name: 'Proposal',
        component: () => import('../views/tasks/proposal.vue'),
        meta: { title: '提案列表' },
      },
      {
        path: 'knowledgeBase/:id',
        name: 'KnowledgeBase',
        component: () => import('../views/tasks/kb/knowledgeBase.vue'),
        meta: { title: '知识库' },
      },
      {
        path: 'kbDetails/:id',
        name: 'KbDetails',
        component: () => import('../views/tasks/kb/kbDetails.vue'),
        meta: { title: '知识库详情' },
      },
      {
        path: 'nodeList/:id',
        name: 'NodeList',
        component: () => import('../views/tasks/node/nodeList.vue'),
        meta: { title: '节点列表' },
      },
      {
        path: 'nodeDetails/:id',
        name: 'NodeDetails',
        component: () => import('../views/tasks/node/nodeDetails.vue'),
        meta: { title: '节点详情' },
      },
      {
        path: 'noteList',
        name: 'NoteList',
        component: () => import('../views/tasks/note/list.vue'),
        meta: { title: '个人笔记' },
      },
      {
        path: 'noteDetails',
        name: 'NoteDetails',
        component: () => import('../views/tasks/note/details.vue'),
        meta: { title: '笔记详情' },
      },
      {
        path: 'selfOrganization',
        name: 'SelfOrganization',
        component: () => import('../views/PersonalHomepage/selfOrganization/index.vue'),
        meta: { title: '我的自组织' },
      },
      {
        path: 'releaseActivities',
        name: 'ReleaseActivities',
        component: () => import('../views/activity/releaseActivities.vue'),
        meta: { title: '发布活动' },
      },
      {
        path: 'activitiesToJoin',
        name: 'ActivitiesToJoin',
        component: () => import('../views/activity/activitiesToJoin.vue'),
        meta: { title: '我的活动' },
      },
      {
        path: 'normal',
        name: 'Normal',
        component: () => import('../views/works/normal.vue'),
        meta: { title: '发布普通作品' },
      },
      {
        path: 'commercialUse',
        name: 'CommercialUse',
        component: () => import('../views/works/commercialUse.vue'),
        meta: { title: '发布商业作品' },
      },
      {
        path: 'personalWorks',
        name: 'PersonalWorks',
        component: () => import('../views/PersonalHomepage/personalWorks.vue'),
        meta: { title: '我的作品' },
      },
      {
        path: 'worksDraft',
        name: 'WorksDraft',
        component: () => import('../views/worksList/worksDraft.vue'),
        meta: { title: '作品草稿' },
      },
      {
        path: 'communityInt',
        name: 'CommunityInt',
        component: () => import('../views/PersonalHomepage/communityInt.vue'),
        meta: { title: '社区互动' },
      },
      {
        path: 'publishWorks',
        name: 'PublishWorks',
        component: () => import('../views/PersonalHomepage/publishWorks.vue'),
        meta: { title: '查看经纬度' },
      },
      {
        path: 'myWallet',
        name: 'MyWallet',
        component: () => import('../views/PersonalHomepage/wallet/myWallet.vue'),
        meta: { title: '我的钱包' },
      },
      {
        path: 'billingDetail',
        name: 'BillingDetail',
        component: () => import('../views/PersonalHomepage/wallet/billingDetail.vue'),
        meta: { title: '账单明细' },
      },
      {
        path: 'myReport',
        name: 'MyReport',
        component: () => import('../views/PersonalHomepage/myReport.vue'),
        meta: { title: '我的报告' },
      },
    ]
  },
  {
    path: '/works',
    name: 'WorksDetails',
    component: () => import('../views/works/worksDetails.vue'),
    meta: { title: '作品详情' },
  },
  {
    path: '/webSocket',
    name: 'webSocket',
    component: () => import('../components/webSocket/index.vue'),
    meta: { title: '即时通讯' },
  },
]
// history: createWebHistory(process.env.BASE_URL), 
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = false; // 替换为实际的认证检查逻辑
  console.log('Global beforeEach:', to, from);

  // 获取 localStorage 中的判断条件 判断是否缓存了邀请码，如果存在，则跳转到首页，否则跳转到邀请页
  const isInvited = localStorage.getItem('isInvited');
  console.log('isInvited:', isInvited); // 输出 isInvited 的值，便于调试

  // 如果访问的是根路径 '/'，根据条件进行跳转
  // if (to.path === '/') {
  //   if (isInvited !== null && isInvited !== undefined) {
  //     // 如果已经满足条件，且目标已经是 Index，则直接继续
  //     if (to.name === 'Index') {
  //       next(); // 避免重复重定向
  //     } else {
  //       next({ name: 'Index' }); // 跳转到首页
  //     }
  //   } else {
  //     // 如果目标已经是 Invite，则直接继续
  //     if (to.name === 'Invite') {
  //       next(); // 避免重复重定向
  //     } else {
  //       next({ name: 'Invite' }); // 跳转到邀请页
  //     }
  //   }
  //   return; // 确保在跳转后不再执行后续代码
  // }

  // 其他路由的 WebSocket 连接逻辑
  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;
  if (wsService.isDisconnected) {
      console.log('WebSocket is disconnected, attempting to reconnect...');
      wsService.connect(
          import.meta.env.VITE_WS_URL, // WebSocket 地址
          300000,                     // 无操作超时时间，5 分钟
          userInfo.uuid,           // 用户 ID
          userInfo.token         // 登录 Token
      );
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
      next({ name: 'Index' });
  } else {
      next();
  }
});

// 全局错误拦截
router.onError((error) => {
  console.error('路由导航错误:', error);
  return false; // 阻止默认错误处理
});


export default router
