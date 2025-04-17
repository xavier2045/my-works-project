<template>
    <div class="center-l-main">
        <div class="userActivity">
            <div class="module-title">
                <div class="module-title-main">
                    <div class="module-title-main-l">
                        <div class="module-title-main-l-img">
                            <i class="icon font_family icon-wodedongtai24"></i>
                        </div>
                        <div class="module-title-main-l-name">我的动态</div>
                    </div>
                    <div class="module-title-main-r">
                        <!-- <router-link to='/'>
                            <p>查看更多</p>
                        </router-link> -->
                    </div>
                </div>
            </div>
            <div class="module-content">
                <div class="works">
                    <div class="grid-demo">
                        <div 
                            v-for="item in moments" 
                            :key="item.id"  
                            class="works-item"
                            @click="goToDetail(item)"
                        >
                            <div class="works-item-main">
                                <div class="works-bg">
                                    <img :src="item.cover" alt="" />
                                </div>
                                <div class="works-type">
                                    <template v-if="item.type == 1">
                                            <i class="icon font_family icon-fabuxuqiu34"></i>
                                    </template>
                                    <template v-if="item.type == 2">
                                            <i class="icon font_family icon-fabuzuopin34"></i>
                                    </template>
                                    <template v-if="item.type == 3">
                                            <i class="icon font_family icon-fabuhuodong34"></i>
                                    </template>
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
                                            <!-- type: 1作品，2活动，3任务 -->
                                            <template v-if="item.type == 1">
                                                <div class="works-content-main-b-main">
                                                    <div class="itme-area">
                                                        <div class="itme-area-title">项目报酬(元)</div>
                                                        <p>
                                                            <span><Statistic :NumberData="Number(item.reward)" /></span>
                                                        </p>
                                                    </div>
                                                    <div class="itme-area textR">
                                                        <div class="itme-area-title">参与人数(人)</div>
                                                        <p class="area-r">
                                                            <span><Statistic :NumberData="Number(item.member)" /></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </template>
                                            <template v-else-if="item.type == 2">
                                                <template v-if="item.isCommercial == 0">
                                                    <div class="works-content-main-b-main">
                                                        <div class="itme-area">
                                                            <div class="itme-area-title">作品类型</div>
                                                            <p>
                                                                <span>普通类</span>
                                                            </p>
                                                        </div>
                                                        <div class="itme-area textR">
                                                            <div class="itme-area-title">观看次数(次)</div>
                                                            <p class="area-r">
                                                                <span><Statistic :NumberData="Number(item.member)" /></span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </template>
                                                <template v-else-if="item.isCommercial == 1">
                                                    <div class="works-content-main-b-main">
                                                        <div class="itme-area">
                                                            <div class="itme-area-title">作品类型</div>
                                                            <p>
                                                                <span>商业类</span>
                                                            </p>
                                                        </div>
                                                        <div class="itme-area textR">
                                                            <div class="itme-area-title">销售总额(元)</div>
                                                            <p class="area-r">
                                                                <span><Statistic :NumberData="Number(item.reward)" /></span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </template>
                                            </template>
                                            <template v-else>
                                                <div class="works-content-main-b-main">
                                                    <div class="itme-area">
                                                        <div class="itme-area-title">门票数量(张)</div>
                                                        <p>
                                                            <span><Statistic :NumberData="Number(item.time)" /></span>
                                                        </p>
                                                    </div>
                                                    <div class="itme-area textR">
                                                        <div class="itme-area-title">影响力</div>
                                                        <p class="area-r">
                                                            <span><Statistic :NumberData="Number(item.follow)" /></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        </div>
        <div class="influence">
            <div class="module-title">
                <div class="module-title-main">
                    <div class="module-title-main-l">
                        <div class="module-title-main-l-img">
                            <i class="icon font_family icon-yingxiangli24"></i>
                        </div>
                        <div class="module-title-main-l-name">影响力</div>
                    </div>
                    <div class="module-title-main-r">
                        <!-- <router-link to='/'>
                            <p>查看更多</p>
                        </router-link> -->
                    </div>
                </div>
            </div>
            <div class="module-content">
                <div class="influence-content">
                    <div class="influence-content-l" @click="scrollLeft">
                        <i class="icon font_family icon-sanjiaoxingxiangzuo20yue"></i>
                    </div>
                    <div class="influence-content-c">
                        <div class="scroll-containers">
                            <div class="influence-content-c-main" ref="scrollContainer">
                                <div 
                                    class="cn-item"
                                    v-for="items in influences"
                                    :key="items.id"
                                >
                                    <div class="cn-item-main">
                                        <div class="cn-item-main-avatar">
                                            <div class="cn-item-pic">
                                                <img :src="items.avatar" alt="" />
                                            </div>
                                            <div class="cn-item-type">{{ Number(items.type) === 1 ? '个人' : '自组织' }}</div>
                                        </div>
                                        <div class="cn-item-name">{{ items.name }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="influence-content-r" @click="scrollRight">
                        <i class="icon font_family icon-sanjiaoxingxiangyou20yue"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="historicalAttention">
            <div class="module-title">
                <div class="module-title-main">
                    <div class="module-title-main-l">
                        <div class="module-title-main-l-img">
                            <i class="icon font_family icon-jingxuantuijian24"></i>
                        </div>
                        <div class="module-title-main-l-name">精选推荐</div>
                    </div>
                    <div class="module-title-main-r">
                        <router-link to='/personalHomepage/topPicks'>
                            <p>查看更多</p>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="module-content slider-container">
                <div
                    class="slider"
                    style="--width: 180px;
                    --height: 160px;
                    --quantity: 9;
                    --speed: 90s;"
                >
                    <div class="list">
                        <div 
                            v-for="(item, index) in suggests" 
                            :key="item.id" 
                            class="item" 
                            :style="`--position: ${index + 1}`"
                        >
                            <div
                                class="card"
                                :style="`background: linear-gradient(to right, ${getGradientColors(index)})`"
                            >
                                <p>{{ item.name }}</p>
                                <p>{{ item.description ? item.description.substring(0, 20) + (item.description.length > 20 ? '...' : '') : '' }}</p>
                                <div class="card-image">
                                    <img :src="item.cover" alt="" />
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
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { aeUseStore } from '@/stores/user';
import { aeWorksStore } from '@/stores/works';
import { useRouter } from 'vue-router';
import { setItem } from '@/utils/index';
import Statistic from '@/components/statisticModule/statistic.vue';

export default defineComponent({
  components: {
    Statistic
  },
  props: {
    moments: {
      type: Array as () => any[],
      required: true
    },
    influences: {
      type: Array as () => any[],
      required: true
    },
    suggests: {
      type: Array as () => any[],
      required: true
    }
  },
  setup(props) {
    const userStore = aeUseStore();
    const userInfo = userStore.getUserInfo;
    const worksStore = aeWorksStore();
    const worksInfo = worksStore.getWorksInfo;
    const router = useRouter();
    const userId = ref<string>('');
    if (userInfo.othersId !== '') {
      userId.value = userInfo.othersId;
    } else {
      userId.value = userInfo.id;
    }

    const moments = ref<any[]>(props.moments);
    const influences = ref<any[]>(props.influences);
    const suggests = ref<any[]>(props.suggests);

    // 监听 props 变化
    watch(() => props.moments, (newVal) => {
      console.log('Moments updated:', newVal);
      moments.value = newVal;
    });

    watch(() => props.influences, (newVal) => {
      console.log('influences updated:', newVal);
      influences.value = newVal;
    });

    watch(() => props.suggests, (newVal) => {
      console.log('Suggests updated:', newVal);
      suggests.value = newVal;
    });

    const scrollContainer = ref<HTMLElement | null>(null);
    let itemWidthl = 0; // 每个item的宽度  108宽
    let itemWidthr = 0;

    const getItemWidth = (element: HTMLElement): number => {
      const style = window.getComputedStyle(element);
      const marginRight = parseFloat(style.getPropertyValue('margin-right'));
      return (element.clientWidth || 0) + marginRight * 2;
    };

    const scrollLeft = () => {
      if (scrollContainer.value) {
        const element = document.querySelector('.cn-item') as HTMLElement;
        itemWidthl = getItemWidth(element);
        if (scrollContainer.value.scrollLeft - itemWidthl > -3) {
          scrollContainer.value.scrollLeft -= itemWidthl;
        }
      }
    };

    const scrollRight = () => {
      if (scrollContainer.value) {
        const element = document.querySelector('.cn-item') as HTMLElement;
        itemWidthr = getItemWidth(element);
        scrollContainer.value.scrollLeft += itemWidthr;
      }
    };

    const goToDetail = (item: any) => {
      if(item.type === 1){
        let id = item.id;
        userInfo.taskType = 1;
        setItem('taskType', 1);
        router.push({ name: 'TataskDetails', params: { id } });
      } else if(item.type === 2){
        let id = item.id;
        userInfo.workType = 1;
        setItem('workType', 1);
        worksInfo.currentId = item.id;
        worksInfo.isRouterType = 2;
        router.push({ name: 'WorksDetails', params: { id } });
      } else if(item.type === 3){
      }
    };

    const getGradientColors = (index: number) => {
      // Even more desaturated, muted color palette
      const gradients = [
        '#1d4565, #122d42', // Very desaturated blue
        '#333850, #232538', // Very desaturated navy
        '#2a4555, #1a2c38'  // Very desaturated teal
      ];
      return gradients[index % gradients.length];
    };

    onMounted(() => {
      // 初始化逻辑
    });

    onBeforeUnmount(() => {
      // 清理逻辑
    });

    return {
      userId,
      moments,
      influences,
      suggests,
      worksInfo,
      scrollContainer,
      scrollLeft,
      scrollRight,
      goToDetail,
      getGradientColors
    };
  }
});
</script>
<style lang='scss' scoped>
    @use '@/assets/styles/personalCenter.scss';
    .m-t-no{
        margin-top: 0 !important;
    }

    /* Override and align section titles consistently */
    .center-l-main {
        .userActivity,
        .influence,
        .historicalAttention {
            padding: 0 50px 0 0 !important;
            margin-bottom: 20px;
        }
        
        .module-title {
            width: calc(100% - 23px);
            height: auto;
            margin-top: 11px;
            padding-left: 23px !important;
        }
        
        .module-content {
            padding: 23px 0 35px 23px !important;
        }
    }

    /* Container for the slider to maintain proper spacing */
    .slider-container {
        padding: 10px 0 35px 23px !important;
    }
    
    /* Slider styles */
    .slider {
        width: 100%;
        height: var(--height);
        overflow: hidden;
        mask-image: linear-gradient(to right, transparent, #000 15% 85%, transparent);
        -webkit-mask-image: linear-gradient(to right, transparent, #000 15% 85%, transparent);
        padding: 20px 0;
        margin: 0;
    }
    
    .slider .list {
        display: flex;
        width: 100%;
        min-width: calc(var(--width) * var(--quantity));
        position: relative;
    }
    
    .slider .list .item {
        width: var(--width);
        height: var(--height);
        position: absolute;
        left: 100%;
        animation: autoRun var(--speed) linear infinite;
        transition: all 0.5s ease;
        animation-delay: calc(
            (var(--speed) / var(--quantity)) * (var(--position) - 1) - var(--speed)
        ) !important;
        padding: 0 20px;
        box-sizing: border-box;
        will-change: transform, opacity;
    }
    
    @keyframes autoRun {
        0% {
            left: 100%;
        }
        100% {
            left: calc(var(--width) * -1);
        }
    }
    
    @keyframes reverseRun {
        0% {
            left: calc(var(--width) * -1);
        }
        100% {
            left: 100%;
        }
    }
    
    .slider[reverse="true"] .item {
        animation-name: reverseRun;
    }
    
    .slider:hover .item {
        animation-play-state: paused !important;
        opacity: 0.7;
    }
    
    .slider .item:hover {
        opacity: 1 !important;
        transform: scale(1.05);
        z-index: 10;
    }

    .card {
        width: 100%;
        height: 100%;
        padding: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        color: rgba(255, 255, 255, 0.85);
        text-align: center;
        display: flex;
        flex-direction: column;
        transition: transform 0.3s, box-shadow 0.3s;
        background-color: rgba(0, 0, 0, 0.25);
        backdrop-filter: blur(1px) saturate(80%);
    }
    
    .card:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        background-color: rgba(0, 0, 0, 0.2);
    }

    .card p {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.85);
        margin: 3px 0;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    }
    
    .card-image {
        flex: 1;
        margin-top: 8px;
        overflow: hidden;
        border-radius: 6px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) inset;
        opacity: 0.9;
    }
    
    .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
    }
    
    .card:hover .card-image img {
        transform: scale(1.1);
    }

    /* Center the activity cards with more specific styles and increased spacing */
    .center-l-main .userActivity .module-content .works .grid-demo {
        width: 100%;
        height: 100%;
        display: flex !important;
        justify-content: center !important; 
        align-items: center !important;
        gap: 45px !important; /* Increased from 30px to 45px for more spacing */
        clear: both;
        padding: 0 !important;
        
        /* For wider screens, ensure consistent spacing */
        @media (min-width: 1400px) {
            gap: 60px !important; /* Even more spacing on larger screens */
        }
        
        .works-item {
            width: 222px !important;
            height: 100% !important;
            min-height: 300px !important;
            cursor: pointer !important;
            margin-right: 0 !important;
            box-shadow: 6px 9px 8px 8px rgba(0,0,0,0.32) !important;
            backface-visibility: hidden !important;
            transform: translate3d(0, 0, 0) !important;
            border-radius: 24px !important;
            overflow: hidden !important;
            transition: all 0.3s ease !important;
            
            &:hover {
                transform: translateY(-5px) !important;
                
                .works-bg img {
                    transform: scale(1.1) !important;
                }
            }
            
            &:last-child {
                margin-right: 0 !important;
            }
            
            .works-item-main {
                width: 222px !important;
                height: 300px !important;
                position: relative !important;
                
                .works-bg {
                    width: 100% !important;
                    height: 100% !important;
                    
                    img {
                        width: 100% !important;
                        height: 100% !important;
                        display: block !important;
                        border-radius: 24px !important;
                        transition: all 1s !important;
                        object-fit: cover !important;
                    }
                }
            }
        }
    }
    
    /* Adjust the userActivity section content to accommodate wider spacing */
    .center-l-main .userActivity .module-content {
        padding: 15px 0 35px 15px !important; /* Reduced left padding to give more room for cards */
    }
    
    /* Adjust spacing for userActivity section */
    .center-l-main .userActivity {
        padding: 0 50px 0 0 !important;
        margin-bottom: 5px !important;
        
        .module-title {
            margin-top: 0 !important;
            padding-bottom: 5px !important;
        }
        
        .module-content {
            padding: 15px 0 35px 15px !important; /* Reduced left padding to give more room for cards */
            min-height: 330px !important;
        }
    }
    
    /* Optimize influence section to be more vertically compact */
    .center-l-main .influence {
        padding: 0 54px 0 0 !important;
        margin-top: -15px !important; /* Reduce top margin to make it more compact */
        
        .module-title {
            margin-top: 0 !important;
            padding-bottom: 0 !important; /* Reduce bottom padding */
        }
        
        .module-content {
            padding-top: 5px !important; /* Reduce top padding */
            padding-bottom: 10px !important; /* Reduce bottom padding */
        }
        
        .influence-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            margin-top: 0 !important; /* Remove top margin */
            
            .influence-content-l,
            .influence-content-r {
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                
                i {
                    margin-top: 0 !important; /* Remove top margin */
                    font-size: 16px !important; /* Slightly larger font size */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
            
            .influence-content-c {
                flex: 1;
                margin: 5px 10px !important; /* Reduce vertical margin */
                overflow: hidden;
                
                .scroll-containers {
                    width: 100%;
                    overflow: hidden;
                    
                    .influence-content-c-main {
                        display: flex;
                        gap: 5px;
                        padding: 0 !important; /* Remove padding */
                    }
                }
            }
            
            .cn-item {
                transform: scale(1) !important;
                margin: 0 5px !important;
                width: 85px !important;
                
                .cn-item-main {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    
                    .cn-item-main-avatar {
                        transform: scale(1) !important;
                        width: 75px !important;
                        height: 75px !important;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        
                        .cn-item-pic {
                            width: 65px !important;
                            height: 65px !important;
                            border-radius: 50%;
                            overflow: hidden;
                            
                            img {
                                width: 100% !important;
                                height: 100% !important;
                                object-fit: cover;
                                margin: 0 !important;
                            }
                        }
                        
                        .cn-item-type {
                            font-size: 12px !important;
                            padding: 2px 8px !important;
                            margin-top: 2px !important; /* Reduce space between avatar and type */
                            border-radius: 10px;
                            background-color: rgba(0,0,0,0.1);
                            display: inline-block;
                        }
                    }
                    
                    .cn-item-name {
                        margin-top: 5px !important; /* Reduce space between type and name */
                        font-size: 14px !important;
                        text-align: center;
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
    }
    
    /* Make other sections more compact to balance the layout */
    .center-l-main .userActivity {
        margin-bottom: 0 !important; /* Reduce bottom margin */
    }
    
    .center-l-main .historicalAttention {
        margin-top: 0 !important; /* Reduce top margin */
    }

    /* Adjust the historical attention section with less compression */
    .center-l-main .historicalAttention {
        padding: 0 54px 0 0 !important;
        margin-top: -5px !important; /* Change from -10px to -5px */
        
        .module-title {
            margin-top: 5px !important; /* Increase from 0px */
        }
    }

    /* Create consistent width for all sections */
    .center-l-main .userActivity,
    .center-l-main .influence,
    .center-l-main .historicalAttention {
        width: calc(100% - 50px) !important; /* Consistent width for all sections */
        padding-right: 50px !important; /* Consistent right padding */
    }
    
    /* Specific adjustments for the historicalAttention (recommendations) section */
    .center-l-main .historicalAttention {
        padding: 0 50px 0 0 !important;
        margin-top: -5px !important;
        
        .module-title {
            margin-top: 5px !important;
            width: calc(100% - 23px) !important; /* Match other section titles */
        }
        
        .module-content.slider-container {
            width: calc(100% - 23px) !important; /* Match other section content width */
            overflow: hidden !important;
            padding-right: 0 !important;
        }
        
        .slider {
            width: 100% !important;
            overflow: hidden !important;
        }
    }
    
    /* Ensure slider container shows items properly */
    .slider-container {
        padding: 10px 0 35px 23px !important;
    }
    
    .slider {
        width: 100% !important;
        max-width: calc(100% - 23px) !important; /* Ensure it doesn't overflow the container */
    }
</style>

