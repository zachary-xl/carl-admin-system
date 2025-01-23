// 工具类提示信息
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";

type MessageType = "info" | "success" | "error" | "warning";

/** 封装任意提示类型通知，默认info */
export function Notice(message: any, title = "温馨提示", duration = 2000, type: MessageType = "info", parseHtml = false) {
  ElNotification.closeAll();
  ElNotification({
    message,
    title,
    type,
    duration: duration,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml
  });
}

/** 封装提示通知，默认success */
export function NoticeSuccess(message: any, title = "温馨提示", duration = 2000, type: MessageType = "success", parseHtml = false) {
  ElNotification.closeAll();
  ElNotification({
    message,
    type,
    title,
    duration: duration,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml
  });
}

/** 封装提示通知，默认error */
export function NoticeError(message: any, title = "温馨提示", duration = 2000, type: MessageType = "error", parseHtml = false) {
  ElNotification.closeAll();
  ElNotification({
    message,
    type,
    title,
    duration: duration,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml
  });
}

/** 封装提示通知，默认warning */
export function NoticeWarning(message: any, title = "温馨提示", duration = 2000, type: MessageType = "warning", parseHtml = false) {
  ElNotification.closeAll();
  ElNotification({
    message,
    title,
    type,
    duration: duration,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml
  });
}

/** 封装提示通知，默认info */
export function NoticeInfo(message: any, title = "温馨提示", duration = 2000, type: MessageType = "info", parseHtml = false) {
  ElNotification.closeAll();
  ElNotification({
    message,
    title,
    type,
    duration: duration,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml
  });
}

/** 封装提示信息，默认info */
export function Msg(message: any, duration = 2000, type: MessageType = "info", parseHtml = false) {
  ElMessage.closeAll();
  ElMessage({
    message,
    type,
    duration: duration,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml
  });
}

/** 封装提示信息，默认success */
export function MsgSuccess(message: any, duration = 2000, type: MessageType = "success", parseHtml = false) {
  ElMessage.closeAll();
  ElMessage({
    message,
    type,
    duration: duration,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml
  });
}

/** 封装提示信息，默认error */
export function MsgError(message: any, duration = 2000, type: MessageType = "error", parseHtml = false) {
  ElMessage.closeAll();
  ElMessage({
    message,
    type,
    duration: duration,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml
  });
}

/** 封装提示信息，默认warning */
export function MsgWarning(message: any, duration = 2000, type: MessageType = "warning", parseHtml = false) {
  ElMessage.closeAll();
  ElMessage({
    message,
    type,
    duration: duration,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml
  });
}

/** 封装提示信息，默认info */
export function MsgInfo(message: any, duration = 2000, type: MessageType = "info", parseHtml = false) {
  ElMessage.closeAll();
  ElMessage({
    message,
    type,
    duration: duration,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml
  });
}

/** 封装确认信息，默认warning */
export function MsgBox(
  message: any = "您确定进行关闭么？",
  title: string = "温馨提示：",
  confirmButtonText: string = "确定",
  cancelButtonText: string = "取消",
  type: string = "warning"
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(
      message as any,
      title as any,
      {
        confirmButtonText,
        cancelButtonText,
        type,
        draggable: true,
        dangerouslyUseHTMLString: true
      } as any
    )
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject(false);
      });
  });
}

/** 封装确认信息，默认warning  */
export function MsgBoxHtml(
  message: any = `<p style="color: teal">您确定进行关闭么？</p>`,
  title: string = "温馨提示：",
  confirmButtonText: string = "确定",
  cancelButtonText: string = "取消",
  type: string = "warning"
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(
      message as any,
      title as any,
      {
        confirmButtonText,
        cancelButtonText,
        type,
        draggable: true,
        dangerouslyUseHTMLString: true
      } as any
    )
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject(false);
      });
  });
}

/** Prompt 类型的消息框 */
export function MsgBoxPrompt(
  message: any = "请输入需要修改的数据？",
  title: string = "温馨提示：",
  confirmButtonText: string = "确定",
  cancelButtonText: string = "取消",
  type: string = "info",
  inputPattern: string = "",
  inputErrorMessage: string = "无效输入"
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    ElMessageBox.prompt(
      message as any,
      title as any,
      {
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        type,
        inputPattern: inputPattern,
        inputErrorMessage: inputErrorMessage,
        draggable: true
      } as any
    )
      .then((res: any) => {
        // 返回值获取通过[res.value]
        resolve(res);
      })
      .catch(() => {
        reject(false);
      });
  });
}

/** Alert 类型的消息框 */
export function MsgBoxAlert(
  message: any = "请输入需要修改的数据？",
  title: string = "温馨提示：",
  confirmButtonText: string = "确定",
  type: string = "info"
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    ElMessageBox.alert(
      message as any,
      title as any,
      {
        confirmButtonText: confirmButtonText,
        type,
        draggable: true
      } as any
    )
      .then(() => {
        // 返回值获取通过[res.value]
        resolve(true);
      })
      .catch(() => {
        reject(false);
      });
  });
}
