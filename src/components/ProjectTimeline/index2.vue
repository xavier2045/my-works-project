<template>
  <div
    class="timeline-chart"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
  >
    <!-- 时间轴容器 -->
    <div
      class="timeline"
      :style="{ transform: `translateX(${translateX}px)`, width: `${timelineWidth}px` }"
      ref="timeline"
    >
      <!-- 日期块 -->
      <div
        v-for="(date, index) in filteredData"
        :key="index"
        class="date-block"
        :style="{ width: `${blockWidth}px` }"
      >
        <div class="tick" :style="getTickStyle(date.isNode)"></div>
        <div class="node-image type-color1">
          <i class="icon font_family type-color" :class="date.nodeImageSrc"></i>
          <template v-if="date.auditStatus == 1">
            <template v-if="date.canUpload !== null">
              <div class="node-type">
                <i class="icon font_family icon-xiugaizhong20 type-color2"></i>
              </div>
            </template>
          </template>
          <template v-if="date.auditStatus == 3">
            <div class="node-type">
              <i class="icon font_family icon-shenhebutongguo20 type-color3"></i>
            </div>
          </template>
          <template v-if="date.auditStatus == 2">
            <div class="node-type">
              <i class="icon font_family icon-kongxinyuanquan20 type-color1"></i>
            </div>
          </template>
        </div>
        <div class="node-image knowledge-image type-color2">
          <i class="icon font_family" :class="date.knowledgeImageSrc"></i>
        </div>
        <div class="node-image proposal-image type-color3">
          <i class="icon font_family" :class="date.proposalImageSrc"></i>
        </div>
        <div class="date-label" :style="getDateLabelStyle(date.isNode)">
          {{ formatDate(date.date) }}
        </div>
      </div>
    </div>
    <div
      class="progress-bar"
      :style="{ width: `${timelineWidth}px`, transform: `translateX(${translateX}px)` }"
    >
      <div class="progress-done" :style="{ width: calculateProgressWidth() }"></div>
    </div>
  </div>
