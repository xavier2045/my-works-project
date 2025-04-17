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
        <div class="dao-centnet-main" @mousemove="handleMouseMove">
          <div 
            :class="['section', { active: currentModule === 0, shattered: isShattered }]"
            :style="getStyle(0)"
            @mousedown="startDrag($event, 0)"
            @touchstart="startDrag($event, 0)"
          >
            <p>第一屏</p>
          </div>
          <div 
            :class="['section', { active: currentModule === 1, shattered: isShattered }]"
            :style="getStyle(1)"
            @mousedown="startDrag($event, 1)"
            @touchstart="startDrag($event, 1)"
          >
            <p>第二屏</p>
            <div class="dao-grid" >
              <aeRow class="grid-demo">
                <template v-for="(item, index) in dao" :key="index">
                    <aeCol 
                      :xs="24" 
                      :sm="24" 
                      :md="12" 
                      :lg="8" 
                      :xl="6"
                      :xxl="6" 
                      :xxxl="6" 
                      class="dao-item"
                      :ref="el => setColRef(el, index)"
                      draggable="true"
                      @dragstart="onDragStart($event, index)"
                      @dragover="onDragOver($event, index)"
                      @drop="onDrop($event, index)"
                    >
                      <div class="dao-item-content">
                        <div class="dao-item-pic">
                          <div class="dao-item-pic-main">
                            <img :src="item.pic" alt="" />
                          </div>
                        </div>
                        <div class="dao-item-type">
                          <i class="icon font_family icon-gerenjincheng"></i>
                        </div>
                        <div class="dao-item-info">
                          <div class="dao-item-info-main">
                            <div class="dao-item-info-main-t">
                              <div class="dao-name" :title="item.worksName">{{ item.worksName }}</div>
                              <div class="dao-online">
                                <i class="icon font_family icon-lianjie24"></i>
                              </div>
                            </div>
                            <div class="dao-split"></div>
                            <div class="dao-data">
                              <div class="dao-data-main">
                                <div class="dao-data-main-l">
                                  <div class="item-title">任务总报酬</div>
                                  <div class="item-value">{{ item.cooperation }}元</div>
                                </div>
                                <div class="dao-data-main-r">
                                  <div class="item-title">参与人数</div>
                                  <div class="item-value">{{ item.creditScore }}人</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="dao-item-shadow" :class="{ 'highlight-cl-b': highlightedDivs.includes(index) }"></div>
                      <div class="dao-item-masking" :class="{ 'highlight-cl-w': highlightedDivs.includes(index) }"></div>
                    </aeCol>
                  </template>
                </aeRow>
            </div>
          </div>
          <div 
            :class="['section', { active: currentModule === 2, shattered: isShattered }]"
            :style="getStyle(2)"
            @mousedown="startDrag($event, 2)"
            @touchstart="startDrag($event, 2)"
          >
            <p>第三屏</p>
            
          </div>
          <div 
            :class="['section', { active: currentModule === 3, shattered: isShattered }]"
            :style="getStyle(3)"
            @mousedown="startDrag($event, 3)"
            @touchstart="startDrag($event, 3)"
          >
            <p>第四屏</p>
            
          </div>
          <div v-if="hoveredDivs.length === 4" :style="hoveredImageStyle" class="hovered-image">
            <img :src="aperture" alt="Hovered Image" />
          </div>
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
  
  const handleMouseMove = async (event: MouseEvent) => {
    await nextTick(); // 确保DOM已经更新
    const validDivs = colRefs.value.map(ref => (ref as any).$el).filter(div => div !== null);
    const threshold = 50; // 距离阈值，单位像素
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    hoveredDivs.value = []; // 清空数组

    validDivs.forEach((div, index) => {
      if (div) {
        const rect = div.getBoundingClientRect();
        if (
          (mouseX > rect.left - threshold && mouseX < rect.right + threshold) &&
          (mouseY > rect.top - threshold && mouseY < rect.bottom + threshold)
        ) {
          hoveredDivs.value.push({ index, rect });
        }
      }
    });

    // 仅在有四个div相交时高亮
    if (hoveredDivs.value.length === 4) {
      highlightedDivs.value = hoveredDivs.value.map(d => d.index);
      // 计算悬浮图片的位置
      const leftPositions = hoveredDivs.value.map(d => d.rect.left);
      const topPositions = hoveredDivs.value.map(d => d.rect.top);
      const rightPositions = hoveredDivs.value.map(d => d.rect.right);
      const bottomPositions = hoveredDivs.value.map(d => d.rect.bottom);

      const centerX = (Math.min(...leftPositions) + Math.max(...rightPositions)) / 2;
      const centerY = (Math.min(...topPositions) + Math.max(...bottomPositions)) / 2;

      // 微调偏移量
      hoveredImageStyle.value.left = `${centerX}px`;
      hoveredImageStyle.value.top = `${centerY - 135}px`; // 根据需要调整这个值

      // 在适当的地方，比如handleMouseMove函数内部，确保高亮逻辑执行完毕后
      if (highlightedDivs.value.length) {
        // 获取所有需要高亮的div元素
        const highlightedElements = document.querySelectorAll('.dao .highlight-cl-w');
        const highlightedElement = document.querySelectorAll('.dao .highlight-cl-b');
        highlightedElements.forEach((element, index) => {
          // 根据索引动态添加不同的类名
          let classNameToAdd = `shadow-white${(index % 4) + 1}`;
          // 添加类名
          element.classList.add(classNameToAdd);
        });
        highlightedElement.forEach((element, index) => {
          // 根据索引动态添加不同的类名
          let classNameToAdd = `shadow-black${(index % 4) + 1}`;
          // 添加类名
          element.classList.add(classNameToAdd);
        });
    }
    } else {
      highlightedDivs.value = [];
    }
  };

  /** 
  * 鼠标拖拽 
  * **/
  const onDragStart = (event: DragEvent, index: number) => {
    event.dataTransfer?.setData('text/plain', index.toString());
  };

  const onDragOver = (event: DragEvent, index: number) => {
    event.preventDefault(); // 允许放置
    console.log('允许放置index', index);
  };

  const onDrop = (event: DragEvent, index: number) => {
    event.preventDefault();
    const draggedIndex = parseInt(event.dataTransfer?.getData('text/plain') || '', 10);
    if (!isNaN(draggedIndex)) {
      const draggedItem = dao.value[draggedIndex];
      dao.value.splice(draggedIndex, 1);
      dao.value.splice(index, 0, draggedItem);
    }
  };



  const getStyle = (index: number) => {
    const isActive = currentModule.value === index;
    const zIndex = isActive ? 2 : 1;

    return {
      zIndex,
      transform: isShattered.value ? getShatterTransform() : 'rotateY(0deg)',
      transition: isShattered.value ? 'none' : 'transform 0.5s ease'
    };

    /**
      **翻书效果
      **
    const transform = isActive ? 'rotateY(0deg)' : 'rotateY(-180deg)';
    return {
      zIndex,
      transform,
      transition: 'transform 0.5s ease',
      Animation: `fadeOutRight ${0.5}s ease-in-out`,
    };*/
    
  };

  const getShatterTransform = () => {
    const angle = Math.random() * 360;
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    return `translate3d(${x}px, ${y}px, ${z}px) rotate3d(1, 1, 0, ${angle}deg)`;
  };
  
  const startDrag = (event: MouseEvent | TouchEvent, index: number) => {
    if (currentModule.value !== index) return;
    isDragging.value = true;
    hasMoved.value = false;
    startX.value = 'touches' in event ? event.touches[0].clientX : event.clientX;
    startY.value = 'touches' in event ? event.touches[0].clientY : event.clientY;

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('touchmove', onDrag);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
  };

  const onDrag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return;
    endX.value = 'touches' in event ? event.touches[0].clientX : event.clientX;
    endY.value = 'touches' in event ? event.touches[0].clientY : event.clientY;

    if (Math.abs(startX.value - endX.value) > 10 || Math.abs(startY.value - endY.value) > 10) {
      hasMoved.value = true;
    }
  };

  const endDrag = () => {
    if (!isDragging.value) return;
    isDragging.value = false;

    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('touchmove', onDrag);
    window.removeEventListener('mouseup', endDrag);
    window.removeEventListener('touchend', endDrag);

    if (!hasMoved.value) return;
    const diffX = startX.value - endX.value;
    const diffY = startY.value - endY.value;

    // if (Math.abs(diffX) > Math.abs(diffY)) {
    //   if (diffX > 50) {
    //     navigate('left');
    //   } else if (diffX < -50) {
    //     navigate('right');
    //   }
    // } else {
    //   if (diffY > 50) {
    //     navigate('up');
    //   } else if (diffY < -50) {
    //     navigate('down');
    //   }
    // }

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 50) {
        triggerShatter();
        setTimeout(() => navigate('left'), 500);
      } else if (diffX < -50) {
        triggerShatter();
        setTimeout(() => navigate('right'), 500);
      }
    } else {
      if (diffY > 50) {
        triggerShatter();
        setTimeout(() => navigate('up'), 500);
      } else if (diffY < -50) {
        triggerShatter();
        setTimeout(() => navigate('down'), 500);
      }
    }
  };

  const triggerShatter = () => {
    isShattered.value = true;
    setTimeout(() => {
      isShattered.value = false;
    }, 1000); // 动画时间设置为1秒
  };

  const navigate = (direction: string) => {
    console.log('currentModule', currentModule.value);
    switch (currentModule.value) {
      case 0:
        if (direction === 'left') currentModule.value = 1;
        if (direction === 'up') currentModule.value = 2;
        break;
      case 1:
        if (direction === 'right') currentModule.value = 0;
        if (direction === 'up') currentModule.value = 3;
        break;
      case 2:
        if (direction === 'down') currentModule.value = 0;
        if (direction === 'left') currentModule.value = 3;
        break;
      case 3:
        if (direction === 'right') currentModule.value = 2;
        if (direction === 'down') currentModule.value = 1;
        break;
    }
  }; 
  
  onMounted(() => {
    initAOS();
    // window.addEventListener('mousemove', onDrag);
    window.addEventListener('touchmove', onDrag);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
    window.addEventListener('mousemove', function(event) {
      handleMouseMove(event);
      onDrag(event);
    });
    
    nextTick(() => {
      colRefs.value = colRefs.value.slice(0, dao.value.length);
    });
  });
  onBeforeUnmount(() => {
    // 移除事件监听器
    // window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('touchmove', onDrag);
    window.removeEventListener('mouseup', endDrag);
    window.removeEventListener('touchend', endDrag);
    window.removeEventListener('mousemove', function(event) {
      onDrag(event);
      handleMouseMove(event);
      // 根据需要判断或进一步分发处理
    });
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
