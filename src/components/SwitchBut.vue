<template>
    <div class="switch-container">
      <label class="switch">
        <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)"/>
        <span class="slider round"></span>
        <span v-if="labelText" :class="['label-text', modelValue ? 'left' : 'right']">{{ modelValue ? labelText[0] : labelText[1] }}</span>
      </label>
    </div>
</template>
   
<script>
export default {
  name: 'SwitchComponent',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    labelText: {
      type: Array,
      default: null
    }
  }
};
</script>
   
<style scoped>
.switch-container {
  display: flex;
  justify-content: flex-end;
}

.label-text {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: rgb(255, 255, 255, .7);
  pointer-events: none; /* 防止文字干扰点击事件 */
}

.left {
  left: 10px; /* 文字显示在左侧 */
}

.right {
  right: 10px; /* 文字显示在右侧 */
}

.switch {
  position: relative;
  display: inline-block;
  width: 58px;
  height: 39px;
  background: url(@/assets/images/publish/switch_bg.png) no-repeat center center;
  background-size: 100% 100%;
}

/* Hide default checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 9px;
  bottom: 12px;
  background-color: rgb(255, 255, 255, .58);
  -webkit-transition: .4s;
  transition: .4s;
}

/* input:checked + .slider {
  background-color: initial;
}

input:checked + .slider:before {
  -webkit-transform: translateX(21px);
  -ms-transform: translateX(21px);
  transform: translateX(21px);
} */
input:checked + .slider:before {
  background-color: rgb(255, 255, 255, 1); /* 选中时颜色为白色 */
  -webkit-transform: translateX(21px);
  -ms-transform: translateX(21px);
  transform: translateX(21px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 50%;
}

.slider.round:before {
  border-radius: 50%;
}
</style>