import request from "@/service";

export const postSalesmanLoginAPI = (data: any) => {
  return request.post<any>({
    url: "/farm_animal_insurance/api/v1/employee/phone/login",
    data
  });
};

export const getSalesmanMainAPI = (id: string) => {
  return request.get<any>({
    url: `/farm_animal_insurance/api/v1/employee/statistics/${id}`,
  });
};

export const getSalesShareLinkAPI = (id: string) => {
  return request.put<any>({
    url: `/farm_animal_insurance/api/v1/livestock_farm/share_link`,
    data: {
      id
    }
  });
};

