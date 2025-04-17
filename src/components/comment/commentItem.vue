<template>
  <div class="comment-item">
    <div class="comment">
      <!-- 头像 -->
      <div class="avatar">
        <el-image :src="comment.userAvatar" fit="cover">
          <template #error>
            <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
          </template>
        </el-image>
      </div>
      <!-- 内容区 -->
      <div class="comment-content">
        <div class="comment-header">
          <div class="comment-info">
            <span class="username">{{ comment.username }}</span>
            <div class="cmnt">
              <div class="cmnt-click" @click="iscmnt = !iscmnt">
                <i class="icon font_family icon-liuyandiandian24"></i>
              </div>
              <div class="cmnt-item" v-if="iscmnt">
                <div class="item-but" @click="loadCommentDel(comment.id)">删除评论</div>
                <div class="item-but" @click="loadCommentReport(comment.id)">举报评论</div>
              </div>
            </div>
          </div>
        </div>

        <div class="comment-text">
          <p class="content" v-if="comment.replyUsername">
            <span class="reply-tag">@{{ comment.replyUsername }}</span> {{ comment.content }}
          </p>
          <p class="content" v-else>
            {{ comment.content }}
          </p>
        </div>

        <!-- 操作按钮 -->
        <div class="comment-actions actions">
          <div class="actions-options">
            <div class="options-item">
              <button class="item-but like-btn" @click="toggleLike">
                <i class="icon font_family icon-lishiguanzhushixin24" :class="{ liked: isLiked }"></i>
                <span>{{ likeCount }}</span>
              </button>
              <button class="item-but reply-btn" @click="toggleReply(comment)">
                <i class="icon font_family icon-liuyan20"></i>
                <span> 评论</span>
              </button>
            </div>
          </div>
          <div class="actions-date">
            <span class="date">{{ formatDateTime(comment.createTime) }}</span>
          </div>
        </div>

        <!-- 顶级评论的回复框 -->
        <div v-if="isReplying && replyingTo === comment" class="reply-box">
          <textarea
            class="overflowYAuto"
            v-model="replyContent"
            placeholder="输入回复..."
            ref="replyTextarea"
          ></textarea>
          <div class="reply-buttons">
            <div class="but but-review" @click="submitReply">评论</div>
            <div class="but but-Cancel" @click="cancelReply">取消</div>
          </div>
        </div>

        <!-- 展开评论按钮 -->
        <div v-if="comment.replyNum > 0" class="openAComment expand-replies" @click="loadReplies">
          <span>{{ showReplies ? "收起评论" : "展开评论" }} ({{ comment.replyNum || 0 }})</span>
          <i
            class="icon font_family icon-a-jiantouxiangxiazhankai20"
            :class="showReplies ? 'icon-a-jiantouxiangshangshousuo20' : 'icon-a-jiantouxiangxiazhankai20'"
          ></i>
        </div>

        <!-- 二级评论展示 -->
        <div v-if="showReplies" class="replies">
          <div v-for="reply in replies" :key="reply.id" class="reply">
            <div class="avatar">
              <el-image :src="reply.userAvatar" fit="cover">
                <template #error>
                  <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                </template>
              </el-image>
            </div>
            <div class="reply-content">
              <div class="comment-header">
                <div class="comment-info">
                  <span class="username">{{ reply.username }}</span>
                  <div class="cmnt">
                    <div class="cmnt-click" @click="reply.iscmnt = !reply.iscmnt">
                      <i class="icon font_family icon-liuyandiandian24"></i>
                    </div>
                    <div class="cmnt-item" v-if="reply.iscmnt">
                      <div class="item-but" @click="loadCommentDel(reply.id)">删除评论</div>
                      <div class="item-but" @click="loadCommentReport(reply.id)">举报评论</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="comment-text">
                <p class="content" v-if="reply.replyUsername">
                  <span class="reply-tag">回复<span>{{ reply.replyUsername }}</span></span> {{ reply.content }}
                </p>
                <p class="content" v-else>
                  {{ reply.content }}
                </p>
              </div>
              <div class="comment-actions actions">
                <div class="actions-options">
                  <div class="options-item">
                    <button class="item-but like-btn" @click="toggleReplyLike(reply)">
                      <i
                        class="icon font_family icon-guanzhu20"
                        :class="{ liked: reply.isPoint === 1 }"
                      ></i>
                      <span>{{ reply.pointNum || 0 }}</span>
                    </button>
                    <button class="item-but reply-btn" @click="toggleReply(reply)">
                      <i class="icon font_family icon-liuyan20"></i>
                      <span> 回复</span>
                    </button>
                  </div>
                </div>
                <div class="actions-date">
                  <span class="date">{{ reply.createTime }}</span>
                </div>
              </div>

              <!-- 二级评论的回复框 -->
              <div v-if="isReplying && replyingTo === reply" class="reply-box">
                <textarea
                  class="overflowYAuto"
                  v-model="replyContent"
                  placeholder="输入回复..."
                  ref="replyTextarea"
                ></textarea>
                <div class="reply-buttons">
                  <div class="but but-review" @click="submitReply">评论</div>
                  <div class="but but-Cancel" @click="cancelReply">取消</div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="replies.length < replyTotal" class="load-more-replies" @click="loadMoreReplies">
            加载更多评论
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from "vue";
import { aeUseStore } from "@/stores/user";
import { formatDateTime } from "@/utils/index";

