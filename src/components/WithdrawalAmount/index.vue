<template>
    <div class="popupModal" @click="handleCancel">
        <div class="modal-mask"></div>
        <div class="popupModal-wrapper user-info" @click.stop>
            <div class="popupModal-wapper-center">
                <div class="popupModal-wrapper-mask"></div>
                <div class="withdral-from">
                    <div class="withdraw-title">
                        <div class="withdraw-title-main">
                            作品提现
                            <i 
                              class="icon font_family icon-wenhaoyuanquan20 cursorPointer"
                              @click.stop="isTips = !isTips"></i>
                        </div>
                        <div v-if="isTips" class="withdraw-title-sub">提现金额根据账户入账额度确定</div>
                    </div>
                    <div class="withdraw-line"></div>
                    <div class="withdraw-amount">
                        <div class="withdraw-amount-title">提现金额</div>
                        <div class="withdraw-amount-val">
                            可提现金额：¥ {{ balance || 0 }}
                        </div>
                    </div>
                    <div class="item-main">
                        <div class="item-main-flex inputBg">
                            <div class="input_bg">
                                <div class="input_bg_l"></div>
                                <div class="input_bg_c"></div>
                                <div class="input_bg_r"></div>
                            </div>
                            <div class="item-main-flex-main" :class="{ focused: amountEr }">
                                <div class="item-main-flex-head">
                                    <div class="head-main">
                                    <div class="item-main-icon">
                                        <i class="icon font_family icon-chongzhi24"></i>
                                    </div>
                                    <div class="item-main-name">提现金额</div>
                                    </div>
                                </div>
                                <div class="item-main-content">
                                    <div class="item-main-time">
                                    <div class="item-main-time-group">
                                        <div class="item-main-slider">
                                        <div class="item-main-slider-num">
                                            <input
                                                type="text"
                                                v-model="reqData.amount" 
                                                maxlength="9"
                                                @input="handleAmountValue"
                                            />
                                        </div>
                                        </div>
                                    </div>
                                    <div class="item-main-time-group-input-unit">元</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item-main">
                        <div class="withdrawal-type">
                            <div
                                :class="['withdrawal-type-item', index == isWdType ? 'flag' : '']"
                                v-for="(item, index) in wdData"
                                :key="index"
                                @click="findWdType(index)"
                            >
                                <div class="withdrawal-type-item-main">
                                    <div class="item-icon">
                                        <i :class="['icon font_family', item.icon]"></i>
                                    </div>
                                    <div class="item-name">{{ item.name }}</div>
                                    <div class="item-seles">
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <template v-if="isWdType == 0">
                        <div class="item-main">
                            <div class="item-main-flex inputBg">
                                <div class="input_bg">
                                    <div class="input_bg_l"></div>
                                    <div class="input_bg_c"></div>
                                    <div class="input_bg_r"></div>
                                </div>
                                <div class="item-main-flex-main" :class="{ focused: accountEr }">
                                    <div class="item-main-flex-head">
                                        <div class="head-main">
                                        <div class="item-main-icon">
                                            <i class="icon font_family icon-shenfenID24"></i>
                                        </div>
                                        <div class="item-main-name">支付宝账号</div>
                                        </div>
                                    </div>
                                    <div class="item-main-content">
                                        <div class="item-main-time">
                                            <div class="item-main-time-group">
                                                <div class="item-main-slider">
                                                <div class="item-main-slider-num">
                                                    <input
                                                    type="text"
                                                    v-model="reqData.account" 
                                                    maxlength="36"
                                                    />
                                                </div>
                                                </div>
                                            </div>
                                            <div class="item-main-time-group-input-unit"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item-main">
                            <div class="item-main-flex inputBg">
                                <div class="input_bg">
                                    <div class="input_bg_l"></div>
                                    <div class="input_bg_c"></div>
                                    <div class="input_bg_r"></div>
                                </div>
                                <div class="item-main-flex-main" :class="{ focused: realNameEr }">
                                    <div class="item-main-flex-head">
                                        <div class="head-main">
                                        <div class="item-main-icon">
                                            <i class="icon font_family icon-wanshangerenxinxi24"></i>
                                        </div>
                                        <div class="item-main-name">真实姓名</div>
                                        </div>
                                    </div>
                                    <div class="item-main-content">
                                        <div class="item-main-content-flex">
                                            <div class="item-main-slider-num">
                                                <div class="item-main-slider">
                                                <div class="item-main-slider-num">
                                                    <input
                                                    type="text"
                                                    v-model="reqData.realName" 
                                                    maxlength="64"
                                                    />
                                                </div>
                                                </div>
                                            </div>
                                            <div class="item-main-slider-unit"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-if="isWdType == 1">
                        <div class="item-main">
                            <div class="item-main-flex inputBg overflowInherit">
                                <div class="input_bg">
                                    <div class="input_bg_l"></div>
                                    <div class="input_bg_c"></div>
                                    <div class="input_bg_r"></div>
                                </div>
                                <div class="item-main-pulldown" :class="{ focused: bankNameEr }">
                                    <div class="item-main-pulldown-content">
                                        <div class="item-main-pulldown-flex cursorPointer">
                                        <div class="item-main-pulldown-flex-l">
                                            <div class="item-main-pulldown-flex-l-m">
                                                <div class="item-main-pulldown-flex-l-m-icon">
                                                    <i class="icon font_family icon-feiyong24"></i>
                                                </div>
                                                <div class="item-main-pulldown-flex-l-m-name">开户银行</div>
                                            </div>
                                        </div>
                                        <div class="item-main-pulldown-flex-c" @click.stop="toggleDropdown('modele1')">
                                            <div class="item-main-pulldown-flex-c-m">
                                                <span class="item-main-pulldown-flex-c-m-name multi-line-1">
                                                    {{ bankNames }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="item-main-pulldown-flex-r" @click.stop="toggleDropdown('modele1')">
                                            <i 
                                            class="icon font_family"
                                            :class="currentDropdown === 'modele1' ? 'icon-a-jiantouxiangshangshousuo24' : 'icon-a-jiantouxiangxiazhankai24'"
                                            >
                                            </i>
                                        </div>
                                        </div>
                                    </div>
                                    <div class="item-main-pulldown-module dropdown" v-if="currentDropdown === 'modele1'" @click.stop>
                                        <div class="module-content">
                                        <div class="module-content-list overflowYAuto">
                                            <div 
                                            class="module-content-list-item"
                                            v-for="(item, index) in selectBank"
                                            :key="index"
                                            @click="findPublicTypeFun(item)"
                                            >
                                            <div class="item-name">{{ item.bankName }}</div>
                                            <div
                                                class="item-select" 
                                                :class="{ 'item-active': item.bankCode === reqData.bankCode }"
                                            >
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item-main">
                            <div class="item-main-flex inputBg">
                                <div class="input_bg">
                                    <div class="input_bg_l"></div>
                                    <div class="input_bg_c"></div>
                                    <div class="input_bg_r"></div>
                                </div>
                                <div class="item-main-flex-main" :class="{ focused: bankCardEr }">
                                    <div class="item-main-flex-head">
                                        <div class="head-main">
                                        <div class="item-main-icon">
                                            <i class="icon font_family icon-yinhangka421"></i>
                                        </div>
                                        <div class="item-main-name">银行卡号</div>
                                        </div>
                                    </div>
                                    <div class="item-main-content">
                                        <div class="item-main-time">
                                        <div class="item-main-time-group">
                                            <div class="item-main-slider">
                                            <div class="item-main-slider-num">
                                                <input
                                                type="text"
                                                v-model="reqData.bankCard" 
                                                maxlength="19"
                                                @input="handleInput"
                                                />
                                            </div>
                                            </div>
                                        </div>
                                        <div class="item-main-time-group-input-unit"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item-main">
                            <div class="item-main-flex inputBg">
                                <div class="input_bg">
                                    <div class="input_bg_l"></div>
                                    <div class="input_bg_c"></div>
                                    <div class="input_bg_r"></div>
                                </div>
                                <div class="item-main-flex-main" :class="{ focused: cardHolderEr }">
                                    <div class="item-main-flex-head">
                                        <div class="head-main">
                                        <div class="item-main-icon">
                                            <i class="icon font_family icon-wanshangerenxinxi24"></i>
                                        </div>
                                        <div class="item-main-name">持卡人姓名</div>
                                        </div>
                                    </div>
                                    <div class="item-main-content">
                                        <div class="item-main-time">
                                        <div class="item-main-time-group">
                                            <div class="item-main-slider">
                                            <div class="item-main-slider-num">
                                                <input
                                                type="text"
                                                v-model="reqData.cardHolder" 
                                                maxlength="36"
                                                />
                                            </div>
                                            </div>
                                        </div>
                                        <div class="item-main-time-group-input-unit"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rateOfRate">手续费¥{{ handlingFee }}(费率{{ rateOfRate }}%)</div>
                    </template>
                    <div class="withdraw-but relievoShadow" @click="findWithdrawFun">立即提现</div>
                </div>
            </div>
        </div>
        <div class="popupModal" v-if="isShow" @click="isShow = false">
            <div class="masking"></div>
            <div class="popupModal-center" @click.stop>
                <div class="popupModal-main">
                    <div class="popupModal-module"></div>
                    <div class="popupModal-main-content">
                    <div class="popupModal-main-title">{{ witdrawaTitle }}</div>
                    <div class="popupModal-main-tips">{{ witdrawaContent }}</div>
                    <div class="popupModal-main-but-group">
                        <div class="popupModal-main-but relievoShadow" @click="isShow = false">确认</div>
                    </div>
                    </div> 
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script lang="ts">
    import { defineComponent, onMounted, ref } from 'vue';
    import { countIncomeWeek, orderWithdrawSave } from '@/api/pay';
    import { showPopup } from '@/utils/usePopup';
    import { aeUseStore } from '@/stores/user';
    import { getItem, computeHmac } from '@/utils/index';
    import BankBinMap from '@/assets/json/bankBinMap.json';
  
  export default defineComponent({
    name: 'WithdrawModal',
    setup(props, { emit }) {
        const reqData = ref({
            realName: '',  // 真实姓名
            account: '',  // 支付宝账号
            withdrawWay: 1,  // 提现方式
            amount: null as number | null,  // 提现金额
            bankCode: '',  // 开户行代码
            bankCard: '', // 银行卡
            cardHolder: '',  // 持卡人姓名
            poundage: 0,  // 手续费
            timeStamp: null as number | null,  // 时间戳
            sign: '',  // 签名
        });

        const amountEr = ref(false);
        const accountEr = ref(false);
        const realNameEr = ref(false);
        const bankCardEr = ref(false);
        const cardHolderEr = ref(false);
        const bankNameEr = ref(false);

        const isTips = ref(false);
        const witdrawaTitle = ref('');
        const witdrawaContent = ref('');
        const isShow = ref(false);
        const balance = ref(0);  // 余额
        const handlingFee = ref(0.03); // 手续费
        const rateOfRate = ref(0.03); // 手续费是否显示
        const isWdType = ref(0); // 提现方式
        const wdData = ref([
            { id: 1, name: '支付宝提现', icon: 'icon-weixinbiankuang42' },
            { id: 2, name: '银行卡提现', icon: 'icon-qianbao24' },
        ])
        const userStore = aeUseStore();
        const userInfo = userStore.getUserInfo;

        const findWdType = (index: number) => {
            isWdType.value = index;
            reqData.value.withdrawWay = index;
        }

        // 提现金额
        const handleAmountValue = (event: any) => {
            const value = event.target.value;
            // 使用正则表达式限制输入为数字和最多两位小数
            const regex = /^\d+(\.\d{0,2})?$/;

            if (regex.test(value) && parseFloat(value) > 0) {
                reqData.value.amount = value;
            } else {
            // 如果输入不符合要求，则保留之前的合法值
            event.target.value = reqData.value.amount || '';
            }
        }

        const currentDropdown = ref<string | null>(null);
        const toggleDropdown = (dropdownName: string) => {
            currentDropdown.value = currentDropdown.value === dropdownName ? null : dropdownName;
            console.log('currentDropdown.value1', currentDropdown.value);
            document.addEventListener('click', handleClickOutside);
            
        };
        const handleClickOutside = () => {
            currentDropdown.value = null;
        };

        const selectBank = ref<{ bankIds: string[]; bankCode: string; bankName: string; }[]>([]);
        const bankNames = ref(''); // 银行名称
        const findPublicTypeFun = (item: any) => {
            reqData.value.bankCode = item.bankCode;
            bankNames.value = item.label;
            handleClickOutside();
        };

        const isValidCardNumber = (cardNumber: string) => {
            // 移除所有非数字字符
            cardNumber = cardNumber.replace(/\D/g, '');

            // 检查长度
            if (cardNumber.length < 16 || cardNumber.length > 19) {
                return false;
            }

            // Luhn算法校验
            let sum = 0;
            for (let i = 0; i < cardNumber.length; i++) {
                let digit = parseInt(cardNumber.charAt(i), 10);
                if (i % 2 === 0) {
                    digit *= 2;
                    if (digit > 9) {
                        digit = digit - 9;
                    }
                }
                sum += digit;
            }
            return sum % 10 === 0;
        }

        // 定义类型
        const cardNumber = ref<string>("");
        const result = ref<string>("请输入银行卡号");
        const resultClass = ref<string>("");

        const loadBankBinMap = async () => {
            try {
                selectBank.value = BankBinMap;
            } catch (error) {
                console.error("加载BIN表失败:", error);
                result.value = "加载银行数据失败";
                resultClass.value = "error";
            }
        };

        // 获取银行信息
        const getBankInfo = (cardNum: string): { bankName: string; bankCode: string } => {
            const bin = cardNum.slice(0, 4); // 用前4位匹配
            console.log("selectBank.value", selectBank.value);
            const bankInfo = selectBank.value.find((item) => item.bankIds.includes(bin));
            console.log(`尝试匹配 BIN: ${bin}`, bankInfo); // 调试日志
            return bankInfo
                ? { bankName: bankInfo.bankName, bankCode: bankInfo.bankCode }
                : { bankName: "未知银行", bankCode: "UNKNOWN" };
        };        // 输入处理
        const handleInput = () => {
            // 只保留数字
            cardNumber.value = reqData.value.bankCard.replace(/\D/g, "");

            if (cardNumber.value.length < 4) {
                result.value = "请输入至少4位以检测银行";
                return;
            }

            const { bankName, bankCode } = getBankInfo(cardNumber.value);
            if (bankName === "未知银行") {
                showPopup('无法识别该银行卡', 'error', 3000);
            } else {
                if (cardNumber.value.length >= 16 && cardNumber.value.length <= 19) {
                const isValid = isValidCardNumber(cardNumber.value);
                result.value = isValid
                    ? `归属银行：${bankName} (银行代码: ${bankCode}, 校验通过)`
                    : `归属银行：${bankName} (银行代码: ${bankCode}, 校验未通过，可能输入错误)`;
                resultClass.value = isValid ? "success" : "error";
                } else {
                    console.log('归属银行', result.value);
                    bankNames.value = bankName;
                    reqData.value.bankCode = bankCode;
                }
            }
        };

      // 提现操作
      const findWithdrawFun = () => {
        const { withdrawWay, account, realName, amount, poundage } = reqData.value;
        let timestamp = Date.now();
        let userId = '';
        if(userStore.userInfo.id !== '') {
            userId = userStore.userInfo.id;
        } else {
            userId = getItem('id');
        }
        // 签名=Base64(HmacSHA256(withdrawWay + account + realName + amount + poundage + timeStamp, userId))
        let content = withdrawWay + account + realName + amount + poundage + timestamp;
        // 校验金额
        if (Number(amount) > Number(balance.value)) {
            showPopup('输入金额超过可提现金额', 'error', 3000);
            amountEr.value = true;
            return;
        } else if (Number(amount) < 0.01) {
            showPopup('提现金额不能小于0.01元', 'error', 3000);
        } else if (Number(amount) > 100000) {
            showPopup('单日最高提现金额为100000元，请修改', 'error', 3000);
        } else {
            amountEr.value = false;
        }

        // 校验提现方式
        if (isWdType.value === 0) {
          if (!account) {
            showPopup('请输入支付宝账号', 'error', 3000);
            accountEr.value = true;
            return;
          } else {
            accountEr.value = false;
          }
          if (!realName) {
            showPopup('请输入真实姓名', 'error', 3000);
            realNameEr.value = true;
            return;
          } else {
            realNameEr.value = false;
          }
        } else if (isWdType.value === 1) {
          if (!reqData.value.bankCard) {
            showPopup('请选择开户银行', 'error', 3000);
            bankNameEr.value = true;
            return;
          } else {
            bankNameEr.value = false;
          }
          if (!isValidCardNumber(reqData.value.bankCard)) {
            showPopup('请输入正确的银行卡号', 'error', 3000);
            bankCardEr.value = true;
            return;
          } else {
            bankCardEr.value = false;
          }
          if (!reqData.value.cardHolder) {
            showPopup('请输入持卡人姓名', 'error', 3000);
            cardHolderEr.value = true;
            return;
          } else {
            cardHolderEr.value = false;
          }
        }
  
        let getData = {
            withdrawWay: withdrawWay,
            account: account,
            realName: realName,
            amount: amount,
            poundage: poundage,
            timeStamp: timestamp,
            sign: computeHmac(content.toString(), userId.toString())
        }
        
        return new Promise<void>((resolve, reject) => {
            orderWithdrawSave(getData).then((response: any) => {
                const { code, data, message } = response;
                
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                witdrawaTitle.value = '您已成功提现¥' + amount;
                if (isWdType.value === 0) { 
                    witdrawaContent.value = '已提现至您的支付宝（' + realName + account +'），请注意查收'; 
                } else if (isWdType.value === 1) {
                    witdrawaContent.value = '已提现至您的银行卡（' + bankName.value +'尾号'+ 9819 +'），请注意查收'; 
                }
                isShow.value = true;
                handleCancel();
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
      };

        const handleCancel = () => {
            emit('close');
        }

        // 获取作品可提现金额
        const findCountIncomeWeekFun = () => {
            let reqData = {
            publishType: 2
            }
            return new Promise<void>((resolve, reject) => {
                countIncomeWeek(reqData).then((response: any) => {
                    const { code, data, message } = response;
                    
                    const resultData = data;
                    if (code !== 200) {
                        showPopup(message, 'error', 3000);
                        return;
                    }
                    balance.value = Number(resultData.workAllIncome) || 0;
                    resolve()
                }).catch((error: any) => {
                    reject(error)
                })
            })
        };

        onMounted(() => {
            findCountIncomeWeekFun();
            loadBankBinMap();
        })
  
      return {
        isTips,
        isShow,
        balance,
        wdData,
        reqData,
        isWdType,
        userInfo,
        handlingFee,
        bankNames,
        rateOfRate,
        selectBank,
        amountEr,
        accountEr,
        realNameEr,
        bankCardEr,
        cardHolderEr,
        bankNameEr,
        witdrawaTitle,
        witdrawaContent,
        currentDropdown,
        toggleDropdown,
        handleClickOutside,
        findPublicTypeFun,
        findWdType,
        handleCancel,
        isValidCardNumber,
        findWithdrawFun,
        findCountIncomeWeekFun,
        handleAmountValue,
        handleInput,
        getBankInfo
      };
    },
  });
  </script>
  
<style lang="scss" scoped>
@use '@/assets/styles/common.scss';
.popupModal{
    width: calc(100% - 740px);
    height: calc(100% - 158px);
    position: fixed;
    top: 158px;
    left: 530px;
    right: 0;
    bottom: 0;
    z-index: 10;
    clip-path: inset(0 0 0 0); /* 限制蒙版显示范围 */
    .masking, .modal-mask{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0);
    }
    .popupModal-wrapper{
        width: 388px;
        height: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .popupModal-wapper-center{
            position: relative;
            border-radius: 24px;
            overflow: hidden;
            padding: 20px;
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
            .withdral-from{
                width: 100%;
                height: auto;
                .withdraw-title{
                    width: 100%;
                    height: auto;
                    font-weight: 400;
                    font-size: 18px;
                    color: #FFFFFF;
                    line-height: 20px;
                    text-align: center;
                    position: relative;
                    .withdraw-title-main{
                        width: 100px;
                        height: 20px;
                        margin: 0 auto;
                        i{
                            font-size: 18px;
                            color: rgb(255, 255, 255, .7);
                        }
                    }
                    .withdraw-title-sub{
                        display: inline-block;
                        font-weight: 400;
                        font-size: 12px;
                        color: rgb(255, 255, 255, .7);
                        line-height: 1;
                        text-align: left;
                        padding: 10px 16px;
                        position: absolute;
                        top: 30px;
                        left: 113px;
                        z-index: 10;
                        border-radius: 8px;
                        background: rgba(105, 101, 96, 1);
                        box-shadow: 0px 9px 18px 9px rgb(0, 0, 0, .15);
                        &::before {
                            content: '';
                            position: absolute;
                            top: -8px; /* 调整三角形的位置 */
                            left: 50%;
                            transform: translateX(-50%);
                            width: 0;
                            height: 0;
                            border-left: 8px solid transparent;
                            border-right: 8px solid transparent;
                            border-bottom: 10px solid rgba(105, 101, 96, 1); /* 三角形颜色与背景一致 */
                        }
                    }
                }
                .withdraw-line{
                    width: 100%;
                    height: 1px;
                    margin: 20px 0 10px 0;
                    background: rgb(255, 255, 255, .38);
                }
                .withdraw-amount{
                    width: 100%;
                    height: auto;
                    display: flex;
                    margin-bottom: 10px;
                    justify-content: space-between;
                    .withdraw-amount-title{
                        font-weight: 400;
                        font-size: 16px;
                        color: #FFFFFF;
                        line-height: 18px;
                        text-align: left;
                    }
                    .withdraw-amount-val{
                        font-weight: 400;
                        font-size: 14px;
                        color: rgb(255, 255, 255, .7);
                        line-height: 18px;
                        text-align: right;
                    }
                }
                .item-main{
                    width: calc(100% - 2px);
                    height: auto;
                    margin-bottom: 10px;
                    border: 1px solid transparent;
                    input {
                    width: 100%;
                    height: 40px;
                    border: 0;
                    padding: 0 0 0 13px;
                    color: #FFFFFF;
                    font-size: 14px;
                    background: transparent;
                    &::placeholder {
                        color: rgb(255, 255, 255, 0.68);
                        font-size: 14px;
                    }
                    }
                    textarea{
                    width: 100%;
                    height: 100%;
                    background: transparent;
                    font-weight: 400;
                    font-size: 14px;
                    color: #FFFFFF;
                    line-height: 1.6;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    border: none;
                    resize: none;
                    letter-spacing: 1px;
                    padding-right: 8px;
                    &::placeholder {
                        color: rgb(255, 255, 255, 0.68);
                        font-size: 14px;
                    }
                    &:focus-visible{
                        outline: none;
                    }
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
                    }
                    :deep(.arco-slider){
                    width: 100%;
                    height: 6px;
                    margin: 11px 0;
                    border-radius: 3px;
                    .arco-slider-track{
                        width: 100%;
                        height: 6px;
                        border-radius: 3px;
                        &::before{
                        height: 6px;
                        border-radius: 3px;
                        background-color: rgba(0, 0, 0, .5);
                        }
                        .arco-slider-bar{
                        height: 6px;
                        border-radius: 3px;
                        background-color: rgb(255, 255, 255, .7);
                        }
                        .arco-slider-btn{
                        width: 6px;
                        height: 6px;
                        &::after{
                            width: 6px;
                            height: 6px;
                            border: none;
                            background: rgba(255, 255, 255, 0);
                        }
                        }
                    }
                    }
                    
                    .item-main-flex{
                        width: calc(100% - 2px);
                        height: 40px;
                        border: 1px solid transparent;
                        .item-main-flex-main{
                            width: calc(100% - 2px);
                            height: 38px;
                            display: flex;
                            border-radius: 12px;
                            border: 1px solid transparent;
                            position: absolute;
                            top: 0;
                            left: 0;
                            z-index: 0;
                        }
                        .item-main-flex-head{
                            width: 130px;
                            height: 100%;
                            flex-shrink: 0;
                            .head-main{
                            width: 100%;
                            display: flex;
                            .item-main-icon{
                                width: 40px;
                                height: auto;
                                flex-shrink:0;
                                margin-right: 8px;
                                text-align: center;
                                i{
                                font-size: 22px;
                                color: rgba(225,225,225,0.7);
                                display: block;
                                line-height: 40px;
                                }
                            }
                            .item-main-name{
                                flex: 1;
                                width: 0;
                                font-size: 14px;
                                color: rgba(225,225,225,0.7);
                                line-height: 40px;
                                text-align: left;
                                display: inline-block;
                            }
                            }
                        }
                        .item-main-content{
                            flex: 1;
                            width: 0;
                            height: auto;
                            .item-main-content-flex{
                                width: 100%;
                                height: 100%;
                                display: flex;
                                .item-main-slider-num{
                                    flex: 1;
                                    width: 0;
                                    height: 100%;
                                    .item-main-slider{
                                        width: 100%;
                                            height: 100%;
                                        .item-main-slider-num{
                                            width: 100%;
                                            height: 100%;
                                            input{
                                                width: 100%;
                                                height: 100%;
                                                display: block;
                                            }
                                        }
                                    }
                                }
                                .item-main-slider-unit{
                                    width: 30px;
                                    height: 30px;
                                    flex-shrink: 0;
                                    border-radius: 50%;
                                    margin: 5px;
                                    cursor: pointer;
                                    i{
                                    font-size: 24px;
                                    text-align: center;
                                    line-height: 30px;
                                    display: block;
                                    color: rgba(225,225,225,0.7);
                                    }
                                }
                            }
                            .item-main-time{
                                width: 100%;
                                height: 100%;
                                display: flex;
                                .item-main-time-group{
                                    flex: 1;
                                    width: 0;
                                    .item-main-slider{
                                    width: 100%;
                                    height: 100%;
                                    .item-main-slider-num{
                                        width: 100%;
                                        height: 100%;
                                        input{
                                            width: 100%;
                                            height: 100%;
                                            display: block;
                                        }
                                    }
                                    }
                                }
                                .item-main-time-group-input-unit{
                                    width: auto;
                                    font-size: 14px;
                                    flex-shrink: 0;
                                    color: rgb(255, 255, 255, .7);
                                    line-height: 40px;
                                    text-align: center;
                                    font-style: normal;
                                    text-transform: none;
                                    margin: 0 10px;
                                }
                            }
                        }
                    }
                    .item-main-pulldown{
                        width: 100%;
                        height: 42px;
                        border-radius: 12px;
                        position: relative;
                        .item-main-pulldown-content{
                            width: 100%;
                            height: 42px;
                            display: flex;
                            position: absolute;
                            z-index: 0;
                            .item-main-pulldown-flex{
                            width: 100%;
                            height: 42px;
                            display: flex;
                            border-radius: 12px;
                            border: 1px solid transparent;
                            .item-main-pulldown-flex-l{
                                width: 140px;
                                flex-shrink:0;
                                .item-main-pulldown-flex-l-m{
                                width: 100%;
                                height: auto;
                                display: flex;
                                .item-main-pulldown-flex-l-m-icon{
                                    width: 40px;
                                    flex-shrink:0;
                                    margin-right: 8px;
                                    text-align: center;
                                    i{
                                    font-size: 22px;
                                    color: rgba(225,225,225,0.7);
                                    display: block;
                                    line-height: 42px;
                                    text-align: center;
                                    }
                                }
                                .item-main-pulldown-flex-l-m-name{
                                    flex: 1;
                                    font-weight: 400;
                                    font-size: 14px;
                                    color: rgb(255, 255, 255, .7);
                                    line-height: 42px;
                                    text-align: left;
                                    font-style: normal;
                                    text-transform: none;
                                    display: flex;
                                    justify-content: flex-start;
                                    align-items: center;
                                    i{
                                    font-size: 22px;
                                    color: rgba(225,225,225,0.7);
                                    display: inline-block;
                                    line-height: 40px;
                                    margin-left: 5px;
                                    }
                                }
                                }
                            }
                            .item-main-pulldown-flex-c{
                                flex-grow: 1;
                                width: 0;
                                height: 40px;
                                .item-main-pulldown-flex-c-m{
                                height: auto;
                                font-weight: 400;
                                font-size: 14px;
                                color: #FFFFFF;
                                line-height: 40px;
                                text-align: left;
                                font-style: normal;
                                text-transform: none;
                                .item-main-pulldown-flex-c-m-name{
                                    width: 100%;
                                    display: inline-block;
                                }
                                }
                            }
                            .item-main-pulldown-flex-r{
                                width: 22px;
                                height: 40px;
                                flex-shrink:0;
                                margin-left: 12px;
                                margin-right: 6px;
                                i{
                                font-size: 22px;
                                color: #FFFFFF;
                                line-height: 40px;
                                display: block;
                                }
                            }
                            }
                        }
                        .item-main-pulldown-module{
                            width: 100%;
                            height: auto;
                            position: absolute;
                            left: 0;
                            top: 43px;
                            z-index: 9999;
                            overflow: hidden;
                            border-radius: 12px;
                            background-color: rgba(105, 101, 96, 1);
                            border: 1px solid rgba(255, 255, 255, .38);
                            .module-content{
                            width: 100%;
                            height: auto;
                            .module-content-list{
                                max-height: 168px;
                                overflow-y: auto;
                                &::placeholder {
                                color: rgba(255, 255, 255, 0.68);
                                font-size: 14px;
                                }
                                .module-content-list-item{
                                height: 36px;
                                padding: 0 15px;
                                margin: 0 6px 8px 6px;
                                cursor: pointer;
                                border-radius: 17px;
                                display: flex;
                                justify-content: space-between;
                                background-color: transparent;
                                .item-main-top{
                                    width: calc(100% - 30px);
                                    height: 36px;
                                    margin: 0 auto;
                                    .item-main-top-flex{
                                    width: 100%;
                                    height: 100%;
                                    display: flex;
                                    justify-content: space-between;
                                    background-color: transparent;
                                    }
                                }
                                .item-main-bott{
                                    width: calc(100% - 30px);
                                    height: 36px;
                                    margin: 0 auto;
                                    border-radius: 12px;
                                    background: rgba(0, 0, 0, .15);
                                    .item-main-amount{
                                    width: 100%;
                                    height: auto;
                                    display: flex;
                                    justify-content: space-between;
                                    .item-main-amount-num{
                                        flex: 1;
                                        width: 0;
                                        position: relative;
                                        input{
                                        width: 100%;
                                        height: 100%;
                                        text-align: right;
                                        font-size: 14px;
                                        padding: 0;
                                        line-height: 40px;
                                        display: block;
                                        }
                                    }
                                    .item-main-amount-unit{
                                        width: auto;
                                        font-size: 14px;
                                        flex-shrink: 0;
                                        color: rgb(255, 255, 255, .7);
                                        line-height: 40px;
                                        text-align: center;
                                        font-style: normal;
                                        text-transform: none;
                                        margin: 0 10px;
                                    }
                                    }
                                }
                                .item-name{
                                    font-weight: 400;
                                    font-size: 14px;
                                    color: rgba(255, 255, 255, .8);
                                    line-height: 36px;
                                    text-align: center;
                                    font-style: normal;
                                    text-transform: none;
                                    white-space: nowrap;
                                }
                                .item-select{
                                    width: 12px;
                                    height: 12px;
                                    padding: 0;
                                    margin: 12px 0;
                                    border-radius: 50%;
                                    background-color: transparent;
                                    border: 2px solid rgba(255, 255, 255, .8);
                                }
                                }
                                .item-active{
                                background-color: rgba(255,255, 255, 1) !important;
                                }
                            }
                            .module-content-open{
                                width: 100%;
                                height: auto;
                                .module-content-open-list{
                                width: 100%;
                                height: auto;
                                display: flex;
                                justify-content: center;
                                .module-content-open-list-line{
                                    width: 1px;
                                    height: 18px;
                                    margin: 19px 20px;
                                    display: inline-block;
                                    background-color: rgb(0, 0, 0, .18);
                                }
                                .module-content-open-list-item{
                                    width: auto;
                                    height: 26px;
                                    padding: 15px 0;
                                    cursor: pointer;
                                    display: inline-block;
                                    background-color: transparent;
                                    font-weight: 400;
                                    font-size: 14px;
                                    color: rgba(255, 255, 255, .8);
                                    line-height: 26px;
                                    text-align: center;
                                    font-style: normal;
                                    text-transform: none;
                                    white-space: nowrap;
                                    .item-main-madeBy-checkbox-icon{
                                    margin-right: 5px;
                                    }
                                }
                                }
                            }
                            .module-content-tips{
                                width: calc(100% - 20px);
                                height: auto;
                                max-height: 126px;
                                margin: 18px 10px;
                                .module-content-tips-item{
                                width: 100%;
                                height: auto;
                                display: flex;
                                .item-value{
                                    width: 26px;
                                    height: 26px;
                                    flex-shrink: 0;
                                    font-weight: 400;
                                    font-size: 10px;
                                    color: #FFFFFF;
                                    line-height: 26px;
                                    text-align: center;
                                    background: url(@/assets/images/task/back_bg.png) no-repeat center center;
                                    background-size: 100% 100%;
                                }
                                .item-label{
                                    flex: 1;
                                    width: 0;
                                    font-weight: 400;
                                    font-size: 12px;
                                    color: #FFFFFF;
                                    line-height: 20px;
                                    text-align: left;
                                    margin-top: 5px;
                                }
                                }
                            }
                            }
                        }
                        }
                    .withdrawal-type{
                        width: 100%;
                        height: 42px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .withdrawal-type-item{
                            width: calc(50% - 7px);
                            height: 40px;
                            cursor: pointer;
                            border-radius: 8px;
                            border: 1px solid rgb(255, 255, 255, .38);
                            background: transparent;
                            .withdrawal-type-item-main{
                                width: 100%;
                                height: 100%;
                                display: flex;
                                .item-icon {
                                    width: 30px;
                                    i{
                                        font-size: 24px;
                                        color: rgba(225,225,225,0.7);
                                        display: block;
                                        line-height: 40px;
                                        flex-shrink: 0;
                                        text-align: center;
                                    }
                                }
                                .item-name {
                                    flex: 1;
                                    width: 0;
                                    font-size: 14px;
                                    color: rgba(225,225,225,0.7);
                                    line-height: 40px;
                                    text-align: left;
                                    display: inline-block;
                                }
                                .item-seles{
                                    width: 30px;
                                    height: 100%;
                                    span{
                                        width: 10px;
                                        height: 10px;
                                        margin: 15px 9px;
                                        display: block;
                                        border-radius: 50%;
                                        background: transparent;
                                        border: 1px solid rgba(225, 225, 225, 0.7);
                                    }
                                }
                            }
                        }
                        .flag {
                            background: rgb(255, 255, 255, .18);
                            .item-seles{
                                span{
                                   background: rgb(255, 255, 255, 1) !important;
                                    border: 1px solid rgba(225, 225, 225, 1) !important; 
                                }
                            }
                        }
                    }
                }
                .rateOfRate {
                    width: 100%;
                    height: auto;
                    font-weight: 400;
                    font-size: 14px;
                    text-align: center;
                    color: rgb(255, 255, 255, .7);
                    text-align: center;
                    margin: 20px 0 0 0;
                }
                .withdraw-but{
                    width: 140px;
                    height: 50px;
                    border-radius: 12px;
                    font-weight: 400;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 50px;
                    text-align: center;
                    cursor: pointer;
                    margin: 20px auto 12px auto;
                }
            }
        }
    }
}
</style>