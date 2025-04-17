<template>
    <div class="messageModal " v-if="isVisible">
        <div class="messageModal-content overflowYAuto">
            <div class="masking"></div>
            <div class="messageModal-content-box">
                <div class="box-header">
                    <div class="box-header-title">我的消息</div>
                    <div class="box-header-type" @click="isShow = !isShow">
                        <div class="box-header-type-main">
                            <div class="type-name">{{ typeName }}</div>
                            <div class="type-but">
                                <i 
                                class="icon font_family"
                                :class="isShow ? 'icon-a-jiantouxiangshangshousuo24' : 'icon-a-jiantouxiangxiazhankai24'"
                                ></i>
                            </div>
                        </div>
                        <div class="type-list-box" v-if="isShow">
                            <div class="type-list">
                                <div class="type-list-item" v-for="(item,index) in typeList" :key="index" @click="changeType(item)">
                                    <span>{{item.name}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box-content">
                    <infinite-scroll-list
                        :fetchFunction="fetchNews"
                        :hasMore="hasMore"
                        :filterCriteria="currentFilterCriteria"
                        :key="isgoMsg"
                    >
                    <template #item="{ items }">
                        <div 
                            class="box-content-item"
                            v-for="( item, index ) in items"
                            :key="index"
                            @click="findNoticeReadFun(item)"
                        >
                            <div class="box-content-item-main">
                                <div class="item-left">
                                    <div class="item-left-box">
                                        <div class="item-left-img">
                                            <img :src="item.cover" alt="" />
                                        </div>
                                        <div class="item-left-text">
                                            <div class="item-left-name">{{ item.title }}</div>
                                            <div class="item-left-center">{{ item.content }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="operation">
                                    <div class="item-right-stats">
                                        <span v-if="item.isRead !== 1"></span>
                                    </div>
                                    <div class="operation-list">
                                        <div class="operation-list-item">
                                            <div class="item-oper">
                                                <template 
                                                    v-if="
                                                        item.businessType == 3"
                                                >
                                                    <template v-if="item.status == 0">
                                                        <div class="operation-del relievoShadow" @click.stop="findDetailsFun(item)">开启任务</div>
                                                    </template>
                                                    <template v-else>
                                                        <div class="operation-del relievoShadow" @click.stop="findDetailsFun(item)">查看详情</div>
                                                    </template>
                                                </template>
                                                <template 
                                                    v-else-if="
                                                        item.businessType == 5 ||
                                                        item.businessType == 24" 
                                                >
                                                    <div class="operation-del relievoShadow" @click.stop="findKanbanFun(item)">立即上传</div>
                                                </template>
                                                <template 
                                                    v-else-if="
                                                        item.businessType == 6 || 
                                                        item.businessType == 9 || 
                                                        item.businessType == 12 || 
                                                        item.businessType == 25 || 
                                                        item.businessType == 28 || 
                                                        item.businessType == 31"
                                                >
                                                    <template 
                                                        v-if="
                                                            item.businessType == 6 || 
                                                            item.businessType == 12 || 
                                                            item.businessType == 25 || 
                                                            item.businessType == 31"
                                                    >
                                                        <template v-if="item.status == 1">
                                                            <div class="operation-del relievoShadow" @click.stop="findKanbanFun(item)">立即审核</div>
                                                        </template>
                                                        <template v-else>
                                                            <div class="operation-del relievoShadow" @click.stop="findDelNoticeFun(item)">删除消息</div>
                                                        </template>
                                                    </template>
                                                    <template v-else>
                                                        <template v-if="item.status == 0">
                                                            <div class="operation-del relievoShadow" @click.stop="findKanbanFun(item)">立即审核</div>
                                                        </template>
                                                        <template v-else>
                                                            <div class="operation-del relievoShadow" @click.stop="findDelNoticeFun(item)">删除消息</div>
                                                        </template>
                                                    </template>
                                                </template>
                                                <template 
                                                    v-else-if="
                                                        item.businessType == 1 || 
                                                        item.businessType == 19 || 
                                                        item.businessType == 20"
                                                >
                                                    <div class="operation-del relievoShadow" @click.stop="findDetailsFun(item)">查看详情</div>
                                                </template>
                                                <template 
                                                    v-else-if="
                                                        item.businessType == 37"
                                                >
                                                    <div class="operation-del relievoShadow" @click.stop="findFollowAddFun(item)">
                                                        <template v-if="item.status == 0">回关</template>
                                                        <template v-if="item.status == 1">关注</template>
                                                    </div>
                                                </template>
                                                <template 
                                                    v-else-if="
                                                        item.businessType == 17 || 
                                                        item.businessType == 36"
                                                >
                                                    <div class="operation-del relievoShadow" @click.stop="findWalletFun(item)">我的钱包</div>
                                                </template>
                                                <template v-else>
                                                    <div class="operation-del relievoShadow" @click.stop="findDelNoticeFun(item)">删除消息</div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="item-right-time">{{ formatTime(item.createTime) }}</div>
                                </div>
                            </div>
                        </div>
                    </template>
                    </infinite-scroll-list>
                </div>
            </div>
        </div>
    </div>
  </template>
  <script lang="ts">
import { defineComponent, ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { aeUseStore } from '@/stores/user';
import { noticeList, noticeRead, delNotice, noticeUnreadCount } from '@/api/msg';
import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
import { showPopup } from '@/utils/usePopup';
import { formatTime, setItem } from '@/utils/index';
import { followAdd } from '@/api/user';
import router from '@/router';

export default defineComponent({
    name: 'TopicEditor',
    components: {
        InfiniteScrollList
    },
    props: {
        isVisible: {
            type: Boolean,
            required: false
        },
    },
    emits: [''],
    setup(props, { emit }) {
        const userStore = aeUseStore();
        const userInfo = userStore.getUserInfo;
        console.log( userInfo);
        const typeList = ref([
            { name: '全部消息', id: '' },
            { name: '任务', id: 1 },
            { name: '评论', id: 3 },
            { name: '粉丝', id: 2 },
            { name: '赞', id: 4 },
        ]);
        const isShow = ref(false);
        const type = ref('');
        const typeName = ref('全部消息');
        const isgoMsg = ref(0);

        // 筛选消息
        const changeType = async(item: any) => {
            type.value = item.id;
            typeName.value = item.name;
            isShow.value = true;
            currentFilterCriteria.value.type = item.id;
        };

        const hasMore = ref(true);
        const currentFilterCriteria = ref({
            type: type.value
        });

        const fetchNews = async (page: number) => {
            let getData = {
                pageNum: page,
                pageSize: 16,
                isRead: currentFilterCriteria.value.type,
            }
            console.log(getData);
            try {
                const response = await noticeList(getData);
                const { code, data, message } = response;

                if (code !== 200) {
                showPopup(message, 'error', 3000);
                return null;
                }
                
                if(data.rows.length == 0) {
                hasMore.value = false;
                return false;
                } else {
                return data.rows;
                }
            } catch (error) {
                console.error('Error fetching news:', error);
                return [];
            }
        };

        // 阅读消息
        const findNoticeReadFun = async(item: any) => {
            const reqData = {
                id: item.id
            }
            return new Promise<void>((resolve, reject) => {
                noticeRead(reqData).then((response: any) => {
                    const { code, message } = response;
                    
                    if (code !== 200) {
                        showPopup(message, 'error', 3000);
                        return;
                    }
                    // showPopup(message, 'success', 3000);
                    isgoMsg.value += 1;
                    findNoticeUnreadCountFun();
                    // currentFilterCriteria.value.type = type.value; // 更新 filterCriteria
                    resolve()
                }).catch((error: any) => {
                    reject(error)
                })
            })
        }

        // 删除消息
        const findDelNoticeFun = async(item: any) => {
            const reqData = {
                id: item.id
            }
            return new Promise<void>((resolve, reject) => {
                delNotice(reqData).then((response: any) => {
                    const { code, message } = response;
                    
                    if (code !== 200) {
                        showPopup(message, 'error', 3000);
                        return;
                    }
                    showPopup(message, 'success', 3000);
                    findNoticeUnreadCountFun();
                    resolve()
                }).catch((error: any) => {
                    reject(error)
                })
            })
        }

        // 
        /**
         * 跳转详情
         * 业务类型：1大任务创建成功 2大任务指定责任人成功 3大任务申请成功 4大任务申请失败 5提醒大任务上传节点数据 
         * 6大任务已上传节点数据 7大任务节点数据审核成功 8大任务节点数据审核失败 9大任务提交提案 10大任务提案通过 
         * 11大任务提案失败 12大任务提交知识 13大任务奇点通过 14大任务奇点失败 15大任务完成 16大任务失败 
         * 17大任务奖励领取成功 19团队创建成功 20子任务创建成功 21子任务指定责任人成功 22子任务申请成功 23子任务申请失败 
         * 24提醒子任务上传节点数据 25子任务已上传节点数据 26子任务节点数据审核成功 27子任务节点数据审核失败 28子任务提交提案 
         * 29提案通过 30提案失败 31提交奇点 32奇点通过 33奇点失败 34子任务完成 35子任务失败 36子任务奖励领取成功 37用户被关注
         * 38提案被评论 39提案评论被回复 40提案被点赞
         * 
        */
        const findDetailsFun = async(item: any) => {
            // 1 3 19 20
            if(item.businessType == 20) {
                // 子任务
                userInfo.subTaskType = 1;
                setItem('subTaskType', 1);
                router.push({ name: 'subTaskDetails', params: { id: item.businessId} })
            } else if(item.businessType == 19) {
                // dao
                userInfo.daoType = 1;
                setItem('daoType', 1);
                router.push({ name: 'TeamDetails', params: { id: item.businessId} })
            } else if(item.businessType == 1 || item.businessType == 3) {
                // 大任务
                router.push({ name: 'TataskDetails', params: { id: item.businessId } });
            }
        }

        // 前往看板审核,需要判断个人或者团队
        const findKanbanFun = async(item: any) => {
            let id = userInfo.id;
            router.push({ name: 'Board', params: { id } });
            userInfo.missionId = item.missionId;
            setItem('missionId', item.missionId)
            router.push({ name: 'executeDetails', params: { id: item.taskId} })

            router.push({ name: 'PersonalTasks', params: { id } });
        }

        // 跳转钱包
        const findWalletFun = async() => {
            router.push({ path: '/personalHomepage/MyWallet' });
        }

        // 回关/关注用户
        const findFollowAddFun = async(item: any) => {
            let reqData = {
                followUserId: item.businessId,
            }
            return new Promise<void>((resolve, reject) => {
                followAdd(reqData).then((response: any) => {
                    const { code, message } = response;
                    
                    if (code !== 200) {
                        showPopup(message, 'error', 3000);
                        return;
                    }
                    showPopup(message, 'success', 3000);
                    fetchNews(1);
                    resolve()
                }).catch((error: any) => {
                    reject(error)
                })
            })
        }

        // 未读通知数量
        const findNoticeUnreadCountFun = async() => {
            return new Promise<void>((resolve, reject) => {
                noticeUnreadCount().then((response: any) => {
                    const { code, data, message } = response;
                    
                    if (code !== 200) {
                        showPopup(message, 'error', 3000);
                        return;
                    }
                    console.log('data', data);
                    if(data < 1) {
                        userInfo.notifications = false;
                    } else {
                        userInfo.notifications = true;
                    }
                    resolve()
                }).catch((error: any) => {
                    reject(error)
                })
            })
        }

        // 初始化时填充初始内容
        onMounted(() => {
            if(!userInfo.notifications) {
                findNoticeUnreadCountFun();
            }
        });

        onBeforeUnmount(() => {
            userInfo.isMsgShow = false;
        });

        return {
            type,
            typeName,
            isShow,
            typeList,
            hasMore,
            isgoMsg,
            fetchNews,
            changeType,
            formatTime,
            findNoticeReadFun,
            currentFilterCriteria,
            findDelNoticeFun,
            findNoticeUnreadCountFun,
            findDetailsFun,
            findKanbanFun,
            findWalletFun,
            findFollowAddFun,
        };
    }
});
</script>
  
  <style scoped lang="scss">
    .messageModal{
        width: 340px;
        height: auto;
        max-height: 520px;
        border-radius: 16px;
        position: absolute;
        top: 72px;
        right: 20px;
        z-index: 10;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.12);
        overflow: hidden;
        animation: slideDown 0.25s ease-out;
        transform-origin: top right;
        
        @media (max-width: 480px) {
            width: calc(100vw - 40px);
            right: 10px;
        }
        
        @keyframes slideDown {
            from {
                transform: translateY(-10px) scale(0.98);
                opacity: 0;
            }
            to {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
        }
        
        .messageModal-content{
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
            
            .masking{
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: -1;
                border-radius: 16px;
                background: rgba(25, 28, 35, 0.92);
                backdrop-filter: blur(12px);
            }
            
            .messageModal-content-box{
                width: 100%;
                height: 100%;
                overflow: hidden;
                padding: 16px 12px;
                
                .box-header{
                    width: 100%;
                    height: 28px;
                    display: flex;
                    margin-bottom: 12px;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    padding-bottom: 8px;
                    
                    .box-header-title{
                        font-size: 16px;
                        font-weight: 600;
                        color: #FFFFFF;
                        line-height: 28px;
                    }
                    
                    .box-header-type{
                        position: relative;
                        
                        .box-header-type-main{
                            height: 28px;
                            display: flex;
                            cursor: pointer;
                            align-items: center;
                            background-color: rgba(255, 255, 255, 0.05);
                            border-radius: 14px;
                            padding: 0 10px;
                            transition: background-color 0.2s ease;
                            
                            &:hover {
                                background-color: rgba(255, 255, 255, 0.1);
                            }
                            
                            .type-name{
                                font-size: 13px;
                                color: rgba(255, 255, 255, 0.85);
                                line-height: 28px;
                                text-align: center;
                            }
                            
                            .type-but{
                                width: 16px;
                                height: 16px;
                                cursor: pointer;
                                margin-left: 4px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                
                                i{
                                    font-size: 12px;
                                    color: rgba(255, 255, 255, 0.7);
                                    transition: transform 0.2s ease;
                                }
                            }
                        }
                        
                        .type-list-box{
                            width: 100%;
                            min-width: 110px;
                            height: auto;
                            border-radius: 10px;
                            position: absolute;
                            top: 32px;
                            right: 0;
                            z-index: 9;
                            background-color: rgba(30, 35, 45, 0.95);
                            backdrop-filter: blur(12px);
                            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
                            overflow: hidden;
                            animation: fadeIn 0.2s ease-out;
                            transform-origin: top;
                            
                            @keyframes fadeIn {
                                from {
                                    opacity: 0;
                                    transform: translateY(-5px) scale(0.98);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateY(0) scale(1);
                                }
                            }
                            
                            .type-list{
                                width: 100%;
                                height: auto;
                                padding: 4px 0;
                                
                                .type-list-item{
                                    width: 100%;
                                    font-size: 13px;
                                    color: rgba(255, 255, 255, 0.85);
                                    line-height: 32px;
                                    text-align: center;
                                    cursor: pointer;
                                    transition: all 0.15s ease;
                                    padding: 0 8px;
                                    
                                    &:hover{
                                        background-color: rgba(62, 154, 255, 0.15);
                                        color: #FFFFFF;
                                    }
                                }
                            }
                        }
                    }
                }
                
                .box-content{
                    width: 100%;
                    height: calc(100% - 48px);
                    overflow-y: auto;
                    
                    &::-webkit-scrollbar {
                        width: 4px;
                    }
                    
                    &::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    
                    &::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 4px;
                    }
                    
                    &::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                    
                    .box-content-item{
                        width: 100%;
                        height: auto;
                        padding: 10px 6px;
                        cursor: pointer;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                        transition: all 0.2s ease;
                        
                        &:hover {
                            background-color: rgba(255, 255, 255, 0.04);
                            transform: translateX(2px);
                        }
                        
                        &:active {
                            background-color: rgba(255, 255, 255, 0.07);
                        }
                        
                        &:last-child{
                            border-bottom: none;
                        }
                        
                        .box-content-item-main{
                            width: 100%;
                            height: auto;
                            display: flex;
                            flex-wrap: wrap;
                            
                            .item-left{
                                flex: 1;
                                width: 0;
                                min-width: 0;
                                padding-right: 4px;
                                
                                .item-left-box{
                                    width: 100%;
                                    height: auto;
                                    display: flex;
                                    
                                    .item-left-img{
                                        width: 36px;
                                        height: 36px;
                                        flex-shrink: 0;
                                        margin-right: 8px;
                                        border-radius: 8px;
                                        overflow: hidden;
                                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                                        
                                        img{
                                            width: 100%;
                                            height: 100%;
                                            object-fit: cover;
                                        }
                                    }
                                    
                                    .item-left-text{
                                        flex: 1;
                                        width: 0;
                                        min-width: 0;
                                        
                                        .item-left-name{
                                            font-size: 13px;
                                            font-weight: 500;
                                            color: #FFFFFF;
                                            line-height: 1.2;
                                            text-align: left;
                                            margin-bottom: 4px;
                                            white-space: nowrap;
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                        }
                                        
                                        .item-left-center{
                                            font-size: 12px;
                                            color: rgba(255, 255, 255, 0.65);
                                            line-height: 1.3;
                                            text-align: left;
                                            display: -webkit-box;
                                            -webkit-line-clamp: 2;
                                            -webkit-box-orient: vertical;
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                            max-height: 32px;
                                            word-break: break-word;
                                        }
                                    }
                                }
                            }
                            
                            .operation{
                                width: 75px;
                                height: 100%;
                                margin-left: 4px;
                                flex-shrink: 0;
                                position: relative;
                                display: flex;
                                flex-direction: column;
                                align-items: flex-end;
                                
                                .operation-list{
                                    width: 100%;
                                    height: auto;
                                    display: flex;
                                    justify-content: flex-end;
                                    
                                    .operation-list-item{
                                        width: 100%;
                                        height: auto;
                                        
                                        .item-oper{
                                            width: 100%;
                                            height: auto;
                                            display: flex;
                                            justify-content: flex-end;
                                        }
                                    }
                                    
                                    .operation-del{
                                        height: 24px;
                                        line-height: 24px;
                                        cursor: pointer;
                                        font-size: 11px;
                                        color: #FFFFFF;
                                        text-align: center;
                                        border-radius: 12px;
                                        padding: 0 8px;
                                        margin-top: 6px;
                                        background-color: rgba(62, 154, 255, 0.15);
                                        transition: all 0.2s ease;
                                        white-space: nowrap;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        max-width: 100%;
                                        
                                        &:hover {
                                            background-color: rgba(62, 154, 255, 0.3);
                                            transform: translateY(-1px);
                                        }
                                        
                                        &:active {
                                            transform: translateY(0);
                                        }
                                    }
                                }
                                
                                .item-right-stats{
                                    width: 5px;
                                    height: 5px;
                                    display: block;
                                    position: absolute;
                                    top: 0;
                                    right: 0;
                                    
                                    span{
                                        width: 5px;
                                        height: 5px;
                                        display: block;
                                        background: #FF3B30;
                                        border-radius: 50%;
                                        box-shadow: 0 0 4px rgba(255, 59, 48, 0.5);
                                    }
                                }
                                
                                .item-right-time{
                                    font-size: 11px;
                                    color: rgba(255, 255, 255, 0.45);
                                    line-height: 1;
                                    text-align: right;
                                    margin: 5px 2px 0 0;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
  </style>
  