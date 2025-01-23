<template>
  <div class="h-full w-full overflow-hidden bg-[#fff]">
    <div class="mx-auto my-28 w-[800px] max-w-full">
      <el-button style="background-color: #008489; color: #fff" class="my-5 border-0" @click="back"> 返回</el-button>
      <el-row>
        <el-col :span="12">
          <h1 class="text-6xl font-bold text-[#484848]">401错误!</h1>
          <h2 class="my-2 text-sm">您没有访问权限！</h2>
          <h6 class="my-2 text-sm">对不起，您没有访问权限，请不要进行非法操作！您可以返回主页面</h6>
          <router-link to="/">
            <a class="text-base text-[#008489] no-underline hover:underline">回首页</a>
          </router-link>
        </el-col>
        <el-col :span="12">
          <img :src="image" alt="Girl has dropped her ice cream." draggable="false" height="428" width="313" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" name="NotPermission" setup>
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import type { ComputedRef } from "vue";

const route = useRoute();
const router = useRouter();
const image: ComputedRef = computed(() => new URL("@/assets/images/error/401.gif", import.meta.url).href);
const back = () => {
  if (route.query.redirect) {
    router.push({ path: "/" });
  } else {
    router.go(-1);
  }
};
</script>
