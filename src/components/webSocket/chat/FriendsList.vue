<template>
  <div class="friends-list">
    <div class="header">
      <h2>Contacts</h2>
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search contacts..." 
          @input="filterFriends"
        />
      </div>
    </div>
    
    <div class="list-container">
      <div v-if="filteredFriends.length === 0" class="empty-state">
        <p v-if="searchQuery">No contacts found for "{{ searchQuery }}"</p>
        <p v-else>No contacts available</p>
      </div>
      
      <div 
        v-for="friend in filteredFriends" 
        :key="friend.friendId" 
        :class="['friend-item', { 'active': activeFriendId === friend.friendId }]"
        @click="selectFriend(friend)"
      >
        <div class="avatar-container">
          <img :src="friend.friendAvatar" alt="Friend avatar" class="avatar" />
          <div v-if="getUnreadCount(friend.friendId) > 0" class="unread-badge">
            {{ getUnreadCount(friend.friendId) }}
          </div>
        </div>
        
        <div class="friend-info">
          <div class="friend-name">{{ friend.friendNickName }}</div>
          <div class="last-message">{{ getLastMessage(friend.friendId) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';

interface Friend {
  friendId: string;
  friendNickName: string;
  friendAvatar: string;
  status?: number;
}

interface Props {
  friends: Friend[];
  activeFriendId?: string;
  unreadCounts: Record<string, number>;
  lastMessages: Record<string, string>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'select-friend', friend: Friend): void
}>();

const searchQuery = ref('');
const filteredFriends = ref<Friend[]>([...props.friends]);

// Filter friends based on search query
const filterFriends = () => {
  if (!searchQuery.value) {
    filteredFriends.value = [...props.friends];
    return;
  }
  
  const query = searchQuery.value.toLowerCase();
  filteredFriends.value = props.friends.filter(friend => 
    friend.friendNickName.toLowerCase().includes(query)
  );
};

// Select a friend and emit event
const selectFriend = (friend: Friend) => {
  emit('select-friend', friend);
};

// Get unread message count for a friend
const getUnreadCount = (friendId: string): number => {
  return props.unreadCounts[friendId] || 0;
};

// Get last message preview for a friend
const getLastMessage = (friendId: string): string => {
  return props.lastMessages[friendId] || 'No messages yet';
};
</script>

<style lang="scss" scoped>
.friends-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid #e0e0e0;
  background-color: #f7f7f7;
}

.header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  
  h2 {
    margin: 0 0 12px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
  
  .search-box {
    input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 16px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
      
      &:focus {
        border-color: #07c160;
      }
    }
  }
}

.list-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #999;
  font-size: 14px;
  padding: 16px;
  text-align: center;
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  &.active {
    background-color: #e6f7f0;
    
    .friend-name {
      color: #07c160;
      font-weight: 600;
    }
  }
}

.avatar-container {
  position: relative;
  margin-right: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #e6e6e6;
}

.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #f44336;
  color: white;
  font-size: 12px;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  padding: 0 4px;
  font-weight: 600;
}

.friend-info {
  flex: 1;
  overflow: hidden;
}

.friend-name {
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
  font-size: 15px;
}

.last-message {
  color: #999;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}
</style> 