import { useLoadingBar } from 'naive-ui'

const loadingBar = useLoadingBar()

export const startLoading = () => {
  console.log(loadingBar, 'loadingBar')
  loadingBar.start()
}

export const finishLoading = () => {
  loadingBar.finish()
}
