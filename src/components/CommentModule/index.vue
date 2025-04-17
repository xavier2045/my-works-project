<template>
  <div class="commentModule">
    <div class="commentModule-header">
      <div class="header-main">
        <div class="header-left">
          <div class="header-left-main">
            <div class="header-left-icon">
              <i class="icon font_family icon-shequhudong24"></i>
            </div>
            <div class="header-left-text">作品评论</div>
          </div>
        </div>
        <div class="header-right" @click="findCloseModule">
          <div class="header-right-back relievoShadow">
            <i class="icon font_family icon-guanbiwubeijing20"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="commentModule-content">
      <div class="comment">
        <div class="comment-list">
          <CommentList
            ref="commentListRef"
            :refresh="refreshCommentList"
            :propoaslId="Number(workId)"
            :type="Number(2)"
            @someEvent="handleSomeEvent"
          />
        </div>
        <div class="comment-input">
          <div class="main-eval">
            <div class="main-eval-content">
              <div class="main-eval-content-m overflowYAuto">
                <div class="content-textarea">
                  <textarea
                    v-model="editableText"
                    class="editableTextarea"
                    placeholder="提出你的宝贵评论吧"
                    @focus="handleFocus"
                    @blur="isFocused = false"
                  ></textarea>
                </div>
                <div class="content-upload" @click="handleCommentAddFun">
                  <div class="upload-icon">
                    <i class="icon font_family icon-fasongxiaoxi34"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, nextTick, onMounted } from "vue";
import { aeUseStore } from "@/stores/user";
import CommentList from "@/components/comment/commentList.vue";
import { commentAdd } from "@/api/common";
import { showPopup } from "@/utils/usePopup";
import { getCurrentTimeFormatted } from "@/utils/index";

