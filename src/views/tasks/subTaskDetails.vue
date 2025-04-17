<template>
    <div class="taskDetails" ref="taskDetailsRef">
        <div class="taskDetails-container">
            <persHeader />
            <div class="taskDetails-content">
            <div class="taskDetails-container-body">
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
                                        <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                    </template>
                                </el-image>
                            </div>
                        </div>
                        <div class="body-main-info-users">
                            <div class="info-users-time">
                                {{ details.taskCreateTime }}
                            </div>
                            <div class="info-users-turnover">
                                <div class="turnover-main">
                                <div class="turnover-main-one">
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
                                <div class="turnover-main-two">
                                    <img :src="arrow" alt="" />
                                </div>
                                <div class="turnover-main-three">
                                    <div class="info-users-list">
                                    <div class="list-info">
                                        <div class="list-info-name">
                                            <div class="list-info-name-text">任务创建：</div>
                                            <div class="list-info-name-img">
                                                <el-image
                                                    :src="details.taskCreateUserAvatar"
                                                    fit="cover"
                                                    >
                                                    <template #error>
                                                        <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                    </template>
                                                </el-image>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="user-id multi-line-1">账号ID：{{ details.taskCreateUserUuid }}</div>
                                    </div>
                                </div>
                                <template v-if="details.taskAdminUserUuid !== null">
                                    <div class="turnover-main-four">
                                        <img :src="arrow" alt="" />
                                    </div>
                                    <div class="turnover-main-five">
                                        <div class="info-users-list">
                                        <div class="list-info">
                                            <div class="list-info-name">
                                                <div class="list-info-name-text">任务接收者：</div>
                                                <div class="list-info-name-img">
                                                    <el-image
                                                        :src="details.taskAdminUserAvatar"
                                                        fit="cover"
                                                        >
                                                        <template #error>
                                                            <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                        </template>
                                                    </el-image>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="user-id multi-line-1">账号ID：{{ details.taskAdminUserUuid }}</div>
                                        </div>
                                    </div>
                                    </template>
                                </div>
                            </div>
                            <div class="team-industry">任务报酬：¥<span>{{ details.reward }}</span></div>
                            <template v-if="details.taskAdminUserUuid !== null">
                                <div class="info-users-list">
                                    <div class="list-info">
                                        <div class="list-info-name">
                                            <div class="list-info-name-text">任务接收者：</div>
                                            <div class="list-info-name-img">
                                                <el-image
                                                    :src="details.taskAdminUserAvatar"
                                                    fit="cover"
                                                    >
                                                    <template #error>
                                                        <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                    </template>
                                                </el-image>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="user-id multi-line-1">D-ID：{{ details.taskAdminUserUuid }}</div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="info-users-list">
                                    <div class="list-info">
                                        <div class="list-info-name">
                                            <div class="list-info-name-text">任务申请者：</div>
                                            <!-- <div class="list-info-name-img"> -->
                                                <div class="avatars">
                                                    <div class="list-info-name-img-list" v-if="details.applyAvatars.length > 0">
                                                        <div 
                                                            class="list-info-name-img-list-item"
                                                            v-for="(item, index) in details.applyAvatars.slice(0, 2)" 
                                                            :key="index"
                                                        >
                                                            <el-image
                                                                :src="item"
                                                                fit="cover"
                                                                >
                                                                <template #error>
                                                                    <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                                </template>
                                                            </el-image>
                                                        </div>
                                                        <div class="list-info-name-img-list-item" v-if="details.appleNum - 2 > 0">
                                                            <p>+ {{ details.appleNum - 2 }}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            <!-- </div> -->
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <div class="team-name">岗位名称：<span>{{ details.name }}</span></div>
                        </div>
                        <div class="body-main-info-datas">
                            <div class="datas-item">
                                <div class="datas-item-icon">
                                    <i class="icon font_family icon-jiedian24_1"></i>
                                </div>
                                <div class="datas-item-progress">
                                    <div class="progress-text" :style="{left: (Number(details.trustValue) ? Number(details.trustValue) - 6 : 0) +'%'}">{{ details.trustValue || 0 }}</div>
                                    <div class="progress-bar">
                                        <ScaleProgressBar :max="100" :progress="Number(details.trustValue) || 0" :showPercentage="true" />
                                    </div>
                                    <div class="progress-name">信任值要求</div>
                                </div>
                            </div>
                            <div class="datas-item">
                                <div class="datas-item-icon">
                                    <i class="icon font_family icon-rili24"></i>
                                </div>
                                <div class="datas-item-progress">
                                    <div class="progress-bar">
                                        <div class="progress-bar-display">
                                            <div class="link-l"></div>
                                            <div class="link-c">{{ details.day || 0 }}天</div>
                                            <div class="link-r"></div>
                                        </div>
                                    </div>
                                    <div class="progress-name">任务周期</div>
                                </div>
                            </div>
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
                                    <div class="progress-name">节点周期</div>
                                </div>
                            </div>
                            <div class="datas-item">
                                <div class="datas-item-icon">
                                    <i class="icon font_family icon-jiedian24_1"></i>
                                </div>
                                <div class="datas-item-progress">
                                    <div class="progress-text" :style="{left: (Number(details.passRate) ? Number(details.passRate) - 6 : 0) +'%'}">{{ details.passRate || 0 }}</div>
                                    <div class="progress-bar">
                                        <ScaleProgressBar :max="100" :progress="Number(details.passRate) || 0" :showPercentage="true" />
                                    </div>
                                    <div class="progress-name">节点通过率</div>
                                </div>
                            </div>
                                <template v-if="details.taskAdminUserUuid !== null">
                                    <div class="datas-item">
                                        <div class="datas-item-icon">
                                            <i class="icon font_family icon-jiedian24_1"></i>
                                        </div>
                                        <div class="datas-item-progress">
                                            <div class="progress-text" :style="{left: (Number(details.progress) ? Number(details.progress) - 6 : 0) +'%'}">{{ details.progress || 0 }}</div>
                                            <div class="progress-bar">
                                                <ScaleProgressBar :max="100" :progress="Number(details.progress) || 0" :showPercentage="true" />
                                            </div>
                                            <div class="progress-name">任务总进度</div>
                                        </div>
                                    </div>
                                </template>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-content">
                <DisplayArea :tabData="proData" />
                <template v-if="userInfo.uuid !== details.missionCreateUserUuid && userInfo.uuid !== details.taskCreateUserUuid">
                    <template v-if="details.hasApply !== 0">
                        <template v-if="details.taskAdminUserUuid == null && details.taskAdminUserUuid !== ''">
                            <div class="hasApply-tips">
                                    <div class="hasApply-tips-main">
                                        <div class="hasApply-tips-icon">
                                            <i class="icon iconfont icon-shaloushijian24"></i>
                                        </div>
                                        <div class="hasApply-tips-text">您已申请参与任务，请等待审核结果</div>
                                    </div>
                                </div>
                        </template>
                        <template v-else>
                            <template v-if="userInfo.uuid !== details.taskAdminUserUuid">
                                <div class="hasApply-tips">
                                    <div class="hasApply-tips-main">
                                        <div class="hasApply-tips-icon">
                                            <i class="icon iconfont icon-shibaiyuanxingbiankuang20"></i>
                                        </div>
                                        <div class="hasApply-tips-text">很遗憾您申请失败</div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="hasApply-tips">
                                    <div class="hasApply-tips-main">
                                        <div class="hasApply-tips-icon">
                                            <i class="icon iconfont icon-zantong24"></i>
                                        </div>
                                        <div class="hasApply-tips-text">恭喜您成为此任务负责人</div>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </template>
                    <template v-else>
                        <div class="but-oper" @click="findSubmitApply">申请参与任务</div>
                    </template>
                </template>
            </div>
            </div>
        </div>
    </div>
