<template>
    <div class="center-l-main">
        <div class="userActivity">
            <div class="module-title">
                <div class="module-title-main">
                    <div class="module-title-main-l">
                        <div class="module-title-main-l-img">
                            <i class="icon font_family icon-woderenwu24-2"></i>
                        </div>
                        <div class="module-title-main-l-name">Ta的任务</div>
                    </div>
                    <div class="module-title-main-r">
                        <router-link :to='{ name: myTask}'>
                            <p>查看更多</p>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="module-content">
                <div class="works">
                    <div class="grid-demo" :style="missions.length < 3 ? { 'justifyContent': 'flex-start' } : { 'justifyContent': 'space-between' }">
                        <div v-for="item in missions" :key="item.id"  class="works-item">
                            <div class="works-item-main">
                                <div class="works-bg">
                                    <img :src="item.cover" alt="" />
                                </div>
                                <div class="works-content">
                                    <div class="works-content-main">
                                        <div class="works-content-main-t">
                                            <div class="works-content-main-t-main">
                                                <div class="works-name" :title="item.name">{{ item.name }}</div>
                                                <div class="works-more">
                                                    <i class="icon font_family icon-lianjie241"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="works-content-main-b">
                                            <div class="works-content-main-b-main">
                                                <div class="itme-area">
                                                    <div class="itme-area-title">项目报酬(元)</div>
                                                    <p>
                                                        <span><Statistic :NumberData="Number(item.reward)" :amortized= 2 /></span>
                                                    </p>
                                                </div>
                                                <div class="itme-area textR">
                                                    <div class="itme-area-title">参与人数(人)</div>
                                                    <p class="area-r">
                                                        <span><Statistic :NumberData="Number(item.member)" /></span>
                                                    </p>
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
        <div class="userActivity">
            <div class="module-title">
                <div class="module-title-main">
                    <div class="module-title-main-l">
                        <div class="module-title-main-l-img">
                            <i class="icon font_family icon-woderenwu24-2"></i>
                        </div>
                        <div class="module-title-main-l-name">Ta的活动</div>
                    </div>
                    <div class="module-title-main-r">
                        <router-link :to='{ name: activitiesToJoin}'>
                            <p>查看更多</p>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="module-content">
                <div class="works">
                    <div class="grid-demo" :style="activities.length < 3 ? { 'justifyContent': 'flex-start' } : { 'justifyContent': 'space-between' }">
                        <div v-for="item in activities" :key="item.id"  class="works-item">
                            <div class="works-item-main">
                                <div class="works-bg">
                                    <img :src="item.cover" alt="" />
                                </div>
                                <div class="works-content">
                                    <div class="works-content-main">
                                        <div class="works-content-main-t">
                                            <div class="works-content-main-t-main">
                                                <div class="works-name" :title="item.name">{{ item.name }}</div>
                                                <div class="works-more">
                                                    <i class="icon font_family icon-lianjie241"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="works-content-main-b">
                                            <div class="item-content-flex">
                                                <div class="item-content-participant">
                                                <div class="item-content-participant-num">
                                                    <template v-if="item.member < 1">
                                                    暂无人接收任务
                                                    </template>
                                                    <template v-else>
                                                    <template v-if="item.status === 0">
                                                        <em>{{ item.member }}</em>人已申请任务
                                                    </template>
                                                    <template v-else>
                                                        <em>{{ item.member }}</em>人参与任务
                                                    </template>
                                                    </template>
                                                    
                                                </div>
                                                <div class="item-content-participant-user">
                                                    <div
                                                    class="user-list"
                                                    v-for="(user, index) in item.avatars.slice(0, 3)"
                                                    :key="index"
                                                    >
                                                    <img :src="user" alt="" />
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
            </div>
        </div>
        <div class="userActivity">
            <div class="module-title">
                <div class="module-title-main">
                    <div class="module-title-main-l">
                        <div class="module-title-main-l-img">
                            <i class="icon font_family icon-woderenwu24-2"></i>
                        </div>
                        <div class="module-title-main-l-name">Ta的作品</div>
                    </div>
                    <div class="module-title-main-r">
                        <router-link :to='{ name: personalWorks}'>
                            <p>查看更多</p>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="module-content">
                <div class="works other">
                    <div class="grid-demo" :style="works.length < 3 ? { 'justifyContent': 'flex-start' } : { 'justifyContent': 'space-between;', 'flex-wrap': 'wrap;' }">
                        <div v-for="item in works" :key="item.id"  class="works-item">
                            <div class="works-item-main">
                                <div class="works-bg">
                                    <img :src="item.cover" alt="" />
                                </div>
                                <div class="works-content">
                                    <div class="works-content-main">
                                        <div class="works-content-main-b">
                                            <div class="works-content-main-b-main">
                                                <div class="itme-area">
                                                    <div class="item-area-data">
                                                        <i class="icon font_family icon-yingxiangli24"></i>
                                                        <span><Statistic :NumberData="Number(item.followNum)" :amortized= 2 /></span>
                                                    </div>
                                                </div>
                                                <div class="itme-area">
                                                    <div class="item-area-data">
                                                        <i class="icon font_family icon-lishiguanzhu24"></i>
                                                        <span><Statistic :NumberData="Number(item.followNum)" :amortized= 2 /></span>
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
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch, defineProps } from 'vue';
import { aeUseStore } from '@/stores/user';
import Statistic from '@/components/statisticModule/statistic.vue';

