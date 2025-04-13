import request from "@/service";

export const postAuthLoginAPI = (data: any) => {
    return request.post<any>({
      url: "/farm_animal_insurance/api/v1/admin_user/password/login",
      data
    });
}
export const getEmployeeListAPI = (params: any) => {
  return request.get<any>({
    url: "/farm_animal_insurance/api/v1/employee/list",
    params
  });
};

export const postEmployeeCreateAPI = (data: any) => {
  return request.post<any>({
    url: "/farm_animal_insurance/api/v1/employee/create",
    data
  });
};

export const putEmployeeUpdateAPI = (data: any) => {
  return request.put<any>({
    url: "/farm_animal_insurance/api/v1/employee/update",
    data
  });
};

export const getEmployeeDetailAPI = (id: any) => {
  return request.get<any>({
    url: `/farm_animal_insurance/api/v1/employee/detail/${id}`
  });
};

export const getLivestockFarmListAPI = (params: any) => {
  return request.get<any>({
    url: "/farm_animal_insurance/api/v1/livestock_farm/list",
    params
  });
};

export const putLivestockFarmUpdateEmployeeAPI = (data: any) => {
  return request.put<any>({
    url: "/farm_animal_insurance/api/v1/livestock_farm/update_employee",
    data
  });
};

export const postLivestockFarmCreateAPI = (data: any) => {
  return request.post<any>({
    url: "/farm_animal_insurance/api/v1/livestock_farm/create",
    data
  });
};

export const getLivestockFarmDetailAPI = (id: any) => {
  return request.get<any>({
    url: `/farm_animal_insurance/api/v1/livestock_farm/detail/${id}`
  });
};

export const postLivestockFarmUpdateAPI = (data: any) => {
  return request.put<any>({
    url: "/farm_animal_insurance/api/v1/livestock_farm/update",
    data
  });
};

export const getLivestockFarmDwellingHouseListAPI = (params: any) => {
  return request.get<any>({
    url: "/farm_animal_insurance/api/v1/livestock_farm_dwelling_house/list",
    params
  });
};

export const postLivestockFarmDwellingHouseCreateAPI = (data: any) => {
  return request.post<any>({
    url: "/farm_animal_insurance/api/v1/livestock_farm_dwelling_house/create",
    data
  });
};

export const putLivestockFarmDwellingHouseUpdateAPI = (data: any) => {
  return request.put<any>({
    url: "/farm_animal_insurance/api/v1/livestock_farm_dwelling_house/update",
    data
  });
};

export const getLivestockFarmDwellingHouseDetailAPI = (id: any) => {
  return request.get<any>({
    url: `/farm_animal_insurance/api/v1/livestock_farm_dwelling_house/detail/${id}`
  });
};

export const postLivestockFarmDwellingHouseDeleteAPI = (id: any) => {
  return request.delete<any>({
    url: `/farm_animal_insurance/api/v1/livestock_farm_dwelling_house/delete/${id}`
  });
};

export const postFileUploadAPI = (data: any) => {
  return request.post<any>({
    url: "/farm_animal_insurance/api/v1/file/upload",
    data
  });
};

export const getFileDownloadAPI = (id: any) => {
  return request.get<any>({
    url: `/farm_animal_insurance/api/v1/file/download/${id}`,
    responseType: 'blob'
  });
};


