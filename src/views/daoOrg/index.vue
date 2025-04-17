<template>
  <div 
    class="dao"
    ref="dragArea"
    >
    <div class="dao-bg">
      <img :src="pcBg" alt="" />
    </div>
    <div class="dao-container">
      <div class="dao-header">
        <HeaderView />
      </div>
      <div class="dao-centnet" data-aos="fade-up">
        <div class="dao-centnet-main">
          <DraggableView />
        </div>
      </div>
      <div class="personal-footer">
        <div class="PartingLine"></div>
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
</template>
 
<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
  import HeaderView from '@/components/header/header.vue';
  import AeRow from '@/components/aeRow/Row.vue';
  import AeCol from '@/components/aeCol/Col.vue';
  import DraggableView from './draggableView.vue';
  import { initAOS } from '@/animations/aos';
  // import { setRem } from '../utils/rem' // 引入文件
  // import { debounce } from 'throttle-debounce' // 用于防抖的

  import pcBg from '@/assets/images/pc/pcBg.jpg';

  import pic1 from '@/assets/images/dao/pic1.png';
  import pic2 from '@/assets/images/dao/pic2.png';
  import pic3 from '@/assets/images/dao/pic3.png';
  import pic4 from '@/assets/images/dao/pic4.png';
  import pic5 from '@/assets/images/dao/pic5.png';
  import pic6 from '@/assets/images/dao/pic6.png';
  import pic7 from '@/assets/images/dao/pic7.png';
  import pic8 from '@/assets/images/dao/pic8.png';
  import pic9 from '@/assets/images/dao/pic9.png';
  import pic10 from '@/assets/images/dao/pic10.png';
  import pic11 from '@/assets/images/dao/pic11.png';
  import pic12 from '@/assets/images/dao/pic12.png';
  import aperture from '@/assets/images/dao/aperture.png';
 
  const dao = ref([
    { 
      id: 's0001', 
      worksName: 'QBX 创始人钥匙',
      creditScore: '98',
      cooperation: '89',
      pic: pic1, 
    },
    { 
      id: 's0002', 
      worksName: '虚空幻象', 
      creditScore: '98',
      cooperation: '89',
      pic: pic2, 
    },
    { 
      id: 's0003', 
      worksName: 'Deblock推出的《Bursted Bubble》', 
      creditScore: '98',
      cooperation: '89',
      pic: pic3, 
    },
    { 
      id: 's0004', 
      worksName: '共同点世界', 
      creditScore: '98',
      cooperation: '89',
      pic: pic4, 
    },
    { 
      id: 's0005', 
      worksName: '版本 x Guido', 
      creditScore: '98',
      cooperation: '89',
      pic: pic5, 
    },
    { 
      id: 's0006', 
      worksName: '东京的午夜| 东京の真夜中', 
      creditScore: '98',
      cooperation: '89',
      pic: pic6, 
    },
    { 
      id: 's0007', 
      worksName: '十四世纪系列',
      creditScore: '98',
      cooperation: '89',
      pic: pic7, 
    },
    { 
      id: 's0008', 
      worksName: '元景观', 
      creditScore: '98',
      cooperation: '89',
      pic: pic8, 
    },
    { 
      id: 's0009', 
      worksName: '響鳴', 
      creditScore: '98',
      cooperation: '89',
      pic: pic9, 
    },
    { 
      id: 's0010', 
      worksName: '虚空幻象', 
      creditScore: '98',
      cooperation: '89',
      pic: pic10, 
    },
    { 
      id: 's0011', 
      worksName: '版本 x Guido', 
      creditScore: '98',
      cooperation: '89',
      pic: pic11, 
    },
    { 
      id: 's0012', 
      worksName: '东京的午夜| 东京の真夜中', 
      creditScore: '98',
      cooperation: '89',
      pic: pic12, 
    },
    { 
      id: 's0013', 
      worksName: '十四世纪系列',
      creditScore: '98',
      cooperation: '89',
      pic: pic7, 
    },
    { 
      id: 's0014', 
      worksName: '元景观', 
      creditScore: '98',
      cooperation: '89',
      pic: pic8, 
    },
    { 
      id: 's0015', 
      worksName: '響鳴', 
      creditScore: '98',
      cooperation: '89',
      pic: pic9, 
    },
    { 
      id: 's0016', 
      worksName: '虚空幻象', 
      creditScore: '98',
      cooperation: '89',
      pic: pic10, 
    },
    { 
      id: 's0017', 
      worksName: '版本 x Guido', 
      creditScore: '98',
      cooperation: '89',
      pic: pic11, 
    },
    { 
      id: 's0018', 
      worksName: '东京的午夜| 东京の真夜中', 
      creditScore: '98',
      cooperation: '89',
      pic: pic12, 
    },
  ]);

  /** 层叠判断 **/
  const currentModule = ref(1);
  const startX = ref(0);
  const startY = ref(0);
  const endX = ref(0);
  const endY = ref(0);
  const isDragging = ref(false);
  const hasMoved = ref(false);
  const isShattered = ref(false);

  /**
     * 鼠标移入div交界点
     * **/

  const colRefs  = ref<(HTMLElement | null)[]>([]);
  const highlightedDivs = ref<number[]>([]);
  const hoveredDivs = ref<{ index: number, rect: DOMRect }[]>([]);
  const hoveredImageStyle = ref({ left: '0px', top: '0px' });

  const setColRef = (el: any, index: number) => {
    if(el) {
      colRefs.value[index] = el;
    }
  };
  
  onMounted(() => {
    initAOS();
    
  });
  onBeforeUnmount(() => {
    
  });
  // 确保 divs 在 DOM 更新后被正确引用
  watch(dao, () => {
    nextTick(() => {
      colRefs.value = colRefs.value.slice(0, dao.value.length);
    });
  });
</script>
 
<style lang="scss" scoped>
  @use '@/assets/styles/daoOrg.scss';
  * { margin: 0; padding: 0; }
  html,body {
    width: 100%;
    height: 100%;
  }
  .arco-space {
    display: inherit;
  }
</style>: { dataTransfer: { getData: (arg0: string) => string; }; }: number: { dataTransfer: { getData: (arg0: string) => string; }; }: number
