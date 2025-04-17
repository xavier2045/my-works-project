<template>
  <el-statistic
    :value="displayedValue"
    :formatter="formatValue"
    :suffix="unit"
    show-separator>
  </el-statistic>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, watch } from 'vue';

export default defineComponent({
  name: 'Statistic',
  props: {
    amortized: {
      type: Number,
      default: 1, // 1 转换，2 不转换
      required: false,
      validator(value: number) {
        let amort = Number(value);
          if(amort == null && amort == undefined) {
            amort = 1;
        } else {
          amort = value
        }
        return !isNaN(amort);
      },
    },
    NumberData: {
      type: Number,
      default: 0,
      required: true,
      validator(value: number) {
        if (typeof value === 'string') {
          return !isNaN(parseFloat(value));
        }
        return !isNaN(value);
      },
    },
    duration: {
      type: Number,
      default: 1000,
    },
  },
  setup(props) {
    const displayedValue = ref<number>(0);
    const formattedValue = ref<number>(0);
    const unit = ref<string>('');
    let startTime: number | null = null;

    function formatValue(value: number) {
      return value.toFixed(0);
    }
    function formattedNumber(nums: number) {
      if (typeof nums === 'string') {
        nums = Number(nums);
      }
      if (props.amortized === 2) {
        formattedValue.value = nums;
        unit.value = '';
      } else {
        if (nums >= 100000) {
          formattedValue.value = nums / 10000;
          unit.value = 'W';
        } else if (nums >= 10000) {
          formattedValue.value = nums / 1000;
          unit.value = 'K';
        } else {
          formattedValue.value = nums;
          unit.value = '';
        }
      }
      
    }

    function animateValue(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const currentValue = Math.min(
        formattedValue.value * (progress / props.duration),
        formattedValue.value
      );
      if (props.amortized == 2) {
        displayedValue.value = parseFloat(currentValue.toFixed(3).replace(/\.?0+$/, ''));
      } else {
        displayedValue.value = parseFloat(currentValue.toFixed(2));
      }
      if (progress < props.duration) {
        requestAnimationFrame(animateValue);
      } else {
        displayedValue.value = formattedValue.value;
      }
    }

    watch(() => props.NumberData, () => {
      startTime = null;
      formattedNumber(props.NumberData);
      requestAnimationFrame(animateValue);
    });

    onMounted(() => {
      formattedNumber(props.NumberData);
      requestAnimationFrame(animateValue);
    });

    return {
      displayedValue,
      formatValue,
      unit,
    };
  },
});
</script>

<style scoped>
.el-statistic__content {
  font-family: 'HarmonyOS Sans';
  font-weight: bold;
  font-size: 52px;
  color: #111111;
  line-height: 1;
}
</style>
