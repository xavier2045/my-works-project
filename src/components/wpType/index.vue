<!-- PurchaseModal.vue -->
<template>
    <div class="modal-container" v-if="isOpen" @click="closeModal">
      <div class="modal-mask"></div>
      <div class="modal-wrapper" @click.stop>
        <div class="modal-wapper-center">
          <div class="masking"></div>
          <div class="modal-main">
            <div class="modal-main-center">
                <div class="purchase-header">作品发布类型</div>
                <div class="license-type">
                    <div 
                    class="type-card"
                    :class="{ active: selectedType === 'basic' }"
                    @click="selectedType = 'basic'"
                    >
                        <div class="license-type-l">
                            <div class="title-box-i"></div>
                        </div>
                        <div class="license-type-r">
                            <div class="type-card-header">
                                <div class="type-card-header-title">
                                    <div class="title-box">
                                        
                                        <div class="title-box-text">普通发布</div>
                                        <div class="title-box-question">
                                            <i class="icon font_family icon-wenhaoyuanquan20"></i> 
                                        </div>
                                    </div>
                                </div>
                                <div class="type-card-header-price"></div>
                            </div>
                            <div class="type-card-body">
                                <div class="body-main">
                                    <div class="body-main-text multi-line-2">普通发布作品的作品用户根据发布者设置的条件可加入二创库，也可下载源文件。</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div 
                    class="type-card"
                    :class="{ active: selectedType === 'pro' }"
                    @click="selectedType = 'pro'"
                    >
                        <div class="license-type-l">
                            <div class="title-box-i"></div>
                        </div>
                        <div class="license-type-r">
                            <div class="type-card-header">
                                <div class="type-card-header-title">
                                    <div class="title-box">
                                        <div class="title-box-text">商业发布</div>
                                        <div class="title-box-question">
                                            <i class="icon font_family icon-wenhaoyuanquan20"></i> 
                                        </div>
                                    </div>
                                </div>
                                <div class="type-card-header-price"></div>
                            </div>
                            <div class="type-card-body">
                                <div class="body-main">
                                    <div class="body-main-text">可进行商业性二次创作；并可获得抽成二次创作获得的利润；商业作品必须去中心化存储。</div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
                <div 
                    class="purchase-btn relievoShadow"
                    :disabled="!isAgreed"
                    @click="handlePurchase"
                >
                    确认
                </div>
            </div>
          </div>
        </div>
        <div class="close" @click="closeModal">
          <i class="icon-close"></i>
        </div>
      </div>
  
    </div>
  </template>
  
  <script lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router';
  import { aeUseStore } from '@/stores/user';
  export default {
  name: 'WpType',
  props: {
    isOpen: {
        type: Boolean,
        required: true
    }
  },
  emits: ['close', 'purchase'],
  setup(props, { emit }) {
        
        const selectedType = ref<'basic' | 'pro'>('basic')
        const months = ref(1)
        const isAgreed = ref(false)
        const router = useRouter();
        const userStore = aeUseStore();
        const userInfo = userStore.getUserInfo;
        
        const handlePurchase = () => {
            // 0: 普通作品 1：商业作品
            userInfo.worksType = selectedType.value == 'basic' ? 0 : 1
            userInfo.openworkType = 1;
            if(selectedType.value == 'basic') {
                router.push({ name: 'Normal' });
            } else if(selectedType.value == 'pro') {
                router.push({ name: 'CommercialUse' });
            }
            closeModal()
        }
        
        const closeModal = () => {
            emit('close')
        }
    return {
        selectedType,
        months,
        isAgreed,
        closeModal,
        handlePurchase,
    };
  },
};
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
            height: 416px;
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
                    background: rgba(0, 0, 0, .15);
                    -webkit-backdrop-filter: blur(38px);
                    backdrop-filter: blur(38px);
                    border: 1px solid rgba(255, 255, 255, .38); 
                }
                .modal-main{
                    width: calc(100% - 60px);
                    height: calc(100% - 60px);
                    padding: 30px;
                    position: absolute;
                    top: 0;
                    left: 0;
                    .modal-main-center{
                        width: 100%;
                        height: 100%;
                        .purchase-header{
                            width: 100%;
                            height: auto;
                            font-weight: 400;
                            font-size: 18px;
                            color: #FFFFFF;
                            line-height: 1;
                            text-align: left;
                            margin-bottom: 20px;
                        }
                        .license-type {
                            width: 100%;
                            height: auto;
                            .type-card {
                                padding: 20px;
                                border-radius: 12px;
                                background: rgba(255,255,255,0.1);
                                border: 1px solid rgba(255, 255, 255, .38);
                                cursor: pointer;
                                transition: all 0.3s;
                                margin-bottom: 20px;
                                &:last-child{
                                    margin-bottom: 10px;
                                }
                                display: flex;
                                .license-type-l{
                                    width: 30px;
                                    height: auto;
                                    flex-shrink: 0;
                                    position: relative;
                                    .title-box-i{
                                        width: 12px;
                                        height: 12px;
                                        border-radius: 50%;
                                        margin: 3px 5px 3px 0;
                                        background: transparent;
                                        border: 1px solid rgba(255, 255, 255, 1);
                                        position: absolute;
                                        top: 50%;
                                        left: 0;
                                        transform: translateY(-50%);
                                    }
                                }
                                .license-type-r{
                                    flex : 1;
                                    width: 0;
                                    .type-card-header{
                                        width: 100%;
                                        height: auto;
                                        display: flex;
                                        justify-content: space-between;
                                        .type-card-header-title{
                                            display: inline-block;
                                            .title-box{
                                                width: 100%;
                                                display: flex;
                                                justify-content: center;
                                                line-height: 18px;
                                                .title-box-text{
                                                    font-weight: 400;
                                                    font-size: 16px;
                                                    color: rgba(255, 255, 255, 1);
                                                    text-align: left;
                                                    margin-right: 3px;
                                                }
                                                .title-box-question{
                                                    font-size: 18px;
                                                    line-height: 18px;
                                                    color: rgba(255, 255, 255, 1);
                                                    display: inline-block;
                                                    
                                                }
                                            }
                                        }
                                        .type-card-header-price{
                                            font-weight: 400;
                                            font-size: 16px;
                                            color: rgba(255, 255, 255, .68);
                                            line-height: 18px;
                                            text-align: right;
                                            span{
                                                color: rgba(255, 255, 255, 1);
                                            }
                                        }
                                    }
                                    .type-card-body{
                                        width: 100%;
                                        height: auto;
                                        margin-top: 20px;
                                        .body-main{
                                            width: 100%;
                                            height: auto;
                                            .body-main-text{
                                                width: 100%;
                                                height: auto;
                                                font-weight: 400;
                                                font-size: 14px;
                                                color: rgba(255, 255, 255, .68);
                                                line-height: 1.3;
                                                text-align: left;
                                                white-space: normal;
                                                word-wrap: break-word;
                                                overflow-wrap: break-word;
                                            }
                                        }
                                    }
                                }
                            } 
                            .active {
                                border-color: #fff;
                                background: rgba(255,255,255,0.2);
                                .title-box-i{
                                    background: rgba(255, 255, 255, 1) !important;
                                    border: 1px solid rgba(255, 255, 255, 1) !important;
                                }
                            }
                        }
                        .purchase-btn {
                            width: 100px;
                            height: 42px;
                            border: none;
                            border-radius: 12px;
                            color: #fff;
                            font-size: 18px;
                            line-height: 42px;
                            cursor: pointer;
                            transition: all 0.3s;
                            margin: 20px auto 0 auto;
                            &:disabled {
                                opacity: 0.5;
                                cursor: not-allowed;
                            }
                        
                            &:not(:disabled):hover {
                                transform: translateY(-2px);
                                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                            }
                        }
                    }
                }
            }
        }
    }
</style>