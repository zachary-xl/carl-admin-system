<template>
  <div class="main__container center-center">
    <SvgIcon id="airplane" class="transition-all" name="s-airplane-air" width="666" height="888" />
  </div>
</template>

<script lang="ts" name="Main" setup></script>

<style scoped lang="scss">
#airplane {
  animation: moveVertical 5s linear infinite alternate;
}
@keyframes moveVertical {
  0% {
    transform: translateY(0); /* 起始位置 */
  }
  100% {
    transform: translateY(50px); /* 移动 300px */
  }
}
</style>
