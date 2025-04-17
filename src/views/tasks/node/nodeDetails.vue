<template>
  <div class="node">
    <div class="node-container">
      <div class="node-header">
        <div class="node-header-flex">
          <div class="node-header-flex-l">
            <div class="node-header-flex-l-main">
              <div class="node-header-flex-l-main-previous">
                <div class="previous-icon" @click="goBack">
                  <i class="icon font_family icon-a-jiantouxiangzuoyue20"></i>
                </div>
                <div class="previous-name">
                  <div class="previous-name-main">
                    <div class="previous-name-main-img">
                      <img :src="details.userAvatar" alt="" />
                    </div>
                    <div class="previous-name-main-text">
                      <div class="taskName">{{ details.jobName }}</div>
                      <div class="reason">{{ details.username }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="node-header-flex-c"></div>
          <div class="node-header-flex-r">
            <div class="node-header-flex-r-main">
              <template v-if="details.auditUserId == userInfo.id">
                <template v-if="details.auditStatus == 1">
                  <div class="r-mian-bg examine">
                    <div class="r-mian-bg-main">
                      <div class="r-main-dismiss" @click="handExamineFun(1)">
                        <div class="r-main-conect">
                          <div class="r-main-conect-icon">
                            <i class="icon font_family icon-dachayuanxingbiankuang68"></i>
                          </div>
                          <div class="r-main-conect-text">审核不通过</div>
                        </div>
                      </div>
                      <div class="r-main-pass" @click="handExamineFun(2)">
                        <div class="r-main-conect">
                          <div class="r-main-conect-text">审核通过</div>
                          <div class="r-main-conect-icon">
                            <i class="icon font_family icon-gouxuanyuanxingbiankuang34"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template> 
                <template v-else-if="details.auditStatus == 2">
                  <div class="r-mian-bg underReview">
                    <div class="r-mian-bg-main">
                      <div class="r-main-time" style="padding-left: 25px">节点通过</div>
                      <div class="r-main-icon">
                        <i class="icon font_family icon-gouxuanyuanxingbiankuang34"></i>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-if="details.auditStatus == 3">
                  <div class="r-mian-bg underReview">
                    <div class="r-mian-bg-main">
                      <div class="r-main-time" style="padding-left: 20px">节点不通过</div>
                      <div class="r-main-icon">
                        <i class="icon font_family icon-dachayuanxingbiankuang68"></i>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
              <template v-else>
                <template v-if="details.auditStatus == 1">
                  <div class="r-mian-bg underReview">
                    <div class="r-mian-bg-main">
                      <div class="r-main-time" style="padding-left: 25px">审核中</div>
                      <div class="r-main-icon">
                        <i class="icon font_family icon-shaloushijian24"></i>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else-if="details.auditStatus == 2">
                  <div class="r-mian-bg underReview">
                    <div class="r-mian-bg-main">
                      <div class="r-main-time" style="padding-left: 25px">节点通过</div>
                      <div class="r-main-icon">
                        <i class="icon font_family icon-gouxuanyuanxingbiankuang34"></i>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-if="details.auditStatus == 3">
                  <div class="r-mian-bg underReview">
                    <div class="r-mian-bg-main">
                      <div class="r-main-time" style="padding-left: 20px">节点不通过</div>
                      <div class="r-main-icon">
                        <i class="icon font_family icon-dachayuanxingbiankuang68"></i>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
              
            </div>
          </div>
        </div>
      </div>
      <div class="node-content">
        <div class="node-content-main">
          <div class="node-content-main-title">{{ details.name }}</div>
          <div class="node-content-main-content">
            <div class="flie-item" v-for="(item, index) in details.urls" :key="index">
              <template v-if="item.type=='image'">
                <img :src="item.url" alt="" />
              </template>
              <template v-else-if="item.type=='video'">
                <video ref="remoteVideo" autoplay controls>
                  <source :src="item.url" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </template>
            </div>
          </div>
          <div class="node-content-main-desc">{{ details.description }}</div>
          <div class="node-content-main-fileList">
            <div class="fileList-item" v-for="(item, index) in details.urls" :key="index">{{ item.url }}</div>
          </div>
          <div class="causeOfRejection" v-if="details.auditStatus == 3">
            <div class="causeOfRejection-main">
              <div class="causeOfRejection-main-img">
                <img :src="details.auditUserAvatar" alt="" />
              </div>
              <div class="causeOfRejection-main-text">
                <div class="taskName">{{ details.auditUsername }}<span>任务管理者</span></div>
                <div class="reason">{{ details.auditRemark }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 审核二次确认 -->
    <div class="popupModal" v-if="isExitTask">
        <div class="masking"></div>
        <div class="popupModal-center">
            <div class="popupModal-main">
              <div class="popupModal-module"></div>
              <div class="popupModal-main-content">
                <div class="popupModal-main-title">
                  <template v-if="isexm == 3">确定节点审核不通过</template>
                  <template v-if="isexm == 2">确定节点审核通过</template>
                </div>
                <div class="popupModal-main-but-group">
                  <div class="popupModal-main-but" @click="isExitTask = false">否</div>
                  <template v-if="isexm == 3">
                    <div class="popupModal-main-but" @click="isReject = true, isExitTask = false">是</div>
                  </template>
                  <template v-if="isexm == 2">
                    <div class="popupModal-main-but" @click="handSubmitExitTask">是</div>
                  </template>
                </div>
              </div>
            </div>
            <div class="close" @click="isExitTask = false">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div>
        </div>
    </div>
    <!-- 审核不通过理由 -->
    <div class="popupModal" v-if="isReject">
        <div class="masking"></div>
        <div class="popupModal-center rejectW">
            <div class="popupModal-main rejectW">
              <div class="popupModal-module"></div>
              <div class="popupModal-main-content">
                <div class="popupModal-main-title">理由或建议</div>
                <div class="popupModal-main-textarea">
                  <textarea v-model="auditRemark" placeholder="请输入节点不通过理由或建议" maxlength="200" class="exitTaskReason"></textarea>
                  <!-- <el-input
                    v-model="auditRemark"
                    class="exitTaskReason"
                    maxlength="200"
                    placeholder="请输入节点不通过理由或建议"
                    show-word-limit
                    type="textarea"
                  /> -->
                </div>
                <div class="popupModal-main-but-group">
                    <div class="popupModal-main-but" @click="handSubmitExitTask">立即提交</div>
                </div>
              </div>
            </div>
            <div class="close" @click="isReject = false">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { aeUseStore } from '@/stores/user';
  import { extractIdFromUrl, getItem } from '@/utils/index';
  import { nodeDataGet, nodeDataAudit } from '@/api/dao';
  import { showPopup } from '@/utils/usePopup';
  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;
  console.log('userInfo', userInfo);
  const router = useRouter();
  const remoteVideo = ref<HTMLVideoElement | null>(null);

  const details = ref({
    userId: null as number | null,  // 用户id
    username: '',  // 	用户名
    userAvatar: '',  // 用户头像
    userMotto: '',  // 用户座右铭
    name: '',  // 节点名称
    description: '',  // 节点描述
    uploadTime: '',  // 上传时间
    urls: '',  // 文件列表
    auditStatus: '',  // 1: 待审核 2: 已通过 3: 已驳回
    jobName: '',  // 子/任务名称
    auditRemark: '',  //  审核失败意见
    auditUserId: '', // 审核员id
    auditUsername: '', // 审核用户名
    auditUserAvatar: '', //  审核用户头像
  });

  // 返回上一页
  const goBack = () => {
    router.go(-1);
  };

  // 定义图片和视频的后缀列表
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'mkv'];
  const textExtensions = ['txt', 'docx', 'pdf', 'doc', 'xls', 'xlsx'];
  // 函数用于获取文件扩展名
  const getFileExtension = (filename: string) => {
    const match = filename.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : '';
  }

  const getFileType = (filename: string) => {
    const extension = getFileExtension(filename);
    if (imageExtensions.includes(extension)) {
      return 'image';
    } else if (videoExtensions.includes(extension)) {
      return 'video';
    } else if (textExtensions.includes(extension)) {
      return 'text';
    } else {
      return 'other';
    }
  };


   /** 获取节点详情 **/
  const getNodeDetails = async () => {
      const currentUrl = window.location.href; // 获取当前页面的 URL
      let id = extractIdFromUrl(currentUrl)+'';
      
      let businessId = '';
      if(userInfo.businessId == '') {
        businessId = userInfo.businessId
      } else {
        businessId = getItem('businessId');
      }

      const nodeType = ref();
      if(userInfo.nodeType == 2 || userInfo.nodeType == 3) {
        nodeType.value = 2
      } else {
        nodeType.value = userInfo.nodeType;
      }

      let reqData = {
          id: id,
          businessId: businessId,
          businessType: nodeType.value
      }
      return new Promise<void>((resolve, reject) => {
        nodeDataGet(reqData).then((response: any) => {
              const { code, data, message } = response;
              
              const resultData = data;
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                  return;
              }
              let arrt = [];
              resultData.urls.forEach((item: any) => {
                console.log('getFileType(item)', getFileType(item));
                let obj = {};
                obj.type = getFileType(item);
                obj.url = item;
                arrt.push(obj);
              })

              resultData.urls = arrt;
              details.value = resultData;
              console.log('details.value', details.value);
              if (remoteVideo.value) {
                remoteVideo.value.addEventListener('canplay', () => {
                  remoteVideo.value.play();
                });

                remoteVideo.value.addEventListener('error', (event) => {
                  console.error('Video error:', event);
                });
              }
              resolve()
          }).catch((error: any) => {
              reject(error)
          })
      })
  };


  // 审核
  const isExitTask = ref(false);
  const isexm = ref(3); // 2不通过 3通过
  const handExamineFun = (type: number) => {
    console.log('type', type);
    isExitTask.value = true;
    if(type == 1) {
      isexm.value = 3;
    } else if(type == 2) {
      isexm.value = 2;
    }
  };

  // 提交审核通过
  const handSubmitExitTask = () => {
    const currentUrl = window.location.href; // 获取当前页面的 URL
    let id = extractIdFromUrl(currentUrl)+'';
    let businessId = '';
    if(userInfo.businessId == '') {
      businessId = userInfo.businessId
    } else {
      businessId = getItem('businessId');
    }
    const nodeType = ref();
    if(userInfo.nodeType == 2 || userInfo.nodeType == 3) {
      nodeType.value = 2
    } else {
      nodeType.value = userInfo.nodeType;
    }
    let reqData = {
      businessId: businessId, //	String	必传	类型为1对应任务id 类型为2对应子任务id
      businessType: nodeType.value, //	String	必传	类型： 1任务 2子任务
      nodeDataId: id, //	Long	必传	节点数据id
      remark: auditRemark.value, //	String	选传	审核失败时备注内容
      auditStatus: isexm.value, //	Byte	必传	审核状态: 2审核失败 3审核成功
    }
    return new Promise<void>((resolve, reject) => {
      nodeDataAudit(reqData).then((response: any) => {
        const { code, data, message } = response;
        
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        isReject.value = false;
        isExitTask.value = false;
        getNodeDetails();
        resolve()
      }).catch((error: any) => {
        reject(error)
      })
    })
  };

  // 审核不通过弹框
  const auditRemark = ref(''); // 不通过理由
  const isReject = ref(false); // 驳回不通过理由
  // 提交
  const handSubmitReject = () => {
    console.log('auditRemark', auditRemark.value);
  };



  onMounted(() => {
    getNodeDetails();
  });
