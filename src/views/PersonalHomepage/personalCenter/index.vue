<template>
  <div class="personalCenter">
    <persHeader />
    <div class="personalCenter-main">
        <div class="personalCenter-main-centrt">
            <div class="main-center-l">
                <template v-if="userInfo.id !== userId">
                    <Others
                        :missions="missions"
                        :works="works"
                        :activities="activities"
                    />
                </template>
                <template v-else>
                    <Oneself
                        :moments="moments"
                        :influences="Influences"
                        :suggests="suggests"
                    />
                </template>
            </div>
            <div class="main-center-r">
                <div class="cenrer-r-block">
                    <div class="ability">
                        <div class="module-title">
                            <div class="module-title-main">
                                <div class="module-title-main-l">
                                    <div class="module-title-main-l-img">
                                        <i class="icon font_family icon-nengliquan24"></i>
                                    </div>
                                    <div class="module-title-main-l-name">能力圈</div>
                                </div>
                                <div class="module-title-main-r"></div>
                            </div>
                        </div>
                        <div class="module-content">
                            <div class="ability-circle">
                                <div class="ability-circle-main">
                                    <div class="ability-name">
                                        <img :src="icon23" alt="" />
                                        <span>Hello {{ userInfo.userName }}</span>
                                    </div>
                                    <template v-if="posts.length > 0">
                                        <div class="ability-one effect" v-if="posts.length >= 1 && posts[0].name !== null && posts[0].name !== ''">
                                            <img :src="icon24" alt="" />
                                            <div class="ability-date">
                                            <p>{{ posts[0].name }}</p>
                                                <span>{{ `${Number(posts[0].percent) * 100}%` }}</span>
                                            </div>
                                        </div>
                                        <div class="ability-two effect" v-if="posts.length >= 2 && posts[1].name !== null && posts[1].name !== ''">
                                            <img :src="icon28" alt="" />
                                            <div class="ability-date">
                                                <p>{{ posts[1].name }}</p>
                                                <span>{{ `${Number(posts[1].percent) * 100}%` }}</span>
                                            </div>
                                        </div>
                                        <div class="ability-three effect" v-if="posts.length >= 3 && posts[2].name !== null && posts[2].name !== ''">
                                            <img :src="icon26" alt="" />
                                            <div class="ability-date">
                                                <p>{{ posts[2].name }}</p>
                                                <span>{{ `${Number(posts[2].percent) * 100}%` }}</span>
                                            </div>
                                        </div>
                                        <div class="ability-four effect" v-if="posts.length >= 4 && posts[3].name !== null && posts[3].name !== ''">
                                            <img :src="icon29" alt="" />
                                            <div class="ability-date">
                                                <p>{{ posts[3].name }}</p>
                                                <span>{{ `${Number(posts[3].percent) * 100}%` }}</span>
                                            </div>
                                        </div>
                                        <div class="ability-five effect" v-if="posts.length >= 5 && posts[4].name !== null && posts[4].name !== ''">
                                            <img :src="icon25" alt="" />
                                            <div class="ability-date">
                                                <p>{{ posts[4].name }}</p>
                                                <span>{{ `${Number(posts[4].percent) * 100}%` }}</span>
                                            </div>
                                        </div>
                                        <div class="ability-six" v-if="posts.length >= 6 && posts[5].name !== null && posts[5].name !== ''">
                                            <img :src="icon27" alt="" />
                                            <div class="ability-date">
                                                <p>{{ posts[5].name }}</p>
                                                <span>{{ `${Number(posts[5].percent) * 100}%` }}</span>
                                            </div>
                                        </div>
                                    </template>
                                    <!-- <AbilityChart /> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="records">
                        <div class="module-title">
                            <div class="module-title-main">
                                <div class="module-title-main-l">
                                    <div class="module-title-main-l-img">
                                        <i class="icon font_family icon-lianshangjilu24"></i>
                                    </div>
                                    <div class="module-title-main-l-name">链上记录</div>
                                </div>
                                <div class="module-title-main-r">
                                    <router-link to='DigitalIdentity'>
                                        <p>查看更多</p>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                        <div class="module-content">
                            <div class="records-main">
                                <div class="records-main-data">
                                    <div class="data-conter">
                                        <transition-group name="fade" tag="div">
                                            <div 
                                                class="data-conter-item" 
                                                v-for="dat in nfts" 
                                                :key="dat.tokenId"
                                            >
                                                <div class="item-conter">
                                                    <div class="item-conter-pic">
                                                        <img :src="dat.cover" alt="" />
                                                    </div>
                                                    <div class="item-conter-font">
                                                        <div class="item-conter-font-name">{{ dat.daoName }}</div>
                                                        <div class="item-conter-font-title">{{ dat.name }}</div>
                                                    </div>
                                                    <div class="item-conter-support">
                                                        <div class="item-conter-support-img">
                                                            <i class="icon font_family icon-jiantouchakangengduo24"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </transition-group>
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

