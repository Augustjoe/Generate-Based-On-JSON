<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useNaiveStore } from '@/stores/naiveUimodules'

const { setComponent } = useNaiveStore()

onMounted(() => {
  import('naive-ui').then((modules) => {
    setComponent(modules)
  })
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
