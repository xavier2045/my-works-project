<!-- src/components/Banner.vue -->
<template>
    <swiper
      :effect="'coverflow'"
      :grabCursor="true"
      :centeredSlides="true"
      :slidesPerView="'auto'"
      :coverflowEffect="{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }"
      :modules="modules"
      
      >
      <!-- :autoplay="{delay: 2000,disableOnInteraction: false}" -->
      <swiper-slide v-for="(slide, index) in props.bannerData" :key="index" >
        <div class="slide-main">
          <div class="slide-main-hader">
            <div class="banner-info">
              <div class="banner-info-title">{{ slide.title }}</div>
              <div class="play-volume">下限：{{ slide.content }}</div>
            </div>
            <div class="play-link">
              <img :src="support_icon" alt="" />
            </div>
          </div>
          <div class="slide-main-video">
            <div class="video-pic">
              <img v-bind:src="slide.image" alt="Slide Image">
            </div>
            <div class="play-but">
              <img :src="play" alt="" />
            </div>
          </div>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </template>
  <script lang="ts" setup>
  import { } from 'vue';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import support_icon from '@/assets/images/home/support_icon.png';
  import play from '@/assets/images/home/play.png';
  import 'swiper/css';

  import 'swiper/swiper-bundle.css';
  import 'swiper/css/autoplay'
  import 'swiper/css/effect-coverflow';
  import { Autoplay, Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
  // import 'swiper/css/effect-fade'
  
  const modules= [Autoplay, Pagination, Navigation, EffectCoverflow]
  
  // 使用withDefaults函数定义具有默认值的props
  const props = withDefaults(defineProps<{
    bannerData: Array<string | any>; // 假设数组可以包含字符串或其他类型
  }>(), {
    bannerData: () => [] // 通过返回空数组的函数设置默认值
  });

  console.log('bannerData', props.bannerData)
  // const props = defineProps({
  //   bannerData:{
  //     type:Array as any,
  //     default:()=>[]
  //   }
  // })

  
  </script>
  <style lang="scss" scoped>
    .swiper-slide {
      width: 300px;
      /* transform: rotate(10deg) !important; */
      border-radius: 20px;
      img{
        width: 100%;
        border-radius: 20px;
      }
    }
    .slide-main{
      width: 274px;
      height: 145px;
      background: #FFFFFF;
      border-radius: 24px;
      overflow: hidden;
      font-family: 'PingFang SC';
      .slide-main-hader{
        padding: 10px 14px 10px 14px;
        display: flex;
        .banner-info{
          flex: 1;
          width: 0;
          .banner-info-title{
            width: 100%;
            font-weight: 600;
            font-size: 15px;
            color: #111111;
            line-height: 1;
            margin-bottom: 6px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          .play-volume{
            font-weight: 400;
            font-size: 11px;
            color: #999999;
            line-height: 1;
          }
        }
        .play-link{
          width: 16px;
          flex-shrink:0;
          margin: 3px 3px 0 10px;
          img{
            width: 13px;
            height: 14px;
            display: inline-block;
          }
        }
      }
      .slide-main-video{
        padding: 0 6px 6px 6px;
        position: relative;
        .video-pic{
          width: 100%;
          img{
            width: 100%;
            height: auto;
            display: block;
          }
        }
        .play-but{
          width: 20px;
          height: 21px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          img{
            width: 20px;
            height: 21px;
            display: block;
          }
        }
      }
    }
  </style>
  