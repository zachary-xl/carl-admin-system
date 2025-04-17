
<template>
    <el-dialog :title="config.title" @close="emits('update:visible', false)" v-model="isVisible" width="600px"
        append-to-body destroy-on-close center>
        <el-form ref="formInstance" :model="formData" :rules="rules" label-width="120px">
            <el-form-item label="养殖户名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入养殖户名称" />
            </el-form-item>
            <el-form-item label="区域协赔员" prop="assistantUserName">
                <el-input v-model="formData.assistantUserName" placeholder="请输入区域协赔员" />
            </el-form-item>
            <el-form-item label="协赔员手机号" prop="assistantUserPhone">
                <el-input v-model="formData.assistantUserPhone" placeholder="请输入区域协赔员手机号码" />
            </el-form-item>
            <el-form-item label="负责人" prop="contactPeople">
                <el-input v-model="formData.contactPeople" placeholder="请输入负责人" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactPhone">
                <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="位置" prop="location">
                <div class="location-input">
                    <div>{{ locationText }}</div>
                    <el-button type="primary" @click="showMapDialog = true">选择位置</el-button>
                </div>
            </el-form-item>
            <el-form-item label="业务员" prop="employeeId">
                <el-select v-model="formData.employeeId" placeholder="请选择业务员" style="width: 100%">
                    <el-option v-for="item in employeeList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="emits('update:visible', false)">取消</el-button>
                <el-button type="primary" @click="submitForm">确定</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- 地图选择对话框 -->
    <el-dialog title="选择位置" v-model="showMapDialog" width="800px" append-to-body destroy-on-close>
        <div class="map-container">
            <div id="map" ref="mapRef"></div>
        </div>
        <div class="selected-location" v-if="formData.latitude && formData.longitude">
            已选位置: 经度 {{ formData.longitude }}, 纬度 {{ formData.latitude }}
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="showMapDialog = false">取消</el-button>
                <el-button type="primary" @click="submitMap">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus';
import { ref, reactive, watch, computed } from 'vue';
import { getEmployeeListAPI, getLivestockFarmDetailAPI, postLivestockFarmCreateAPI, postLivestockFarmUpdateAPI } from '@/api';

// 为 window 对象添加 TMap 属性的类型声明
declare global {
    interface Window {
        TMap: any;
    }
}

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
    id: undefined,
    name: "",
    assistantUserName: "",
    assistantUserPhone: "",
    contactPeople: "",
    contactPhone: "",
    employeeId: null,
    status: null,
    latitude: null,
    longitude: null
});

// 业务员列表
const employeeList = ref<any[]>([]);

// 状态选项
const statusOptions = [
    { value: 0, label: '待邀请' },
    { value: 1, label: '未打开' },
    { value: 2, label: '已打开' },
    { value: 3, label: '已填写' }
];

