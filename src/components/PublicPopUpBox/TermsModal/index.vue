<!-- TermsModal.vue -->
<template>
    <div class="modal-container" v-if="isOpen" @click="$emit('close')">
      <div class="modal-mask"></div>
      <div class="modal-wrapper" @click.stop>
        <div class="modal-wapper-center">
          <div class="masking"></div>
          <div class="terms-content">
            <h2>用户购买作品条款</h2>
            <div class="scroll-content">
              <!-- 根据2.png内容结构化 -->
              <section v-for="(section, index) in terms" :key="index">
                <h3>{{ section.title }}</h3>
                <p v-for="(text, i) in section.content" :key="i">{{ text }}</p>
              </section>
            </div>
            <div class="terms-actions">
              <button @click="$emit('close')">关闭</button>
            </div>
          </div>
        </div>
        <div class="close">
          <i class="icon-close"></i>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  defineProps({
    isOpen: {
      type: Boolean,
      required: true
    }
  })
  
  const terms = ref([
    {
      title: '购买"增强型"权限告知条款',
      content: [
        '尊敬的用户：在您购买"增强型"权限之前...',
        // 根据2.png内容填充
      ]
    },
    {
      title: '您将获得的权利',
      content: [
        '1. 二次创作权：您可以对作品进行修改...',
        // 其他条款内容
      ]
    }
    // 其他条款部分
  ])
  </script>
  
  <style lang="scss" scoped>
  .modal-container{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
    .modal-mask{
      width: 100%;
      height: 100%;
      position: relative;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0);
    }
    .modal-wrapper{
      width: 560px;
      height: 495px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
      white-space: nowrap;
      border-radius: 28px;
      box-shadow: 8px 12px 32px 12px rgba(0, 0, 0, .16);
      .modal-wapper-center{
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 28px;
        .masking{
            width: 100%;
            height: 100%;
            border-radius: 28px;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
            background: rgba(0, 0, 0, .5);
            -webkit-backdrop-filter: blur(38px);
            backdrop-filter: blur(38px);
            border: 1px solid rgba(255, 255, 255, .38); 
            .terms-content {
              padding: 40px;
              color: #fff;
            
              h2 {
                font-size: 24px;
                margin-bottom: 2rem;
              }
            
              .scroll-content {
                max-height: 60vh;
                overflow-y: auto;
                padding-right: 20px;
            
                section {
                  margin-bottom: 2rem;
            
                  h3 {
                    font-size: 18px;
                    margin: 1rem 0;
                    color: #4dabf7;
                  }
            
                  p {
                    line-height: 1.6;
                    margin-bottom: 0.8rem;
                    color: rgba(255,255,255,0.8);
                  }
                }
              }
            }
            
            .terms-actions {
              margin-top: 2rem;
              text-align: center;
            
              button {
                padding: 12px 40px;
                background: #4dabf7;
                border: none;
                border-radius: 25px;
                color: #fff;
                cursor: pointer;
                transition: all 0.3s;
            
                &:hover {
                  opacity: 0.9;
                  transform: translateY(-1px);
                }
              }
            }
          }
        }
      }
    }
  </style>