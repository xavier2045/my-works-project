<template>
    <div class="draggable-container" ref="container">
      <div class="content" :style="{ width: contentDimensions.width + 'px', height: contentDimensions.height + 'px', transform: contentStyle.transform }">
        <!-- Region 1 -->
        <div class="region" key="region1">
          <div 
            class="item dao-item" 
            v-for="(item, index) in regionData.region1" 
            :key="'region1-item-' + index" 
            :style="{ transform: `translate(${item.x}px, ${item.y}px)` }"
            @mousedown="onMouseDownItem($event, item)"
            @click="onItemClick(item)"
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
          </div>
        </div>
  
        <!-- Region 2 -->
        <div class="region" key="region2">
          <div 
            class="item dao-item" 
            v-for="(item, index) in regionData.region2" 
            :key="'region2-item-' + index" 
            :style="{ transform: `translate(${item.x}px, ${item.y}px)` }"
            @mousedown="onMouseDownItem($event, item)"
            @click="onItemClick(item)">
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
          </div>
        </div>
  
        <!-- Region 3 -->
        <div class="region" key="region3">
          <div 
            class="item dao-item" 
            v-for="(item, index) in regionData.region3" 
            :key="'region3-item-' + index" 
            :style="{ transform: `translate(${item.x}px, ${item.y}px)` }"
            @mousedown="onMouseDownItem($event, item)"
            @click="onItemClick(item)">
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
          </div>
        </div>
  
        <!-- Region 4 -->
        <div class="region" key="region4">
          <div 
            class="item dao-item" 
            v-for="(item, index) in regionData.region4" 
            :key="'region4-item-' + index" 
            :style="{ transform: `translate(${item.x}px, ${item.y}px)` }"
            @mousedown="onMouseDownItem($event, item)"
            @click="onItemClick(item)">
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
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
 
