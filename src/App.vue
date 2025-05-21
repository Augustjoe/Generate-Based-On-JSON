<script setup lang="ts">
import { onMounted } from 'vue'
import {  RouterView } from 'vue-router'
import { useNaiveStore } from '@/stores/naiveUimodules'

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
