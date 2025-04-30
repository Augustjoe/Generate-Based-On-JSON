<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useNaiveStore } from '@/stores/naiveUimodules'
import { useLoadingBar } from 'naive-ui'

const { setComponent } = useNaiveStore()

onMounted(() => {
  import('naive-ui').then((modules) => {
    setComponent(modules)
  })
})
</script>

<template>
  <n-loading-bar-provider>
    <RouterView />
  </n-loading-bar-provider>
</template>
