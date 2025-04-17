<template>
<div class="modal-container" v-if="isOpen" @click="notifyParent">
    <div class="modal-mask"></div>
    <div class="modal-wrapper">
        <div class="modal-wapper-center" @click.stop>
            <div class="masking"></div>
            <div class="modal-main">
                <div class="modal-main-center">
                    <div class="header">
                        <div class="tab attention_r_bg" :class="activeTab === 'vc' ? 'unchecked' : 'active'" @click="activeTab = 'vc'">
                        验证码登录
                        </div>
                        <div class="tab attention_l_bg" :class="activeTab === 'paw' ? 'unchecked' : 'active'" @click="activeTab = 'paw'">
                        密码登录
                        </div>
                    </div>
                    <div class="login-from">
                        <div class="error-prompt">{{ tips }}</div>
                        <div class="data-from">
                            <template v-if="activeTab === 'vc'">
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
                            </template>
                            <template v-if="activeTab === 'paw'">
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
                                <div 
                                    class="data-from-pwd relievoShadow"
                                    :class="{ focused: isPhoneFocused }"
                                >
                                    <div class="pwd-main">
                                        <div class="pwd-main-input">
                                            <div class="data-from-pwd">
                                                <input 
                                                    type="text" 
                                                    v-model="password"
                                                    @blur="findPhoneFocused()" 
                                                    placeholder="请输入密码"
                                                /> 
                                            </div>
                                        </div>
                                        <div class="pwd-main-fp" @click="openForgot">
                                            忘记密码
                                        </div>
                                    </div>
                                </div>
                            </template>
                            
                            <!-- <div class="data-from-remember">
                                <div class="data-from-remember-main">
                                    <div class="remember-checkbox">
                                        <img :src="checkbox" alt="" @click="checkboxHandler" />
                                    </div>
                                    <div class="remember-tips">保持登录状态</div>
                                </div>
                            </div> -->
                            <div class="data-form-login relievoShadow" @click="loginDebounce">登录</div>
                            <div class="privacyPolicy">
                                <div class="privacyPolicy-main">登录即代表同意<span>《用户协议》</span>与<span>《隐私政策》</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ForgotPwd :isForgotOpen="isForgotOpen" @closeForgot="closeForgot" />
</div>
</template>

