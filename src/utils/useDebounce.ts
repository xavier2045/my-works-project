// src/utils/debounce.ts
export default function debounce<T extends (...args: any[]) => any>(func: T, wait = 300): T {
    let timeout: number | null = null;
    return ((...args: Parameters<T>) => {
      if (timeout !== null) clearTimeout(timeout);
      timeout = window.setTimeout(() => func(...args), wait);
    }) as T;
  }
  