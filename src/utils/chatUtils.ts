import DOMPurify from 'dompurify';

/**
 * Sanitizes message content to prevent XSS attacks
 * @param message The message content to sanitize
 * @returns Sanitized message content
 */
export const sanitizeMessage = (message: string): string => {
  return DOMPurify.sanitize(message);
};

/**
 * Generates a UUID for message identification
 * @returns A randomly generated UUID string
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Determines the message type ID based on the message type string
 * @param type The message type string
 * @returns The corresponding type ID (1-6)
 */
export const getMessageTypeId = (type: 'text' | 'image' | 'audio' | 'video' | 'file' | 'emoji'): number => {
  switch (type) {
    case 'text': return 1;
    case 'image': return 2;
    case 'audio': return 3;
    case 'video': return 4;
    case 'file': return 5;
    case 'emoji': return 6;
    default: return 1;
  }
};

/**
 * Gets the string message type from a numeric type
 * @param typeId The numeric message type (1-6)
 * @returns The corresponding message type string
 */
export const getMessageTypeFromId = (typeId: number): 'text' | 'image' | 'audio' | 'video' | 'file' | 'emoji' => {
  switch (typeId) {
    case 1: return 'text';
    case 2: return 'image';
    case 3: return 'audio';
    case 4: return 'video';
    case 5: return 'file';
    case 6: return 'emoji';
    default: return 'text';
  }
};

/**
 * Helper function to check if a message is from the current user
 * @param message The message object to check
 * @param currentUserId The current user's ID
 * @returns Boolean indicating if the message is from the current user
 */
export const isMessageFromCurrentUser = (message: any, currentUserId: string): boolean => {
  return message.sendId === currentUserId;
}; 