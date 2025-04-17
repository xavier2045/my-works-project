<template>
  <div class="container">
    <div
      class="vote-div left-div"
      :style="{ width: `${leftWidth}%` }"
      @click="handleVote('dislike')"
      :class="{ disabled: voted }"
    >
      <div class="vote-div-wrapper"></div>
      <div class="vote-div-content">
        <i class="icon font_family icon-buzantong24"></i>
      </div>
    </div>
    <div
      class="vote-div right-div"
      :style="{ width: `${rightWidth}%`,}"
      @click="handleVote('like')"
      :class="{ disabled: voted }"
    >
      <div class="vote-div-wrapper"></div>
      <div class="vote-div-content">
        <i class="icon font_family icon-zantong24"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';

export default defineComponent({
  name: 'LikeDislikeBar',
  props: {
    id: {
      type: String,
      required: true,
    },
    initialLikes: {
      type: Number,
      default: 0,
    },
    initialDislikes: {
      type: Number,
      default: 0,
    },
    voted: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['vote'],

  setup(props, { emit }) {
    const likes = ref(props.initialLikes || 0); // 假设初始值为0
    const dislikes = ref(props.initialDislikes || 0); // 假设初始值为0
    const voted = ref(props.voted); // 是否禁止
    const isLikeSelected = ref(false);
    const isDislikeSelected = ref(false);

    // 计算投票占比的通用函数
    const calculatePercentage = (part: number, total: number) => {
      return Math.max((part / total) * 100, 20);
    };

    const leftWidth = computed(() => {
      const total = likes.value + dislikes.value;
      return total === 0 ? 50 : calculatePercentage(dislikes.value, total);
    });

    const rightWidth = computed(() => {
      const total = likes.value + dislikes.value;
      return total === 0 ? 50 : calculatePercentage(likes.value, total);
    });

    // 处理投票点击逻辑的通用函数
    const handleVote = (type: 'like' | 'dislike') => {
      if (voted) {
        if (type === 'like') {
          likes.value += 1;
          isLikeSelected.value = true;
          isDislikeSelected.value = false;
        } else {
          dislikes.value += 1;
          isDislikeSelected.value = true;
          isLikeSelected.value = false;
        }
        emit('vote', type, props.id); // 通知父组件
      }
    };
    watch(() => props.initialLikes, (newVal, oldVal) => {
      likes.value = newVal;
    });

    watch(() => props.initialDislikes, (newVal, oldVal) => {
      dislikes.value = newVal;
    });
    watch(() => props.voted, (newVal, oldVal) => {
      voted.value = newVal;
    });

    
    
    return {
      voted,
      likes,
      dislikes,
      leftWidth,
      rightWidth,
      isLikeSelected,
      isDislikeSelected,
      handleVote,
    };
  },
});
</script>

<style scoped lang='scss'>
.container {
  display: flex;
  width: 100%;
  height: 40px;
  .vote-div {
    
    color: white;
    font-weight: bold;
    height: 40px;
    position: relative;
    transition: width 0.5s ease, opacity 0.3s ease;
    cursor: pointer;
    i{
      font-size: 24px;
      color: #FFFFFF;
      line-height: 40px;
    }
    .vote-div-wrapper{
      width: 100%;
      height: 100%;
      // background-color: rgb(255, 255, 255, .26);
    }
    
  }

  .left-div {
    // clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
    .vote-div-wrapper{
      width: 100%;
      height: 100%;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      background: url(@/assets/images/dao/vote_l.png) no-repeat right;
    }
    .vote-div-content{
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      padding-left: 20px;
      text-align: left;
    }
  }
  .right-div {
    // background-color: rgb(255, 255, 255, .26);
    // clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%);
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    cursor: pointer;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    overflow: hidden;
    .vote-div-wrapper{
      width: 100%;
      height: 100%;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      background: url(@/assets/images/dao/vote_r.png) no-repeat left;
    }
    .vote-div-content{
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      padding-right: 20px;
      text-align: right;
    }
  }
}

.disabled {
  pointer-events: none;
  cursor: not-allowed !important;
}
</style>
