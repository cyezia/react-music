// 封装不同的网络请求

import { axiosInstance } from "./config";

export const getBannerRequest = () => {
  return axiosInstance('/banner');
}

export const getRecommendListRequest = () => {
  return axiosInstance('/personalized');
}
