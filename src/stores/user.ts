   // src/stores/user.ts
import { defineStore } from 'pinia';
import { reactive } from 'vue';

   export const aeUseStore = defineStore('UseStore', {
     state: () => reactive({
        userInfo: {
          userName: '',
          post: [],
          age: '',
          sex: '',
          avatar: '',
          token: '',
          refreshToken: '',
          id: '',
          uuid: '',
          email: '',
          phone: '',
          address: '',
          isUserInfo: false, // 是否有用户信息
          othersId: '', // 查看他人的用户的id
          isFollow: 0, // 是否关注 0 未关注 1 已关注
          trustValue: 0, // 用户的信任值
          isMsgShow: false, // 消息列表显示隐藏
          isAuth: 0, // 0 未认证 1 已认证
          isToBePaid: false, // 是否显示待支付弹框
          createTime: '', //待支付页面订单的创建时间
          minute: '', // 待支付页面订单的剩余分钟数
          businessType: '', // 待支付页面订单的业务类型
          taskType: 1, // 1 创建进去大任务详情 2 大任务手续费待支付进去大任务详情 3 大任务指定责任人质押费待支付进去任务详情
          daoId: null as number | null,
          daoType: 1, // 1 Dao子列表页面进入Dao详情 2 待支付进去Dao详情
          subTaskType: 1, // 1 正常流程进入子任务详情 2 待支付进去子任务详情
          proposalType: 0, // 1 Dao底下的提案 2 子任务的提案 3 大任务下的提案
          nodeType: 0, // 1 大任务 2子任务 判断从哪进去的节点列表
          nodeId: '', // 节点id 点击上传节点的id
          uploadableBusinessIds: '', // 待上传节点的id
          nodePeriodId: null as number | null,  // 当前可上传节点周期id
          nodePeriodSort: null as number | null, // 节点周期序号
          nodeDataSort: null as number | null, // 节点数据序号
          canlpload: null as number | null,  // status为1时返回:可上传:0否1是
          nodeIdList: [], // 节点列表id数据
          routerNodeId: '', // 用于判断谁进入的节点列表
          knowledgeBaseData: {}, // 知识库详情数据
          nodeData: {}, // 节点详情数据
          noteData: {}, // 笔记详情数据
          missionId: '', // 大任务id
          businessId: '', // 节点列表点击进去详情时对应节点的大任务id或者子任务id
          missionCreateUserId: '', // 大任务创建者id个人执行任务时进行判断，只能大任务创建者才能操作
          missionMode: '', // 大任务执行类型 ：1个人 2DAO   
          personaHome: 0, // 刷新个人中心侧边栏和待支付列表接口
          isDaoMember: null as number | null, // 判断是否是dao成员
          openPostAtaskType: 1, // 1: 创建类型进去 2：草稿列表进去
          taskDraftId: '', // 大任务草稿id
          operateType: 0, // websocket 监听操作类型 1登陆 2心跳 3强制下线 4私聊消息 5群发消息 11消息通知
          operateData: {}, // websocket 监听操作数据
          notifications: false, // 是否有消息通知
          categoryId: '', // 所属行业id
          categoryName: '', // 所属行业名称
          subTaskDraftId: '', // 子任务草稿id
          openCreateSubTaskType: 1, // 1: 创建类型进去 2：草稿列表进去

          isMissKanbanType: 1, // 1：大任务发布者通过查看节点、查看提案进去看板；2：大任务发布者从进入任务进去看板
          bigTaskUserId: '', // 大任务发布者id
          daoAdminUserId: '', // Dao管理id
          subtaskAdminUserId: '', // 子任务管理id
          taskId: '', // 子任务列表进入的子任务id
          proposalId: '', // 提案列表选中的id
          proposalIdList: [], // 提案列表id数据
          knowledgeId: '', // 知识库id
          knowledgeIdList: [], // 知识库列表id数据

          worksType: 1, // 1: 普通作品 2：商业作品
          refreshComment: 0, // 刷新评论
          companyInfo: {
            icp: '© 2024 - 2037 深圳市爱智可视科技有限公司'
          }
        } as any, // 这里存放您的缓存数据
        mapInfo: {
          key: 'c9a2bef0deaf3184c029154479752f1d',
          code: '23b3fa470d107119f5022ddfc0bda0dc'
        }
     }),
     getters: {
       getUserInfo: (state) => state.userInfo,
       getMapKey: (state) => state.mapInfo,
     },
     actions: {
       setUserInfo(info: any) {
         this.userInfo = info;
       },
       setMapKey(info: any) {
         this.mapInfo = info;
       },
       showModal() {
          this.userInfo.isMsgShow = true;
        },
        hideModal() {
          this.userInfo.isMsgShow = false;
        },
        clearUserInfo() {
          this.userInfo = {};
          // 清除持久化存储中的数据
          sessionStorage.removeItem('userInfo'); // 假设 store 的 key 为 'workUpload'
        },
     },
     persist: {
        key: 'UseStore',
        storage: sessionStorage, // 你可以选择 localStorage 或 sessionStorage
      },
   });