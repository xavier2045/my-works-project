<template>
  <div class="timeline-container">
    <div class="timeline-wrapper" ref="timelineWrapper">
      <div class="date-row no-select">
        <div
          v-for="(item, index) in dayProgresses"
          :key="index"
          class="date"
          :class="{ 'current-date': isToday(item.time) }"
        >
          <div class="date-box">
            <div class="date-text">{{ formatDate(item.time) }}</div>
            <div class="date-year">{{ formatDates(item.time) }}年</div> 
          </div>
        </div>
        <div class="progress-bar-wrapper">
          <div class="progress-bar">
            <div class="progress-link" :style="{ width: `${progress}%` }"></div>
          </div>
          <div
            v-for="(items, index) in dayProgresses"
            :key="index"
            class="progress-marker"
            :style="{ width: `${ 98 }px` }"
          >
            <div v-if="items.lineDatas" class="marker-container">
              <div v-for="(data, i) in items.lineDatas" :key="i" :class="getIconClass(data)">
                <div class="icon-bg" v-if="data.businessType === 1">
                  <i class="icon font_family icon-tian34"></i>
                </div>
                <div class="icon-bg" v-else-if="data.businessType === 2">
                  <i class="icon font_family icon-suipian24"></i>
                </div>
                <div class="icon-bg" v-else-if="data.businessType === 3" :class="getNodeIconClass(data.uploadStatus)">
                  <div class="icon-node-main">
                    <div class="icon-node-main-l">
                      <div class="dottedLine">
                        <ul>
                          <li></li>
                          <li></li>
                          <li></li>
                          <li></li>
                          <li></li>
                          <li></li>
                        </ul>
                      </div>
                      <div 
                        class="icon-node-main-l-text" 
                        :class="data.uploadStatus !== 1 ? 'opacity-full' : 'opacity-7'"
                      >
                        <i class="icon font_family icon-jiedian24_1"></i>
                      </div>
                      <div class="dottedLine">
                        <ul>
                          <li></li>
                          <li></li>
                          <li></li>
                        </ul>
                        <!-- <i class="icon font_family icon-liuyandiandian24"></i> -->
                      </div>
                    </div>
                    <div class="icon-node-main-r">
                      <div class="icon-node-main-r-tiem">{{ formatDatess(data.deadline) }}</div>
                      <div class="icon-node-main-r-text">
                        <template v-if="data.uploadStatus == 0">未上传节点</template>
                        <template v-else-if="data.uploadStatus == 1">已上传节点</template>
                        <template v-else-if="data.uploadStatus == 2">请上传节点</template>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

interface LineData {
  businessType: number;
  businessId?: number;
  deadline?: string;
  uploadStatus?: number;
}

interface DayProgress {
  time: string;
  lineDatas: LineData[] | null;
}

export default defineComponent({
  name: 'ProjectTimeline',
  props: {
    progress: {
      type: String,
      default: ''
    },
    dayProgresses: {
      type: Array as PropType<DayProgress[]>,
      required: true
    }
  },
  setup(props) {
    const timelineWrapper = ref<HTMLElement | null>(null);
    const progress = ref(props.progress);
    // Initialize drag and scroll for the container
    const initializeDrag = () => {
      if (!timelineWrapper.value) return;

      let isDown = false;
      let startX: number;
      let scrollLeft: number;

      timelineWrapper.value.addEventListener('mousedown', (e: MouseEvent) => {
        isDown = true;
        startX = e.pageX - timelineWrapper.value!.offsetLeft;
        scrollLeft = timelineWrapper.value!.scrollLeft;
      });

      timelineWrapper.value.addEventListener('mouseleave', () => {
        isDown = false;
      });

      timelineWrapper.value.addEventListener('mouseup', () => {
        isDown = false;
      });

      timelineWrapper.value.addEventListener('mousemove', (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - timelineWrapper.value!.offsetLeft;
        const walk = (x - startX) * 1; // Scroll speed
        timelineWrapper.value!.scrollLeft = scrollLeft - walk;
      });
    };

    onMounted(() => {
      initializeDrag(); // Enable dragging when mounted
    });

    const today = new Date();

    const formatDate = (time: string) => {
      const date = new Date(time);
      return `${date.getMonth() + 1}.${date.getDate()}`;
    };
    const formatDates = (time: string) => {
      const date = new Date(time);
      return `${date.getFullYear()}`;
    };
    const formatDatess = (time: string) => {
      const date = new Date(time);
      return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
    };

    const isToday = (time: string) => {
      const date = new Date(time);
      return date.toDateString() === today.toDateString();
    };

    // Get the correct icon for nodes based on whether they are uploaded or not
    const getNodeIcon = (uploadStatus: number | undefined) => {
      return uploadStatus === 1
        ? 'path_to_uploaded_node_icon'
        : 'path_to_not_uploaded_node_icon';
    };

    // Get icon class for node based on whether it has been uploaded or not
    const getNodeIconClass = (uploadStatus: number | undefined) => {
      return uploadStatus === 1 ? 'white-icon' : 'gray-icon'; // white for uploaded, gray for not uploaded
    };

    const getIconClass = (data: any) => {
      if (data.businessType === 1) return 'icon-pro';
      if (data.businessType === 2) return 'icon-kb';
      if (data.businessType === 3) return 'icon-node';
      return '';
    };

    return {
      progress,
      formatDate,
      formatDates,
      formatDatess,
      isToday,
      getNodeIcon,
      getIconClass,
      getNodeIconClass,
      timelineWrapper
    };
  }
});
</script>

