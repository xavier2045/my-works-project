<template>
    <div class="task-scheduler">
      <div class="header">
        <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期"></el-date-picker>
        <el-button-group>
          <el-button @click="setTimeFilter('day')">日</el-button>
          <el-button @click="setTimeFilter('week')">周</el-button>
          <el-button @click="setTimeFilter('month')">月</el-button>
          <el-button @click="setTimeFilter('year')">年</el-button>
        </el-button-group>
      </div>
  
      <div class="content">
        <div class="y-axis">
          <div v-for="task in tasks" :key="task.id" class="task-row">
            {{ task.name }}
          </div>
        </div>
        <div class="x-axis">
          <div v-for="time in timeSlots" :key="time" class="time-slot">
            {{ time }}
          </div>
        </div>
        <div class="task-bars">
          <div v-for="task in tasks" :key="task.id" class="task-bar" :style="getTaskBarStyle(task)">
            <span>{{ task.endTime }}</span>
            <img :src="task.avatar" class="avatar" @click="onAvatarClick(task)" />
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <el-icon><more /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="addMember(task)">增加成员</el-dropdown-item>
                  <el-dropdown-item @click="removeMember(task)">删除成员</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </template>
  

  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { showPopup } from '@/utils/usePopup';
  
  export default defineComponent({
    name: 'TaskScheduler',
    components: {},
    setup() {
      const selectedDate = ref(new Date());
      const timeFilter = ref('day');
      const tasks = ref([
        // 示例任务数据
        {
          id: 1,
          name: '任务策划',
          startTime: '08:00',
          endTime: '08:15',
          avatar: '/path/to/avatar1.jpg',
          status: 'completed',
        },
        // 其他任务
      ]);
  
      const timeSlots = ref([
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
      ]);
  
      const setTimeFilter = (filter: string) => {
        timeFilter.value = filter;
        // 根据 filter 调整 timeSlots 和 tasks 的展示方式
      };
  
      const getTaskBarStyle = (task: any) => {
        // 根据任务的开始时间和结束时间计算位置和宽度
        return {
          left: calculatePosition(task.startTime),
          width: calculateWidth(task.startTime, task.endTime),
        };
      };
  
      const calculatePosition = (startTime: string) => {
        // 根据 startTime 计算位置
      };
  
      const calculateWidth = (startTime: string, endTime: string) => {
        // 根据时间差计算宽度
      };
  
      const onAvatarClick = (task: any) => {
        showPopup(`查看任务: ${task.name}`, 'success', 3000);
        // 其他弹框处理逻辑
      };
  
      const addMember = (task: any) => {
        // 添加成员逻辑
        showPopup(`已为任务 ${task.name} 添加成员`, 'success', 3000);
      };
  
      const removeMember = (task: any) => {
        // 删除成员逻辑
        showPopup(`已从任务 ${task.name} 中删除成员`, 'success', 3000);
      };
  
      return {
        selectedDate,
        timeFilter,
        tasks,
        timeSlots,
        setTimeFilter,
        getTaskBarStyle,
        onAvatarClick,
        addMember,
        removeMember,
      };
    },
  });
  </script>
  

<style lang='scss' scoped>
.task-scheduler {
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
  color: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.content {
  display: flex;
  position: relative;
}

.y-axis {
  width: 150px;
}

.x-axis {
  display: flex;
  flex-grow: 1;
}

.task-row {
  margin-bottom: 10px;
  line-height: 30px;
}

.time-slot {
  width: 100px;
  text-align: center;
  line-height: 30px;
}

.task-bars {
  position: absolute;
  top: 0;
  left: 150px;
  display: flex;
  flex-direction: column;
}

.task-bar {
  position: relative;
  display: flex;
  align-items: center;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  margin-bottom: 10px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-left: auto;
  margin-right: 10px;
  cursor: pointer;
}

.el-dropdown-link {
  margin-left: 10px;
}

</style>
