<script setup lang="ts">
import { RouterView } from 'vue-router'
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