<script setup lang="ts">
  import { ref, reactive, onMounted, nextTick } from 'vue';
  
  const container = ref<HTMLElement | null>(null);
  const isDragging = ref(false);
  const hasMoved = ref(false); // 判断是否发生了移动，避免触发点击事件
  
  // Initialize container dimensions
  let containerWidth = 0;
  let containerHeight = 0;
  
  // Set the content dimensions to be 2x the container to fit 4 regions
  const contentDimensions = reactive({
    width: 0,
    height: 0
  });
  
  // Initialize dragOffset to start with region 2 displayed
  const dragOffset = reactive({ x: 0, y: 0 });
  const startDrag = reactive({ x: 0, y: 0 });
  
  // Data for each region
  const regionData = reactive({
    region1: [] as string[],
    region2: [] as string[],
    region3: [] as string[],
    region4: [] as string[]
  });
  
  const contentStyle = reactive({
    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
  });
  
  // Function to fetch data for each region
  const fetchRegionData = async () => {
    regionData.region1 = await fetchRegion1Data();
    regionData.region2 = await fetchRegion2Data();
    regionData.region3 = await fetchRegion3Data();
    regionData.region4 = await fetchRegion4Data();
  };
  
  let animationFrameId: number | null = null;
  
  const updateContentStyle = () => {
    contentStyle.transform = `translate(${dragOffset.x}px, ${dragOffset.y}px)`;
    animationFrameId = null; // Reset animation frame ID after updating
  };
  
  const onMouseDown = (event: MouseEvent) => {
    isDragging.value = true;
    hasMoved.value = false; // 重置移动状态
    startDrag.x = event.clientX - dragOffset.x;
    startDrag.y = event.clientY - dragOffset.y;
  };
  
  const onMouseMove = (event: MouseEvent) => {
    if (!isDragging.value) return;
  
    let newX = event.clientX - startDrag.x;
    let newY = event.clientY - startDrag.y;
  
    // Clamp the values to keep within the boundaries
    newX = Math.min(0, Math.max(newX, containerWidth - contentDimensions.width));
    newY = Math.min(0, Math.max(newY, containerHeight - contentDimensions.height));
  
    if (newX !== dragOffset.x || newY !== dragOffset.y) {
      hasMoved.value = true; // 标记为已移动
    }
  
    dragOffset.x = newX;
    dragOffset.y = newY;
  
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(updateContentStyle);
    }
  };
  
  const onMouseUp = () => {
    isDragging.value = false;
  };
  
  // Item点击事件
  const onItemClick = (item: string) => {
    if (!hasMoved.value) {
      // 只有在没有拖动的情况下才触发点击事件
      console.log("Clicked on:", item);
    }
  };
  
  // Update container and content dimensions after component is mounted
  const updateDimensions = () => {
    if (container.value) {
      containerWidth = container.value.offsetWidth;
      containerHeight = container.value.offsetHeight;
  
      // Set content dimensions to be twice the container's dimensions
      contentDimensions.width = containerWidth * 2;
      contentDimensions.height = containerHeight * 2;
  
      // Set initial offset to show region 2 (right side of region 1)
      dragOffset.x = -containerWidth;
      dragOffset.y = 0;
    }
  };
  
  onMounted(async () => {
    await nextTick();
    updateDimensions();
    fetchRegionData();
  
    if (container.value) {
      container.value.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  });
  
  // Mock API functions
  async function fetchRegion1Data() {
    return [
        {
            "missionId": "4",
            "missionReward": 1,
            "daoId": "2",
            "daoName": "落榜美术生",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/31/1730354093572-works05.png",
            "daoStatus": 1,
            "daoNum": 3
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "3",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "4",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "5",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "6",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "7",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "8",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "9",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "10",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "11",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "12",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "13",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "14",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "15",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "16",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "17",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "18",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        }
    ];
  }
  
  async function fetchRegion2Data() {
    return [
        {
            "missionId": "4",
            "missionReward": 1,
            "daoId": "19",
            "daoName": "落榜美术生",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/31/1730354093572-works05.png",
            "daoStatus": 1,
            "daoNum": 3
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "20",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "21",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "22",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "23",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "24",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "25",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "26",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "27",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "28",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "29",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "30",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "31",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "32",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "33",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "34",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "35",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "36",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        }
    ];
  }
  
  async function fetchRegion3Data() {
    return [
        {
            "missionId": "4",
            "missionReward": 1,
            "daoId": "2",
            "daoName": "落榜美术生",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/31/1730354093572-works05.png",
            "daoStatus": 1,
            "daoNum": 3
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        }
    ];
  }
  
  async function fetchRegion4Data() {
    return [
        {
            "missionId": "4",
            "missionReward": 1,
            "daoId": "2",
            "daoName": "落榜美术生",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/31/1730354093572-works05.png",
            "daoStatus": 1,
            "daoNum": 3
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        },
        {
            "missionId": "1",
            "missionReward": 1,
            "daoId": "1",
            "daoName": "快到模糊",
            "daoCover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/10/30/1730274659103-works06.png",
            "daoStatus": 1,
            "daoNum": 2
        }
    ];
  }
</script>
  
 
<style lang='scss' scoped>
.draggable-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  cursor: grab;
  user-select: none;
}

.content {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  position: absolute;
  top: 0;
  left: 0;
}

.region {
  width: calc(100% - 42px);
  height: 100%;
  display: grid;
  padding: 10px;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 21px;
  box-sizing: border-box;
}

