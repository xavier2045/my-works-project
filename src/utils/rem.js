import useUserStore from "@/store/modules/userStore.js" 
const store = useUserStore()

// 获取是否为手机端
const isMobile = () => {
  const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  return !!flag
}
export function setRem() {
  // 获取页面的宽度
  const deviceWidth = document.documentElement.clientWidth
  // 手机端  （768可自己调整）
  if (deviceWidth<=768){
    if (store) store.setDevice('mobile')  // 我这边基本每个页面都需要用到，所以存到vuex，你们可按照自己实际项目来
    document.documentElement.style.fontSize = deviceWidth / 3.75 + 'px'  //  我这里是按照100px来的，3.75：设计稿宽度（375）/100
  } else {
  // 电脑端
    if (store) store.setDevice('pc')
    document.documentElement.style.fontSize = deviceWidth / 14.4 + 'px'
  }
}
setRem()
