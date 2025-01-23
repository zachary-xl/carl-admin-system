<script lang="ts" setup name="Iframe">
import { useRoute } from "vue-router";

const route = useRoute();
const link = computed(() => route?.meta?.link);
</script>

<template>
  <div :key="link" class="flex h-full w-full flex-1 flex-col overflow-hidden">
    <iframe :src="link" class="flex h-full w-full flex-1 flex-col border-0" />
  </div>
</template>
