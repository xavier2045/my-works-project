<template>
    <div class="popupModal" v-if="isAttentionList" @click="closeModal">
        <div class="modal-mask"></div>
        <div class="popupModal-wrapper edit-info" @click.stop>
            <div class="popupModal-wapper-center">
                <div class="popupModal-wrapper-mask"></div>
                <div class="attention-list">
                    <div class="header">
                        <div class="tab attention_l_bg" :class="activeTab === 'following' ? 'active' : 'unchecked'" @click="activeTab = 'following'">
                        我的关注({{ followingCount }})
                        </div>
                        <div class="tab attention_r_bg" :class="activeTab === 'followers' ? 'active' : 'unchecked'" @click="activeTab = 'followers'">
                        我的粉丝({{ followersCount }})
                        </div>
                    </div>
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
                            <!-- { id: 1, name: '数字先驱者', description: '数据驱动未来，创新引领...', avatar: 'path/to/avatar1.jpg', isFollowing: true }, -->
                            <div
                                class="applies-list-item"
                                :class="applyId == item.id ? 'active' : ''"
                                v-for="(item, index) in filteredAttentionList" 
                                :key="item.userId"
                            >
                                <div class="item-content">
                                    <div class="item-content-left">
                                        <div class="item-content-left-main">
                                            <div class="item-content-left-main-avatar" @click="findViewPersonalInfo(item.userId)">
                                                <img :src="item.avatar" alt="" />
                                            </div>
                                            <div class="item-content-left-main-info">
                                                <div class="item-content-left-main-info-name">{{ item.name }}</div>
                                                <div class="item-content-left-main-info-tips">{{ item.description }}</div>
                                            </div> 
                                        </div>
                                    </div>
                                    <div class="item-content-right" @click="chooseApply(item)">
                                        <div class="item-content-right-main">
                                            <div class="ae-btn">
                                                <div class="exhibit-publish-main">
                                                    <div class="exhibit-publish-name">相互关注</div>
                                                </div>
                                            </div>
                                            <div class="ae-btn" @click="findIsunfollowFun(item)">
                                                <div class="exhibit-publish-main">
                                                    <div class="exhibit-publish-name">移除</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 移除关注  -->
        <div class="popupModal" v-if="isunfollow" @click="isunfollow = false" @click.stop>
            <div class="masking"></div>
            <div class="popupModal-center">
                <div class="popupModal-main">
                    <div class="popupModal-module"></div>
                    <div class="popupModal-main-content">
                        <div class="popupModal-main-title">移除粉丝后对方将不再关注你，且不会收到通知，你也不会被推荐给对方</div>
                        <div class="popupModal-main-but-group">
                        <div class="popupModal-main-but ae-btn" @click="isunfollow = false">
                            <div class="exhibit-publish-main">
                                <div class="exhibit-publish-name">取消</div>
                            </div>
                        </div>
                        <div class="popupModal-main-but ae-btn" @click="findsbumitUnfollowSubmit">
                            <div class="exhibit-publish-main">
                                <div class="exhibit-publish-name">确定移除</div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script lang="ts">
    import { defineComponent, ref, computed } from 'vue';
    import { showPopup } from '@/utils/usePopup';
    interface AttentionItem {
        id: number;
        name: string;
        description: string;
        avatar: string;
        isFollowing: boolean;
    }
    
    export default defineComponent({
        name: 'AttentionList',
        props: {
            isShow: {
                type: Boolean,
                required: true,
            }
        },
        emits: ['close'],
        setup(props, { emit }) {
            const activeTab = ref('following');
            const searchQuery = ref('');
            const applyId = ref(0);
            const isAttentionList = ref(props.isShow);
            const isunfollow = ref(false); // 移除关注
            const unfollowId = ref(0);

            const attentionList = ref<any[]>([
                { id: 1, name: '数字先驱者', description: '数据驱动未来，创新引领...', avatar: 'path/to/avatar1.jpg', isFollowing: true },
                { id: 2, name: '区块链航海者', description: '在去中心化的海洋中，航...', avatar: 'path/to/avatar2.jpg', isFollowing: false },
                { id: 3, name: 'AI梦想家', description: '人工智能的未来，由我们...', avatar: 'path/to/avatar3.jpg', isFollowing: true },
                { id: 4, name: '哲学思考者', description: '深避的思想，指引生活的...', avatar: 'path/to/avatar4.jpg', isFollowing: false },
                { id: 5, name: '元宇宙冒险家', description: '探索虚拟世界，发现无限...', avatar: 'path/to/avatar5.jpg', isFollowing: false },
            ]); // 关注/粉丝列表
            const followingCount = ref(0); // 关注数量
            const followersCount = ref(0); // 粉丝数量
            const search = ref('');
        
            const filteredAttentionList = computed(() => {
                return attentionList.value.filter(item =>
                item.name.includes(searchQuery.value) || item.description.includes(searchQuery.value)
                );
            });

            const chooseApply = (item: any) => {
                applyId.value = item.userId;
            };
        
            const toggleFollow = (item: AttentionItem) => {
                item.isFollowing = !item.isFollowing;
            };

            // 搜索关注列表
            const handleEnter = () => {
                search.value = search.value;
            }

            // 移除关注
            const findIsunfollowFun = (item: any) => {
                isunfollow.value = true;
                unfollowId.value = item.userId;
            };

            // 二次确定移除关注
            const findsbumitUnfollowSubmit = () => {
                let reqData = {
                    id: unfollowId.value
                }
                return new Promise<void>((resolve, reject) => {
                    periodAdd(reqData).then((response: any) => {
                        const { code, message } = response;
                        
                        if (code !== 200) {
                            showPopup(message, 'error', 3000);
                            return;
                        }
                        isunfollow.value = false;
                        showPopup('移除成功', 'success', 3000);
                        resolve()
                    }).catch((error: any) => {
                        reject(error)
                    })
                })
            };

            const closeModal = () => {
                emit('close');
            };
        
            return {
                search,
                isunfollow,
                activeTab,
                searchQuery,
                followingCount,
                followersCount,
                isAttentionList,
                filteredAttentionList,
                closeModal,
                handleEnter,
                toggleFollow,
                findIsunfollowFun,
                findsbumitUnfollowSubmit,
            };
        },
    });
  </script>
  
  <style lang='scss' scoped>
    @use '@/assets/styles/common.scss';
    @use '@/assets/styles/popupModal.scss';
    .popupModal{
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 9;
        .modal-mask{
            width: 100%;
            height: 100%;
            position: relative;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(0,0,0,0);
        }
        .popupModal-wrapper{
            width: 483px;
            height: auto;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            .popupModal-wapper-center{
                position: relative;
                border-radius: 24px;
                overflow: hidden;
                border: 1px solid rgb(255, 255, 255, .38);
                box-shadow: 0px 9px 18px 9px rgb(0, 0, 0, .15);
                .popupModal-wrapper-mask{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: -1;
                    background: rgba(255,255,255,0.06);
                    backdrop-filter: blur(68px);
                }
            }
        }
        .edit-info{
            width: 483px;
            height: auto;
            .popupModal-wapper-center{
                width: 100%;
                height: 100%;
                .attention-list {
                    width: 100%;
                    border-radius: 8px;
                    .header {
                        width: 100%;
                        height: auto;
                        display: flex;
                        .tab {
                            flex: 1;
                            width: 0;
                            cursor: pointer;
                            font-weight: 400;
                            font-size: 18px;
                            color: rgb(255, 255, 255, 0.68);
                            line-height: 50px;
                            text-align: center;
                        }
                        .attention_l_bg {
                            height: 70px;

                            background: url(@/assets/images/publish/attention_l_bg.png) no-repeat center center;
                            background-size: 100% 100%;
                        }
                        .attention_r_bg {
                            height: 70px;
                            background: url(@/assets/images/publish/attention_r_bg.png) no-repeat center center;
                            background-size: 100% 100%;
                        }
                        .active {
                            width: 288px;
                            flex: initial;
                            flex-shrink: 0;
                            color: rgb(255, 255, 255, 1);
                        }
                        .unchecked{
                            background: inherit !important;
                        }
                    }
                    .personInCharge-center-select{
                        height: 72px;
                        padding: 0 10px;
                        background: rgba(0, 0, 0, .18);
                        background: url(@/assets/images/task/search_bg.png) no-repeat center center;
                        background-size: 100% 100%;
                        &:hover{
                            background: url(@/assets/images/task/search_bg_hover.png) no-repeat center center;
                            background-size: 100% 100%;
                        }
                        .search-main{
                            padding: 11px 20px 11px 25px;
                            display: flex;
                            cursor: pointer;
                            .search-icon{
                                width: 24px;
                                i{
                                    font-size: 24px;
                                    color: rgba(255, 255, 255, .8);
                                    display: block;
                                    margin-right: 6px;
                                    line-height: 52px;
                                }
                            }
                            .search-input{
                                flex-grow: 1;
                                width: 0;
                                height: 52px;
                                input{
                                    width: 100%;
                                    height: 100%;
                                    border: none;
                                    outline: none;
                                    font-size: 16px;
                                    color: rgba(255, 255, 255, .9);
                                    line-height: 52px;
                                    display: block;
                                    background-color: inherit;
                                }
                                input[type="text"]::placeholder {
                                    color: rgb(255, 255, 255, 0.68);
                                    font-size: 16px;
                                }
                            }
                            .search-clear{
                                width: 24px;
                                i{
                                    font-size: 24px;
                                    color: rgba(255, 255, 255, .6);
                                    display: block;
                                    margin-right: 6px;
                                    line-height: 52px;
                                }
                            }
                        }
                    }
                    .personInCharge-center-list{
                        height: auto;
                        margin: 6px 20px 10px 27px;
                        .applies-list{
                            height: 413px;
                            overflow-y: auto;
                            padding-right: 10px;
                            &:focus-visible{
                                outline: none;
                            }
                            /* 火狐浏览器滚动条样式 */
                            @supports (-moz-appearance: none) {
                            scrollbar-width: thin;

                            ::-moz-scrollbar-track {
                                background-color: rgba(225,225,225,0);  /* 轨道颜色 */
                                border-radius: 2px;
                            }

                            ::-moz-scrollbar-thumb {
                                background-color: rgba(225,225,225,0.2);  /* 滑块颜色 */
                                border-radius: 2px;
                                width: 4px;
                            }

                            ::-moz-scrollbar-thumb:hover {
                            background-color: rgba(225,225,225,0.2);  /* 悬停时滑块颜色 */
                            }
                            }
                            /* 通用滚动条样式 */
                            &::-webkit-scrollbar { /* 整个滚动条 */
                                width: 4px; /* 滚动条宽度 */
                            }
                            &::-webkit-scrollbar-track { /* 滚动条轨道 */
                                background: rgba(225,225,225,0); 
                            }
                            &::-webkit-scrollbar-thumb { /* 滚动条滑块 */
                                background: rgba(225,225,225,0.2); 
                                border-radius: 2px;
                            }
                            &::-webkit-scrollbar-thumb:hover { /* 鼠标悬停时滚动条滑块样式 */
                                background: rgba(225,225,225,0.2); 
                            }
                            .applies-list-item{
                                width: 100%;
                                height: auto;
                                padding: 16px 0;
                                &:hover{
                                    border-radius: 8px;
                                    background: rgba(255, 255, 255, .03);
                                }
                                .item-content{
                                    width: 100%;
                                    height: auto;
                                    display: flex;
                                    .item-content-left{
                                        flex: 1;
                                        width: 0;
                                        .item-content-left-main{
                                            width: 100%;
                                            height: auto;
                                            display: flex;
                                            .item-content-left-main-avatar{
                                                width: 52px;
                                                height: 52px;
                                                border-radius: 50%;
                                                overflow: hidden;
                                                margin-right: 10px;
                                                background: url(@/assets/images/task/avatar_bg.png) no-repeat center center;
                                                background-size: 100% 100%;
                                                :deep(.el-image, img) {
                                                    width: 70%;
                                                    height: 70%;
                                                    border-radius: 50%;
                                                    display: block;
                                                    margin: 15% auto;
                                                }
                                            }
                                            .item-content-left-main-info{
                                                flex: 1;
                                                .item-content-left-main-info-name{
                                                    width: 100%;
                                                    font-size: 16px;
                                                    color: #FFFFFF;
                                                    line-height: 1;
                                                    text-align: left;
                                                    font-style: normal;
                                                    text-transform: none;
                                                    margin-top: 4px;
                                                }
                                                .item-content-left-main-info-tips{
                                                    width: 100%;
                                                    font-size: 14px;
                                                    color: #FFFFFF;
                                                    line-height: 1;
                                                    text-align: left;
                                                    font-style: normal;
                                                    text-transform: none;
                                                    margin-top: 13px;
                                                }
                                            }
                                        }
                                    }
                                    .item-content-right{
                                        width: 180px;
                                        height: 43px;
                                        flex-shrink: 0;
                                        .item-content-right-main{
                                            width: 100%;
                                            height: 100%;
                                            display: flex;
                                            justify-content: space-between;
                                            .ae-btn{
                                                width: 90px;
                                                margin-right: 0;
                                            }
                                        }
                                        i{
                                            font-size: 24px;
                                            color: rgba(255, 255, 255, 1);
                                            text-align: center;
                                            display: block;
                                            line-height: 43px;
                                        }
                                        .exhibit-publish-name{
                                            font-weight: 400;
                                            font-size: 14px;
                                            color: rgba(255, 255, 255, 0.6);
                                            text-align: center;
                                            line-height: 43px !important;
                                        }
                                    }
                                }
                            }
                            .active{
                                border-radius: 8px;
                                background-color: rgb(0, 0, 0, .15);
                                .exhibit-publish-name{
                                    color: #FFFFFF !important;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
  </style>