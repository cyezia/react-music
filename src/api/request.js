// 封装不同的网络请求

import { axiosInstance } from "./config";

export const getBannerRequest = () => {
  return axiosInstance("/banner");
}

export const getRecommendListRequest = () => {
  return axiosInstance("/personalized");
}

export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`);
}

export const getSingerListRequest = (category, alpha, count) => {
  return axiosInstance.get(`/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`);
}