<script lang='ts'>
    import { ref, defineComponent, nextTick, onMounted } from 'vue';
    import { login, smsSendCode, smsCountryCode } from '@/api/user'
    import { showPopup } from '@/utils/usePopup';
    import useDebounce from '@/utils/useDebounce';
    import { aeUseStore } from '@/stores/user';
    import { setItem, encryptWithMD5, validatePhone, getItem } from '@/utils/index';
    import Unchecked from '@/assets/images/common/unchecked.png';
    import select from '@/assets/images/common/select.png';
    import close from '@/assets/images/common/close.png';
    import ForgotPwd from '@/components/login/forgotPwd.vue'
    import MpacSelect from '@/components/TreeSelect/mpacSelect.vue'

    export default defineComponent({
        name: 'Login',
        props: {
            isOpen: {
                type: Boolean,
                required: true
            }
        },
        components: {ForgotPwd, MpacSelect},
        emits: ['close'],
        setup(props, { emit }) {
            const tips = ref('');
            const countdown = ref('获取验证码');
            const checkbox = ref(select);
            const isFirstImage = ref(true);
            const phone = ref('');
            const code = ref('666666');
            const countryCode = ref('+86');
            const password = ref('');
            const isPhoneFocused = ref(false);
            const isCodeFocused = ref(false);
            const storedUsername = localStorage.getItem('phone');
            const storedCheck = localStorage.getItem('isFirstImage');
            const activeTab = ref('vc');

            // 获取缓存数据
            const userStore = aeUseStore();
            if (storedUsername && storedCheck) {
                phone.value = storedUsername;
                isFirstImage.value = storedCheck == 'false'? false : true;
                if(isFirstImage.value) {
                    checkbox.value = Unchecked;
                } else {
                    checkbox.value = select;
                }
            }
            countdown.value = '获取验证码';
            console.log(props);
            const notifyParent = () => {
                countdown.value = '获取验证码';
                emit('close');
            };

            function checkboxHandler() {
                if (isFirstImage.value) {
                    checkbox.value = select;
                    isFirstImage.value = false;
                } else {
                    checkbox.value = Unchecked;
                    isFirstImage.value = true;
                    setItem('isFirstImage', 'true');
                }
            }

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

            const selectedValue = ref<string>('+86');
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

            
            // 校验手机号
            function findPhoneFocused () {
                if(validatePhone(phone.value) === false) {
                    isPhoneFocused.value = true;
                    showPopup('手机号不正确，请重新输入！', 'error', 3000);
                } else {
                    isPhoneFocused.value = false;
                }
            }

            // 获取验证码
            const getVerificationCode = useDebounce(findVerificationCode, 300);
            function findVerificationCode() {
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
                let reqData = {};
                if(activeTab.value == 'vc') {
                    reqData = {
                        mobileNo: phone.value,
                        smsCode: code.value || '666666',
                        countryCode: countryCode.value,
                        loginType: 2,
                        terminalType: 1,
                        inviteTestCode: localStorage.getItem('isInvited')
                    }
                } else if(activeTab.value == 'paw') {
                    reqData = {
                        mobileNo: phone.value,
                        smsCode: code.value || '666666',
                        password: encryptWithMD5(password.value),
                        loginType: 1,
                        terminalType: 1
                    }
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

                        if(!isFirstImage.value) {
                            setItem('phone', phone.value);
                            setItem('isFirstImage', 'false');
                            localStorage.setItem('phone', phone.value);
                            localStorage.setItem('isFirstImage', 'false');
                        } else {
                            setItem('phone', '');
                            setItem('isFirstImage', 'true');
                            localStorage.setItem('phone', '');
                            localStorage.setItem('isFirstImage', 'true');
                        }
                        
                        userStore.userInfo.id = resultData.id;
                        userStore.userInfo.uuid = resultData.uuid;
                        userStore.userInfo.isAuth = resultData.isAuth;
                        userStore.userInfo.avatar = resultData.avatar;
                        userStore.userInfo.isLock = resultData.isLock;
                        userStore.userInfo.userName = resultData.username;
                        userStore.userInfo.token = resultData.accessToken;
                        userStore.userInfo.othersId = '';
                        userStore.userInfo.trustValue = resultData.trustValue;
                        userStore.userInfo.refreshToken = resultData.refreshToken;
                        userStore.userInfo.hasLoginPassword = resultData.hasLoginPassword;  // 判断是否有设置密码
                        console.log('login', userStore.userInfo)
                        setItem('userInfo', resultData);
                        setItem('id', resultData.id);
                        setItem('uuid', resultData.uuid);
                        setItem('isAuth', resultData.isAuth);
                        setItem('avatar', resultData.avatar);
                        setItem('isLock', resultData.isLock);
                        setItem('userName', resultData.username);
                        setItem('trustValue', resultData.trustValue);
                        setItem('token', resultData.accessToken);
                        setItem('refreshToken', resultData.refreshToken);
                        setItem('hasLoginPassword', resultData.hasLoginPassword);
                        notifyParent(); // 关闭弹窗
                        resolve()
                    }).catch((error: any) => {
                        reject(error)
                    })
                })
            }

            // 忘记密码
            const isForgotOpen = ref(false);
            const openForgot = () => {
                isForgotOpen.value = true;
            };

            const closeForgot = () => {
                isForgotOpen.value = false;
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
                isSort,
                activeTab,
                checkbox,
                countdown,
                password,
                isForgotOpen,
                isPhoneFocused,
                isCodeFocused,
                selectList,
                countryCode,
                selectedValue,
                getVerificationCode,
                findPhoneFocused,
                checkboxHandler,
                findLoginfun,
                notifyParent,
                loginDebounce,
                openForgot,
                closeForgot,
                handleOpen,
                handleClose,
                updateModelValue,
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
                height: 343px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                text-align: center;
                white-space: nowrap;
                border-radius: 36px;
                .modal-wapper-center{
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    border-radius: 36px;
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
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        .modal-main-center{
                            width: 100%;
                            height: 100%;
                            .header {
                                width: 100%;
                                height: auto;
                                display: flex;
                                .tab {
                                    flex: 1;
                                    width: 0;
                                    cursor: pointer;
                                    font-weight: 400;
                                    font-size: 18px;
                                    color: rgb(255, 255, 255, 1);
                                    line-height: 50px;
                                    text-align: center;
                                }
                                .attention_l_bg {
                                    height: 70px;

                                    background: url(@/assets/images/home/login_pwd_bg.png) no-repeat center center;
                                    background-size: 100% 100%;
                                }
                                .attention_r_bg {
                                    height: 70px;
                                    background: url(@/assets/images/home/login_vc_bg.png) no-repeat center center;
                                    background-size: 100% 100%;
                                }
                                .active {
                                    width: 200px;
                                    flex: initial;
                                    flex-shrink: 0;
                                    color: rgb(255, 255, 255, 0.68);
                                }
                                .unchecked{
                                    background: inherit !important;
                                }
                            }
                            .login-from{
                                width: 100%;
                                height: 100%;
                                .login-from-title{
                                    font-weight: 600;
                                    font-size: 24px;
                                    color: #000000;
                                    line-height: 1;
                                    text-align: center;
                                }
                                .error-prompt{
                                    width: 100%;
                                    height: 14px;
                                    font-weight: 600;
                                    font-size: 14px;
                                    color: #E60012;
                                    line-height: 14px;
                                    text-align: center;
                                    margin: 18px 0 20px 0;
                                }
                                .data-from{
                                    width: calc(100% - 34px);
                                    height: auto;
                                    margin: 0 auto;
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
                                    .data-from-pwd{
                                        height: 40px;
                                        border-radius: 12px;
                                        margin-bottom: 20px;
                                        .pwd-main{
                                            width: 100%;
                                            height: 100%;
                                            display: flex;
                                            .pwd-main-input{
                                                flex: 1;
                                                width: 0;
                                                .data-from-pwd{
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
                                            .pwd-main-fp{
                                                width: 80px;
                                                flex-shrink: 0;
                                                font-size: 14px;
                                                color: rgb(255, 255, 255, 68);
                                                line-height: 40px;
                                                cursor: pointer;
                                            }
                                        }
                                    }
                                    .data-from-remember{
                                        width: 100%;
                                        height: auto;
                                        margin-bottom: 48px;
                                        .data-from-remember-main{
                                            width: 100%;
                                            height: auto;
                                            display: flex;
                                            .remember-checkbox{
                                                width: 26px;
                                                height: 26px;
                                                flex-shrink:0;
                                                cursor: pointer;
                                                margin-right: 7px;
                                                img{
                                                    width: 100%;
                                                    height: 100%;
                                                    display: block;
                                                }
                                            }
                                            .remember-tips{
                                                flex: 1;
                                                width: 0;
                                                font-weight: 600;
                                                font-size: 18px;
                                                color: #111111;
                                                line-height: 26px;
                                                text-align: left;
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
                                    .privacyPolicy{
                                        width: 100%;
                                        margin-top: 20px;
                                        font-weight: 400;
                                        font-size: 14px;
                                        color: rgb(255, 255, 255, .7);
                                        line-height: 1;
                                        text-align: center;
                                        .privacyPolicy-main{
                                            span{
                                                color: rgb(255, 255, 255, 1);
                                            }
                                        }
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
</style>
