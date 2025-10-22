<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
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
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <n-config-provider style="height: 100%;">
            <RouterView />
          </n-config-provider>
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-loading-bar-provider>
</template>
