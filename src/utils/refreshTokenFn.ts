import { getStorage } from "@/utils/storage";
import axios from "axios";
import { configSource } from "@/config";

export async function refreshTokenFn() {
  // 发送请求到后端，获取新的Access Token
  try {
    return await axios({
      url: configSource.baseServerUrl + "/auth/token/refresh",
      method: "POST",
      data: {
        accessToken: getStorage("accessToken"),
        refreshToken: getStorage("refreshToken")
      }
    });
  } catch (error) {
    console.error("刷新Token失败：", error);
  }
}
