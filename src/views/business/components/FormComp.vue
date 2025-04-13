<template>
  <el-dialog :title="config.title" @close="emits('update:visible', false)" v-model="isVisible" width="600px"
    append-to-body destroy-on-close center>
    <el-form ref="formInstance" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入电话" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="emits('update:visible', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
import { ElMessage, FormInstance } from "element-plus";
import { getEmployeeDetailAPI, postEmployeeCreateAPI, putEmployeeUpdateAPI } from "@/api";

const emits = defineEmits(["update:visible", "confirm"]);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object,
    default: () => ({})
  }
});
const isVisible = ref(props.visible);
const formInstance = ref<FormInstance>();
const formData = reactive<any>({
  name: "",
  password: "",
  phone: ""
});
const rules = ref<any>({
  name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
  phone: [{ required: true, message: "电话不能为空", trigger: "blur" }, { pattern: /^1[3-9][0-9]{9}$/, message: "请输入正确的手机号码", trigger: "blur" }]
})
const submitForm = () => {
  formInstance.value?.validate(async (isValid, fields) => {
    if (isValid) {
      try {
        if (props.config.title === "新增") {
          if (formData.password) {
            await postEmployeeCreateAPI(formData);
          } else {
            ElMessage({
              message: "密码不能为空",
              type: "error",
              plain: true
            });
            return;
          }
        } else if (props.config.title === "编辑" && props.config.id) {
          await putEmployeeUpdateAPI(formData);
        }
        ElMessage({
          message: props.config.title + "成功",
          type: "success",
          plain: true
        });
        emits("confirm");
      } catch (e) {
        ElMessage({
          message: props.config.title + "失败",
          type: "error",
          plain: true
        });
      }
    }
  });
};
onMounted(() => {
  if (props.config.id) {
    getEmployeeDetailAPI(props.config.id).then((res) => {
      formData.id = res.data.id;
      formData.name = res.data.name;
      formData.phone = res.data.phone;
      formData.password = res.data.password;
    })
  }
});
</script>
