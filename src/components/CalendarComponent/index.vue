<template>
    <div class="calendar">
      <div class="calendar-header">
        <div class="day" v-for="day in days" :key="day">{{ day }}</div>
      </div>
      <div class="calendar-body">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="day-cell"
          :class="{ 
            'not-current-month': !day.isCurrentMonth,
            'presence-data': day.events.length > 0
          }"
          @click="handleDayClick(day)"
        >
          <div class="date-number">
            <span>
              <template v-if="day.isAudit">
                <div class="examine">审</div>
              </template>
            </span>
            <span
              :class="day.isTime ? 'current-day' : ''"
            >
              {{ day.date?.getDate() }}
            </span>
          </div>
          
          <div class="events overflowYAuto" v-if="day.events.length > 0">
            <div
              v-for="event in day.events"
              :key="event.id"
              class="event"
              :class="{ 
                timeout: event.auditStatus === 0,
                clickable: event.auditStatus === 1,
                audited: event.auditStatus === 2 || event.auditStatus === 3 || event.auditStatus === 4,
              }"
              @click.stop="event.auditStatus === 1 ? onEventClick(event) : null"
            >
              <img :src="event.userAvatar" alt="event" />
              <span>
                <template v-if="event.auditStatus == 0">需要上传节点</template>
                <template v-else-if="event.auditStatus == 1">节点待审核</template>
                <template v-else-if="event.auditStatus == 2">节点审核成功</template>
                <template v-else-if="event.auditStatus == 3">节点审核失败</template>
                <template v-else-if="event.auditStatus == 4">未上传节点</template>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed, PropType } from 'vue';
  
  interface Event {
    id: number;
    userId: number;
    deadline: Date | null;
    auditStatus: number;
    userAvatar: string;
    message: string;
  }
  
  interface Day {
    date: Date | null;
    isCurrentMonth: boolean;
    isAudit: boolean;
    isTime: boolean;
    events: Event[];
  }
  
  export default defineComponent({
    name: 'CalendarComponent',
    props: {
      date: {
        type: String as PropType<string>, // Format: 'YYYY-MM'
        required: true,
      },
      events: {
        type: Array as PropType<{ time: string; nodeData: Event[] }[]>,
        required: true,
      },
      onDateClick: {
        type: Function as PropType<(date: Date) => void>,
        required: true,
      },
      onEventClick: {
        type: Function as PropType<(event: Event) => void>,
        required: true,
      },
    },
    setup(props) {
        const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    
        // Convert props.date ('YYYY-MM') to a Date object
        const currentMonth = computed(() => {
            const [year, month] = props.date.split('-').map(Number);
            return new Date(year, month - 1, 1); // JavaScript Date month is zero-based
        });
    
        // Generate calendar dates with events
        const calendarDays = computed(() => {
            const start = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), 1);
            const end = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 0);

            const startOffset = (start.getDay() + 6) % 7; // 调整到周一
            start.setDate(start.getDate() - startOffset);

            const dates: Day[] = [];
            let current = new Date(start);

            while (current <= end || current.getDay() !== 1) {
              const adjustedDate = new Date(current.getTime() - (current.getTimezoneOffset() * 60 * 1000));
              const formattedDate = adjustedDate.toISOString().split('T')[0];

              console.log('Current Date:', current, 'Formatted Date:', formattedDate);
              const eventForDay = props.events.find((event) => event.time === formattedDate);
              console.log('Event for Day1:', eventForDay);
              // 判断是否有未上传的节点
              const hasAuditStatus1 = eventForDay?.nodeData.some(event => event.auditStatus === 1);
              // 判断是否有过期为上传的节点
              if (eventForDay) {
                eventForDay.nodeData.forEach(event => {
                  if(event.auditStatus == 0) {
                    if (new Date(event.deadline) < new Date()) {
                        event.auditStatus = 4;
                    }
                  }
                });
              }
              console.log('Event for Day3:', eventForDay);
              dates.push({
                  date: new Date(current),
                  isCurrentMonth: current.getMonth() === currentMonth.value.getMonth(),
                  isAudit: hasAuditStatus1 ? true : false,
                  isTime: current.getFullYear() === new Date().getFullYear() &&
                          current.getMonth() === new Date().getMonth() &&
                          current.getDate() === new Date().getDate(),
                  events: eventForDay ? [...eventForDay.nodeData] : [], // 深拷贝
              });
              console.log('Event for dates:', dates);
              current.setDate(current.getDate() + 1);
            }

            console.log('dates Array (final):', dates); // 调试输出
            return dates;
        });




  
        const handleDayClick = (day: Day) => {
            if (day.isCurrentMonth && day.date) {
            props.onDateClick(day.date);
            }
        };
    
        return {
            days,
            calendarDays,
            handleDayClick,
        };
    },
  });
  </script>
  
  <style lang="scss" scoped>
  .calendar {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    // gap: 10px;
    .calendar-header {
      width: 100%;
      height: 54px;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      font-weight: bold;
      border-bottom: 1px solid #ccc;
      background-color: rgb(255, 255, 255, .06);
      backdrop-filter: blur(20px);
      .day{
        color: #FFFFFF;
        font-size: 14px;
        line-height: 54px;
        border-right: 1px solid #ccc;
        &:last-child{
          border-right: none;
        }
      }
    }
    .calendar-body{
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0px;
      .day-cell {
        min-height: 126px;
        padding: 5px;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        &:nth-child(7n){
          border-right: none;
        }
        &:nth-last-child(-n+7){
          border-bottom: none;
        }
      }
      .not-current-month {
        // background-color: rgb(255, 255, 255, .16);
      }
      .presence-data{
        background-color: rgb(255, 255, 255, .06);
        backdrop-filter: blur(20px);
      }
      .date-number {
        font-size: 14px;
        font-weight: bold;
        text-align: right;
        color: #FFFFFF;
        padding-right: 10px;
        font-size: 16px;
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        span{
          font-size: 16px;
          color: #FFFFFF;
          line-height: 20px;
          display: inline-block;
          &:first-child{
            width: 20px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            border-radius: 50%;
          }
          .examine{
            width: 20px;
            height: 20px;
            margin: 5px 0;
            text-align: center;
            line-height: 20px;
            border-radius: 50%;
            background-color: red;
          }
        }
        .current-day{
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border-radius: 50%;
          background-color: rgb(255, 255, 255, .36);
        }
      }
      
      .events {
        margin-top: 10px;
        height: calc(130px - 24px);
        line-height: 32px;
        .event {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 5px;
          font-size: 12px;
          border-radius: 16px;
          padding: 0 3px;
          color: rgb(255, 255, 255, .7);
          border: 1px solid rgb(255, 255, 255, .38);
          background-color: rgb(255, 255, 255, .06);
          backdrop-filter: blur(20px);
          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }
        }
        .clickable {
          cursor: pointer;
          color: #FFFFFF;
          background-color: rgb(255, 255, 255, .36);
          backdrop-filter: blur(20px);
        }
        .audited{
          background-color: rgb(255, 255, 255, .06);
          backdrop-filter: blur(20px);
        }
        .timeout{
          background-color: transparent;
          border: 1px dashed rgb(255, 255, 255, .38);
        }
      }
    }
  }
  </style>
  