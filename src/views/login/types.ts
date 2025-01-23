export type TLoginForm = {
  username: string;
  password: string;
  captchaCode: string;
  captchaId: string;
};

export type TLoginResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
    expire: number;
  };
};

export type TCaptchaResponse = {
  data: {
    captchaBs64: string;
    captchaId: string;
  };
};
