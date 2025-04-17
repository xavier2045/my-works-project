<template>
<div class="modal-container" v-if="isForgotOpen" @click="notifyParent">
    <div class="modal-mask"></div>
    <div class="modal-wrapper">
        <div class="modal-wapper-center">
            <div class="masking"></div>
            <div class="modal-main">
                <div class="modal-main-center">
                    <div class="modal-main-center">
                    <div class="login-from">
                        <div class="login-from-title">
                            <div class="login-from-title-main">
                                <div class="exhibit-five-back back">
                                    <div class="previous-icon" @click="goBack">
                                        <i class="icon font_family icon-a-jiantouxiangzuoyue20"></i>
                                    </div>
                                </div>
                                <div class="login-from-title-name">忘记密码</div>
                            </div>
                        </div>
                        <div class="error-prompt">{{ tips }}</div>
                        <div class="data-from">
                            <div 
                                class="data-from-phone relievoShadow"
                                :class="{ focused: isPhoneFocused }"
                            >
                                <div class="phone-main">
                                    <div class="phone-main-select">
                                        <MpacSelect
                                            :options="selectList"
                                            v-model="selectedValue"
                                            placeholder="+86"
                                            @open="handleOpen" 
                                            @close="handleClose"
                                            @update:modelValue="updateModelValue"
                                        />
                                    </div>
                                    <div class="phone-main-input">
                                        <div class="data-from-pad">
                                            <input 
                                                type="text" 
                                                v-model.number="phone"
                                                @blur="findPhoneFocused()" 
                                                placeholder="输入手机号码"
                                            /> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="data-from-pass relievoShadow">
                                <div class="data-from-pad">
                                    <input 
                                        :type="isSee ? 'password' : 'text'" 
                                        v-model="password"
                                        placeholder="请输入新密码"
                                        maxlength="16"
                                        @input="validatePassword"
                                    /> 
                                </div>
                                <div class="data-from-eye">
                                    <i 
                                        class="icon font_family"
                                        :class="isSee ? 'icon-biyan24' : 'icon-yanjingguankan20'"
                                        @click="isSee = !isSee"
                                    >
                                    </i>
                                </div>
                            </div>
                            <div class="data-from-pass relievoShadow">
                                <div class="data-from-pad">
                                    <input 
                                        :type="isSee ? 'password' : 'text'" 
                                        v-model="password"
                                        placeholder="确认新密码"
                                        maxlength="16"
                                        @input="validatePassword"
                                    /> 
                                </div>
                                <div class="data-from-eye">
                                    <i 
                                        class="icon font_family"
                                        :class="isSee ? 'icon-biyan24' : 'icon-yanjingguankan20'"
                                        @click="isSee = !isSee"
                                    >
                                    </i>
                                </div>
                            </div>
                            <div 
                                class="data-from-code "
                                :class="{ focused: isCodeFocused }"
                            >
                                <div class="data-from-pad">
                                    <div class="data-from-code-input relievoShadow">
                                        <input 
                                        type="text"
                                        v-model="code"
                                        @focus="isCodeFocused = true" 
                                        @blur="isCodeFocused = false" 
                                        placeholder="输入短信验证码"
                                        />
                                    </div>
                                    <div class="data-from-code-btn relievoShadow">
                                        <div class="acquire" @click="getVerificationCode">{{ countdown }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="data-form-login relievoShadow" @click="loginDebounce">确认</div>
                        </div>
                    </div>
                    <div class="login-banner">
                        
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang='ts'>
    import { ref, defineComponent, nextTick, onMounted } from 'vue';
    import { login, smsCountryCode, smsSendCode } from '@/api/user'
    import { showPopup } from '@/utils/usePopup';
    import useDebounce from '@/utils/useDebounce';
    import { aeUseStore } from '@/stores/user';
    import { setItem, encryptWithMD5, isPasswordValid } from '@/utils/index';
    import close from '@/assets/images/common/close.png';
    import MpacSelect from '@/components/TreeSelect/mpacSelect.vue'

    export default defineComponent({
        name: 'ForgotPwd',
        props: {
            isForgotOpen: {
                type: Boolean,
                required: true
            }
        },
        emits: ['closeForgot'],
        setup(props, { emit }) {
            const tips = ref('输入验证码并设置新密码');
            const countdown = ref('获取验证码');
            const phone = ref('');
            const code = ref('');
            const isPhoneFocused = ref(false);
            const isCodeFocused = ref(false);
            const countryCode = ref('+86');
            // 获取缓存数据
            const userStore = aeUseStore();

            // 忘记密码
            const password = ref('');
            const isSee = ref(true); // 是否显示密码
            const isSetAPassword = ref(false); // 是否显示忘记密码弹窗
            const passTips = ref(''); // 提示信息

            console.log(props);
            const notifyParent = () => {
                emit('closeForgot');
            };

            function getVerificationCode() {
                nextTick(() => {
                    countdown.value = '60s';
                    document.getElementsByClassName('acquire')[0].classList.add('adjunction');
                    let time = 60;
                    let sendData = {
                        mobileNo: phone.value,
                        countryCode: countryCode.value,
                    }
                    return new Promise<void>((resolve, reject) => {
                        smsSendCode(sendData).then((response: any) => {
                            const { code, message } = response;
                            
                            if (code !== 200) {
                                showPopup(message, 'error', 3000);
                                tips.value = message;
                                return;
                            }
                            const timer = setInterval(() => {
                                time--;
                                countdown.value = time + 's';
                                if (time === 0) {
                                    clearInterval(timer);
                                    countdown.value = '获取验证码';
                                    document.getElementsByClassName('acquire')[0].classList.remove('adjunction');
                                }
                            }, 1000);
                            resolve()
                        }).catch((error: any) => {
                            reject(error)
                        })
                    })
                });
            }
            // 防抖函数，使接口提交节流
            const loginDebounce = useDebounce(findLoginfun, 300);
            function findLoginfun() {
                if (code.value == '') {
                    tips.value = '请输入输入短信验证码！';
                    return;
                }
                let reqData = {
                    mobileNo: phone.value,
                    smsCode: code.value || '666666',
                    password: encryptWithMD5('ae123456'),
                    countryCode: countryCode.value,
                    loginType: 2,
                    terminalType: 1
                }
                return new Promise<void>((resolve, reject) => {
                    login(reqData).then((response: any) => {
                        const { code, data, message } = response;
                        
                        const resultData = data;
                        if (code !== 200) {
                            showPopup(message, 'error', 3000);
                            tips.value = message;
                            return;
                        }
                        
                       
                        notifyParent(); // 关闭弹窗
                        resolve()
                    }).catch((error: any) => {
                        reject(error)
                    })
                })
            }

            /** 判断密码格式是否正确， 密码是否一致,密码只能由字母大小写和数字组成，8-16位之间 ***/
            const validatePassword= () => {
                let pw = password.value;
                if (isPasswordValid(pw)) {
                        passTips.value = '';
                } else {
                    passTips.value = '密码必须包含字母和数字，长度为8至16位';
                }
            };

            // 下拉框数据
            const isSort = ref(false);
            const selectList = ref([
                { id: 1, areaCode: '+86', areaName: '中国' },
                { id: 2, areaCode: '+852', areaName: '中国香港' },
                { id: 3, areaCode: '+853', areaName: '中国澳门' },
            ]);

            const findSmsCountryCodeFun = () => {
                let reqData = {}
                return new Promise<void>((resolve, reject) => {
                    smsCountryCode(reqData).then((response: any) => {
                        const { code, data, message } = response;
                        
                        const resultData = data;
                        if (code !== 200) {
                            showPopup(message, 'error', 3000);
                            tips.value = message;
                            return;
                        }
                        
                        selectList.value = resultData;
                        resolve()
                    }).catch((error: any) => {
                        reject(error)
                    })
                })
            };


            const selectedValue = ref<string>('');
            // 展开时添加背景色
            const handleOpen = () => {
                isSort.value = true;
            };
            // 展开时移除背景色
            const handleClose = () => {
                isSort.value = false;
            };

            // 筛选列表
            const updateModelValue = (val: string) => {
                console.log(val);
                countryCode.value = val;
            };

            onMounted(() => {
                nextTick(() => {
                    countdown.value = '获取验证码';
                    // document.getElementsByClassName('acquire')[0].classList.remove('adjunction');
                    findSmsCountryCodeFun();
                })
            })

            return {
                phone,
                code,
                tips,
                close,
                isSee,
                isSort,
                passTips,
                countdown,
                password,
                selectList,
                selectedValue,
                isPhoneFocused,
                isCodeFocused,
                isSetAPassword,
                getVerificationCode,
                handleOpen,
                handleClose,
                findLoginfun,
                notifyParent,
                loginDebounce,
                updateModelValue,
                validatePassword,
                findSmsCountryCodeFun,
            };
        }
    });
</script>

<style lang='scss' scoped>
    .modal-container{
        width: 100%;
        height: 100vh;
        position: fixed;
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
            background: rgba(0,0,0,0.3);
            }
            .modal-wrapper{
                width: 350px;
                height: 400px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                text-align: center;
                white-space: nowrap;
                border-radius: 52px;
                .modal-wapper-center{
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    border-radius: 52px;
                    .masking{
                        width: calc(100% - 2px);
                        height: calc(100% - 2px);
                        border-radius: 36px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        border: 1px solid rgb(255, 255, 255, .38);
                        background: rgba(255, 255, 255, 0.2);
                        backdrop-filter: blur(30px);
                    }
                    .modal-main{
                        width: calc(100% - 34px);
                        height: calc(100% - 50px);
                        padding: 30px 17px 20px 17px;
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
                                    font-size: 18px;
                                    color: rgb(255, 255, 255, 1);
                                    line-height: 35px;
                                    text-align: center;
                                    .login-from-title-main{
                                        width: 100%;
                                        height: auto;
                                        position: relative;
                                        .exhibit-five-back{
                                            width: 35px;
                                            height: 35px;
                                            flex-shrink: 0;
                                            position: absolute;
                                            left: -5px;
                                            top: 0;
                                            background: url(@/assets/images/task/back_bg.png) no-repeat center center;
                                            background-size: 100% 100%;
                                            &:hover{
                                                background: url(@/assets/images/task/back_bg_hover.png) no-repeat center center;
                                                background-size: 100% 100%;
                                                i{
                                                    color: rgb(255, 255, 255, 1);
                                                }
                                            }
                                            .previous-icon{
                                                width: 100%;
                                                height: 100%;
                                                cursor: pointer;
                                                i{
                                                    font-size: 14px;
                                                    color: rgb(255, 255, 255, .50);
                                                    line-height: 35px;
                                                    text-align: center;
                                                    display: block;
                                                }
                                            }
                                        }
                                    }
                                }
                                .error-prompt{
                                    width: 100%;
                                    height: 14px;
                                    font-weight: 600;
                                    font-size: 14px;
                                    color: #E60012;
                                    line-height: 14px;
                                    text-align: center;
                                    margin: 0px 0 10px 0;
                                }
                                .data-from{
                                    width: 100%;
                                    height: auto;
                                    .data-from-phone{
                                        height: 40px;
                                        border-radius: 12px;
                                        margin-bottom: 20px;
                                        .phone-main{
                                            width: 100%;
                                            height: 100%;
                                            display: flex;
                                            .phone-main-select{
                                                width: 100px;
                                                flex-shrink: 0;
                                            }
                                            .phone-main-input{
                                                flex: 1;
                                                width: 0;
                                                .data-from-pad{
                                                    width: 100%;
                                                    height: 100%;
                                                    input{
                                                        width: 100%;
                                                        height: 100%;
                                                        border: none;
                                                        outline: none;
                                                        font-size: 16px;
                                                        color: rgb(255, 255, 255, 1);
                                                        line-height: 24px;
                                                        display: block;
                                                        background-color: inherit;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    .data-from-code{
                                        height: 40px;
                                        border-radius: 16px;
                                        margin-bottom: 30px;
                                        .data-from-pad{
                                            width: 100%;
                                            height: 100%;
                                            display: flex;
                                            .data-from-code-input{
                                                flex: 1;
                                                width: 0;
                                                border-radius: 12px;
                                                input{
                                                    width: 100%;
                                                    height: 100%;
                                                    border: none;
                                                    outline: none;
                                                    font-size: 16px;
                                                    color: rgb(255, 255, 255, 1);
                                                    line-height: 24px;
                                                    display: block;
                                                    background-color: inherit;
                                                }
                                            }
                                            .data-from-code-btn{
                                                width: 106px;
                                                height: 40px;
                                                flex-shrink:0;
                                                font-weight: 500;
                                                font-size: 18px;
                                                text-align: center;
                                                line-height: 40px;
                                                margin-left: 10px;
                                                border-radius: 12px;
                                                .acquire{
                                                    width: 100%;
                                                    height: 100%;
                                                    cursor: pointer;
                                                    color: rgb(255, 255, 255, .7);
                                                    
                                                }
                                                .adjunction{
                                                    width: 100%;
                                                }
                                            } 
                                        }
                                        
                                    }
                                    .data-from-pass{
                                        height: 40px;
                                        display: flex;
                                        margin-bottom: 15px;
                                        border-radius: 12px;
                                        padding: 0 21px 0 26px;
                                        .data-from-pad{
                                            flex: 1;
                                            width: 0;
                                            input{
                                                width: 100%;
                                                height: 100%;
                                                font-size: 16px;
                                                color: #FFFFFF;
                                                line-height: 48px;
                                                text-align: left;
                                                font-style: normal;
                                                text-transform: none;
                                                border: none;
                                                isolation: isolate;
                                                background-color: transparent;
                                                &::placeholder {
                                                    color: rgb(255, 255, 255, 0.68);
                                                    font-size: 12px;
                                                }
                                            }
                                        }
                                        .data-from-eye{
                                            width: 24px;
                                            flex-shrink: 0;
                                            margin-left: 7px;
                                            cursor: pointer;
                                            i{
                                                font-size: 24px;
                                                color: rgba(255, 255, 255, .8);
                                                display: block;
                                                line-height: 48px;
                                            }
                                        }
                                    }
                                    .data-form-login{
                                        width: 110px;
                                        height: 44px;
                                        border-radius: 12px;
                                        font-weight: 600;
                                        font-size: 20px;
                                        color: #FFFFFF;
                                        line-height: 44px;
                                        text-align: center;
                                        cursor: pointer;
                                        margin: 0 auto;
                                    }
                                }
                                .focused{
                                    background: rgba(255,255,255,0.4) !important;
                                }
                            }
                        }
                    }
                }
            }
    }
    .popupModal{
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 9;
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
        .popupModal-wrapper{
            width: 400px;
            height: auto;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            .popupModal-wapper-center{
                position: relative;
                border-radius: 24px;
                overflow: hidden;
                padding: 49px 20px 53px 20px;
                border: 1px solid rgb(255, 255, 255, .38);
                box-shadow: 0px 9px 18px 9px rgb(0, 0, 0, .15);
                .popupModal-wrapper-mask{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: -1;
                    background: rgba(255,255,255,0.06);
                    backdrop-filter: blur(68px);
                }
                .user-info-tip{
                    width: 198px;
                    height: 58px;
                    font-size: 18px;
                    color: #FFFFFF;
                    line-height: 58px;
                    text-align: center;
                    font-style: normal;
                    text-transform: none;
                    border-radius: 30px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    border: 1px solid rgba(255,255,255,.38);
                    background-color: rgba(255, 255, 255, .16);
                    backdrop-filter: blur(36px);
                }
                .password-from{
                    width: 100%;
                    height: auto;
                    isolation: isolate;
                    .password-from-title{
                        width: 100%;
                        font-weight: 600;
                        font-size: 20px;
                        color: #FFFFFF;
                        line-height: 1;
                        text-align: center;
                        font-style: normal;
                        text-transform: none;
                    }
                    .password-from-tips{
                        width: 100%;
                        height: 14px;
                        font-weight: 600;
                        font-size: 14px;
                        color: #E60012;
                        line-height: 14px;
                        text-align: center;
                        margin: 10px 0 17px 0;
                    }
                    .password-prompt{
                        width: 100%;
                        font-size: 14px;
                        color: rgba(255, 255, 255, .8);
                        line-height: 1;
                        text-align: center;
                        font-style: normal;
                        text-transform: none;
                        margin-top: 16px;
                    }
                    .error-tips{
                        width: 100%;
                        font-size: 14px;
                        color: #E60012;
                        line-height: 1;
                        text-align: center;
                        margin-top: 10px;
                        display: block;
                    }
                    .data-from{
                        height: auto;
                        margin-top: 35px;
                        
                        .form-submit-password{
                            width: 100%;
                            height: 53px;
                            margin-top: 30px;
                            font-weight: 600;
                            font-size: 15px;
                            color: #FFFFFF;
                            line-height: 53px;
                            text-align: center;
                            font-style: normal;
                            text-transform: none;
                            border-radius: 26px;
                            cursor: pointer;
                            background-color: rgba(0, 0, 0, .2);
                            backdrop-filter: blur(36px);
                        }
                    }
                }
            }
            .close{
                width: 34px;
                height: 34px;
                cursor: pointer;
                margin: 30px auto 0 auto;
                i{
                    font-size: 34px;
                    color: #000000;
                    display: block;
                }
            }
        }
    }
</style>
