<!-- PurchaseModal.vue -->
<template>
    <div class="modal-container" v-if="isOpen" @click="closeModal">
      <div class="modal-mask"></div>
      <div class="modal-wrapper" @click.stop>
        <div class="modal-wapper-center">
          <div class="masking"></div>
          <div class="modal-main">
            <div class="modal-main-center">
                <div class="purchase-header">购买授权类型</div>
                <div class="license-type">
                <div 
                  class="type-card"
                  :class="{ active: selectedType === 'basic', disabled: detailsData.hasBuyTypeOne == 1 }"
                  @click="selectedType = 'basic'"
                >
                    <div class="type-card-header">
                        <div class="type-card-header-title">
                            <div class="title-box">
                                <div class="title-box-i"></div>
                                <div class="title-box-text">普通型</div>
                                <div class="title-box-question" @click.stop="findTypeMsgPopupFun(1)">
                                    <i class="icon font_family icon-wenhaoyuanquan20"></i> 
                                </div>
                            </div>
                        </div>
                        <div class="type-card-header-price"><span>{{ detailsData.sellOne|| 0 }}元</span></div>
                    </div>
                    <div class="type-card-body">
                        <div class="body-main">
                            <div class="body-main-text multi-line-2">可在购买后查看、欣赏或在个人范围内使用作品，仅限于个人、非商业目的，例如个人学习、欣赏。</div>
                            <!-- <div class="body-main-number">
                                <div class="counter">
                                    <div class="counter-btn relievoShadow" @click="decrement">
                                        <i class="icon font_family icon-jianhao24"></i> 
                                    </div>
                                    <input 
                                        type="text" 
                                        v-model.number="months"
                                        min="1"
                                        @input="validateMonths"
                                    />
                                    <div class="counter-btn relievoShadow" @click="increment">
                                        <i class="icon font_family icon-jiahao24"></i> 
                                    </div>
                                </div>
                            </div> -->
                        </div>
                    </div>
                </div>
  
                <div 
                  class="type-card"
                  :class="{ active: selectedType === 'pro' }"
                  @click="selectedType = 'pro'"
                >
                    <div class="type-card-header">
                        <div class="type-card-header-title">
                            <div class="title-box">
                                <div class="title-box-i"></div>
                                <div class="title-box-text">增强型</div>
                                <div class="title-box-question" @click.stop="findTypeMsgPopupFun(2)">
                                    <i class="icon font_family icon-wenhaoyuanquan20"></i> 
                                </div>
                            </div>
                        </div>
                        <div class="type-card-header-price"><span>{{ detailsData.sellTwo || 0 }}元</span>/3个月</div>
                    </div>
                    <div class="type-card-body">
                        <div class="body-main">
                            <div class="body-main-text">在授权期内，允许进行商业目的的二次创作；若通过平台授权获得收益，则须自动按照发布者设定的比例将收益分配给原作者。</div>
                            <div class="body-main-number">
                                <div class="counter">
                                    <div class="counter-btn relievoShadow" @click="decrement">
                                        <i class="icon font_family icon-jianhao24"></i> 
                                    </div>
                                    <input 
                                        type="text" 
                                        v-model.number="months"
                                        min="1"
                                        @input="validateMonths"
                                    />
                                    <div class="counter-btn relievoShadow" @click="increment">
                                        <i class="icon font_family icon-jiahao24"></i> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                <div class="total-price">
                    合计：{{ totalPrice }}元
                </div>
                <div 
                    class="purchase-btn relievoShadow"
                    :disabled="!isAgreed"
                    @click="findBuyNowFun"
                >
                    立即购买
                </div>
                <!-- <div class="terms-agree">
                    <label>
                        <input 
                            type="checkbox" 
                            v-model="isAgreed"
                        > 购买即代表您已阅读并同意
                    </label>
                    <a @click="showTerms">《用户购买条款》</a>
                </div> -->
                <div class="check-clause" @click="checkboxHandler">
                    <div class="check-clause-box">
                    <img :src="checkbox" alt="" />
                    </div>
                    <div class="check-clause-text">购买即代表您已阅读并同意<span @click="findTypeMsgPopupFun(3)">《用户购买条款》</span></div>
                </div>
            </div>
          </div>
        </div>
        <div class="close" @click="closeModal">
          <i class="icon-close"></i>
        </div>
    </div>

    <div class="popupModal" v-if="isClause" @click="isClause = false">
        <div class="masking"></div>
        <div class="popupModal-center" @click.stop>
            <div class="popupModal-main">
                <div class="popupModal-module"></div>
                <div class="popupModal-main-content">
                <div class="popupModal-main-title">确认购买</div>
                <div class="popupModal-main-tips">请阅读并同意《用户购买条款》</div>
                <div class="popupModal-main-but-group">
                    <div class="popupModal-main-but relievoShadow" @click="handlePurchase">继续发布</div>
                </div>
                </div>
            </div>
        </div>
    </div>
  
      <TermsModal 
        :isOpen="showTermsModal"
        @close="showTermsModal = false"
      />
      <MsgPopup
      v-model="isDialogVisible"
      :title="dialogTitle"
      :content="dialogContent"
      :type="dialogType"
      @close="closeMsgPopup"
      @dialog-result="handleDialogResult"
    />
    </div>
  </template>
  
  <script setup lang="ts">
    import { ref, computed, watch, onMounted } from 'vue'
    import MsgPopup from '@/components/msgPopup/msg/index.vue';
    import TermsModal from '@/components/PublicPopUpBox/TermsModal/index.vue'
    import NoCheck from '@/assets/images/common/noCheck.png';
    import Check from '@/assets/images/common/check.png';
    
    const props = defineProps({
        detailData: { 
            type: Object,
            required: true
        },
        isOpen: {
        type: Boolean,
        required: true
        }
    })
  
    const emit = defineEmits(['close', 'purchase']);
    const detailsData = ref(props.detailData);
    const selectedType = ref<'basic' | 'pro'>('basic');
    const isClause = ref(false);
    const months = ref(1);
    const isAgreed = ref(false);
    const showTermsModal = ref(false);
    const checkbox = ref(NoCheck); // 勾选用户发布条款
  
    const unitPrice = computed(() => 
        selectedType.value === 'basic' ? detailsData.value.sellOne : detailsData.value.sellTwo
    )

    // const totalPrice = computed(() => {
    //     if (selectedType.value === 'basic') {
    //         return detailsData.value.sellOne.toLocaleString();
    //     } else {
    //         return (unitPrice.value * months.value).toLocaleString();
    //     }
    // })
    const totalPrice = computed(() => {
        if (selectedType.value === 'basic') {
            return detailsData.value.sellOne ? detailsData.value.sellOne.toLocaleString() : '0';
        } else {
            return unitPrice.value && months.value ? (unitPrice.value * months.value).toLocaleString() : '0';
        }
    });

    // 监听 selectedType 的变化，重置 months 为 1
    watch(selectedType, (newVal) => {
        if (newVal === 'basic') {
            months.value = 1;
        }
    });
  
    const validateMonths = () => {
        if (months.value < 1) months.value = 1
    }
    
    const increment = () => months.value++
    const decrement = () => months.value > 1 && months.value--
    
    const showTerms = () => {
        showTermsModal.value = true
    }
    
    const handlePurchase = () => {
        emit('purchase', {
        type: selectedType.value,
        months: months.value,
        amount: unitPrice.value * months.value
        })
        closeModal()
    }

    // 打开消息弹框 type 1通知、2需要同意的通告
    const isDialogVisible = ref(false);
    const dialogTitle = ref('');
    const dialogContent = ref('');
    const dialogType = ref(1);
    const findTypeMsgPopupFun = (type: number) => {
        if(type == 1) {
        dialogTitle.value = '普通型';
        dialogContent.value = '<p>购买后，您仅可出于个人非商业目的（如个人学习或欣赏）对该作品进行查看、欣赏或使用。</p>'+
                                '<p>如需作品终身版权或其他使用权，可以联系作者或者平台。</p>';
        dialogType.value = 1;
        isDialogVisible.value = true;
        } else if(type == 2) {
        dialogTitle.value = '增强型';
        dialogContent.value = '<h3>二次创作权</h3><p>您可以对原作品进行修改、调整或衍生，创作新的作品（以下简称“二次创作作品”）</p>'+
                                '<h3>商业使用权</h3><p>您可以将二次创作作品用于商业目的，包括但不限于销售、广告、营销、商业项目等。</p>'+
                                '<h3>分发与展示权</h3><p>您可以分发、展示或传播二次创作作品，但不得将授权权利转让给第三方。</p>'
                                '<p>如需作品终身版权或其他使用权，可以联系作者或者平台。</p>';
        dialogType.value = 1;
        isDialogVisible.value = true;
        } else if(type == 3) {
        dialogTitle.value = '用户购买作品声明告知条款';
        dialogContent.value = '<h3>第一条：总则</h3>'+
                                '<p>1、AE平台致力于协助去中心化创业人运用去中心化解决实际问题 提供相关技术支持等服务。</p>'+
                                '<p>2、当您同意本公约并按照页面提示，完成全部的团队创建和数字身份提交并通过平台审核后，成为团队管理者。</p>'+
                                '<p>3、您了解并知悉，平台有权独立决定您创建团队是否通过及团队 内数字身份是否合规。'+
                                '<h3>第二条：定义与解释</h3>'+
                                '<p>1、AE平台旗下去中心化团队组织工具，您可以通过AE平台发行数字身份、活动门票数字证明、作品数字证明、铸造上链分享、传 播、流通您享有版权或自主创作的作品极其相关内容，也可使用平台提供的技术辅助、数据统计工具等。平台将通过区块链技术 及智能合约在双方约定的范围内为您的团队建设与治理、数字内容管理提供便利，平台用户可以在平台内接收AE平台社区内容、 数字身份、数字门票、数字内容等在线内容。</p>'+
                                '<p>2、AE平台支持各种类型的数字创业者或其他从业者，您可以是画家、任务发布者、活动策划者、接收任务、参与活动、作者、收藏家或其他职业有创造力、公信力、领导力、统筹力的从业者。</p>'+
                                '<p>3、AE平台支持数字身份铸造上链、活动发布、作品专利保护售卖 及空投、优先购、打折卡等功能，数字作品上传支持jpg/GIF图 片、FBX/GLB格式3D模型，将续支持word/PDF/TXT/PPT文本、 MP4/APE/FLAC音乐、MPEG视频等数字资产类型。文件下载支持图 片、zip文件包下载。'+
                                '<p>您作为管理者，对AE平台相关数字作品上传者或提供者及权限开放者，须确认相关铸造上链数字作品及前述数字作品作品相关的封面、创作者姓名、肖像权、标识、作品权益，及您提供的相关 宣传资料、文案等内容为原创或拥有版权以及版权约定内的商业 行为，且上链内容不得二次铸造上链，即您确认享有数字作品铸 造上链相关内容权利及进行前述操作的全部权利，且平台按照与 您约定的方式在平台内或宣传使用数字作品内容不会侵犯第三方 的合法权益，亦无需另行取得第三方同意或向其承担责任。</p>';

        dialogType.value = 2;
        isDialogVisible.value = true;
        }
    };
    const handleDialogResult = (result: 'agree' | 'disagree' | 'timeout') => {
        switch (result) {
        case 'agree':
            console.log('用户同意了公告');
            checkbox.value = Check;
            // 执行同意后的逻辑
            break;
        case 'disagree':
            console.log('用户不同意公告');
            checkbox.value = NoCheck;
            // 执行不同意后的逻辑
            break;
        case 'timeout':
            console.log('对话框超时关闭');
            // 执行超时逻辑
            break;
        }
    };
    const closeMsgPopup = () => {
        isDialogVisible.value = false;
    };

    // 勾选用户购买条款
    const checkboxHandler = () => {
        if (checkbox.value == NoCheck) {
            checkbox.value = Check;
        } else {
            checkbox.value = NoCheck;
        }
    }

    // 立即购买
    const findBuyNowFun = () => {
        if (checkbox.value == Check) {
            let getData = {
                buyNum: selectedType.value === 'basic' ? 1 : months.value,
                buyType: selectedType.value === 'basic' ? 1 : 2,
                amount: totalPrice.value
            }
            emit('purchase', getData)
        } else {
            findTypeMsgPopupFun(3);
        }
    }
    
    const closeModal = () => {
        emit('close')
    }
    watch(() => props.detailData, (newDetails) => {
        detailsData.value = newDetails;
    }, { immediate: true });
    onMounted(() => {
        detailsData.value = props.detailData;
    });
  </script>
  
  <style lang="scss" scoped>
    @use '@/assets/styles/popupModal.scss';
    .modal-container{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 10;
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
                                            .title-box-i{
                                                width: 12px;
                                                height: 12px;
                                                border-radius: 50%;
                                                margin: 3px 5px 3px 0;
                                                background: transparent;
                                                border: 1px solid rgba(255, 255, 255, 1);
                                            }
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
                                        display: flex;
                                        .body-main-text{
                                            flex: 1;
                                            width: 0;
                                            font-weight: 400;
                                            font-size: 14px;
                                            color: rgba(255, 255, 255, .68);
                                            line-height: 1.3;
                                            text-align: left;
                                            white-space: normal;
                                            word-wrap: break-word;
                                            overflow-wrap: break-word;
                                        }
                                        .body-main-number{
                                            width: 100px;
                                            flex-shrink: 0;
                                            margin-left: 50px;
                                            position: relative;
                                            .counter {
                                                display: flex;
                                                align-items: center;
                                                position: absolute;
                                                top: 50%;
                                                right: 0;
                                                transform: translateY(-50%);
                                                .counter-btn {
                                                    width: 22px;
                                                    height: 22px;
                                                    border-radius: 50%;
                                                    background: rgba(255, 255, 255, 0.1);
                                                    backdrop-filter: blur(57px);
                                                    color: #fff;
                                                    border: none;
                                                    cursor: pointer;
                                                    transition: all 0.3s;
                                                    display: block;
                                                    i{
                                                        font-size: 18px;
                                                        text-align: center;
                                                        line-height: 22px;
                                                        color: rgba(255, 255, 255, .38);
                                                    }
                                                    &:hover {
                                                        i{
                                                            color: rgba(255, 255, 255, 1);
                                                        }
                                                    }
                                                }
                                            
                                                input {
                                                    width: 50px;
                                                    text-align: center;
                                                    background: transparent;
                                                    border: none;
                                                    color: #fff;
                                                    font-size: 16px;
                                                    padding: 8px;
                                                }
                                            }
                                        }
                                    }
                                }
                                &.active {
                                    border-color: #fff;
                                    background: rgba(255,255,255,0.2);
                                    .title-box-i{
                                        background: rgba(255, 255, 255, 1) !important;
                                        border: 1px solid rgba(255, 255, 255, 1) !important;
                                    }
                                }
                            }
                            .disabled {
                                opacity: 0.5;
                                pointer-events: none;
                                cursor: not-allowed;
                            }
                        }
                        .total-price {
                            font-size: 20px;
                            color: #fff;
                            margin-bottom: 10px;
                            text-align: center;
                        }
                        .terms-agree {
                            font-size: 14px;
                            text-align: center;
                            color: rgba(255,255,255,0.8);
                            margin: 20px 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            a {
                                color: #4dabf7;
                                cursor: pointer;
                                text-decoration: underline;
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
                            margin: 0 auto;
                            &:disabled {
                                opacity: 0.5;
                                cursor: not-allowed;
                            }
                        
                            &:not(:disabled):hover {
                                transform: translateY(-2px);
                                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                            }
                        }
                        .check-clause{
                            width: 100%;
                            height: auto;
                            font-size: 14px;
                            display: flex;
                            margin-top: 20px;
                            justify-content: center;
                            .check-clause-box{
                                width: 25px;
                                height: 25px;
                                margin-right: 5px;
                                img{
                                    width: 25px;
                                    height: 25px;
                                    border-radius: 50%;
                                }
                            }
                            .check-clause-text{
                                font-weight: 400;
                                font-size: 14px;
                                color: rgba(255, 255, 255, .68);
                                line-height: 25px;
                                text-align: left;
                                span{
                                    cursor: pointer;
                                    color: #FFFFFF;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .popupModal{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        clip-path: inset(0 0 0 0); /* 限制蒙版显示范围 */
        .strPopup{
            width: 640px;
            margin: 0;
            padding: 0;
            border-radius: 28px;
            .generic-table-container{
                border-radius: 28px;
            }
        }
    }
</style>