// 表单验证规则
const rules = reactive({
    name: [{ required: true, message: '请输入养殖户名称', trigger: 'blur' }],
    assistantUserPhone: [
        { required: false, message: '请输入区域协赔员手机号码', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    contactPeople: [{ required: false, message: '请输入负责人', trigger: 'blur' }],
    contactPhone: [
        { required: false, message: '请输入联系电话', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    employeeId: [{ required: false, message: '请选择业务员', trigger: 'change' }],
    status: [{ required: false, message: '请选择状态', trigger: 'change' }],
});

// 地图相关
const showMapDialog = ref(false);
const mapRef = ref<HTMLElement | null>(null);
const mapData = ref<any>({
    latitude: formData.latitude || "",
    longitude: formData.longitude || ""
});
// 计算属性：位置文本
const locationText = computed(() => {
    if (formData.latitude && formData.longitude) {
        return `经度: ${formData.longitude}, 纬度: ${formData.latitude}`;
    }
    return '';
});

// 获取业务员列表
const getEmployeeList = async () => {
    try {
        const res = await getEmployeeListAPI({ noPage: true });
        console.log(res);
        if (res && res.data) {
            employeeList.value = res.data.list.map((item: any) => ({
                ...item,
                id: item.id,
                name: item.name
            }));
        }
    } catch (error) {
        console.error('获取业务员列表失败', error);
    }
};
const submitMap = () => {
    formData.latitude = mapData.value.latitude;
    formData.longitude = mapData.value.longitude;
    showMapDialog.value = false;
}
const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude; // 纬度
               const longitude = position.coords.longitude; // 经度
                mapData.value.latitude = latitude;
                mapData.value.longitude = longitude;
            },
            (error) => {
                console.error('获取位置失败:', error);
            }
        );
    } else {
        console.log('浏览器不支持 Geolocation API');
    }
}
declare global {
    interface Window {
        TMap: any;
        qq: any;
    }
}
var geocoder: any, markersArray: any[] = [];
const initMap = () => {
    console.log(mapData.value, ';--------');
    const qq = (window.qq as any);
    const latitude = formData.latitude || mapData.value.latitude || 29.86032438064803;
    const longitude = formData.longitude || mapData.value.longitude || 121.62466049194336;
    var center = new qq.maps.LatLng(latitude, longitude);
    var map = new qq.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 13
    });
    qq.maps.event.addListener(map, "click", function (event) {
        console.log(event);
        mapData.value.longitude = event.latLng.getLng(); // 经度
        mapData.value.latitude = event.latLng.getLat(); // 纬度

        if (markersArray) {
            for (let i in markersArray) {
                markersArray[i].setMap(null);
            }
        }
        var marker = new qq.maps.Marker({
            map: map,
            position: event.latLng
        });
        markersArray.push(marker);
    });

    geocoder = new qq.maps.Geocoder({
        complete: function (result) {
            console.log(result);
            mapData.value.longitude = result.detail.location.lng;
            mapData.value.latitude = result.detail.location.lat;
            map.setCenter(result.detail.location);
            var marker = new qq.maps.Marker({
                map: map,
                position: result.detail.location
            });
            markersArray.push(marker);
        }
    });
}
const submitForm = async () => {
    if (!formInstance.value) return;
    await formInstance.value.validate(async (valid, fields) => {
        if (valid) {
            if (props.config.id) {
                await postLivestockFarmUpdateAPI(formData)
            } else {
                await postLivestockFarmCreateAPI(formData)
            }
            emits('confirm');
            emits('update:visible', false);
        }
    });
};

// 监听visible变化
watch(() => props.visible, (val) => {
    isVisible.value = val;
    if (val) {
        // 如果是编辑模式，填充表单数据
        if (props.config.id) {
            getLivestockFarmDetailAPI(props.config.id).then(res => {
                if (res && res.data) {
                    formData.id = res.data.id;
                    formData.name = res.data.name;
                    formData.assistantUserName = res.data.assistantUserName;
                    formData.assistantUserPhone = res.data.assistantUserPhone;
                    formData.contactPeople = res.data.contactPeople;
                    formData.contactPhone = res.data.contactPhone;
                    formData.employeeId = res.data.employeeId;
                    formData.status = res.data.status;
                    formData.latitude = res.data.latitude;
                    formData.longitude = res.data.longitude;
                }
            })
        }
        // 获取业务员列表
        getEmployeeList();
    }
}, { immediate: true });

// 修改监听地图对话框的逻辑
watch(() => showMapDialog.value, (val) => {
    if (val) {
        // 等待DOM更新后初始化地图
        setTimeout(() => {
            initMap();
        }, 300); // 增加延迟时间，确保DOM已完全渲染
    }
});
getLocation();
</script>

<style scoped>
.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.location-input {
    display: flex;
    gap: 10px;
}

.map-container {
    display: flex;
    height: 400px;
}

#map {
    flex: 1;
    height: 100%;
}

.map-search {
    width: 250px;
    margin-left: 10px;
}

.search-result {
    margin-top: 10px;
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
}

.result-item {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid #ebeef5;
}

.result-item:hover {
    background-color: #f5f7fa;
}

.selected-location {
    margin-top: 10px;
    padding: 10px;
    background-color: #f0f9eb;
    border-radius: 4px;
    color: #67c23a;
}
</style>
