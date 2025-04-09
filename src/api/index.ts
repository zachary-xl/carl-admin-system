import request from "@/service";

export const postAuthLoginAPI = (data: any) => {
    return request.post({
      url: "/farm_animal_insurance/api/v1/admin_user/password/login",
      data
    });
}