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
                                      <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
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
                        
                    </div>
              </div>
          </div>
        </div>
        <div>
          <DisplayArea :tabData="proData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
    import { ref, onMounted } from 'vue';
    import { showPopup } from '@/utils/usePopup';
    import { extractIdFromUrl, getItem } from '@/utils/index';

    import { aeUseStore } from '@/stores/user';
    import { getDaoDetails } from '@/api/dao';
    import persHeader from '@/components/header/persHeader.vue';
    import DisplayArea from '@/components/displayArea/index.vue';
    import ScaleProgressBar from '@/components/progress/scaleProgressBar.vue';
    import arrow from '@/assets/images/task/arrow.png';
    import { getDominantColorRGBA } from '@/utils/getDominantColor';

    const userStore = aeUseStore();
    const userInfo = userStore.getUserInfo;
    const daoType = ref(0); // 1 Dao子列表页面进入Dao详情 2 待支付进去Dao详情

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
        type: userInfo.daoType
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

            proData.value = [
                {
                    name: '团队目标',
                    icon: 'icon-renwumubiao24',
                    tips: details.value.target,
                    content: details.value.target
                },
                {
                    name: '团队宣言',
                    icon: 'icon-xuanyan24',
                    tips: details.value.description,
                    content: details.value.description
                }
            ]
            extractColor(details.value.cover);
            resolve()
        }).catch((error: any) => {
            reject(error)
        })
        })
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
    :root {
        --common-bg-color: rgba(0, 0, 0, .05);
    }
    .teamDetails{
        width: 100%;
        height: calc(100% - 11px);
        .teamDetails-container{
        width: 100%;
        height: 100%;
        .teamDetails-content{
            height: calc(100% - 106px);
            overflow-y: auto;
            scrollbar-width: none;
            &::-webkit-scrollbar {
            display: none;
            }
            .teamDetails-container-body{
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
                    display: flex;
                    .body-main-info{
                        flex: 1;
                        width: 0;
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
                                width: 275px;
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
                                                    display: block;
                                                    border-radius: 50%;
                                                    margin: 9.5px auto;
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
                                    .turnover-main-l{
                                        flex-grow: 1;
                                        overflow: hidden;
                                        word-break: break-all;
                                    }
                                    .turnover-main-c{
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
                                    .turnover-main-r{
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
                                font-size: 16px;
                                color: #FFFFFF;
                                line-height: 1;
                                text-align: left;
                                margin-top: 15px;
                                }
                            }
                            .body-main-info-datas{
                                flex: 1;
                                width: 0;
                                height: 100%;
                                .datas-item{
                                    width: 100%;
                                    height: auto;
                                    display: flex;
                                    margin-top: 30px;
                                    justify-content: flex-start;
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
                                .avatars{
                                width: 100%;
                                height: auto;
                                .list-info-name-img-list{
                                    overflow: hidden;
                                    clear: both;
                                    display: table;
                                    margin: 21px auto 0 auto;
                                    .list-info-name-img-list-item{
                                        width: 82px;
                                        height: 82px;
                                        float: left;
                                        border-radius: 50%;
                                        overflow: hidden;
                                        background: url(@/assets/images/task/avatar_bg.png) no-repeat center center;
                                        background-size: 100% 100%;
                                        &:first-child{
                                        margin-left: 0;
                                        }
                                        :deep(.el-image) {
                                            width: 60px;
                                            height: 60px;
                                            border-radius: 50%;
                                            display: block;
                                            margin: 11px auto;
                                        }
                                        img{
                                            width: 60px;
                                            height: 60px;
                                            display: block;
                                            border-radius: 50%;
                                        }
                                        p{
                                        width: 100%;
                                        font-weight: 600;
                                        font-size: 14px;
                                        color: #FFFFFF;
                                        line-height: 82px;
                                        text-align: center;
                                        font-style: normal;
                                        text-transform: none;
                                        }
                                    }
                                }
                                }
                            }
                        }
                    }
                    .body-main-operation{
                        width: 130px;
                        flex-shrink: 0;
                        .operation-item{
                            width: 100%;
                        }
                    }
                }
            }
        }
        }
    }
</style>
