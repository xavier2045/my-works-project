<!-- src/views/index/index.vue -->
<template>
    <div class="views-content" data-aos="fade-up"  @click="handleClick">
        <div class="views-content-main">
            <div class="content-main-box">
                <div class="video-backg">
                    <!-- <video 
                    :src="videoSrc" 
                    autoplay
                    loop
                    muted
                    playsinline
                    ></video> -->
                </div>
                <ParticleWhirlpool class="inner-background" />
                <div class="main-content home">
                    <div class="main-content-header">
                        <div class="content-header-main">
                            <HeaderView
                                :optionData= 'options'
                                @update:searchQuery="handleSearchQueryUpdate"
                                @update:selectedOption="handleSelectedOptionUpdate"
                            />
                        </div>
                    </div>
                    <div class="menu-content-view">
                        <div class="view-main">
                            <SuspMenu />
                            <div class="view-main-content">
                                <div class="main-content-display">
                                    <div class="display-main">
                                        <div class="display-main-l">
                                            <div class="exhibit-five-links">
                                                <div class="five-links-main relievoShadow" @click="openLogin">
                                                    <span>准备加入</span>
                                                </div>
                                            </div> 
                                            <div class="exhibit">
                                                <div class="exhibit-main">
                                                    <div class="exhibit-one"><i class="whiteBg"></i>THIS IS</div>
                                                    <div class="exhibit-tow">THE<i class="blackBg"></i><span>SELF-ORGANIZATION</span></div>
                                                    <div class="exhibit-three">FROME AETRIX</div>
                                                    <div class="exhibit-four"><i class="whiteBg"></i>AUTHENTIC AND UNIQUE!</div>
                                                    <div class="exhibit-five">
                                                        <p>爱智可视 建立更好的世界</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="display-main-r">
                                            <div class="main-r-content clear">
                                                <div class="guide fr">
                                                    {{ homeData.trustValue }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="stat">
                                        <div class="stat-main" @click="toRouterFunc(3)">
                                            <div class="stat-main-content">
                                                <!-- <Statistic :NumberData="NumberData" /> -->
                                                <div class="stat-content-l">
                                                    <div class="item-num"><span><Statistic :NumberData="Number(homeData.userNum)" /></span><i>+</i></div>
                                                    <div class="item-name">平台总人数</div>
                                                </div>
                                                <div class="stat-content-c" style="background: transparent;"></div>
                                                <div class="stat-content-r">
                                                    <div class="item-num"><span><Statistic :NumberData="Number(homeData.daoMemberNum)" /></span><i>+</i></div>
                                                    <div class="item-name">团队总人数</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="main-content-works">
                                    <div class="works-main-c">
                                        <div class="works-main-video">
                                            <img :src="play" alt="" />
                                        </div>
                                    </div>
                                    <div class="works-main">
                                        <div class="works-main-l">
                                            <div class="portfolio">
                                                <div class="portfolio-main" @click="toRouterFunc(1)">
                                                <div class="portfolio-main-data">
                                                        <div class="main-data-item">
                                                            <div class="item-one item-style" @click="toRouterSeeFunc(homeData.publishes[0].businessType, homeData.publishes[0].id)">
                                                                <template v-if="homeData.publishes.length >= 1">
                                                                    <el-image
                                                                        style="width: 100%; height: 100%"
                                                                        :src="homeData.publishes && homeData.publishes.length > 0 ? homeData.publishes[0].cover : '@/assets/images/common/defaultAvatar.png'"
                                                                        fit="cover"
                                                                        >
                                                                        <template #error>
                                                                            <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                                        </template>
                                                                    </el-image>
                                                                </template>
                                                                <template v-else>
                                                                    <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                                </template>
                                                            </div>
                                                            <div class="item-tow item-style" @click="toRouterSeeFunc(homeData.publishes[1].businessType, homeData.publishes[1].id)">
                                                                <template v-if="homeData.publishes.length >= 2">
                                                                    <el-image
                                                                        style="width: 100%; height: 100%"
                                                                        :src="homeData.publishes && homeData.publishes.length > 0 ? homeData.publishes[1].cover : '@/assets/images/common/defaultAvatar.png'"
                                                                        fit="cover"
                                                                        >
                                                                        <template #error>
                                                                            <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                                        </template>
                                                                    </el-image>
                                                                </template>
                                                                <template v-else>
                                                                    <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                                </template>
                                                            </div>
                                                            <div class="item-three item-style">
                                                                <span><Statistic :NumberData="Number(homeData.orderNum)" /></span>+
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="portfolio-main-int">
                                                        <img :src="homeTrade" alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="works-main-r">
                                            <div class="portfolio">
                                                <div class="portfolio-main" @click="toRouterFunc(2)">
                                                <div class="portfolio-main-data">
                                                        <div class="main-data-item">
                                                            <div class="item-one item-style" @click="toRouterDaoFunc(homeData.daos[0].id)">
                                                                <template v-if="homeData.daos.length >= 1">
                                                                    <el-image
                                                                        style="width: 100%; height: 100%"
                                                                        :src="homeData.daos && homeData.daos.length > 0 ? homeData.daos[0].cover : '@/assets/images/common/defaultAvatar.png'"
                                                                        fit="cover"
                                                                        >
                                                                        <template #error>
                                                                            <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                                        </template>
                                                                    </el-image>
                                                                </template>
                                                                <template v-else>
                                                                    <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                                </template>
                                                            </div>
                                                            <div class="item-tow item-style" @click="toRouterDaoFunc(homeData.daos[1].id)">
                                                                <template v-if="homeData.daos.length >= 2">
                                                                    <el-image
                                                                        style="width: 100%; height: 100%"
                                                                        :src="homeData.daos && homeData.daos.length > 0 ? homeData.daos[1].cover : '@/assets/images/common/defaultAvatar.png'"
                                                                        fit="cover"
                                                                        >
                                                                        <template #error>
                                                                            <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                                        </template>
                                                                    </el-image>
                                                                </template>
                                                                <template v-else>
                                                                    <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                                </template>
                                                            </div>
                                                            <div class="item-three item-style">
                                                                <span><Statistic :NumberData="Number(homeData.daoNum)" /></span>+
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="portfolio-main-int">
                                                        <img :src="homeTeam" alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="main-content-caropusel">
                                    <div class="caropusel-main">
                                        <div class="caropusel-main-l">
                                            <div class="caropusel-int">
                                                <div class="chinese">
                                                    <p class="">AETRIX-释放潜能，重获属于你的价值，</p>
                                                    <p class="">证明真正的实力。链接信任的力量，</p>
                                                    <p class="">让每一步都有意义。</p>
                                                </div>
                                                <div class="caropusel-link" @click="openLogin">
                                                    <div class="caropusel-link-main relievoShadow">
                                                        <span>立即实现</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="caropusel-main-r">
                                            <div class="caropusel-main-video">
                                                <div class="video-content">
                                                    <div class="video-content-main">
                                                        <div class="banner-view">
                                                            <div class="banner-view-mainBody">
                                                                <CodeSandbox :bannerData="homeData.missions" :switchValue="switchValue" @update:activeIndex="handleIndexUpdate" />
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                                <div class="banner-but">
                                                    <!-- <div class="banner-but-roll">
                                                        <div class="roll-switch">
                                                        <SwitchBut v-model="switchValue" /> 
                                                        </div>
                                                        <p>滚动</p>
                                                    </div> -->
                                                    <div class="banner-but-swiper">
                                                        <div class="but-swiper-main">
                                                            <ul>
                                                                <li 
                                                                    v-for="(lis, index) in 3" 
                                                                    :key="index"
                                                                    :class="index === isActive ? 'active' : ''"
                                                                    @click="isActive = index"
                                                                >
                                                                    {{ lis }}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="main-content-foot">
                                    <div class="foot-content">
                                        <div class="foot-content-l">
                                            <p>© 2024 - 2037 深圳市爱智可视科技有限公司</p>
                                        </div>
                                        <div class="foot-content-r">
                                            <p><span>隐藏策略</span><i>|</i><span>服务条款</span></p>
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
    <!-- <Login :isOpen="isLoginOpen" @close="closeLogin"  /> -->
</template>

<script lang="ts" setup>
    import { onMounted, ref, nextTick, watch } from 'vue';
    import router from '@/router';
    import Statistic from '@/components/statisticModule/statistic.vue';
    import CodeSandbox from '@/components/codeSandbox/CodeSandbox.vue';
    import HeaderView from '@/components/header/header.vue';
    import SuspMenu from '@/components/suspMenu/index.vue';
    import ParticleWhirlpool from '@/components/particleWhirlpool/index.vue';
    import { homeInfo } from '@/api/user';
    import { aeUseStore } from '@/stores/user';
    import { initAOS } from '@/animations/aos';
    import SwitchBut from '@/components/SwitchBut.vue';
    import Login from '@/components/login/login.vue';
    import { getItem, setItem } from '@/utils/index';
    import { showPopup } from '@/utils/usePopup';

    import homeTrade from '/home_trade.png';
    import homeTeam from '/home_team.png';
    import logo from '/logo.svg';
    import menu from '@/assets/images/home/menu.png'; 
    import play from '@/assets/images/home/play.png';
    
    const userStore = aeUseStore();
    const userInfo = userStore.getUserInfo;

    // import videoPath from '@/assets/images/video1.mp4';
    // const videoSrc = videoPath;

    const handleSearchQueryUpdate = (newSearchQuery: string) => {
      parentSearchQuery.value = newSearchQuery;
    };
    const handleSelectedOptionUpdate = (newSelectedOption: string) => {
      parentSelectedOption.value = newSelectedOption;
    };
    const options = ref([]);


    /** 左侧菜单 **/
    const isSuspMenu = ref<number | null>(null);
    const suspMenu = ref([
        { id: 1, name: '首页', path: '/', icon: 'icon-shouye24' },
        { id: 4, name: '作品', path: '/WorksList', icon: 'icon-fabuzuopin34' },
        { id: 2, name: '任务', path: '/TaskList', icon: 'icon-woderenwu24-2' },
        { id: 3, name: '活动', path: '/TaskList', icon: 'icon-fabuhuodong34' },
        { id: 5, name: 'Dao', path: '/dao/pageTwo', icon: 'icon-jihui24' },
        { id: 6, name: '个人中心', path: '/PersonalHomepage', icon: 'icon-geren24' },
    ]);

    const isAbsolute = (path: any) => {
        return path.startsWith('/');
    }

    const findSuspMenuIndex = (index: number) => {
        isSuspMenu.value = index;
    }
    const findRouterPersonalHomepage = () => {
        if(userInfo.userName !== '' && userInfo.userName !== null) {
            router.push('/PersonalHomepage');
        } else {
            openLogin();
        }
    }

    const homeData = ref({
        userNum: null as number | null,
        orderNum: null as number | null,
        daoNum: null as number | null,
        daoMemberNum: null as number | null,
        trustValue: null as number | null,
        daos: [],
        publishes: [],
        missions: []
    });
    /** 获取首页数据 **/
    const findGetHomeInfoFun = async () => {
        let reqData = {}

        return new Promise<void>((resolve, reject) => {
            homeInfo(reqData).then((response: any) => {
            const { code, data, message } = response;
            
            const resultData = data;
            if (code !== 200) {
            showPopup(message, 'error', 3000);
                return;
            }

            homeData.value  = resultData;
           
            resolve()
        }).catch((error: any) => {
            reject(error)
        })
        })
    };

    /** 跳转到详情页 **/
    const toRouterSeeFunc = (businessType: string, id: string) => {
        // businessType	String	发布类型：1任务 2作品 3活动
        console.log('data', businessType);
        if(businessType == '1') {
            userInfo.taskType = 1;
            setItem('taskType', 1);
            router.push({ name: 'TataskDetails', params: { id } });
        }
    };

    /** 跳转到Dao 详情页 **/
    const toRouterDaoFunc = (id: string) => {
        ;
        userInfo.daoType = 1;
        setItem('daoType', 1);
        router.push({ name: 'DaoDetails', params: { id } });
    };

    /**
     * 登录弹窗
     * 
    */
    const isLoginOpen = ref(false);

    const openLogin = () => {
        isLoginOpen.value = true;
    };

    const closeLogin = () => {
        isLoginOpen.value = false;
    };

    // 获取缓存数据
    if (userInfo.userName !== '' && userInfo.userName !== undefined && userInfo.userName !== null) {
        userInfo.avatar = userInfo.avatar || '';
    } else {
        if(getItem('userName') !== '' && getItem('userName') !== undefined && getItem('userName') !== null) {
            userInfo.value = getItem('userInfo');
            userInfo.value.avatar = userInfo.value.avatar || '';
            console.log('userInfo.value.active2',userInfo.value);
        } 
    }
    watch(() => userInfo.value, (newVal) => {
        console.log('User name changed:', newVal);
    });

    const isFlag = ref(0);
    const isActive = ref(0);
    const switchValue = ref(false);
    // const scrollIcon= ref(expand);
    const isMenuShow= ref(false);
    const isSearchOpen= ref(false);
    const inputRef = ref<HTMLInputElement | null>(null);
    const search = ref(''); // 搜索框输入的值
    /**
     * 菜单数据
     * **/
    const menuData = [
        {
            name: '首页',
            path: '/',
        },
        {
            name: '任务',
            path: '/taskList',
        },
        {
            name: '我',
            path: '/personalList',
        },
        {
            name: '生态区',
            path: '/DaoOrg',
        },
        {
            name: '我们的服务',
            path: '/',
        },
        {
            name: '共建区',
            path: '/',
        },
    ];

     const percent = ref(0.3);

    const getFlagFun = (index: number) => {
        isFlag.value = index;
    };

    /**
     * 显示隐藏菜单栏
    */
    const findMenuShowFun = () => {
        // if(isMenuShow.value) {
        //     isMenuShow.value = false;
        // } else {
            isMenuShow.value = true;
        // }
    }

    /**
     * 输入框效果
     * **/
    const findSearchOpenFun = () => {
        // if(isSearchOpen.value) {
        //     isSearchOpen.value = false;
        // } else {
            isSearchOpen.value = true;
            // 在组件挂载完成后获取焦点
            nextTick(() => {
                if (inputRef.value) {
                    inputRef.value.focus();
                }
            });
        // }
    }
    document.addEventListener('click', (event) => {
        if(isSearchOpen.value) {
            if(!event.target || !(event.target instanceof HTMLElement)) {
                return;
            }
            if(!event.target.classList.contains('search-input')) {
                isSearchOpen.value = false;
            }
        }
    });

    // 处理回车事件
    const handleEnter = () => {
      console.log('Enter key pressed');
      console.log('search', search.value);
    };

    const toRouterFunc = (index: number) => {
        // 1：任务广场，2：DAO组织
        if(index == 1) {
            router.push('/taskList');
        } else if(index == 2) {
            router.push('/daoOrg');
        }
    }

    const handleIndexUpdate = (index: any) => {
        let slidesLength = homeData.value.missions.length;
        let indexNum = index / slidesLength;
        percent.value = indexNum;
    };

    const handleClick = () => {
        userInfo.isToBePaid = false;
        userInfo.isMsgShow = false;
        userInfo.isUserInfo = false;
    };

    onMounted(() => {
        // userStore.setUserInfo({ name: 'John Doe', email: 'john@example.com' });
        initAOS();
        findGetHomeInfoFun();
    });
</script>

<style lang="scss" scoped>
    @use '@/assets/styles/common.scss';
    @use '@/assets/styles/index.scss';
    *{margin: 0;padding: 0;}
    .fl{float: left;}
    .fr{float: right;}
    .clear{clear: both;}
    .blackBg{background-color: #000000;}
    .whiteBg{background-color: #FFFFFF;}
    .inner-background{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
    }
</style>
  