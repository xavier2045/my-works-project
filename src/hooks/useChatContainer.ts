import { ref, computed, onMounted, watch } from 'vue';
import WebSocketService from '@/services/publicWebSocket';
import { aeChatStore } from '@/stores/chat';
import { aeUseStore } from '@/stores/user';
import { createMessage } from '@/utils/messageFormatter';
import { getMessageTypeId } from '@/utils/chatUtils';
import { getItem } from '@/utils/index';
import { friendsList } from '@/api/chat';
import { showPopup } from '@/utils/usePopup';

export function useChatContainer() {
  // State
  const chatStore = aeChatStore();
  const userStore = aeUseStore();
  const userId = ref(userStore.userInfo.uuid || getItem('uuid'));
  const activeChatId = ref<string>('');
  const friends = ref<any[]>([]);
  const wsService = WebSocketService.getInstance();

  // Computed Properties
  const filteredMessages = computed(() => {
    if (!activeChatId.value) return [];
    return chatStore.getMessagesByUser(userId.value, activeChatId.value) || [];
  });

  const unreadCounts = computed(() => {
    const counts: Record<string, number> = {};
    
    // For each friend, get the unread message count
    friends.value.forEach(friend => {
      const count = chatStore.getUnreadMessagesCount(friend.friendId);
      counts[friend.friendId] = count || 0;
    });
    
    return counts;
  });

  const lastMessages = computed(() => {
    const messages: Record<string, string> = {};
    
    // Get the last message for each friend
    friends.value.forEach(friend => {
      const friendMessages = chatStore.getMessagesByUser(userId.value, friend.friendId);
      if (friendMessages && friendMessages.length > 0) {
        const lastMsg = friendMessages[friendMessages.length - 1];
        
        // Get a preview of the message based on its type
        let preview = '';
        switch (lastMsg.type) {
          case 'image':
          case 2:
            preview = '[Image]';
            break;
          case 'video':
          case 4:
            preview = '[Video]';
            break;
          case 'file':
          case 5:
            preview = '[File]';
            break;
          case 'audio':
          case 3:
            preview = '[Voice]';
            break;
          default:
            // Get first 20 chars of text message
            preview = lastMsg.content.substring(0, 20) + 
                      (lastMsg.content.length > 20 ? '...' : '');
            break;
        }
        
        messages[friend.friendId] = preview;
      }
    });
    
    return messages;
  });

  // Methods
  const getActiveFriendName = (): string => {
    const friend = friends.value.find(f => f.friendId === activeChatId.value);
    return friend ? friend.friendNickName : '';
  };

  const handleSelectFriend = (friend: any) => {
    activeChatId.value = friend.friendId;
    chatStore.setActiveChat(friend.friendId);
    chatStore.markMessagesAsRead(friend.friendId);
  };

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'video' | 'file' | 'audio' | 'emoji') => {
    if (!activeChatId.value || !content) return;
    
    // Create message object
    const message = createMessage(type, content, userId.value, activeChatId.value);
    
    // Prepare WebSocket message format that matches the WebSocketMessage interface
    const wsMessage = {
      messageType: 'private',
      operateType: '4', // Chat operation type
      targetId: activeChatId.value,
      payload: {
        messageId: message.messageId,
        type: getMessageTypeId(type),
        content: message.content,
        receiveId: message.receiveId,
        sendId: message.sendId,
        createTime: new Date()
      }
    };
    
    // Send via WebSocket
    wsService.sendMessage(wsMessage);
    
    // Add to local store
    chatStore.addMessage(message);
  };

  // Fetch friends list from API
  const fetchFriendsList = async () => {
    try {
      const response = await friendsList();
      if (response && response.data && response.data.code === 200) {
        friends.value = response.data.data;
        chatStore.friends = response.data.data;
      } else {
        showPopup(response.data?.message || 'Failed to load contacts', 'error', 3000);
      }
    } catch (error) {
      console.error('Failed to fetch friends list:', error);
      showPopup('Failed to load contacts', 'error', 3000);
    }
  };

  // Initialize WebSocket connection
  const initializeWebSocket = () => {
    const websocketUrl = import.meta.env.VITE_WS_URL;
    const uuid = userStore.userInfo.uuid || getItem('uuid');
    const token = userStore.userInfo.token || getItem('token');
    
    if (uuid && token) {
      wsService.connect(websocketUrl, 300000, uuid, token);
      
      // Set up message handler
      wsService.onMessage('message', (message: any) => {
        // Check if message has required fields
        if (message && message.data) {
          chatStore.addMessage(message.data);
        }
      });
    }
  };

  // Lifecycle Hooks
  onMounted(async () => {
    // Load cached messages
    chatStore.loadCachedMessages();
    
    // Fetch friends list
    await fetchFriendsList();
    
    // Initialize WebSocket
    initializeWebSocket();
  });

  // Watch for active chat changes to mark messages as read
  watch(activeChatId, (newId) => {
    if (newId) {
      chatStore.markMessagesAsRead(newId);
    }
  });

  return {
    userId,
    activeChatId,
    friends,
    filteredMessages,
    unreadCounts,
    lastMessages,
    getActiveFriendName,
    handleSelectFriend,
    handleSendMessage
  };
} 