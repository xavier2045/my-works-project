import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

export function useChatUi(chat, mine) {
  const store = useStore();
  const { t } = useI18n();
  
  // UI state refs
  const showPanel = ref(false);
  const showMoreMenu = ref(false);
  const showChatInfo = ref(false);
  const chatMenuRef = ref(null);
  const emojiRef = ref(null);
  const fileBoxRef = ref(null);
  const messageConfirmRef = ref(null);
  
  // Panel display states
  const isShowInfo = computed(() => showPanel.value === 'info');
  const isShowFile = computed(() => showPanel.value === 'file');
  const isShowNotice = computed(() => showPanel.value === 'notice');
  
  // Panel toggle functions
  const togglePanel = (type) => {
    if (showPanel.value === type) {
      showPanel.value = false;
    } else {
      showPanel.value = type;
    }
  };
  
  const toggleMoreMenu = () => {
    showMoreMenu.value = !showMoreMenu.value;
  };
  
  const closeMoreMenu = () => {
    showMoreMenu.value = false;
  };
  
  const toggleChatInfo = () => {
    showChatInfo.value = !showChatInfo.value;
  };
  
  const closeChatInfo = () => {
    showChatInfo.value = false;
  };
  
  // Chat title display
  const chatTitle = computed(() => {
    if (!chat.value?.id) return '';
    
    if (chat.value.type === 'GROUP') {
      return chat.value.name;
    } else {
      // Find chat user info for private chat
      const user = store.state.webSocket.allUser.find(
        (u) => u.id === chat.value.id
      );
      return user?.name || '';
    }
  });
  
  // Chat members
  const chatMembers = computed(() => {
    if (!chat.value?.id) return [];
    
    if (chat.value.type === 'GROUP') {
      return store.state.webSocket.groupUsers[chat.value.id] || [];
    } else {
      const user = store.state.webSocket.allUser.find(
        (u) => u.id === chat.value.id
      );
      return user ? [user] : [];
    }
  });
  
  // Group settings (for group chats)
  const groupSettings = computed(() => {
    if (!chat.value?.id || chat.value.type !== 'GROUP') return null;
    
    const group = store.state.webSocket.groups.find(
      (g) => g.id === chat.value.id
    );
    
    return group || null;
  });
  
  // Check if user is group admin
  const isGroupAdmin = computed(() => {
    if (!chat.value?.id || chat.value.type !== 'GROUP') return false;
    
    const group = store.state.webSocket.groups.find(
      (g) => g.id === chat.value.id
    );
    
    if (!group) return false;
    
    return group.createBy === mine.value.id || 
           (group.managers && group.managers.includes(mine.value.id));
  });
  
  // Get localized chat type label
  const chatTypeLabel = computed(() => {
    if (!chat.value?.type) return '';
    
    return chat.value.type === 'GROUP' 
      ? t('message.groupChat')
      : t('message.privateChat');
  });
  
  return {
    showPanel,
    showMoreMenu,
    showChatInfo,
    chatMenuRef,
    emojiRef,
    fileBoxRef,
    messageConfirmRef,
    isShowInfo,
    isShowFile,
    isShowNotice,
    togglePanel,
    toggleMoreMenu,
    closeMoreMenu,
    toggleChatInfo,
    closeChatInfo,
    chatTitle,
    chatMembers,
    groupSettings,
    isGroupAdmin,
    chatTypeLabel
  };
} 