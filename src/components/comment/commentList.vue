<template>
  <div class="comment-list-main overflowYAuto" ref="commentListRef">
    <div v-show="isLoading" class="loading">加载中...</div>
    <div class="comment-container">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id || `${comment.content}-${Math.random()}`"
        :comment="comment"
        @reply-comment="handleReply"
        @like-comment="handleLike"
        @load-replies="handleLoadReplies"
        @load-del="handleCommentDel"
        @load-report="handleCommentReport"
        @force-update="forceUpdate"
      />
      <div v-if="hasMore" class="load-more" @click="loadMoreComments">加载更多评论</div>
      <div v-else-if="comments.length > 0" class="no-more">没有更多评论了</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, nextTick } from "vue";
import CommentItem from "@/components/comment/commentItem.vue";
import { commentList, commentAdd, commentDel, commentPoint, commentPointId, commentReport } from "@/api/common";
import { Comment } from "@/types/comment";
import { showPopup } from "@/utils/usePopup";

export default defineComponent({
  name: "CommentList",
  components: { CommentItem },
  props: {
    refresh: {
      type: Boolean,
      required: true,
    },
    propoaslId: {
      type: Number,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
  },
  emits: ["someEvent"],
  setup(props, { emit }) {
    const comments = ref<Comment[]>([]);
    const pageNum = ref(1);
    const total = ref(0);
    const hasMore = ref(true);
    const isLoading = ref(false);
    const commentListRef = ref<HTMLElement | null>(null);

    const loadComments = async (reset = false) => {
      if (isLoading.value) {
        console.warn("Already loading, skipping...");
        return;
      }
      isLoading.value = true;

      // 保存滚动位置和容器高度
      let scrollTop = 0;
      let scrollHeight = 0;
      if (!reset && commentListRef.value) {
        scrollTop = commentListRef.value.scrollTop;
        scrollHeight = commentListRef.value.scrollHeight;
        console.log("Before load, scrollTop:", scrollTop, "scrollHeight:", scrollHeight);
      }

      try {
        if (reset) {
          pageNum.value = 1;
          comments.value = [];
        }
        const reqData = {
          businessType: props.type,
          businessId: props.propoaslId,
          pageNum: pageNum.value,
          pageSize: 10,
          parentId: 0,
        };
        console.log("Requesting comments:", reqData);

        const res = await commentList(reqData);
        console.log("Received comments response:", res);

        if (res.code === 200) {
          const newComments = res.data.rows || [];
          total.value = res.data.total || 0;

          if (reset) {
            comments.value = newComments;
          } else {
            comments.value.push(...newComments); // 使用 push 追加，避免全量重绘
          }

          hasMore.value = comments.value.length < total.value;
          if (newComments.length > 0 && hasMore.value) {
            pageNum.value += 1;
          } else {
            console.log("No new comments or all comments loaded");
          }
          emit("someEvent", comments.value);

          // 恢复滚动位置
          if (!reset && commentListRef.value) {
            await nextTick(); // 等待 DOM 更新
            const newScrollHeight = commentListRef.value.scrollHeight;
            commentListRef.value.scrollTop = scrollTop + (newScrollHeight - scrollHeight);
            console.log(
              "After load, restored scrollTop:",
              commentListRef.value.scrollTop,
              "new scrollHeight:",
              newScrollHeight
            );
          }
        } else {
          showPopup("加载评论失败: " + (res.message || "未知错误"), "error", 3000);
        }
      } catch (error) {
        console.error("加载评论失败:", error);
        showPopup("加载评论失败: " + (error.message || "未知错误"), "error", 3000);
      } finally {
        isLoading.value = false;
      }
    };

    const loadMoreComments = () => {
      console.log("Load more clicked, hasMore:", hasMore.value);
      if (hasMore.value && !isLoading.value) {
        loadComments(false);
      }
    };

    const addComment = (newComment: Comment) => {
      if (!newComment || !newComment.content) {
        console.warn("Invalid newComment:", newComment);
        return;
      }
      comments.value.unshift(newComment);
      total.value += 1;
      hasMore.value = comments.value.length < total.value;
      console.log("Comment added locally:", newComment);
    };

    const handleLike = async (commentId: number, isLiked: boolean) => {
      try {
        const api = isLiked ? commentPoint : commentPointId;
        await api({ commentId });
        const comment = comments.value.find((c) => c.id === commentId);
        if (comment) {
          comment.isPoint = isLiked ? 1 : 0;
          comment.pointNum = (comment.pointNum || 0) + (isLiked ? 1 : -1);
        }
      } catch (error) {
        console.error("点赞失败:", error);
      }
    };

    const handleLoadReplies = async (
      parentId: number,
      pageNum: number,
      callback: (replies: Comment[], total: number) => void
    ) => {
      try {
        const res = await commentList({
          businessType: props.type,
          businessId: props.propoaslId,
          pageNum: pageNum || 1,
          pageSize: 10,
          parentId,
        });
        if (res.code === 200) {
          callback(res.data.rows, res.data.total);
        }
      } catch (error) {
        console.error("加载二级评论失败:", error);
      }
    };

    const handleReply = async (newReply: Comment, callback: (success: boolean) => void) => {
      try {
        const res = await commentAdd({
          businessType: props.type,
          businessId: props.propoaslId,
          content: newReply.content,
          imageUrl: newReply.imageUrl || "",
          parentCommentId: newReply.parentCommentId,
          replyCommentId: newReply.replyCommentId,
          replyUserId: newReply.replyUserId,
        });
        if (res.code === 200) {
          callback(true);
        } else {
          callback(false);
          console.error("添加评论失败: 接口返回失败");
        }
      } catch (error) {
        console.error("添加评论失败:", error);
        callback(false);
      }
    };

    const handleCommentDel = async (commentId: number) => {
      try {
        const res = await commentDel({ commentId });
        if (res.code === 200) {
          showPopup("删除成功", "success", 3000);
          await loadComments(true);
        }
      } catch (error) {
        showPopup("删除评论失败", "error", 3000);
        console.error("删除评论失败:", error);
      }
    };

    const handleCommentReport = async (commentId: number) => {
      try {
        const res = await commentReport({ commentId });
        if (res.code === 200) {
          showPopup("举报成功", "success", 3000);
          await loadComments(true);
        }
      } catch (error) {
        showPopup("举报评论失败", "error", 3000);
        console.error("举报评论失败:", error);
      }
    };

    const forceUpdate = () => {
      emit("force-update");
    };

    watch(
      () => props.refresh,
      async (newVal) => {
        if (newVal) {
          try {
            await loadComments(true);
            await nextTick();
          } catch (error) {
            console.error("Refresh failed:", error);
          }
        }
      }
    );

    onMounted(async () => {
      await loadComments(true);
    });

    return {
      comments,
      hasMore,
      isLoading,
      commentListRef,
      loadComments,
      loadMoreComments,
      addComment,
      handleLike,
      handleLoadReplies,
      handleReply,
      handleCommentDel,
      handleCommentReport,
      forceUpdate,
    };
  },
});
</script>

<style scoped>
.comment-list-main {
  position: relative;
  width: 100%;
  height: 100%;
}

.loading {
  text-align: center;
  color: #fff;
  padding: 10px;
}

.comment-container {
  width: 100%;
}

.load-more {
  width: 100%;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1;
  text-align: center;
  cursor: pointer;
  margin: 10px 0 20px 0;
}

.no-more {
  width: 100%;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.68);
  text-align: center;
  padding: 10px 0;
}
</style>