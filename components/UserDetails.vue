<template>
  <div class="d-flex align-center ga-3">
    <div>
      <div class="text-body-2">{{ user?.person?.name || '-' }}</div>
      <div class="text-caption">{{ user?.person?.email || '-' }} • {{ primaryProfile }}</div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { UserMe } from '~/models/User/User'
import { fetchCurrentUser } from '~/services/user/userService'

const user = ref<UserMe | null>(null)

const primaryProfile = computed(() => user.value?.userProfiles?.[0]?.name || '-')

onMounted(async () => {
  try {
    user.value = await fetchCurrentUser()
  } catch (e) {
    user.value = null
  }
})
</script>

<style scoped>
</style>


