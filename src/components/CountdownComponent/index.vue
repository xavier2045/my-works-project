<template>
  <div>
    <p>
      <span v-if="hours">{{ hours }}小时</span><span v-if="minutes">{{ minutes }}分钟</span><span v-if="seconds">{{ seconds }}秒</span>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, watch } from 'vue';

export default defineComponent({
  name: 'CountdownComponent',
  props: {
    type: {
      type: Number,
      required: true,
      validator: (value: number) => [1, 2].includes(value),
    },
    orderTime: {
      type: [String, Date],
      required: true,
    },
    validityMinutes: {
      type: Number,
      default: 30,
    },
    endTime: {
      type: [String, Date],
      default: null,
    },
  },
  setup(props, { emit }) {
    const hours = ref(0);
    const minutes = ref(0);
    const seconds = ref(0);
    const isCountingDown = ref(true);
    let timer: number | null = null;

    const startCountdown = () => {
      const orderDateTime = props.orderTime instanceof Date ? props.orderTime : new Date(props.orderTime);
      let expirationTime: Date;

      if (props.type === 1) {
        const validityMinutes = props.validityMinutes;
        expirationTime = new Date(orderDateTime.getTime() + validityMinutes * 60 * 1000);
      } else if (props.type === 2) {
        if (!props.endTime) {
          console.error('type 为 2 时，必须提供 endTime');
          isCountingDown.value = false;
          return;
        }
        const endDateTime = props.endTime instanceof Date ? props.endTime : new Date(props.endTime);
        expirationTime = endDateTime;
      } else {
        console.error('无效的 type 值');
        isCountingDown.value = false;
        return;
      }

      const updateCountdown = () => {
        const currentTime = new Date();
        const remainingTime = expirationTime.getTime() - currentTime.getTime();

        if (remainingTime <= 0) {
          clearInterval(timer!);
          isCountingDown.value = false;
          hours.value = minutes.value = seconds.value = 0;
          emit('countdownFinished');
        } else {
          hours.value = Math.floor(remainingTime / (1000 * 60 * 60));
          minutes.value = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
          seconds.value = Math.floor((remainingTime % (1000 * 60)) / 1000);
        }
      };

      updateCountdown();
      timer = window.setInterval(updateCountdown, 1000);
    };

    const clearTimer = () => {
      if (timer !== null) {
        clearInterval(timer);
      }
    };

    watch(
      () => [props.type, props.orderTime, props.endTime],
      () => {
        if(props.orderTime == '') {
          clearTimer();
          startCountdown();
        }
      },
      { immediate: true }
    );

    onMounted(() => {
      startCountdown();
    });

    onBeforeUnmount(() => {
      clearTimer();
    });

    return {
      hours,
      minutes,
      seconds,
      isCountingDown,
    };
  },
});
</script>

<style scoped>
/* 添加您的样式 */
</style>
