<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useNaiveStore } from '@/stores/naiveUimodules'

const { setComponent } = useNaiveStore()

onMounted(() => {
  console.log(new Date().getTime())
  import('naive-ui').then((modules) => {
    setComponent(modules)
    console.log(new Date().getTime())
  })
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