export default defineComponent({
  components: {
    Statistic
  },
  props: {
    missions: {
      type: Array as () => any[],
      required: true
    },
    works: {
      type: Array as () => any[],
      required: true
    },
    activities: {
      type: Array as () => any[],
      required: true
    }
  },
  setup(props) {
    const userStore = aeUseStore();
    const userInfo = userStore.getUserInfo;
    const userId = ref<string>(''); // 查看他人的用户id

    // 如果没有他人id，则取登录人id
    if (userInfo.othersId !== '') {
      userId.value = userInfo.othersId;
    } else {
      userId.value = userInfo.id;
    }

    const missions = ref<any[]>(props.missions);
    const works = ref<any[]>(props.works);
    const activities = ref<any[]>(props.activities);
        
    const myTask = ref('MyTask');
    const personalWorks = ref('PersonalWorks');
    const activitiesToJoin = ref('ActivitiesToJoin');

    // 监听 props 变化
    watch(() => props.missions, (newVal, oldVal) => {
      console.log('Missions updated:', newVal);
      missions.value = newVal;
    });

    watch(() => props.works, (newVal, oldVal) => {
      console.log('Works updated:', newVal);
      works.value = newVal;
    });

    watch(() => props.activities, (newVal, oldVal) => {
      console.log('Activities updated:', newVal);
      activities.value = newVal;
    });

    onMounted(() => {
      // 初始化逻辑
    });

    onBeforeUnmount(() => {
      // 清理逻辑
    });

    return {
      userId,
      missions,
      works,
      myTask,
      activities,
      personalWorks,
      activitiesToJoin
    };
  }
});
</script>

<style lang='scss' scoped>
    @use '@/assets/styles/personalCenter.scss';
    .m-t-no{
        margin-top: 0 !important;
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
    .item-area-data{
        width: 100%;
        display: flex;
        justify-content: flex-start;
        i{
            font-size: 24px;
            color: rgb(255, 255, 255, .7);
        }
        span{
            padding-left: 10px;
            :deep(.el-statistic){
                font-size: 14px;
                .el-statistic__content{
                    .el-statistic__number{
                        font-weight: 400;
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.8);
                        line-height: 1;
                        text-align: left;
                        font-style: normal;
                        text-transform: none;
                    }
                    .el-statistic__suffix{
                        color: rgba(255, 255, 255, 0.8);
                        span{
                            font-size: 14px;
                        }
                    }
                }
            }
        }
    }
    .margin-bottom-30{
        margin-bottom: 30px;
    }
    .other{
        .works-item{
            margin-bottom: 20px;
        }
    }
</style>

