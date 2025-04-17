export const loadTencentSDK = async () => {
    await loadScript('../src/examples/config.js');
    await loadScript('../src/examples/asrauthentication.js');
    await loadScript('../src/examples/speechrecognizer.js');
    // 等待全局变量初始化
    await new Promise(resolve => {
      const check = () => {
        if (window.Authentication && window.SpeechRecognizer) {
          resolve(true);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  };
  
  const loadScript = (src: string) => {
    return new Promise<void>((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
  
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  };