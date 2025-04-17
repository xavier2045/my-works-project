(function flexible(window: Window, document: Document) {
    const docEl = document.documentElement;
    const dpr = window.devicePixelRatio || 1;
  
    function setRemUnit() {
      const designWidth = 1920; // 设计稿宽度
      const designHeight = 1080; // 设计稿高度
      const rootValue = 192; // postcss-pxtorem 的 rootValue
  
      // 根据宽度和高度分别计算 rem
      const remByWidth = (docEl.clientWidth / designWidth) * rootValue;
      const remByHeight = (docEl.clientHeight / designHeight) * rootValue;
  
      // 选择较小的 rem 值，确保内容不会溢出屏幕
      const rem = Math.min(remByWidth, remByHeight);
      docEl.style.fontSize = rem + 'px';
  
      // 如果屏幕尺寸正好是 1920*1080，确保 font-size 为 192px
      if (docEl.clientWidth === designWidth && docEl.clientHeight === designHeight) {
        docEl.style.fontSize = '192px';
      }
    }
  
    // 初始化
    setRemUnit();
  
    // 监听窗口变化
    window.addEventListener('resize', setRemUnit);
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) setRemUnit();
    });
  
    // 处理 DPR（设备像素比）
    if (dpr >= 2) {
      const fakeBody = document.createElement('body');
      const testElement = document.createElement('div');
      testElement.style.border = '.5px solid transparent';
      fakeBody.appendChild(testElement);
      docEl.appendChild(fakeBody);
      if (testElement.offsetHeight === 1) {
        docEl.classList.add('hairlines');
      }
      docEl.removeChild(fakeBody);
    }
  })(window, document);