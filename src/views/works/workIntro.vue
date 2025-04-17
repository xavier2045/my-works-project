<template>
    <div class="worksInfo">
        <div class="commentModule-header">
            <div class="header-main">
                <div class="header-left">
                    <div class="header-left-main">
                        <div class="header-left-icon">
                            <i class="icon font_family icon-shequhudong24"></i> 
                        </div>
                        <div class="header-left-text">创作过程</div>
                    </div>
                </div>
                <div class="header-right" @click="findCloseModule">
                    <div class="header-right-back relievoShadow">
                        <i class="icon font_family icon-guanbiwubeijing20"></i> 
                    </div>
                </div> 
            </div>
        </div>
        <div class="worksInfo-content">
            <div class="worksInfo-content-main overflowYAuto">
                <div v-for="(introduction, index) in workData.introductions" :key="index">
                    <div v-if="introduction.type == 1">
                        <p>{{ introduction.content }}</p>
                    </div>
                    <div class="mat-20" v-if="introduction.type == 2">
                        <div class="image-gallery">
                        <img
                            v-for="(image, imageIndex) in stringToArray(introduction.content)"
                            :key="imageIndex"
                            :src="image"
                            :class="['gallery-image', { active: currentImageIndex === imageIndex }]"
                            @click="openImageModal(image, imageIndex, introduction.content)"
                        />
                        </div>
                    </div>
                    
                    <div class="mat-20" v-if="introduction.type === 4">
                        <video controls>
                        <source :src="introduction.content" type="video/mp4">
                        Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </div>  
    </div>
  </template>
  
  <script lang="ts">
  import { ref, defineComponent, nextTick, watch } from 'vue';
  import { aeUseStore } from '@/stores/user';
  
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
    emits: ['back'],
    setup(props, { emit }) {
        console.log('props.data', props.data);
        const userStore = aeUseStore();
        const userInfo = userStore.getUserInfo;
        const workData = ref({
            introductions: {}
        });
        const currentImageIndex = ref(0);
        const currentImage = ref('');
        const imageList = ref([]); // 图片列表

        const items = ref([
            { icon: 'icon-quzhongxinhua24', naem: '是否链上', fields: 'isOnChain' },
            { icon: 'icon-leixing24', naem: '作品类型', fields: 'type' },
            { icon: 'icon-chuangzuo24', naem: '创造方式', fields: 'type' },
            { icon: 'icon-biaoqian24', naem: '标签', fields: 'tags' },
            { icon: 'icon-yuanchuang24', naem: '是否原创', fields: 'isOriginal' },
            { icon: 'icon-quanxian24_1', naem: '公开类型', fields: 'publicType' },
            { icon: 'icon-jiazhi24', naem: '收费类型', fields: 'publicType' },
            { icon: 'icon-wodezizuzhi24', naem: '共创者', fields: 'coCreators' }
        ]);

        workData.value = props.data;

        const findCloseModule = () => {
            emit('back');
        };

        const stringToArray = (str: string) => {
            return str.split(",");
        }
    
        const openImageModal = (url: string, index: number, list: string) => {
            currentImage.value = url;
            currentImageIndex.value = index;
            imageList.value = stringToArray(list);
        };

        watch(() => props.data, (newVal, oldVal) => {
            workData.value = newVal;
            console.log('workData.valueworkData.valueworkData.valueworkData.valueworkData.valueworkData.value', workData.value);
        });

        return {
            items,
            workData,
            userInfo,
            userStore,
            imageList,
            currentImage,
            currentImageIndex,
            findCloseModule,
            stringToArray,
            openImageModal
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
        display: flex;
        flex-direction: column;
        .commentModule-header{
            width: 100%;
            height: 40px;
            flex-shrink: 0;
            .header-main{
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: space-between;
                .header-left{
                    display: inline-block;
                    .header-left-main{
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: flex-start;
                        .header-left-icon{
                            i{
                                font-size: 24px;
                                line-height: 40px;
                                display: block;
                                color: rgb(255, 255, 255, .7);
                            }
                        }
                        .header-left-text{
                            font-weight: 400;
                            font-size: 18px;
                            color: #FFFFFF;
                            text-align: left;
                            line-height: 40px;
                        }
                    }
                }
                .header-right{
                    display: inline-block;
                    .header-right-back{
                        width: 30px;
                        height: 30px;
                        margin: 5px 0;
                        cursor: pointer;
                        border-radius: 50%;
                        i{
                            font-weight: 400;
                            font-size: 24px;
                            text-align: center;
                            color: rgb(255, 255, 255, .7);
                            line-height: 30px;
                            display: block;
                        }
                    }
                }
            }
        }
        .worksInfo-content{
            flex-grow: 1;
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
                p{
                    font-weight: 400;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 32px;
                    text-align: left;
                    word-break: break-all;
                }
                .image-gallery {
                    display: flex;
                    flex-wrap: wrap;
                    .gallery-image{
                    width: 143px;
                    height: 143px;
                    cursor: pointer;
                    box-shadow: 6px 0px 10px 0px rgba(0, 0, 0, 0.25);
                    border-radius: 24px 24px 24px 24px;
                    opacity: 0.9;
                    margin: 0 2% 20px 0;
                    }
                    .active {
                    box-shadow: 6px 0px 10px 0px rgba(0, 0, 0, 0.25);
                    }
                } 
            }
        }
    }
  </style>
  