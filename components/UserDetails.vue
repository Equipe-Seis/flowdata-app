<template>
  <div class="d-flex align-center ga-3">
    <div>
      <div class="text-body-2">
        {{ user?.person?.name || '-' }}
      </div>
      <div class="text-caption">
        {{ user?.person?.email || '-' }} • {{ roleLabel }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserInfo } from '../composables/useUserInfo'

const { user, roleLabel } = useUserInfo()
</script>

<style scoped>
</style>

