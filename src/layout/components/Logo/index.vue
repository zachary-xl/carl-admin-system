<template>
  <div class="logo pl-5px flex items-center" v-show="isShow">
    <div
      class="rounded-full"
      :style="{ width: logoSize, height: logoSize }"
      v-if="props.layout !== 'classic' && props.layout !== 'horizontal'"
    >
      <el-image :src="logoUrl" fit="cover" class="h-full w-full rounded-full">
        <template #error>
          <el-icon class="c-[--el-color-primary] h-full w-full rounded-full" :size="34">
            <CircleCloseFilled />
          </el-icon>
        </template>
      </el-image>
    </div>
    <div class="ml-[14px] rounded-full" :style="{ width: logoSize, height: logoSize }" v-if="props.layout === 'classic'">
      <el-image :src="logoUrl" fit="cover" class="h-full w-full rounded-full">
        <template #error>
          <el-icon class="c-[--el-color-primary] h-full w-full rounded-full" :size="34">
            <CircleCloseFilled />
          </el-icon>
        </template>
      </el-image>
    </div>
    <div class="ml-[6px] rounded-full" :style="{ width: logoSize, height: logoSize }" v-if="props.layout === 'horizontal'">
      <el-image :src="logoUrl" fit="cover" class="h-full w-full rounded-full">
        <template #error>
          <el-icon class="c-[--el-color-primary] h-full w-full rounded-full" :size="34">
            <CircleCloseFilled />
          </el-icon>
        </template>
      </el-image>
    </div>
    <el-tooltip
      :content="String(title)"
      :show-after="2000"
      placement="right"
      v-if="props.layout !== 'classic' && props.layout !== 'horizontal'"
    >
      <div
        class="chroma-text tracking-1px ml-[10px] flex-1 truncate font-bold"
        :style="{ 'font-size': titleSize }"
        :class="titleAnimate"
        v-text="title"
        v-show="!props.isCollapse"
      ></div>
    </el-tooltip>
    <el-tooltip :content="String(title)" :show-after="2000" placement="right" v-else>
      <div
        class="chroma-text tracking-1px mx-[10px] w-[155px] select-none truncate font-bold"
        :style="{ 'font-size': titleSize }"
        :class="titleAnimate"
        v-text="title"
        v-show="!props.isCollapse"
      ></div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import settings from "@/settings";
import { useGlobalStore } from "@/store";
import { getAssets, getLanguage } from "@/utils";

const globalStore = useGlobalStore();

// 接收父组件传递的参数
const props = defineProps({
  isCollapse: {
    require: false, // true显示，false隐藏
    type: Boolean
  },
  layout: {
    require: "vertical", // 布局模式 (纵向：vertical | 分栏：columns | 经典：classic | 上左：optimum | 横向：horizontal )
    type: String
  }
});

const titleSize = ref(`${settings.loginTitleSize}px`);
const logoUrl = ref(`${getAssets(settings.logoUrl)}`);
const isShow = ref(settings.logoShow);
const logoSize = ref(settings.logoSize);
const titleAnimate = ref(settings.logoTitleAnimate);

// 标题语言切换
const title = computed(() => getLanguage(globalStore.language, settings.logoTitle, settings.logoEnTitle));
</script>

<style lang="scss" scoped>
.logo {
  height: $aside-header-height;
  line-height: $aside-header-height;
}
</style>
