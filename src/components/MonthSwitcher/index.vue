<template>
    <div class="month-switcher">
        <div class="month-switcher-btn" @click="previousMonth">
            <i class="icon font_family icon-a-jiantouxiangzuoyue20"></i>
        </div>
        <span>{{ currentYear }}年{{ formattedCurrentMonth }}月</span>
        <div class="month-switcher-btn" @click="nextMonth" :class="isNextDisabled ? 'flag' : ''">
            <i class="icon font_family icon-a-jiantouxiangyouyue20"></i>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';

export default defineComponent({
  name: 'MonthSwitcher',
  emits: ['updateDate'],  // Define the emitted event
  setup(props, { emit }) {
    // Reactive state with a new Date object
    const state = reactive({
      currentDate: new Date(),
    });

    // Get today's date to limit the next button
    const today = new Date();

    // Computed properties for year and month
    const currentYear = computed(() => state.currentDate.getFullYear());
    const currentMonth = computed(() => state.currentDate.getMonth());

    // Format the month to always have two digits
    const formattedCurrentMonth = computed(() => (currentMonth.value + 1).toString().padStart(2, '0'));
    // Emit the updated date to the parent component
    const emitDate = () => {
      emit('updateDate', { year: currentYear.value, month: formattedCurrentMonth.value });
    };

    // Function to go to the previous month, creating a new Date object
    const previousMonth = () => {
      let newDate = new Date(state.currentDate);
      newDate.setMonth(state.currentDate.getMonth() - 1);
      state.currentDate = newDate;  // Assign a new Date object
      emitDate();  // Emit the new date
    };

    // Function to go to the next month, creating a new Date object
    const nextMonth = () => {
      if (!isNextDisabled.value) {
        let newDate = new Date(state.currentDate);
        newDate.setMonth(state.currentDate.getMonth() + 1);
        state.currentDate = newDate;  // Assign a new Date object
        emitDate();  // Emit the new date
      }
    };

    // Disable the next button if we reach the current month and year
    const isNextDisabled = computed(() => {
      return (
        state.currentDate.getFullYear() === today.getFullYear() &&
        state.currentDate.getMonth() >= today.getMonth()
      );
    });

    return {
      currentYear,
      currentMonth,
      previousMonth,
      nextMonth,
      isNextDisabled,
      formattedCurrentMonth
    };
  },
});
</script>

<style lang='scss' scoped>
    .month-switcher{
        width: 100%;
        display: flex;
        
        .month-switcher-btn{
            width: 24px;
            height: 24px;
            margin: 11px;
            cursor: pointer;
            border-radius: 50%;
            border: 1px solid rgb(255, 255, 255, .7);
            i{
                font-size: 24px;
                color: #FFFFFF;
                text-align: center;
                line-height: 24px;
            }
        }
        span{
            font-size: 18px;
            color: #FFFFFF;
            line-height: 46px;
            text-align: left;
        }
        .flag{
            border: 1px solid rgb(255, 255, 255, .7);
            i{
                color: rgb(255, 255, 255, .7);
            }
        }
    }
</style>
