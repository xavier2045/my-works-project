<template>
  <div 
    class="dao"
    ref="pageFour"
    >
    <div class="dao-bg">
      <img :src="pcBg" alt="" />
    </div>
    <div class="dao-container">
      <div class="dao-header">
        <HeaderView
          :optionData= 'options'
          @update:searchQuery="handleSearchQueryUpdate"
          @update:selectedOption="handleSelectedOptionUpdate"
        />
      </div>
      <div class="dao-centnet" data-aos="fade-up">
        <SuspMenu />
        <div class="dao-centnet-main" @mousemove="handleMouseMove">
          <div 
            :class="['section', { active: currentModule === 1, shattered: isShattered }]"
            :style="getStyle(1)"
          >
            <p style="color: #ffffff;">第四屏</p>
            <div class="dao-grid" >
              <aeRow class="grid-demo">
                <template v-for="(item, index) in daoList" :key="index">
                    <aeCol 
                      :xs="24" 
                      :sm="24" 
                      :md="12" 
                      :lg="8" 
                      :xl="4"
                      :xxl="4" 
                      :xxxl="4" 
                      class="dao-item"
                      :ref="el => setColRef(el, index)"
                      draggable="true"
                      @dragstart="onDragStart($event, index)"
                      @dragover="onDragOver($event, index)"
                      @drop="onDrop($event, index)"
                      @click="onClick(item)"
                    >
                      <div class="dao-item-content">
                        <div class="dao-item-pic">
                          <div class="dao-item-pic-main">
                            <img :src="item.daoCover" alt="" />
                          </div>
                        </div>
                        <div class="dao-item-type">
                          <template v-if="item.daoStatus === 0">
                            <i class="icon font_family icon-renwuyijiesan44"></i>
                          </template>
                          <template v-if="item.daoStatus === 1">
                            <i class="icon font_family icon-jinhangzhong"></i>
                          </template>
                        </div>
                        <div class="dao-item-info">
                          <div class="dao-item-info-main">
                            <div class="dao-item-info-main-t">
                              <div class="dao-name" :title="item.daoName">{{ item.daoName }}</div>
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
  import router from '@/router';
  import HeaderView from '@/components/header/header.vue';
  import SuspMenu from '@/components/suspMenu/index.vue';
  import AeRow from '@/components/aeRow/Row.vue';
  import AeCol from '@/components/aeCol/Col.vue';
  import { initAOS } from '@/animations/aos';
  import { daosList } from '@/api/dao';
  import { showPopup } from '@/utils/usePopup';
  // import { setRem } from '../utils/rem' // 引入文件
  // import { debounce } from 'throttle-debounce' // 用于防抖的

  import pcBg from '@/assets/images/pc/pcBg.jpg';

  const parentSearchQuery = ref('');
  const parentSelectedOption = ref('');
 
  const daoList = ref([]);

  const handleSearchQueryUpdate = (newSearchQuery: string) => {
    parentSearchQuery.value = newSearchQuery;
    findDaoListFun();
  };
  const handleSelectedOptionUpdate = (newSelectedOption: string) => {
    parentSelectedOption.value = newSelectedOption;
    findDaoListFun();
  };
  const options = ref([
    {value: '99', label: '所有的'},
    {value: '0', label: '已解散'},
    {value: '1', label: '进行中'},
  ]);

  // 获取Dao数据
  const findDaoListFun = () => {
    const resData = {
      pageNum: 1,
      pageSize: 18,
      businessType: 1,
      value: parentSearchQuery.value,
      status: parentSelectedOption.value,
    }
    return new Promise<void>((resolve, reject) => {
      daosList(resData).then((response: any) => {
        const { code, data, message } = response;
        
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        if(resultData.rows.length == 0) {
          return false;
        } else {
          daoList.value = data.rows;
        }
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  }

  // 点击跳转到dao详情
  const onClick = (item: any) => {
      let id = item.daoId;
      router.push({ name: 'DaoDetails', params: { id } });
  };
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
  let currentDraggedItem = ref(null);
  let currentDraggedIndex = ref<number | null>(null);
  const connectionLines = ref<{ x1: number, y1: number, x2: number, y2: number }[]>([]);

  const setColRef = (el: any, index: number) => {
    // 如果 el 是组件实例，通过 $el 访问其 DOM 元素
    nextTick(() => {
      if (el && el.$el) {
        colRefs.value[index] = el.$el;
      } else {
        colRefs.value[index] = el;
      }
    })
  };
  
  const handleMouseMove = async (event: MouseEvent) => {
    await nextTick(); // 确保DOM已经更新
    // const validDivs = colRefs.value.map(ref => (ref as any).$el).filter(div => div !== null);
    const validDivs = colRefs.value
          .map(ref => (ref as any)?.$el)
          .filter(div => div !== null);
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
    // event.dataTransfer?.setData('text/plain', index.toString());
    currentDraggedItem.value = daoList.value[index];
    currentDraggedIndex.value = index; // 记录当前拖拽项的索引
    console.log('daoList.value[index]', daoList.value[index]);
  };

  const onDragOver = (event: DragEvent, index: number) => {
    event.preventDefault(); // 允许拖放
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const draggedItemTag = currentDraggedItem.value.categoryName;

    highlightedDivs.value = []; // 重置高亮
    connectionLines.value = []; // 重置连接线

    colRefs.value.forEach((colRef, index) => {
      if (colRef) {
        const rect = colRef.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow(mouseX - (rect.left + rect.width / 2), 2) +
          Math.pow(mouseY - (rect.top + rect.height / 2), 2)
        );

        // 如果距离小于 500px 且 draggedItemTag 包含目标项的标签，则进行高亮
        if (distance <= 500 && draggedItemTag.includes(daoList.value[index].categoryName)) {
          highlightedDivs.value.push(index);
        }
      }
    });
    console.log('highlightedDivs.value', highlightedDivs.value);
    console.log('currentDraggedIndex.value', currentDraggedIndex.value);
    // 计算从拖拽项到所有高亮项的连接线
    if (highlightedDivs.value.length > 0 && currentDraggedIndex.value !== null) {
      calculateConnectionLines();
    }
  };

  const onDrop = (event: DragEvent, index: number) => {
    event.preventDefault();
    const draggedIndex = daoList.value.findIndex(item => item === currentDraggedItem.value);
      console.log('draggedIndex', draggedIndex);
    if (draggedIndex !== -1) {
      const draggedItem = daoList.value[draggedIndex];
      daoList.value.splice(draggedIndex, 1);
      daoList.value.splice(index, 0, draggedItem);
    }

    // 清除高亮
    highlightedDivs.value = [];
    connectionLines.value = []; // 重置连接线
  };

  const calculateConnectionLines = () => {
    connectionLines.value = []; // 清空已有的连接线

    const draggedRect = colRefs.value[currentDraggedIndex.value]?.getBoundingClientRect();

    if (draggedRect) {
      const draggedCenterX = draggedRect.left + draggedRect.width / 2 + window.scrollX;
      const draggedCenterY = draggedRect.top + draggedRect.height / 2 + window.scrollY;

      highlightedDivs.value.forEach((index) => {
        if (index !== currentDraggedIndex.value) { // 确保不连接到自身
          const targetRect = colRefs.value[index]?.getBoundingClientRect();

          if (targetRect) {
            const targetCenterX = targetRect.left + targetRect.width / 2 + window.scrollX;
            const targetCenterY = targetRect.top + targetRect.height / 2 + window.scrollY;

            const line = {
              x1: draggedCenterX,
              y1: draggedCenterY,
              x2: targetCenterX,
              y2: targetCenterY,
            };

            connectionLines.value.push(line);
          }
        }
      });
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
    findDaoListFun();
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
      colRefs.value = colRefs.value.slice(0, daoList.value.length);
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
  watch(daoList, () => {
    nextTick(() => {
      colRefs.value = colRefs.value.slice(0, daoList.value.length);
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
  .highlight-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* 禁止事件穿透 */
  }
</style>: { dataTransfer: { getData: (arg0: string) => string; }; }: number: { dataTransfer: { getData: (arg0: string) => string; }; }: number