</template>

  
  <script lang="ts">
  import { defineComponent, ref, watch, onMounted, nextTick } from "vue";
  import { aeUseStore } from '@/stores/user';
  import dayjs from "dayjs";
  
  interface DateBlock {
    date: string;
    canUpload: number | null;
    isNode: boolean; // 是否为节点时间
    auditStatus: number | null;
    nodeImageSrc?: string; // 节点图片路径
    knowledgeImageSrc?: string; // 奇点图片路径
    proposalImageSrc?: string; // 提案图片路径
  }
  
  export default defineComponent({
    name: "TimelineChart",
    props: {
      data: {
        type: Object,
        required: true,
      },
      filter: {
        type: String,
        default: "day", // 默认筛选条件为日
      },
    },
    setup(props) {
      const dateRange = ref<DateBlock[]>([]);
      const filteredData = ref<DateBlock[]>([]);
      const currentProgressTime = ref<string | null>(null);
      const blockWidth = ref(96); // 每个日期块的宽度，最小为 96px
      const uploadableBusinessIds = ref(0);
      const userStore = aeUseStore();
      const userInfo = userStore.getUserInfo;
  
      // 拖动相关状态
      const translateX = ref(0); // 时间轴的偏移量
      const isDragging = ref(false); // 是否正在拖动
      const startX = ref(0); // 鼠标拖动起始点
      const timelineWidth = ref(0); // 时间轴实际宽度
      const chartWidth = ref(0); // 父容器宽度
      const canDrag = ref(false); // 是否允许拖动
  
      const timeline = ref<HTMLElement | null>(null);
      const timelineChart = ref<HTMLElement | null>(null);
  
      // 初始化日期范围和进度节点
      const initDateRange = () => {
        const start = dayjs(props.data.startTime);
        const end = dayjs(props.data.endTime);
        const range: DateBlock[] = [];
        let current = start;
        uploadableBusinessIds.value = 0; // 清空 businessId 列表

        // 将 proposals 和 knowledges 转换为日期对象（忽略时间部分）
        const proposalDates = props.data.proposals?.map((proposal: string) =>
          dayjs(proposal.split(" ")[0]).format("YYYY-MM-DD")
        ) || [];
        const knowledgeDates = props.data.knowledges?.map((knowledge: string) =>
          dayjs(knowledge.split(" ")[0]).format("YYYY-MM-DD")
        ) || [];

        while (current.isBefore(end) || current.isSame(end)) {
          const date = current.format("YYYY-MM-DD");

          // 查找 nodePeriods 数据
          const node = props.data.nodePeriods?.find((node: any) => node.time === date);
          
          // 如果 canUpload == 1，记录 businessId
          if (node && node.canUpload === 1) {
            uploadableBusinessIds.value = node.businessId;
            userInfo.nodeId = node.businessId;
            userInfo.uploadableBusinessIds = node.businessId;
          }

          // 确认该日期是否有 proposal 或 knowledge 数据
          const hasProposal = proposalDates.includes(date);
          const hasKnowledge = knowledgeDates.includes(date);

          range.push({
            date,
            canUpload: node ? node.canUpload : null,
            isNode: !!node, // 是否为节点
            auditStatus: node?.auditStatus || null, // 节点的审核状态
            nodeImageSrc: node && node.auditStatus !== null ? "icon-a-jiedian243" : undefined, // 节点图片路径
            knowledgeImageSrc: hasKnowledge ? "icon-suipian24" : undefined, // 知识点图片路径
            proposalImageSrc: hasProposal ? "icon-tian24" : undefined, // 提案图片路径
          });

          current = current.add(1, "day");
        }

        dateRange.value = range;
        filterData(); // 根据当前筛选条件过滤数据
      };

  
      // 格式化日期显示
      const formatDate = (date: string) => {
        return dayjs(date).format("MM.DD");
      };
  
      // 计算进度条宽度
      const calculateProgressWidth = () => {
        if (!props.data.nodePeriods || props.data.nodePeriods.length === 0) return "0px";

        const start = dayjs(props.data.startTime); // 时间轴的起始时间
        const end = dayjs(props.data.endTime); // 时间轴的结束时间
        // 找到最后一个 auditStatus === 2 的节点
        const targetNode = props.data.nodePeriods
            ?.filter((node: any) => node.auditStatus === 2)
            .sort((a: any, b: any) => dayjs(a.time).isAfter(dayjs(b.time)) ? -1 : 1)[0];

        if (!targetNode) return "0px"; // 如果没有符合条件的节点，则返回 0px

        const targetDate = dayjs(targetNode.time); // 目标节点的日期

        // 计算目标节点距离起始时间的比例
        const totalDuration = end.diff(start, "ms");
        const elapsedDuration = targetDate.diff(start, "ms");

        // 根据比例计算宽度
        const progressWidth = (elapsedDuration / totalDuration) * timelineWidth.value;

        return `${progressWidth + 96}px`;
      };
  
      // 获取刻度样式
      const getTickStyle = (isNode: boolean) => {
        return {
          backgroundColor: isNode ? "white" : "transparent",
          height: "10px",
          width: "2px",
          margin: "0 auto",
        };
      };
  
      // 获取日期样式
      const getDateLabelStyle = (isNode: boolean) => {
        return {
          color: isNode ? "white" : "transparent",
          fontSize: "14px",
          textAlign: "center",
          marginTop: "10px",
        };
      };
  
      // 根据筛选条件过滤数据
      // const filterData = () => {
      //   if (props.filter === "day") {
      //     filteredData.value = dateRange.value; // 全部按天显示
      //     adjustTimelineWidth();
      //   } else if (props.filter === "week") {
      //     // 每7天显示一个日期块
      //     filteredData.value = dateRange.value.filter((_, index) => index % 7 === 0);
      //     adjustTimelineWidth();
      //   } else if (props.filter === "month") {
      //     // 每30天显示一个日期块
      //     filteredData.value = dateRange.value.filter((_, index) => index % 30 === 0);
      //     adjustTimelineWidth();
      //   } else {
      //     filteredData.value = dateRange.value; // 默认按天显示
      //     adjustTimelineWidth();
      //   }
      // };
  
      // 动态调整时间轴宽度
      // const adjustTimelineWidth = () => {
      //   nextTick(() => {
      //     const totalBlocks = filteredData.value.length;
      //     timelineWidth.value = Math.max(totalBlocks * blockWidth.value, chartWidth.value); // 保证铺满父级宽度

      //     const containerWidth = timelineChart.value?.clientWidth || 0;
      //     chartWidth.value = containerWidth;

      //     // 判断是否允许拖动
      //     canDrag.value = timelineWidth.value > chartWidth.value;
      //   });
      // };

      const filterData = () => {
        if (props.filter === "day") {
          // 显示全部日期
          filteredData.value = dateRange.value;
        } else if (props.filter === "week") {
          // 每 7 天一个节点
          filteredData.value = dateRange.value.filter((_, index) => index % 7 === 0);
          // 确保结束时间节点存在
          const endDate = dayjs(props.data.endTime).format("YYYY-MM-DD");
          if (!filteredData.value.some((item) => item.date === endDate)) {
            filteredData.value.push({
              date: endDate,
              isNode: true,
              auditStatus: null,
              nodeImageSrc: undefined,
              knowledgeImageSrc: undefined,
              proposalImageSrc: undefined,
            });
          }
        } else if (props.filter === "month") {
          // 每 30 天一个节点
          filteredData.value = dateRange.value.filter((_, index) => index % 30 === 0);
          // 确保结束时间节点存在
          const endDate = dayjs(props.data.endTime).format("YYYY-MM-DD");
          if (!filteredData.value.some((item) => item.date === endDate)) {
            filteredData.value.push({
              date: endDate,
              isNode: true,
              auditStatus: null,
              nodeImageSrc: undefined,
              knowledgeImageSrc: undefined,
              proposalImageSrc: undefined,
            });
          }
        }

        adjustTimelineWidth();
      };

      const adjustTimelineWidth = () => {
        nextTick(() => {
          const totalBlocks = filteredData.value.length;
          timelineWidth.value = Math.max(totalBlocks * blockWidth.value, chartWidth.value); // 保证铺满父级宽度

          const containerWidth = timelineChart.value?.clientWidth || 0;
          chartWidth.value = containerWidth;

          // 判断是否允许拖动
          canDrag.value = timelineWidth.value > chartWidth.value;

          // 修正 translateX 偏移量
          // translateX.value = Math.min(0, chartWidth.value - timelineWidth.value);
          translateX.value = Math.min(0, 0);
          console.log('translateX 偏移量', translateX.value);
        });
      };
        
      // 拖动相关逻辑
      // const startDrag = (e: MouseEvent) => {
      //   if (!canDrag.value) return;
      //   isDragging.value = true;
      //   startX.value = e.clientX;
      // };
  
      // const onDrag = (e: MouseEvent) => {
      //   if (!isDragging.value || !canDrag.value) return;
      //   const deltaX = e.clientX - startX.value;
      //   startX.value = e.clientX;
  
      //   const maxTranslateX = 0;
      //   const minTranslateX = chartWidth.value - timelineWidth.value;
  
      //   // 更新 translateX，限制范围
      //   translateX.value = Math.min(maxTranslateX, Math.max(minTranslateX, translateX.value + deltaX));
      // };

      const startDrag = (e: MouseEvent) => {
        if (!canDrag.value) return;
        isDragging.value = true;
        startX.value = e.clientX;
      };

      const onDrag = (e: MouseEvent) => {
        if (!isDragging.value || !canDrag.value) return;
        const deltaX = e.clientX - startX.value;
        startX.value = e.clientX;

        const maxTranslateX = 0;
        const minTranslateX = chartWidth.value - timelineWidth.value;

        // 使用 requestAnimationFrame 优化拖动流畅度
        requestAnimationFrame(() => {
          translateX.value = Math.min(maxTranslateX, Math.max(minTranslateX, translateX.value + deltaX));
        });
      };
  
      const endDrag = () => {
        isDragging.value = false;
      };
  
      watch(() => props.filter, filterData);
      watch(() => props.data, () => nextTick(initDateRange), { immediate: true });
  
      onMounted(() => {
        timelineChart.value = document.querySelector(".timeline-chart");
        timeline.value = document.querySelector(".timeline");
  
        nextTick(() => adjustTimelineWidth());
        window.addEventListener("resize", () => adjustTimelineWidth());
      });
  
      return {
        dateRange,
        filteredData,
        blockWidth,
        translateX,
        timelineWidth,
        isDragging,
        formatDate,
        getTickStyle,
        getDateLabelStyle,
        calculateProgressWidth,
        startDrag,
        onDrag,
        endDrag,
        uploadableBusinessIds, // 返回 canUpload == 1 的 businessId
      };

    },
  });
  </script>

  
  <style scoped>
    .timeline-chart {
      width: 100%;
      height: 100%;
      overflow: hidden; /* 隐藏滚动条 */
      white-space: nowrap;
      position: relative;
      cursor: grab;
      user-select: none; 
    }
    
    .timeline-chart:active {
      cursor: grabbing;
    }
    
    .timeline {
      display: flex;
      position: relative;
      height: 130px;
      align-items: flex-end;
      transition: transform 0.2s ease; /* 拖动平滑过渡 */
    }
    
    .progress-bar {
      position: absolute;
      bottom: 26px;
      left: 0;
      z-index: -1;
      height: 10px;
      border-radius: 10px;
      background-color: #3a3a3a;
      transition: transform 0.2s ease;
    }
    
    .progress-done {
      height: 100%;
      border-radius: 10px;
      background-color: #d3d3d3;
      transition: width 0.2s ease;
    }
    
    .date-block {
      position: relative;
      text-align: center;
    }
    
    .tick {
      height: 10px;
      width: 2px;
      margin: 0 auto;
    }

    .node-image {
        position: absolute;
        top: -30px; /* 图片显示在刻度上方 */
        left: 50%;
        transform: translateX(-50%);
        width: 24px;
        height: 24px;
        font-size: 24px;
        color: rgba(255, 255, 255, 1);
    }
    .node-image i{font-size: 24px;}
    .node-type{
      width: 40px;
      height: 40px;
      position: relative;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
    }
    .node-type i{
      font-size: 32px;
      display: block;
    }
    .type-color{
      background: radial-gradient(100% 0% at 0% 0%, #d8d6d6 0%, #e9e9e9 58%, #ffffff 97%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: block;
    }
    .type-color1{
      background: radial-gradient(100% 0% at 0% 0%, #F8507B 0%, #D9072F 58%, #A7071E 97%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: block;
    }
    .type-color2{
      background: radial-gradient(100% 0% at 0% 0%, #ebd8b1 0%, #efc97c 58%, #e8bd67 97%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: block;
    }
    .type-color3{
      background: radial-gradient(100% 0% at 0% 0%, #00A0FF 0%, #5FD0FF 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: block;
    }

    .knowledge-image {
        top: -60px; /* 知识点图片偏移更高 */
        font-size: 24px;
        color: rgba(255, 255, 255, 1);
    }

    .proposal-image {
        width: 30px;
        height: 30px;
        top: -90px; /* 提案图片偏移更高 */
        font-size: 24px;
        color: rgba(255, 255, 255, 1);
    }
    .proposal-image i{
      font-size: 30px;
    }
    
    .date-label {
      font-size: 14px;
      color: white;
      margin-top: 10px;
    }
  </style>
  