<template>
    <div class="worksInfo">
        <div class="header-right-back relievoShadow" @click="findCloseModule">
            <i class="icon font_family icon-guanbiwubeijing20"></i> 
        </div>
        <div class="worksInfo-content">
            <div class="worksInfo-content-main">
                <div class="main-item" v-for="(item, index) in items" :key="index">
                    <div class="item-icon relievoShadow">
                        <i :class="`icon font_family ${item.icon}`"></i>
                    </div>
                    <div class="item-text multi-line-1">
                        <template v-if="item.fields == 'isOnChain'">
                            {{ workData[item.fields] == 1 ? '去中心化存储' : '非去中心化存储' }}
                        </template>
                        <template v-else-if="item.fields == 'type'">
                            {{ workData[item.fields] == 1 ? '视频类' : workData[item.fields] == 2 ? '图片类' : workData[item.fields] == 3 ? '语音类' : '文档类' }}
                        </template>
                        <template v-else-if="item.fields == 'originalType'">
                            {{ workData[item.fields] == 1 ? '原创作品' : '非原创作品' }}
                        </template>
                        <template v-else-if="item.fields == 'publicType'">
                            {{ workData[item.fields] == 1 ? '私有' : workData[item.fields] == 2 ? '公开' : workData[item.fields] == 3 ? '部分公开' : '' }}
                        </template>
                        <template v-else-if="item.fields == 'tags'">
                            <div class="tags-main">
                                <div class="tags-main-item" v-for="(tag, index) in workData[item.fields]" :key="index">
                                    <div class="tags-main-item-text">#{{ tag }}</div>
                                </div>
                            </div>
                        </template>
                        <template v-else-if="item.fields == 'patentUrls'">
                            <div class="tags-main">
                                <img class="tags-main-img" v-for="(patentUrl, index) in workData[item.fields]" :key="index" :src="patentUrl" alt="" />
                            </div>
                        </template>
                        <template v-else-if="item.fields == 'coCreators'">
                            <template v-if="item.fields == 'coCreators'">
                                <div class="coCreators-main">
                                    <div class="coCreators-main-item relievoShadow" v-for="(coCreator, index) in workData[item.fields].slice(0, 3)" :key="index">
                                        <div class="coCreators-main-item-avatar">
                                            <img :src="coCreator.avatar" alt="" />
                                        </div>
                                    </div>
                                    <div class="coCreators-main-item relievoShadow" @click="findOpenisApplyListInfo">
                                        {{ Number(workData.coCreators.length) }}
                                    </div>
                                </div>
                            </template>
                        </template>
                        <template v-else>
                            {{ workData[item.fields] }} 
                        </template>
                    </div>
                </div>
                <div class="main-but relievoShadow" @click="findOpenIntroFun">
                    <div class="main-but-item">
                        <i class="icon font_family icon-chuangzuoguocheng24"></i>
                        <span>作品创作过程</span>
                    </div>
                </div>
                <div class="main-but relievoShadow" @click="findOpenPedigreeFun">
                    <div class="main-but-item">
                        <i class="icon font_family icon-zupu24"></i>
                        <span>作品谱系图</span>
                    </div>
                </div>
            </div>
        </div>  
    </div>
  </template>
  
  <script lang="ts">
    import { ref, defineComponent, nextTick } from 'vue';
    import { aeUseStore } from '@/stores/user';
    import { aeWorksStore } from '@/stores/works';
  
  export default defineComponent({
    name: 'worksInfo',
    components: {
      
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    emits: ['back', 'open-intro', 'open-pedigree'],
    setup(props, { emit }) {
        const userStore = aeUseStore();
        const userInfo = userStore.getUserInfo;
        const worksStore = aeWorksStore();
        const worksInfo = worksStore.getWorksInfo;

        const workData = ref(props.data);
        // workData.value.coCreators.unshift({
        //     avatar: userInfo.avatar,
        //     userId: userInfo.id,
        // });
        let list: { icon: string; naem: string; fields: string; }[] = [];
            if(workData.value.isCommercial == 1) {
                list = [
                    { icon: 'icon-quzhongxinhua24', naem: '是否链上', fields: 'isOnChain' },
                    { icon: 'icon-chuangzuo24', naem: '创作方式', fields: 'createMethod' },
                    { icon: 'icon-biaoqian24', naem: '标签', fields: 'tags' },
                    { icon: 'icon-yuanchuang24', naem: '是否原创', fields: 'originalType' },
                    { icon: 'icon-leixing24', naem: '作品类型', fields: 'type' },
                    { icon: 'icon-leixing24', naem: '专利证书', fields: 'patentUrls' },
                    { icon: 'icon-wodezizuzhi24', naem: '共创者', fields: 'coCreators' },
                    { icon: 'icon-rili24', naem: '上传日期', fields: 'createTime' }
                ];
            } else {
                list = [
                    { icon: 'icon-quzhongxinhua24', naem: '是否链上', fields: 'isOnChain' },
                    { icon: 'icon-chuangzuo24', naem: '创作方式', fields: 'createMethod' },
                    { icon: 'icon-biaoqian24', naem: '标签', fields: 'tags' },
                    { icon: 'icon-yuanchuang24', naem: '是否原创', fields: 'originalType' },
                    { icon: 'icon-leixing24', naem: '作品类型', fields: 'type' },
                    { icon: 'icon-wodezizuzhi24', naem: '共创者', fields: 'coCreators' },
                    { icon: 'icon-rili24', naem: '上传日期', fields: 'createTime' }
                ];
            }
        const items = list;

        // 打开共创者弹框
        const findOpenisApplyListInfo = () => {
            worksInfo.isCoCreator = true;
        };

        // 关闭
        const findCloseModule = () => {
            emit('back');
        };
        // 作品创作过程
        const findOpenIntroFun = () => {
            emit('open-intro');
            findCloseModule();
        }

        // 作品谱系图
        const findOpenPedigreeFun = () => {
            emit('open-pedigree');
            findCloseModule();
        }

        return {
            items,
            workData,
            userInfo,
            userStore,
            findCloseModule,
            findOpenIntroFun,
            findOpenPedigreeFun,
            findOpenisApplyListInfo,
        };
    },
  });
  </script>
  
  <style lang="scss" scoped>
    .worksInfo{
        width: calc(100% - 40px);
        height: calc(100% - 40px);
        padding: 20px;
        position: relative;
        .header-right-back{
            width: 30px;
            height: 30px;
            cursor: pointer;
            display: block;
            border-radius: 50%;
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 999;
            i{
                font-weight: 400;
                font-size: 24px;
                text-align: center;
                color: rgb(255, 255, 255, .7);
                line-height: 30px;
                display: block;
            }
        }
        .worksInfo-content{
            width: 100%;
            height: 100%;
            .worksInfo-content-main{
                width: 100%;
                height: 100%;
                .main-item{
                    width: 100%;
                    height: auto;
                    display: flex;
                    margin-bottom: 23px;
                    .item-icon{
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        flex-shrink: 0;
                        margin-right: 20px;
                        i{
                            font-size: 20px;
                            text-align: center;
                            line-height: 40px;
                            display: block;
                            color: rgb(255, 255, 255, .7);
                        }
                    }
                    .item-text{
                        flex: 1;
                        width: 0;
                        font-weight: 400;
                        font-size: 16px;
                        color: #FFFFFF;
                        text-align: left;
                        line-height: 40px;
                        .tags-main{
                            display: flex;
                            .tags-main-item{
                                display: inline-block;
                                .tags-main-item-text{
                                    margin-right: 5px;
                                }
                            }
                            .tags-main-img{
                                width: 34px;
                                height: 27px;
                                border-radius: 2px;
                            }
                        }
                        .coCreators-main{
                            display: flex;
                            .coCreators-main-item{
                                width: 30px;
                                height: 30px;
                                font-size: 14px;
                                color: rgb(255, 255, 255, .7);
                                line-height: 30px;
                                text-align: center;
                                border-radius: 50%;
                                display: inline-block;
                                cursor: pointer;
                                overflow: hidden;
                                margin: 5px;
                                .coCreators-main-item-avatar{
                                    width: 80%;
                                    height: 80%;
                                    margin: 10%;
                                    img{
                                        width: 100%;
                                        height: 100%;
                                        display: block;
                                        border-radius: 50%;
                                    }
                                }
                            }
                        }
                    }
                }
                .main-but{
                    width: 80%;
                    height: 50px;
                    margin: 30px auto 0 auto;
                    border-radius: 12px;
                    .main-but-item{
                        width: 100%;
                        height: 100%;
                        display: flex;
                        cursor: pointer;
                        justify-content: center;
                        i{
                            font-size: 20px;
                            color: rgb(255, 255, 255, .7);
                            line-height: 50px;
                            display: inline-block;
                            margin-right: 10px;
                        }
                        span{
                            font-weight: 400;
                            font-size: 18px;
                            color: #FFFFFF;
                            line-height: 50px;
                            text-align: left;
                        }
                    }
                }   
            }
        }
    }
  </style>
  