<template>
  <div class="container absolute">
    <div class="http404 relative">
      <div class="pic-404 relative overflow-hidden">
        <img :src="image404" alt="404" class="w-full" draggable="false" />
        <img :src="image404Cloud" alt="404" class="pic-404__child left" draggable="false" />
        <img :src="image404Cloud" alt="404" class="pic-404__child mid" draggable="false" />
        <img :src="image404Cloud" alt="404" class="pic-404__child right" draggable="false" />
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">404错误!</div>
        <div class="bullshit__headline">"找不到网页！"</div>
        <div class="bullshit__info">
          对不起，您正在寻找的页面不存在。尝试检查URL的错误，然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容。
        </div>
        <router-link class="bullshit__return-home" :to="HOME_URL"> 返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { HOME_URL } from "@/config";

const image404 = computed(() => new URL("@/assets/images/error/404.png", import.meta.url).href);
const image404Cloud = computed(() => new URL("@/assets/images/error/404_cloud.png", import.meta.url).href);
</script>

<style lang="scss" scoped>
.container {
  transform: translate(-50%, -50%);
  top: 40%;
  left: 50%;
}

.http404 {
  width: 1200px;
  padding: 0 50px;
  overflow: hidden;

  .pic-404 {
    float: left;
    width: 600px;

    &__child {
      position: absolute;
      opacity: 0;

      &.left {
        width: 80px;
        top: 17px;
        left: 220px;
        animation: cloudLeft 2s linear forwards 1s;
      }

      &.mid {
        width: 46px;
        top: 10px;
        left: 420px;
        animation: cloudMid 2s linear forwards 1.2s;
      }

      &.right {
        width: 62px;
        top: 100px;
        left: 500px;
        animation: cloudRight 2s linear 1s forwards;
      }
    }
  }

  .bullshit {
    position: relative;
    float: left;
    width: 300px;
    padding: 30px 0;
    overflow: hidden;

    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 20px;
      animation: slideUp 0.5s forwards;
    }

    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #222;
      font-weight: bold;
      opacity: 0;
      margin-bottom: 10px;
      animation: slideUp 0.5s forwards 0.1s;
    }

    &__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation: slideUp 0.5s forwards 0.2s;
    }

    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation: slideUp 0.5s forwards 0.3s;
    }
  }
}

@keyframes cloudLeft {
  0% {
    top: 17px;
    left: 220px;
    opacity: 0;
  }
  20% {
    top: 33px;
    left: 188px;
    opacity: 1;
  }
  80% {
    top: 81px;
    left: 92px;
    opacity: 1;
  }
  100% {
    top: 97px;
    left: 60px;
    opacity: 0;
  }
}

@keyframes cloudMid {
  0% {
    top: 10px;
    left: 420px;
    opacity: 0;
  }
  20% {
    top: 40px;
    left: 360px;
    opacity: 1;
  }
  70% {
    top: 130px;
    left: 180px;
    opacity: 1;
  }
  100% {
    top: 160px;
    left: 120px;
    opacity: 0;
  }
}

@keyframes cloudRight {
  0% {
    top: 100px;
    left: 500px;
    opacity: 0;
  }
  20% {
    top: 120px;
    left: 460px;
    opacity: 1;
  }
  80% {
    top: 180px;
    left: 340px;
    opacity: 1;
  }
  100% {
    top: 200px;
    left: 300px;
    opacity: 0;
  }
}

@keyframes slideUp {
  0% {
    transform: translateY(60px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
