// useSpeechRecognition.ts
import { ref } from "vue";
export function useSpeechRecognition() {
  const isListening = ref(false);
  const speechText = ref('');
  const error = ref<Error | null>(null);
  let recognition: any;

  try {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  } catch {
    recognition = undefined;
  }

  const recognizing = ref(false);

  if (recognition) {
    recognition.continuous = true; // 持续识别
    recognition.interimResults = true; // 实时返回中间结果

    recognition.onstart = () => {
      recognizing.value = true;
      isListening.value = true;
    };

    recognition.onend = () => {
      recognizing.value = false;
      isListening.value = false;
    };

    recognition.onresult = (event: any) => {
       // 获取所有中间结果并拼接
       const results = event.results;
       let currentTranscript = '';
       for (let i = event.resultIndex; i < results.length; i++) {
         const transcript = results[i][0].transcript;
         currentTranscript += transcript;
       }
       speechText.value = currentTranscript;
    };

    recognition.onerror = (event: any) => {
      error.value = new Error(`语音识别错误: ${event.error}`);
      recognizing.value = false;
      isListening.value = false;
    };
  }

  return {
    isListening,
    speechText,
    error,
    recognizing,
    startListening: () => {
      try {
        if (recognition) {
          recognition.start();
        }
      } catch (err) {
        error.value = err as Error;
        recognizing.value = false;
        isListening.value = false;
      }
    },
    stopListening: () => {
      if (recognition) {
        recognition.stop();
        recognizing.value = false;
        isListening.value = false;
      }
    },
    reset: () => {
      recognizing.value = false;
      isListening.value = false;
      speechText.value = '';
      error.value = null;
    }
  };
}