const userStore = aeUseStore();
const userInfo = userStore.getUserInfo;

interface Comment {
  id?: number;
  parentId: number;
  replyCommentId: number;
  parentCommentId: number;
  replyUserId: number;
  content: string;
  userAvatar: string;
  username?: string;
  pointNum?: number;
  isPoint?: number;
  replyNum?: number;
  createTime?: string;
  replyUsername?: string;
  userId?: number;
  children?: Comment[];
  iscmnt?: boolean;
}

export default defineComponent({
  name: "CommentItem",
  props: {
    comment: {
      type: Object as () => Comment,
      required: true,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const isLiked = ref(props.comment.isPoint === 1);
    const likeCount = ref(props.comment.pointNum || 0);
    const isReplying = ref(false);
    const replyContent = ref("");
    const replies = ref<Comment[]>(props.comment.children || []);
    const showReplies = ref(false);
    const isLoadingReplies = ref(false);
    const replyPageNum = ref(1);
    const replyTotal = ref(0);
    const iscmnt = ref(false);
    const replyingTo = ref<Comment | null>(null);
    const replyTextarea = ref<HTMLTextAreaElement | null>(null);

    const toggleLike = () => {
      isLiked.value = !isLiked.value;
      likeCount.value += isLiked.value ? 1 : -1;
      emit("like-comment", props.comment.id, isLiked.value);
    };

    const toggleReplyLike = (reply: Comment) => {
      reply.isPoint = reply.isPoint === 1 ? 0 : 1;
      reply.pointNum = (reply.pointNum || 0) + (reply.isPoint ? 1 : -1);
      emit("like-comment", reply.id, reply.isPoint === 1);
    };

    const toggleReply = (targetComment: Comment) => {
      if (isReplying.value && replyingTo.value === targetComment) {
        isReplying.value = false;
        replyingTo.value = null;
        replyContent.value = "";
      } else {
        isReplying.value = true;
        replyingTo.value = targetComment;
        replyContent.value = `@${targetComment.username} `;
        focusTextarea();
      }
    };

    const cancelReply = () => {
      isReplying.value = false;
      replyingTo.value = null;
      replyContent.value = "";
    };

    const focusTextarea = () => {
      nextTick(() => {
        if (replyTextarea.value) {
          replyTextarea.value.focus();
          replyTextarea.value.setSelectionRange(replyContent.value.length, replyContent.value.length);
        } else {
          console.warn("Textarea not found, retrying...");
          setTimeout(focusTextarea, 100);
        }
      });
    };

    const submitReply = () => {
      if (!replyContent.value.trim() || !replyingTo.value) return;
      const contentWithoutMention = replyContent.value
        .replace(new RegExp(`@${replyingTo.value.username}\\s*`, "g"), "")
        .trim();
      const newReply: Comment = {
        parentId: props.comment.parentId || props.comment.id || 0,
        replyCommentId: replyingTo.value.id || 0,
        parentCommentId: props.comment.id || 0,
        replyUserId: replyingTo.value.userId || replyingTo.value.id || 0,
        content: contentWithoutMention.trim(),
        userAvatar: userInfo.avatar || "",
      };
      emit("reply-comment", newReply, (success: boolean) => {
        if (success) {
          isReplying.value = false;
          replyingTo.value = null;
          replyContent.value = "";
          refreshReplies(); // 提交成功后刷新并保持展开
        } else {
          console.error("Reply failed");
        }
      });
    };

    const loadReplies = () => {
      if (!showReplies.value) {
        refreshReplies();
      } else {
        showReplies.value = false;
      }
    };

    const refreshReplies = () => {
      isLoadingReplies.value = true;
      const parentId = props.comment.parentId === 0 ? props.comment.id || 0 : props.comment.parentId;
      replyPageNum.value = 1;
      emit("load-replies", parentId, replyPageNum.value, (fetchedReplies: Comment[], total: number) => {
        replies.value = fetchedReplies.map((r) => ({ ...r, iscmnt: false }));
        replyTotal.value = total;
        isLoadingReplies.value = false;
        showReplies.value = true;
      });
    };

    const loadMoreReplies = () => {
      if (isLoadingReplies.value) return;
      isLoadingReplies.value = true;
      replyPageNum.value++;
      const parentId = props.comment.parentId === 0 ? props.comment.id || 0 : props.comment.parentId;
      emit("load-replies", parentId, replyPageNum.value, (fetchedReplies: Comment[], total: number) => {
        replies.value.push(...fetchedReplies.map((r) => ({ ...r, iscmnt: false })));
        replyTotal.value = total;
        isLoadingReplies.value = false;
      });
    };

    const loadCommentDel = (id: number) => {
      emit("load-del", id);
    };

    const loadCommentReport = (id: number) => {
      emit("load-report", id);
    };

    return {
      iscmnt,
      isLiked,
      likeCount,
      replyPageNum,
      replyTotal,
      isReplying,
      replyContent,
      replies,
      showReplies,
      isLoadingReplies,
      replyTextarea,
      submitReply,
      toggleLike,
      toggleReply,
      toggleReplyLike,
      cancelReply,
      loadMoreReplies,
      loadReplies,
      refreshReplies,
      loadCommentDel,
      loadCommentReport,
      formatDateTime,
      replyingTo,
    };
  },
});
</script>

<style lang="scss" scoped>


.comment-item {
  display: flex;
  flex-direction: column;
}


.reply-tag {
  width: 100%;
  color: #FFFFFF;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  span{
    margin: 0 5px;
    color: rgba(255, 255, 255, 0.68);
  }
}

