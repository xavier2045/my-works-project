<template>
    <div class="popupModal" @click="closeComponents">
        <div class="modal-mask"></div>
        <div class="popupModal-wrapper" @click.stop>
            <div class="popupModal-wapper-center">
                <div class="popupModal-wrapper-mask"></div>
                <div class="pact-from">
                    <div class="pact-from-content">
                        <div class="pact-from-title">团队组织公约</div>
                        <div class="pact-from-content-text">
                            <h5>第一条：总则</h5>
                            <p>
                                <span>1、AE平台致力于协助去中心化创业人运用去中心化解决实际问题 提供相关技术支持等服务。</span>
                                <span>2、当您同意本公约并按照页面提示，完成全部的团队创建和数字身份提交并通过平台审核后，成为团队管理者。</span>
                                <span>3、您了解并知悉，平台有权独立决定您创建团队是否通过及团队 内数字身份是否合规。</span>
                            </p>
                                
                            <h5>第二条：定义与解释</h5>
                            <p>1、AE平台旗下去中心化团队组织工具，您可以通过AE平台发行数字身份、活动门票数字证明、作品数字证明、铸造上链分享、传 播、流通您享有版权或自主创作的作品极其相关内容，也可使用平台提供的技术辅助、数据统计工具等。平台将通过区块链技术 及智能合约在双方约定的范围内为您的团队建设与治理、数字内容管理提供便利，平台用户可以在平台内接收AE平台社区内容、 数字身份、数字门票、数字内容等在线内容。</p>
                            <p>2、AE平台支持各种类型的数字创业者或其他从业者，您可以是画家、任务发布者、活动策划者、接收任务、参与活动、作者、收藏家或其他职业有创造力、公信力、领导力、统筹力的从业者。</p>
                            <p>3、AE平台支持数字身份铸造上链、活动发布、作品专利保护售卖 及空投、优先购、打折卡等功能，数字作品上传支持jpg/GIF图 片、FBX/GLB格式3D模型，将续支持word/PDF/TXT/PPT文本、 MP4/APE/FLAC音乐、MPEG视频等数字资产类型。文件下载支持图 片、zip文件包下载。</p>
                            <p>您作为管理者，对AE平台相关数字作品上传者或提供者及权限开放者，须确认相关铸造上链数字作品及前述数字作品作品相关的封面、创作者姓名、肖像权、标识、作品权益，及您提供的相关宣传资料、文案等内容为原创或拥有版权以及版权约定内的商业行为，且上链内容不得二次铸造上链，即您确认享有数字作品铸造上链相关内容权利及进行前述操作的全部权利，且平台按照与您约定的方式在平台内或宣传使用数字作品内容不会侵犯第三方的合法权益，亦无需另行取得第三方同意或向其承担责任。</p>
                            <p>
                                4、数字内容权利指与数字内容相关的权利，包括但不限于：
                                <span>① 与数字内容相关的数字内容或制品之著作权、邻接权（用于数字内容分享、传播等）;</span>
                                <span>② 与数字内容相关的创制人员等的肖像权、姓名权、照片/图片著作权、文字作品著作权（用于作者署名、表明表演者身份、人员及数字内容介绍等）;</span>
                                <span>③ 平台按照与您约定的方式使用数字内容的其他必要权利。</span>
                            </p>
                            <p>您通过平台上传或分享数字内容，即代表您将前述数字内容权利在全球范围内按照您与平台约定的条款持续地授权平台行使（且您依然是数字内容的权利人）；如您就前述数字内容权利与平台签署其他协议或双方存在其他约定的（包括但不限于线下签署的纸质协议、通过平台签署的电子协议等），双方按照另行约定的内容履行相应协议；如无另行约定的，平台无需就根据条款约定使用数字内容向您支付费用。如无另行约定，平台可在双方达成的协议或条款有效期内按照双方约定使用数字内容。</p>
                            <p>5、AE产品指网站可以独立客户端软件、网站的方式存在，也可以 与第三方网站或软件合作以捆绑、嵌入等方式存在。</p>
                            <p>6、信息网络包含但不限于：互联网、移动网、有线网、无线网、 局域网、广播网、电视网、电话通信网等，以及一切现在已知的或未来不可预知的新信息网络。</p>
                            <p>7、终端装置包括但不限于个人电脑、手机、平板电脑、手表及其 他可穿戴设备、家庭服务设备（包括音箱、电视、机顶盒、有线电视盒、智能机器人等）、车载娱乐设备、航空播放器，以及其他现在已有及未来出现的、可接收/存储/播放/展示数字内容的终端和设备。</p>
                            
                            <h5>第三条：平台服务使用规则</h5>
                            <p>1、您应当使用真实身份信息及个人资料（包括身份信息、银行账号、支付宝账号、联系方式、居住地址等）进行平台入驻及认证，不得以虚假、冒用的居民身份信息进行注册并认证，若您的个人资料有任何变动，您应及时更新。</p>
                            <p>2、您的平台账号为您在平台进行操作的重要途径及凭证，请您维持密码及账号的机密安全，且您对您的账号下的操作负责。若您发现任何非法使用您账号或存在安全漏洞危及账号安全的情况，请立即通告平台或联系客服，平台会尽快根据您提供的材料及实际情况进行相应处理。</p>
                            <p>3、在法律法规允许的范围内，您同意账号所有权归平台所有。您的账号仅限于您本人使用，禁止赠与、借用、租用、转让或售卖。如果平台发现使用者并非账号初始注册人或您未按照本条款约定使用账号的，有权不经通知收回账号（包括平台账号权限及普通用户账号权限）而无需向账号使用人承担法律责任，由此带来的包括但不限于通讯中断、资料和账号资产清空等损失由您自行承担。</p>
                            <p>4、您同意并授权，为了更好的为您提供服务以及确保账户安全， 平台可以根据您提供的手机号码、身份证号码等信息，向全国公民身份号码查询服务中心、电信运营商、金融服务机构等第三方机构发起用户身份真实性、用户征信记录、用户手机号码有效性状态等情况的查询。且若平台收到关于数字内容相关投诉或争议信息时，平台有权根据实际情况在必要范围内向第三方披露与数字内容相关的信息。</p>
                            <p>5、在法律法规允许的范围内，您同意与注册、登录、使用平台账号相关的一切资料、数据和记录，包括但不限于平台账号、个人资料、所有登录、收益记录和相关的使用统计数字等归平台所有。发生争议时，您同意以平台的系统数据为准，平台保证该数据的真实性。</p>
                            <p>
                                6、您有权将数字内容上传或提供至平台，且您理解并确认：
                                <span>① 如果您代表团队或其他版权共有人发布数字内容，则应已经获得团队其他成员和版权共有人的同意，且应尊重上述权利人的合法权益，包括但不限于显示其署名等;</span>
                                <span>② 数字内容（包括歌曲、文字、图片等）中不含任何涉政信息、涉军信息、淫秽色情信息、涉黑暴力信息、涉毒涉赌信息及其他法律法规、政策以及国家规定禁止的内容；数字内容不包含任何损坏文档、病毒、蠕虫、木马或其他类似损害程序代码的内容;</span>
                                <span>③ 如您上传或提供的数字内容权利状态产生变化的，您应及时通知平台，平台收到您的通知后，将根据实际情况自主决定在平台保留您的数字内容或对数字内容采取删除、屏蔽或断开链接等措施;</span>
                                <span>④ 您知悉并同意，在您使用平台提供的技术服务时，您的数字内容可能会经过平台编码或译码，您的数字内容也可能会与其他平台的数字内容进行打包推广或开展联合活动，但平台保证不会破坏您数字内容的原意，也不会对您的数字内容进行实质性修改。</span>
                            </p>

                            <h5>第四条 其他</h5>
                            <p>1、平台有权在必要时通过在平台发出公告、向您发送站内信、电子邮件等合理方式变更本条款的内容，相关变更一经发布即生效。若您继续使用本条款涉及的服务，则视为对修改内容的同意，当发生有关争议时，以最新的服务条款为准；若您认为变更后的内容无法接受，您应停止使用本条款涉及的服务并通知平台；但这并不意味着您与平台另行达成的其他协议同样予以终止或解除。</p>
                            <p>2、本协议的解释及争议解决均应适用中华人民共和国法律，并且排除一切冲突法规定的适用。如就本协议的签订、履行等发生任何争议的，双方应尽量友好协商解决；协商不成时，任何一方均可向被告住所地享有管辖权的人民法院提起诉讼。</p>
                            <p>3、本公约中的标题仅为方便而设，不作为解释本公约的依据。</p>
                        </div>
                        <div class="btn-box">
                            <div class="agree-btn" @click="closeComponents">不同意</div>
                            <div class="agree-btn" @click="submitComponents">同意</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script lang="ts">
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
    name: 'Convention',
    components: {
        
    },
    props: {
        
    },
    emits: ['update:content', 'close'],
    setup(props, { emit }) {
        const submitComponents = () => {
            emit('update:content');
        }

        // 关闭编辑器
        const closeComponents = () => {
            emit('close');
        };
        // 初始化时填充初始内容
        onMounted(() => {
            
        });

        return {
            submitComponents,
            closeComponents,
        };
    }
});
</script>
  
  <style scoped lang="scss">
    .popupModal{
        width: 100% !important;
        height: 100vh !important;
        position: fixed;
        top: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        left: 160px !important;
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
            width: 680px;
            height: 810px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            .popupModal-wapper-center{
                width: 100%;
                height: 100%;
                position: relative;
                border-radius: 52px;
                .popupModal-wrapper-mask{
                    width: calc(100% - 3px);
                    height: calc(100% - 3px);
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: -1;
                    border-radius: 52px;
                    border: 1px solid rgb(255, 255, 255, .38);
                    box-shadow: 0px 9px 18px 9px rgb(0, 0, 0, .15);
                    background: rgba(100, 99, 98, .16);
                    backdrop-filter: blur(36px);
                }
                .pact-from{
                    width: calc(100% - 60px);
                    height: calc(100% - 100px);
                    padding: 50px 30px;
                    isolation: isolate;
                    border-radius: 52px;
                        .pact-from-content{
                            width: 100%;
                            height: 100%;
                            .pact-from-title{
                                font-size: 20px;
                                color: #FFFFFF;
                                line-height: 1;
                                text-align: center;
                                font-style: normal;
                                text-transform: none;
                                margin-bottom: 36px;
                            }
                            .pact-from-content-text{
                                width: 100%;
                                height: calc(100% - 120px);
                                overflow-y: auto;
                                scrollbar-width: none;
                                &::-webkit-scrollbar {
                                    display: none;
                                }
                                h5{
                                    font-weight: 400;
                                    font-size: 16px;
                                    color: #FFFFFF;
                                    line-height: 1;
                                    text-align: left;
                                    margin: 20px 0;
                                }
                                p{
                                    font-weight: 400;
                                    font-size: 14px;
                                    color: #FFFFFF;
                                    line-height: 24px;
                                    text-align: left;
                                    display: block;
                                    margin-bottom: 15px;
                                    span{
                                        display: block;
                                    }
                                }
                            }
                            .btn-box{
                                width: 100%;
                                height: 38px;
                                display: flex;
                                margin: 30px auto 50px auto;
                                justify-content: center;
                                .agree-btn{
                                    width: 90px;
                                    height: 38px;
                                    border-radius: 19px;
                                    line-height: 38px;
                                    text-align: center;
                                    cursor: pointer;
                                    font-weight: 400;
                                    font-size: 16px;
                                    color: #FFFFFF;
                                    text-align: center;
                                    display: inline-block;
                                    color: rgb(255, 255, 255, .7);
                                    background-color: rgb(255, 255, 255, .38);
                                    &:hover{
                                        color: #FFFFFF;
                                        background-color: rgb(255, 255, 255, .48);
                                    }
                                    &:first-child{
                                        margin-right: 10px;
                                        color: rgb(255, 255, 255, .7);
                                        background-color: rgb(255, 255, 255, .18);
                                        &:hover{
                                            color: rgb(255, 255, 255, .7);
                                            background-color: rgb(255, 255, 255, .24);
                                        }
                                    }
                                }
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
  