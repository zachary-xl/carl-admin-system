import request from "@/service";

export const postFarmersDetailAPI = (id: any) => {
  return request.get<any>({
    url: `/farm_animal_insurance/api/v1/common/livestock_farm/detail/${id}`,
  });
};

export const postFarmersUpdateAPI = (data: any) => {
  return request.put<any>({
    url: `/farm_animal_insurance/api/v1/common/livestock_farm/update`,
    data
  });
};

export const postFarmersHouseListAPI = (params: any) => {
  return request.get<any>({
    url: `/farm_animal_insurance/api/v1/common/livestock_farm_dwelling_house/list`,
    params
  });
};

export const postFarmersHouseShareLinkAPI = (data: any) => {
  return request.put<any>({
    url: `/farm_animal_insurance/api/v1/common/livestock_farm/share_link`,
    data
  });
};