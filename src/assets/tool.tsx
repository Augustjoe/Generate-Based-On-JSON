// import { useLoadingBar } from 'naive-ui'

// const loadingBar = useLoadingBar()

// export const startLoading = () => {
//   console.log(loadingBar, 'loadingBar')
//   loadingBar.start()
// }

// export const finishLoading = () => {
//   loadingBar.finish()
// }
// 全屏
export function enterFullScreen(element: HTMLElement) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
    // 其他均为兼容其他浏览器
  } else if ((element as any).webkitRequestFullscreen) {
    ;(element as any).webkitRequestFullscreen()
  } else if ((element as any).msRequestFullscreen) {
    ;(element as any).msRequestFullscreen()
  }
}