<script lang='ts' setup>
    import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
    import { personalOneself, personalOthers } from '@/api/user';
    import { aeUseStore } from '@/stores/user';
    import persHeader from '@/components/header/persHeader.vue';
    import AbilityChart from '@/components/AbilityChart/index.vue';
    import Oneself from './oneself.vue';
    import Others from './others.vue';
    import { showPopup } from '@/utils/usePopup';

    const userStore = aeUseStore();
    const userInfo = userStore.getUserInfo;
    const userId = ref(''); // 查看他人的用户id
    // 如果没有他人id，则取登录人id
    if(userInfo.othersId !== '') {
        userId.value = userInfo.othersId;
    } else {
        userId.value = userInfo.id;
    }


   import icon23 from '@/assets/images/pc/icon23.png';
   import icon24 from '@/assets/images/pc/icon24.png';
   import icon25 from '@/assets/images/pc/icon25.png';
   import icon26 from '@/assets/images/pc/icon26.png';
   import icon27 from '@/assets/images/pc/icon27.png';
   import icon28 from '@/assets/images/pc/icon28.png';
   import icon29 from '@/assets/images/pc/icon29.png';


    /*****
     * 我的动态
     * *****/
    interface momentsItem {
        type: number;
        id: string;
        cover: string;
        name: string;
        reward: string;
        member: string;
    }
    const moments = ref<momentsItem[]>([]);

    /*****
     * 影响力
     * *****/
     interface InfluencesItem {
        type: number;
        id: string;
        name: string;
        avatar: string;
    }
    const Influences = ref<InfluencesItem[]>([]);

    /*****
     * 推荐
     * *****/
     interface suggestsItem {
        type: number;
        id: string;
        name: string;
        description: string;
        cover: string;
    }
    const suggests = ref<suggestsItem[]>([]);

    /*****
     * 能力
     * *****/
     interface postsItem {
        name: string;
        percent: string;
    }
    const posts = ref<postsItem[]>([]);

    watch(() => userInfo.post, (newValue) => {
        posts.value = newValue;
    });

    /*****
     * 链上记录 
     * *****/
    interface nftsItem {
        type: string;
        tokenId: string;
        cover: string;
        name: string;
        daoName: string;
        username: string;
    }
    const nfts = ref<nftsItem[]>([]);

    /*****
     * ta的任务 
     * *****/
     interface missionsItem {
        id: string;
        name: string;
        cover: string;
        reward: string;
        member: string;
    }
    const missions = ref<missionsItem[]>([]);

    /*****
     * ta的作品 
     * *****/
     interface worksItem {
        id: number;
    }
    const works = ref<worksItem[]>([]);

    /*****
     * ta的活动 
     * *****/
     interface activitiesItem {
        id: number;
    }
    const activities = ref<activitiesItem[]>([]);

    /*** 获取我的首页信息 **/
    const findPersonalOneselfFun = () => {
        let getData = {}
        return new Promise<void>((resolve, reject) => {
            personalOneself(getData).then((response: any) => {
                const { code, message } = response;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                moments.value = response.data.moments || [];
                Influences.value = response.data.influences || [];
                suggests.value = response.data.suggests || [];
                posts.value = response.data.posts || [];
                nfts.value = response.data.nfts || [];
                console.log('我的能力', posts.value);
                userInfo.post = response.data.posts || [];
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    };

    /*** 获取他人首页信息 **/
    const findPersonalOthersfFun = () => {
        if(userInfo.othersId !== '') {
            userId.value = userInfo.othersId;
        } else {
            userId.value = userInfo.id;
        }
        let getData = {
            userId: userId.value
        }
        return new Promise<void>((resolve, reject) => {
            personalOthers(getData).then((response: any) => {
                const { code, message } = response;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                missions.value = response.data.missions || [];
                works.value = response.data.works || [];
                activities.value = response.data.activities || [];
                posts.value = response.data.posts || [];
                nfts.value = response.data.nfts || [];
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    };


    onMounted(() => {
        if(userInfo.othersId !== '') {
            userId.value = userInfo.othersId;
            findPersonalOthersfFun();
        } else {
            userId.value = userInfo.id;
            findPersonalOneselfFun();
        }
    })  
    onBeforeUnmount(() => {
      
    });

</script>

<style lang='scss' scoped>
    @use '@/assets/styles/personalCenter.scss';
    .m-t-no{
        margin-top: 0 !important;
    }
    
</style>
