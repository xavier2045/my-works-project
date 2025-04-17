<template>
  <Swiper
    ref="swiperRef"
    class="mySwiper"
    :slidesPerView="2"
    :centeredSlides="true"
    :spaceBetween="30"
    :reverseDirection="true"
    :modules="modules"
    :loop="true"
    :observer= "true"
    :observeParents= "true"
    :autoplay="autoplayOptions"
    @swiper="onSwiper"
    @slideChange="onSlideChange"
  >
  <SwiperSlide
    v-for="(slide, index) in props.bannerData" 
    :key="index"
  >
      <div class="slide-main">
        <img v-bind:src="slide.cover" alt="Slide Image">
        <div class="slide-main-info">
          <div class="slide-main-info-title">{{ slide.name }}</div>
          <div class="slide-main-info-sub">¥{{ slide.reward }}</div>
        </div>
      </div>
    </SwiperSlide>
  </Swiper>
</template>
<script lang="ts" setup>
  import { ref, watch, onMounted } from 'vue';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Autoplay } from 'swiper/modules';
  import 'swiper/scss';
  import 'swiper/scss/autoplay';
  import './style.css';

  import support_icon from '@/assets/images/home/support_icon.png';
  import play from '@/assets/images/home/play.png';

  const props = withDefaults(defineProps<{
      bannerData: Array<string | any>;
      switchValue: Boolean;
  }>(), {
      bannerData: () => []
  });

  const modules = [Autoplay];
  const emit = defineEmits(['update:activeIndex']);

  const autoplayOptions = {
    delay: 3000,
    disableOnInteraction: true,
    pauseOnMouseEnter: true,
  };
  const swiperRef = ref<any>(null);
  let swiperInstance: any = null;

  const onSwiper = (swiper: any) => {
    swiperInstance = swiper;
    handleAutoplay();
  };

  const handleAutoplay = () => {
    if (swiperInstance && swiperInstance.autoplay && typeof swiperInstance.autoplay.start === 'function') {
      if (props.switchValue) {
        swiperInstance.autoplay.stop();
      } else {
        swiperInstance.autoplay.start();
      }
    } else {
      console.error("Swiper instance or autoplay methods are not ready.");
    }
  };

  // Ensure Swiper is correctly initialized after component mount
  onMounted(() => {
    if (swiperInstance) {
      handleAutoplay();
    }
  });

  // Watch switchValue to control autoplay
  watch(() => props.switchValue, () => {
    if (swiperInstance) {
      handleAutoplay();
    } else {
      console.error("Swiper instance is not available on watch trigger.");
    }
    
  });

  const onSlideChange = () => {
    if (swiperInstance) {
      const activeIndex = swiperInstance.realIndex;
      let newIndex = Number(activeIndex || 0) + 1;
      emit('update:activeIndex', newIndex);
    }
  };

</script>

<style lang="scss" scoped>
  .swiper {
    padding: 0 10px 30px 12px;
  }
  :deep(.swiper-wrapper){
    padding-top: 58px;
  }
  .swiper-slide {
    width: 300px;
    border-radius: 24px;
    background: rgba(255, 255, 255, .52);
    transition: transform 0.3s ease-in-out;
    &:hover{
      transform: scale(1.05);
    }
    img{
      width: 100%;
    }
  }
  .slide-main{
    width: 360px;
    height: 208px;
    border-radius: 24px;
    cursor: pointer;
    position: relative;
    box-shadow: 0px 10px 15px 0px rgba(0,0,0,0.28);
    img{
      width: 100%;
      height: 100%;
      border-radius: 24px;
    }
    .slide-main-info{
      height: 42px;
      padding: 0 20px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      border-radius: 6px 6px 24px 24px;
      background-color: rgba(0, 0, 0, 0.56);
      .slide-main-info-title{
        font-weight: 400;
        font-size: 16px;
        color: #FFFFFF;
        line-height: 42px;
        text-align: left;
      }
      .slide-main-info-sub{
        font-weight: 400;
        font-size: 14px;
        color: #FFFFFF;
        line-height: 42px;
        text-align: left;
      }
    }
  }
</style>