.comment-actions {
  display: flex;
  gap: 15px;
  margin-top: 8px;
}

.like-btn, .reply-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.liked {
  color: red;
}

.reply-box {
  width: calc(100% - 11px);
  height: auto;
  margin-top: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.38);
  textarea {
    width: 100% !important;
    min-height: 40px;
    border-radius: 5px;
    background: transparent;
    outline: none;
    margin-bottom: 5px;
    border: none;
    margin: 5px;
    font-size: 14px;
    line-height: 1.5;
    resize: none;
    color: rgba(255, 255, 255, 0.8);
  }
  .reply-buttons {
    width: 100%;
    height: 42px;
    display: flex;
    justify-content: flex-end;
    .but {
      padding: 5px 10px;
      cursor: pointer;
      border: none;
      color: rgba(255, 255, 255, 0.68);
      line-height: 32px;
    }
  }
}

.comment-item {
    width: 100%;
    height: auto;
    margin-bottom: 16px;
    .comment {
        width: 100%;
        height: auto;
        display: flex;
        align-items: flex-start;
        .avatar {
            width: 40px;
            height: 40px;
            flex-shrink: 0;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;
            background: url(@/assets/images/task/avatar_bg.png) no-repeat center center;
            background-size: 100% 100%;
            :deep(.el-image, img) {
                width: 70%;
                height: 70%;
                border-radius: 50%;
                display: block;
                margin: 15% auto;
            }
        }
        .comment-content {
            flex: 1;
            width: 0;
            padding-right: 5px;
            .comment-header{
              width: 100%;
              height: auto;
              display: flex;
              justify-content: space-between;
              .comment-info{
                width: 100%;
                height: auto;
                display: flex;
                justify-content: space-between;
                .username{
                  flex: 1;
                  width: 1;
                  font-size: 16px;
                  color: #FFFFFF;
                  line-height: 1;
                  text-align: left;
                  font-style: normal;
                  text-transform: none;
                }
                .cmnt{
                  width: 90px;
                  flex-shrink: 0;
                  font-size: 16px;
                  color: #FFFFFF;
                  line-height: 1;
                  text-align: left;
                  font-style: normal;
                  text-transform: none;
                  position: relative;
                  .cmnt-click{
                    width: 30px;
                    height: auto;
                    cursor: pointer;
                    border-radius: 6px;
                    float: right;
                    &:hover{
                      background: rgba(255, 255, 255, 0.1);
                    }
                    i{
                      font-size: 24px;
                      display: block;
                      text-align: center;
                    }
                  }
                  .cmnt-item{
                    width: 79px;
                    height: auto;
                    position: absolute;
                    top: 10px;
                    right: 50px;
                    z-index: 1;
                    .item-but{
                      width: 79px;
                      font-size: 12px;
                      text-align: center;
                      line-height: 26px; 
                      color: rgba(255, 255, 255, 1);
                      display: block;
                      margin-bottom: 1px;
                      padding: 0 10px;
                      border-radius: 13px;
                      cursor: pointer;
                      margin-bottom: 5px;
                      box-shadow: 1px 3px 9px rgba(44, 44, 44, 0.5), /* 外发光 */
                          -1px 1px 3px rgba(255, 255, 255, 0.2) inset; /* 内发光 */
                      border: 1px solid rgba(0, 0, 0, 0.01);
                      background: rgba(58, 55, 55, 0.1);
                      backdrop-filter: blur(9px);
                      &:last-child{
                        margin-bottom: 0;
                      }
                      &:hover{
                        box-shadow: 1px 3px 9px rgba(44, 44, 44, 0.6), /* 外发光 */
                          -1px 1px 3px rgba(255, 255, 255, 0.3) inset; /* 内发光 */
                        border: 1px solid rgba(0, 0, 0, 0.01);
                        background: rgba(58, 55, 55, 0.1);
                      }
                    }
                  }
                }
              }
              
            }
            .comment-text{
              width: 100%;
              height: auto;
              margin-top: 10px;
              .content{
                font-size: 14px;
                color: #FFFFFF;
                line-height: 1.3;
                text-align: left;
                font-style: normal;
                text-transform: none;
              }
            }
            .item-content{
                width: 100%;
                height: auto;
                margin: 15px 0;
                font-size: 16px;
                color: #FFFFFF;
                line-height: 1.5;
                text-align: left;
                font-style: normal;
                text-transform: none;
            }
            .actions {
                width: 100%;
                height: auto;
                margin-top: 8px;
                display: flex;
                justify-content: space-between;
                .actions-options{
                    display: inline-block;
                    .options-item{
                        display: flex;
                        justify-content: flex-start;
                        .item-but{
                            cursor: pointer;
                            display: inline-block;
                            i{
                                font-size: 16px;
                                color: #FFFFFF;
                                line-height: 1;
                                text-align: left;
                                font-style: normal;
                                text-transform: none; 
                                margin: 0 8px;
                            }
                            span{
                                font-size: 16px;
                                color: #FFFFFF;
                                line-height: 1;
                                text-align: left;
                                font-style: normal;
                                text-transform: none; 
                            }
                        }
                    }
                }
                .actions-date{
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.68);
                    line-height: 1;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    .date{
                        display: block;
                    }
                }
            }
            .openAComment{
              display: block;
              font-size: 14px;
              color: rgba(255, 255, 255, 0.68);
              line-height: 1;
              text-align: left;
              margin-top: 23px;
              cursor: pointer;
            }
        }
    }
    .reply-input textarea {
        width: 100%;
        margin-top: 8px;
        padding: 8px;
    }
    .replies {
        margin-top: 12px;
        transition: all 0.3s ease;
        .load-more-replies{
          width: 100%;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.68);
          line-height: 1;
          text-align: center;
          cursor: pointer;
          margin: 10px 0 20px 0;
        }
        .reply {
            width: 100%;
            display: flex;
            margin-top: 10px;
            justify-content: flex-start;
            .avatar {
                width: 40px;
                height: 40px;
                flex-shrink: 0;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 10px;
                background: url(@/assets/images/task/avatar_bg.png) no-repeat center center;
                background-size: 100% 100%;
                :deep(.el-image, img) {
                    width: 70%;
                    height: 70%;
                    border-radius: 50%;
                    display: block;
                    margin: 15% auto;
                }
            }
            .reply-content{
                flex: 1;
                width: 0;
                .header{
                    width: 100%;
                    height: auto;
                    display: flex;
                    justify-content: space-between;
                    .username{
                        font-size: 16px;
                        color: #FFFFFF;
                        line-height: 1;
                        text-align: left;
                        font-style: normal;
                        text-transform: none;
                    }
                    .cmnt{
                        font-size: 16px;
                        color: #FFFFFF;
                        line-height: 1;
                        text-align: left;
                        font-style: normal;
                        text-transform: none;
                        position: relative;
                        .cmnt-click{
                            width: 30px;
                            height: auto;
                            cursor: pointer;
                            border-radius: 6px;
                            &:hover{
                                background: rgba(255, 255, 255, 0.1);
                            }
                            i{
                                font-size: 24px;
                                display: block;
                                text-align: center;
                            }
                        }
                        .cmnt-item{
                            width: 79px;
                            height: auto;
                            position: absolute;
                            top: 10px;
                            right: 50px;
                            z-index: 1;
                            .item-but{
                                width: 79px;
                                font-size: 12px;
                                text-align: center;
                                line-height: 26px; 
                                color: rgba(255, 255, 255, 1);
                                display: block;
                                margin-bottom: 1px;
                                padding: 0 10px;
                                border-radius: 13px;
                                cursor: pointer;
                                box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.5), /* 外发光 */
                                    -1px 1px 3px rgba(255, 255, 255, 0.5) inset; /* 内发光 */
                                border: 1px solid rgba(0, 0, 0, 0.01);
                                background: rgba(0, 0, 0, 0.5);
                                backdrop-filter: blur(9px);
                                &:last-child{
                                    margin-bottom: 0;
                                }
                                &:hover{
                                    box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.2), /* 外发光 */
                                        -1px 1px 3px rgba(255, 255, 255, 0.2) inset; /* 内发光 */
                                    border: 1px solid rgba(0, 0, 0, 0.01);
                                    background: rgba(0, 0, 0, 0.3);
                                }
                            }
                        }
                    }
                }
                .item-content{
                    width: 100%;
                    height: auto;
                    margin: 15px 0;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 1.5;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                }
                .actions {
                    width: 100%;
                    height: auto;
                    margin-top: 8px;
                    display: flex;
                    justify-content: space-between;
                    .actions-options{
                        display: inline-block;
                        .options-item{
                            display: flex;
                            justify-content: flex-start;
                            .item-but{
                                cursor: pointer;
                                display: inline-block;
                                i{
                                    font-size: 16px;
                                    color: #FFFFFF;
                                    line-height: 1;
                                    text-align: left;
                                    font-style: normal;
                                    text-transform: none; 
                                    margin: 0 8px;
                                }
                                span{
                                    font-size: 16px;
                                    color: #FFFFFF;
                                    line-height: 1;
                                    text-align: left;
                                    font-style: normal;
                                    text-transform: none; 
                                }
                            }
                        }
                        .openAComment{
                            display: block;
                        }
                    }
                    .actions-date{
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.68);
                        line-height: 1;
                        text-align: left;
                        font-style: normal;
                        text-transform: none;
                        .date{
                            display: block;
                        }
                    }
                }
            }
        }
        
    }
  }
</style>
