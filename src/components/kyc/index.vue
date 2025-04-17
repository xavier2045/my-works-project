<!-- 实名认证 -->
<template>
    <div class="modal-container" v-if="isOpen">
        <div class="modal-mask"></div>
        <div class="modal-wrapper">
            <div class="modal-wapper-center">
                <div class="masking"></div>
                <div class="modal-main" v-if="isPrivacy">
                    <div class="modal-main-center">
                        <div class="login-from">
                            <div class="login-from-title">实名认证</div>
                            <div class="data-from">
                                <div 
                                    class="data-from-phone parentPhonr"
                                    :class="{ focused: isRealNameFocused }"
                                >
                                    <div class="data-from-pad">
                                    <input 
                                            type="text" 
                                            v-model="realName"
                                            @focus="isRealNameFocused = false" 
                                            @blur="findRealNameFocused" 
                                            placeholder="请输入您的真实姓名"
                                            maxlength="60"
                                        /> 
                                    </div>
                                </div>
                                <div 
                                    class="data-from-phone parentPhonr"
                                    :class="{ focused: isPhoneFocused }"
                                >
                                    <div class="data-from-pad">
                                        <input 
                                            type="text" 
                                            v-model="idCard"
                                            @focus="isPhoneFocused = false" 
                                            @blur="findIdCardFun"  
                                            placeholder="请输入您的身份证号"
                                            maxlength="25"
                                        /> 
                                        <span class="errorPrompt" v-if="isErrorCard">请输入正确的身份证号</span>
                                    </div>
                                </div>
                                <div class="data-from-remember">
                                    <div class="data-from-remember-main">
                                        <div class="remember-checkbox">
                                            <i 
                                                class="icon font_family" 
                                                :class="isAgree ? 'icon-weixuanzebiankuangzhengfangxing24' : 'icon-yixuanzebiankuangzhengfangxing24'"
                                                @click="checkboxHandler"
                                            >
                                            </i>
                                        </div>
                                        <div class="remember-tips">阅读并同意<span @click="findisPrivacyFun">《个人隐私保护政策》</span></div>
                                    </div>
                                </div>
                                <div class="data-form-login" @click="loginDebounce">提交认证</div>
                            </div>
                        </div>
                        <div class="login-banner">
                            
                        </div>
                    </div>
                </div>
                <div class="privacy-policy" v-else>
                    <div class="privacy-policy-main">
                        <div class="privacy-policy-content">
                            <div class="privacy-policy-title">个人隐私保护政策</div>
                            <div class="privacy-policy-text">{{ privacyPolicy }}</div>
                        </div>
                        <div class="privacy-policy-btn">
                            <div class="privacy-policy-btn-cancel" @click="isPrivacy = true">取消</div>
                            <div class="privacy-policy-btn-agree" @click="consentPolicy">同意</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="close" @click="notifyParent">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div>
        </div>
    </div>
    </template>
    
    <script lang='ts'>
        import { ref, defineComponent, onUnmounted } from 'vue';
        import { realNameAuth } from '@/api/user'
        import useDebounce from '@/utils/useDebounce';
        import { aeUseStore } from '@/stores/user';
        import { findCodeFun } from '@/utils/index';
        import { showPopup } from '@/utils/usePopup';
    
        import close from '@/assets/images/common/close.png';
        
    
        export default defineComponent({
            name: 'Kyc',
            props: {
                isOpen: {
                    type: Boolean,
                    required: true
                }
            },
            emits: ['close'],
            setup(props, { emit }) {
                const countdown = ref('获取验证码');
                const isAgree = ref(true);
                const isPrivacy = ref(true);
                const idCard = ref('');
                const realName = ref('');
                const isRealNameFocused = ref(false);
                const isPhoneFocused = ref(false);
                const isCodeFocused = ref(false);
                const isErrorCard = ref(false);
                // 获取缓存数据
                const userStore = aeUseStore();

                const privacyPolicy = ref('欢迎使用深圳爱智科技有限公司（以下简称“我们”或“公司”）提供的服务。在您使用我们的服务时，为了保护您的合法权益，我们将对身份证信息的使用进行详细说明。请您在使用我们的服务前仔细阅读本协议。若您不同意本协议的任何内容，您应立即停止使用我们的服务。一旦您选择使用我们的服务，即表示您同意本协议的全部内容。')
    
                console.log(props);
                const notifyParent = () => {
                    emit('close');
                };
    
                function checkboxHandler() {
                    if (isAgree.value) {
                        isAgree.value = false;
                    } else {
                        isAgree.value = true;
                    }
                }

                function findRealNameFocused() {
                    if(realName.value == '') {
                        isRealNameFocused.value = true;
                    } else {
                        isRealNameFocused.value = false;
                    }
                }

                // 校验身份证号失去焦点时触发
                let timeoutId: number|undefined;
                function findIdCardFun() {
                    isPhoneFocused.value = false;
                    if(findCodeFun(idCard.value) === false) {
                        isPhoneFocused.value = true;
                        isErrorCard.value = true;
                        idCard.value = '';
                    } else {
                        isPhoneFocused.value = false;
                    }
                    timeoutId = setTimeout(() => {
                        isErrorCard.value = false;
                    }, 3000);
                }

                // 查看隐私政策
                function findisPrivacyFun() {
                    isPrivacy.value = !isPrivacy.value;
                };
                // 同意隐私政策
                function consentPolicy() {
                    isPrivacy.value = true;
                    isAgree.value = false;
                };
    
                // 防抖函数，使接口提交节流
                const loginDebounce = useDebounce(findLoginfun, 300);
                function findLoginfun() {
                    let isNull = true;
                    if(realName.value === '') {
                        isNull = false;
                        isRealNameFocused.value = true;
                    } else {
                        isNull = true;
                        isRealNameFocused.value = false;
                    }
                    if(idCard.value === '') {
                        isNull = false;
                        isPhoneFocused.value = true;
                    } else {
                        isNull = true;
                        isPhoneFocused.value = false;
                    }

                    if(isNull == false) {
                        return false;
                    }

                    // 是否同意隐私协议1是0否
                    let reqData = {
                    idCard: idCard.value,
                    realName: realName.value,
                    isAgree: isAgree.value ? 0 : 1, 
                    }
                    return new Promise<void>((resolve, reject) => {
                        realNameAuth(reqData).then((response: any) => {
                            const { code, message } = response;
                            
                            if (code !== 200) {
                                showPopup(message, 'error', 3000);
                                return;
                            }
                            userStore.userInfo.isAuth = 1;
                            notifyParent(); // 关闭弹窗
                            resolve()
                        }).catch((error: any) => {
                            reject(error)
                        })
                    })
                }
                onUnmounted(() => {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                });
                return {
                    idCard,
                    isAgree,
                    realName,
                    close,
                    isPrivacy,
                    countdown,
                    privacyPolicy,
                    isPhoneFocused,
                    isRealNameFocused,
                    isCodeFocused,
                    isErrorCard,
                    timeoutId,
                    checkboxHandler,
                    findLoginfun,
                    notifyParent,
                    loginDebounce,
                    findisPrivacyFun,
                    consentPolicy,
                    findIdCardFun,
                    findRealNameFocused
                };
            }
        });
    </script>
    
    <style lang='scss' scoped>
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
                background: rgba(0,0,0,0);
            }
            .modal-wrapper{
                width: 464px;
                height: 440px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                text-align: center;
                white-space: nowrap;
                border-radius: 60px;
                .modal-wapper-center{
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    border-radius: 60px;
                    .masking{
                        width: 100%;
                        height: 100%;
                        border-radius: 60px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 0;
                        background: rgba(255, 255, 255, .16);
                        -webkit-backdrop-filter: blur(57px);
                        backdrop-filter: blur(57px);
                        border: 1px solid rgba(255, 255, 255, .38); 
                    }
                    .modal-main{
                        width: calc(100% - 61px);
                        height: calc(100% - 112px);
                        padding: 51px 31px 61px 31px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        .modal-main-center{
                            width: 100%;
                            height: 100%;
                            .login-from{
                                width: 100%;
                                height: 100%;
                                .login-from-title{
                                    font-weight: 600;
                                    font-size: 20px;
                                    color: #FFFFFF;
                                    line-height: 1;
                                    text-align: center;
                                    font-style: normal;
                                    text-transform: none;
                                    margin-bottom: 30px;
                                }
                                .data-from{
                                    width: 100%;
                                    height: auto;
                                    .data-from-phone{
                                        height: 40px;
                                        border-radius: 16px;
                                        margin-bottom: 20px;
                                        padding: 10px 10px 8px 10px;
                                        border: 1px solid #FFFFFF;
                                        background: rgba(225,225,225,0.5);
                                        .data-from-pad{
                                            width: 100%;
                                            height: 100%;
                                            position: relative;
                                            input{
                                                width: 100%;
                                                height: 100%;
                                                border: none;
                                                outline: none;
                                                font-size: 16px;
                                                color: #111111;
                                                line-height: 24px;
                                                display: block;
                                                background-color: inherit;
                                            }
                                            .errorPrompt{
                                                font-weight: 400;
                                                font-size: 14px;
                                                color: #FFFFFF;
                                                line-height: 1;
                                                text-align: left;
                                                font-style: normal;
                                                text-transform: none;
                                                border-radius: 12px;
                                                padding: 14px 37px;
                                                position: absolute;
                                                top: 20px;
                                                left: 50%;
                                                transform: translateX(-50%);
                                                background: rgba(0,0,0,0.7);
                                                -webkit-backdrop-filter: blur(20px);
                                                backdrop-filter: blur(20px);
                                            }
                                        }
                                        
                                    }
                                    
                                    .data-from-remember{
                                        width: 100%;
                                        height: auto;
                                        margin: 3px 0 43px 0;
                                        .data-from-remember-main{
                                            width: 100%;
                                            height: auto;
                                            display: flex;
                                            .remember-checkbox{
                                                width: 24px;
                                                flex-shrink:0;
                                                cursor: pointer;
                                                margin-right: 10px;
                                                i{
                                                    font-size: 24px;
                                                    color: #FFFFFF;
                                                    display: block;
                                                }
                                            }
                                            .remember-tips{
                                                flex: 1;
                                                width: 0;
                                                font-weight: 400;
                                                font-size: 16px;
                                                color: #FFFFFF;
                                                line-height: 24px;
                                                text-align: left;
                                                font-style: normal;
                                                text-transform: none;
                                                span{
                                                    cursor: pointer;
                                                    &:hover{
                                                        text-decoration: underline;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    .data-form-login{
                                        width: 100%;
                                        height: 60px;
                                        background: rgba(17,17,17,0.5);
                                        border-radius: 30px;
                                        font-weight: 600;
                                        font-size: 18px;
                                        color: #FFFFFF;
                                        line-height: 60px;
                                        text-align: center;
                                        font-style: normal;
                                        text-transform: none;
                                        cursor: pointer;
                                    }
                                }
                                .focused{
                                    background: rgba(255,255,255,0.4) !important;
                                }
                            }
                        }
                    }
                    .privacy-policy{
                        width: calc(100% - 61px);
                        height: calc(100% - 92px);
                        padding: 51px 31px 41px 31px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        .privacy-policy-main{
                            width: 100%;
                            height: 100%;
                            .privacy-policy-content{
                                width: 100%;
                                height: calc(100% - 72px);
                                overflow-y: auto;
                                /* 火狐浏览器滚动条样式 */
                                @supports (-moz-appearance: none) {
                                    scrollbar-width: thin;

                                    ::-moz-scrollbar-track {
                                        background-color: rgba(225,225,225,0);  /* 轨道颜色 */
                                        border-radius: 2px;
                                    }

                                    ::-moz-scrollbar-thumb {
                                        background-color: rgba(225,225,225,0.2);  /* 滑块颜色 */
                                        border-radius: 2px;
                                        width: 4px;
                                    }

                                    ::-moz-scrollbar-thumb:hover {
                                    background-color: rgba(225,225,225,0.2);  /* 悬停时滑块颜色 */
                                    }
                                }
                                /* 通用滚动条样式 */
                                &::-webkit-scrollbar { /* 整个滚动条 */
                                    width: 4px; /* 滚动条宽度 */
                                }
                                &::-webkit-scrollbar-track { /* 滚动条轨道 */
                                    background: rgba(225,225,225,0); 
                                }
                                &::-webkit-scrollbar-thumb { /* 滚动条滑块 */
                                    background: rgba(225,225,225,0.2); 
                                    border-radius: 2px;
                                }
                                &::-webkit-scrollbar-thumb:hover { /* 鼠标悬停时滚动条滑块样式 */
                                    background: rgba(225,225,225,0.2); 
                                }
                                .privacy-policy-title{
                                    width: 100%;
                                    font-weight: 600;
                                    font-size: 20px;
                                    color: #FFFFFF;
                                    line-height: 1;
                                    text-align: center;
                                    font-style: normal;
                                    text-transform: none;
                                    margin-bottom: 23px;
                                }
                                .privacy-policy-text{
                                    width: 100%;
                                    height: calc(100% - 43px);
                                    font-weight: 400;
                                    font-size: 16px;
                                    color: #FFFFFF;
                                    line-height: 28px;
                                    text-align: left;
                                    font-style: normal;
                                    text-transform: none;
                                    white-space: normal;
                                    word-wrap: break-word;
                                    overflow-wrap: break-word;
                                }
                            }
                            .privacy-policy-btn{
                                width: 100%;
                                height: 52px;
                                display: flex;
                                font-weight: 400;
                                font-size: 16px;
                                color: #FFFFFF;
                                line-height: 52px;
                                text-align: center;
                                font-style: normal;
                                text-transform: none;
                                margin-top: 20px;
                                justify-content: space-between;
                                .privacy-policy-btn-cancel{
                                    width: 160px;
                                    height: 52px;
                                    cursor: pointer;
                                    border-radius: 26px;
                                    background-color: rgba(0,0,0,0.3);
                                }
                                .privacy-policy-btn-agree{
                                    width: 160px;
                                    height: 52px;
                                    cursor: pointer;
                                    border-radius: 26px;
                                    background-color: rgba(0,0,0,0.5);
                                }
                            }
                        }
                    }
                }
                .close{
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    cursor: pointer;
                    position: relative;
                    left: 50%;
                    bottom: -40px;
                    transform: translate(-50%,-50%);
                    i{
                        font-size: 34px;
                        display: block;
                    }
                }
            }
        }
    </style>
    
