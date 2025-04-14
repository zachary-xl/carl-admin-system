<template>
    <el-dialog :title="config.title" v-model="visible" width="600px" append-to-body destroy-on-close center>
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
            <el-form-item label="栋舍名称" prop="name">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="投保方案内容" prop="content">
                <el-input type="textarea" v-model="formData.content" />
            </el-form-item>
            <el-form-item label="最终投保金额" prop="money">
                <el-input-number v-model="formData.money" :min="0" />
            </el-form-item>
            <el-form-item label="存栏数量" prop="num">
                <el-input-number v-model="formData.num" :min="0" />
            </el-form-item>
            <el-form-item label="引种日期" prop="date">
                <el-date-picker v-model="formData.date" type="date" value-format="x" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="formData.status">
                    <el-option :value="0" label="未到达" />
                    <el-option :value="1" label="已投保" />
                </el-select>
            </el-form-item>
            <el-form-item label="计划投保日期" prop="planDate">
                <el-date-picker v-model="formData.planDate" type="date" value-format="x" />
            </el-form-item>
            <el-form-item label="投保到期日期" prop="dueDate">
                <el-date-picker v-model="formData.dueDate" type="date" value-format="x" />
            </el-form-item>
            <el-form-item label="投保成功日期" prop="successDate">
                <el-date-picker v-model="formData.successDate" type="date" value-format="x" />
            </el-form-item>
            <el-form-item label="卫星云图" prop="fileId">
                <el-upload :show-file-list="false" drag list-type="picture-card" :http-request="onCustomUpload"
                    :on-success="onHandleSuccessAvatar" :on-remove="() => formData.fileId = ''" class="h-full w-full">
                    <el-image v-if="formData.fileId" :src="imageUrl" fit="contain" class="h-full w-full" />
                    <el-icon v-else class="avatar-uploader-icon" size="20">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { ElMessage } from 'element-plus'
import type { UploadInstance, UploadRawFile } from 'element-plus'
import { getFileDownloadAPI, getLivestockFarmDwellingHouseDetailAPI, postFileUploadAPI, postLivestockFarmDwellingHouseCreateAPI, putLivestockFarmDwellingHouseUpdateAPI } from '@/api'; // 导入文件上传API

const imageUrl = ref('');
const props = defineProps({
    config: {
        type: Object,
        default: () => ({})
    },
    visible: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:visible', 'submit']);
const visible = ref(props.visible);
const upload = ref<UploadInstance>()
// 使用定义的接口类型初始化 formData
const formData = ref<any>({
    name: '',
    id: undefined,
    livestockFarmId: props.config.livestockFarmId,
    status: 0, // 默认状态为"未到达"
    fileId: null,
    content: '',
    date: null,
    dueDate: null,
    money: 0,
    num: 0,
    planDate: null,
    successDate: null
});
const rules = ref({
    name: [{ required: true, message: '请输入栋舍名称', trigger: 'blur' }],
    content: [{ required: true, message: '请输入投保方案内容', trigger: 'blur' }],
    date: [{ required: true, message: '请选择引种日期', trigger: 'change' }],
    num: [{ required: true, message: '请输入存栏数量', trigger: 'blur' }],
    // 以下字段为非必选
    dueDate: [{ required: false, message: '请选择投保到期日期', trigger: 'change' }],
    money: [{ required: false, message: '请输入最终投保金额', trigger: 'blur' }],
    planDate: [{ required: false, message: '请选择计划投保日期', trigger: 'change' }],
    status: [{ required: false, message: '请选择状态', trigger: 'change' }]
});
const formRef = ref();

const onCustomUpload = async (options): Promise<any> => {
    const { file } = options;
    if (file) {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            ElMessage.error("上传的文件必须是图片");
            return false;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("limitType", "image");
        try {
            const res = await postFileUploadAPI(formData);
            return res.data.id;
        } catch (err) {
            ElMessage.error("上传失败");
            throw err;
        }
    }
    return false;
};
const onHandleSuccessAvatar = (id: string, file) => {
    formData.value.fileId = id;
    imageUrl.value = file.url;
};

const submitForm = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            if (props.config.id) {
                await putLivestockFarmDwellingHouseUpdateAPI(formData.value)
            } else {
                await postLivestockFarmDwellingHouseCreateAPI(formData.value)
            }
            emit('submit');
        }
    });
};

// 监听visible变化，同步更新父组件
watch(() => props.visible, (val) => {
    visible.value = val;
});

watch(() => visible.value, (val) => {
    emit('update:visible', val);
});
const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Blob 转 Base64 失败'));
        reader.readAsDataURL(blob);
    });
};
onMounted(() => {
    if (props.config.id) {
        getLivestockFarmDwellingHouseDetailAPI(props.config.id).then(async res => {
            formData.value = res.data;
            if (res?.data?.fileId) {
                const imgResponse = await getFileDownloadAPI(res.data.fileId);
                imageUrl.value = URL.createObjectURL(imgResponse);
            }
        })
    }
})
</script>

<style scoped>
:deep(.el-upload-dragger) {
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}
.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.el-form-item {
    margin-bottom: 20px;
}

.el-input-number {
    width: 100%;
}
</style>