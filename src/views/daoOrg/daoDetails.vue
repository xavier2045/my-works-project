<template>
<div class="teamDetails" ref="teamDetailsRef">
    <div class="teamDetails-container">
        <persHeader />
        <div class="teamDetails-content">
            <div class="teamDetails-container-body">
            <div class="body-main">
                <div class="body-main-info">
                    <div class="body-main-info-content">
                        <div class="info-content-cover">
                            <div class="info-content-cover-img">
                                <el-image
                                    style="width: 100%; height: 100%"
                                    :src="details.cover"
                                    fit="cover"
                                    >
                                    <template #error>
                                        <img src="@/assets/images/common/default.png" alt="Default Image" />
                                    </template>
                                </el-image>
                            </div>
                        </div>
                        <div class="body-main-info-users">
                            <div class="info-users-time">
                                {{ details.createTime }}
                            </div>
                            <div class="info-users-turnover">
                            <div class="turnover-main">
                                <div class="turnover-main-l">
                                <div class="info-users-list">
                                    <div class="list-info">
                                        <div class="list-info-name">
                                            <div class="list-info-name-text">任务来源：</div>
                                            <div class="list-info-name-img">
                                                <el-image
                                                    :src="details.missionCreateUserAvatar"
                                                    fit="cover"
                                                    >
                                                    <template #error>
                                                        <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                    </template>
                                                </el-image>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="user-id multi-line-1">账号ID：{{ details.missionCreateUserUuid }}</div>
                                </div>
                                </div>
                                <div class="turnover-main-c">
                                    <img :src="arrow" alt="" />
                                </div>
                                <div class="turnover-main-r">
                                <div class="info-users-list">
                                    <div class="list-info">
                                        <div class="list-info-name">
                                            <div class="list-info-name-text">任务创建：</div>
                                            <div class="list-info-name-img">
                                                <el-image
                                                    :src="details.missionAdminUserAvatar"
                                                    fit="cover"
                                                    >
                                                    <template #error>
                                                        <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                    </template>
                                                </el-image>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="user-id multi-line-1">账号ID：{{ details.missionAdminUserUuid }}</div>
                                </div>
                                </div>
                            </div>
                            </div>
                            <div class="info-users-list">
                            <div class="list-info">
                                <div class="list-info-name">
                                    <div class="list-info-name-text">团队创建者：</div>
                                    <div class="list-info-name-img">
                                        <el-image
                                            :src="details.missionAdminUserAvatar"
                                            fit="cover"
                                            >
                                            <template #error>
                                                <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                            </template>
                                        </el-image>
                                    </div>
                                </div>
                            </div>
                            <div class="user-id multi-line-1">D-ID：{{ details.missionAdminUserUuid }}</div>
                            </div>
                            <div class="team-name">团队名称：<span>{{ details.name }}</span></div>
                            <div class="team-industry">所属行业：<span>{{ details.categoryName }}</span></div>
                        </div>
                        <div class="body-main-info-datas">
                            <div class="datas-item">
                                <div class="datas-item-icon">
                                    <i class="icon font_family icon-rili24"></i>
                                </div>
                                <div class="datas-item-progress">
                                    <div class="progress-bar">
                                        <div class="progress-bar-display">
                                            <div class="link-l"></div>
                                            <div class="link-c">{{ details.votePeriod || 0 }}天</div>
                                            <div class="link-r"></div>
                                        </div>
                                    </div>
                                    <div class="progress-name">投票周期</div>
                                </div>
                            </div>
                            <div class="datas-item">
                                <div class="datas-item-icon">
                                    <i class="icon font_family icon-jiedian24_1"></i>
                                </div>
                                <div class="datas-item-progress">
                                    <div class="progress-text" :style="{left: (Number(details.passRate) ? Number(details.passRate) - 6 : 0)  +'%'}">{{ details.passRate || 0 }}</div>
                                    <div class="progress-bar">
                                        <ScaleProgressBar :max="100" :progress="Number(details.passRate) || 0" :showPercentage="true" />
                                    </div>
                                    <div class="progress-name">投票通过率</div>
                                </div>
                            </div>
                            <div class="avatars">
                            <div class="list-info-name-img-list" v-if="details.daoMembers.length > 0">
                                <div 
                                    class="list-info-name-img-list-item"
                                    v-for="(item, index) in details.daoMembers.slice(0, 4)" 
                                    :key="index"
                                    @click="findViewPersonalInfo(item.userId)"
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
                                <div class="list-info-name-img-list-item" v-if="details.daoMemberNum - 4 > 0">
                                    <p>+ {{ details.daoMemberNum - 4 }}</p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div class="body-main-operation">
                        <div class="operation-item">
                        <template v-if="details.missionAdminUserId == userInfo.id">
                            <div class="but-oper" @click="findCreateSubtaskFun">创建子任务</div>
                            <div class="but-oper" @click="findTaskKanbanFun">任务看板</div>  
                        </template>
                        <div class="but-oper" @click="findTeamDetailsFun">团队详情</div>
                        </div>
                </div>
            </div>
            </div>
            <div>
            <SubTaskList 
                v-if="isDetailsLoaded" 
                :daoId="details.daoId" 
                :missionId="details.missionId"  
                :missionAdminUserId="details.missionAdminUserId" 
            />
            </div>
        </div>
    </div>
