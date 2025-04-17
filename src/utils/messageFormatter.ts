import { sanitizeMessage } from './chatUtils';

/**
 * Interface defining a chat message
 */
export interface ChatMessage {
  messageId: string;
  type: 'text' | 'image' | 'video' | 'file' | 'audio' | 'emoji' | number;
  sender: string;
  sendId: string;
  receiveId: string;
  content: string;
  createTime: Date | string;
  isRead: boolean;
}

/**
 * Format message text for display, including handling line breaks
 * @param message The message text to format
 * @returns Formatted message with HTML line breaks
 */
export const formatMessageText = (message: string): string => {
  // Convert line breaks to <br> tags for HTML display
  return sanitizeMessage(message).replace(/\n/g, '<br>');
};

/**
 * Render message content based on its type
 * @param message The message object to render
 * @returns HTML representation of the message
 */
export const renderMessageContent = (message: ChatMessage): string => {
  // Handle different message types with appropriate HTML
  const type = typeof message.type === 'number' ? message.type : message.type;
  
  switch (type) {
    case 'image':
    case 2: // Image type ID
      return `<img src="${message.content}" alt="image" style="max-width: 150px; max-height: 150px;" />`;
      
    case 'video':
    case 4: // Video type ID
      return `<video controls src="${message.content}" style="max-width: 150px; max-height: 150px;"></video>`;
      
    case 'file':
    case 5: // File type ID
      return `<a href="${message.content}" download>Download File</a>`;
      
    case 'audio':
    case 3: // Audio type ID
      return `<audio controls src="${message.content}"></audio>`;
      
    case 'emoji':
    case 6: // Emoji type ID
      return message.content;
      
    case 'text':
    case 1: // Text type ID
    default:
      return formatMessageText(message.content);
  }
};

/**
 * Create a properly formatted message object
 * @param type Message type
 * @param content Message content
 * @param senderId Sender ID
 * @param receiverId Receiver ID
 * @param messageId Optional message ID
 * @returns Formatted message object
 */
export const createMessage = (
  type: 'text' | 'image' | 'video' | 'file' | 'audio' | 'emoji',
  content: string,
  senderId: string,
  receiverId: string,
  messageId?: string
): ChatMessage => {
  return {
    messageId: messageId || generateUUID(),
    type,
    sender: senderId,
    sendId: senderId,
    receiveId: receiverId,
    content: sanitizeMessage(content),
    createTime: new Date(),
    isRead: false
  };
};

/**
 * Generate a UUID for messages
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}; 