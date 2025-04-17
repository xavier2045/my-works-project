<template>
    <div class="invite-page">
      <!-- 背景图片 -->
      <div class="background" :style="{ backgroundImage: `url(${inviteBg})` }"></div>
  
      <!-- 邀请卡片 -->
      <div class="invite-card">
        <div class="invite-card-bg"></div>
        <div class="invite-card-content">
            <!-- 顶部 logo -->
            <div class="logo">
            <img src="/logo.svg" alt="AETRIX Logo" />
            </div>
    
            <!-- 标题 -->
            <div class="title">邀请函</div>
    
            <!-- 副标题 -->
            <div class="subtitle">AETRIX 邀请您参与平台内测</div>
    
            <!-- 活动信息 -->
            <div class="info">
                <p>内测时间：2025年4月20日-2025年5月20日</p>
                <p>请在下方方格内输入您的邀请码</p>
            </div>
    
            <!-- 邀请码输入框（6位） -->
            <div class="code-input-wrapper">
            <input
                v-for="(digit, index) in codeDigits"
                :key="index"
                v-model="codeDigits[index]"
                type="text"
                maxlength="1"
                class="code-input"
                @input="handleInput(index, $event)"
                @keydown="handleKeydown(index, $event)"
                @paste="handlePaste($event)"
                ref="codeInputs"
            />
            </div>
            <!-- 立即参与按钮 -->
            <button class="join-button" @click="handleJoin">立即参与</button>
            
            <!-- 协议勾选 -->
            <div class="agreement">
                
                <label for="agreement" class="agreement-label">
                    <div class="check-clause-box" @click="checkboxHandler">
                        <img :src="checkbox" alt="" />
                    </div>
                    <span @click="checkboxHandler">阅读并同意</span>
                    <a href="#" @click.prevent="findTypeMsgPopupFun">《用户平台内测协议》</a>
                </label>
            </div>
        </div>
      </div>
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
  
  <script lang="ts">
    import { defineComponent, ref, nextTick } from 'vue';
    import router from '@/router';
    import { usersInviteValidate } from '@/api/user';
    import MsgPopup from '@/components/msgPopup/msg/index.vue';
    import inviteBg from '@/assets/images/pc/pcBg.jpg';
    import NoCheck from '@/assets/images/common/noCheck.png';
    import Check from '@/assets/images/common/check.png';
    import { showPopup } from '@/utils/usePopup';
  
    export default defineComponent({
        name: 'Invite',
        components: {
            MsgPopup
        },
        setup() {
            // 6位邀请码数组
            const codeDigits = ref<string[]>(Array(6).fill(''));
            // 输入框引用
            const codeInputs = ref<HTMLInputElement[]>([]);
            const checkbox = ref(NoCheck); // 勾选用户测试协议
        
            // 处理输入
            const handleInput = (index: number, event: Event) => {
                const input = event.target as HTMLInputElement;
                const value = input.value;
        
                // 只允许输入数字或字母
                if (!/^[0-9a-zA-Z]?$/.test(value)) {
                codeDigits.value[index] = '';
                return;
                }
        
                // 如果输入了值，自动聚焦到下一个输入框
                if (value && index < 5) {
                nextTick(() => {
                    codeInputs.value[index + 1]?.focus();
                });
                }
            };
        
            // 处理键盘事件（支持删除和左右移动）
            const handleKeydown = (index: number, event: KeyboardEvent) => {
                if (event.key === 'Backspace' && !codeDigits.value[index] && index > 0) {
                // 如果当前输入框为空，按删除键时聚焦到上一个输入框
                nextTick(() => {
                    codeInputs.value[index - 1]?.focus();
                });
                } else if (event.key === 'ArrowLeft' && index > 0) {
                // 左箭头移动到上一个输入框
                nextTick(() => {
                    codeInputs.value[index - 1]?.focus();
                });
                } else if (event.key === 'ArrowRight' && index < 5) {
                // 右箭头移动到下一个输入框
                nextTick(() => {
                    codeInputs.value[index + 1]?.focus();
                });
                }
            };
        
            // 处理粘贴事件
            const handlePaste = (event: ClipboardEvent) => {
                event.preventDefault();
                const pasteData = event.clipboardData?.getData('text') || '';
                const cleanedData = pasteData.replace(/[^0-9a-zA-Z]/g, '').slice(0, 6);
        
                // 将粘贴的内容分配到各个输入框
                cleanedData.split('').forEach((char, i) => {
                if (i < 6) {
                    codeDigits.value[i] = char;
                }
                });
        
                // 粘贴后聚焦到最后一个非空输入框
                const lastFilledIndex = Math.min(cleanedData.length - 1, 5);
                nextTick(() => {
                codeInputs.value[lastFilledIndex]?.focus();
                });
            };

            // 打开消息弹框 type 1通知、2需要同意的通告
            const isDialogVisible = ref(false);
            const dialogTitle = ref('');
            const dialogContent = ref('');
            const dialogType = ref(1);
            const findTypeMsgPopupFun = () => {
                dialogTitle.value = '用户平台内测协议';
                dialogContent.value = '<h3>第一条：总则</h3>'+
                                        '<p>1、AE平台致力于协助去中心化创业人运用去中心化解决实际问题 提供相关技术支持等服务。</p>'+
                                        '<p>2、当您同意本公约并按照页面提示，完成全部的团队创建和数字身份提交并通过平台审核后，成为团队管理者。</p>'+
                                        '<p>3、您了解并知悉，平台有权独立决定您创建团队是否通过及团队 内数字身份是否合规。'+
                                        '<h3>第二条：定义与解释</h3>'+
                                        '<p>1、AE平台旗下去中心化团队组织工具，您可以通过AE平台发行数字身份、活动门票数字证明、作品数字证明、铸造上链分享、传 播、流通您享有版权或自主创作的作品极其相关内容，也可使用平台提供的技术辅助、数据统计工具等。平台将通过区块链技术 及智能合约在双方约定的范围内为您的团队建设与治理、数字内容管理提供便利，平台用户可以在平台内接收AE平台社区内容、 数字身份、数字门票、数字内容等在线内容。</p>。'+
                                        '<p>2、AE平台支持各种类型的数字创业者或其他从业者，您可以是画家、作品发布者、活动策划者、接收作品、参与活动、作者、收藏家或其他职业有创造力、公信力、领导力、统筹力的从业者。</p>'+
                                        '<p>3、AE平台支持数字身份铸造上链、活动发布、作品专利保护售卖 及空投、优先购、打折卡等功能，数字作品上传支持jpg/GIF图 片、FBX/GLB格式3D模型，将续支持word/PDF/TXT/PPT文本、 MP4/APE/FLAC音乐、MPEG视频等数字资产类型。文件下载支持图 片、zip文件包下载。'+
                                        '<p>您作为管理者，对AE平台相关数字作品上传者或提供者及权限开放者，须确认相关铸造上链数字作品及前述数字作品作品相关的封面、创作者姓名、肖像权、标识、作品权益，及您提供的相关 宣传资料、文案等内容为原创或拥有版权以及版权约定内的商业 行为，且上链内容不得二次铸造上链，即您确认享有数字作品铸 造上链相关内容权利及进行前述操作的全部权利，且平台按照与 您约定的方式在平台内或宣传使用数字作品内容不会侵犯第三方 的合法权益，亦无需另行取得第三方同意或向其承担责任。</p>';

                dialogType.value = 2;
                isDialogVisible.value = true;
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

            // 勾选用户发布协议
            const checkboxHandler = () => {
                if (checkbox.value == NoCheck) {
                    checkbox.value = Check;
                } else {
                    checkbox.value = NoCheck;
                }
            }
        
            // 点击立即参与
            const handleJoin = () => {
                if (checkbox.value == NoCheck) {
                    // 未勾选协议，提示用户
                    showPopup('请阅读并同意《用户平台内测协议》', 'error', 3000);
                    return;
                }
        
                const inviteCode = codeDigits.value.join('');
                if (inviteCode.length !== 6) {
                    // 邀请码不足6位，提示用户
                    showPopup('请输入正确的邀请码', 'error', 3000);
                    return;
                }
        
                // 模拟提交邀请码（这里可以替换为实际的 API 调用）
                console.log('提交邀请码:', inviteCode);
                findUsersInviteValidateFun(inviteCode);
            };

            const findUsersInviteValidateFun = (inviteCode: string) => {
                let reqData = {
                    inviteTestCode: inviteCode
                }
                return new Promise<void>((resolve, reject) => {
                    usersInviteValidate(reqData).then((response: any) => {
                        const { code, data, message } = response;
                        
                        if (code !== 200) {
                            showPopup(message, 'error', 3000);
                            return;
                        }
                        
                        localStorage.setItem('isInvited', inviteCode);
                        router.push('/');
                        resolve()
                    }).catch((error: any) => {
                        reject(error)
                    })
                })
            }
           
            return {
                inviteBg, // 背景图片路径
                codeDigits,
                codeInputs,
                checkbox,
                dialogTitle,
                dialogType,
                dialogContent,
                isDialogVisible,
                handleInput,
                handleKeydown,
                handlePaste,
                handleJoin,
                findTypeMsgPopupFun,
                checkboxHandler,
                handleDialogResult,
                closeMsgPopup
            };
        },
    });
  </script>
  
  <style scoped lang="scss">
  .invite-page {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* 背景图片 */
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    z-index: 1;
  }
  
  /* 邀请卡片 */
  .invite-card {
    position: relative;
    z-index: 2;
    width: 658px;
    height: 803px;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
    mask-image: url(@/assets/images/invite/inviteBg.png);
    -webkit-mask-image: url(@/assets/images/invite/inviteBg.png);
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-size: 100% 100%;
    background-color: rgb(255, 255, 255, .08);
    backdrop-filter: blur(24px);
    position: relative;
    
    .invite-card-bg{
        width: 764px;
        height: 907px;
        position: absolute;
        top: -42px;
        left: -53px;
        z-index: -1;
        background-image: url(@/assets/images/invite/invitebg1.png);
        background-size: 100% 100%;
    }
    background-size: 100% 100%;
    .invite-card-content{
        width: 600px;
        height: auto;
        margin: 110px auto 0 auto;
    }
  }
  
  /* logo */
  .logo img {
    width: auto;
    height: 31px;
    margin-bottom: 35px;
  }
  
  /* 标题 */
  .title {
    font-weight: 400;
    font-size: 72px;
    color: #FFFFFF;
    line-height: 68px;
    text-align: center;
    margin-bottom: 50px;
    display: block;
    font-family: STSongti-SC, STSongti-SC;
  }
  
  /* 副标题 */
  .subtitle {
    font-size: 32px;
    color: #FFFFFF;
    text-align: center;
    line-height: 1;
    margin-bottom: 20px;
  }
  
  /* 活动信息 */
  .info {
    font-size: 14px;
    color: #999;
    line-height: 1;
    margin-bottom: 33px;
    p{
        &:last-child{
            margin-top: 20px;
        }
    }
  }
  
  /* 邀请码输入框 */
  .code-input-wrapper {
    width: 448px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto 30px auto;
  }
  
  .code-input {
    width: 58px;
    height: 55px;
    text-align: center;
    font-size: 18px;
    border: 1px solid rgb(255, 255, 255, .02);
    border-radius: 8px;
    outline: none;
    color: #FFFFFF;
    background: rgba(0, 0, 0, 0.36);
    transition: border-color 0.3s;
    backdrop-filter: blur(9px);
    transition: box-shadow 0.3s ease;
    box-shadow: 
        -2px 2px 5px rgba(0, 0, 0, 0.3), /* 外侧灰色阴影 */
        inset -1px 1px 2px rgba(255, 255, 255, 0.2); /* 内侧白色阴影 */
    :hover {
        box-shadow: 
            -2px 2px 5px rgba(0, 0, 0, 0.3),
            inset -1px 1px 2px rgba(255, 255, 255, 0.2);
    }
    &:focus {
        border: 1px solid transparent;
    }
  }
  
  /* 立即参与按钮 */
  .join-button {
    width: 67px;
    font-weight: 400;
    font-size: 32px;
    color: #FFFFFF;
    line-height: 42px;
    text-align: center;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    background: transparent;
    transition: background 0.3s;
    margin-top: 70px;
  }
  
  /* 协议勾选 */
  .agreement {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 70px;
    font-size: 16px;
    line-height: 25px;
    color: rgb(255, 255, 255, .7);
    .agreement-label{
        display: flex;
        .check-clause-box{
            width: 25px;
            height: 25px;
            cursor: pointer;
            margin-right: 3px;
            img{
              width: 100%;
              height: 100%;
              display: block;
            }
        }
        a {
            color: #FFFFFF;
            text-decoration: none;
        
            &:hover {
                text-decoration: underline;
            }
        }
    }
  }
  </style>