<style lang='scss' scoped>
/* Container for the entire timeline with fixed width and overflow hidden */
.timeline-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .timeline-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    width: auto;
    white-space: nowrap;
    overflow: hidden;
    cursor: grab;
    .date-row {
      display: flex;
      justify-content: flex-start;
      position: relative;
      .date {
        width: 98px;
        line-height: 1;
        text-align: center;
        display: grid;
        align-content: end;
        .date-box{
          width: 40px;
          .date-text{
            font-weight: 400;
            font-size: 14px;
            color: #FFFFFF;
            text-align: center;
          }
          .date-year{
            font-size: 12px;
            margin-top: 3px;
            text-align: center;
            color: rgb(255, 255, 255, .7);
          }
        }
      }
      .current-date {
        font-weight: bold;
        color: red;
      }
      .progress-bar-wrapper {
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 50px;
        .progress-bar {
          height: 8px;
          background-color: rgb(255, 255, 255, .16);
          width: 100%;
          position: absolute;
          top: 50%;
          left: 0;
          border-radius: 4px;
          .progress-link{
            height: 8px;
            border-radius: 4px;
            background-color: rgb(255, 255, 255, .7);
          }
        }
        .marker-container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          i{
            font-size: 24px;
            color: rgb(0, 0, 0, .7);
            line-height: 40px;
            text-align: center;
            display: block;
          }
          .icon-pro{
            width: 34px;
            height: 41px;
            font-size: 16px;
            margin-top: -20px;
            border-radius: 50%;
            display: block;
            position: absolute;
            top: -40px;
            left: 0;
            background: url(@/assets/images/dao/upperCircle.png) no-repeat;
            background-size: 100%;
          }
          .icon-kb{
            width: 34px;
            height: 41px;
            font-size: 16px;
            margin-top: -20px;
            border-radius: 50%;
            display: block;
            position: absolute;
            top: -40px;
            right: 0;
            background: url(@/assets/images/dao/upperCircle.png) no-repeat;
            background-size: 100%;
          }
          .icon-node{
            width: 34px;
            height: 40px;
            font-size: 16px;
            margin-top: -20px;
            display: block;
            position: absolute;
            top: 30px;
            left: 0;
            .icon-node-main{
              width: 100%;
              height: 100%;
              display: flex;
              .icon-node-main-l{
                width: 40px;
                flex-shrink: 0;
                .dottedLine{
                  width: 100%;
                  padding: 3px 0;
                  ul{
                    margin: 0;
                    padding: 0;
                    li{
                      list-style-type: none;
                      width: 4px;
                      height: 4px;
                      margin: 3px auto;
                      border-radius: 50%;
                      background-color: rgb(255, 255, 255, .7);
                    }
                  }
                }
                .icon-node-main-l-text{
                  width: 35px;
                  height: 36px;
                  font-size: 14px;
                  margin: 0 auto;
                  background: url(@/assets/images/dao/lowerCircle.png) no-repeat;
                  background-size: 100%;
                  i{
                    line-height: 36px;
                  }
                }
                .opacity-full{
                  opacity: 1;
                }
                .opacity-7{
                  opacity: .7;
                }
              }
              .icon-node-main-r{
                flex: 1;
                width: 0;
                margin-top: 44px;
                .icon-node-main-r-tiem{
                  font-size: 14px;
                  color: rgb(255, 255, 255, .7);
                }
                .icon-node-main-r-tiem{
                  font-size: 14px;
                  margin-top: 8px;
                  color: rgb(255, 255, 255, .7);
                }
              }
            }
          }
        }
      }
    }
    
  }
}


/* Marker container for both top and bottom markers */


/* Icon classes for nodes */


.gray-icon {
  color: gray;
}

.white-icon {
  color: white;
}
</style>