</script>

<style lang='scss' scoped>
  .node{
    width: 100%;
    height: calc(100% - 50px);
    .node-container{
      height: 100%;
      padding: 0 31px;
      .node-header{
        width: 100%;
        height: auto;
        margin-top: 30px;
        .node-header-flex{
          width: 100%;
          height: auto;
          display: flex;
          .node-header-flex-l{
            height: auto;
            flex-shrink: 0;
            .node-header-flex-l-main{
              width: 100%;
              height: auto;
              
              .node-header-flex-l-main-previous{
                width: auto;
                height: auto;
                display: flex;
                justify-content: space-between;
                .previous-icon{
                  width: 24px;
                  height: auto;
                  margin-right: 15px;
                  cursor: pointer;
                  i{
                    font-size: 24px;
                    color: #FFFFFF;
                    display: block;
                    line-height: 48px;
                    text-align: center;
                  }
                }
                .previous-name{
                  width: 300px;
                  font-size: 20px;
                  color: #FFFFFF;
                  line-height: 24px;
                  text-align: left;
                  font-style: normal;
                  text-transform: none;
                  .previous-name-main{
                    width: 100%;
                    height: auto;
                    display: flex;
                    .previous-name-main-img{
                      width: 36px;
                      height: auto;
                      flex-shrink: 0;
                      margin: 5px 12px 0 0;
                      img{
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        overflow: hidden;
                      }
                    }
                    .previous-name-main-text{
                      flex: 1;
                      width: 0;
                      .taskName{
                        font-size: 20px;
                        color: #FFFFFF;
                        line-height: 1;
                        text-align: left;
                        margin-bottom: 10px;
                        span{
                          width: 95px;
                          height: 24px;
                          border-radius: 12px;
                          font-size: 14px;
                          margin-left: 10px;
                          color: rgb(255, 255, 255, .7);
                          line-height: 22px;
                          text-align: center;
                          display: inline-block;
                          background-color: rgb(0, 0, 0, .45);
                        }
                      }
                      .reason{
                        font-size: 14px;
                        color: rgb(255, 255, 255, .7);
                        line-height: 1;
                        text-align: left;
                      }
                    }
                  }
                }
              }
              .flex-l-main-typeList{
                width: auto;
                height: auto;
                margin-right: 30px;
                display: inline-block;
                &:last-child{
                  margin-right: 0;
                }
                .flex-l-main-typeList-item{
                  cursor: pointer;
                  display: flex;
                  justify-content: center;
                  .flex-l-main-typeList-item-icon{
                    width: 24px;
                    height: auto;
                    margin-right: 7px;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      display: block;
                      line-height: 24px;
                    }
                  }
                  .flex-l-main-typeList-item-text{
                    display: inline-block;
                    font-weight: 500;
                    font-size: 16px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 24px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    margin-right: 5px;
                    white-space: nowrap;
                  }
                  .flex-l-main-typeList-item-line{
                    width: auto;
                    font-weight: 500;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 24px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                  }
                }
              }
            }
          }
          .node-header-flex-c{
            flex-grow: 1;
          }
          .node-header-flex-r{
            height: auto;
            flex-shrink: 0;
            .node-header-flex-r-main{
              width: 100%;
              height: auto;
              .examine{
                width: 315px;
                height: 48px;
                mask-image: url(@/assets/images/common/icon01.png);
                -webkit-mask-image: url(@/assets/images/common/icon01.png);
                mask-repeat: no-repeat;
                -webkit-mask-repeat: no-repeat;
                mask-size: 100% 100%;
              }
              .underReview{
                width: 218px;
                height: 48px;
                mask-image: url(@/assets/images/common/icon02.png);
                -webkit-mask-image: url(@/assets/images/common/icon02.png);
                mask-repeat: no-repeat;
                -webkit-mask-repeat: no-repeat;
                mask-size: 100% 100%;
              }
              .r-mian-bg{
                background-color: rgb(255, 255, 255, .08);
                backdrop-filter: blur(24px);
                position: relative;
                .r-mian-bg-main{
                  height: 100%;
                  display: flex;
                  padding: 0 14px 0 10px;
                  justify-content:space-between;
                  .r-main-dismiss{
                    width: 110px;
                    height: 100%;
                    cursor: pointer;
                    .r-main-conect{
                      width: 100%;
                      height: 100%;
                      display: flex;
                      justify-content: space-between;
                      .r-main-conect-icon{
                        width: 24px;
                        height: auto;
                        i{
                          font-size: 24px;
                          color: #FFFFFF;
                          line-height: 48px;
                        }
                      }
                      .r-main-conect-text{
                        font-size: 16px;
                        color: #FFFFFF;
                        line-height: 48px;
                        text-align: left;
                      }
                    }
                  }
                  .r-main-pass{
                    width: 100px;
                    height: 100%;
                    cursor: pointer;
                    .r-main-conect{
                      width: 100%;
                      height: 100%;
                      display: flex;
                      justify-content: space-between;
                      .r-main-conect-icon{
                        width: 24px;
                        height: auto;
                        i{
                          font-size: 24px;
                          color: #FFFFFF;
                          line-height: 48px;
                        }
                      }
                      .r-main-conect-text{
                        font-size: 16px;
                        color: #FFFFFF;
                        line-height: 48px;
                        text-align: left;
                      }
                    }
                  }
                  .r-main-time{
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 48px;
                    text-align: left;
                  }
                  .r-main-icon{
                    width: 24px;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      line-height: 48px;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .node-content{
        height: calc(100% - 30px);
        padding: 0 76px;
        overflow-y: auto;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
        .node-content-main{
          width: 100%;
          height: 100%;
          .node-content-main-title{
            font-size: 20px;
            color: #FFFFFF;
            line-height: 1;
            text-align: center;
            margin: 55px 0 41px 0;
          }
          .node-content-main-content{
            width: 100%;
            height: auto;
            .flie-item{
              width: 100%;
              height: auto;
              margin-bottom: 30px;
              &:last-child{
                margin-bottom: 0;
              }
            }
            img{
              width: 100%;
              height: auto;
              border-radius: 28px;
            }
            video{
              width: 100%;
              height: auto;
            }
          }
          .node-content-main-desc{
            width: 779px;
            height: auto;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 1.5;
            text-align: left;
            margin: 60px auto 0 auto;
          }
          .node-content-main-fileList{
            width: 100%;
            height: auto;
            margin-top: 38px;
            .fileList-item{
              font-size: 16px;
              color: #FFFFFF;
              line-height: 32px;
              text-align: left;
            }
          }
          .causeOfRejection{
            width: 740px;
            height: auto;
            border-radius: 28px;
            padding: 30px;
            margin-top: 50px;
            margin-bottom: 136px;
            display: inline-block;
            box-shadow: 12px 2px 38px 2px #000000;
            border: 1px solid rgb(255, 255, 255, .38);
            background-color: rgb(0, 0, 0, .18);
            .causeOfRejection-main{
              width: 100%;
              height: auto;
              display: flex;
              .causeOfRejection-main-img{
                width: 36px;
                height: auto;
                flex-shrink: 0;
                margin-right: 12px;
                img{
                  width: 36px;
                  height: 36px;
                  border-radius: 50%;
                  overflow: hidden;
                }
              }
              .causeOfRejection-main-text{
                flex: 1;
                width: 0;
                .taskName{
                  font-size: 16px;
                  color: #FFFFFF;
                  line-height: 24px;
                  text-align: left;
                  margin-bottom: 10px;
                  span{
                    width: 95px;
                    height: 24px;
                    border-radius: 12px;
                    font-size: 14px;
                    margin-left: 10px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 22px;
                    text-align: center;
                    display: inline-block;
                    background-color: rgb(0, 0, 0, .45);
                  }
                }
                .reason{
                  font-size: 14px;
                  color: #FFFFFF;
                  line-height: 22px;
                  text-align: left;
                }
              }
            }
          }
        }
      }
    }
  }
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
    .masking{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0);
    }
    .popupModal-center{
        width: 302px;
        height: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .popupModal-main{
            width: 302px;
            height: auto;
            padding-bottom: 41px;
            position: relative;
            .popupModal-module{
              width: 100%;
              height: auto;
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              z-index: -1;
              border-radius: 24px;
              border: 1px solid rgb(255, 255, 255, .38);
              box-shadow: 0px 9px 18px 9px rgb(0, 0, 0, .15);
              background: rgba(100, 99, 98, .16);
              backdrop-filter: blur(36px);
            }
            .popupModal-main-content{
              width: 100%;
              height: auto;
              display: inline-block;
              .popupModal-main-icon{
                  width: 53px;
                  margin: 57px auto 0 auto;
                  i{
                      font-size: 53px;
                      color: #FFFFFF;
                      display: block;
                  }
              }
              .popupModal-main-title{
                  width: 205px;
                  font-size: 18px;
                  color: #FFFFFF;
                  line-height: 1.5;
                  text-align: center;
                  font-style: normal;
                  text-transform: none;
                  margin: 31px auto 0 auto;
              }
              .popupModal-main-tips{
                  width: 235px;
                  font-size: 14px;
                  color: rgb(255, 255, 255, .7);;
                  line-height: 28px;
                  text-align: center;
                  font-style: normal;
                  text-transform: none;
                  margin: 10px auto 0 auto;
              }
              .popupModal-main-amount{
                font-size: 38px;
                color: #FFFFFF;
                line-height: 24px;
                text-align: center;
                font-style: normal;
                text-transform: none;
                margin-top: 17px;
              }
              .popupModal-main-textarea{
                padding: 30px;
                textarea{
                  width: calc(100% - 60px);
                  height: 200px;
                  background: transparent;
                  font-weight: 400;
                  font-size: 16px;
                  color: #FFFFFF;
                  line-height: 1.6;
                  text-align: left;
                  font-style: normal;
                  text-transform: none;
                  border: none;
                  resize: none;
                  letter-spacing: 1px;
                  padding: 30px 28px;
                  border-radius: 12px;
                  background-color: rgb(255, 255, 255, .08);
                  &::placeholder {
                    color:rgb(255, 255, 255, 0.68);
                    font-size: 16px;
                  }
                  &:focus-visible{
                    outline: none;
                  }
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
                :deep(.el-textarea){
                  width: 100%;
                  height: 200px;
                  textarea{
                    width: 100%;
                    height: 200px;
                    background: transparent;
                    font-weight: 400;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 1.6;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    border: none;
                    resize: none;
                    letter-spacing: 1px;
                    padding: 30px 28px;
                    border-radius: 12px;
                    background-color: rgb(255, 255, 255, .08);
                    &::placeholder {
                      color: rgb(255, 255, 255, 0.68);
                      font-size: 16px;
                    }
                    &:focus-visible{
                      outline: none;
                    }
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
                }
              }
              .popupModal-main-but{
                  height: 38px;
                  padding: 0 20px;
                  border-radius: 19px;
                  font-size: 16px;
                  color: #FFFFFF;
                  line-height: 38px;
                  text-align: center;
                  font-style: normal;
                  text-transform: none;
                  margin: 33px auto 0 auto;
                  cursor: pointer;
                  display: table;
                  background-color: rgba(255, 255, 255, 0.16);
                  backdrop-filter: blur(20px);
              }
              .popupModal-main-selectBut{
                  height: auto;
                  display: flex;
                  padding: 0 36px;
                  margin-top: 31px;
                  justify-content: space-between;
                  .popupModal-main-selectBut-item{
                      width: 110px;
                      height: 38px;
                      border-radius: 19px;
                      background-color: rgb(90, 87, 84, 1);
                      font-size: 16px;
                      color: #FFFFFF;
                      line-height: 38px;
                      text-align: center;
                      font-style: normal;
                      text-transform: none;
                      cursor: pointer;
                  }
              }
              .popupModal-main-but-group{
                width: 100%;
                height: auto;
                display: flex;
                margin-top: 20px;
                justify-content: center;
                .popupModal-main-but{
                  height: 38px;
                  padding: 0 37px;
                  font-size: 16px;
                  color: #FFFFFF;
                  line-height: 38px;
                  text-align: center;
                  font-style: normal;
                  text-transform: none;
                  cursor: pointer;
                  margin: 0;
                  &:first-child{
                    margin-right: 10px;
                  }
                }
              }
            }
        }
        .close{
            width: 34px;
            height: 34px;
            border-radius: 50%;
            margin: 20px auto 0 auto;
            i{
                font-size: 34px;
                color: #000000;
                display: block;
                cursor: pointer;
                line-height: 34px;
                text-align: center;
            }
        }
    }
    .rejectW{
      width: 500px !important;
    }
  }
</style>