</div>
</template>
  
<script lang='ts' setup>
    import { ref, onMounted } from 'vue';
    import { showPopup } from '@/utils/usePopup';
    import { extractIdFromUrl, getItem, setItem } from '@/utils/index';
    import router from '@/router';
    import { aeUseStore } from '@/stores/user';
    import { getDaoDetails } from '@/api/dao';
    import persHeader from '@/components/header/persHeader.vue';
    import SubTaskList from '@/components/subTaskList/index.vue';
    import ScaleProgressBar from '@/components/progress/scaleProgressBar.vue';
    import arrow from '@/assets/images/task/arrow.png';
    import { getDominantColorRGBA } from '@/utils/getDominantColor';


    const userStore = aeUseStore();
    const userInfo = userStore.getUserInfo;
    const daoType = ref(0); // 1 Dao子列表页面进入Dao详情 2 待支付进去Dao详情
    const isDetailsLoaded = ref(false);
    const details = ref({
        missionId: '',
        missionCreateUserId: '',
        missionCreateUserUuid: '',
        missionCreateUserAvatar: '',
        missionAdminUserId: '',
        missionAdminUserUuid: '',
        missionAdminUserAvatar: '',
        daoId: '',
        cover: '',
        name: '',
        categoryName: '',
        passRate: '',
        description: '',
        target: '',
        votePeriod: '',
        daoMemberNum: '',
        daoMembers:	[],
        qrcode: '',
        payStatus: null as number | null,
        amount: null as number | null,
        poundage: null as number | null,
        orderNo: '',
        orderCreateTime: '',
        minute: null as number | null
    });
    console.log('details', details);

    const dominantColor = ref<string | null>(null);

    /** 获取团队详情 **/
    const findGetDaoDetailsFun = async () => {
        const currentUrl = window.location.href; // 获取当前页面的 URL
        let id = extractIdFromUrl(currentUrl)+'';
        
        let reqData = {
            id: id,
            type: 1
        }
        return new Promise<void>((resolve, reject) => {
            getDaoDetails(reqData).then((response: any) => {
                const { code, data, message } = response;
                
                const resultData = data;
                if (code !== 200) {
                showPopup(message, 'error', 3000);
                    return;
                }

                details.value  = resultData;
                isDetailsLoaded.value = true;
                extractColor(details.value.cover);
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

    // 创建子任务
    const findCreateSubtaskFun = () => {
        userInfo.daoId = details.value.daoId;
        userInfo.missionId = details.value.missionId;
        userInfo.openCreateSubTaskType = 1;
        setItem('daoId', details.value.daoId);
        router.push({ name: 'CreateSubtask' });
    };

    // 任务看板
    const  findTaskKanbanFun = () => {
        userInfo.daoId = details.value.daoId;
        userInfo.missionId = details.value.missionId;
        setItem('missionId', details.value.missionId);
        userInfo.bigTaskUserId = details.value.missionCreateUserId;
        userInfo.daoAdminUserId = details.value.missionAdminUserId;
        router.push({ name: 'executeDetails', params: { id: details.value.daoId }   });
    };

    // 团队详情
    const  findTeamDetailsFun = () => {
        userInfo.daoType = 1;
        setItem('daoType', 1);
        router.push({ name: 'TeamDetails', params: { id: details.value.daoId }  });
    };

    // 定义一个 ref 来引用 DOM 元素
    const teamDetailsRef = ref<HTMLElement | null>(null);

    // 定义一个方法来改变背景色
    const changeBackgroundColor = (newColor: string) => {
        if (teamDetailsRef.value) {
            teamDetailsRef.value.style.setProperty('--common-bg-color', newColor);
        }
    };
    // 获取图片主色调并改变背景色
    const extractColor = async (url: string) => {
        try {
            dominantColor.value = await getDominantColorRGBA(url, 0.18);
            changeBackgroundColor(dominantColor.value);
            console.log('Dominant Color:', dominantColor.value);
        } catch (error) {
            console.error('Error extracting dominant color:', error);
        }
    };
  
    onMounted(() => {
      findGetDaoDetailsFun();
    });
</script>
  
<style lang='scss' scoped>
    @use '@/assets/styles/daoOpenDetails.scss'; 
    :root {
        --common-bg-color: rgba(0, 0, 0, .05);
    }
    
</style>
  