export default defineComponent({
  name: "CommentModule",
  components: {
    CommentList,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  emits: ["back"],
  setup(props, { emit }) {
    const userStore = aeUseStore();
    const userInfo = userStore.getUserInfo;
    const editableText = ref<string>("");
    const workId = ref<number>(props.id);
    const refreshCommentList = ref(false);
    const isFocused = ref(false);
    const commentListRef = ref<InstanceType<typeof CommentList> | null>(null);
    const isSubmitting = ref(false);

    onMounted(() => {
      console.log("CommentModule mounted");
    });

    const handleFocus = () => {
      isFocused.value = true;
    };

    const handleCommentAddFun = async () => {
      if (isSubmitting.value) {
        console.warn("Submission blocked: already submitting");
        return;
      }
      isSubmitting.value = true;

      const reqData = {
        businessId: workId.value,
        businessType: 2,
        content: editableText.value.trim(),
        imageUrl: "",
        parentCommentId: 0,
        replyCommentId: "",
        replyUserId: undefined,
      };

      if (!reqData.content) {
        showPopup("评论内容不能为空", "error", 3000);
        isSubmitting.value = false;
        return;
      }

      try {
        const response = await commentAdd(reqData);

        if (!response || typeof response !== "object") {
          throw new Error("Invalid response format from commentAdd API");
        }

        const { code, message, data } = response;

        if (code === 200) {
          const newComment = {
            id: data?.id || Date.now(),
            content: reqData.content,
            userAvatar: userInfo.avatar || "",
            username: userInfo.userName || "当前用户",
            createTime: data?.createTime || getCurrentTimeFormatted(),
            pointNum: data?.pointNum || 0,
            isPoint: data?.isPoint || 0,
            replyNum: data?.replyNum || 0,
          };
          editableText.value = ""; // 通过 v-model 清空
          isFocused.value = false;

          await nextTick();
          if (commentListRef.value) {
            commentListRef.value.addComment(newComment);
            showPopup("评论添加成功", "success", 3000);
          } else {
            refreshCommentList.value = !refreshCommentList.value;
            showPopup("评论添加成功（列表未实时更新）", "success", 3000);
          }
        } else {
          throw new Error(message || "添加评论失败");
        }
      } catch (error) {
        showPopup("添加评论失败: " + (error.message || "未知错误"), "error", 3000);
        refreshCommentList.value = !refreshCommentList.value; // 强制刷新
      } finally {
        isSubmitting.value = false;
      }
    };

    const handleSomeEvent = (comments: any) => {
      console.log("Received comments:", comments);
    };

    const findCloseModule = () => {
      emit("back");
    };

    return {
      workId,
      userInfo,
      userStore,
      editableText,
      handleFocus,
      findCloseModule,
      refreshCommentList,
      handleCommentAddFun,
      handleSomeEvent,
      isFocused,
      commentListRef,
    };
  },
});
</script>

<style lang="scss" scoped>
    /* 调整样式以适应 textarea */
    .editableTextarea {
      position: relative;
      width: 100%;
      min-height: 40px;
      outline: none;
      font-weight: 400;
      font-size: 14px;
      color: #ffffff;
      line-height: 1.5;
      text-align: left;
      background: transparent;
      border: none;
      resize: none;
      padding: 5px;
    }

    .editableTextarea::placeholder {
      color: rgb(255, 255, 255, 0.68);
    }
    .placeholder {
        position: absolute;
        font-size: 14px;
        color: rgb(255, 255, 255, 0.68);
        pointer-events: none;
        user-select: none;
    }
    
    .editableDiv {
        position: relative;
        width: 100%;
        height: auto;
        outline: none;
        font-weight: 400;
        font-size: 14px;
        color: #FFFFFF;
        line-height: 1.5;
        text-align: left;
    }
    .commentModule{
        width: calc(100% - 40px);
        height: calc(100% - 40px);
        padding: 20px;
        display: flex;
        flex-direction: column;
        .commentModule-header{
            width: 100%;
            height: 40px;
            flex-shrink: 0;
            .header-main{
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: space-between;
                .header-left{
                    display: inline-block;
                    .header-left-main{
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: flex-start;
                        .header-left-icon{
                            i{
                                font-size: 24px;
                                line-height: 40px;
                                display: block;
                                color: rgb(255, 255, 255, .7);
                            }
                        }
                        .header-left-text{
                            font-weight: 400;
                            font-size: 18px;
                            color: #FFFFFF;
                            text-align: left;
                            line-height: 40px;
                        }
                    }
                }
                .header-right{
                    display: inline-block;
                    .header-right-back{
                        width: 30px;
                        height: 30px;
                        margin: 5px 0;
                        cursor: pointer;
                        border-radius: 50%;
                        i{
                            font-weight: 400;
                            font-size: 24px;
                            text-align: center;
                            color: rgb(255, 255, 255, .7);
                            line-height: 30px;
                            display: block;
                        }
                    }
                }
            }
        }
        .commentModule-content{
            flex-grow: 1;
            height: calc(100% - 40px);
            .comment{
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                .comment-list{
                    width: 100%;
                    flex-grow: 1;
                    height: calc(100% - 55px);
                }   
                .comment-input{
                    width: 100%;
                    flex-shrink: 0;
                    min-height: 50px;
                    margin-top: 5px;
                    .main-eval{
                        height: 100%;
                        padding: 0 20px;
                        .main-eval-content{
                            width: calc(100% - 20px);
                            height: calc(100% - 20px);
                            padding: 10px;
                            border-radius: 18px;
                            // border: 1px solid rgb(255, 255, 255, .18);
                            background: rgba(0, 0, 0, .08);
                            backdrop-filter: blur(68px);
                            // box-shadow: 5px 0px 5px 0px #000000;
                            box-shadow: 5px 2px 5px 0px rgba(0, 0, 0, 0.24), 
                            inset 1px 1px 3px rgba(255, 255, 255, 0.32);
                            .main-eval-content-m{
                                width: 100%;
                                height: 100%;
                                display: flex;
                                .content-textarea{
                                    flex: 1;
                                    width: 0;
                                    .editableDiv {
                                        width: 100%;
                                        height: auto;
                                        outline: none;
                                        font-weight: 400;
                                        font-size: 14px;
                                        color: #FFFFFF;
                                        line-height: 1.5;
                                        text-align: left;
                                        position: relative;
                                        p {
                                            font-size: 14px;
                                            color: #aaa;
                                            pointer-events: none;
                                            user-select: none;
                                            font-size: 14px;
                                            text-align: left;
                                            color: rgb(255, 255, 255, .7);
                                            position: absolute;
                                            z-index: 0;
                                        }
                                    }
                                    .fileSection{
                                        width: 100%;
                                        height: auto;
                                        display: flex;
                                        justify-content: flex-start;
                                        flex-wrap: wrap;
                                        .file-item{
                                            width: 100px;
                                            height: 100px;
                                            padding: 5px;
                                            position: relative;
                                            .file-item-close{
                                                width: 30px;
                                                height: 30px;
                                                position: absolute;
                                                top: -7px;
                                                right: -7px;
                                                cursor: pointer;
                                                background: url(@/assets/images/task/back_bg.png) no-repeat center center;
                                                background-size: 100% 100%;
                                                &:hover{
                                                    background: url(@/assets/images/task/back_bg_hover.png) no-repeat center center;
                                                    background-size: 100% 100%;
                                                }
                                                i{
                                                    font: 14px;
                                                    color: #FFFFFF;
                                                    text-align: center;
                                                    line-height: 30px;
                                                    display: block;
                                                }
                                            }
                                            .fileClass{
                                                width: 98px;
                                                height: 98px;
                                                border-radius: 12px;
                                                border: 1px solid rgb(255, 255, 255, .38);
                                                .fileClass-icon{
                                                    width: 100%;
                                                    height: 100%;
                                                    text-align: center;
                                                    line-height: 100px;
                                                    i{
                                                        font-size: 56px;
                                                        color: rgb(255, 255, 255, .7);
                                                        display: block;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    img, video{
                                        width: 100px;
                                        height: 100px;
                                        border-radius: 12px;
                                    }
                                }
                                .content-upload{
                                    width: 60px;
                                    flex-shrink: 0;
                                    cursor: pointer;
                                    position: relative;
                                    .upload-icon{
                                        width: 100%;
                                        height: 100%;
                                        display: flex;
                                        align-items: flex-end;
                                        justify-content: space-evenly;
                                        i{
                                            font-size: 20px;
                                            text-align: center;
                                            display: flex;
                                            line-height: 30px;
                                            justify-content: center;
                                            color: rgb(255, 255, 255, .7);
                                        }
                                    }
                                    .upload-wrapper{
                                        width: 100%;
                                        height: 100%;
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        right: 0;
                                        bottom: 0;
                                        opacity: 0;
                                        z-index: 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
  </style>
  