.item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}
.dao-item {
  width: 100%;
  height: 100%;
  cursor: pointer;
  :hover{
    .dao-item-pic {
      .dao-item-pic-main{
        img {
          transform: scale(1.05);
        }
      }
      
    }
  }
  .dao-item-masking{
    width: calc(100% - 59px) !important;
    height: calc(100% - 60px) !important;
    border: 10px solid #FFFFFF !important;
    border-radius: 18px;
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 3;
    display: none;
  }
  .dao-item-shadow{
    width: calc(100% - 59px) !important;
    height: calc(100% - 60px) !important;
    border: 10px solid #FFFFFF !important;
    border-radius: 38px;
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 2;
    display: none;
  }
  .dao-item-content {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    background: rgba(229, 229, 229, 0.08);
    backdrop-filter: blur(40px);
    box-shadow: 0px 0px 20px 1px rgba(0,0,0,0.52);
    .dao-item-pic {
      padding: 6px;
      .dao-item-pic-main{
        width: 100%;
        height: 208px;
        border-radius: 18px;
        overflow: hidden;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 18px;
          transition: all 1s;
        }
      }
    }
    .dao-item-type{
      display: inline-block;
      position: absolute;
      top: 20px;
      left: 20px;
      i{
        font-size: 36px;
        color: #FFFFFF;
      }
    }
    .dao-item-info {
      height: auto;
      padding: 0 23px;
      .dao-item-info-main{
        width: 100%;
        height: auto;
        .dao-item-info-main-t{
          width: 100%;
          display: flex;
          margin: 12px 0 18px 0;
          .dao-name{
            flex: 1;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 1;
            text-align: center;
            font-style: normal;
            text-transform: none;
            overflow:hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            display: -webkit-box;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
    @media (max-width: 576px) {
      .dao-item-info {
        width: calc(100% - 46px);
        padding: 0 23px;
        .dao-item-info-main{
          .dao-name{
            font-size: 60px;
          }
          .dao-data{
            .dao-data-main{
              .item-title{
                font-size: 56px;
              }
              .item-value{
                font-size: 58px;
              }
            }
          }
        }
      }
    }
    @media (min-width: 576px) {
      .dao-item-info {
        width: calc(100% - 46px);
        padding: 0 23px;
        .dao-item-info-main{
          .dao-name{
            font-size: 80px;
          }
          .dao-data{
            .dao-data-main{
              .item-title{
                font-size: 76px;
                margin-bottom: 55px;
              }
              .item-value{
                font-size: 78px;
              }
            }
          }
        }
      }
    }
    @media (min-width: 768px) {
      .dao-item-info {
        width: calc(100% - 46px);
        padding: 0 23px;
        .dao-item-info-main{
          .dao-name{
            font-size: 40px;
          }
          .dao-data{
            .dao-data-main{
              .item-title{
                font-size: 36px;
                margin-bottom: 15px;
              }
              .item-value{
                font-size: 38px;
              }
            }
          }
        }
      }
    }@media (min-width: 992px) {
      .dao-item-info {
        width: calc(100% - 46px);
        padding: 0 23px;
        .dao-item-info-main{
          .dao-name{
            font-size: 40px;
          }
          .dao-data{
            .dao-data-main{
              .item-title{
                font-size: 36px;
                margin-bottom: 15px;
              }
              .item-value{
                font-size: 38px;
              }
            }
          }
        }
      }
    }
    @media (min-width: 1200px) {
      .dao-item-info {
        width: calc(100% - 46px);
        padding: 0 23px;
        .dao-item-info-main{
          .dao-name{
            font-size: 40px;
          }
          .dao-data{
            .dao-data-main{
              .item-title{
                font-size: 16px;
                margin-bottom: 10px;
              }
              .item-value{
                font-size: 18px;
              }
            }
          }
        }
      }
    }
    @media (min-width: 1600px) {
      .dao-item-info {
        width: calc(100% - 46px);
        padding: 0 23px;
        .dao-item-info-main{
          .dao-name{
            font-size: 20px;
          }
          .dao-data{
            .dao-data-main{
              .item-title{
                font-size: 16px;
                margin-bottom: 6px;
              }
              .item-value{
                font-size: 18px;
              }
            }
          }
        }
      }
    }
    @media (min-width: 1920px) {
      .dao-item-info {
        width: calc(100% - 46px);
        padding: 0 23px;
        .dao-item-info-main{
          .dao-name{
            font-size: 20px;
          }
          .dao-data{
            .dao-data-main{
              .item-title{
                font-size: 16px;
                margin-bottom: 6px;
              }
              .item-value{
                font-size: 18px;
              }
            }
          }
        }
      }
    }
  }
}
</style>


 