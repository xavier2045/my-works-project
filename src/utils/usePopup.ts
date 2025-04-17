// src/utils/usePopup.ts

import { globalShowPopup } from '@/utils/popupPlugin';

export function showPopup(message: string, type: string = 'error', duration: number = 3000) {
  globalShowPopup(message, type, duration);
}