</template>
  
<script lang='ts' setup>
    import { ref, onMounted } from 'vue';
    import { aeUseStore } from '@/stores/user';
    import { applyAdd, daosTasksGet } from '@/api/dao';
    import { showPopup } from '@/utils/usePopup';
    import { extractIdFromUrl, getItem, setItem } from '@/utils/index';
    import Statistic from '@/components/statisticModule/statistic.vue';
    import DisplayArea from '@/components/displayArea/index.vue';
    import persHeader from '@/components/header/persHeader.vue';
    import arrow from '@/assets/images/task/arrow.png';
    import { getDominantColorRGBA } from '@/utils/getDominantColor';

    const userStore = aeUseStore();
    const userInfo = userStore.getUserInfo;
    const subTaskType = ref(0); // 1 Dao子列表页面进入Dao详情 2 待支付进去Dao详情

    // 定义一个类型别名，表示 content 可能的类型
    type Content = string | any[]; // any[] 表示数组，其元素可以是任意类型
    // 定义一个接口来描述数组中的对象结构
    interface ProDataItem {
        name: string;
        icon: string;
        tips: string;
        content: Content; // 使用上面定义的类型别名
    }
    const proData = ref<ProDataItem[]>([]); // 任务详情数

    const details = ref({
        cover: '',  //	String	必传	封面
        name: '',  //	String	必传	名称
        industry: '',  //	String	必传	行业
        passRate: '',  //	String	必传	投票通过率
        votePeriod: 0,  //	int	必传	投票周期
        description: '',  //	String	必传	宣言
        target: '',  //	String	必传	目标
        isAgreeContract: 1,  //	byte	必传	同意1
        poundage: '',
        amount: '',
        qrcode: '',
        orderNo: '',
        missionId: '',
        hasAdminUser: 0,
        createUserId: '',
        createTime: '',
        applyAvatars: [],
        appleNum: '',
        progress: '',
        hasApply:  null as number | null,
        competencyRequirement: '',
        missionCreateUserUuid: '',
        missionCreateUserAvatar: '',
        taskCreateUserUuid: '',
        taskCreateUserAvatar: '',
        taskAdminUserUuid: '',
        taskAdminUserAvatar: '',
    });
    console.log('details', details);

    /** 子任务详情 **/
    const findDaosTasksGetFun = async () => {
        const currentUrl = window.location.href; // 获取当前页面的 URL
        let id = extractIdFromUrl(currentUrl)+'';
        
        // 用于判断从哪进入的类型，1 正常流程进入子任务详情 2 待支付进去子任务详情
        let types = 0;
        if(userInfo.subTaskType !== '') {
            types = userInfo.subTaskType;
        } else {
            types = getItem('subTaskType');
        }
        subTaskType.value = types;
        let reqData = {
            id: id,
            type: types
        }
        return new Promise<void>((resolve, reject) => {
            daosTasksGet(reqData).then((response: any) => {
                const { code, data, message } = response;
                
                const resultData = data;
                if (code !== 200) {
                showPopup(message, 'error', 3000);
                    return;
                }
                resultData.goldCoin  = Number(resultData.amount) + Number(resultData.reward);
                details.value  = resultData;

                proData.value = [
                {
                    name: '任务描述',
                    icon: 'icon-gexingmingyan24',
                    tips: details.value.description,
                    content: details.value.description
                },
                {
                    name: '能力要求',
                    icon: 'icon-gongzuojingyan24',
                    tips: details.value.competencyRequirement,
                    content: details.value.competencyRequirement
                }
                ]
                extractColor(details.value.cover);
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    };
    
    // 申请任务
    const findSubmitApply = () => {
    let reqData = {
        id: details.value.taskId,
        missionId: details.value.missionId
    }
    return new Promise<void>((resolve, reject) => {
        applyAdd(reqData).then((response: any) => {
            const { code, message } = response;
            
            if (code !== 200) {
            showPopup(message, 'error', 3000);
                return;
            }
            findDaosTasksGetFun();
            showPopup('您已申请成功，请等待审核！', 'success', 3000);
            resolve()
        }).catch((error: any) => {
            reject(error)
        })
    })
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
        dominantColor.value = await getDominantColorRGBA(url, 0.18);
        changeBackgroundColor(dominantColor.value);
        console.log('Dominant Color:', dominantColor.value);
      } catch (error) {
        console.error('Error extracting dominant color:', error);
      }
    };

    onMounted(() => {
    findDaosTasksGetFun();
    });
</script>

<style lang='scss' scoped>
    :root {
        --common-bg-color: rgba(0, 0, 0, .05);
    }
    .taskDetails{
        width: 100%;
        height: calc(100% - 11px);
        .taskDetails-container{
            width: 100%;
            height: 100%;
            .taskDetails-content{
            height: calc(100% - 106px);
            overflow-y: auto;
            scrollbar-width: none;
            &::-webkit-scrollbar {
                display: none;
            }
            .taskDetails-container-body{
                width: calc(100% - 90px);
                height: 320px;
                padding: 34px 30px 26px 38px;
                border-radius: 28px;
                margin-left: 20px;
                margin-bottom: 32px;
                overflow: hidden;
                background-color: var(--common-bg-color);
                backdrop-filter: blur(24px);
                box-shadow: 18px 18px 28px 18px rgb(0, 0, 0, .05);
                border: 1px solid rgb(255, 255, 255, .38);
                .body-main{
                    width: 100%;
                    height: 100%;
                    .body-main-info{
                        width: 100%;
                        height: auto;
                        .body-main-info-content{
                            width: 100%;
                            height: auto;
                            display: flex;
                            .info-content-cover{
                                width: 254px;
                                height: auto;
                                .info-content-cover-img{
                                    width: 254px;
                                    height: 292px;
                                    border-radius: 20px;
                                    overflow: hidden;
                                    box-shadow: 6px 0px 14px 0px rgb(0, 0, 0, .15);
                                }
                                .info-content-cover-text{
                                    width: 100%;
                                    height: auto;
                                    font-weight: 400;
                                    font-size: 20px;
                                    color: #FFFFFF;
                                    line-height: 1;
                                    text-align: center;
                                    margin-top: 17px;
                                    span{
                                        display: inline-block;
                                        :deep(.el-statistic){
                                            font-size: 14px;
                                            margin-left: 5px;
                                            display: inline-block;
                                            .el-statistic__content{
                                                .el-statistic__number{
                                                    font-weight: 400;
                                                    font-size: 24px;
                                                    color: rgba(255, 255, 255, 1);
                                                    line-height: 1;
                                                    text-align: left;
                                                    font-style: normal;
                                                    text-transform: none;
                                                }
                                                .el-statistic__suffix{
                                                    color: rgba(255, 255, 255, 1);
                                                    span{
                                                        font-size: 24px;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            .body-main-info-users{
                                flex-grow: 1;
                                width: 0;
                                height: auto;
                                margin: 0 40px;
                                .user-id{
                                    font-weight: 400;
                                    font-size: 14px;
                                    color: rgb(255, 255, 255, .7);
                                    line-height: 1;
                                    text-align: left;
                                }
                                .info-users-time{
                                    font-weight: 400;
                                    font-size: 20px;
                                    color: rgb(255, 255, 255, .7);
                                    line-height: 1;
                                    text-align: left;
                                }
                                .info-users-initiator{
                                    width: 100%;
                                    height: auto;
                                    margin-top: 14px;
                                    .info-users-initiator-name{
                                        font-weight: 400;
                                        font-size: 22px;
                                        color: #FFFFFF;
                                        line-height: 1;
                                        text-align: left;
                                    }
                                }
                                .info-users-list{
                                    width: 100%;
                                    height: auto;
                                    margin-top: 20px;
                                    .list-info{
                                        width: 100%;
                                        height: auto;
                                        .list-info-name{
                                            width: 100%;
                                            height: auto;
                                            display: flex;
                                            justify-content: flex-start;
                                            .list-info-name-text{
                                                font-weight: 400;
                                                font-size: 18px;
                                                color: rgb(255, 255, 255, .7);
                                                line-height: 65px;
                                                text-align: left;
                                                white-space: nowrap;
                                            }
                                            .list-info-name-img{
                                                width: 65px;
                                                height: 65px;
                                                background: url(@/assets/images/task/avatar_bg.png) no-repeat center center;
                                                background-size: 100% 100%;
                                                :deep(.el-image) {
                                                    width: 46px;
                                                    height: 46px;
                                                    border-radius: 50%;
                                                    display: block;
                                                    margin: 10px auto;
                                                }
                                            }
                                            .avatars{
                                                width: 100%;
                                                height: auto;
                                                .list-info-name-img-list{
                                                overflow: hidden;
                                                clear: both;
                                                display: table;
                                                .list-info-name-img-list-item{
                                                    width: 65px;
                                                    height: 65px;
                                                    float: left;
                                                    border-radius: 50%;
                                                    overflow: hidden;
                                                    margin-left: -5px;
                                                    background: url(@/assets/images/task/avatar_bg.png) no-repeat center center;
                                                    background-size: 100% 100%;
                                                    &:first-child{
                                                        margin-left: 0;
                                                    }
                                                    :deep(.el-image) {
                                                    width: 46px;
                                                    height: 46px;
                                                    display: block;
                                                    border-radius: 50%;
                                                    margin: 9.5px auto;
                                                    }
                                                    img{
                                                    width: 46px;
                                                    height: 46px;
                                                    border-radius: 50%;
                                                    display: block;
                                                    }
                                                    p{
                                                        width: 100%;
                                                        font-weight: 600;
                                                        font-size: 14px;
                                                        color: #FFFFFF;
                                                        line-height: 65px;
                                                        text-align: center;
                                                        font-style: normal;
                                                        text-transform: none;
                                                    }
                                                }
                                                }
                                            }
                                        }
                                    }
                                    .toBePaid{
                                        width: 16px;
                                        height: auto;
                                        .toBePaid-amount{
                                            width: 100%;
                                            height: auto;
                                            display: flex;
                                            justify-content: flex-start;
                                            .toBePaid-amount-icon{
                                                width: 24px;
                                                flex-shrink: 0;
                                                margin-right: 10px;
                                                i{
                                                    font-size: 24px;
                                                    color: #FFFFFF;
                                                    line-height: 1;
                                                }
                                            }
                                            .toBePaid-amount-text{
                                                flex: 1;
                                                width: 0;
                                                font-weight: 400;
                                                font-size: 18px;
                                                color: #FFFFFF;
                                                line-height: 1;
                                                text-align: left;
                                                span{
                                                    font-size: 20px;
                                                    line-height: 1;
                                                }
                                            }
                                        }
                                        .toBePaid-time{
                                            width: 100%;
                                            height: auto;
                                            display: flex;
                                            justify-content: flex-start;
                                            span{
                                                font-weight: 400;
                                                font-size: 16px;
                                                color: rgb(255, 255, 255, .7);
                                                line-height: 56px;
                                                text-align: left;
                                            }
                                        }
                                    }
                                }
                                .info-users-turnover{
                                    width: 100%;
                                    height: auto;
                                    margin-top: 20px;
                                    .turnover-main{
                                        width: 100%;
                                        height: auto;
                                        display: flex;
                                        .turnover-main-one{
                                            flex-grow: 1;
                                            overflow: hidden;
                                            word-break: break-all;
                                        }
                                        .turnover-main-two{
                                            width: 21px;
                                            height: 16px;
                                            flex-shrink: 0;
                                            margin: 20px 10px 0 10px;
                                            img{
                                            width: 100%;
                                            height: 100%;
                                            display: block;
                                            }
                                        }
                                        .turnover-main-three{
                                            flex-grow: 1;
                                            overflow: hidden;
                                            word-break: break-all;
                                        }
                                        .turnover-main-four{
                                            width: 21px;
                                            height: 16px;
                                            flex-shrink: 0;
                                            margin: 20px 10px 0 10px;
                                            img{
                                            width: 100%;
                                            height: 100%;
                                            display: block;
                                            }
                                        }
                                        .turnover-main-five{
                                            flex-grow: 1;
                                            overflow: hidden;
                                            word-break: break-all;
                                        }
                                        .info-users-list{
                                            margin-top: 0;
                                            .list-info{
                                                width: 100%;
                                                height: auto;
                                                
                                                .list-info-name{
                                                    width: 100%;
                                                    height: auto;
                                                    display: flex;
                                                    justify-content: flex-start;
                                                    .list-info-name-text{
                                                        font-weight: 400;
                                                        font-size: 14px;
                                                        color: rgb(255, 255, 255, .7);
                                                        line-height: 49px;
                                                        text-align: left;
                                                        white-space: nowrap;
                                                    }
                                                    .list-info-name-img{
                                                        width: 49px;
                                                        height: 49px;
                                                        background: url(@/assets/images/task/avatar_bg.png) no-repeat center center;
                                                        background-size: 100% 100%;
                                                        :deep(.el-image) {
                                                        width: 32px;
                                                        height: 32px;
                                                        display: block;
                                                        margin: 8.5px auto;
                                                        }
                                                    }
                                                    .list-info-name-img-list{
                                                        overflow: hidden;
                                                        clear: both;
                                                        display: table;
                                                        margin: 21px auto 0 auto;
                                                        .list-info-name-img-list-item{
                                                            width: 40px;
                                                            height: 40px;
                                                            float: left;
                                                            border-radius: 50%;
                                                            overflow: hidden;
                                                            background: url(@/assets/images/task/avatar_bg.png) no-repeat center center;
                                                            background-size: 100% 100%;
                                                            &:first-child{
                                                                margin-left: 0;
                                                            }
                                                            img{
                                                                width: 100%;
                                                                height: 100%;
                                                                display: block;
                                                            }
                                                            p{
                                                                width: 100%;
                                                                font-weight: 600;
                                                                font-size: 14px;
                                                                color: #FFFFFF;
                                                                line-height: 40px;
                                                                text-align: center;
                                                                font-style: normal;
                                                                text-transform: none;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            .toBePaid{
                                                width: 16px;
                                                height: auto;
                                                .toBePaid-amount{
                                                    width: 100%;
                                                    height: auto;
                                                    display: flex;
                                                    justify-content: flex-start;
                                                    .toBePaid-amount-icon{
                                                        width: 24px;
                                                        flex-shrink: 0;
                                                        margin-right: 10px;
                                                        i{
                                                            font-size: 24px;
                                                            color: #FFFFFF;
                                                            line-height: 1;
                                                        }
                                                    }
                                                    .toBePaid-amount-text{
                                                        flex: 1;
                                                        width: 0;
                                                        font-weight: 400;
                                                        font-size: 18px;
                                                        color: #FFFFFF;
                                                        line-height: 1;
                                                        text-align: left;
                                                        span{
                                                            font-size: 20px;
                                                            line-height: 1;
                                                        }
                                                    }
                                                }
                                                .toBePaid-time{
                                                    width: 100%;
                                                    height: auto;
                                                    display: flex;
                                                    justify-content: flex-start;
                                                    span{
                                                        font-weight: 400;
                                                        font-size: 16px;
                                                        color: rgb(255, 255, 255, .7);
                                                        line-height: 56px;
                                                        text-align: left;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                .team-name{
                                    font-weight: 400;
                                    font-size: 16px;
                                    color: #FFFFFF;
                                    line-height: 1;
                                    text-align: left;
                                    margin-top: 24px;
                                }
                                .team-industry{
                                    font-weight: 400;
                                    font-size: 24px;
                                    color: #FFFFFF;
                                    line-height: 1;
                                    text-align: left;
                                    margin-top: 23px;
                                }
                            }
                            .body-main-info-datas{
                                width: 312px;
                                height: 100%;
                                .datas-item{
                                    width: 100%;
                                    height: auto;
                                    display: flex;
                                    margin-top: 10px;
                                    justify-content: flex-start;
                                    &:first-child{
                                        margin-top: 0;
                                    }
                                    .datas-item-icon{
                                        width: 57px;
                                        height: 58px;
                                        flex-shrink: 0;
                                        background: url(@/assets/images/task/icon_bg.png) no-repeat center center;
                                        background-size: 100% 100%;
                                        i{
                                            font-size: 24px;
                                            line-height: 1;
                                            display: block;
                                            padding: 14px 0 0 14px;
                                            color: rgb(255, 255, 255, .7);
                                        }
                                    }
                                    .datas-item-progress{
                                        flex: 1;
                                        width: 0;
                                        position: relative;
                                        .progress-text{
                                            font-weight: 400;
                                            font-size: 16px;
                                            color: rgb(255, 255, 255, .7);
                                            line-height: 1;
                                            text-align: left;
                                            display: inline-block;
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                        }
                                        .progress-bar{
                                            width: 100%;
                                            margin-top: 10px;
                                            .progress-bar-display{
                                                width: 100%;
                                                height: auto;
                                                display: flex;
                                                justify-content: space-between;
                                                .link-l{
                                                    flex-grow: 1;
                                                    height: 1px;
                                                    margin-top: 12px;
                                                    position: relative;
                                                    background-color: rgb(255, 255, 255, .38);
                                                    &::before{
                                                        content: '';  // 必须设置 content 属性
                                                        display: inline-block;
                                                        width: 7px;
                                                        height: 7px;
                                                        border-radius: 50%;
                                                        background-color: rgba(255, 255, 255, 1);
                                                        vertical-align: middle;
                                                        position: absolute;
                                                        top: 50%;
                                                        transform: translateY(-50%);
                                                        left: 0;
                                                        z-index: 2;
                                                    }
                                                }
                                                .link-c{
                                                    width: 60px;
                                                    height: 24px;
                                                    font-weight: 400;
                                                    font-size: 16px;
                                                    color: #FFFFFF;
                                                    line-height: 26px;
                                                    text-align: center;
                                                    border-radius: 4px;
                                                    border: 1px solid rgb(255, 255, 255, .38);
                                                }
                                                .link-r{
                                                    flex-grow: 1;
                                                    height: 1px;
                                                    margin-top: 12px;
                                                    position: relative;
                                                    background-color: rgb(255, 255, 255, .38);
                                                    &::before{
                                                        content: '';  // 必须设置 content 属性
                                                        display: inline-block;
                                                        width: 7px;
                                                        height: 7px;
                                                        border-radius: 50%;
                                                        background-color: rgba(255, 255, 255, 1);
                                                        vertical-align: middle;
                                                        position: absolute;
                                                        top: 50%;
                                                        transform: translateY(-50%);
                                                        right: 0;
                                                        z-index: 2;
                                                    }
                                                }
                                            }
                                        }
                                        .progress-name{
                                            font-weight: 400;
                                            font-size: 14px;
                                            color: rgb(255, 255, 255, .7);
                                            line-height: 1;
                                            text-align: right;
                                            margin-top: 6px;
                                        }
                                    }
                                }
                                
                            }
                        }
                    }
                }
            }
            }
            .tab-content{
                width: 100%;
                height: auto;
                position: relative;
                .but-oper{
                    width: 168px;
                    height: 83px;
                    cursor: pointer;
                    font-weight: 400;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 83px;
                    text-align: center;
                    position: absolute;
                    right: 40px;
                    bottom: 28px;
                    background: url(@/assets/images/task/but_bg.png) no-repeat center center;
                    background-size: 100% 100%;
                    &:hover{
                        background: url(@/assets/images/task/but_bg_hover.png) no-repeat center center;
                        background-size: 100% 100%;
                    }
                }
                .hasApply-tips{
                    width: auto;
                    height: 38px;
                    position: absolute;
                    right: 40px;
                    bottom: 28px;
                    .hasApply-tips-main{
                        width: 100%;
                        height: auto;
                        display: flex;
                        justify-content: flex-start;
                        .hasApply-tips-icon{
                            width: 57px;
                            height: 58px;
                            margin-top: -7px;
                            z-index: 9;
                            background: url(@/assets/images/task/icon_bg.png) no-repeat center center;
                            background-size: 100% 100%;
                            i{
                                width: 27px;
                                height: 27px;
                                display: block;
                                margin: 15px auto;
                            }
                        }
                        .hasApply-tips-text{
                            width: auto;
                            height: 38px;
                            z-index: 8;
                            font-weight: 400;
                            font-size: 16px;
                            color: #FFFFFF;
                            line-height: 38px;
                            text-align: left;
                            margin-left: -51px;
                            border-radius: 19px;
                            padding: 0 20px 0 60px;
                            background: rgb(93, 83, 78, .5);
                        }
                    }
                }
            }
        }
    }
</style>
